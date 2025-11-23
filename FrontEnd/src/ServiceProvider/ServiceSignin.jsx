import { useState } from "react";
import login_img from "../assets/service_login.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export default function ServiceSignin() {
  const [view, setView] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", pass: "", phone: "" });
  const navigate = useNavigate();

  const validatePassword = (p) => {
    if (!p) return "Password required";
    if (p.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(p)) return "At least one uppercase required";
    if (!/\d/.test(p)) return "At least one number required";
    if (!/[!@#$%^&*_-]/.test(p)) return "At least one special char required";
    return null;
  };

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validatePassword(form.pass);
    if (err) {
      toast.error(err);
      return;
    }
    if (!form.email || !form.phone || !form.name) {
      toast.error("Name, email and phone are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/service/check", {
        email: form.email,
        mobileNumber: form.phone
      });
      if (res.data && res.data.success) {
        toast.success("User already exists. Redirecting to login...");
        setTimeout(() => navigate("/service/login"), 900);
      } else {
        navigate("/service/profilesetup", {
          state: {
            name: form.name,
            email: form.email,
            password: form.pass,
            phone: form.phone
          }
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Toaster />
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#4169E1] mb-4">Create Service Account</h2>
          <p className="text-gray-600 mb-6">Enter basic details to continue to profile setup</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full border rounded-lg px-4 py-3 outline-none" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border rounded-lg px-4 py-3 outline-none" />
            <div className="relative">
              <input name="pass" value={form.pass} onChange={handleChange} type={view ? "password" : "text"} placeholder="Password" className="w-full border rounded-lg px-4 py-3 outline-none" />
              <div className="absolute right-3 top-3 text-gray-600 text-xl cursor-pointer" onClick={() => setView(!view)}>
                {view ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Mobile number (10 digits)" className="w-full border rounded-lg px-4 py-3 outline-none" />
            <button type="submit" className="w-full bg-[#4169E1] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Continue</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? <span onClick={() => navigate("/service/login")} className="text-[#4169E1] font-semibold cursor-pointer">Log in</span>
          </p>
        </div>
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-[#4169E1] to-[#89A7FF]">
          <img src={login_img} alt="illustration" className="max-w-[80%]" />
        </div>
      </div>
    </div>
  );
}
