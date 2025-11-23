import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import login_img from "../assets/login.png";

export default function UserSignIn() {
  const navigate = useNavigate();
  const [view, setView] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", pass: "", phone: "" });
  const [rules, setRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const updateRules = (password) => {
    setRules({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*_\-]/.test(password),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (name === "pass") updateRules(value);
  };

  const emailIsValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneIsValid = (phone) => /^\d{10}$/.test(phone);

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.pass || !form.phone) {
      toast.error("All fields are required");
      return;
    }
    if (!emailIsValid(form.email)) {
      toast.error("Enter a valid email");
      return;
    }
    if (!phoneIsValid(form.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    updateRules(form.pass);
    const allOk = Object.values(rules).every(Boolean);
    if (!allOk) {
      toast.error("Password must meet all rules");
      return;
    }

    try {
      const checkRes = await axios.post("http://localhost:8080/user/search", {
        mailID: form.email,
        mobileNumber: form.phone,
      });

      if (checkRes.data && checkRes.data.success) {
        toast.success("User already exists. Redirecting to login...");
        setTimeout(() => navigate("/user/login"), 800);
        return;
      }

      navigate("/user/profilesetup", {
        state: {
          userName: form.name,
          mailID: form.email,
          password: form.pass,
          mobileNumber: form.phone,
        },
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  const RuleLine = ({ ok, text }) => (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${ok ? "bg-green-500" : "bg-gray-300"}`}>
        {ok ? "✓" : "✗"}
      </div>
      <div className={`text-sm ${ok ? "text-gray-700" : "text-gray-400"}`}>{text}</div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster />
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#4169E1] mb-6">Create Account</h2>

          <form onSubmit={handleContinue} className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4169E1] outline-none" />

            <input name="email" value={form.email} onChange={handleChange} placeholder="Email address" type="email" className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4169E1] outline-none" />

            <div className="relative">
              <input name="pass" value={form.pass} onChange={handleChange} placeholder="Create password" type={view ? "text" : "password"} className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4169E1] outline-none" />
              <div onClick={() => setView((v) => !v)} className="absolute right-3 top-3 text-gray-600 cursor-pointer">
                {view ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1">
              <RuleLine ok={rules.length} text="At least 8 characters" />
              <RuleLine ok={rules.uppercase} text="One uppercase letter" />
              <RuleLine ok={rules.lowercase} text="One lowercase letter" />
              <RuleLine ok={rules.number} text="One number" />
              <RuleLine ok={rules.special} text="One special character (!@#$...)" />
            </div>

            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Mobile number (10 digits)" className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4169E1] outline-none" />

            <button type="submit" className="w-full bg-[#4169E1] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Continue</button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <Link to="/user/login" className="text-[#4169E1]">Log in</Link></p>
        </div>

        <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-[#4169E1] to-[#89A7FF]">
          <img src={login_img} alt="illustration" className="max-w-[80%]" />
        </div>
      </div>
    </div>
  );
}
