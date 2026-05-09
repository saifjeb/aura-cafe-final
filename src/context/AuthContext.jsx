import { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContextValue";

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [authLoading, setAuthLoading] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const saveAuthData = (user, userToken) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("currentUser", JSON.stringify(user));

    setToken(userToken);
    setCurrentUser(user);
  };

  const refreshProfile = async () => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setAuthLoading(false);
      return null;
    }

    try {
      const res = await api.get("/users/profile");

      localStorage.setItem("currentUser", JSON.stringify(res.data));
      setCurrentUser(res.data);

      return res.data;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");

      setToken(null);
      setCurrentUser(null);

      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);
    saveAuthData(res.data.user, res.data.token);
    return res.data;
  };

  const login = async (formData) => {
    const res = await api.post("/auth/login", formData);
    saveAuthData(res.data.user, res.data.token);
    await refreshProfile();
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    setToken(null);
    setCurrentUser(null);
    setAuthLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        authLoading,
        register,
        login,
        logout,
        refreshProfile,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
