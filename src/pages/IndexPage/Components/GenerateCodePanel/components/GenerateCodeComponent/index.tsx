import { GenerateCodeResult } from "../../../../../../utils/nunjucks-util.tsx";
import { Button, Input, Space } from "antd";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useCore } from "../../../../../../providers/CoreProvider.tsx";

export interface GenerateCodeComponentProps extends GenerateCodeResult {
  onOutputPathChange?: (outputPath: string) => void;
  onWrite2File?: (outputPath?: string, content?: string) => void;
  loading?: boolean;
}
export const GenerateCodeComponent = (props: GenerateCodeComponentProps) => {
  const { core } = useCore();

  function handleWrite2File() {
    props.onWrite2File?.(props.outputPath, props.content);
  }
  return (
    <>
      <Space direction={"vertical"} className={"w-full"}>
        <div className={"flex justify-between"}>
          <Input
            style={{ width: "calc(100% - 238px)" }}
            value={props.outputPath}
            onChange={(e) => props.onOutputPathChange?.(e.target.value)}
          />
          <Space className={"ml-3"}>
            <Button onClick={handleWrite2File} loading={props.loading}>
              写入到文件
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(props.content).then();
                core.showSuccessMessage("复制到粘贴板成功.");
              }}
              loading={props.loading}
            >
              复制到剪切板
            </Button>
          </Space>
        </div>
        <div style={{ maxHeight: "80vh" }} className={"overflow-auto"}>
          <div>
            <SyntaxHighlighter language={props.codeType} style={dark}>
              {props.content}
            </SyntaxHighlighter>
          </div>
        </div>
      </Space>
    </>
  );
};
