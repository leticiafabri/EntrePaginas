import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { User } from "../types/User";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../auth/authService";

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Erro ao restaurar a sessão:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const authenticatedUser = await loginUser(email, password);
      setUser(authenticatedUser);
    },
    [],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const createdUser = await registerUser(name, email, password);
      setUser(createdUser);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de AuthProvider.",
    );
  }

  return context;
}
