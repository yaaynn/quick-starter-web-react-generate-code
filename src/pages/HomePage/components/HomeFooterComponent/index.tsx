import dayjs from "dayjs";

export interface HomeFooterComponentProps {
  ipc?: string;
}
export const HomeFooterComponent = (props: HomeFooterComponentProps) => {
  function renderCopyright(startYear: number) {
    const year = dayjs().year();
    let copyrightYear = year.toString();
    if (startYear !== year) {
      copyrightYear = `${startYear}-${year}`;
    }
    return `Copyright © ${copyrightYear} idatac.com Technology Co.,  idatac.com 版权所有 ©
              ${copyrightYear} idatac.com保留所有权利。`;
  }
  // style="vertical-align: middle; width: 16px; height: 16px;"

  return (
    <>
      <div className={"bg-white h-full flex justify-center items-center"}>
        <p className={"text-gray-400"}>
          {renderCopyright(2025)}|
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            className={"ml-3 mr-3"}
          >
            {props.ipc}
          </a>
          |
          <a
            href={`https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=XXXXXXXXXX`}
            target="_blank"
            className={"ml-3"}
          >
            <img
              src="https://www.beian.gov.cn/img/ghs.png"
              alt="公网安备图标"
              className={"inline-block mr-2"}
            />
            暂无
          </a>
        </p>
      </div>
    </>
  );
};
