import {
  Button,
  Checkbox,
  Divider,
  Progress,
  Space,
  Tabs,
  TabsProps,
} from "antd";
import { useEffect, useState } from "react";
import {
  ColumnMetadata,
  NameAndComment,
  TemplateConfig,
} from "../../../../@types/global";
import {
  GenerateCodeResult,
  NunjucksUtil,
} from "../../../../utils/nunjucks-util.tsx";
import { GenerateCodeComponent } from "./components/GenerateCodeComponent";
import { useCore } from "../../../../providers/CoreProvider.tsx";

export interface ProgressStatus {
  progress: number;
  total: number;
}

export interface GenerateCodePanelProps {
  templateContents?: Map<string, string>;
  databaseName?: string;
  tableInfo?: NameAndComment;
  columnsInfo?: ColumnMetadata[];
  templateGroupName?: string;
  templateConfigs?: TemplateConfig[];

  onGenerateCode?: () => void;
  onWrite2File?: (codes: GenerateCodeResult[]) => void;
  progressStatus?: ProgressStatus;
  loading?: boolean;
}

export const GenerateCodePanel = (props: GenerateCodePanelProps) => {
  const { core } = useCore();

  const [nunjucksUtil, setNunjucksUtil] = useState<NunjucksUtil | undefined>(
    void 0,
  );

  const [codes, setCodes] = useState<GenerateCodeResult[]>([]);
  const [tabsItems, setTabsItems] = useState<TabsProps["items"]>();
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [allChecked, setAllChecked] = useState<boolean | undefined>(void 0);
  const [activeKey, setActiveKey] = useState<string>("");
  function handleOutputPathChange(outputPath: string, index: number) {
    const temp = codes.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          outputPath: outputPath,
        };
      }
      return item;
    });
    setCodes(temp);
  }

  function getChecked(index: number) {
    return checkedList.includes(index);
  }

  function handleCheckChange(checked: boolean, index: number) {
    if (checked) {
      const tempList: number[] = [...checkedList, index];
      setCheckedList(tempList);
      if (tempList?.length === codes?.length) {
        setAllChecked(true);
      } else {
        setAllChecked(void 0);
      }
    } else {
      const tempList: number[] = checkedList.filter((item) => item !== index);
      setCheckedList(tempList);
      if (tempList?.length === 0) {
        setAllChecked(false);
      } else {
        setAllChecked(void 0);
      }
    }
  }

  function handleAllCheckedChange() {
    if (!allChecked) {
      const tempList: number[] = Array.from(
        { length: codes.length },
        (_, i) => i,
      );
      setCheckedList(tempList);
    } else {
      setCheckedList([]);
    }
    setAllChecked(!allChecked);
  }

  function handleBatchWrite2File() {
    if (!checkedList || checkedList.length === 0) {
      core.showErrorMessage("请先选择一个以上的文件");
      return;
    }
    core.modal.confirm({
      title: "警告",
      content: "批量写入将覆盖原文件，确认要继续吗?",
      okText: "确定",
      cancelText: "取消",
      centered: true,
      onOk() {
        const checkedItems = checkedList.map((index) => codes[index]);

        props.onWrite2File?.(checkedItems);
      },
      onCancel() {},
    });
  }

  useEffect(() => {
    if (!props.templateContents || props.templateContents.size === 0) {
      return;
    }
    if (!nunjucksUtil) {
      return;
    }
    const codeResult: GenerateCodeResult[] = [];
    for (const key of props.templateContents.keys()) {
      const templateContent = props.templateContents.get(key);
      if (!templateContent) {
        continue;
      }
      const templateConfig = nunjucksUtil.getTemplateConfig(key);
      if (!templateConfig) {
        continue;
      }
      try {
        const codeContent = nunjucksUtil.render(
          templateContent,
          templateConfig,
        );
        codeResult.push(codeContent);
      } catch (e) {
        const { message } = e as Error;
        core.showErrorMessage("模板渲染失败", message);
      }
    }
    setCodes(codeResult ?? []);
  }, [props.templateContents, nunjucksUtil]);

  useEffect(() => {
    if (
      !(
        props.databaseName &&
        props.tableInfo &&
        props.columnsInfo &&
        props.templateConfigs
      )
    ) {
      setNunjucksUtil(void 0);
      return;
    }

    setNunjucksUtil(
      new NunjucksUtil({
        databaseName: props.databaseName,
        tableInfo: props.tableInfo,
        columnInfos: props.columnsInfo,
        templateConfigs: props.templateConfigs,
      }),
    );
  }, [
    props.databaseName,
    props.tableInfo,
    props.columnsInfo,
    props.templateConfigs,
  ]);

  useEffect(() => {
    setAllChecked(false);
    setCheckedList([]);

    const items: TabsProps["items"] = codes.map((item, index: number) => {
      return {
        label: `[${item.templateName.replace(".njk", "")}]-${item.name}`,
        key: item.templateName.replace(".njk", ""),
        children: (
          <GenerateCodeComponent
            loading={props.loading}
            onOutputPathChange={function (outputPath: string): void {
              handleOutputPathChange(outputPath, index);
            }}
            onWrite2File={function () {
              props.onWrite2File?.([item]);
            }}
            {...item}
          />
        ),
      };
    });

    setTabsItems(items);
  }, [codes]);

  return (
    <>
      <div className={"flex justify-end pb-3 mb-3 border-b border-gray-300"}>
        <Button type={"primary"} onClick={props.onGenerateCode}>
          生成
        </Button>
      </div>

      {props.templateContents === undefined ? (
        void 0
      ) : (
        <>
          <Space direction={"vertical"} className={"w-full"}>
            <Space wrap={true}>
              <Checkbox
                checked={allChecked}
                indeterminate={allChecked === void 0}
                onChange={handleAllCheckedChange}
              >
                全选
              </Checkbox>
              {codes.map((code, index: number) => (
                <Checkbox
                  key={index}
                  checked={getChecked(index)}
                  onChange={(e) => {
                    handleCheckChange(e.target.checked, index);
                  }}
                  onClick={() => {
                    setActiveKey(code.templateName.replace(".njk", ""));
                  }}
                >{`[${code.templateName.replace(".njk", "")}]-${code.name}`}</Checkbox>
              ))}
            </Space>
            <div className={"text-end"}>
              <Button
                type={"primary"}
                danger
                onClick={handleBatchWrite2File}
                loading={props.loading}
              >
                批量写入
              </Button>
            </div>
            {props.progressStatus ? (
              <div>
                <Progress
                  percent={
                    (props.progressStatus.progress /
                      props.progressStatus.total) *
                    100
                  }
                  percentPosition={{ align: "center", type: "outer" }}
                  size="default"
                  format={() =>
                    `${props.progressStatus?.progress}/${props.progressStatus?.total}`
                  }
                />
              </div>
            ) : (
              void 0
            )}
            <Divider />
            <Tabs
              type={"card"}
              items={tabsItems}
              activeKey={activeKey}
              onChange={(key) => {
                setActiveKey(key);
              }}
            />
          </Space>

          <div
            className={"flex justify-end mt-3 pt-3 border-t border-gray-300"}
          >
            <Button type={"primary"} onClick={props.onGenerateCode}>
              生成
            </Button>
          </div>
        </>
      )}
    </>
  );
};
