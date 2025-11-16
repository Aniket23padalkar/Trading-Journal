import { NavLink } from "react-router-dom";
import { MdContacts, MdDashboard } from "react-icons/md";
import { BiBarChartAlt2, BiCalendar, BiChart } from "react-icons/bi";
import { useContext } from "react";
import { GlobalContext } from "../../context/Context";

export default function Aside({ isAsideOpen }) {
  return (
    <aside
      className={`col-start-1 col-end-2 row-start-2 transition-transform duration-300 lg:translate-x-0 ${
        isAsideOpen ? "translate-0 z-10" : "-translate-x-full"
      } row-end-3 lg:flex h-full w-full px-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700`}
    >
      <ul className="flex grow flex-col mt-4 gap-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center py-2 rounded font-medium ${
              isActive
                ? "border-l-8 border-teal-500 shadow shadow-gray-400 dark:text-white dark:shadow-teal-500"
                : "border-l-8 border-transparent text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <li className="flex items-center pl-2">
              <span>
                <MdDashboard
                  className={`text-xl ${
                    isActive ? "text-teal-600" : "text-gray-400"
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
                ? "border-l-8 border-teal-500 shadow shadow-gray-400 dark:text-white dark:shadow-teal-500"
                : "border-l-8 border-transparent text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <li className="flex items-center pl-2">
              <span>
                <BiBarChartAlt2
                  className={`text-xl ${
                    isActive ? "text-teal-600" : "text-gray-400"
                  }`}
                />
              </span>
              <h1 className="pl-2">Trades</h1>
            </li>
          )}
        </NavLink>

        <NavLink
          to="/charts"
          className={({ isActive }) =>
            `flex items-center py-2 rounded font-medium ${
              isActive
                ? "border-l-8 border-teal-500 shadow shadow-gray-400 dark:text-white dark:shadow-teal-500"
                : "border-l-8 border-transparent text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <li className="flex items-center pl-2">
              <span>
                <BiChart
                  className={`text-xl ${
                    isActive ? "text-teal-600" : "text-gray-400"
                  }`}
                />
              </span>
              <h1 className="pl-2">Charts</h1>
            </li>
          )}
        </NavLink>

        <NavLink
          to="/calender"
          className={({ isActive }) =>
            `flex items-center py-2 rounded font-medium ${
              isActive
                ? "border-l-8 border-teal-500 shadow shadow-gray-400 dark:text-white dark:shadow-teal-500"
                : "border-l-8 border-transparent text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <li className="flex items-center pl-2">
              <span>
                <BiCalendar
                  className={`text-xl ${
                    isActive ? "text-teal-600" : "text-gray-400"
                  }`}
                />
              </span>
              <h1 className="pl-2">Calender</h1>
            </li>
          )}
        </NavLink>

        <NavLink
          to="/contact-us"
          className={({ isActive }) =>
            `flex items-center py-2 rounded font-medium ${
              isActive
                ? "border-l-8 border-teal-500 shadow shadow-gray-400 dark:text-white dark:shadow-teal-500"
                : "border-l-8 border-transparent text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <li className="flex items-center pl-2">
              <span>
                <MdContacts
                  className={`text-xl ${
                    isActive ? "text-teal-600" : "text-gray-400"
                  }`}
                />
              </span>
              <h1 className="pl-2">Contact Us</h1>
            </li>
          )}
        </NavLink>
      </ul>
    </aside>
  );
}
