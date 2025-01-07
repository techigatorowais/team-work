import { postData } from "@/utils/api";
import { AddTaskActivity, FormatDate } from "@/utils/common";
import { useState } from "react";

export default function useUpdateProjectTask(onSuccess: () => Promise<any>) {
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [updateTaskError, setUpdateTaskError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdateProjectTask = async (currentTaskData: any) => {
    setIsUpdatingTask(true);
    setUpdateTaskError(null);
    setIsSuccess(false);

    try {
      const response = await postData("/api/tasks/update", currentTaskData);

      console.log("hello_world_1");

      if (response["data"]["success"] == true) {
        setIsSuccess(true);
        onSuccess();

        AddTaskActivity(() => console.log("Task created logged"), {
          user_id: currentTaskData.created_by,
          task_id: currentTaskData.task_id,
          project_id: currentTaskData.project_id,
          activity: `Updated Task Details`,
          activity_type: 1,
        });

        setTimeout(() => {
          console.log("3 sec passed");
          setIsSuccess(false);
        }, 1000);
      }
    } catch (err) {
      setUpdateTaskError("Something went wrong");
      setIsSuccess(false);
    } finally {
      setIsUpdatingTask(false);
    }
  };

  return {
    updateTask: handleUpdateProjectTask,
    isUpdatingTask,
    updateTaskError,
    isSuccess,
  };
}
