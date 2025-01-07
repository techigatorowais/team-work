"use client";

import React, { Suspense, useEffect, useState } from "react";
import FilterArea from "@/components/FilterArea";
import ProjectCard from "@/components/ProjectCard";
import { Client, User } from "@/interface";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { ClientsFetchSuccess } from "@/lib/redux/features/clientSlice";
import { teamMembersFetchSuccess } from "@/lib/redux/features/teamMemberSlice";
import useFetchProjects from "@/lib/customhooks/useFetchProjects";
import useAddProject from "@/lib/customhooks/useAddProject";
import Image from "next/image";
import Modal from "@/components/Modal";
import EditProjectForm from "@/components/EditProjectForm";
import useUpdateProject from "@/lib/customhooks/useUpdateProject";

// projects

const Project = () => {
  const user = useSelector((state) => state.auth.user);
  // const filteredProjects = useSelector((state) => state.projects?.filteredProjects);

  const { projects, isLoading, error, refetch } = useFetchProjects(
    user?.team_key,
    user?.type,
    user?.id
  );
  const { addProject, isCreating, submitError } = useAddProject(refetch);
  const { updateProject, isUpdating, updateError } = useUpdateProject(refetch);

  const dispatch = useDispatch();

  const [editProjectData, setEditProjectData] = useState(null);
  const [editProjectModal, setEditProjectModal] = useState(false);

  let [searchProjects, setSearchProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const getAllProject = useSelector((state) => state.projects?.projects);

  useEffect(() => {
    setSearchProjects(getAllProject);
  }, [getAllProject]);

  const getFilteredCards = (query, projects) => {
    if (!query) {
      return projects; // Return all projects if the query is empty
    }

    const queryLower = query.toLowerCase(); // Normalize query for case-insensitive comparison

    return projects.filter((project) => {
      const title = project?.project_title?.toLowerCase() || ""; // Safely access project_title
      const client = project?.client_name?.toLowerCase() || ""; // Safely access client_name

      // Check if the query is included in either project_title or client_name
      return title.includes(queryLower) || client.includes(queryLower);
    });
  };

  const filteredItems = getFilteredCards(
    searchTerm,
    searchProjects && searchProjects
  );

  useEffect(() => {
    // dispatch();
    // dispatch(SetFilteredProjects({filteredProjects: filteredItems? filteredItems : []}));
    setFilteredProjects(filteredItems);
  }, [filteredItems]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter the projects based on the
    // console.log("value",value);

    // const filtered = searchProjects?.filter((project: any) =>
    //     project?.project_title.toLowerCase() == value
    // );
    // console.log("filtered",filtered);
  };

  const ProjectDropdownData = async () => {
    try {
      const { data } = await axios.post("api/projects/dropdowns/get", {
        team_key: user?.team_key,
      });
      const clientData = data.response.clients;
      const teamMemberData = data.response.teamMembers;

      // console.log("response_count_", data.response);

      window.localStorage.setItem(
        "teamMemberData",
        JSON.stringify(teamMemberData)
      );
      dispatch(ClientsFetchSuccess({ clients: clientData }));
      dispatch(teamMembersFetchSuccess({ teamMembers: teamMemberData }));
    } catch (err) {
      //   setError('Invalid credentials');
      console.log("ProjectDropdownData", err);
    }
  };

  const EditProjectDetails = (projectData) => {
    setEditProjectData(projectData);
    setEditProjectModal(true);
  };

  const RemoveEditProjectDetails = () => {
    setEditProjectData(null);
    setEditProjectModal(false);
  };

  useEffect(() => {
    ProjectDropdownData();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between pb-5">
        {/* SEARCH BAR */}
        <div className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-4 lg:w-[500px] bg-[#F7F8FA] shadow-inner">
          <Image src="/search.png" alt="" width={18} height={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-[300px] px-2 py-3 bg-transparent outline-none flex-grow text-[16px]"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
        <FilterArea
          addProject={addProject}
          isCreating={isCreating}
          submitError={submitError}
        />
        <Modal
          isOpen={editProjectModal}
          onClose={() => RemoveEditProjectDetails()}
          modalTitle="Edit Project"
        >
          <EditProjectForm
            editProjectData={updateProject}
            isCreating={isUpdating}
            submitError={updateError}
            projectData={editProjectData}
            onClose={() => setEditProjectModal(false)}
          />
        </Modal>
      </div>
      {/* <div className="flex flex-wrap gap-5">
        
        {
          (projects && Array.isArray(projects) && filteredProjects?.length == 0) ? projects?.map((itemCard) => {
            return (<>
            <div className='flex-col'>
              <ProjectCard
                key={itemCard?.project_id}  
                project_id = {itemCard.project_id}
                title={itemCard.project_title}
                description={itemCard.project_description}
                dateRange={itemCard.project_date_start ? `${dayjs(itemCard.project_date_start).format('YYYY-MM-DD')} - ${dayjs(itemCard.project_date_due).format('YYYY-MM-DD')}` : null}
                tags={["Creative"]}
                client_name={itemCard.client_name}
                brandLogo={itemCard.logo}
                name={itemCard.name}
                created_at={itemCard.created_at}
                created_by={itemCard.created_by}
                team_key={itemCard.team_key}
                brand_key={itemCard.brand_key}
                teamMembers={itemCard["teamMembers"]}
                editProject = {() => EditProjectDetails(itemCard)}
              />
            </div>
            </>)
            }) : Array.isArray(filteredProjects)? filteredProjects?.map((itemCard) => (
            <>
            <div className='flex-col'>
              <ProjectCard
                key={itemCard.project_id}  
                project_id = {itemCard.project_id}
                title={itemCard.project_title}
                description={itemCard.project_description}
                dateRange={itemCard.project_date_start ? `${dayjs(itemCard.project_date_start).format('YYYY-MM-DD')} - ${dayjs(itemCard.project_date_due).format('YYYY-MM-DD')}` : null}
                tags={["Creative"]}
                members={["AZ", "FD", "PM", "MS"]}
                client_name={itemCard.client_name}
                brandLogo={itemCard.logo}
                name={itemCard.name}
                created_at={itemCard.created_at}
                created_by={itemCard.created_by}
                team_key={itemCard.team_key}
                brand_key={itemCard.brand_key}
                teamMembers={itemCard["teamMembers"]}
                editProject = {() => EditProjectDetails(itemCard)}
              />
            </div>
            </>
          ))
        :null}
      </div> */}

      <div className="flex flex-wrap gap-5">
        {projects && Array.isArray(projects) && filteredProjects?.length === 0
          ? projects.map((itemCard, index) => (
              <div key={index} className="flex-col">
                <ProjectCard
                  project_id={itemCard.project_id}
                  title={itemCard.project_title}
                  description={itemCard.project_description}
                  dateRange={
                    itemCard.project_date_start
                      ? `${dayjs(itemCard.project_date_start).format(
                          "YYYY-MM-DD"
                        )} - ${dayjs(itemCard.project_date_due).format(
                          "YYYY-MM-DD"
                        )}`
                      : null
                  }
                  // tags={["Creative"]}
                  tags={itemCard.brand_key}
                  client_name={itemCard.client_name}
                  brandLogo={itemCard.logo}
                  name={itemCard.name}
                  created_at={itemCard.created_at}
                  created_by={itemCard.created_by}
                  team_key={itemCard.team_key}
                  brand_key={itemCard.brand_key}
                  teamMembers={itemCard["teamMembers"]}
                  editProject={() => EditProjectDetails(itemCard)}
                />
              </div>
            ))
          : Array.isArray(filteredProjects)
          ? filteredProjects.map((itemCard) => (
              <div key={itemCard.project_id} className="flex-col">
                <ProjectCard
                  task_count={itemCard.task_count}
                  project_id={itemCard.project_id}
                  title={itemCard.project_title}
                  description={itemCard.project_description}
                  dateRange={
                    itemCard.project_date_start
                      ? `${dayjs(itemCard.project_date_start).format(
                          "YYYY-MM-DD"
                        )} - ${dayjs(itemCard.project_date_due).format(
                          "YYYY-MM-DD"
                        )}`
                      : null
                  }
                  // tags={["Creative"]}
                  tags={itemCard.name}
                  members={["AZ", "FD", "PM", "MS"]}
                  client_name={itemCard.client_name}
                  brandLogo={itemCard.logo}
                  name={itemCard.name}
                  created_at={itemCard.created_at}
                  created_by={itemCard.created_by}
                  team_key={itemCard.team_key}
                  brand_key={itemCard.brand_key}
                  teamMembers={itemCard["teamMembers"]}
                  editProject={() => EditProjectDetails(itemCard)}
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

const renderProjectCards = (projects, filteredProjects, EditProjectDetails) => {
  // Helper function to render individual project cards
  const renderCard = (itemCard) => (
    <div className="flex-col" key={itemCard.project_id}>
      <ProjectCard
        key={itemCard.project_id}
        project_id={itemCard.project_id}
        title={itemCard.project_title}
        description={itemCard.project_description}
        dateRange={
          itemCard.project_date_start
            ? `${dayjs(itemCard.project_date_start).format(
                "YYYY-MM-DD"
              )} - ${dayjs(itemCard.project_date_due).format("YYYY-MM-DD")}`
            : null
        }
        // tags={["Creative"]}
        tags={itemCard.name}
        client_name={itemCard.client_name}
        brandLogo={itemCard.logo}
        name={itemCard.name}
        created_at={itemCard.created_at}
        created_by={itemCard.created_by}
        team_key={itemCard.team_key}
        brand_key={itemCard.brand_key}
        teamMembers={itemCard.teamMembers}
        editProject={() => EditProjectDetails(itemCard)}
      />
    </div>
  );

  if (projects && Array.isArray(projects) && filteredProjects?.length === 0) {
    return projects.map(renderCard);
  }

  if (Array.isArray(filteredProjects)) {
    return filteredProjects.map(renderCard);
  }

  return null;
};

export default Project;
