import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../admin/Layout';
import Dashboard from '../pages/admin/Dashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import UsersPage from '../pages/admin/users/UsersPage';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}> 
        <Route index element={<Dashboard />} />         
        <Route path='profile/:id' element={<AdminProfile />} />  
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
};