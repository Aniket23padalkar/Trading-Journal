import { Link, useNavigate } from "react-router-dom";
import Icon from "../../ui/Icon.js";
import { useState } from "react";
import { logoutUser } from "../../api/authService.js";
import { useThemeContext } from "../../hooks/useThemeContext.js";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { getErrorMessage } from "../../utils/error.handler.js";

interface HeaderProps {
  isAsideOpen: boolean;
  setIsAsideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ setIsAsideOpen }: HeaderProps) {
  const { theme, setTheme } = useThemeContext();
  const { user } = useAuthContext();
  const [logoutWindow, setLogoutWindow] = useState<boolean>(false);
  const navigate = useNavigate();

  function handleTheme(): void {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  async function handleLogout(): Promise<void> {
    try {
      await logoutUser();
      navigate("/signin");
    } catch (err) {
      const message: string = getErrorMessage(err);
      console.log(message);
    }
  }

  return (
    <header className="col-start-1 col-end-3 flex h-16 w-full justify-between items-center bg-white dark:bg-gray-950 grow pr-10  px-4 py-3">
      <div className="h-16 flex items-center">
        <div
          onClick={() => setIsAsideOpen((prev) => !prev)}
          className="text-xl cursor-pointer dark:text-white lg:hidden"
        >
          <Icon size={20} name="MenuIcon" />
        </div>
        <div className="h-full w-40">
          <Link to="/">
            <img
              className="h-full w-full object-cover"
              src={
                theme === "light"
                  ? "/TradeLens-Logo2.webp"
                  : "/TradeLens-Dark.webp"
              }
              alt="Logo"
              loading="eager"
              fetchPriority="high"
            />
          </Link>
        </div>
      </div>
      <div className="flex items-center h-full">
        <button
          onClick={handleTheme}
          className="mr-2 cursor-pointer p-2 bg-blue-50 dark:bg-gray-800 dark:text-amber-300 text-blue-800  hover:bg-blue-200 dark:hover:bg-indigo-900 rounded-full"
        >
          {theme === "light" ? (
            <Icon size={22} name="MoonIcon" className="text-2xl" />
          ) : (
            <Icon size={22} name="SunIcon" className="text-2xl" />
          )}
        </button>
        <div className="flex items-center relative">
          <div
            onClick={() => setLogoutWindow(!logoutWindow)}
            className="flex items-center justify-center  cursor-pointer text-lg font-medium capitalize dark:text-white rounded"
          >
            {`Hi, ${user?.first_name}` || "A"}
          </div>
          {logoutWindow && (
            <div className="flex flex-col items-center justify-between absolute z-10 bg-white -bottom-22 p-2 -left-50  min-w-70 rounded-lg shadow shadow-gray-500">
              <span className="flex text-md w-full pl-2 gap-1">
                <p className="text-gray-500 text-nowrap">Email Id : </p>{" "}
                <h1 className="text-blue-500 text-wrap"> {user?.email}</h1>
              </span>
              <button
                onClick={handleLogout}
                className="w-20 rounded text-white bg-red-400 mt-4"
              >
                LogOut
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
