import React, { createContext, useMemo, useState } from "react";

interface ContextData {
  openLoginModal: boolean;
  isOpenLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  networkError: boolean;
  setNetworkError: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Context = createContext<ContextData>(null!);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
