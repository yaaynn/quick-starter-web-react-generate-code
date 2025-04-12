import { useState } from "react";
import { Button, Form, Input } from "antd";
import { useCore } from "../../providers/CoreProvider.tsx";
import { HttpUrls } from "../../static-data/http-urls.ts";
import { BackResult } from "../../utils/back-result.ts";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CoreDispatch } from "../../store";
import { decodeJwt } from "jose";
import { TokenNames } from "../../static-data/token-names.ts";
import { useDispatch } from "react-redux";

export interface SignInForms {
  username: string;
  password: string;
  token: string;
}
export const SignInPage = () => {
  const { core } = useCore();
  const navigate = useNavigate();

  const dispatch = useDispatch<CoreDispatch>();

  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  function handleFinish(values: SignInForms) {
    setLoading(true);
    core.axios
      .post(HttpUrls.auth.signIn, values, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        const backResult = res as unknown as BackResult<string>;

        if (backResult.code === 200) {
          core.showSuccessMessage("登录成功");
          localStorage.setItem(TokenNames.AUTHORIZATION_TOKEN, backResult.data);

          const payload = decodeJwt(backResult.data);
          dispatch({
            type: "core/setUserInfo",
            payload: {
              id: payload.id,
              username: payload.username,
              nickname: payload.nickname,
            },
          });
          let url: string;
          if (searchParams) {
            const sp = searchParams.get("sp");
            searchParams.delete("sp");
            const searchParamsString = searchParams.toString();

            if (sp) {
              url = sp;
              if (searchParamsString) {
                url += "?" + searchParamsString;
              }
            } else {
              url = "/";
            }
          } else {
            url = "/";
          }
          navigate(url);
        } else {
          core.showErrorMessage(backResult.error, backResult.detail);
        }
      })
      .catch(() => {
        window.turnstile?.reset();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <div className={"w-full h-full flex justify-center items-center"}>
        <div className={"w-96 bg-white rounded-sm"}>
          <div className={"p-5 text-gray-700 font-bold text-xl"}>
            Quick Starter 登录
          </div>
          <div className={"m-5 box-border"}>
            <Form
              form={form}
              initialValues={{
                username: "",
                password: "",
                token: "",
              }}
              onFinish={handleFinish}
            >
              <Form.Item<SignInForms>
                name="username"
                hasFeedback
                rules={[{ required: true, message: "必须输入用户名" }]}
              >
                <Input placeholder="请输入账户名" size={"large"} allowClear />
              </Form.Item>
              <Form.Item<SignInForms>
                name="password"
                hasFeedback
                rules={[{ required: true, message: "必须输入密码" }]}
              >
                <Input
                  type="password"
                  size={"large"}
                  placeholder="请输入密码"
                  allowClear
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  block
                  htmlType={"submit"}
                  loading={loading}
                  size={"large"}
                >
                  登录
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="default" block htmlType={"submit"} size={"large"}>
                  重置
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
