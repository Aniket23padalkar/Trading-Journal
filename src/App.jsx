import Aside from "./components/aside/Aside";
import Header from "./components/header/Header";
import { Routes, Route } from "react-router-dom";
import Trades from "./pages/Trades";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import Calender from "./pages/Calender";
import ContactUs from "./pages/ContactUs";

export default function App() {
  return (
    <>
      <main className="grid grid-cols-[14rem_1fr] grid-rows-[4rem_1fr] bg-white dark:bg-gray-950">
        <Header />

        <Aside />

        <div className="lg:col-start-2 lg:col-end-3 col-start-1 col-end-3 row-start-2 mx-2 lg:mx-0 lg:mr-2 xl:mx-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-3xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/calender" element={<Calender />} />
            <Route path="/contact-us" element={<ContactUs />} />
          </Routes>
        </div>
      </main>
    </>
  );
}
