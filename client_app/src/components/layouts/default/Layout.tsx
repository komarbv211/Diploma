import React from "react";
import { Outlet } from "react-router-dom";
import { Content, Header } from "antd/es/layout/layout";
import { Layout } from "antd";
import CustomHeader from "./Header";

const AppLayout: React.FC = () => {
  return (
    <Layout className="h-screen">
      <Header className="fixed top-0 left-0 w-full h-16 z-50 p-0 bg-white shadow-md">
        <CustomHeader />
      </Header>

      <Content className="bg-white pt-16 min-h-screen">
        <Outlet />
      </Content>

    </Layout>
  );
};

export default AppLayout;
