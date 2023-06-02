import React, { createContext, useContext, useEffect, useState } from "react";
import OvalLoader from "../components/OvalLoader.jsx";

const keyStorage = "userBlog";

export const UserContext = createContext(undefined);

export function UserProvider({ children, initialValue }) {
  const [user, setUser] = useState(undefined);
  const [authChecked, setAuthChecked] = useState(false);

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
    if (!userFromStorageString) {
      setAuthChecked(true);
      return;
    }
    const userFromStorageJson = JSON.parse(userFromStorageString);
    if (
      parseInt(userFromStorageJson.token.expiresAccessToken) - Date.now() >
      1000 * 60
    ) {
      setUser(userFromStorageJson);
    }
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return (
      <div className={"flex h-screen w-screen items-center justify-center"}>
        <OvalLoader size={40} />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{ user: user, persistUser: persistUser, signOut: signOut }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
