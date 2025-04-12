import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { CoreProvider } from "./providers/CoreProvider.tsx";
import { ConfigProvider } from "antd";

import "./assets/tailwind.css";
``;
import "./assets/main.scss";

import { Provider } from "react-redux";
import store from "./store";

import zhCN from "antd/locale/zh_CN";

import "@ant-design/v5-patch-for-react-19";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          borderRadius: 4,
        },
      }}
    >
      <Provider store={store}>
        <CoreProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </CoreProvider>
      </Provider>
    </ConfigProvider>
  </StrictMode>,
);
