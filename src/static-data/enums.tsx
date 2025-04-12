import { Key } from "react";
import type { LiteralUnion } from "antd/es/_util/type";
import type {
  PresetColorType,
  PresetStatusColorType,
} from "antd/es/_util/colors";
export interface ValueLabel {
  value: Key;
  label: string;
}

export const Statues: {
  [key: string | number]: ValueLabel;
} = {
  // 200-299 正常以及和正常相关的状态,风险监控
  OK: {
    value: 200,
    label: "正常",
  },
  // 300-399 异常状态
  EXCEPTION: {
    value: 300,
    label: "异常",
  },
  // 400-499 禁用状态
  DISABLED: {
    value: 400,
    label: "禁用",
  },
  Locked: {
    value: 401,
    label: "锁定",
  },
  // 500-599 删除状态
  DELETED: {
    value: 500,
    label: "删除",
  },
};

const tempStatues: ValueLabel[] = [];
for (const key in Statues) {
  const item = Statues[key];
  tempStatues.push({
    value: item.value,
    label: item.label,
  });
}
export const StatusOptions = tempStatues;

export function getStatusLabel(status: Key) {
  return tempStatues.find((item) => item.value === status)?.label || "未知";
}

export function getStatusColor(
  value: number,
): LiteralUnion<PresetColorType | PresetStatusColorType> {
  if (value >= 200 && value < 300) {
    return "success";
  } else if (value < 600) {
    return "error";
  }
  return "processing";
}
