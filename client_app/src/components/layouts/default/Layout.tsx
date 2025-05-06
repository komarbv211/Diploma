import React from "react";
import { Outlet } from "react-router-dom";
import { Content, Header } from "antd/es/layout/layout";
import { Layout } from "antd";
import CustomHeader from "./Header";

const AppLayout: React.FC = () => {
  return (
    <Layout className="h-screen">
      <Header>
        <CustomHeader />
      </Header>

      <Content className="bg-white">
        <Outlet />
      </Content>

    </Layout>
  );
};

export default AppLayout;
