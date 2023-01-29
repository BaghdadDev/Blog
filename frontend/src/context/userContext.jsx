import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(undefined);
  return (
    <UserContext.Provider
      value={{ user: user ? { ...user } : {}, setUser: setUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
