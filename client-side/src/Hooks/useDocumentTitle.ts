import { useEffect } from "react";

export default function useDocumentTitle(title: string, deps: any[]) {
  useEffect(() => {
    document.title = title;
  }, [...deps]);
}
