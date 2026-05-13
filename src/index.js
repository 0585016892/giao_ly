import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import App from "./App";
import 'antd/dist/reset.css';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ConfigProvider
  theme={{
      token: {
        colorPrimary: '#8B0000',
        borderRadius: 12
      }
    }}
  >
    <App />
  </ConfigProvider>
);