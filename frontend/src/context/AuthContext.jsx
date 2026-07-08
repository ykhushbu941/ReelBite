import { createContext, useState, useEffect } from "react";
import API from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios default
  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = token;
      fetchUser();
    } else {
      delete API.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/user/me");
      setUser(res.data);
      if (res.data.role) {
        setRole(res.data.role);
        localStorage.setItem("role", res.data.role);
      }
    } catch (error) {
      console.error("Token invalid or expired");
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, newRole, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const updateSavedFoods = (savedFoods) => {
    if (user) {
      setUser({ ...user, savedFoods });
    }
  };

  return (
    <AuthContext.Provider value={{ token, role, user, loading, login, logout, updateSavedFoods, fetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};