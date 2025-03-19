import { useFetcher } from "@remix-run/react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { JollySelect, SelectItem } from "~/components/ui/select";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme = "system",
}: { children: ReactNode; initialTheme?: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const fetcher = useFetcher();

  const setThemeAndSave = (newTheme: Theme) => {
    setTheme(newTheme);
    fetcher.submit({ theme: newTheme }, { method: "post", action: "/set-theme" });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeAndSave }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

// TODO: should change to a dropdown select with static label
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <JollySelect
      selectedKey={theme}
      onSelectionChange={(key) => {
        console.log(key);
        setTheme(key.toString() as Theme);
      }}
    >
      <SelectItem id="light">Light</SelectItem>
      <SelectItem id="dark">Dark</SelectItem>
      <SelectItem id="system">System</SelectItem>
    </JollySelect>
  );
}
