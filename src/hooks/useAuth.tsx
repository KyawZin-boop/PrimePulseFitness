import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  userCredentials: UserCredentials | null;
  userLogin: (newToken: string) => void;
  userLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const cookieToken = Cookies.get("gym-token") || null;

  let initialToken: string | null = cookieToken;
  let initialCredentials: UserCredentials | null = null;
  let initialAuthenticated = false;

  if (cookieToken) {
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(cookieToken);
      initialCredentials = {
        userId: decoded["userID"],
        name: decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ],
        email:
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ],
        role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
      };
      initialAuthenticated = true;
    } catch {
      Cookies.remove("gym-token");
      initialToken = null;
    }
  }

  const [token, setToken] = useState<string | null>(initialToken);
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(initialAuthenticated);
  const [userCredentials, setUserCredentials] =
    useState<UserCredentials | null>(initialCredentials);

  useEffect(() => {
    if (!token) {
      setUserCredentials(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);

      setUserCredentials({
        userId: decoded["userID"],
        name: decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ],
        email:
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ],
        role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
      });

      setIsAuthenticated(true);
    } catch {
      Cookies.remove("gym-token");
      setToken(null);
      setUserCredentials(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  const userLogin = (newToken: string) => {
    if (newToken !== token) {
      Cookies.set("gym-token", newToken);
      setToken(newToken);
    }
  };

  const userLogout = () => {
    Cookies.remove("gym-token");
    setToken(null);
    setIsAuthenticated(false);
    setUserCredentials(null);
  };

  const value = {
    isAuthenticated,
    userCredentials,
    userLogin,
    userLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
