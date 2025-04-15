export const mysqlToJavaTypeMap: Map<string, string> = new Map([
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

export const mysqlToTsTypeMap = new Map<string, string>([
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
