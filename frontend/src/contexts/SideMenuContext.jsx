import React, { createContext, useContext, useState } from "react";

const SideMenuContext = createContext();

export const SideMenuProvider = ({ children }) => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  return (
    <SideMenuContext.Provider
      value={{ sideMenuOpen, setSideMenuOpen, toggleSideMenu }}
    >
      {children}
    </SideMenuContext.Provider>
  );
};

export const useSideMenuOpen = () => useContext(SideMenuContext);
