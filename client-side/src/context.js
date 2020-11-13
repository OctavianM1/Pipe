import React, { createContext, useMemo, useState } from "react";
export const Context = createContext(null);

export default function ContextProvider({ children }) {
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
