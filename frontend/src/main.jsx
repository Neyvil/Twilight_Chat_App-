import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";
import { SocketProvider } from "./context/SocketContext";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <SocketProvider>
    <App />
    <Toaster position="top-right" closeButton />
  </SocketProvider>
  </BrowserRouter>
);
