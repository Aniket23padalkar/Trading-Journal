import { Link } from "react-router-dom";
import logo from "../../assets/TradeLens-Logo2.png";
import logoDark from "../../assets/TradeLens-Dark.png";
import { FaBars } from "react-icons/fa6";
import { BiMoon, BiSun } from "react-icons/bi";
import { useContext } from "react";
import { GlobalContext } from "../../context/Context";

export default function Header() {
  const { theme, setTheme, isAsideOpen, setIsAsideOpen } =
    useContext(GlobalContext);

  function handleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <header className="col-start-1 col-end-3 flex h-16 w-full justify-between items-center bg-white dark:bg-gray-950 grow pr-10  px-4 py-3">
      <div className="h-16 flex items-center">
        <div
          onClick={() => setIsAsideOpen(!isAsideOpen)}
          className="text-xl cursor-pointer dark:text-white lg:hidden"
        >
          <FaBars />
        </div>
        <div className="h-full w-40">
          <Link to="/">
            <img
              className="h-full w-full object-cover"
              src={theme === "light" ? logo : logoDark}
              alt="Logo"
            />
          </Link>
        </div>
      </div>
      <div className="flex items-center h-full">
        <button
          onClick={handleTheme}
          className="mr-4 cursor-pointer p-2 hover:bg-blue-100 dark:hover:bg-indigo-900 rounded-full"
        >
          {theme === "light" ? (
            <BiMoon className="text-2xl" />
          ) : (
            <BiSun className="text-2xl text-white" />
          )}
        </button>
        <div className="flex items-center">
          <div className="flex items-center justify-center cursor-pointer text-xl font-bold h-10 w-10 bg-violet-300 rounded-4xl">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
