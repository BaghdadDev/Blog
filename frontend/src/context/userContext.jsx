import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(undefined);

const keyStorage = "userBlog";

export function UserProvider({ children }) {
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
    const userFromStorageString = localStorage.getItem(keyStorage);
    if (userFromStorageString) {
      const userFromStorageJson = JSON.parse(userFromStorageString);
      if (
        Date.now() - parseInt(userFromStorageJson.token.expiresAccessToken) >
        60 * 1000
      ) {
        setUser(userFromStorageJson);
      }
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
