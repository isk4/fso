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

const remove = async (contactId) => {
  const response = await axios.delete(`${baseUrl}/${contactId}`);
  return response.data;
};

const update = async (contactId, newContact) => {
  const response = await axios.put(`${baseUrl}/${contactId}`, newContact);
  return response.data;
};

export default {
  getAll,
  create,
  remove,
  update
};