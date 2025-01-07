import { fetchDataWithOutParam } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

export default function useFetchTaskActivity(taskId : string | null){

    const [taskActivities, setTaskActivities] = useState(null);
    const [isActivityLoading, setIsActivityLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchTaskActivity = useCallback(async () => {
        setIsActivityLoading(true);
        setError(null);

        try {
          const { data } = await fetchDataWithOutParam(`api/tasks/activity/${taskId}`)
          console.log('refetching task activities');
          setTaskActivities(data.response);
          
        } catch (err) {
          setError("Something went wrong");
        } finally{
            setIsActivityLoading(false);
        }
      },[]);

      useEffect(() => {
        handleFetchTaskActivity();
      },[handleFetchTaskActivity])

      return {taskActivities, isActivityLoading, error, refetchTaskActivity: handleFetchTaskActivity};
}