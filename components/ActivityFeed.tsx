import { fetchDataWithOutParam } from "@/utils/api";
import { CalculateInitials } from "@/utils/common";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaClock, FaFile, FaCommentDots } from "react-icons/fa";

// const activities = [
//   {
//     type: "comment",
//     user: "Ahsan Zafar",
//     avatar: "AZ",
//     content: "Added a comment: *This task needs more attention!*",
//     time: "41 minutes ago",
//   },
//   {
//     type: "file",
//     user: "Emily Carter",
//     avatar: "EC",
//     content: "Uploaded a file: `project-design.pdf`",
//     time: "1 hour ago",
//   },
//   {
//     type: "time-log",
//     user: "John Smith",
//     avatar: "JS",
//     content: "Logged 2h 15m on *Design Mockups*",
//     time: "2 hours ago",
//   },
//   {
//     type: "update",
//     user: "Sarah Lee",
//     avatar: "SL",
//     content: "Marked the task as *Complete*",
//     time: "3 hours ago",
//   },
// ];

const ActivityFeed = ({taskActivities} : any) => {

  // const [activities, setActivities] = useState([]);

  // const LoadActivities = async () => {
  //   try{
  //     const {data} = await fetchDataWithOutParam(`api/tasks/activity/${taskId}`)
  //     setActivities(data["response"]);
  //   }catch(error){
  //     console.log('err---> ',error);
  //   }
  // }

  // useEffect(() => {
  //   LoadActivities()
  // },[])

  return (
    <div className="my-4 px-6">
      <h3 className="font-bold text-ColorDark my-4">Activity</h3>
      <div className="space-y-4">
        {taskActivities && taskActivities.length > 0 ? taskActivities.map((activity: any, index: any) => (
          <div key={index} className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">
              {CalculateInitials(activity.name)}
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-bold text-ColorDark">{activity.name}</span> {activity.activity}
              </p>
              <p className="text-xs text-gray-500">{ moment(activity.created_at).fromNow()}</p>
            </div>

            {/* Icon */}
            <div className="text-gray-400">
              {activity.activity_type === 1 && <FaCommentDots size={18} />}
              {activity.activity_type === "file" && <FaFile size={18} />}
              {activity.activity_type === "time-log" && <FaClock size={18} />}
            </div>
          </div>
        )) : null}
      </div>
    </div>
  );
};

export default ActivityFeed;
