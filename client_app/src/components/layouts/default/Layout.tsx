import React from "react";
import { Outlet } from "react-router-dom";
import { Content, Header } from "antd/es/layout/layout";
import { Layout } from "antd";
import CustomHeader from "./Header";
import Footer from "./Footer";

const AppLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen flex flex-col">
      <Header className="fixed top-0 left-0 w-full h-20 z-40 p-0 bg-white shadow-md">
        <CustomHeader />
      </Header>
      <Content className="flex-1 bg-white pt-[120px] pb-4">
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default AppLayout;
