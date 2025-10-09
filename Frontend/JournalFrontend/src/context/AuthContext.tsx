import { getProfile } from "@/services/api";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AuthContextType {
  token: string | null;
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
  login: (
    token: string,
    username: string,
    email: string,
    avatarUrl?: string
  ) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateAvatar: (avatarUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("email")
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    localStorage.getItem("avatarUrl")
  );

  const login = (
    newToken: string,
    newUsername: string,
    newEmail: string,
    newAvatarUrl?: string
  ) => {
    setToken(newToken);
    setUsername(newUsername);
    setEmail(newEmail);
    setAvatarUrl(newAvatarUrl || null);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    localStorage.setItem("email", newEmail);
    if (newAvatarUrl) localStorage.setItem("avatarUrl", newAvatarUrl);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setEmail(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("avatarUrl");
  };

  const updateAvatar = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
    localStorage.setItem("avatarUrl", newAvatarUrl);
  };

  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      getProfile()
        .then((profile) => {
          setAvatarUrl(profile.avatarUrl);
          localStorage.setItem("avatarUrl", profile.avatarUrl || "");
        })
        .catch((err) => console.error("Failed to fetch profile:", err));
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        email,
        avatarUrl,
        login,
        logout,
        isAuthenticated,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
