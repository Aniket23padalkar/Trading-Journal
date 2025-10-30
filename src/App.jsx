import Aside from "./components/aside/Aside";
import Header from "./components/header/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import Trades from "./pages/trades/Trades";
import Dashboard from "./pages/dashboard/Dashboard";

export default function App() {
  return (
    <>
      <main className="grid grid-cols-[14rem_1fr] grid-rows-[4rem_1fr] h-full">
        <Header />

        <Aside />

        <div className="col-start-2 col-end-3 row-start-2 mr-4 mb-4 bg-gray-100 rounded-3xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trades" element={<Trades />} />
          </Routes>
        </div>
      </main>
    </>
  );
}
