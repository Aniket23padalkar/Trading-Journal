import { Link } from "react-router-dom";
import "./header.css";
import logo from "../../src/assets/TradeLens-Logo2.png";

export default function Header() {
  return (
    <header>
      <div className="header-left">
        <Link to="/">
          <div className="logo">
            <img src={logo} alt="Logo" />
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
