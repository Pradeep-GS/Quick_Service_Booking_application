import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ServiceProfilesetup = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [form, setForm] = useState({
    userName: "",
    mailID: "",
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
    exp: "",
    package: "",
  });

  const locate = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (locate.state) {
      setForm((prev) => ({
        ...prev,
        userName: locate.state.name || "",
        mailID: locate.state.email || "",
        password: locate.state.password || "",
        mobileNumber: locate.state.phone || "",
      }));
    }
  }, [locate.state]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("http://localhost:8080/service/getcat");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories!");
      }
    }
    fetchCategories();
  }, []);

  const handleDOB = (e) => {
    const dob = e.target.value;
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    setForm({ ...form, dob, age });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCategoryChange = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = {
      name: form.userName,
      email: form.mailID,
      password: form.password,
      mobileNumber: form.mobileNumber,
      gender: form.gender,
      serviceProvidingIds: selectedCategories.map((id) => Number(id)),
      yearOfExperience: Number(form.exp),
      salaryPerHr: parseFloat(form.package),
      dob: form.dob,
      age: Number(form.age),
      country: form.country,
      address: form.address,
      pincode: form.pincode,
      district: form.district,
      state: form.state,
    };

    try {
      const response = await axios.post("http://localhost:8080/service/signup", formDataToSend);
      if (response.data.success) {
        toast.success("Profile created successfully!");
        navigate("/service/dashboard")
      } else {
        toast.error("Something went wrong during signup!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error! Check console for details.");
    }
  };

  const countries = ["India", "United States", "United Kingdom", "Germany", "France", "Japan", "China", "Australia", "Canada", "Brazil"];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-8">
        <h2 className="text-4xl font-bold text-[var(--primary--color)] text-center">Profile Setup</h2>
        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Section */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="Full Name"
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleDOB}
                className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
                required
              />
              <input
                type="text"
                name="age"
                value={form.age}
                placeholder="Age"
                readOnly
                className="border p-3 rounded-xl shadow-sm bg-gray-100"
              />
            </div>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
              required
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              type="email"
              name="mailID"
              value={form.mailID}
              onChange={handleChange}
              placeholder="Email"
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
              required
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
              required
            />

            <input
              type="text"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
              required
            />

            <label className="font-semibold mt-4">Select Your Services</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedCategories.includes(cat.id)
                      ? "bg-[var(--primary--color)] text-white border-transparent"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-[var(--primary--color)] hover:text-white"
                  }`}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="exp"
                value={form.exp}
                onChange={handleChange}
                placeholder="Years of Experience"
                className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
                required
              />
              <input
                type="number"
                step="0.01"
                name="package"
                value={form.package}
                onChange={handleChange}
                placeholder="Hourly Rate"
                className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
                required
              />
            </div>

            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
              required
            >
              <option value="">Select Country</option>
              {countries.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              rows="4"
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
              required
            ></textarea>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
                required
              />
              <input
                type="text"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="District"
                className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
                required
              />
            </div>

            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary--color)]"
              required
            />

            <button
              type="submit"
              className="mt-6 bg-[var(--primary--color)] py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceProfilesetup;
