import { Col, Form, Row, Select } from "antd";
import { NameAndComment } from "../../../../@types/global";
import { ReactNode, useEffect, useState } from "react";

export interface DatabasePanelProps {
  databaseName?: string;
  databaseNames?: NameAndComment[];
  tableInfos?: NameAndComment[];

  onDatabaseChange?: (name: string) => void;
  onTableChange?: (databaseName?: string, tableInfo?: NameAndComment) => void;

  children?: ReactNode | ReactNode[];
}

export const DatabasePanel = ({
  databaseName,
  databaseNames,
  tableInfos,
  onDatabaseChange,
  onTableChange,
  children,
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
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={"数据库"}>
                  <Select
                    onChange={handleDatabaseChange}
                    placeholder={"请选择一个数据库"}
                    disabled={!databaseNames || databaseNames.length === 0}
                    value={databaseName}
                  >
                    {databaseNames?.map((item) => {
                      return (
                        <Select.Option value={item.name} key={item.name}>
                          {item.comment ?? item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"数据表"}>
                  <Select
                    onChange={handleTableChange}
                    placeholder={"请选择一个数据表"}
                    disabled={!tableInfos || tableInfos.length === 0}
                    value={tableName}
                  >
                    {tableInfos?.map((item) => {
                      return (
                        <Select.Option value={item.name} key={item.name}>
                          {`(${item.name})[${item.comment}]`}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        {children}
      </div>
    </>
  );
};
