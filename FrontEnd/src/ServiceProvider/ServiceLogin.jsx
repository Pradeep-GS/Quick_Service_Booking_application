import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate,Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import login_img from "../assets/service_login.png";
import { loginServiceUser } from "../api";

export default function ServiceLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [view, setView] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !pass) return toast.error("Enter email & password!");
    try {
      const res = await loginServiceUser(email, pass);
      if (res.success) {
        toast.success("Login successful");
        setTimeout(() => navigate("/service/dashboard"), 900);
      } else toast.error(res.message || "Invalid credentials");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Toaster />
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#4169E1] mb-4">Service Provider Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg px-4 py-3 outline-none" />
            <div className="relative">
              <input value={pass} onChange={e=>setPass(e.target.value)} type={view ? "password" : "text"} placeholder="Password" className="w-full border rounded-lg px-4 py-3 outline-none" />
              <div className="absolute right-3 top-3 cursor-pointer" onClick={()=>setView(!view)}>
                {view ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <button type="submit" className="w-full bg-[#4169E1] text-white py-3 rounded-lg">Log In</button>
              <p className="text-center text-sm text-gray-500 mt-4"> Don’t have an account?<Link to="/service/signin" className="text-[#4169E1] font-semibold">Sign Up
              </Link>
              </p>
          </form>
        </div>
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-[#4169E1] to-[#89A7FF]">
          <img src={login_img} alt="illustration" className="max-w-[80%]" />
        </div>
      </div>
    </div>
  );
}
