import { useState, useEffect } from "react";

export const useScript = (src: string) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 检查是否已经存在相同的脚本
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      setLoaded(true);
      return;
    }

    // 动态创建脚本标签
    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    // 设置加载事件
    script.onload = () => setLoaded(true);
    script.onerror = () => setError(true);

    // 将脚本添加到 <head>
    document.head.appendChild(script);

    // 清理脚本
    return () => {
      document.head.removeChild(script);
    };
  }, [src]);

  return { loaded, error };
};
