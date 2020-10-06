import React, { createContext, useMemo, useState } from "react";
export const Context = createContext(null);

export default function ContextProvider({ children }) {
  const [openLoginModal, isOpenLoginModal] = useState(false);

  return (
    <Context.Provider
      value={useMemo(() => ({ openLoginModal, isOpenLoginModal }), [
        openLoginModal,
      ])}
    >
      {children}
    </Context.Provider>
  );
} 
