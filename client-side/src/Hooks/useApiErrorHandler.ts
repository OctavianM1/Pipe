import { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../context";

export default function useApiErrorHandler() {
  const history = useHistory();
  const { setNetworkError } = useContext(Context);

  const errorHandler = useCallback(
    (error: any, cb?: Function) => {
      if (error === "Network Error") {
        setNetworkError(true);
      } else if (error.status === 400) {
        cb && cb();
      } else if (error.status === 401) {
        history.push("/unauthorized");
      } else if (error.status === 500) {
        history.push("/server-error");
      }
    },
    [history, setNetworkError]
  );

  return errorHandler;
}
