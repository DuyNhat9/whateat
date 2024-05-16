import React, { createContext, useState } from "react";
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [triggerReload, setTriggerReload] = useState(false);
  console.log(triggerReload);
  return (
    <AppContext.Provider value={{ triggerReload, setTriggerReload }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
