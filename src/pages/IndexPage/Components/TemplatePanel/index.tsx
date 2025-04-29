import {
  Button,
  Checkbox,
  Collapse,
  CollapseProps,
  Form,
  List,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { KeyAndValue, TemplateConfig } from "../../../../@types/global";
import { useEffect, useRef, useState } from "react";
import { FinalInput } from "../../../../components/FinalInput.tsx";

export interface TemplatePanelProps {
  templateGroupNames?: string[];
  templateGroupName?: string;
  templateConfigNames?: string[];
  templateConfigName?: string;

  templateNames?: string[];
  templateConfigs?: TemplateConfig[];
  onTemplateConfigsChange: (templateConfigs?: TemplateConfig[]) => void;
  onTemplateGroupNameChange?: (groupName: string) => void;
  onSaveTemplateConfig?: (templateConfig: TemplateConfig[] | undefined) => void;

  onTemplateConfigNameChange?: (templateConfigName: string) => void;
}
const { Title } = Typography;

export const TemplatePanel = (props: TemplatePanelProps) => {
  const [items, setItems] = useState<CollapseProps["items"]>([]);

  const fileType = ["java", "js", "ts", "jsx", "tsx", "python", "xml"];
  const templateConfigs = useRef<TemplateConfig[] | undefined>(void 0);
  const templateGroupNames = useRef<string[] | undefined>(void 0);

  function handleTemplateGroupNameChange(groupName: string) {
    props.onTemplateGroupNameChange?.(groupName);
  }
  function handleTemplateConfigNameChange(templateConfigName: string) {
    props.onTemplateConfigNameChange?.(templateConfigName);
  }

  function handleTemplateConfigValueChange(
    name: string,
    key: keyof TemplateConfig,
    value: string | KeyAndValue[],
  ) {
    const newConfig = props.templateConfigs?.map((templateConfig) => {
      if (templateConfig.name === name) {
        return {
          ...templateConfig,
          [key]: value,
        };
      }
      return templateConfig;
    });
    props.onTemplateConfigsChange?.(newConfig);
  }

  function checkTemplateConfigsChange() {
    if (
      props.templateConfigs === templateConfigs.current &&
      props.templateGroupNames === templateGroupNames.current
    ) {
      return false;
    }

    templateConfigs.current = props.templateConfigs;
    templateGroupNames.current = props.templateGroupNames;
    return true;
  }

  function isChecked(value: string | number) {
    return value !== void 0 && value !== "";
  }
  useEffect(() => {
    if (!props.templateNames) {
      props.onTemplateConfigsChange?.([]);
      return;
    }
    if (!checkTemplateConfigsChange()) return;

    const temp = props.templateNames.map((item) => {
      const config = props.templateConfigs?.find(
        (templateConfig) => templateConfig.name === item,
      );
      if (config) {
        return config;
      }
      return {
        name: item,
        outputPath: "",
        extension: "",
        codeType: "",
        naming: "{{ name | toPascalCase }}",
        additions: [],
      };
    });

    templateConfigs.current = temp;

    props.onTemplateConfigsChange?.(temp);
  }, [props.templateConfigs, props.templateNames]);

  useEffect(() => {
    if (!props.templateConfigs || props.templateConfigs.length === 0) {
      setItems([]);
      return;
    }

    const temp: CollapseProps["items"] | undefined =
      props.templateConfigs?.map((item: TemplateConfig, index: number) => {
        return {
          key: index,
          label: (
            <div className={"w-full flex justify-between"}>
              <div>{item.name}</div>
              <Space>
                <Checkbox checked={isChecked(item.outputPath)}>
                  输出路径
                </Checkbox>
                <Checkbox checked={isChecked(item.extension)}>
                  文件扩展
                </Checkbox>
                <Checkbox checked={isChecked(item.codeType)}>代码类型</Checkbox>
                <Checkbox checked={isChecked(item.naming)}>代码类型</Checkbox>
              </Space>
            </div>
          ),
          children: (
            <div key={item.name}>
              <Title level={3}>{item.name.replace(".njk", "")}</Title>
              <Form layout={"vertical"}>
                <Form.Item label={"输出路径"}>
                  <FinalInput
                    placeholder={`请输入[${item.name.replace(".njk", "")}]输出路径`}
                    value={item.outputPath ?? ""}
                    onFinalChange={(e) => {
                      handleTemplateConfigValueChange(
                        item.name,
                        "outputPath",
                        e.target.value,
                      );
                    }}
                  />
                </Form.Item>
                <Form.Item noStyle={true}>
                  <Space>
                    <Form.Item label={"模板后缀"}>
                      <Select
                        style={{ width: 200 }}
                        value={item.extension}
                        onChange={(value) => {
                          handleTemplateConfigValueChange(
                            item.name,
                            "extension",
                            value,
                          );
                        }}
                      >
                        {fileType.map((item) => (
                          <Select.Option value={`.${item}`} key={item}>
                            {`.${item}`}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label={"模板代码类型"}>
                      <Select
                        style={{ width: 280 }}
                        value={item.codeType}
                        onChange={(value) => {
                          handleTemplateConfigValueChange(
                            item.name,
                            "codeType",
                            value,
                          );
                        }}
                      >
                        {fileType.map((item) => (
                          <Select.Option value={item} key={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label={"命名规则"}>
                      <Space>
                        <Form.Item noStyle>
                          <FinalInput
                            placeholder={"请输入命名规则"}
                            style={{ width: 260 }}
                            value={item.naming}
                            onFinalChange={(e) => {
                              handleTemplateConfigValueChange(
                                item.name,
                                "naming",
                                e.target.value,
                              );
                            }}
                          />
                        </Form.Item>
                        <Tooltip
                          color={"white"}
                          title={
                            <>
                              <Space direction={"vertical"}>
                                <div className={"text-black"}>
                                  {
                                    "名称使用{{ name }}代替,名称格式使用{{ name | [转换方式]}},不用输入后缀"
                                  }
                                </div>
                                <List
                                  bordered
                                  dataSource={[
                                    "toApacheCase: 转换为阿帕奇,[Variable-Name]",
                                    "toPascalCase: 转换为帕斯卡,[VariableName]",
                                    "toCamelCase: 转换为驼峰,[variableName]",
                                  ]}
                                  renderItem={(item: string) => (
                                    <List.Item>{item}</List.Item>
                                  )}
                                />
                              </Space>
                            </>
                          }
                        >
                          <Button type={"link"}>帮助信息</Button>
                        </Tooltip>
                      </Space>
                    </Form.Item>
                  </Space>
                </Form.Item>
                <Form.Item noStyle={true}>
                  {item.additions?.map((addition, index) => {
                    return (
                      <div
                        className={"w-full flex justify-between"}
                        key={index}
                      >
                        <div style={{ width: "49%" }}>
                          <Form.Item label={"Key"}>
                            <FinalInput
                              placeholder={"请输入Key"}
                              value={addition.key}
                              onFinalChange={(e) => {
                                const newAdditions = item.additions?.map(
                                  (temp, i) => {
                                    if (i === index) {
                                      return {
                                        ...temp,
                                        key: e.target.value,
                                      };
                                    }
                                    return temp;
                                  },
                                );
                                handleTemplateConfigValueChange(
                                  item.name,
                                  "additions",
                                  newAdditions ?? [],
                                );
                              }}
                            />
                          </Form.Item>
                        </div>
                        <div style={{ width: "49%" }}>
                          <Form.Item label={"Value"}>
                            <FinalInput
                              placeholder={"请输入Key"}
                              value={addition.value}
                              onFinalChange={(e) => {
                                const newAdditions = item.additions?.map(
                                  (temp, i) => {
                                    if (i === index) {
                                      return {
                                        ...temp,
                                        value: e.target.value,
                                      };
                                    }
                                    return temp;
                                  },
                                );
                                handleTemplateConfigValueChange(
                                  item.name,
                                  "additions",
                                  newAdditions ?? [],
                                );
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    );
                  })}
                </Form.Item>
                <Form.Item>
                  <Button
                    type={"primary"}
                    block={true}
                    onClick={() => {
                      handleTemplateConfigValueChange(item.name, "additions", [
                        ...(item.additions ?? []),
                        { key: "", value: "" },
                      ]);
                    }}
                  >
                    添加新属性
                  </Button>
                </Form.Item>
              </Form>
            </div>
          ),
        };
      }) ?? [];
    setItems(temp ?? []);
  }, [props.templateConfigs]);

  return (
    <>
      <div>
        <Form>
          <Form.Item noStyle>
            <div className={"w-full flex"}>
              <div className={"w-1/2 pr-2"}>
                <Form.Item label={"模板组"}>
                  <Select
                    onChange={(value) => {
                      handleTemplateGroupNameChange(value);
                    }}
                    value={props.templateGroupName}
                  >
                    {props.templateGroupNames?.map((item, i) => (
                      <Select.Option key={i} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className={"w-1/2 pl-2"}>
                <Form.Item label={"模板配置"}>
                  <Select
                    onChange={(value) => {
                      handleTemplateConfigNameChange(value);
                    }}
                    value={props.templateConfigName}
                  >
                    {props.templateConfigNames?.map((item, i) => (
                      <Select.Option key={i} value={item}>
                        {item.replace(".json", "")}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>

      {props.templateNames && props.templateNames?.length > 0 ? (
        <div>
          <Space direction={"vertical"} className={"w-full"}>
            <Collapse items={items} defaultActiveKey={[]} />
            <div className={"flex justify-end"}>
              <Space direction={"vertical"}>
                <Button
                  type={"primary"}
                  onClick={() => {
                    props.onSaveTemplateConfig?.(props.templateConfigs);
                  }}
                >
                  修改
                </Button>

                <Tag color="error">修改路径之后一定要保存</Tag>
              </Space>
            </div>
          </Space>
        </div>
      ) : (
        void 0
      )}
    </>
  );
};
