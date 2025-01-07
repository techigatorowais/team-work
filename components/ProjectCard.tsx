import React, { useState } from "react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { CardProps } from "@/interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { SelectProject } from "@/lib/redux/features/projectSlice";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrTask } from "react-icons/gr";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const badges = ["#FACC15", "#F472B6"];

const ProjectCard: React.FC<CardProps> = ({
  task_count,
  project_id,
  title,
  description,
  tags = [],
  dateRange,
  client_name,
  brandLogo,
  name,
  created_at,
  created_by,
  team_key,
  brand_key,
  teamMembers,
  status,
  editProject,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const maxVisibleTags = 5;

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const calculateInitials = (name: string) => {
    const nameParts = name?.split(" ");
    const firstInitial = nameParts && nameParts[0]?.charAt(0).toUpperCase();
    const lastInitial =
      nameParts && nameParts.length > 1
        ? nameParts[1].charAt(0).toUpperCase()
        : "";
    return firstInitial + lastInitial;
  };

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const navigateToProjectDetails = () => {
    const slug = createSlug(title);
    window.localStorage.setItem(
      "projectsDataSelected",
      JSON.stringify({
        project_id: project_id,
        project_title: title,
        project_description: description,
        created_by: created_by,
        team_key: team_key,
        brand_key: brand_key,
        teamMembers: teamMembers,
      })
    );
    dispatch(
      SelectProject({
        project_id: project_id,
        project_title: title,
        project_description: description,
        created_by: created_by,
        team_key: team_key,
        brand_key: brand_key,
        teamMembers: teamMembers,
      })
    );
    console.log("Navigating to:", `project/${createSlug(title)}`);

    router.push(`project/${createSlug(title)}`);
  };

  console.log(project_id);

  return (
    <div className="relative bg-white rounded-md border w-[290px] flex flex-col overflow-hidden group h-full">
      <div
        className="cursor-pointer relative"
        onClick={navigateToProjectDetails}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-[#f5f5f5]">
          <div>
            <h2
              id={`tooltipName-${project_id}`}
              className="text-[15px] font-semibold text-ColorDark line-clamp-2 cursor-pointer leading-5 mb-1"
            >
              {title}
            </h2>
            <Tooltip
              anchorSelect={`#tooltipName-${project_id}`}
              content={title}
            />
            <p className="text-sm text-ColorDark">{client_name}</p>
            {user?.type !='client'? 
              <div className="flex space-x-2 mt-2">
                <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full">
                  {tags}
                </span>
              </div>
             : null}
            
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow border-t p-4 min-h-48 flex flex-col">
          <p className="text-sm text-ColorDark line-clamp-5">{description}</p>

          {/* Date Range */}
          {dateRange && (
            <p className="text-sm text-gray-500 my-2">
              <span className="font-medium">Date:</span> {dateRange}
            </p>
          )}

          <div className="flex mt-auto justify-between">
            {/* Members */}
            {teamMembers
              ? teamMembers.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0">
                    {teamMembers
                      .slice(0, maxVisibleTags)
                      .map((member: any, index) => (
                        <div key={`${member.id}-${project_id}-${index}`}>
                          <div
                            id={`tooltipName-${member.id}-${project_id}-${index}`}
                            className={`m-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium`}
                            style={{
                              backgroundColor: badges[member.id % badges.length],
                            }}
                          >
                            {calculateInitials(member?.name)}
                          </div>
                          <Tooltip
                            anchorSelect={`#tooltipName-${member.id}-${project_id}-${index}`}
                            content={member?.name}
                          />
                        </div>
                      ))}
                    {/* Button for "+X" */}
                    {teamMembers.length > maxVisibleTags && (
                      <button
                        title={teamMembers
                          .slice(maxVisibleTags)
                          .map((user: any) => user.name)
                          .join(", ")}
                        data-tooltip-id="allUsers"
                        className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700 hover:bg-gray-400"
                        data-tooltip-content={teamMembers
                          .slice(maxVisibleTags)
                          .map((user: any) => user.name)
                          .join(", ")}
                      >
                        +{teamMembers.length - maxVisibleTags}
                      </button>
                    )}
                  </div>
                )
              : null}

            <div
              id={`noTask-${project_id}`}
              className="flex items-center text-sm text-gray-400 gap-1"
            >
              <GrTask />
              <span className="">{task_count}</span>
            </div>
            <Tooltip
              className="text-xs"
              anchorSelect={`#noTask-${project_id}`}
              content={`No of task in this project ${task_count}`}
            />
          </div>
        </div>
      </div>
      {user?.type !='client'?
        <div className="absolute -right-[15%] top-1/2 -translate-y-1/2 bg-white h-16 w-8 flex items-center justify-center flex-col gap-3 shadow-lg border-md transition-all ease-in-out group-hover:-right-0">
          <button
            id={`editProject-${project_id}`}
            onClick={editProject}
            className="p-0 text-lg text-gray-400"
          >
            <BiSolidEdit />
            <Tooltip
              className="text-xs"
              anchorSelect={`#editProject-${project_id}`}
              content="Edit Project"
            />
          </button>
          <button
            id={`deleteProject-${project_id}`}
            className="p-0 text-lg text-gray-400"
          >
            <RiDeleteBin6Line />
            <Tooltip
              className="text-xs"
              anchorSelect={`#deleteProject-${project_id}`}
              content="Delete Project"
            />
          </button>
        </div>
      :null}

    </div>
  );
};

export default ProjectCard;
