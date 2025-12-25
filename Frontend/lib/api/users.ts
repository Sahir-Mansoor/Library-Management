import axios from "axios";

const API_URL = "http://localhost:5000"; // Backend URL

export const createUser = async (user: any) => {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
};

export const updateUser = async (id: string, user: any) => {
  const response = await axios.put(`${API_URL}/users/${id}`, user);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};
