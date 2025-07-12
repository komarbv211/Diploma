// src/components/AuthWatcher.tsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../store/store';

// Додайте всі публічні шляхи, які не потребують авторизації
const PUBLIC_PATHS = [
  '/',
  '/about',
  '/login',
  '/registr',
  '/forgot-password',
  '/reset-password/:token',
  // додайте інші публічні сторінки
];

const AuthWatcher = () => {
  const token = useSelector((state: RootState) => state.account.token);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Якщо токен зник і шлях не публічний — редірект
    if (!token && !PUBLIC_PATHS.includes(location.pathname)) {
      navigate('/login');
    }
  }, [token, navigate, location.pathname]);

  return null;
};

export default AuthWatcher;