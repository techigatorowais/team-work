"use client";

import CreateTaskSidebar from "@/components/CreateTaskSidebar";
import EditTaskSidebar from "@/components/EditTaskSidebar";
import useAddProjectTask from "@/lib/customhooks/useAddProjectTask";
import useFetchProjectTask from "@/lib/customhooks/useFetchProjectTask";
import useUpdateProjectTask from "@/lib/customhooks/useUpdateProjectTask";
import { SetTaskStatus } from "@/lib/redux/features/projectSlice";
import { fetchData, fetchDataWithOutParam, postData } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosAdd } from "react-icons/io";
import { AddTaskActivity, FormatDate } from "@/utils/common";
import CustomCheckbox from "@/components/CustomCheckbox";
import BadgeGroup from "@/components/BadgeGroup";
import moment from "moment";
import { BiMessageRounded } from "react-icons/bi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import dynamic from 'next/dynamic';

const priorityColor = [
  "#4ecd97", //low
  "#ffc63c", //medium
  "#e12d42", //high
];

const TaskList = () => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [tags, setTags] = useState([]);
  const selectedProject = useSelector(
    (state) => state.projects.selectedProject
  );
  const user = useSelector((state) => state.auth.user);
  
  const dispatch = useDispatch();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isEditSidebarOpen, setEditSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const {
    projectTasks,
    isLoading,
    error: errorTaskLoad,
    refetch,
  } = useFetchProjectTask(selectedProject?.project_id);

  const { addTask, isCreating, submitError } = useAddProjectTask(refetch);
  const { updateTask, isUpdatingTask, updateTaskError, isSuccess } =
    useUpdateProjectTask(refetch);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  const pendingTasks = projectTasks?.pendingTasks || [];
  const completedTasks = projectTasks?.completedTasks || [];

  const toggleEditSidebar = (taskId, taskStatus) => {
    console.log("clicked");
    setEditSidebarOpen(true);
    const setTask =
      taskStatus == "pending"
        ? pendingTasks.filter((task) => task.id === taskId)
        : completedTasks.filter((task) => task.id === taskId);
    setSelectedTask(setTask[0]);
  };

  const closedToggleEditSideBar = () => {
    setEditSidebarOpen(false);
    refetch();
  };

  const UpdateTaskStatus = async (taskData, isFormData = false) => {
    const newStatus = taskData.status == 1 ? 0 : 1;
    let data = { ...taskData };
    data.status = newStatus;
    setSelectedTask(data);

    try {
      const { data } = await postData("api/tasks/status", {
        taskStatusData: {
          completed: newStatus,
          task_id: taskData.id,
        },
      });

      AddTaskActivity(() => console.log("Task stats logged"), {
        user_id: user?.id,
        task_id: taskData.id,
        project_id: selectedProject?.project_id,
        activity: `${
          taskData.status == 1
            ? "Marked the task as In-Completed"
            : "Marked the task as Completed"
        }`,
        activity_type: 1,
        created_at: FormatDate(Date.now()),
        updated_at: FormatDate(Date.now()),
      });
      dispatch(SetTaskStatus({ taskId: taskData.id, status: newStatus }));
      toast.success(
        taskData.status == 1 ? "Task Mark In-Completed" : "Task Mark Completed"
      );
    } catch (err) {
      console.log("err ---> ", err);
      toast.error("Something went wrong");
    }
  };

  const badges = [
    { initials: "PN", color: "#FACC15" }, // Yellow
    { initials: "MS", color: "#F472B6" }, // Pink
  ];

  console.log("pendingTasks[0]",pendingTasks);

  const [timeAgo, setTimeAgo] = useState("");

  const parseDate = (utcDate) => {
    const date = new Date(utcDate);
  
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      second: date.getUTCSeconds(),
    };
  };
  
  const safeUser = user || { type: "unknown" };

  const CreateTaskSidebarComponent = dynamic(() => import('@/components/CreateTaskSidebar'), {
    ssr: false
  });

  const EditTaskSidebarComponent = dynamic(() => import('@/components/EditTaskSidebar'), {
    ssr: false
  });

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col">
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">
                {selectedProject?.project_title}
              </h2>
              <p className="text-gray-500">
                {projectTasks ? pendingTasks.length : "-"} tasks
              </p>
            </div>
            { safeUser.type !== 'client' ? (
              <button
              className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 pl-2 rounded-full hover:bg-blue-700"
              onClick={() => toggleSidebar()}
            >
              <IoIosAdd className="text-white text-lg" /> Add a task
            </button>
            ) : null }
            <CreateTaskSidebarComponent
              addProjectTask={addTask}
              isCreating={isCreating}
              isOpen={isSidebarOpen}
              onClose={() => toggleSidebar()}
              project_id={selectedProject?.project_id}
              assignMembers={selectedProject?.teamMembers}
            />
          </div>

          {isLoading && !projectTasks ? (
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
          ) : (
            <ul className="">
              <li className="firstLi px-4 flex items-center justify-between bg-white hover:bg-gray-100 h-[48px] border-b gap-4">
                <div className="text-xs font-bold text-ColorDark uppercase task_name">
                  Task Name
                </div>
                <div className="text-xs font-bold text-ColorDark uppercase basis-1/5">
                  Task Created
                </div>
                <div className="text-xs font-bold text-ColorDark uppercase basis-1/5">
                  Assignee
                </div>
                <div className="text-xs font-bold text-ColorDark uppercase basis-1/5">
                  Last Updated 
                </div>
                <div className="text-xs font-bold text-ColorDark uppercase basis-1/5">
                  Due Date
                </div>
                <div className="text-xs font-bold text-ColorDark uppercase basis-1/5">
                  Priority
                </div>
              </li>
              {projectTasks
                ? pendingTasks.map((element, index) => (
                    <li
                      key={`pending-${index}`}
                      className="px-4 flex items-center justify-between bg-white hover:bg-gray-200 cursor-pointer h-[48px] border-b"
                    >
                      <div
                        className="flex items-center gap-4 flex-grow h-full"
                        onClick={() =>
                          toggleEditSidebar(element["id"], "pending")
                        }
                      >
                        <div className="flex items-center task_name">
                          <CustomCheckbox
                            checked={element.status == 0 ? false : true}
                            OnUpdate={UpdateTaskStatus}
                            isCompleted={element.isCompleted}
                            task={element}
                          />
                          <p className="ml-4 text-sm text-ColorDark font-medium line-clamp-1 hover:underline hover:underline-offset-2">
                            {element["title"]}
                          </p>
                          <span className="text-ColorDark flex items-center ml-3 gap-1">
                            <BiMessageRounded className="text-md" />
                            <span className="text-[14px]">
                              {element["commentCount"]}
                            </span>
                          </span>
                        </div>
                        <>
                          <div className="flex items-center gap-4 flex-grow h-full">
                            <div className="text-sm text-gray-500 basis-1/5">
                              {element["createdByName"]}
                            </div>
                            <div className="text-sm text-gray-500 basis-1/5">
                              <BadgeGroup
                                teamMembers={selectedProject?.teamMembers}
                                extraCount={
                                  selectedProject?.teamMembers?.length
                                }
                              />
                            </div>
                            <div className="text-sm text-gray-500 basis-1/5">
                              {moment.utc(element["last_updated"], "YYYY-MM-DD HH:mm:ss").local().fromNow()}
                            </div>
                            <div className="text-sm text-gray-500 basis-1/5">
                              {dayjs(element["due_date"]).format("YYYY-MM-DD")}
                            </div>
                            <div className="text-sm basis-1/5 h-full flex items-center">
                              <span
                                className={`w-[130px] h-[92%] text-white p-2 flex items-center justify-center rounded-[3px] capitalize`}
                                style={{
                                  backgroundColor:
                                    priorityColor[element["proiority"] - 1],
                                }}
                              >
                                {element["priority_name"]}
                              </span>
                            </div>
                          </div>
                        </>
                      </div>
                    </li>
                  ))
                : null}
            </ul>
          )}
          {isEditSidebarOpen ? (
            <EditTaskSidebarComponent
              refreshTask={refetch}
              updateTaskStatus={UpdateTaskStatus}
              isSuccess={isSuccess}
              tags={projectTasks ? projectTasks["tags"] : null}
              updateTask={updateTask}
              assignMembers={projectTasks ? projectTasks.teamMembers : null}
              project_title={selectedProject?.project_title}
              selectedProject={selectedProject}
              taskData={selectedTask}
              isOpen={isEditSidebarOpen}
              onClose={() => closedToggleEditSideBar()}
            />
          ) : null}
          { safeUser.type !== 'client' ? (
              <button
                className="mt-4 text-gray-500"
                onClick={() => toggleSidebar()}
              >
                + Add a task
              </button>
            ) : null }
            
          <div className="mt-8">
            <button
              className="text-gray-500"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "Hide" : "Show"}{" "}
              {projectTasks ? completedTasks?.length : "-"} completed tasks
            </button>
            {showCompleted && (
              <ul className="mt-4">
                <li className="firstLi px-4 flex items-center justify-between bg-white hover:bg-gray-100 h-[48px] border-b gap-4">
                  <div className="text-xs font-bold text-ColorDark uppercase task_name">
                    Task Name
                  </div>
                  <div className="text-xs font-bold text-ColorDark uppercase basis-1/5">
                    Task Created
                  </div>
                  <div className="text-xs font-bold text-ColorDark uppercase basis-1/5">
                    Assignee
                  </div>
                  <div className="text-xs font-bold text-ColorDark uppercase basis-1/5">
                     Created Date 
                  </div>
                  <div className="text-xs font-bold text-ColorDark uppercase basis-1/5">
                    Due Date
                  </div>
                  <div className="text-xs font-bold text-ColorDark uppercase basis-1/5">
                    Priority
                  </div>
                </li>
                {projectTasks
                  ? completedTasks?.map((task, index) => (
                      <li
                        key={`completed-${index}`}
                        className="px-4 flex items-center justify-between bg-white hover:bg-gray-200 cursor-pointer h-[48px] border-b"
                      >
                        <div className="flex items-center gap-4 flex-grow h-full">
                          <div className="flex items-center task_name">
                            <CustomCheckbox
                              checked={task.status == 0 ? false : true}
                              OnUpdate={UpdateTaskStatus}
                              isCompleted={task.isCompleted}
                              task={task}
                            />
                            <p className="ml-4 text-sm text-ColorDark font-medium line-clamp-1 hover:underline hover:underline-offset-2">
                              {task["title"]}
                            </p>
                            <span className="text-ColorDark flex items-center ml-3 gap-1">
                              <BiMessageRounded className="text-md" />
                              <span className="text-[14px]">
                                {task["commentCount"]}
                              </span>
                            </span>
                          </div>
                          <>
                            <div
                              className="flex items-center gap-4 flex-grow h-full"
                              onClick={() =>
                                toggleEditSidebar(task["id"], "completed")
                              }
                            >
                              <div className="text-sm text-gray-500 basis-1/5">
                                {task["createdByName"]}
                              </div>
                              <div className="text-sm text-gray-500 basis-1/5">
                                <BadgeGroup
                                  teamMembers={selectedProject?.teamMembers}
                                  extraCount={
                                    selectedProject?.teamMembers?.length
                                  }
                                />
                              </div>
                              <div className="text-sm text-gray-500 basis-1/5">
                              {moment.utc(task["last_updated"], "YYYY-MM-DD HH:mm:ss").local().fromNow()}
                              </div>
                              <div className="text-sm text-gray-500 basis-1/5">
                                {task["due_date"]}
                              </div>
                              <div className="text-sm basis-1/5 h-full flex items-center">
                                <span
                                  className={`w-[130px] h-[92%] text-white p-2 flex items-center justify-center rounded-[3px] capitalize`}
                                  style={{
                                    backgroundColor:
                                      priorityColor[task["proiority"] - 1],
                                  }}
                                >
                                  {task["priority_name"]}
                                </span>
                              </div>
                            </div>
                          </>
                        </div>
                      </li>
                    ))
                  : null}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
