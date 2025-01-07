"use client"

import React, { useState } from "react";
import Modal from "./Modal";
import CreateProjectForm from "./CreateProjectForm";
import { IoIosAdd } from "react-icons/io";
import EditProjectForm from "./EditProjectForm";

type EditProjectFormProps = {
  editProject: (editProjectData: any) => void;
  isCreating: boolean;
  submitError: string | null;
};

const FilterAreaProjectEdit: React.FC<EditProjectFormProps> = ({ editProject, isCreating, submitError }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-end">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 pl-2 rounded-full hover:bg-blue-700"
      >
        <IoIosAdd className="mr-1 text-[22px]" /> Add Project
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} modalTitle="Create a Project">
        <EditProjectForm projectData = {{test: "hello world"}} />
      </Modal>
    </div>
  );
};

export default FilterAreaProjectEdit;
