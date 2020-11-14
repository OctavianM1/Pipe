import React, {
  createContext,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

interface ContextData {
  openLoginModal: boolean;
  isOpenLoginModal: Dispatch<SetStateAction<boolean>>;
  networkError: boolean;
  setNetworkError: Dispatch<SetStateAction<boolean>>;
}

export const Context = createContext<ContextData>(null!);

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [openLoginModal, isOpenLoginModal] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  return (
    <Context.Provider
      value={useMemo(
        () => ({
          openLoginModal,
          isOpenLoginModal,
          networkError,
          setNetworkError,
        }),
        [openLoginModal, networkError]
      )}
    >
      {children}
    </Context.Provider>
  );
}
