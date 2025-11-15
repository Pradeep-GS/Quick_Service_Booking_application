import { useState } from 'react';
import login_img from '../assets/login.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const UserLogin = () => {
  const [view, setView] = useState(true);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    if (!email || !pass) {
      toast.error("Please enter email and password!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        mailID: email,
        password: pass,
      });

      const res = response.data;

      if (res.success) {
        // ✅ Save userId in localStorage
        localStorage.setItem("userId", res.user.id);
        localStorage.setItem("userName", res.user.name);
        localStorage.setItem("userEmail", res.user.mailID);

        toast.success(res.message || "Login successful!", {
          position: "bottom-right",
          style: {
            background: "#4169E1",
            color: "white",
            borderRadius: "8px",
            fontWeight: "500",
          },
        });

        setTimeout(() => navigate("/user/dashboard"), 1500);
      } else {
        toast.error(res.message || "Invalid credentials!");
        navigate("/user/signup");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed! Please try again.");
    }
  };

  return (
    <div className="container sm:p-10 lg:w-[70%] h-[70vh] mx-auto lg:grid lg:grid-cols-2 mt-[5%]">
      <Toaster />
      <div className="form border-[1px] flex flex-col justify-center">
        <h1 className="text-center text-5xl text-[var(--primary--color)] my-10">LOG IN</h1>
        <div className="form w-[80%] mx-auto">
          <form onSubmit={login} className="mx-auto">
            <div className="mail border-[1px] w-full h-10">
              <input
                type="text"
                id="email"
                placeholder="Enter Your Email"
                className="w-full h-10 p-1 outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="pass border-[1px] w-full mt-10 h-10 flex">
              <input
                type={view ? "password" : "text"}
                id="password"
                placeholder="Enter Your Password"
                name="pass"
                className="w-[100%] h-10 p-1 outline-none"
                onChange={(e) => setPass(e.target.value)}
              />
              <div
                type="button"
                className="mr-1 text-2xl mt-2 cursor-pointer text-center"
                onClick={() => setView(!view)}
              >
                {view ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <button
              type="submit"
              className="mt-10 w-[80%] border-[1px] mx-9 bg-[var(--primary--color)] px-2 py-2 text-white cursor-pointer"
            >
              Log In
            </button>
          </form>
          <p className="mt-10 text-center">
            If Not Registered?{" "}
            <Link to={"/user/signup"} className="text-blue-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <div className="image bg-[var(--primary--color)] hidden lg:flex justify-center items-center text-white">
        <img src={login_img} alt="login" />
      </div>
    </div>
  );
};

export default UserLogin;
