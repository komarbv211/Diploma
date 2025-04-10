import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../admin/layout';
import Dashboard from '../pages/admin/Dashboard';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}> 
        <Route index element={<Dashboard />} />         
      </Route>
    </Routes>
  );
};