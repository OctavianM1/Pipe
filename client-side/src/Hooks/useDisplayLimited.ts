import { useMemo } from "react";

export default function useDisplayLimited(limit: number, data: any[]) {
  return useMemo(() => {
    const arr: any[] = [];
    for (let i = 0; i < limit && data[i]; i++) {
      arr.push(data[i]);
    }
    return arr;
  }, [limit, data]);
}
