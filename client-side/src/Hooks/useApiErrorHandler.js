import { useHistory } from "react-router-dom";

export default function useApiErrorHandler() {
  const history = useHistory();
  const errorHandler = (error) => {
    if (error.status === 401) {
      history.push("/unauthorized");
    }
  };

  return errorHandler;
}