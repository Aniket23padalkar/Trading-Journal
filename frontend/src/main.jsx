import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import TradeProvider from "./context/TradesContext";
import ThemeProvider from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
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
