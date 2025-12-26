import axios from "axios";

const API_URL = "http://localhost:5000"; // Replace with your backend URL

export const getMembers = async () => {
  const response = await axios.get(`${API_URL}/members`);
  return response.data;
};

export const createMember = async (member: any) => {
  const response = await axios.post(`${API_URL}/members`, member);
  return response.data;
};

export const updateMember = async (id: string, member: any) => {
  const response = await axios.put(`${API_URL}/members/${id}`, member);
  return response.data;
};

export const deleteMember = async (id: string) => {
  const response = await axios.delete(`${API_URL}/members/${id}`);
  return response.data;
};

export const getNonMemberUsers = async () => {
  const response = await axios.get(`${API_URL}/members/non-members`);
  return response.data;
};
