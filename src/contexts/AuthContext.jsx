import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  adminLogin,
  adminLogout,
  getAdminSession,
} from "../services/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const session = await getAdminSession();

        if (mounted && session?.authenticated) {
          setUser(session.user);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(email, password) {
    const result = await adminLogin(
      email,
      password
    );

    setUser(result.user);

    return result;
  }

  async function logout() {
    await adminLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
