import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function useHash() {
  const { hash } = useLocation();
  return useMemo(() => {
    const hashObj: { [key: string]: string } = {};
    hash.split("&").forEach((item) => {
      hashObj[item.split("=")[0]] = item.split("=")[1];
    });
    return hashObj;
  }, [hash]);
}
