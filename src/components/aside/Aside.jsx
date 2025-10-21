import { NavLink } from "react-router-dom";
import "./aside.css";
import { FaHome, FaChartLine } from "react-icons/fa";

export default function Aside() {
    return (
        <aside>
            <ul className="aside-ul">
                <NavLink to="/">
                    <li>
                        <span>
                            <FaHome className="aside-icon" />
                        </span>
                        <h1>Home</h1>
                    </li>
                </NavLink>
                <NavLink to="/trades">
                    <li>
                        <span>
                            <FaChartLine className="aside-icon" />
                        </span>
                        <h1>Trades</h1>
                    </li>
                </NavLink>
            </ul>
        </aside>
    );
}
