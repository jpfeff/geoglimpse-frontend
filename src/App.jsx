import {
  Routes, Route, Navigate, useNavigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Home from './screens/Home/Home';
import Login from './screens/Registration/Login';
import Register from './screens/Registration/Register';
import { setUser, logout } from './redux/userSlice';
import authApi from './requests/authApi';
import { getViewablePlaces } from './redux/placesSlice';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const response = await authApi.verifyUser();
        if (response.status && response.user) {
          dispatch(setUser(response.user));
          dispatch(getViewablePlaces(response.user._id));
        } else if (window.location.pathname !== '/register' && window.location.pathname !== '/login') {
          dispatch(logout());
          navigate('/login');
        }
      } catch (error) {
        dispatch(logout());
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyUserSession();
  }, [navigate, dispatch, user && user._id]);

  if (loading || (!user && window.location.pathname !== '/login' && window.location.pathname !== '/register')) {
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
