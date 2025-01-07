import axios from 'axios';
import { useState } from 'react';

export default function useAddProject(onSuccess: () => void) {
  const [isCreating, setIsCreating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAddProject = async (newProjectData: any) => {
    setIsCreating(true);
    setSubmitError(null);

    try {
      const response = await axios.post('/api/projects/create', newProjectData);
      const data = response.data;
      onSuccess();

    } catch (err) {
      setSubmitError('Something went wrong');
    } finally {
      setIsCreating(false);
    }
  };

  return { addProject:handleAddProject, isCreating, submitError };
}
