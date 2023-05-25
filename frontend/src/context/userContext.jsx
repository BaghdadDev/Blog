import React, { createContext, useContext, useEffect, useState } from "react";

const keyStorage = "userBlog";

export const UserContext = createContext(undefined);

export function UserProvider({ children, initialValue }) {
  const [user, setUser] = useState(undefined);

  function persistUser(dataUser) {
    localStorage.setItem(keyStorage, JSON.stringify(dataUser));
    setUser(dataUser);
  }

  function signOut() {
    localStorage.removeItem(keyStorage);
    setUser(undefined);
  }

  useEffect(() => {
    if (initialValue) {
      setUser(initialValue);
      return;
    }
    const userFromStorageString = localStorage.getItem(keyStorage);
    if (!userFromStorageString) return;
    const userFromStorageJson = JSON.parse(userFromStorageString);
    if (
      Date.now() - parseInt(userFromStorageJson.token.expiresAccessToken) >
      60 * 1000
    ) {
      setUser(userFromStorageJson);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user: user, persistUser: persistUser, signOut: signOut }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
