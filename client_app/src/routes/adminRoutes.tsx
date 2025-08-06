import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const AdminLayout = lazy(() => import('./../components/layouts/admin/Layout'));
const Dashboard = lazy(() => import('./../pages/admin/Dashboard'));
const AdminProfile = lazy(() => import('./../pages/admin/AdminProfile'));
const UsersPage = lazy(() => import('./../pages/admin/users/UsersPage'));
const CategoryList = lazy(() => import('./../pages/admin/categories/CategoryList'));
const TestingList = lazy(() => import('./../pages/admin/testing/TestingList'));
const EditCategoryPage = lazy(() => import('./../pages/admin/categories/EditCategoryPage'));
const CreateCategoryPage = lazy(() => import('./../pages/admin/categories/CreateCategoryPage'));
const ProductList = lazy(() => import('./../pages/admin/products/ProductList'));
const CreateProductPage = lazy(() => import('./../pages/admin/products/CreateProductPage'));
const EditProductPage = lazy(() => import('../pages/admin/products/EditProductpage'));
const PromotionList = lazy(() => import('./../pages/admin/promotions/PromotionList'));

export const AdminRoutes = () => {
  return (
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="users" element={<UsersPage />} />

          <Route path="categories">
            <Route index element={<CategoryList />} />
            <Route path="create" element={<CreateCategoryPage />} />
            <Route path="edit/:id" element={<EditCategoryPage />} />
          </Route>

          <Route path="testing">
            <Route index element={<TestingList />} />
            <Route path="create" element={<CreateCategoryPage />} />
          </Route>

          <Route path="products">
            <Route index element={<ProductList />} />
            <Route path="create" element={<CreateProductPage />} />
            <Route path="edit/:id" element={<EditProductPage />} />
          </Route>

          <Route path="promotions">
            <Route index element={<PromotionList />} />
          </Route>
        </Route>
      </Routes>
  );
};

export default AdminRoutes;
