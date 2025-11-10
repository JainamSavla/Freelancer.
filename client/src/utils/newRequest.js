import axios from "axios";

const newRequest = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api`,
  withCredentials: true,
});

// Add request interceptor for debugging
newRequest.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;
