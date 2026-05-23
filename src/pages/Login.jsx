import React, { useState, useContext } from 'react';
import Logo from "../assets/logo.png";
import google from '../assets/google.png';
import bgImage from "../assets/login-bg.jpg";
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import Loading from '../component/Loading';

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);

  const navigate = useNavigate();

  // Email Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        serverUrl + '/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      setLoading(false);
      getCurrentUser();
      navigate("/");
      alert("Login Successful ✅");

    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Login Failed ❌");
    }
  };

  // Google Login
  const googlelogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      await axios.post(
        serverUrl + "/api/auth/googlelogin",
        { name: user.displayName, email: user.email },
        { withCredentials: true }
      );

      getCurrentUser();
      navigate("/");
      alert("Google Login Successful 🚀");

    } catch (error) {
      console.log(error);
      alert("Google Login Failed");
    }
  };

  return (
    <div
      className="relative h-screen w-screen flex items-center justify-end pr-6 md:pr-20 text-white overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",        // FULL SCREEN FIT
        backgroundPosition: "center",   // CENTER IMAGE
        backgroundRepeat: "no-repeat"   // NO REPEAT
      }}
    >

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Left Text Section */}
      <div className="hidden md:flex flex-col gap-4 max-w-xl absolute left-16 bottom-16 z-10">
        <h1 className="text-5xl font-bold leading-tight">
          Fashion that <br />
          <span className="text-yellow-400">Defines</span> You
        </h1>

        <p className="text-gray-300 text-lg">
          Discover premium clothing for every style and every occasion.
        </p>

        <div className="flex gap-8 mt-4 text-sm text-gray-300">
          <span>⭐ Premium Quality</span>
          <span>🚚 Fast Delivery</span>
          <span>🔒 Secure Shopping</span>
        </div>
      </div>

      {/* Login Card Right Side */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">

        {/* Logo */}
        <div
          className="flex items-center justify-center gap-3 mb-6 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={Logo} alt="logo" className="w-85" />
         {/* <h1 className="text-2xl font-bold">Clocci Collection</h1> */}
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-gray-300 text-sm mt-2">
            Login to continue shopping your favorite styles
          </p>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={googlelogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <img src={google} alt="google" className="w-5" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-gray-500" />
          <span className="text-gray-300 text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-gray-500" />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-200">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-sm text-gray-200">Password</label>
            <input
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-12"
            />

            <div
              className="absolute right-4 top-[38px] cursor-pointer text-gray-300 hover:text-white"
              onClick={() => setShow(prev => !prev)}
            >
              {show ? <IoEye size={20} /> : <IoEyeOutline size={20} />}
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 font-semibold flex items-center justify-center transition-all"
          >
            {loading ? <Loading /> : "Login"}
          </button>

          {/* Signup */}
          <p className="text-center text-sm text-gray-300 mt-2">
            Don't have an account?{' '}
            <span
              className="text-indigo-400 font-semibold cursor-pointer hover:text-indigo-300"
              onClick={() => navigate("/signup")}
            >
              Create New Account
            </span>
          </p>

        </form>
      </div>

    </div>
  );
}

export default Login;
