import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import { ProjectsFetchSuccess } from "../redux/features/projectSlice";
export default function useFetchProjects(
  team_key: string,
  type: string,
  userid: string
) {
  let dispatch = useDispatch();
  const projects = useSelector((state: any) => state.projects?.projects);
  // const [projects, setProjects] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(
        `api/projects/${team_key}?type=${type}&userid=${userid}`
      );
      // setProjects(data.response);
      console.log("datadata", data);

      dispatch(ProjectsFetchSuccess({ projects: data.response }));
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchProjects();
  }, [handleFetchProjects]);

  return { projects, isLoading, error, refetch: handleFetchProjects };
}
