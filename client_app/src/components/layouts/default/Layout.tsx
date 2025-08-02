import React from "react";
import { Outlet } from "react-router-dom";
import { Content, Header } from "antd/es/layout/layout";
import { Layout } from "antd";
import CustomHeader from "./Header";
import CategoryMenu from "./CategoryMenu";

const AppLayout: React.FC = () => {
  return (
    <Layout className="h-screen">
      <Header className="fixed top-0 left-0 w-full h-20 z-50 p-0 bg-white shadow-md ">
        <CustomHeader />
      </Header>

      <CategoryMenu />

      <Content className="bg-white min-h-[90vh]">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;
