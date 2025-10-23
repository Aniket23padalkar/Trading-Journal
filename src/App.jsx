import Aside from "./components/aside/Aside";
import Header from "./components/header/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import Trades from "./pages/trades/Trades";
import Dashboard from "./pages/dashboard/Dashboard";

export default function App() {
  return (
    <>
      <Header />
      <div className="main-container">
        <Aside />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="trades" element={<Trades />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
