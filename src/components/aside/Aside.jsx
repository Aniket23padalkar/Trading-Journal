import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BiBarChartAlt2 } from "react-icons/bi";

export default function Aside() {
  return (
    <aside className="col-start-1 col-end-2 row-start-2 row-end-3 flex h-full w-full px-4">
      <ul className="flex grow flex-col mt-4 gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center py-2 rounded font-medium ${
              isActive
                ? "border-l-8 border-green-500 shadow shadow-gray-400"
                : "border-l-8 border-transparent text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <li className="flex items-center pl-2">
              <span>
                <MdDashboard
                  className={`text-xl ${
                    isActive ? "text-green-600" : "text-gray-400"
                  }`}
                />
              </span>
              <h1 className="pl-2">Dashboard</h1>
            </li>
          )}
        </NavLink>
        <NavLink
          to="/trades"
          className={({ isActive }) =>
            `flex items-center py-2 rounded font-medium ${
              isActive
                ? "border-l-8 border-green-500 shadow shadow-gray-400"
                : "border-l-8 border-transparent text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <li className="flex items-center pl-2">
              <span>
                <BiBarChartAlt2
                  className={`text-xl ${
                    isActive ? "text-green-600" : "text-gray-400"
                  }`}
                />
              </span>
              <h1 className="pl-2">Trades</h1>
            </li>
          )}
        </NavLink>
      </ul>
    </aside>
  );
}
