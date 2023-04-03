import React, { createContext, useContext, useEffect, useState } from "react";

import PATH from "../utils/route-path.jsx";

const keyStorage = "userBlog";

export const UserContext = createContext(undefined);

export function UserProvider({ children, initialValue }) {
  const [user, setUser] = useState(initialValue ?? undefined);

  function persistUser(dataUser) {
    localStorage.setItem(keyStorage, JSON.stringify(dataUser));
    setUser(dataUser);
  }

  function signOut() {
    localStorage.removeItem(keyStorage);
    window.location.replace(PATH.SIGN_IN);
    // setUser(undefined);
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
