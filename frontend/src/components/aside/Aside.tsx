import { NavLink } from "react-router-dom";
import ContactIcon from "../../icons/ContactIcon.svg?react";
import DashBoardIcon from "../../icons/DashboardIcon.svg?react";
import BarChartIcon from "../../icons/BarChartIcon.svg?react";
import ChartIcon from "../../icons/ChartIcon.svg?react";
import CalendarIcon from "../../icons/CalendarIcon.svg?react";
import { BiCalendar } from "react-icons/bi";

interface AsideParams {
  isAsideOpen: boolean;
}

export default function Aside({ isAsideOpen }: AsideParams) {
  return (
    <aside
      className={`col-start-1 col-end-2 max-h-194 row-start-2 transition-transform duration-300 lg:translate-x-0 ${
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
                <DashBoardIcon
                  height={20}
                  width={20}
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
                <BarChartIcon
                  height={20}
                  width={20}
                  strokeWidth={0.5}
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
                <ChartIcon
                  height={20}
                  width={20}
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
                <CalendarIcon
                  height={20}
                  width={20}
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
                <ContactIcon
                  width={20}
                  height={20}
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
