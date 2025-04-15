import {
  Button,
  Checkbox,
  Collapse,
  CollapseProps,
  Form,
  Input,
  List,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { TemplateConfig } from "../../../../@types/global";
import { useEffect, useState } from "react";

export interface TemplatePanelProps {
  templateGroupNames?: string[];
  templateNames?: string[];
  templateConfig?: TemplateConfig[];
  onTemplateGroupNameChange?: (groupName: string) => void;
  onSaveTemplateConfig?: (templateConfig: TemplateConfig[] | undefined) => void;
}
const { Title } = Typography;

export const TemplatePanel = (props: TemplatePanelProps) => {
  const [templateConfigs, setTemplateConfigs] = useState<
    TemplateConfig[] | undefined
  >();
  const [items, setItems] = useState<CollapseProps["items"]>([]);

  function handleTemplateGroupNameChange(groupName: string) {
    props.onTemplateGroupNameChange?.(groupName);
  }

  function handleTemplateConfigValueChange(
    name: string,
    key: keyof TemplateConfig,
    value: string,
  ) {
    const newConfig = templateConfigs?.map((templateConfig) => {
      if (templateConfig.name === name) {
        return {
          ...templateConfig,
          [key]: value,
        };
      }
      return templateConfig;
    });
    setTemplateConfigs(newConfig);
  }
  function isChecked(value: string | number) {
    return value !== void 0 && value !== "";
  }
  useEffect(() => {
    if (!props.templateNames) {
      setTemplateConfigs([]);
      return;
    }

    const temp = props.templateNames.map((item) => {
      const config = props.templateConfig?.find(
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
      };
    });
    setTemplateConfigs(temp);
  }, [props.templateConfig, props.templateNames]);

  useEffect(() => {
    if (!templateConfigs || templateConfigs.length === 0) {
      setItems([]);
      return;
    }
    const temp: CollapseProps["items"] | undefined =
      templateConfigs.map((item: TemplateConfig, index: number) => {
        return {
          key: index,
          label: (
            <Space>
              <div>{item.name}</div>
              <Checkbox checked={isChecked(item.outputPath)}>输出路径</Checkbox>
              <Checkbox checked={isChecked(item.extension)}>文件扩展</Checkbox>
              <Checkbox checked={isChecked(item.codeType)}>代码类型</Checkbox>
              <Checkbox checked={isChecked(item.naming)}>代码类型</Checkbox>
            </Space>
          ),
          children: (
            <div key={item.name}>
              <Title level={3}>{item.name.replace(".njk", "")}</Title>
              <Form layout={"vertical"}>
                <Form.Item label={"输出路径"}>
                  <Input
                    placeholder={`请输入[${item.name.replace(".njk", "")}]输出路径`}
                    value={item.outputPath ?? ""}
                    onChange={(e) => {
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
                        {["jave", "js", "ts", "jsx", "tsx"].map((item) => (
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
                        {["jave", "js", "ts", "jsx", "tsx", "python"].map(
                          (item) => (
                            <Select.Option value={item} key={item}>
                              {item}
                            </Select.Option>
                          ),
                        )}
                      </Select>
                    </Form.Item>
                    <Form.Item label={"命名规则"}>
                      <Space>
                        <Form.Item noStyle>
                          <Input
                            placeholder={"请输入命名规则"}
                            style={{ width: 260 }}
                            value={item.naming}
                            onChange={(e) => {
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
              </Form>
            </div>
          ),
        };
      }) ?? [];
    setItems(temp ?? []);
  }, [templateConfigs]);

  return (
    <>
      <div>
        <Form>
          <Form.Item label={"模板"}>
            <Select
              onChange={(value) => {
                handleTemplateGroupNameChange(value);
              }}
            >
              {props.templateGroupNames?.map((item, i) => (
                <Select.Option key={i} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
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
                    props.onSaveTemplateConfig?.(templateConfigs);
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
