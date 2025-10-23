import { NavLink } from "react-router-dom";
import "./aside.css";
import { FaHome, FaChartLine, FaTachometerAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { BiBarChartAlt2 } from "react-icons/bi";

export default function Aside() {
  return (
    <aside>
      <ul className="aside-ul">
        <NavLink to="/">
          <li>
            <span>
              <MdDashboard className="aside-icon" />
            </span>
            <h1>Dashboard</h1>
          </li>
        </NavLink>
        <NavLink to="/trades">
          <li>
            <span>
              <BiBarChartAlt2 className="aside-icon" />
            </span>
            <h1>Trades</h1>
          </li>
        </NavLink>
      </ul>
    </aside>
  );
}
