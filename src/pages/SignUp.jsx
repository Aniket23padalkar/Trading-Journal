import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/TradeLens-Logo2.png";
import { useState } from "react";
import { auth } from "../firebase/auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ScaleLoader } from "react-spinners";
import DashboardImg from "../assets/Dashboard_V1.1.png";
import TradesImg from "../assets/Trades_V1.1.png";
import { toast } from "react-toastify";

export default function SignUp() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [userSignUpInfo, setUserSignUpInfo] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setUserSignUpInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetSignUp() {
    setUserSignUpInfo({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }

  async function handleSignUp(e) {
    e.preventDefault();
    const { userName, email, password, confirmPassword } = userSignUpInfo;

    if (password !== confirmPassword) {
      toast.error("Password Dont Match!");
      return;
    }

    try {
      setBtnLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: userName });

      toast.success("Account Created Successfully!");
      resetSignUp();
      setBtnLoading(false);
      navigate("/signin");
    } catch (err) {
      console.log(err);
      alert(err.message);
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
          onSubmit={handleSignUp}
          className="flex w-full pl-4 items-center flex-col pb-1"
        >
          <input
            className="px-4 py-1.5 w-full border rounded border-gray-400 outline-none focus:border-teal-400"
            type="text"
            required
            name="userName"
            value={userSignUpInfo.userName}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            className="px-4 mt-2 w-full py-1.5 border rounded border-gray-400 outline-none focus:border-teal-400"
            type="email"
            name="email"
            required
            value={userSignUpInfo.email}
            placeholder="Email..."
            onChange={handleChange}
          />
          <input
            className="px-4 mt-2 w-full py-1.5 border rounded border-gray-400 outline-none focus:border-teal-400"
            type="password"
            name="password"
            required
            value={userSignUpInfo.password}
            placeholder="Password"
            onChange={handleChange}
          />
          <input
            className="px-4 mt-2 py-1.5 w-full border rounded border-gray-400 outline-none focus:border-teal-400"
            type="password"
            required
            name="confirmPassword"
            value={userSignUpInfo.confirmPassword}
            placeholder="Confirm Password"
            onChange={handleChange}
          />

          <button className="bg-teal-500 py-1 w-full mt-4 rounded text-white font-medium">
            {btnLoading ? <ScaleLoader height={20} /> : "Sign Up"}
          </button>
          <Link to="/signin" className="text-xs text-blue-700 underline mt-2">
            Go to Sign In Page
          </Link>
        </form>
      </div>
    </div>
  );
}
