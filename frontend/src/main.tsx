import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext.js";
import TradeProvider from "./context/TradesContext.js";
import ThemeProvider from "./context/ThemeContext.js";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TradeProvider>
            <App />
          </TradeProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>,
  );
}
