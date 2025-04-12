import { Menu, MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];
export interface HomeSidebarComponentProps {
  menuItems: MenuItem[];
  onClick: MenuProps["onClick"];
  onSelect: MenuProps["onSelect"];
  onOpenChange: MenuProps["onOpenChange"];
  defaultSelectedKeys?: string[];
  defaultOpenKeys?: string[];
  openKeys?: string[];
  onSelectCapture?: MenuProps["onSelectCapture"];
  selectedKeys?: string[];
  isAllowSelectText?: boolean;
}
export const HomeSidebarComponent = (props: HomeSidebarComponentProps) => {
  const handleClick: MenuProps["onClick"] = (e: any) => {
    props.onClick?.(e);
  };

  const handleSelect: MenuProps["onSelect"] = (e: any) => {
    props.onSelect?.(e);
  };
  const handleOpenChange: MenuProps["onOpenChange"] = (keys: string[]) => {
    props.onOpenChange?.(keys);
  };
  const handleSelectCapture: MenuProps["onSelectCapture"] = (e: any) => {
    props.onSelectCapture?.(e);
  };
  return (
    <div className={"w-full h-full overflow-auto"}>
      <Menu
        rootClassName={`h-full ${props.isAllowSelectText ? "" : "select-none"} `}
        onClick={handleClick}
        onSelect={handleSelect}
        onOpenChange={handleOpenChange}
        openKeys={props.openKeys}
        onSelectCapture={handleSelectCapture}
        selectedKeys={props.defaultSelectedKeys}
        defaultSelectedKeys={props.defaultSelectedKeys}
        defaultOpenKeys={props.defaultOpenKeys}
        mode="inline"
        items={props.menuItems}
      />
    </div>
  );
};
