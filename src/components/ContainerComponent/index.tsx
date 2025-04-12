import { CSSProperties, ReactNode } from "react";
import { getStyleValue } from "../../utils";

export interface ContainerComponentProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;

  borderRadius?: number | string;
  padding?: number | string;
  margin?: number | string;
  backgroundColor?: string;
  isShadow?: boolean;
}
const defaultPropps = {
  className: "",
  style: {},
  borderRadius: 12,
  padding: 20,
  margin: 0,
  backgroundColor: "white",
  isShadow: false,
};

export const ContainerComponent = ({
  children = void 0,
  className = defaultPropps.className,
  style = defaultPropps.style,
  borderRadius = defaultPropps.borderRadius,
  padding = defaultPropps.padding,
  margin = defaultPropps.margin,
  backgroundColor = defaultPropps.backgroundColor,
  isShadow = defaultPropps.isShadow,
}: ContainerComponentProps) => {
  const containerStyle = {
    borderRadius: getStyleValue(borderRadius),
    padding: getStyleValue(padding),
    margin: getStyleValue(margin),
    backgroundColor: backgroundColor,
    ...style,
  };

  return (
    <div
      className={`${className} ${isShadow ? "shadow-xl" : ""} box-border`}
      style={containerStyle}
    >
      {children}
    </div>
  );
};
