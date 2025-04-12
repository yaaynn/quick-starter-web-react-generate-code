import {
  createContext,
  useContext,
  useState,
  JSX,
  Dispatch,
  useReducer,
} from "react";

import mitt, { Emitter } from "mitt";
// import { message, Modal, TreeDataNode } from "antd";
// import { HookAPI } from "antd/es/modal/useModal";
// import { MessageInstance } from "antd/es/message/interface";
import Axios, { AxiosInstance } from "axios";
import { message, Modal, notification, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { NotificationInstance } from "antd/es/notification/interface";
import { HookAPI } from "antd/es/modal/useModal";

export type BusEvents = {
  [key: string]: any;
};
// 创建一个 Context
const CoreContext = createContext<CoreProviderType | undefined>(void 0);

// 创家一个状态接口
export interface CoreState {
  activateEditorKey?: string;
}

export interface Core {
  axios: AxiosInstance;
  bus: Emitter<BusEvents>;
  modal: HookAPI; // HookAPI;
  message: unknown; // MessageInstance;
  state?: CoreState;
  setState: Dispatch<Action>;
  // userInfo?: TelegramUser;
  showLoading(message?: string): void;
  closeLoading(): void;
  showSuccessMessage(msg: string): void;
  showErrorMessage(msg: string, detail?: string): void;
  showSuccessNotification(title: string, description: string): void;
  showErrorNotification(title: string, description: string): void;
  getNotificationApi(): NotificationInstance;
}

export interface CoreProviderType {
  core: Core;
  setCore: Dispatch<Core>;
}

const bus = mitt<BusEvents>();

// 默认值

const initialState: CoreState = {
  activateEditorKey: undefined,
};
// 定义 Action 的类型
type Action = { type: "SET_ACTIVATE_EDITOR_KEY" | "LOGOUT"; payload?: string };

// 定义一个 reducer 函数
const reducer = (state: CoreState, action: Action): CoreState => {
  switch (action.type) {
    case "SET_ACTIVATE_EDITOR_KEY":
      return {
        ...state,
        activateEditorKey: action.payload,
      };
    default:
      return state;
  }
};
// 创建一个 Provider组件
export const CoreProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [state, setState] = useReducer(reducer, initialState);

  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, contextHolder] = message.useMessage();

  const [api, notificationContextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);

  const [loadingText, setLoadingText] = useState<string>("");

  const [core, setCore] = useState<Core>({
    axios: Axios.create({
      timeout: 1000 * 60,
    }),
    bus,
    modal: modal,
    message: void 0, //messageApi,
    state: state,
    setState: setState,
    showLoading(message?: string) {
      setLoading(true);
      setLoadingText(message ?? "");
    },
    closeLoading() {
      setLoading(false);
    },
    showSuccessMessage(msg: string) {
      messageApi.success(msg, 3).then(() => {});
    },
    showErrorMessage(msg: string, detail?: string): void {
      let message: string = "";
      if (detail) {
        message = `${msg}, ${detail}`;
      } else {
        message = msg;
      }

      messageApi.error(message, 3).then(() => {});
    },
    showSuccessNotification(title: string, description: string) {
      api.success({
        message: title,
        description: description,
        duration: 60,
        placement: "topRight",
      });
    },
    showErrorNotification(title: string, description: string) {
      api.error({
        message: title,
        description: description,
        duration: 60,
        placement: "topRight",
      });
    },
    getNotificationApi() {
      return api;
    },
  });

  return (
    <CoreContext.Provider value={{ core, setCore }}>
      {contextHolder}
      {notificationContextHolder}
      {modalContextHolder}

      <Spin
        indicator={<LoadingOutlined spin />}
        spinning={loading}
        fullscreen={true}
      >
        {loadingText}
      </Spin>

      {children}
    </CoreContext.Provider>
  );
};

export const useCore = (): CoreProviderType => {
  return useContext(CoreContext) as CoreProviderType;
};
