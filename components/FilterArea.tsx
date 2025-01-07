"use client";

import React, { useState } from "react";
import Modal from "../components/Modal";
import CreateProjectForm from "../components/CreateProjectForm";
import { IoIosAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

type CreateProjectFormProps = {
  addProject: (newProjectData: any) => void;
  isCreating: boolean;
  submitError: string | null;
};

const FilterArea: React.FC<CreateProjectFormProps> = ({
  addProject,
  isCreating,
  submitError,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  const safeUser = user || { type: "unknown" };
  // console.log("user_type", safeUser.type);

  return (
    <div className="flex justify-end">
      {safeUser.type !== "client" ? (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 pl-2 rounded-full hover:bg-blue-700"
        >
          <IoIosAdd className="mr-1 text-[22px]" /> Add Project
        </button>
      ) : null}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle="Create a Project"
      >
        <CreateProjectForm
          addProject={addProject}
          isCreating={isCreating}
          submitError={submitError}
        />
      </Modal>
    </div>
  );
};

export default FilterArea;
