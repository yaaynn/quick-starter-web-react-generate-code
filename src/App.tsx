import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { useEffect, useRef } from "react";
import { useCore } from "./providers/CoreProvider.tsx";

import { TokenNames } from "./static-data/token-names.ts";
import { decodeJwt } from "jose";
import { BackResultError } from "./utils/back-result.ts";

function App() {
  const elements = useRoutes(routes);

  const location = useLocation();
  const navigate = useNavigate();
  const { core } = useCore();
  const initial = useRef<boolean>(false);

  const { pathname } = location;

  /**
   * jwt是否过期
   * @param token
   */
  function isJwtExpired(token: string) {
    try {
      const { exp } = decodeJwt(token); // 解析 JWT
      if (!exp) return true; // 如果没有 exp 字段，默认认为过期

      const currentTime = Math.floor(Date.now() / 1000); // 当前时间（秒）
      return exp > currentTime; // 过期时间小于当前时间则已过期
    } catch (e) {
      console.error("Invalid JWT:", e);
      return true; // 解析失败，假设 JWT 无效或已过期
    }
  }

  /**
   * 检查jwt
   */
  function checkJwt() {
    const token = localStorage.getItem(TokenNames.AUTHORIZATION_TOKEN);
    if (!token) return true;
    if (!isJwtExpired(token)) {
      localStorage.removeItem(TokenNames.AUTHORIZATION_TOKEN);
    }
  }
  function isSignIn() {
    const { pathname } = location;
    return pathname === "/sign-in";
  }

  /**
   * 初始化 Axios
   */
  function initialAxios() {
    core.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem(TokenNames.AUTHORIZATION_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    core.axios.interceptors.response.use(
      (response) => {
        if (response.status === 200) {
          if (response.headers["content-type"]?.includes("application/json")) {
            const { data } = response;
            if (data.code === 200) {
              return data;
            }
            core.showErrorMessage(response.data.error, response.data.detail);
            return Promise.reject(
              new BackResultError(
                `${response.data.error}, ${response.data.detail}`,
                response.data,
              ),
            );
          }
          return response;
        }
        return Promise.reject(new BackResultError(response.statusText, void 0));
      },
      (error: any) => {
        const { response } = error;
        if (response.status === 401) {
          if (response.headers["content-type"] === "application/json") {
            core.showErrorMessage(response.data.error, response.data.detail);
          } else {
            core.showErrorNotification("登录信息已过期", "请重新登录");
          }
          if (!isSignIn()) {
            localStorage.removeItem(TokenNames.AUTHORIZATION_TOKEN);
            toSignIn();
          }
          return;
        }

        core.showErrorNotification(
          "网络或程序错误",
          `${error.message},错误码: ${error.response.status}`,
        );
        return Promise.reject(error);
      },
    );
  }

  initialAxios();

  /**
   * 跳转到登录页
   */
  function toSignIn() {
    const { search } = location;
    navigate(
      `/sign-in${search ? `${search}&sp=${pathname}` : `?sp=${pathname}`}`,
    );
  }

  useEffect(() => {
    if (initial.current) return;
    initial.current = true;
    checkJwt();
  }, []);

  useEffect(() => {
    if (pathname === "/sign-in") return;
    const token = localStorage.getItem(TokenNames.AUTHORIZATION_TOKEN);
    if (token) return;
    toSignIn();
  }, [pathname]);

  return <>{elements}</>;
}

export default App;
