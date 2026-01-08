import axios from 'axios';
const baseUrl = '/api/persons';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (person) => {
  const response = await axios.post(baseUrl, person);
  return response.data;
};

const remove = async (personId) => {
  const response = await axios.delete(`${baseUrl}/${personId}`);
  return response.data;
};

const update = async (personId, newPerson) => {
  const response = await axios.put(`${baseUrl}/${personId}`, newPerson);
  return response.data;
};

export default {
  getAll,
  create,
  remove,
  update
};