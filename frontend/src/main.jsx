import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import TradeProvider from "./context/TradesContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <TradeProvider>
        <App />
      </TradeProvider>
    </AuthProvider>
  </BrowserRouter>,
);
