import { postData } from '@/utils/api';
import axios from 'axios';
import { useState } from 'react';

export default function useAddTaskComment(onSuccess: () => void,refetch: () => void, IsEdit: boolean) {
  const [isCreating, setIsCreating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAddTaskComment = async (newComment: any) => {
    setIsCreating(true);
    setSubmitError(null);

    try {
      if(!IsEdit){
        const response = await postData("api/tasks/comment/add",newComment)
        // data["response"].created_at = Date.now()
        // data["response"].type = "comment"
        // setComments([
        //   ...comments,
        //   data["response"],
        // ]);
        onSuccess();
        refetch();
      }else{
        let {data} = await postData("api/tasks/comment/edit",newComment);
        onSuccess();
        refetch();
      }

    } catch (err) {
      setSubmitError('Something went wrong');
    } finally {
      setIsCreating(false);
    }
  };

  return { addComment:handleAddTaskComment, isCreating, submitError };
}
