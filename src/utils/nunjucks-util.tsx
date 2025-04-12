import nunjucks from "nunjucks";
import path from "path-browserify";

import {
  ColumnMetadata,
  NameAndComment,
  TemplateConfig,
} from "../@types/global";

export interface NunjucksUtilDataProps {
  databaseName?: string;
  tableInfo?: NameAndComment;
  columnInfos?: ColumnMetadata[];
  templateConfigs?: TemplateConfig[];
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
  constructor(data: NunjucksUtilDataProps) {
    this.data = data;
    this.env = nunjucks.configure({});
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
   * 将下划线字符串转换为驼峰命名 (camelCase)
   * @example "my_variable_name" → "myVariableName"
   */
  toCamelCase(value: string): string {
    if (!value) return "";
    return value
      .split("_")
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase(); // 首单词全小写
        }
        return capitalizeFirstLetter(word);
      })
      .join("");
  }
  /**
   * 将下划线字符串转换为帕斯卡命名 (PascalCase)
   * @example "my_variable_name" → "MyVariableName"
   */
  toPascalCase(value: string): string {
    if (!value) return "";
    return value
      .split("_")
      .map((word) => capitalizeFirstLetter(word))
      .join("");
  }

  initial() {
    this.env.addFilter("toApacheCase", this.toApacheCase);
    this.env.addFilter("toPascalCase", this.toPascalCase);
    this.env.addFilter("toCamelCase", this.toCamelCase);
  }

  getTemplateConfig(name: string) {
    const templateConfig: TemplateConfig | undefined =
      this.data.templateConfigs?.find((item) => item.name === name);
    return templateConfig;
  }

  render(template: string, templateConfig: TemplateConfig): GenerateCodeResult {
    const codeContent = this.env.renderString(template, {
      ...this.data,
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
