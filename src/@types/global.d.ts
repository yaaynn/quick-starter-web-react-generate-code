declare global {
  interface TurnstileOptions {
    sitekey?: string;
    callback(token: string): void;
  }
  interface Turnstile {
    render(id: string, options: TurnstileOptions): void;
    reset(): void;
  }
  interface Window {
    turnstile: Turnstile | undefined;
  }
}
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
}
export {};

export interface NameAndComment {
  name: string;
  comment: string;
}

export interface ColumnMetadataActivate {
  insert: boolean;
  remove: boolean;
  update: boolean;
  search: boolean;
  advancedSearch: boolean;
}

export interface ColumnMetadata extends ColumnMetadataActivate {
  columnName: string;
  columnType: string;
  dataType: string;
  characterMaximumLength?: number;
  characterOctetLength?: number;
  numericPrecision?: number;
  numericScale?: number;
  isNullable: string;
  columnDefault?: string;
  columnKey: string;
  columnComment: string;
  extra: string;
}

export interface TemplateConfig {
  name: string;
  outputPath: string;
  extension: string;
  codeType: string;
  naming: string;
}
