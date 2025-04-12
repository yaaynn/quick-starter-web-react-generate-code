import { Avatar, Badge, Button, Divider, Space } from "antd";
import { BellOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { ReactNode } from "react";
import { TokenNames } from "../../../../static-data/token-names.ts";
import { useNavigate } from "react-router-dom";

export interface HomeHeaderComponentProps {
  nickname: string;
  logo?: ReactNode;
  title: string;
}
export const HomeHeaderComponent = (props: HomeHeaderComponentProps) => {
  const navigate = useNavigate();

  function handleSignOut() {
    localStorage.removeItem(TokenNames.AUTHORIZATION_TOKEN);
    navigate("/sign-in");
  }

  return (
    <>
      <div
        className={
          "flex h-full justify-between w-full border-b border-gray-200 bg-white dark:bg-cyan-900 box-border"
        }
      >
        <Space
          className={
            "flex justify-center items-center text-xl font-bold ml-8 select-none cursor-pointer hover:opacity-75"
          }
        >
          {props.logo}
          {props.title}
        </Space>
        <Space className={"flex items-center mr-8"}>
          {/*头像*/}
          <div>
            <Avatar shape="square" size={"large"} icon={<UserOutlined />} />
          </div>
          {/*昵称*/}
          <div>{props.nickname}</div>
          <Divider type="vertical" />
          {/*消息*/}
          <div
            className={
              "size-10 hover:bg-gray-200 rounded-sm flex justify-center items-center"
            }
          >
            <Badge count={5}>
              <BellOutlined style={{ fontSize: 20 }} />
            </Badge>
          </div>
          {/*设置*/}
          <div
            className={
              "size-10 hover:bg-gray-200 rounded-sm flex justify-center items-center"
            }
          >
            <SettingOutlined style={{ fontSize: 20 }} />
          </div>
          {/*退出*/}
          <div>
            <Button type="text" block size={"large"} onClick={handleSignOut}>
              退出登录
            </Button>
          </div>
        </Space>
      </div>
    </>
  );
};
