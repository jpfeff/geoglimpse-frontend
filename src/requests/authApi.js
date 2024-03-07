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
  const { email, password } = values;
  try {
    const { data } = await apiRequest({
      method: 'post',
      url: `${SERVER_URL}/api/auth/login`,
      data: { email, password },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw new Error(`Error logging in: ${error}`);
  }
};

const register = async (values) => {
  const {
    email, password, orgName, registrationCode,
  } = values;
  try {
    const { data } = await apiRequest({
      method: 'post',
      url: `${SERVER_URL}/api/auth/register`,
      data: {
        email, password, orgName, registrationCode,
      },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw new Error(`Error registering: ${error}`);
  }
};

const registerWithInvitation = async (values, invitationToken) => {
  const { email, password } = values;
  try {
    const { data } = await apiRequest({
      method: 'post',
      url: `${SERVER_URL}/api/auth/register/${invitationToken}`,
      data: { email, password },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw new Error(`Error registering with invitation: ${error}`);
  }
};

export default {
  verifyUser,
  login,
  register,
  registerWithInvitation,
};
