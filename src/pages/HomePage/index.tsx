import { MainLayout } from "../layouts/MainLayout.tsx";
import { HomeFooterComponent } from "./components/HomeFooterComponent";
import { HomeSidebarComponent } from "./components/HomeSidebarComponent";
import { items } from "./NavMenuConfig";
import { HomeHeaderComponent } from "./components/HomeHeaderComponent";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MenuProps } from "antd";

export const HomePage = () => {
  const location = useLocation();
  const { pathname } = location;

  const navigate = useNavigate();

  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (pathname === "/") {
      navigate("/index");
    }
  }, [pathname]);

  const handleMenuClick: MenuProps["onClick"] = () => {
    // console.log(e);
  };

  const handleMenuSelect: MenuProps["onSelect"] = (e) => {
    setSelectedKeys([e.key]);
    if (e.key === pathname) return;
    navigate(e.key);
  };

  const handleOpenChange: MenuProps["onOpenChange"] = (keys) => {
    setOpenKeys(keys);
  };

  useEffect(() => {
    setDefaultSelectedKeys([pathname]);
    if (pathname.includes("/index")) {
      setOpenKeys([]);
      setSelectedKeys(["/index"]);
      return;
    }

    const pathnameArray = pathname.split("/");
    if (pathnameArray.length > 1) {
      setOpenKeys([pathnameArray[1]]);
    }
    setSelectedKeys([pathname]);
  }, []);

  return (
    <>
      <MainLayout
        header={
          <HomeHeaderComponent nickname={"超级管理员"} title={"代码生成器"} />
        }
        sidebar={
          <HomeSidebarComponent
            menuItems={items}
            onClick={handleMenuClick}
            onSelect={handleMenuSelect}
            defaultOpenKeys={openKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            onOpenChange={handleOpenChange}
            openKeys={openKeys}
            selectedKeys={selectedKeys}
          />
        }
        footer={<HomeFooterComponent ipc={"蜀ICP备13013387号-1"} />}
      >
        <Outlet />
      </MainLayout>
    </>
  );
};
