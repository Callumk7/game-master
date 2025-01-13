import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { AuthProvider, useAuth } from "@repo/auth";

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

function InnerApp() {
  const auth = useAuth().client;
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <AuthProvider baseUrl="http://localhost:4000">
      <InnerApp />
    </AuthProvider>
  );
}
