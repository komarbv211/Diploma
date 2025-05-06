
import { Breadcrumb, Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import CustomHeader from '../components/Header';

const { Content, Sider, Header } = Layout;

export default function AdminLayout() {
  return (
    <Layout className="h-screen">
      <Header>
        <CustomHeader />
      </Header>

      <Layout>
        <Sider theme="light" width={220} collapsible>
          <AdminSidebar />
        </Sider>

        <Content className="m-3 p-6 bg-white overflow-auto">
          <Breadcrumb items={[{ title: 'Home' }, { title: 'Dashboard' }]} className="mb-4" />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}