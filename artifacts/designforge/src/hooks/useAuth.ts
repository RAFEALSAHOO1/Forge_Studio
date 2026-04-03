import { useState, useEffect, useCallback } from "react";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  authProvider: "email" | "google" | "phone";
  role?: "user" | "admin" | "owner";
  isAdmin?: boolean;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const cachedUser = localStorage.getItem(USER_KEY);

        if (token && cachedUser) {
          setUser(JSON.parse(cachedUser));
          setIsAuthenticated(true);

          // Validate token with backend
          try {
            const response = await fetch("/api/auth/me", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error("Token invalid");
            }

            const data = await response.json();
            if (data.user) {
              setUser(data.user);
              localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            }
          } catch {
            // Token is invalid, clear it
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize auth"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/auth/login/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);

        return data;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Login failed";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signup = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/auth/signup/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, firstName, lastName }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Signup failed");
        }

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);

        return data;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Signup failed";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const googleAuth = useCallback(
    async (token: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Google authentication failed");
        }

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);

        return data;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Google authentication failed";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  const getAuthHeader = useCallback(() => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [getToken]);

  const updateUser = useCallback((newUser: User) => {
    setUser(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  }, []);

  const isAdmin = user?.role === "admin" || user?.role === "owner" || user?.isAdmin === true;

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    signup,
    googleAuth,
    logout,
    getToken,
    getAuthHeader,
    updateUser,
  };
}
