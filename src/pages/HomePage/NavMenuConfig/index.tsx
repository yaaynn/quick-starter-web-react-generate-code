import { HomeOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

export const items: MenuItem[] = [
  { key: "/", label: "首页", icon: <HomeOutlined /> },
];
