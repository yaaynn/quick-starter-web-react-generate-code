import { Button, Col, Form, Row, Select } from "antd";
import { NameAndComment } from "../../../../@types/global";
import { ReactNode, useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";

export interface DatabasePanelProps {
  databaseName?: string;
  databaseNames?: NameAndComment[];
  tableInfos?: NameAndComment[];

  onDatabaseChange?: (name: string) => void;
  onTableChange?: (databaseName?: string, tableInfo?: NameAndComment) => void;

  onRefreshDatabaseNames?: () => void;
  onRefreshTableNames?: () => void;
  onRefreshColumns?: () => void;

  children?: ReactNode | ReactNode[];
}

export const DatabasePanel = ({
  databaseName,
  databaseNames,
  tableInfos,
  onDatabaseChange,
  onTableChange,
  children,

  onRefreshColumns,
  onRefreshDatabaseNames,
  onRefreshTableNames,
}: DatabasePanelProps) => {
  const [tableName, setTableName] = useState<string | undefined>(void 0);

  function handleDatabaseChange(name: string) {
    onDatabaseChange?.(name);
  }
  function handleTableChange(name: string) {
    setTableName(name);

    if (databaseName == undefined) return;
    const tableInfo = getTableInfo(name);

    onTableChange?.(databaseName, tableInfo);
  }

  function getTableInfo(tableName: string) {
    return tableInfos?.find((tableInfo) => tableInfo.name === tableName);
  }

  useEffect(() => {
    setTableName(void 0);
  }, [databaseName]);
  return (
    <>
      <div className={"box-border  w-full p-1"}>
        <div>
          <Form className={""}>
            <Row gutter={8}>
              <Col span={10}>
                <Form.Item label={"数据库"}>
                  <Select
                    onChange={handleDatabaseChange}
                    placeholder={"请选择一个数据库"}
                    disabled={!databaseNames || databaseNames.length === 0}
                    value={databaseName}
                    showSearch={true}
                    options={databaseNames?.map((item) => {
                      return {
                        value: item.name,
                        label: item.comment ?? item.name,
                      };
                    })}
                  ></Select>
                </Form.Item>
              </Col>
              <Col
                span={1}
                onClick={() => {
                  onRefreshDatabaseNames?.();
                }}
              >
                <Button icon={<ReloadOutlined />}></Button>
              </Col>
              <Col span={10}>
                <Form.Item label={"数据表"}>
                  <Select
                    onChange={handleTableChange}
                    placeholder={"请选择一个数据表"}
                    disabled={!tableInfos || tableInfos.length === 0}
                    value={tableName}
                    showSearch={true}
                    filterOption={(input, option) => {
                      const search = input.toLowerCase();
                      const name = option?.value.toLowerCase();
                      if (name?.includes(search)) {
                        return true;
                      }
                      const label = option?.label.toLowerCase();
                      return !!label?.includes(search);
                    }}
                    options={tableInfos?.map((item) => {
                      return {
                        value: item.name,
                        label: `(${item.name})[${item.comment}]`,
                      };
                    })}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={1}>
                <Button
                  disabled={!databaseName}
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    onRefreshTableNames?.();
                  }}
                ></Button>
              </Col>
              <Col span={2}>
                <Button
                  disabled={!tableName}
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    onRefreshColumns?.();
                  }}
                >
                  刷新列
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        {children}
      </div>
    </>
  );
};
