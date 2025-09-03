// src/components/AppConfigProvider.tsx
import React, { ReactNode } from "react";
import { ConfigProvider } from "antd";

interface AppConfigProviderProps {
  children: ReactNode;
}

const AppConfigProvider: React.FC<AppConfigProviderProps> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#E56B93", // pink
          colorPrimaryHover: "#8A0149", // hover pink2
          colorPrimaryActive: "#E56B93", // pink
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AppConfigProvider;
