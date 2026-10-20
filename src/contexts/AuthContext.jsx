import { createContext, useContext, useEffect, useState } from "react";

import { clearExpiryTimer, scheduleTokenExpiry } from "../utils/session.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        scheduleTokenExpiry(token);
      } catch (error) {
        clearExpiryTimer();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);

    return () => {
      clearExpiryTimer();
    };
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    scheduleTokenExpiry(token);
  };

  const logout = () => {
    clearExpiryTimer();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
