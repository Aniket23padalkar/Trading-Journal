import { Link } from "react-router-dom";
import "./header.css";

export default function Header() {
    return (
        <header>
            <div className="header-left">
                <Link to="/">
                    <div className="logo">
                        <img
                            src="../../src/assets/TradeLens-Logo2.png"
                            alt="Logo"
                        />
                    </div>
                </Link>
            </div>
            <div className="header-right">
                <div className="welcome-msg">
                    <h4>Hello, Aniket</h4>
                </div>
            </div>
        </header>
    );
}
