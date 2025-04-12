import { configureStore, createSlice } from "@reduxjs/toolkit/react";
import { UserInfo } from "../@types/global";

interface State {
  userInfo?: UserInfo;
  loading: boolean;
}

interface Action<T> {
  type: string;
  payload: T;
}

// 定义初始状态
const initialState: State = {
  userInfo: void 0,
  loading: false,
};

// 定义初始状态和 reducer（可以包含多个 slice）
const coreSlice = {
  name: "core",
  initialState,
  reducers: {
    setUserInfo: (state: State, action: Action<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setLoading: (state: State, action: Action<boolean>) => {
      state.loading = action.payload;
    },
  },
};

const coreReducer = createSlice(coreSlice).reducer;

const store = configureStore({
  reducer: {
    core: coreReducer,
  },
});

export default store;

// 导出类型
export type CoreState = ReturnType<typeof store.getState>;
export type CoreDispatch = typeof store.dispatch;
