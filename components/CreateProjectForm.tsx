// components/CreateProjectForm.tsx
import React, { useEffect, useRef, useState } from "react";
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

type CreateProjectFormProps = {
  addProject: (newProjectData: any) => void;
  isCreating: boolean;
  submitError: string | null;
};

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  addProject,
  isCreating,
  submitError,
}) => {
  const user = useSelector((state: any) => state.auth.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  const initialValues = {
    team_key: user.team_key || 0,
    brand_key: null,
    creatorid: user.id || 0,
    clientid: null,
    category_id: 6,
    project_status: 1,
    project_title: "",
    project_description: "",
    my_teamwork: 1,
    project_date_start: getCurrentDate(),
    project_date_due: "2024-11-12",
    teamMembers: [],
  };

  const [formData, setFormData] = useState(initialValues);

  const selectRef = useRef(null);

  const clientList = useSelector((state: RootState) => state.clients.clients);
  const teamMemberList = useSelector(
    (state: RootState) => state.teamMembers.teamMembers
  );
  const selectedTeamMembers = useSelector(
    (state: RootState) => state.teamMembers.selectedTeamMembers
  );

  const [errors, setErrors] = useState<any>({});

  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    project_title: Yup.string()
      .required("Project title is required")
      .min(5, "Title cannot be less then 5 characters")
      .max(220, "Title cannot be more than 220 characters"),

    clientid: Yup.number()
      .required("Client is required")
      .positive("Client ID must be a positive number")
      .integer("Client ID must be an integer"),

    // project_date_start: Yup.date()
    //   .required("Start date is required")
    //   .typeError("Start date must be a valid date"),

    // project_date_due: Yup.date()
    //   .required("Due date is required")
    //   .min(
    //     Yup.ref("project_date_start"),
    //     "Due date must be after the start date"
    //   )
    //   .typeError("Due date must be a valid date"),

    project_description: Yup.string()
      .required("Project description is required")
      .max(220, "Project description cannot be more than 220 characters"),

    teamMembers: Yup.array()
      .min(1, "At least one team member is required")
      .required("Team members are required"),
  });

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
      await addProject(formData);
      toast.success("Project Created");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropDownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let currentClient = clientList.find(
      (client: any) => client.id === parseInt(e.target.value)
    );
    setFormData({
      ...formData,
      clientid: currentClient["user_id"],
      brand_key: currentClient["brand_key"],
    });
  };

  const handleDropDownReactSelect = (e: any) => {
    let currentClient = clientList.find(
      (client: any) => client.id === parseInt(e.value)
    );
    setFormData({
      ...formData,
      clientid: currentClient["user_id"],
      brand_key: currentClient["brand_key"],
    });
  };

  const clientOptions = clientList?.map((client: any) => ({
    value: client.id, // Use client id as the value
    label: `${client?.name} ${maskEmail(client?.email)} ${maskPhone(
      client?.phone
    )}`,
  }));

  useEffect(() => {
    setFormData({ ...formData, teamMembers: selectedTeamMembers });
  }, [selectedTeamMembers]);

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
              onChange={(e) => handleDropDownReactSelect(e)}
            />
            {/* <select onChange={handleDropDownChange} className="bg-transparent w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:none">
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
              assignMembers={null}
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
            {isCreating ? "Submitting" : "Submit"}
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

export default CreateProjectForm;
