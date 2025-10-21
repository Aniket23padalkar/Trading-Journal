import Aside from "./components/aside/Aside";
import Header from "./components/header/Header";
import Home from "./pages/home/Home";
import { Routes, Route } from "react-router-dom";
import Trades from "./pages/trades/Trades";

export default function App() {
    return (
        <>
            <Header />
            <div className="main-container">
                <Aside />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="trades" element={<Trades />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}
