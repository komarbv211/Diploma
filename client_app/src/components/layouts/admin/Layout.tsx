import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import CustomHeader from "../default/Header";
import AdminSidebar from "./AdminSidebar";

const { Content, Sider, Header } = Layout;

const AdminLayout = () => {
  return (
    <Layout className="h-screen">
      <Header>
        <CustomHeader />
      </Header>

      <Layout>
        <Sider className="mt-7 ml-3 mb-7" theme="light" width={220} collapsible>
          <AdminSidebar />
        </Sider>

        <Content className="m-3 p-6 bg-white overflow-auto mt-7">
          {/* <Breadcrumb
            items={[{ title: "Home" }, { title: "Dashboard" }]}
            className="mb-4"
          /> */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
