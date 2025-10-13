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
    avatarUrl?: string,
    isProfileComplete?: boolean
  ) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateAvatar: (avatarUrl: string) => void;
  updateUsername: (username: string) => void;
  isProfileComplete?: boolean | null;
  setProfileComplete?: (value: boolean) => void;
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
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(() => {
    const stored = localStorage.getItem("isProfileComplete");
    return stored === "true" ? true : stored === "false" ? false : null;
  });


  const login = (
    newToken: string,
    newUsername: string,
    newEmail: string,
    newAvatarUrl?: string,
    newIsProfileComplete?: boolean
  ) => {
    setToken(newToken);
    setUsername(newUsername);
    setEmail(newEmail);
    setAvatarUrl(newAvatarUrl || null);
    setIsProfileComplete(newIsProfileComplete ?? null);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    localStorage.setItem("email", newEmail);
    if (newAvatarUrl) localStorage.setItem("avatarUrl", newAvatarUrl);
    if (newIsProfileComplete !== undefined) {
      localStorage.setItem("isProfileComplete", String(newIsProfileComplete));
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setEmail(null);
    setIsProfileComplete(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("avatarUrl");
    localStorage.removeItem("isProfileComplete");
    sessionStorage.removeItem("profileDialogShown");
  };

  const updateAvatar = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
    localStorage.setItem("avatarUrl", newAvatarUrl);
  };

  const updateUsername = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem("username", newUsername);
  };

  const setProfileComplete = (value: boolean) => {
    setIsProfileComplete(value);
    localStorage.setItem("isProfileComplete", String(value));
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
        updateUsername,
        isProfileComplete,
        setProfileComplete,
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
