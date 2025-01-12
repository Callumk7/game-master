import { AuthClient } from "../auth-client.js";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const AuthContext = createContext<{
  client: AuthClient;
  isAuthenticated: boolean;
  login: (email: string, password: string, tenantId: number) => Promise<void>;
  logout: () => Promise<void>;
} | null>(null);

export function AuthProvider({
  children,
  baseUrl,
}: { children: ReactNode; baseUrl: string }) {
  const [client] = useState(() => new AuthClient(baseUrl));
  const [isAuthenticated, setIsAuthenticated] = useState(client.isAuthenticated());

  const syncAuthState = useCallback(() => {
    setIsAuthenticated(client.isAuthenticated());
  }, [client]);


  const login = useCallback(
    async (email: string, password: string, tenantId: number) => {
      await client.login(email, password, tenantId);
      syncAuthState()
    },
    [client, syncAuthState],
  );

  const logout = useCallback(async () => {
    await client.logout();
    setIsAuthenticated(false);
    syncAuthState()
  }, [client, syncAuthState]);

  //useEffect(() =>  {
  //  const unsubscribe = client.sub
  //})

  return (
    <AuthContext.Provider value={{ client, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider I am afraid.")
  }

  return context;
}
