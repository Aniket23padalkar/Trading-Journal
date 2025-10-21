import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import GlobalStateContext from "./context/Context";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/Trading-Journal">
    <GlobalStateContext>
      <App />
    </GlobalStateContext>
  </BrowserRouter>
);
