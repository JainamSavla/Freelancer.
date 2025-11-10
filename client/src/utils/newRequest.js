import axios from "axios";

const newRequest = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api`,
  withCredentials: true,
});

export default newRequest;
