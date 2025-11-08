import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import GlobalStateContext from "./context/Context";
import AuthProvider from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <GlobalStateContext>
        <App />
      </GlobalStateContext>
    </AuthProvider>
  </BrowserRouter>
);
