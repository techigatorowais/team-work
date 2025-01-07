"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import dynamic from "next/dynamic";
import BadgeGroup from "@/components/BadgeGroup";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import MultiUserDropdown from "./MultiUserDropdown";
import { useDispatch, useSelector } from "react-redux";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TagDropdown from "./TagDropdown";
import StageDropdown from "./StageDropdown";
import ProgressBar from "./Progressbar";
import TabsAndComments from "./TabComments";
import dayjs from "dayjs";
import axios from "axios";
import { fetchDataWithOutParam, postData } from "@/utils/api";
import {
  SetTaskStatus,
  UpdateSelectedProjectMembers,
} from "@/lib/redux/features/projectSlice";
import useFetchTaskActivity from "@/lib/customhooks/useFetchTaskActivity";
import useFetchTaskComments from "@/lib/customhooks/useFetchTaskComments";
import moment from "moment";
import { AddTaskActivity, FormatDate } from "@/utils/common";
import CustomCheckbox from "./CustomCheckbox";
import { toast } from "react-toastify";
import * as Yup from "yup";

const EditTaskSidebar = ({
  refreshTask,
  updateTaskStatus,
  tags,
  isSuccess,
  updateTask,
  isUpdatingTask,
  project_title,
  taskData,
  isOpen,
  onClose,
  assignMembers,
  selectedProject,
}: {
  refreshTask: any;
  updateTaskStatus: any;
  tags: any;
  isSuccess: any;
  updateTask: any;
  isUpdatingTask: any;
  project_title: any;
  taskData: any;
  isOpen: any;
  onClose: any;
  assignMembers: any | null;
  selectedProject: any | null;
}) => {
  // if (!isOpen) return null;
  const [isEditable, setIsEditable] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const descriptionRef = useRef<HTMLHeadingElement>(null);

  // console.log('selected Task---> ',taskData);

  const [content, setContent] = useState("Edit me!");
  const headerRef = useRef<any>(null);
  const dropdownRef = useRef<any>(null);

  const dispatch = useDispatch();

  const teamMemberList = useSelector(
    (state: any) => state.teamMembers.teamMembers
  );
  const selectedTeamMembers = useSelector(
    (state: any) => state.teamMembers.selectedTeamMembers
  );
  const user = useSelector((state: any) => state.auth.user);

  const [assign_to, setAssign_to] = useState([]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [taskTags, setTaskTags] = useState([]);

  const [errors, setErrors] = useState<any>({});

  const { taskActivities, isActivityLoading, refetchTaskActivity } =
    useFetchTaskActivity(taskData?.id);
  const {
    taskComments,
    isCommentsLoading,
    refetchTaskComments,
    removeComment,
  } = useFetchTaskComments(taskData?.id);

  // const handleDateChange = (dates: [Date | null, Date | null]) => {
  //   const [start, end] = dates;
  //   setStartDate(start);
  //   setEndDate(end);
  // };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [formData, setFormData] = useState(() => {
    // const currentDate = new Date(); // Current date
    // const dueDate = new Date(); // Clone current date
    // dueDate.setDate(currentDate.getDate() + 7); // Add 7 days for due date

    return {
      task_id: taskData?.id,
      project_id: taskData?.project_id,
      card_id: 1,
      created_by: taskData?.created_by,
      title: taskData?.title,
      description: taskData?.description,
      proiority: taskData?.proiority,
      tags: taskData?.tags,
      progress: taskData?.progress,
      task_stage: taskData?.task_stage,
      teamMembers: assignMembers,
      task_date_due: taskData?.due_date || new Date(),
      status: taskData?.status,
      updated_by: user.id || null,
    };
  });

  const [oldSelectedDate, setOldSelectedDate] = useState(taskData?.due_date);

  const handleDateChange = async (date: any) => {
    setFormData({
      ...formData,
      task_date_due: FormatDate(date),
    });
    try {
      // setFormData({
      //   ...formData,
      //   description: commentContent
      // })
      // console.log("hello_world_3", formData);
      formData['task_date_due'] = FormatDate(date)
      const response = await postData("/api/tasks/update", formData);

      if (response["data"]["success"] == true) {
        AddTaskActivity(refetchTaskActivity, {
          user_id: user?.id,
          task_id: taskData?.id,
          project_id: taskData?.project_id,
          activity: `Updated Due Date`,
          activity_type: 1,
        });
        toast.success("Updated Due Date Successfully");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const HandleCalanderOpen = async () => {
    setCalendarOpen(!calendarOpen);

    if (oldSelectedDate == null) return;

    if (formData.task_date_due == oldSelectedDate) return;

    try {
      setOldSelectedDate(formData.task_date_due);

      const response = await postData("/api/tasks/update", formData);
      console.log("hello_world_2");
      if (response["data"]["success"] == true) {
        AddTaskActivity(refetchTaskActivity, {
          user_id: user?.id,
          task_id: taskData?.id,
          project_id: taskData?.project_id,
          activity: `Updated task due date ${dayjs(
            formData.task_date_due
          ).format("YYYY-MM-DD")}`,
          activity_type: 1,
        });
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const validationSchema = Yup.object({
    task_id: Yup.number().required("Task updation id require."),

    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(220, "Title cannot exceed 220 characters"),

    description: Yup.string()
      .nullable()
      .max(500, "Description cannot exceed 500 characters"),

    tags: Yup.array().of(Yup.string()).nullable().notRequired(),

    progress: Yup.number()
      .notRequired()
      .min(0, "Progress cannot be less than 0")
      .max(100, "Progress cannot be more than 100"),

    task_stage: Yup.number().notRequired(),

    teamMembers: Yup.array()
      .min(1, "At least one team member is required")
      .required("Team members are required"),

    task_date_due: Yup.date()
      .required("Due date is required")
      .typeError("Due date must be a valid date")
      .min(Yup.ref("task_date_start"), "Due date must be after the start date"),
  });

  const OnTaskStatusChange = async () => {
    setFormData((formData: any) => ({
      ...formData,
      status: formData.status === 1 ? 0 : 1,
    }));
    await updateTaskStatus(taskData);
    refetchTaskActivity();
    refreshTask();
  };
  const handleInput = () => {
    setContent(headerRef?.current?.innerText);
    console.log("Editing in progress");
  };

  const LoadTaskTags = async () => {
    try {
      const { data } = await postData("api/tasks/tags/tasktags", {
        task_id: taskData?.id,
      });

      console.log("load tags---> ", data);
      setTaskTags(data["response"]);
    } catch (error) {
      console.log("err");
    }
  };

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    const commentContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    if (commentContent.trim() === "<p></p>") return; // Prevent saving empty comments
    setFormData({
      ...formData,
      description: commentContent,
    });
  };

  const UpdateTaskAssignee = ({ name, message }: any) => {
    // console.log("UpdateTaskAssignee");
    // UpdateTaskDescription();
    AddTaskActivity(refetchTaskActivity, {
      user_id: user?.id,
      task_id: taskData?.id,
      project_id: taskData?.project_id,
      activity: `${message} assignee ${name}`,
      activity_type: 10,
    });
  };

  const UpdatePriority = async (priority = 1) => {
    console.log("UpdatePriority__", priority);

    try {
      //
      formData.proiority = priority;
      console.log("hello_world_6", formData);
      const response = await postData("/api/tasks/update", formData);

      if (response["data"]["success"] == true) {
        // AddTaskActivity(refetchTaskActivity, {
        //   user_id: user?.id,
        //   task_id: taskData?.id,
        //   project_id: taskData?.project_id,
        //   activity: `Updated task description`,
        //   activity_type: 1,
        // });
      }
    } catch (err) {
      toast.error("Something went wrong", err);
    }
  };
  const UpdateTaskDescription = async () => {
    // const commentContent = draftToHtml(
    //   convertToRaw(editorState.getCurrentContent())
    // );

    // if (commentContent.trim() === "<p></p>") return;

    // if(formData.description == commentContent) return;
    try {
      // setFormData({
      //   ...formData,
      //   description: commentContent
      // })
      console.log("hello_world_3", formData);

      const response = await postData("/api/tasks/update", formData);

      if (response["data"]["success"] == true) {
        AddTaskActivity(refetchTaskActivity, {
          user_id: user?.id,
          task_id: taskData?.id,
          project_id: taskData?.project_id,
          activity: `Updated task description`,
          activity_type: 1,
        });
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (formData.description == null) return;
    // Convert the HTML content to ContentState
    const { contentBlocks, entityMap } = convertFromHTML(formData?.description);

    // Create ContentState from the blocks and entity map
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );

    // Create the editor state from the ContentState
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
  }, []);

  const handleDropDownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, proiority: parseInt(e.target.value) });
    UpdatePriority(parseInt(e.target.value));
  };

  const UpdateTaskStatus = () => {};

  const handleEditClick = () => {
    setIsEditable(true); // Make heading editable
    setTimeout(() => {
      const element = headingRef.current;
      if (element) {
        element.focus(); // Focus the heading
        // Move cursor to the end of the text
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.selectNodeContents(element);
          range.collapse(false); // Collapse range to end
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }, 0);
  };

  const handleBlur = async () => {
    setIsEditable(false); // Disable editing on blur

    if (headingRef.current) {
      if (headingRef.current.innerText.length < 4) {
        headingRef.current.innerText = formData.title;
        toast.error("Title can't be less than 4 characters");
        return;
      }
    }

    try {
      const response = await postData("/api/tasks/title", {
        id: taskData?.id,
        title: headingRef?.current?.innerText,
      });

      setFormData({
        ...formData,
        title: headingRef?.current?.innerText,
      });

      AddTaskActivity(refetchTaskActivity, {
        user_id: user?.id,
        task_id: taskData?.id,
        project_id: taskData?.project_id,
        activity: `Updated task title ${headingRef?.current?.innerText}`,
        activity_type: 1,
      });
      refreshTask();
    } catch (err) {}

    // formData.title
  };

  const UpdateTaskProgressBar = async (newProgress: number) => {
    try {
      if (newProgress == formData.progress) return;
      await setFormData({
        ...formData,
        progress: newProgress,
      });
      // formData.progress = newProgress;
      formData['progress'] = newProgress
      // console.log('progress',formData );
      const response = await postData("/api/tasks/update", formData);

      console.log("hello_world_2");
      if (response["data"]["success"] == true) {
        AddTaskActivity(refetchTaskActivity, {
          user_id: user?.id,
          task_id: taskData?.id,
          project_id: taskData?.project_id,
          activity: `Updated task progress bar `,
          activity_type: 1,
        });
        toast.success("Updated Task Progress Bar Successfully");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }

    // formData.title
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (selectedTeamMembers.length == 0) {
      alert("Atleast one member must be in project");
      return;
    }

    try {
      await updateTask(formData);
      dispatch(
        UpdateSelectedProjectMembers({
          teamMembers: selectedTeamMembers,
        })
      );
    } catch (error) {}
  };

  //   const TaskActivities = async () => {
  //     try {
  //       const { data } = await fetchDataWithOutParam(`api/tasks/activity/${taskData?.id}`);
  //       setTaskActivities(data["response"]);

  //     } catch (err) {
  //       //   setError('Invalid credentials');
  //     }
  //   }

  useEffect(() => {
    setFormData({ ...formData, teamMembers: selectedTeamMembers });
  }, [selectedTeamMembers]);

  //   useEffect(() => {
  //     TaskActivities()
  //   },[])

  // Close Calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCalendarOpen(calendarOpen);
        // console.log("helloo")
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      console.log("task updated, popup closing...");
      onClose();
    } else {
      console.log("popup not closed as it is not sucess");
    }
  }, [isSuccess]);

  useEffect(() => {
    LoadTaskTags();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-end z-50">
      <div className="xl:w-1/2 w-1/3 bg-white h-full shadow-lg overflow-y-auto pt-6">
        <div className="flex items-center justify-between px-6">
          <div className="breadcrumb flex mb-4">
            <span className="text-sm text-gray-600">
              {project_title ? project_title : "Project Name"}
            </span>
            <span className="text-sm text-gray-400 mx-1">/</span>
            <span className="text-sm text-gray-400">
              {formData ? formData.title : "Task Name"}
            </span>
          </div>
          <button onClick={onClose} className="text-xl font-semibold mb-4">
            <IoClose />
          </button>
        </div>
        <div className="titleTask flex items-center group px-6">
          {/* <input
            type="checkbox"
            className="form-checkbox"
            checked = {formData.status}
            onClick={() => OnTaskStatusChange()}
          /> */}
          <CustomCheckbox
            checked={formData.status == 0 ? false : true}
            OnUpdate={UpdateTaskStatus}
            isCompleted={formData.status == 0 ? false : true}
            task={formData}
            onClick={() => OnTaskStatusChange()}
          />
          <div className="flex flex-grow items-center">
            <h4
              ref={headingRef}
              className={`text-lg font-bold ml-3 px-2 ${
                isEditable ? "bg-gray-100" : ""
              }`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={handleBlur}
            >
              {formData.title}
            </h4>
            <CiEdit
              onClick={handleEditClick}
              className="cursor-pointer ml-5 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              values={formData.description}
              name="title"
              onInput={handleInput}
              // The icon will show when parent is hovered and hide when not
            />
          </div>
        </div>
        <div className="desc my-5 px-6">
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={onEditorStateChange}
            onBlur={() => UpdateTaskDescription()}
          />
        </div>
        <div className="flex justify-between gap-4 px-6">
          <div className="assignTo w-1/3 flex-grow">
            <label
              htmlFor="assign-to"
              className="block text-sm font-semibold text-ColorDark mb-3"
            >
              Assign To
            </label>
            <div className="flex items-center">
                <BadgeGroup
                  teamMembers={selectedProject?.teamMembers}
                  extraCount={
                    selectedProject?.teamMembers?.length
                  }
                />
              {/* <MultiUserDropdown
                teamUserList={teamMemberList}
                assignMembers={assignMembers}
                onChangeAssignee={UpdateTaskAssignee}
              /> */}
              {/* {/ <span className='ml-3 text-sm text-gray-400'>Anyone</span> /} */}
            </div>
          </div>
          <div className="dateArea w-1/3 flex-grow relative">
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-ColorDark mb-3"
            >
              Due Date
            </label>
            {/* <div>
              <div
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="cursor-pointer text-sm text-gray-400"
              >
                {formData?.task_date_start && formData?.task_date_due
                  ? `${dayjs(formData?.task_date_start).format(
                      "YYYY-MM-DD"
                    )} - ${dayjs(formData?.task_date_due).format("YYYY-MM-DD")}`
                  : "Tue, Dec 3 - Wed, Dec 11"}
              </div>

              {calendarOpen && (
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={new Date(formData?.task_date_start)}
                  endDate={new Date(formData?.task_date_due)}
                  selectsRange
                  inline
                  dateFormat="MMM dd, yyyy"
                />
              )}
            </div> */}
            <div ref={dropdownRef}>
              <div
                onClick={() => HandleCalanderOpen()}
                className="cursor-pointer text-sm text-gray-400"
                
              >
                {formData.task_date_due
                  ? dayjs(formData.task_date_due).format("YYYY-MM-DD")
                  : "Select a Date"}
              </div>

              {/* Show calendar only if calendarOpen is true */}
              {calendarOpen && (
                <DatePicker
                  selected={formData.task_date_due} // Current date
                  onChange={handleDateChange} // Callback for date selection
                  inline
                  dateFormat="yyyy, MM, DD" // Display format
                  
                />
              )}
            </div>
          </div>
          <div className="priorityArea w-1/3 flex-grow">
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-ColorDark mb-3"
            >
              Priority
            </label>
            <select
              onChange={handleDropDownChange}
              defaultValue={formData.proiority}
              className="bg-transparent w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:none"
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 mt-[30px] px-6">
          <div className="relative w-1/3 flex-grow">
            <ProgressBar
              progressValue={formData.progress}
              onChangeComplete={UpdateTaskProgressBar}
            />
          </div>
          <TagDropdown
            taskTags={taskTags}
            tagList={tags}
            project_id={taskData?.project_id}
            taskId={taskData?.id}
            refetchTaskActivity={refetchTaskActivity}
          />
          <StageDropdown
            taskId={taskData?.id}
            project_id={taskData?.project_id}
            refetchTaskActivity={refetchTaskActivity}
          />
        </div>
        <div className="flex gap-4 mt-[30px] items-center px-6">
          <div className="w-1/3 flex-grow">
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-ColorDark mb-3"
            >
              Created By |{" "}
              <span className="text-gray-500 font-normal">
                {taskData?.createdByName}
              </span>
            </label>
            <p className="block text-sm text-gray-600">
              {" "}
              {moment(taskData?.created_at).fromNow()}
            </p>
          </div>
          <div className="w-1/3 flex-grow">
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-ColorDark mb-3"
            >
              Updated By |{" "}
              <span className="text-gray-500 font-normal">
                {taskData?.updatedByName}
              </span>
            </label>
            <p className="block text-sm text-gray-600">
              {moment(taskData?.updated_at).fromNow()}
            </p>
          </div>
          {/* <button
            className="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-full hover:bg-blue-700 leading-4"
            disabled={isUpdatingTask}
            onClick={handleSubmit}
          >
            {isUpdatingTask ? "Updating" : "Update Task"}
          </button> */}
        </div>
        <div className="mt-[30px]">
          <TabsAndComments
            taskId={taskData?.id}
            project_id={taskData?.project_id}
            taskComments={taskComments}
            refetchTaskComments={refetchTaskComments}
            taskActivities={taskActivities}
            refetchTaskActivity={refetchTaskActivity}
            removeComment={removeComment}
          />
        </div>
      </div>
    </div>
  );
};

export default EditTaskSidebar;
