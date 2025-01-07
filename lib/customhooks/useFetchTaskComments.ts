import { fetchDataWithOutParam } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

export default function useFetchTaskComments(taskId : string | null){
  interface Comment {
    id: number;
    // Add other fields of the comment object
  }
  
    const [taskComments, setTaskComments] = useState<Comment[] | undefined>(undefined);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchTaskComments = useCallback(async () => {
        setIsCommentsLoading(true);
        setError(null);

        try {
          const { data } = await fetchDataWithOutParam(`api/tasks/comment/${taskId}`)
          setTaskComments(data.response);
          
        } catch (err) {
          setError("Something went wrong");
        } finally{
            setIsCommentsLoading(false);
        }
      },[]);

      useEffect(() => {
        handleFetchTaskComments();
      },[handleFetchTaskComments])

      const removeComment = (id: any) => {
        setTaskComments(taskComments?.filter((comment: any) => comment.id !== id));
      }
      return {taskComments, isCommentsLoading, error, refetchTaskComments: handleFetchTaskComments, removeComment: removeComment};
}