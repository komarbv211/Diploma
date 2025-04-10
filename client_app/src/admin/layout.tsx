
import { Breadcrumb, Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const { Content } = Layout;

export default function AdminLayout() {
  return (
    <Layout className="h-screen">
      <AdminHeader />
      <AdminSidebar />

      <Layout className="flex">
        <Content className="p-6 bg-gray-50 overflow-auto ml-[220px] mt-[84px]">
          <Breadcrumb items={[{ title: 'Home' }, { title: 'Dashboard' }]} className="mb-4" />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}