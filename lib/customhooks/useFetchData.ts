import axios from "axios";
import { useCallback, useEffect, useState } from "react";

type FetchState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

export default function useFetchData<T>(url: string, dispatch: Function, sliceActions: any): FetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleFetchData = useCallback(async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const { data } = await axios.get(url); // Fetch data using dynamic URL
        dispatch(sliceActions.fetchSuccess(data)); // Dispatch to Redux slice
        setData(data);
      } catch (err) {
        setError("Something went wrong");
        dispatch(sliceActions.fetchFailure("Something went wrong")); // Dispatch failure action to Redux slice
      } finally {
        setIsLoading(false);
      }
    }, [url, dispatch, sliceActions]);
  
    useEffect(() => {
      handleFetchData();
    }, [handleFetchData]);
  
    return { data, isLoading, error };
  }