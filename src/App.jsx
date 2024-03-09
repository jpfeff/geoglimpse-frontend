import {
  Routes, Route, Navigate, useNavigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Home from './screens/Home/Home';
import Login from './screens/Registration/Login';
import Register from './screens/Registration/Register';
import { setUser, logout } from './redux/userSlice';
import authApi from './requests/authApi';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const response = await authApi.verifyUser();
        console.log('response', response);
        console.log('response', response);
        if (response.status && response.user) {
          dispatch(setUser(response.user));
        } else if (window.location.pathname !== '/register' && window.location.pathname !== '/login') {
          dispatch(logout());
          navigate('/login');
        }
      } catch (error) {
        dispatch(logout());
        navigate('/login');
      }
    };
    verifyUserSession();

    setLoading(false);
  }, [navigate, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
