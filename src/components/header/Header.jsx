import { Link } from "react-router-dom";
import logo from "../../assets/TradeLens-Logo2.png";
import { FaBars } from "react-icons/fa6";

export default function Header() {
  return (
    <header className="col-start-1 col-end-3 flex h-16 w-full justify-between items-center grow  px-4 py-3">
      <div className="h-16 flex items-center">
        <div className="text-xl cursor-pointer">
          <FaBars />
        </div>
        <Link to="/">
          <div className="h-full w-40">
            <img className="h-full w-full object-cover" src={logo} alt="Logo" />
          </div>
        </Link>
      </div>
      <div className="flex items-center h-full">
        <div className="flex items-center">
          <h4 className="font-medium">Hello, Aniket</h4>
        </div>
      </div>
    </header>
  );
}
