export const MysqlToJavaTypeMap: Map<string, string> = new Map([
  // 整数类型
  ["tinyint", "Byte"],
  ["smallint", "Short"],
  ["mediumint", "Integer"],
  ["int", "Integer"],
  ["integer", "Integer"],
  ["bigint", "Long"],

  // 浮点类型
  ["float", "Float"],
  ["double", "Double"],
  ["decimal", "BigDecimal"],

  // 字符串类型
  ["char", "String"],
  ["varchar", "String"],
  ["tinytext", "String"],
  ["text", "String"],
  ["mediumtext", "String"],
  ["longtext", "String"],
  ["enum", "String"],
  ["set", "String"],

  // 二进制数据
  ["binary", "byte[]"],
  ["varbinary", "byte[]"],
  ["tinyblob", "byte[]"],
  ["blob", "byte[]"],
  ["mediumblob", "byte[]"],
  ["longblob", "byte[]"],

  // 日期时间类型
  ["date", "Date"],
  ["time", "Time"],
  ["datetime", "LocalDateTime"],
  ["timestamp", "Timestamp"],
  ["year", "Short"],

  // 其他类型
  ["bit", "Boolean"],
  ["json", "String"],
  ["geometry", "Object"],
]);

export const MysqlToTsTypeMap = new Map<string, string>([
  ["int", "number"],
  ["integer", "number"],
  ["tinyint", "number"],
  ["smallint", "number"],
  ["mediumint", "number"],
  ["bigint", "string"], // bigint 可能超过 JS 的安全整数范围
  ["float", "number"],
  ["double", "number"],
  ["decimal", "string"], // 避免精度丢失，建议用 string 或 Big.js

  ["bit", "boolean"],
  ["boolean", "boolean"],

  ["char", "string"],
  ["varchar", "string"],
  ["tinytext", "string"],
  ["text", "string"],
  ["mediumtext", "string"],
  ["longtext", "string"],

  ["binary", "Buffer"],
  ["varbinary", "Buffer"],
  ["tinyblob", "Buffer"],
  ["blob", "Buffer"],
  ["mediumblob", "Buffer"],
  ["longblob", "Buffer"],

  ["date", "string"], // 可用 string 或 Date，视情况而定
  ["datetime", "string"],
  ["timestamp", "string"],
  ["time", "string"],
  ["year", "number"],

  ["enum", "string"],
  ["set", "string[]"],

  ["json", "any"], // 或根据情况指定类型
]);

export const JDBCTypeMap = new Map<string, string>([
  // 整数类型
  ["INT", "INTEGER"],
  ["INTEGER", "INTEGER"],
  ["TINYINT", "TINYINT"],
  ["SMALLINT", "SMALLINT"],
  ["MEDIUMINT", "INTEGER"],
  ["BIGINT", "BIGINT"],
  ["SERIAL", "BIGINT"],
  ["BIGSERIAL", "BIGINT"],

  // 字符串类型
  ["CHAR", "CHAR"],
  ["VARCHAR", "VARCHAR"],
  ["TEXT", "LONGVARCHAR"],
  ["LONGTEXT", "LONGVARCHAR"],
  ["NVARCHAR", "NVARCHAR"],
  ["NCHAR", "NCHAR"],
  ["CLOB", "CLOB"],

  // 日期时间
  ["DATE", "DATE"],
  ["TIME", "TIME"],
  ["DATETIME", "TIMESTAMP"],
  ["TIMESTAMP", "TIMESTAMP"],
  ["TIMESTAMPTZ", "TIMESTAMP"],
  ["YEAR", "DATE"],

  // 二进制
  ["BLOB", "BLOB"],
  ["LONGBLOB", "LONGVARBINARY"],
  ["BINARY", "BINARY"],
  ["VARBINARY", "VARBINARY"],
  ["BYTEA", "BINARY"],

  // 布尔
  ["BIT", "BIT"],
  ["BOOLEAN", "BOOLEAN"],
  ["BOOL", "BOOLEAN"],

  // 数值
  ["FLOAT", "FLOAT"],
  ["DOUBLE", "DOUBLE"],
  ["DECIMAL", "DECIMAL"],
  ["NUMERIC", "NUMERIC"],
  ["REAL", "REAL"],

  // 特殊类型
  ["JSON", "VARCHAR"],
  ["JSONB", "VARCHAR"],
  ["UUID", "OTHER"],
  ["ENUM", "VARCHAR"],
  ["SET", "VARCHAR"],
]);
