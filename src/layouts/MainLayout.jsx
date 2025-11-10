import Header from "../components/header/Header";
import Aside from "../components/aside/Aside";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { GlobalContext } from "../context/Context";

export default function MainLayout({ children }) {
  const { theme } = useContext(GlobalContext);
  return (
    <main className="grid h-full w-full grid-cols-[14rem_1fr] grid-rows-[4rem_1fr] bg-white dark:bg-gray-950">
      <Header />

      <Aside />

      <div className="lg:col-start-2 lg:col-end-3 col-start-1 col-end-3 row-start-2 mx-2 lg:mx-0 lg:mr-2 xl:mx-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-3xl">
        {children}
        <ToastContainer
          position="top-center"
          theme={theme === "dark" ? "light" : "dark"}
          autoClose={3000}
        />
      </div>
    </main>
  );
}
