import { AuthClient } from "../auth-client.js";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

const AuthContext = createContext<{
  client: AuthClient;
  isAuthenticated: boolean;
  login: (email: string, password: string, tenantId: number) => Promise<void>;
  logout: () => Promise<void>;
} | null>(null);

export function AuthProvider({
  children,
  baseUrl,
  tenantId
}: { children: ReactNode; baseUrl: string, tenantId: number }) {
  const [client] = useState(() => new AuthClient(baseUrl, tenantId));
  const [isAuthenticated, setIsAuthenticated] = useState(client.hasToken());

  const syncAuthState = useCallback(() => {
    setIsAuthenticated(client.hasToken());
  }, [client]);

  const login = useCallback(
    async (email: string, password: string) => {
      await client.login(email, password);
      syncAuthState();
    },
    [client, syncAuthState],
  );

  const logout = useCallback(async () => {
    await client.logout();
    setIsAuthenticated(false);
    syncAuthState();
  }, [client, syncAuthState]);

  return (
    <AuthContext.Provider value={{ client, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider I am afraid.");
  }

  return context;
}
