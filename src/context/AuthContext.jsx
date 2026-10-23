import { createContext, useEffect, useMemo, useState } from "react";
import {auth} from "../services/authService.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(function () {
  (async function () {
    try {
      setLoading(true);
      setUser(await auth());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  })();
}, []);

  const authContextValue = useMemo(function () {
    return {
      user,
      setUser,
      loading,
    };
  }, [user, loading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}