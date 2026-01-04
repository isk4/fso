import axios from 'axios';
const baseUrl = 'http://localhost:3001/contacts';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (contact) => {
  const response = await axios.post(baseUrl, contact);
  return response.data;
};


export default {
  getAll,
  create
};