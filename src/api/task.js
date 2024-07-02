import axios from "axios";
import { toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
export const createTask = async (taskData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.defaults.headers.common["Authorization"] = user.token;
    const res = await axios.post(`${backendUrl}task/create-task`, taskData);
    toast.success(res?.data?.message);
    return res?.data.task;
  } catch (error) {
    toast.error(error?.response?.data?.errorMessage);
    return false;
  }
};

export const updateTask = async (taskData,id) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.defaults.headers.common["Authorization"] = user.token;
    const res = await axios.post(`${backendUrl}task/update-task/${id}`, taskData);
    toast.success(res?.data?.message);
    return res?.data.task;
  } catch (error) {
    toast.error(error?.response?.data?.errorMessage);
    return false;
  }
};

export const updateProgressAndCheckListTask = async (taskData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.defaults.headers.common["Authorization"] = user.token;
    const res = await axios.post(
      `${backendUrl}task/update-checklist-progress-task`,
      taskData
    );
    toast.success(res?.data?.message);
    return res?.data?.task;
  } catch (error) {
    toast.error(error?.response?.data?.errorMessage);
    return false;
  }
};

export const getTask = async (filter,token) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const res = await axios.get(`${backendUrl}task/get-task?filter=${filter}`);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.errorMessage);
    return false;
  }
};

export const addMember = async (memberData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.defaults.headers.common["Authorization"] = user.token;
    const res = await axios.post(`${backendUrl}task/add-member`, memberData);
    toast.success(res?.data?.message);
    return res?.data?.user;
  } catch (error) {
    toast.error(error?.response?.data?.errorMessage);
    return false;
  }
};

export const getMember = async (skip) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.defaults.headers.common["Authorization"] = user.token;
    const res = await axios.get(`${backendUrl}task/get-member?skip=${skip}`);
    toast.success(res?.data?.message, { containerId: "addContact" });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.errorMessage, {
      containerId: "addContact",
    });
    return false;
  }
};

export const deleteTask = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.defaults.headers.common["Authorization"] = user.token;
    const res = await axios.delete(`${backendUrl}task/delete-task/${id}`);
    toast.success(res?.data?.message);
    return res.data?.deleted;
  } catch (error) {
    toast.error(error?.response?.data?.errorMessage);
    return false;
  }
};

export const getAnalytic = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    axios.defaults.headers.common["Authorization"] = user.token;
    const res = await axios.get(`${backendUrl}task/analytic-task`);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.errorMessage);
    return false;
  }
};

export const getSingleTask = async (id) => {
  try {
    const res = await axios.get(`${backendUrl}task/get-single-task/${id}`);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.errorMessage);
    return false;
  }
};
