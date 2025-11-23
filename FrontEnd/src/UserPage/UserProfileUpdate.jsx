import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UserProfileUpdate() {
  const navigate = useNavigate();
  const storedId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!storedId) {
      navigate("/user/login");
      return;
    }
    axios
      .get(`http://localhost:8080/user/user/${storedId}`)
      .then((res) => {
        if (res.data && res.data.success && res.data.user) {
          setForm(res.data.user);
        } else {
          toast.error("Failed to load profile");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch profile");
      })
      .finally(() => setLoading(false));
  }, [storedId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!form) return;
    try {
      const payload = {
        userName: form.userName,
        mailID: form.mailID,
        password: form.password,
        mobileNumber: form.mobileNumber,
        dob: form.dob || null,
        age: form.age || null,
        country: form.country || "",
        address: form.address || "",
        pincode: form.pincode || "",
        district: form.district || "",
        state: form.state || "",
      };
      const res = await axios.put(
        `http://localhost:8080/user/update/${storedId}`,
        payload
      );
      if (res.data && res.data.success) {
        toast.success("Profile updated");
        setTimeout(() => navigate("/user/dashboard"), 900);
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!form)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No profile data
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7ff] p-6">
      <Toaster />

      <div className="max-w-5xl w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-10 border border-gray-200">

        {/* Left Column */}
        <div>
          <h2 className="text-3xl font-bold text-[#4169E1] mb-6">
            Update Profile
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Full Name
              </label>
              <input
                name="userName"
                value={form.userName || ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 mt-1 shadow-sm focus:ring-2 focus:ring-[#4169E1] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email
              </label>
              <input
                name="mailID"
                value={form.mailID || ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 mt-1 shadow-sm focus:ring-2 focus:ring-[#4169E1] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Password
              </label>
              <input
                name="password"
                value={form.password || ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 mt-1 shadow-sm focus:ring-2 focus:ring-[#4169E1] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Mobile Number
              </label>
              <input
                name="mobileNumber"
                value={form.mobileNumber || ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 mt-1 shadow-sm focus:ring-2 focus:ring-[#4169E1] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Address Information
          </h3>

          <textarea
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-[#4169E1] outline-none"
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Pincode
              </label>
              <input
                name="pincode"
                value={form.pincode || ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 shadow-sm focus:ring-2 focus:ring-[#4169E1] outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                District
              </label>
              <input
                name="district"
                value={form.district || ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 shadow-sm focus:ring-2 focus:ring-[#4169E1] outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-600">State</label>
            <input
              name="state"
              value={form.state || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 shadow-sm focus:ring-2 focus:ring-[#4169E1] outline-none"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-600">
              Country
            </label>
            <input
              name="country"
              value={form.country || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 shadow-sm focus:ring-2 focus:ring-[#4169E1] outline-none"
            />
          </div>

          <button
            onClick={handleUpdate}
            className="mt-6 w-full bg-[#4169E1] text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
