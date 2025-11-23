import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export default function UserProfileSetUp() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate("/user/signup");
    }
  }, [state, navigate]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userName: state?.userName || "",
    mailID: state?.mailID || "",
    password: state?.password || "",
    mobileNumber: state?.mobileNumber || "",
    dob: "",
    age: "",
    country: "",
    address: "",
    pincode: "",
    district: "",
    stateName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateAge = (e) => {
    const dob = e.target.value;
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    setForm((prev) => ({ ...prev, dob, age }));
  };

  const handleCreate = async () => {
    if (!form.userName || !form.mailID || !form.password) {
      toast.error("Name, email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/user/createuser", {
        userName: form.userName,
        mailID: form.mailID,
        password: form.password,
        mobileNumber: form.mobileNumber,
        dob: form.dob,
        age: form.age,
        country: form.country,
        address: form.address,
        pincode: form.pincode,
        district: form.district,
        state: form.stateName,
      });

      if (res.status === 201 || res.data.success) {
        toast.success("Account created! Redirecting to Login...");
        setTimeout(() => navigate("/user/login"), 1000);
      } else {
        toast.error(res.data.message || "Failed to create account");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <Toaster />
      <div className="w-[90%] md:w-[80%] bg-white shadow-xl rounded-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT */}
        <div>
          <h2 className="text-3xl font-bold text-[#4169E1] mb-6">
            Complete Your Profile
          </h2>

          <div className="space-y-4">
            <input
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border rounded-lg px-4 py-3"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={calculateAge}
                className="border rounded-lg px-4 py-3"
              />
              <input
                name="age"
                value={form.age}
                readOnly
                placeholder="Age"
                className="border rounded-lg px-4 py-3 bg-gray-100"
              />
            </div>

            <input
              name="mailID"
              value={form.mailID}
              placeholder="Email"
              readOnly
              className="w-full border bg-gray-100 rounded-lg px-4 py-3"
            />

            <input
              name="password"
              value={form.password}
              readOnly
              className="w-full border bg-gray-100 rounded-lg px-4 py-3"
            />

            <input
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Address Details</h3>

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border rounded-lg px-4 py-3 h-24"
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="border rounded-lg px-4 py-3"
            />
            <input
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="District"
              className="border rounded-lg px-4 py-3"
            />
          </div>

          <input
            name="stateName"
            value={form.stateName}
            onChange={handleChange}
            placeholder="State"
            className="border rounded-lg px-4 py-3 w-full mt-4"
          />

          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Country"
            className="border rounded-lg px-4 py-3 w-full mt-4"
          />

          <button
            disabled={loading}
            onClick={handleCreate}
            className="mt-6 w-full bg-[#4169E1] text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
