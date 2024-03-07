import axios from 'axios';

const apiRequest = async (config) => {
  const response = await axios({
    ...config,
    withCredentials: true,
  });

  return response;
};

export default apiRequest;
