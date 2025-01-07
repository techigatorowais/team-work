import { fetchData } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateTeamMembers } from "../redux/features/teamMemberSlice";
import { SetProjectTasks } from "../redux/features/projectSlice";

export default function useFetchProjectTask(project_id : string | null){

    const projectTasks = useSelector((state: any) => state.projects?.projectTasks);
    // const [projectTasks, setProjectTasks] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();

    const handleFetchProjectTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
          const { data } = await fetchData(`api/tasks/${project_id ==  null ? 0 : project_id}`);
          // setProjectTasks(data.response);
          dispatch(
            SetProjectTasks(data.response)
          )
          dispatch(
            UpdateTeamMembers({
              newTeamMember: data.response["teamMembers"]
            })
          )
          
        } catch (err) {
          setError("Something went wrong");
        } finally{
            setIsLoading(false);
        }
      },[]);

      useEffect(() => {
        handleFetchProjectTasks();
      },[handleFetchProjectTasks])

      return {projectTasks, isLoading, error, refetch: handleFetchProjectTasks};
}