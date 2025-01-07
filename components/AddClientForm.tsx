import { AddNewClient } from "@/lib/redux/features/clientSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import md5 from "md5";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Select from "react-select";

const AddClientForm: React.FC = () => {
  // State to manage form input values
  const user = useSelector((state: any) => state.auth.user);

  const initialValues = {
    team_key: user.team_key || 0,
    brand_key: null,
    selectedBrandId: null,
    creatorid: user.id || 0,
    name: "",
    email: "",
    phone: "",
  };

  const [formData, setFormData] = useState(initialValues);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState<any>({});

  const brandOptions = brands?.map((brand: any) => ({
    value: brand.id, // Use client id as the value
    label: `${brand.name}`,
  }));

  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    brand_key: Yup.number().required("Select brand for the client"),
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),

    phone: Yup.string().required("Phone number is required"),
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle input changes
  const handleDropDownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let currentBrand = brands.find(
      (brand: any) => brand.id === parseInt(e.target.value)
    );
    if (currentBrand) {
      setFormData({
        ...formData,
        brand_key: currentBrand["brand_key"],
        selectedBrandId: currentBrand["brand_key"],
      });
    }
  };

  const handleDropDownReactSelect = (e: any) => {
    let currentBrand: any = brands.find(
      (brand: any) => brand.id === parseInt(e.value)
    );
    setFormData({
      ...formData,
      brand_key: currentBrand["brand_key"],
      selectedBrandId: currentBrand["brand_key"],
    });
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    if (isAdding) return;

    e.preventDefault();
    setIsAdding(true);

    let validateSuccess = false;

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
        setIsAdding(false);
      }
    }

    if (validateSuccess) {
      // toast.error("Can't add client right now, team key required.");
      // return false;
      // }

      console.log("user___", user);
      console.log(formData);

      try {
        const { data } = await axios.post("api/clients/add", formData);

        if (data.success == true) {
          toast.success("Client Added Successfully");
        }
        dispatch(AddNewClient({ newClient: data.response }));

        setFormData({
          ...formData,
          team_key: user.team_key || 0,
          brand_key: null,
          creatorid: user.id || 0,
          selectedBrandId: null,
          name: "",
          email: "",
          phone: "",
        });
      } catch (err) {
        toast.success("Can't add client right now", err);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const BrandDropdownData = async () => {
    try {
      const { data } = await axios.get("api/brands/get", {
        params: {
          brand_key: String(user.team_key),
        },
      });
      // console.log("brand_response", data.response);
      setBrands(data.response);
    } catch (err) {
      //   setError('Invalid credentials');
    }
  };

  useEffect(() => {
    BrandDropdownData();
  }, []);

  const generateResetPasswordLink = (email: string) => {
    // Step 1: Encrypt the email using MD5
    const encryptedEmail = md5(email);

    // Step 2: Re-encrypt the email for verification
    const verificationEmail = md5(email);

    // Step 3: Check if the two encryptions match
    if (encryptedEmail === verificationEmail) {
      // Generate the reset password link
      const resetPasswordLink = `http://localhost:3000/resetpassword?email=${email}&code=${encryptedEmail}`;
      return resetPasswordLink;
      // console.log("resetPasswordLink",resetPasswordLink);
    } else {
      throw new Error("Encryption mismatch - Email verification failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 mx-auto">
      {/* Name Field */}
      <div className="mb-3">
        <label
          className="block text-sm font-medium text-ColorDark mb-1"
          htmlFor="name"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name"
          className={`w-full border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 text-sm ${
            error ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:outline-none focus-visible:none`}
        />
        {errors.name && (
          <div style={{ color: "red", fontSize: "12px" }}>{errors.name}</div>
        )}
        {error && (
          <p className="text-sm text-red-500 mt-1">Please enter a name</p>
        )}
      </div>

      {/* Email Field */}
      <div className="mb-3">
        <label
          className="block text-sm font-medium text-ColorDark mb-1"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          className={`w-full border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 text-sm ${
            error ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:outline-none focus-visible:none`}
        />
        {errors.email && (
          <div style={{ color: "red", fontSize: "12px" }}>{errors.email}</div>
        )}
        {error && (
          <p className="text-sm text-red-500 mt-1">Please enter a email</p>
        )}
      </div>

      {/* Phone Field */}
      <div className="mb-3">
        <label
          className="block text-sm font-medium text-ColorDark mb-1"
          htmlFor="phone"
        >
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          className={`w-full border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md px-3 py-2 text-sm ${
            error ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:outline-none focus-visible:none`}
        />
        {errors.phone && (
          <div style={{ color: "red", fontSize: "12px" }}>{errors.phone}</div>
        )}
        {error && (
          <p className="text-sm text-red-500 mt-1">
            Please enter a phone number
          </p>
        )}
      </div>

      {/* Brand Field */}
      <div className="mb-3">
        <label
          className="block text-sm font-medium text-ColorDark mb-1"
          htmlFor="phone"
        >
          Select Brand
        </label>
        {/* <select required onChange={handleDropDownChange} value={formData.selectedBrandId || 0} className="bg-transparent w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:none">
            <option value={0} disabled>
              Select Brand
            </option>
            {brands?.map((item, index) => (
            <option key={index} value={item["id"]}>
                {item["name"]}
            </option>
            )) || null}
          </select> */}
        <Select
          options={brandOptions}
          onChange={(e) => handleDropDownReactSelect(e)}
        />
        {errors.brand_key && (
          <div style={{ color: "red", fontSize: "12px" }}>
            {errors.brand_key}
          </div>
        )}
        {error && (
          <p className="text-sm text-red-500 mt-1">Please select a brand</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="text-[14px] bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          disabled={isAdding}
        >
          {isAdding ? "Adding" : "Add Client"}
        </button>
      </div>
    </form>
  );
};

export default AddClientForm;
