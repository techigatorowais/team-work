import { useEffect, useState } from "react";
import RdwCommentEditor from "./RdwCommentEditor";
import ActivityFeed from "./ActivityFeed";
import DropzoneComponent from "./DropzoneComponent";
import axios from "axios";
import { fetchDataWithOutParam } from "@/utils/api";

export default function TabsAndComments({ taskId, project_id, taskComments, refetchTaskComments, taskActivities, refetchTaskActivity, removeComment  }: any) {
  const [activeTab, setActiveTab] = useState("Details");
  const [comments, setComments] = useState([
    { name: "Ahsan Zafar", comment: "test comment", time: "41 minutes ago" },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    setComments([
      ...comments,
      { name: "Your Name", comment: newComment, time: "Just now" },
    ]);
    setNewComment("");
  };

  return (
    <div className="mx-aut">
      {/* Tabs */}
      <div className="flex space-x-4 border-b px-6">
        {["Details", "Activity"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium ${
              activeTab === tab
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {activeTab === "Details" && (
        <>
          {/* Files */}
          <div className="my-4 px-6">
            <h3 className="font-bold text-ColorDark mb-2">Fileupload</h3>
            <DropzoneComponent taskId={taskId} project_id={project_id} refetchTaskActivity = {refetchTaskActivity} refetchTaskComments = {refetchTaskComments}/>
          </div>

          {/* Comments */}
          <div className="mb-0">
            <RdwCommentEditor removeComment = {removeComment} taskId={taskId} project_id={project_id} taskComments = {taskComments} refetchTaskComments = {refetchTaskComments} refetchTaskActivity = {refetchTaskActivity}/>
          </div>
        </>
      )}
      {/* Active Tab Content */}
      {activeTab === "Activity" && (
        <>
          <ActivityFeed taskActivities = {taskActivities} />
        </>
      )}
    </div>
  );
}
