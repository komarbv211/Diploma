import { Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import UsersPage from '../pages/admin/users/UsersPage';
import AdminLayout from '../components/layouts/admin/Layout';

export const AdminRoutes = () => {
  return (
    <Route element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path='profile' element={<AdminProfile />} />
      <Route path="users" element={<UsersPage />} />
    </Route>
  );
};
export default AdminRoutes