import axios from 'axios';
import { useState } from 'react';

export default function useUpdateProject(onSuccess: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleUpdateProject = async (editProjectData: any) => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const response = await axios.post('/api/projects/update', editProjectData);
      const data = response.data;
      onSuccess();

    } catch (err) {
      setUpdateError('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProject:handleUpdateProject, isUpdating, updateError };
}
