import { ContainerComponent } from "../../components/ContainerComponent";
import { DatabasePanel } from "./Components/DatabasePanel";
import { useCore } from "../../providers/CoreProvider.tsx";
import { useEffect, useRef, useState } from "react";
import {
  ColumnMetadata,
  NameAndComment,
  TemplateConfig,
} from "../../@types/global";
import { HttpUrls } from "../../static-data/http-urls.ts";
import { BackResult, BackResultError } from "../../utils/back-result.ts";
import { DatabaseColumnTable } from "./Components/DatabaseColumnTable";
import { TemplatePanel } from "./Components/TemplatePanel";
import { Button, Collapse, CollapseProps, Modal, Space } from "antd";
import {
  GenerateCodePanel,
  ProgressStatus,
} from "./Components/GenerateCodePanel";
import { GenerateCodeResult } from "../../utils/nunjucks-util.tsx";
import { RedoOutlined } from "@ant-design/icons";

// 定义用户选择类型
type UserDecision = "yes" | "no" | "yes_all" | "no_all" | "cancel";

export const IndexPage = () => {
  const { core } = useCore();

  const [databaseNames, setDatabaseNames] = useState<NameAndComment[]>([]);
  const [databaseName, setDatabaseName] = useState<string | undefined>(void 0);
  const [tableInfos, setTableInfos] = useState<NameAndComment[]>([]);
  const [tableInfo, setTableInfo] = useState<NameAndComment | undefined>();

  const [columnsDataSource, setColumnsDataSource] = useState<ColumnMetadata[]>(
    [],
  );

  const [templateGroupNames, setTemplateGroupNames] = useState<
    string[] | undefined
  >([]);
  const [templateNames, setTemplateNames] = useState<string[] | undefined>([]);
  const [templateConfig, setTemplateConfig] = useState<
    TemplateConfig[] | undefined
  >();

  const [templateGroupName, setTemplateGroupName] = useState<string>("");

  const [templateContents, setTemplateContents] = useState<
    Map<string, string> | undefined
  >();
  const [progressStatus, setProgressStatus] = useState<
    ProgressStatus | undefined
  >(void 0);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState<boolean>(false);
  const [currentCode, setCurrentCode] = useState<
    GenerateCodeResult | undefined
  >(void 0);

  const topCover = useRef<boolean>(false);
  const topForce = useRef<boolean>(false);

  const resolveUserChoice =
    useRef<(value: UserDecision) => void | undefined>(void 0);

  // region 数据库操作
  function doRefreshDatabaseNames() {
    core.showLoading("Loading...");
    setDatabaseName(void 0);
    core.axios
      .get(HttpUrls.database.names)
      .then((res) => {
        const result = res as unknown as BackResult<NameAndComment[]>;
        if (result.code === 200) {
          setDatabaseNames(result.data);

          setTableInfo(void 0);
          setTableInfos([]);
          setColumnsDataSource([]);
        }
      })
      .finally(() => {
        core.closeLoading();
      });
  }
  function handleDatabaseNameChange(name: string) {
    setDatabaseName(name);
    if (!name) {
      setTableInfos([]);
      return;
    }
    doRefreshTableInfos(name);
  }

  function doRefreshTableInfos(name: string) {
    core.showLoading("Loading...");
    core.axios
      .get(HttpUrls.database.tables, {
        params: {
          databaseName: name,
        },
      })
      .then((res) => {
        const result = res as unknown as BackResult<NameAndComment[]>;
        if (result.code === 200) {
          setTableInfos(result.data);
        }
      })
      .finally(() => {
        core.closeLoading();
      });
  }

  function handleTableInfoChange(
    databaseName?: string,
    tableInfo?: NameAndComment,
  ) {
    setDatabaseName(databaseName);
    setTableInfo(tableInfo);

    if (!tableInfo || !databaseName) {
      setColumnsDataSource([]);
      return;
    }

    doRefreshColumns(databaseName, tableInfo);
  }

  function doRefreshColumns(databaseName: string, tableInfo: NameAndComment) {
    core.showLoading("Loading...");
    core.axios
      .get(HttpUrls.database.columns, {
        params: {
          databaseName: databaseName,
          tableName: tableInfo.name,
        },
      })
      .then((res) => {
        const result = res as unknown as BackResult<ColumnMetadata[]>;
        if (result.code === 200) {
          result.data.forEach((item: ColumnMetadata) => {
            item.insert = true;
            item.remove = true;
            item.update = true;
            item.search = true;
            item.advancedSearch = true;
          });

          setColumnsDataSource(result.data);
        }
      })
      .finally(() => {
        core.closeLoading();
      });
  }

  function handleDatasourceChange(newDatasource?: ColumnMetadata[]) {
    setColumnsDataSource(newDatasource ?? []);
  }
  // endregion

  // region 模板
  function doRefreshTemplate() {
    core.axios.get(HttpUrls.template.getTemplateGroupNames).then((res) => {
      const result = res as unknown as BackResult<string[]>;

      if (result.code === 200) {
        setTemplateGroupNames(result.data);
        if (!result.data.includes(templateGroupName)) {
          setDatabaseName(void 0);
        }
      } else {
        setTemplateGroupNames([]);
        setDatabaseName(void 0);
      }
    });
  }

  function doRefreshTemplateNames(name: string) {
    core.showLoading("Loading...");
    core.axios
      .get(HttpUrls.template.getTemplateNames, { params: { groupName: name } })
      .then((res) => {
        const result = res as unknown as BackResult<string[]>;
        if (result.code === 200) {
          setTemplateNames(result.data);
          doRefreshTemplateConfig(name);
        }
      })
      .catch(() => {
        core.closeLoading();
      });
  }
  function doRefreshTemplateConfig(name: string) {
    core.axios
      .get(HttpUrls.template.getTemplateConfig, {
        params: { groupName: name },
      })
      .then((res) => {
        const result = res as unknown as BackResult<string>;
        if (result.code === 200) {
          if (result.data) {
            setTemplateConfig(JSON.parse(result.data));
          } else {
            setTemplateConfig(void 0);
          }
        }
      })
      .finally(() => {
        core.closeLoading();
      });
  }

  function handleTemplateGroupNameChange(name: string) {
    setTemplateGroupName(name);
    doRefreshTemplateNames(name);
  }

  function handleSaveTemplateConfig(
    templateConfig: TemplateConfig[] | undefined,
  ) {
    const config = JSON.stringify(templateConfig);
    doSaveTemplateConfig(config);
    setTemplateConfig(templateConfig);
  }
  function doSaveTemplateConfig(config: string) {
    core.showLoading("Loading...");
    core.axios
      .post(
        HttpUrls.template.saveTemplateConfig,
        {
          groupName: templateGroupName,
          templateConfig: config,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )
      .then(() => {
        core.showSuccessMessage("修改配置成功");
      })
      .finally(() => {
        core.closeLoading();
      });
  }
  // endregion

  // region 代码生成

  function doGetTemplateContent() {
    core.axios
      .get(HttpUrls.template.getTemplateContent, {
        params: {
          groupName: templateGroupName,
        },
      })
      .then((res) => {
        const result = res as unknown as BackResult<Map<string, string>>;

        if (result.code === 200) {
          const newContent: Map<string, string> = new Map(
            Object.entries(result.data),
          );

          setTemplateContents(newContent);
        }
      });
  }

  function handleGenerateCode() {
    doGetTemplateContent();
  }
  // endregion

  // region 代码写入
  function initialWriteEvn() {
    topCover.current = false;
    topForce.current = false;
  }
  function waitUserDecision() {
    setOpen(true);

    return new Promise<UserDecision>((resolve) => {
      resolveUserChoice.current = resolve;
    });
  }
  async function doWriteCode2File(
    output: string,
    content: string,
    cover: boolean = false,
    force: boolean = false,
  ) {
    try {
      await core.axios.post(
        HttpUrls.generateCode.writeCode2File,
        {
          filePath: output,
          content: content,
          cover: cover,
          force: force,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      core.showSuccessMessage("写入成功");
    } catch (e: any) {
      const { result } = e as BackResultError;
      if (!result) return;

      if (result.cb === "cover") {
        const userChoice = await waitUserDecision();
        resolveUserChoice.current = void 0;

        setOpen(false);
        switch (userChoice) {
          case "yes":
            await doWriteCode2File(output, content, true, force);
            break;
          case "yes_all":
            topCover.current = true;
            topForce.current = true;
            await doWriteCode2File(output, content, true, true);
            break;
          case "no_all":
            topCover.current = false;
            topForce.current = true;
            core.showErrorMessage("跳过当前文件");
            break;
          case "no":
          case "cancel":
            core.showErrorMessage("跳过当前文件");
            break;
        }
      } else {
        core.showErrorMessage("写入失败");
      }
    }
  }

  async function handleWrite2File(codes: GenerateCodeResult[]) {
    if (!codes || codes.length === 0) {
      core.showErrorMessage("请选择要生成的文件");
    }
    setLoading(true);
    initialWriteEvn();
    try {
      if (codes.length === 1) {
        setProgressStatus(void 0);
        await doWriteCode2File(codes[0].outputPath, codes[0].content);
      } else {
        setProgressStatus({
          progress: 0,
          total: codes.length,
        });

        for (const code of codes) {
          setCurrentCode(code);
          await doWriteCode2File(
            code.outputPath,
            code.content,
            topCover.current,
            topForce.current,
          );
          setProgressStatus((prevState) => {
            if (!prevState) return void 0;
            return {
              progress: prevState.progress + 1,
              total: prevState.total,
            };
          });
        }
      }
    } finally {
      initialWriteEvn();
      setLoading(false);
    }
  }
  // endregion
  useEffect(() => {
    doRefreshDatabaseNames();
    doRefreshTemplate();
  }, []);

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className={"flex justify-between"}>
          <span>数据库配置</span>
          <Button
            type={"text"}
            icon={<RedoOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡
              doRefreshDatabaseNames();
            }}
          ></Button>
        </div>
      ),
      children: (
        <div
          style={{ maxHeight: "80vh" }}
          className={"overflow-y-auto p-1 box-border flex flex-col"}
        >
          <DatabasePanel
            databaseName={databaseName}
            databaseNames={databaseNames}
            tableInfos={tableInfos}
            onDatabaseChange={handleDatabaseNameChange}
            onTableChange={handleTableInfoChange}
          >
            {columnsDataSource && columnsDataSource.length > 0 ? (
              <DatabaseColumnTable
                dataSource={columnsDataSource}
                onDataSourceChange={handleDatasourceChange}
              />
            ) : (
              void 0
            )}
          </DatabasePanel>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className={"flex justify-between"}>
          <span>模板配置</span>
          <Button
            type={"text"}
            icon={<RedoOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡
              doRefreshTemplate();
            }}
          ></Button>
        </div>
      ),
      children: (
        <TemplatePanel
          templateGroupNames={templateGroupNames}
          templateNames={templateNames}
          templateConfig={templateConfig}
          onTemplateGroupNameChange={handleTemplateGroupNameChange}
          onSaveTemplateConfig={handleSaveTemplateConfig}
        ></TemplatePanel>
      ),
    },
    {
      key: "3",
      label: "代码生成",
      children: (
        <GenerateCodePanel
          progressStatus={progressStatus}
          loading={loading}
          databaseName={databaseName}
          tableInfo={tableInfo}
          columnsInfo={columnsDataSource}
          templateContents={templateContents}
          templateConfigs={templateConfig}
          templateGroupName={templateGroupName}
          onGenerateCode={handleGenerateCode}
          onWrite2File={handleWrite2File}
        ></GenerateCodePanel>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={open}
        title={"覆盖警告"}
        footer={
          <Space>
            <Button
              type={"primary"}
              onClick={() => {
                resolveUserChoice.current?.("yes");
              }}
            >
              覆盖
            </Button>
            <Button
              onClick={() => {
                resolveUserChoice.current?.("yes_all");
              }}
            >
              全部覆盖
            </Button>
            <Button
              onClick={() => {
                resolveUserChoice.current?.("no");
              }}
            >
              不覆盖
            </Button>
            <Button
              onClick={() => {
                resolveUserChoice.current?.("no_all");
              }}
            >
              全部不覆盖
            </Button>
            <Button
              onClick={() => {
                resolveUserChoice.current?.("cancel");
              }}
            >
              跳过
            </Button>
          </Space>
        }
      >
        <Space direction={"vertical"}>
          <div className={"rounded-xl bg-gray-300"}>
            {currentCode?.outputPath}
          </div>
          <div>当前文件已存在,是否覆盖?</div>
        </Space>
      </Modal>
      <ContainerComponent isShadow={true} className={"min-h-full box-border"}>
        <Collapse items={items} defaultActiveKey={["1"]} />
      </ContainerComponent>
    </>
  );
};
