import SERVER_URL from '../constants';
import apiRequest from '../services';

const verifyUser = async () => {
  try {
    const { data } = await apiRequest({
      method: 'post',
      url: `${SERVER_URL}/api/auth/verify`,
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw new Error(`Error verifying user: ${error}`);
  }
};

const login = async (values) => {
  const { username, password } = values;
  try {
    const { data } = await apiRequest({
      method: 'post',
      url: `${SERVER_URL}/api/auth/login`,
      data: { username, password },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw new Error(`Error logging in: ${error}`);
  }
};

const register = async (values) => {
  const {
    email, password, username,
  } = values;
  try {
    const { data } = await apiRequest({
      method: 'post',
      url: `${SERVER_URL}/api/auth/register`,
      data: {
        email, password, username,
      },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw new Error(`Error registering: ${error}`);
  }
};

export default {
  verifyUser,
  login,
  register,
};
