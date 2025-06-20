import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProductList from '../pages/admin/products/ProductList';


const AdminLayout = lazy(() => import('./../components/layouts/admin/Layout'))
const Dashboard = lazy(() => import('./../pages/admin/Dashboard'))
const AdminProfile = lazy(() => import('./../pages/admin/AdminProfile'))
const UsersPage = lazy(() => import('./../pages/admin/users/UsersPage'))
const CategoryList = lazy(() => import('./../pages/admin/categories/CategoryList'))
const EditCategoryPage = lazy(() => import('./../pages/admin/categories/EditCategoryPage'))


export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='profile' element={<AdminProfile />} />
        <Route path="users" element={<UsersPage />} />

        <Route path="categories">
            <Route index element={<CategoryList />} />
            {/* <Route path="create" element={<CreateCategoryPage />} /> */}
            <Route path="edit/:id" element={<EditCategoryPage />} />
        </Route>
        <Route path="products" element={<ProductList />} />
      </Route>
    </Routes>
   
  );
};
export default AdminRoutes