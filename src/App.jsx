import {
  Routes, Route, Navigate, useNavigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Map from './screens/Map/Map';
import Login from './screens/Registration/Login';
import Register from './screens/Registration/Register';
import { setUser, logout } from './redux/userSlice';
import authApi from './requests/authApi';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserSession = async () => {
      const response = await authApi.verifyUser();
      if (response.status && response.user) {
        dispatch(setUser(response.user));
      } else if (window.location.pathname !== '/register' && window.location.pathname !== '/login') {
        dispatch(logout());
        navigate('/login');
      }
    };

    verifyUserSession();
  }, [navigate, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Map />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
