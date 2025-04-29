import nunjucks from "nunjucks";
import path from "path-browserify";

import {
  ColumnMetadata,
  NameAndComment,
  TemplateConfig,
} from "../@types/global";
import {
  JDBCTypeMap,
  MysqlToJavaTypeMap,
  MysqlToTsTypeMap,
} from "../static-data/data-types.tsx";

export interface NunjucksUtilDataProps {
  databaseName?: string;
  tableInfo?: NameAndComment;
  columnInfos?: ColumnMetadata[];
  templateConfigs?: TemplateConfig[];
  mysqlToJavaTypeMap?: Map<string, string>;
  sqlToCodeTypeMap?: Map<string, string>;
}

/**
 * 将单词首字母大写，其余小写
 * @example "hello" → "Hello"
 */
export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * 生成代码结果
 */
export interface GenerateCodeResult {
  name: string; // 文件名称
  templateName: string; // 模板名称
  outputPath: string; // 输出路径
  content: string; // 生成的代码
  codeType: string; // 代码类型
}

export class NunjucksUtil {
  private env;
  private readonly data: NunjucksUtilDataProps;
  private readonly databaseType: string;
  constructor(data: NunjucksUtilDataProps, databaseType: string = "mysql") {
    this.data = data;
    this.databaseType = databaseType;

    this.env = nunjucks.configure({
      autoescape: false,
    });
    this.initial();
  }

  /**
   * 将下划线转化为阿帕奇命名
   * @param value
   */
  toApacheCase(value: string): string {
    if (!value) return "";
    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  }

  /**
   * 将下划线或连字符字符串转换为驼峰命名 (camelCase)
   * 同时处理已经存在的大写字母情况
   * @example
   * "my_variable_name" → "myVariableName"
   * "my-variable-name" → "myVariableName"
   * "my-Variable-Name" → "myVariableName"
   * "MyVariableName" → "myVariableName" (如果已经是驼峰形式会转为小驼峰)
   */
  toCamelCase(value: string): string {
    if (!value) return "";

    // 先统一处理连字符和下划线为相同分隔符，然后分割单词
    return value
      .replace(/[-_]/g, "_") // 将所有连字符转为下划线
      .split("_")
      .map((word, index) => {
        if (!word) return ""; // 处理连续分隔符情况
        if (index === 0) {
          // 首单词全小写，除非原单词全大写(如HTTP)
          return word.toLowerCase();
        }
        // 后续单词首字母大写，其余小写
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
  }

  /**
   * 将下划线或连字符字符串转换为帕斯卡命名 (PascalCase)
   * 同时处理已经存在的大写字母情况
   * @example
   * "my_variable_name" → "MyVariableName"
   * "my-variable-name" → "MyVariableName"
   * "my-Variable-Name" → "MyVariableName"
   * "myVariableName" → "MyVariableName" (如果已经是驼峰形式会转为帕斯卡)
   */
  toPascalCase(value: string): string {
    if (!value) return "";

    // 先统一处理连字符和下划线为相同分隔符，然后分割单词
    return value
      .replace(/[-_]/g, "_") // 将所有连字符转为下划线
      .split("_")
      .map((word) => {
        if (!word) return ""; // 处理连续分隔符情况
        // 每个单词首字母大写，其余小写
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
  }

  /**
   * 获取数据库类型
   * @param value
   */
  getSqlToCodeTypeName(value: string) {
    return this.data.sqlToCodeTypeMap?.get(value) || value;
  }
  getAdditionValue(key: string, templateConfig: TemplateConfig) {
    return templateConfig.additions?.find((item) => item.key === key)?.value;
  }
  convert2JDBCType(value: string) {
    if (!value) return value;
    return JDBCTypeMap.get(value.toUpperCase());
  }

  initial() {
    this.env.addFilter("toApacheCase", this.toApacheCase);
    this.env.addFilter("toPascalCase", this.toPascalCase);
    this.env.addFilter("toCamelCase", this.toCamelCase);
    this.env.addFilter("getSqlToCodeTypeName", this.getSqlToCodeTypeName);

    this.env.addGlobal("getAdditionValue", this.getAdditionValue);
    this.env.addGlobal("convert2JDBCType", this.convert2JDBCType);
  }

  getTemplateConfig(name: string) {
    const templateConfig: TemplateConfig | undefined =
      this.data.templateConfigs?.find((item) => item.name === name);
    return templateConfig;
  }

  getSqlTypeMap(codeType: string) {
    switch (this.databaseType) {
      case "mysql":
        switch (codeType) {
          case "java":
            return MysqlToJavaTypeMap;
          case "tsx":
          case "ts":
            return MysqlToTsTypeMap;
        }
    }
  }

  render(template: string, templateConfig: TemplateConfig): GenerateCodeResult {
    const sqlToCodeTypeMap = this.getSqlTypeMap(templateConfig.codeType);

    console.log(templateConfig.name, {
      ...this.data,
      sqlToCodeTypeMap: sqlToCodeTypeMap,
      mysqlToJavaTypeMap: MysqlToJavaTypeMap,
      templateConfig: templateConfig,
    });

    const codeContent = this.env.renderString(template, {
      ...this.data,
      sqlToCodeTypeMap: sqlToCodeTypeMap,
      mysqlToJavaTypeMap: MysqlToJavaTypeMap,
      templateConfig: templateConfig,
    });
    const [fileName, outputPath] = this.generateOutputPath(templateConfig);

    return {
      name: fileName,
      templateName: templateConfig.name,
      outputPath: outputPath,
      content: codeContent,
      codeType: templateConfig.codeType,
    };
  }

  private renderFileNaming(name: string, tableName: string) {
    return this.env.renderString(name, { name: tableName });
  }

  private generateOutputPath(templateConfig: TemplateConfig) {
    const fileName = `${this.renderFileNaming(templateConfig.naming, this.data.tableInfo!.name)}${templateConfig.extension}`;

    return [fileName, path.join(templateConfig.outputPath, fileName)];
  }
}
