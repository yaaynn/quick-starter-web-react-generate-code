import { ReactNode } from "react";
import { Splitter } from "antd";

export interface MainLayoutProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}
export const MainLayout = (props: MainLayoutProps) => {
  return (
    <>
      <div className={"w-full h-full flex flex-col border-t border-gray-400"}>
        <div className={"h-12 shadow-lg"}>{props.header}</div>
        <div className={"flex-1"}>
          <Splitter style={{ height: "100%" }}>
            <Splitter.Panel defaultSize={300} min={100} max="30%">
              {props.sidebar}
            </Splitter.Panel>
            <Splitter.Panel className={"relative"}>
              <div className="overflow-hidden absolute top-0 left-0 right-0 bottom-0">
                <div
                  className={"box-border overflow-y-auto relative p-5"}
                  style={{ height: "calc(100% - 28px)" }}
                >
                  {props.children}
                </div>
                <div className={"h-7 border-t border-gray-300"}>
                  {props.footer}
                </div>
              </div>
            </Splitter.Panel>
          </Splitter>
        </div>
      </div>
    </>
  );
};
