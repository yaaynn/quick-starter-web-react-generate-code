import React, { useEffect, useRef, useState } from "react";
import { Input } from "antd";

interface FinalInputProps extends React.ComponentProps<typeof Input> {
  onFinalChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FinalInput: React.FC<FinalInputProps> = (
  props: FinalInputProps,
) => {
  const isComposing = useRef(false);
  const [val, setVal] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    props.onChange?.(e);
    if (!isComposing.current) {
      props.onFinalChange?.(e);
    }
  };
  useEffect(() => {
    setVal(props.value as string);
  }, [props.value]);
  return (
    <Input
      {...props}
      value={val}
      onChange={handleChange}
      onCompositionStart={(e) => {
        isComposing.current = true;
        props.onCompositionStart?.(e);
      }}
      onCompositionEnd={(e) => {
        isComposing.current = false;
        props.onCompositionEnd?.(e);

        // ✅ 关键修复：等待 value 更新完再触发最终回调
        setTimeout(() => {
          props.onFinalChange?.(e as any);
        });
      }}
    />
  );
};
