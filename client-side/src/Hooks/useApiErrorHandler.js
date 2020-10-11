import { useCallback } from "react";
import { useHistory } from "react-router-dom";

export default function useApiErrorHandler() {
  const history = useHistory();
  const errorHandler = useCallback((error) => {
    if (error.status === 401) {
      history.push("/unauthorized");
    }
  }, [history]);

  return errorHandler;
}