import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import UsersPage from '../pages/admin/users/UsersPage';
import AdminLayout from '../components/layouts/admin/Layout';
import CategoryList from '../pages/admin/categories/CategoryList';

export const AdminRoutes = () => {
  return (
    <Routes>
    <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='profile' element={<AdminProfile />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="/categories" element={<CategoryList />} />
      </Route>
    </Routes>
   
  );
};
export default AdminRoutes