import { useMemo } from "react";

export default function useDataOnCurrentPage(page: number, data: any[], elsPerPage: number) {
  return useMemo(() => {
    const result: any[] = [];
    for (let i = (page - 1) * elsPerPage; i < elsPerPage * page && data[i]; i++) {
      result.push(data[i]);
    }
    return result;
  }, [page, data, elsPerPage]);
}
