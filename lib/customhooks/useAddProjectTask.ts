import { postData } from '@/utils/api';
import { AddTaskActivity, FormatDate } from '@/utils/common';
import { useState } from 'react';

export default function useAddProjectTask(onSuccess: () => Promise<any>) {
  const [isCreating, setIsCreating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState(false);

  const handleAddProjectTask = async (newTaskData: any) => {
    setIsCreating(true);
    setSubmitError(null);
    setIsCreated(false);

    try {
      const response = await postData('/api/tasks/add', newTaskData);
      if(response["data"]["success"] == true){
        setIsCreated(true);
        onSuccess();

        
        AddTaskActivity(() => console.log("Task created logged"),{
          user_id: newTaskData.created_by,
          task_id:response["data"]["response"]["id"],
          project_id:newTaskData.project_id,
          activity: `Created new Task`,
          activity_type: 1,
          created_at: newTaskData.task_date_start,
          updated_at:newTaskData.task_date_start
        })
      }

      

    } catch (err) {
      setSubmitError('Something went wrong');
      setIsCreated(false);
    } finally {
      setIsCreating(false);
    }
  };

  return { addTask:handleAddProjectTask, isCreating, submitError, isCreated };
}
