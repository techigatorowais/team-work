// components/CreateProjectForm.tsx
import React, { useEffect, useState } from "react";
import MultiUserDropdown from "./MultiUserDropdown";
import { IoIosAddCircleOutline } from "react-icons/io";
import Modal from "./Modal";
import AddClientForm from "./AddClientForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import Select from "react-select";
import { maskEmail, maskPhone } from "@/utils/common";
import * as Yup from "yup";
import { toast } from "react-toastify";

const EditProjectForm = ({
  editProjectData,
  projectData,
  isCreating,
  submitError,
  onClose,
}: any) => {
  const user = useSelector((state: any) => state.auth.user);

  const formatDate = (date: any) => {
    const newDate = new Date(date);
    return newDate.toISOString().split("T")[0];
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialValues = {
    project_id: projectData?.project_id,
    team_key: projectData?.team_key,
    brand_key: projectData?.brand_key,
    creatorid: projectData?.creatorid,
    clientid: projectData?.client_id,
    category_id: projectData?.category_id,
    project_status: projectData?.project_status,
    project_title: projectData?.project_title,
    project_description: projectData?.project_description,
    my_teamwork: 1,
    project_date_start: formatDate(projectData?.project_date_start),
    project_date_due: formatDate(projectData?.project_date_due),
    teamMembers: projectData?.teamMembers,
  };

  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState<any>({});
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  const validationSchema = Yup.object({
    project_title: Yup.string()
      .required("Project title is required")
      .min(5, "Title cannot be less then 5 characters")
      .max(220, "Title cannot be more than 220 characters"),

    clientid: Yup.number()
      .required("Client is required")
      .positive("Client ID must be a positive number")
      .integer("Client ID must be an integer"),

    project_date_start: Yup.date()
      .required("Start date is required")
      .typeError("Start date must be a valid date"),

    project_date_due: Yup.date()
      .required("Due date is required")
      .min(
        Yup.ref("project_date_start"),
        "Due date must be after the start date"
      )
      .typeError("Due date must be a valid date"),

    project_description: Yup.string()
      .required("Project description is required")
      .max(220, "Project description cannot be more than 220 characters"),

    teamMembers: Yup.array()
      .min(1, "At least one team member is required")
      .required("Team members are required"),
  });

  const clientList = useSelector((state: RootState) => state.clients.clients);
  const teamMemberList = useSelector(
    (state: RootState) => state.teamMembers.teamMembers
  );
  const selectedTeamMembers = useSelector(
    (state: RootState) => state.teamMembers.selectedTeamMembers
  );

  const dispatch = useDispatch();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let validateSuccess = false;
    if (isCreating) return;

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      validateSuccess = true;
    } catch (err: any) {
      // If validation fails, process the error and update the error state
      if (err.inner) {
        // `err.inner` contains all validation errors
        const errorMessages = err.inner.reduce((acc: any, error: any) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
        setErrors(errorMessages);
        toast.error("Fill required fields*");
        validateSuccess = false;
      }
    }

    if (validateSuccess) {
      await editProjectData(formData);
      toast.success("Project Updated");
      onClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropDownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let currentClient = clientList?.find(
      (client: any) => client.user_id === parseInt(e.target.value)
    );
    setFormData({
      ...formData,
      clientid: currentClient["id"],
      brand_key: currentClient["brand_key"],
    });
  };

  const handleDropDownReactSelect = (e: any) => {
    let currentClient = clientList?.find(
      (client: any) => client.user_id === parseInt(e.value)
    );
    setFormData({
      ...formData,
      clientid: currentClient["user_id"],
      brand_key: currentClient["brand_key"],
    });
  };

  const clientOptions = clientList?.map((client: any) => ({
    value: client.user_id, // Use client id as the value
    label: `${client?.user_id} ${client?.name} ${maskEmail(
      client?.email
    )} ${maskPhone(client?.phone)}`,
  }));

  useEffect(() => {
    setFormData({ ...formData, teamMembers: selectedTeamMembers });
  }, [selectedTeamMembers]);

  useEffect(() => {
    const defaultClient = clientList?.find(
      (client: any) => client.id === formData.clientid
    );

    // Set the default client if found
    if (defaultClient) {
      setSelectedClient(defaultClient.id);
    }
  }, [clientList]);

  return (
    <div>
      {/* Form */}
      <form className="space-y-4">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-ColorDark mb-1">
            Choose a name
          </label>
          <input
            type="text"
            name="project_title"
            value={formData.project_title}
            onChange={handleChange}
            placeholder="Give your project a name"
            className={`w-full border ${
              submitError ? "border-red-500" : "border-gray-300"
            } rounded-md px-3 py-2 text-sm ${
              submitError ? "focus:ring-red-500" : "focus:ring-blue-500"
            } focus:outline-none focus-visible:none`}
            required
          />
          {errors.project_title && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors.project_title}
            </div>
          )}
          {submitError && (
            <p className="text-sm text-red-500 mt-1">Please enter a name</p>
          )}
        </div>

        {/* Add Client */}
        <div className="flex gap-4">
          <div className="flex-grow">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-ColorDark mb-1">
                Add Client
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  (If client does not exist in CRM then)
                </span>
                <IoIosAddCircleOutline
                  className="text-lg cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </div>
            <Select
              options={clientOptions}
              value={
                clientOptions[
                  clientList?.findIndex(
                    (client: any) => client.user_id === formData.clientid
                  ) || 0
                ]
              }
              onChange={(e) => handleDropDownReactSelect(e)}
            />
            {/* <select defaultValue={formData.clientid || 0} onChange={handleDropDownChange} className="bg-transparent w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:none">
              <option value="" disabled>
                Select client
              </option>
              {clientList?.map((item : any , index: any) => (
              <option key={index} value={item["id"]}>
                  {item?.name} {maskEmail(item?.email)} {maskPhone(item?.phone)}
              </option>
              ))}
            </select> */}
          </div>
        </div>
        {errors.clientid && (
          <div style={{ color: "red", fontSize: "12px" }}>
            {errors.clientid}
          </div>
        )}

        {/* Date Range  */}
        <div className="flex gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-ColorDark mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="project_date_start"
              onChange={handleChange}
              value={formData.project_date_start}
              placeholder="dd-mm-yy"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:none"
            />
            {errors.project_date_start && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.project_date_start}
              </div>
            )}
          </div>
          <div className="flex-grow">
            <label className="block text-sm font-medium text-ColorDark mb-1">
              End Date
            </label>
            <input
              type="date"
              name="project_date_due"
              onChange={handleChange}
              value={formData.project_date_due}
              placeholder="dd-mm-yy"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:none"
            />
            {errors.project_date_due && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.project_date_due}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-ColorDark mb-1">
            Add a description
          </label>
          <textarea
            onChange={handleChange}
            name="project_description"
            value={formData.project_description}
            placeholder="Add a description"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:none"
          ></textarea>
          {errors.project_description && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors.project_description}
            </div>
          )}
        </div>

        <div className="addUser">
          <label className="block text-sm font-medium text-ColorDark mb-1">
            Add Team Member
          </label>
          {teamMemberList ? (
            <MultiUserDropdown
              teamUserList={teamMemberList}
              assignMembers={formData.teamMembers}
            />
          ) : null}
          {errors.teamMembers && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors.teamMembers}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between py-6 pt-2">
          <button
            disabled={isCreating}
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isCreating ? "Updating" : "Update"}
          </button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle="Add Client"
        width="max-w-md"
      >
        <AddClientForm />
      </Modal>
    </div>
  );
};

export default EditProjectForm;
