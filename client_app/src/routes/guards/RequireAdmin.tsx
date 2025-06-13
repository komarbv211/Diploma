import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { getAuth } from '../../store/slices/userSlice';

const RequireAdmin = () => {
  const auth = useAppSelector(getAuth);

  if (!auth.isAuth) {
    // Не авторизований
    return <Navigate to="/login" replace />;
  }

  if (!auth.isAdmin) {
    // Авторизований, але не адмін
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
