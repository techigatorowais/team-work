import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchData = async (url: string, params?: object) => {
    try {
      return await apiClient.get(url, { params });
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  };

  export const fetchDataWithOutParam = async (url: string) => {
    try {
      return await apiClient.get(url);
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  };
  
  export const postData = async (url: string, data: object) => {
    try {
      return await apiClient.post(url, data);
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  };
  

export default apiClient;
