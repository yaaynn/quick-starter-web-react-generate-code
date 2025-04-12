export interface BackResult<T> {
  code: number;
  data: T;
  error: string;
  detail: string;
  cb: string;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  current: number;
  pageSize: number;
  search?: string;
}

export class BackResultError extends Error {
  public readonly result?: BackResult<any>;
  constructor(message: string, result?: BackResult<any>) {
    super(message);
    this.result = result;
  }
}
