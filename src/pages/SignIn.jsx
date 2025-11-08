import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/TradeLens-Logo2.png";
import { useState } from "react";
import { auth } from "../firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ScaleLoader } from "react-spinners";
import DashboardImg from "../assets/Dashboard_V1.1.png";
import TradesImg from "../assets/Trades_V1.1.png";
import uploadLocalTradesToFirebase from "../utils/uploadLocalTradesToFirebase";
import { toast } from "react-toastify";

export default function SignIn() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [userSignIn, setUserSignIn] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setUserSignIn((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = userSignIn;

    try {
      setBtnLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      await uploadLocalTradesToFirebase();

      setUserSignIn({
        email: "",
        password: "",
      });
      navigate("/dashboard");
      setBtnLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Wrong Email or Password!");
      setBtnLoading(false);
    }
  }

  return (
    <div className="flex w-220 h-120 p-4 bg-linear-to-r from-teal-200 to-white rounded-lg shadow overflow-hidden shadow-gray-500">
      <div className="flex-1 flex flex-col">
        <div className="h-15 w-35">
          <img src={logo} alt="logo" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          <div className="h-60 shadow-lg shadow-gray-500 absolute top-5 right-4 rounded-xl overflow-hidden">
            <img
              className="object-cover h-full w-full"
              src={TradesImg}
              alt="trades page img"
            />
          </div>
          <div className="absolute z-10 h-60 shadow-lg shadow-gray-500 bottom-5 left-0 rounded-xl overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={DashboardImg}
              alt="dashboard img"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/3 border-l border-gray-300 items-center justify-center">
        <h1 className="text-3xl pb-4">
          Wel<span className="text-teal-500">come!</span>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-full pl-4 items-center flex-col pb-1"
        >
          <input
            className="px-4 w-full py-1.5 border rounded border-gray-400 outline-none focus:border-teal-400"
            type="email"
            name="email"
            required
            value={userSignIn.email}
            placeholder="Email..."
            onChange={handleChange}
          />
          <input
            className="px-4 mt-4 w-full py-1.5 border rounded border-gray-400 outline-none focus:border-teal-400"
            type="password"
            name="password"
            required
            value={userSignIn.password}
            placeholder="Password"
            onChange={handleChange}
          />

          <button className="flex w-full items-center justify-center bg-teal-500 py-1 mt-4 rounded text-white font-medium">
            {btnLoading ? <ScaleLoader height={20} width={5} /> : "Sign In"}
          </button>
          <div className="flex items-center justify-end h-5 mt-2">
            <span className="flex items-center gap-1 text-xs">
              Don't have account?{" "}
              <Link to="/signup">
                <h1 className="text-blue-700 underline text-sm">Sign Up</h1>
              </Link>{" "}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
