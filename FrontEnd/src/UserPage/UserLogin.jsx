import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import login_img from "../assets/login.png";
import { setAppUser , setAppUserId} from "../api";

export default function UserLogin() {
  const [view, setView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        mailID: email,
        password: password,
      });

      const res = response.data;

      if (res.success) {
        setAppUser(res.user);
        setAppUserId(res.user.id.toString());
        toast.success(res.message || "Login successful!", {
          position: "bottom-right",
          style: {
            background: "#4169E1",
            color: "white",
            borderRadius: "8px",
            fontWeight: "500",
          },
        });
        setTimeout(() => navigate("/user/dashboard"), 1000);
      } else {
        toast.error(res.message || "Invalid credentials!");
        if (res.message === "No user found with this email") {
          toast("Redirecting to Sign Up page...", {
            icon: "🔹",
            duration: 1500,
            style: {
              background: "#4169E1",
              color: "white",
            },
          });
          setTimeout(() => navigate("/user/signup"), 1500);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed! Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster />
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Login Form */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#4169E1] mb-6">Welcome Back!</h2>
          <p className="text-gray-600 mb-6">Log in to continue accessing your account</p>

          <form onSubmit={login} className="space-y-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4169E1] outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={view ? "password" : "text"}
                placeholder="Enter your password"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4169E1] outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="absolute right-3 top-3 text-gray-600 text-xl cursor-pointer"
                onClick={() => setView(!view)}
              >
                {view ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4169E1] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <Link to="/user/signup" className="text-[#4169E1] font-semibold">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Illustration */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-[#4169E1] to-[#89A7FF]">
          <img src={login_img} alt="illustration" className="max-w-[80%]" />
        </div>

      </div>
    </div>
  );
}
