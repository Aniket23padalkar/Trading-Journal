import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/TradeLens-Logo2.png";
import logoDark from "../../assets/TradeLens-Dark.png";
import { FaBars } from "react-icons/fa6";
import { BiMoon, BiSun } from "react-icons/bi";
import { useContext, useState } from "react";
import { GlobalContext } from "../../context/Context";
import { AuthContext } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/auth";

export default function Header() {
  const { theme, setTheme, isAsideOpen, setIsAsideOpen } =
    useContext(GlobalContext);
  const { user } = useContext(AuthContext);
  const [logoutWindow, setLogoutWindow] = useState(false);
  const navigate = useNavigate();

  function handleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
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
        <div className="flex items-center relative">
          <div
            onClick={() => setLogoutWindow(!logoutWindow)}
            className="flex items-center justify-center  cursor-pointer text-lg font-medium capitalize text-white px-2 bg-green-600 dark:bg-teal-600 rounded"
          >
            {`Hi, ${user.displayName}` || "A"}
          </div>
          {logoutWindow && (
            <div className="flex flex-col items-center justify-between absolute z-10 bg-white -bottom-22 p-2 -left-50  min-w-70 rounded-lg shadow shadow-gray-500">
              <span className="flex text-md w-full pl-2 gap-1">
                <p className="text-gray-500 text-nowrap">Email Id : </p>{" "}
                <h1 className="text-blue-500 text-wrap"> {user.email}</h1>
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
