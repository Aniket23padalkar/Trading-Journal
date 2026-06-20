import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext.js";
import TradeProvider from "./context/TradesContext.js";
import ThemeProvider from "./context/ThemeContext.js";
import StatsProvider from "./context/StatsContext.js";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <StatsProvider>
            <TradeProvider>
              <App />
            </TradeProvider>
          </StatsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>,
  );
}
