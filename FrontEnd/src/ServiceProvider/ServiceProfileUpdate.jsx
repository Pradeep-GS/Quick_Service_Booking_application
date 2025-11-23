import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ServiceProfileUpdate() {
  const navigate = useNavigate();
  const storedId = localStorage.getItem("serviceProviderId");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    dob: "",
    age: "",
    country: "",
    address: "",
    pincode: "",
    district: "",
    state: "",
    gender: "",
    yearOfExperience: "",
    salaryPerHr: ""
  });

  // Fetch provider profile
  useEffect(() => {
    if (!storedId) {
      navigate("/service/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/service/provider/${storedId}`);
        if (res.data?.success && res.data.provider) {
          const provider = res.data.provider;
          setForm({ ...provider });
          if (provider.serviceProvidingIds) setSelectedCategories(provider.serviceProvidingIds);
        } else {
          toast.error("Failed to load profile");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [storedId, navigate]);

  // Fetch service categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/service/getcat");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleCategoryChange = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        serviceProvidingIds: selectedCategories.map(Number),
        yearOfExperience: Number(form.yearOfExperience) || 0,
        salaryPerHr: parseFloat(form.salaryPerHr) || 0
      };
      const res = await axios.put(`http://localhost:8080/service/update/${storedId}`, payload);
      if (res.data?.success) {
        toast.success("Profile updated successfully!");
        setTimeout(() => navigate("/service/dashboard"), 900);
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-[#4169E1] mb-4">Update Profile</h2>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name"
            className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email"
            className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password"
            className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
          <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="Mobile Number"
            className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" name="dob" value={form.dob} onChange={handleChange}
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
            <input type="text" name="age" value={form.age} readOnly placeholder="Age"
              className="border p-3 rounded-xl bg-gray-100 shadow-sm" />
          </div>
          <select name="gender" value={form.gender} onChange={handleChange}
            className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          {/* Service Selection */}
          <label className="font-semibold mt-4">Select Services</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((cat) => (
              <button type="button" key={cat.id} onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  selectedCategories.includes(cat.id)
                    ? "bg-[#4169E1] text-white border-transparent"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-[#4169E1] hover:text-white"
                }`}>
                {cat.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Address & Details</h3>
          <textarea name="address" value={form.address} onChange={handleChange} rows="4" placeholder="Address"
            className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
          <div className="grid grid-cols-2 gap-3">
            <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode"
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
            <input name="district" value={form.district} onChange={handleChange} placeholder="District"
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
          </div>
          <input name="state" value={form.state} onChange={handleChange} placeholder="State"
            className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
          <input name="country" value={form.country} onChange={handleChange} placeholder="Country"
            className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
          <div className="grid grid-cols-2 gap-3">
            <input name="yearOfExperience" value={form.yearOfExperience} onChange={handleChange} placeholder="Years of Experience"
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
            <input name="salaryPerHr" value={form.salaryPerHr} onChange={handleChange} placeholder="Salary / hr"
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
          </div>

          <button onClick={handleUpdate} disabled={loading}
            className="mt-6 w-full bg-[#4169E1] text-white py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
