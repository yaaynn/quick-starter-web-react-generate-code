import {
  ColumnMetadata,
  ColumnMetadataActivate,
} from "../../../../@types/global";
import { useEffect, useState } from "react";
import { Checkbox, Space, Table, TableProps } from "antd";

export interface DatabaseColumnTableProps {
  dataSource?: ColumnMetadata[];
  onDataSourceChange?: (newDataSource?: ColumnMetadata[]) => void;
}
export const DatabaseColumnTable = (props: DatabaseColumnTableProps) => {
  const [allActivateStatus, setAllActivateStatus] =
    useState<ColumnMetadataActivate>({
      insert: true,
      remove: true,
      update: true,
      search: true,
      advancedSearch: true,
    });
  const [allActivateIndeterminate, setAllActivateIndeterminate] = useState({
    insert: false,
    remove: false,
    update: false,
    search: false,
    advancedSearch: false,
  });
  const [allStatus, setAllStatus] = useState<boolean | undefined>(true);

  const columns: TableProps<ColumnMetadata>["columns"] = [
    {
      key: "columnName",
      title: "字段名",
      dataIndex: "columnName",
    },
    {
      key: "columnComment",
      title: "字段注释",
      dataIndex: "columnComment",
    },
    {
      key: "dataType",
      title: "数据类型",
      dataIndex: "dataType",
    },
    {
      key: "columnType",
      title: "列类型",
      dataIndex: "columnType",
    },
    {
      key: "characterMaximumLength",
      title: "字符最大长度",
      dataIndex: "characterMaximumLength",
    },
    {
      key: "numericPrecision",
      title: "数字精度",
      dataIndex: "numericPrecision",
    },
    {
      key: "numericScale",
      title: "小数位数",
      dataIndex: "numericScale",
    },
    {
      key: "isNullable",
      title: "允许为空",
      dataIndex: "isNullable",
      render: (value) => {
        return <Checkbox checked={value === "YES"} />;
      },
    },
    {
      key: "columnDefault",
      title: "默认值",
      dataIndex: "columnDefault",
    },
    {
      key: "columnKey",
      title: "键类型",
      dataIndex: "columnKey",
    },
    {
      key: "extra",
      title: "额外信息",
      dataIndex: "extra",
    },
    {
      key: "activate",
      title: (
        <Space>
          <Checkbox
            checked={allStatus === true}
            indeterminate={allStatus === undefined}
            onChange={(e) => {
              handleAllActivateStatusChange(void 0, e.target.checked);
            }}
          >
            全部
          </Checkbox>
          <Checkbox
            checked={allActivateStatus.insert}
            indeterminate={allActivateIndeterminate.insert}
            onChange={(e) => {
              handleAllActivateStatusChange("insert", e.target.checked);
            }}
          >
            增
          </Checkbox>
          <Checkbox
            checked={allActivateStatus.remove}
            indeterminate={allActivateIndeterminate.remove}
            onChange={(e) => {
              handleAllActivateStatusChange("remove", e.target.checked);
            }}
          >
            删
          </Checkbox>
          <Checkbox
            checked={allActivateStatus.update}
            indeterminate={allActivateIndeterminate.update}
            onChange={(e) => {
              handleAllActivateStatusChange("update", e.target.checked);
            }}
          >
            修
          </Checkbox>
          <Checkbox
            checked={allActivateStatus.search}
            indeterminate={allActivateIndeterminate.search}
            onChange={(e) => {
              handleAllActivateStatusChange("search", e.target.checked);
            }}
          >
            查
          </Checkbox>
          <Checkbox
            checked={allActivateStatus.advancedSearch}
            indeterminate={allActivateIndeterminate.advancedSearch}
            onChange={(e) => {
              handleAllActivateStatusChange("advancedSearch", e.target.checked);
            }}
          >
            高查
          </Checkbox>
        </Space>
      ),
      fixed: "right",
      render(_, record, index) {
        const all: boolean =
          record.insert &&
          record.remove &&
          record.update &&
          record.search &&
          record.advancedSearch;
        let indeterminate = false;
        if (!all) {
          indeterminate =
            record.insert ||
            record.remove ||
            record.update ||
            record.search ||
            record.advancedSearch;
        }
        return (
          <Space>
            <Checkbox
              indeterminate={indeterminate}
              checked={all}
              onChange={() => {
                const value = !all;
                handleAllActivateChange(index, value);
              }}
            >
              全部
            </Checkbox>
            <Checkbox
              checked={record.insert}
              onChange={(e) => {
                handleChangeActivate(index, "insert", e.target.checked);
              }}
            >
              增
            </Checkbox>
            <Checkbox
              checked={record.remove}
              onChange={(e) => {
                handleChangeActivate(index, "remove", e.target.checked);
              }}
            >
              删
            </Checkbox>
            <Checkbox
              checked={record.update}
              onChange={(e) => {
                handleChangeActivate(index, "update", e.target.checked);
              }}
            >
              修
            </Checkbox>
            <Checkbox
              checked={record.search}
              onChange={(e) => {
                handleChangeActivate(index, "search", e.target.checked);
              }}
            >
              查
            </Checkbox>
            <Checkbox
              checked={record.advancedSearch}
              onChange={(e) => {
                handleChangeActivate(index, "advancedSearch", e.target.checked);
              }}
            >
              高查
            </Checkbox>
          </Space>
        );
      },
    },
  ];

  function handleAllActivateStatusChange(
    key: keyof ColumnMetadataActivate | undefined,
    value: boolean,
  ) {
    const newDatasource: ColumnMetadata[] | undefined = props.dataSource?.map(
      (item) => {
        if (key) {
          return {
            ...item,
            [key]: value,
          };
        } else {
          return {
            ...item,
            insert: value,
            remove: value,
            update: value,
            search: value,
            advancedSearch: value,
          };
        }
      },
    );
    props.onDataSourceChange?.(newDatasource);
  }
  function handleChangeActivate(
    index: number,
    key: keyof ColumnMetadataActivate,
    value: boolean,
  ) {
    const newDataSource: ColumnMetadata[] | undefined = props.dataSource?.map(
      (item, i) => {
        if (index === i) {
          return {
            ...item,
            [key]: value,
          };
        }
        return item;
      },
    );
    props.onDataSourceChange?.(newDataSource);
  }

  function handleAllActivateChange(index: number, value: boolean) {
    const newDataSource: ColumnMetadata[] | undefined = props.dataSource?.map(
      (item, i) => {
        if (index === i) {
          return {
            ...item,
            insert: value,
            remove: value,
            update: value,
            search: value,
            advancedSearch: value,
          };
        }
        return item;
      },
    );
    props.onDataSourceChange?.(newDataSource);
  }

  useEffect(() => {
    if (!props.dataSource || props.dataSource.length === 0) {
      return;
    }
    // 这里先赛选出所有的元素的值
    const insertSet = new Set<boolean>();
    const removeSet = new Set<boolean>();
    const updateSet = new Set<boolean>();
    const searchSet = new Set<boolean>();
    const advancedSearchSet = new Set<boolean>();

    props.dataSource.forEach((item) => {
      insertSet.add(item.insert);
      removeSet.add(item.remove);
      updateSet.add(item.update);
      searchSet.add(item.search);
      advancedSearchSet.add(item.advancedSearch);
    });

    // 判断是不是有多个值,确实是否需要半选, 不是就获取第一个值
    const tempAllActivateStatue: ColumnMetadataActivate = {
      insert:
        insertSet.size === 1
          ? (insertSet.values().next().value ?? false)
          : false,
      remove:
        removeSet.size === 1
          ? (removeSet.values().next().value ?? false)
          : false,
      update:
        updateSet.size === 1
          ? (updateSet.values().next().value ?? false)
          : false,
      search:
        searchSet.size === 1
          ? (searchSet.values().next().value ?? false)
          : false,
      advancedSearch:
        advancedSearchSet.size === 1
          ? (advancedSearchSet.values().next().value ?? false)
          : false,
    };

    setAllActivateStatus(tempAllActivateStatue);

    // 如果有两个值就是半选
    const tempAllActivateIndeterminate: ColumnMetadataActivate = {
      insert: insertSet.size === 2,
      remove: removeSet.size === 2,
      update: updateSet.size === 2,
      search: searchSet.size === 2,
      advancedSearch: advancedSearchSet.size === 2,
    };
    setAllActivateIndeterminate(tempAllActivateIndeterminate);
    // 如果有半选的,就说明第一个全选是半选
    let temp: boolean | undefined =
      tempAllActivateIndeterminate.insert ||
      tempAllActivateIndeterminate.remove ||
      tempAllActivateIndeterminate.update ||
      tempAllActivateIndeterminate.search ||
      tempAllActivateIndeterminate.advancedSearch;

    if (temp) {
      temp = void 0;
    } else {
      // 如果不是,直接获取某一个属性就好,因为这个时候所有的属性都是相等的
      const tempSet = new Set<boolean>();

      tempSet.add(tempAllActivateStatue.insert);
      tempSet.add(tempAllActivateStatue.remove);
      tempSet.add(tempAllActivateStatue.update);
      tempSet.add(tempAllActivateStatue.search);
      tempSet.add(tempAllActivateStatue.advancedSearch);

      if (tempSet.size === 2) {
        temp = void 0;
      } else {
        temp = tempSet.values().next().value ?? false;
      }
    }

    setAllStatus(temp);
  }, [props.dataSource]);

  return (
    <>
      <Table<ColumnMetadata>
        rowKey={"columnName"}
        pagination={false}
        columns={columns}
        dataSource={props.dataSource}
        bordered={true}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};
