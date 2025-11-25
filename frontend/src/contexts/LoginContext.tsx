import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type Login = {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  userID: string;
  setUserID: (value: string) => void;
  onLogout: () => void;
};

export const LoginContext = createContext<Login>({
  loggedIn: false,
  setLoggedIn: () => {},
  userID: "",
  setUserID: () => {},
  onLogout: () => {},
});

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userID, setUserID] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp && decodedToken.sub && Date.now() < decodedToken.exp * 1000) {
        setUserID(decodedToken.sub);
        setLoggedIn(true);
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setUserID("");
  }

  return (
    <LoginContext.Provider value={{ loggedIn, setLoggedIn, userID, setUserID, onLogout: handleLogout }}>
      {children}
    </LoginContext.Provider>
  );
}
