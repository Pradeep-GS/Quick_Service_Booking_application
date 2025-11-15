import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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

  // Get prefilled data from navigation state
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

  // Fetch categories from backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("http://localhost:8080/service/getcat");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Handle DOB and auto-calculate age
  const handleDOB = (e) => {
    const dob = e.target.value;
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setForm({ ...form, dob, age });
  };

  // Handle form field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle checkbox toggle
  const handleCategoryChange = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };

  // Submit function
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

    console.log("Payload being sent:", formDataToSend);

    try {
      const response = await axios.post(
        "http://localhost:8080/service/signup",
        formDataToSend
      );
      if (response.data.success) {
        alert("Profile created successfully!");
      } else {
        alert("Something went wrong during signup!");
      }
    } catch (err) {
      console.error("Error submitting profile:", err);
      alert("Server error, check console for details.");
    }
  };

  const countries = ["India", "United States", "United Kingdom", "Germany", "France", "Japan", "China", "Australia", "Canada", "Brazil"];

  return (
    <div className="w-full bg-[var(--primary--color)] flex items-center justify-center p-6">
      <div className="container w-[90%] bg-white p-5 rounded-2xl overflow-y-auto max-h-[95vh]">
        <h3 className="text-center text-4xl text-[var(--primary--color)] mt-2 font-bold">
          Profile Setup
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {/* Left Section */}
            <div>
              <label className="block mt-4">Your Name</label>
              <input
                type="text"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                className="w-full border p-2 outline-none"
                required
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleDOB}
                    className="w-full border p-2"
                    required
                  />
                </div>
                <div>
                  <label>Age</label>
                  <input
                    type="text"
                    name="age"
                    value={form.age}
                    readOnly
                    className="w-full border p-2 bg-gray-100"
                  />
                </div>
              </div>

              <label className="block mt-4">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <label className="block mt-4">Email</label>
              <input
                type="email"
                name="mailID"
                value={form.mailID}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />

              <label className="block mt-4">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />

              <label className="block mt-4">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />

              <label className="block mt-4 mb-2">
                Select Your Service Providing
              </label>
              <div className="grid grid-cols-2 gap-2 border p-2 rounded">
                {categories.map((cat) => (
                  <label key={cat.id} className="text-sm flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={cat.id}
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryChange(cat.id)}
                    />
                    {cat.categoryName}
                  </label>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Year of Experience</label>
                  <input
                    type="number"
                    name="exp"
                    value={form.exp}
                    onChange={handleChange}
                    className="w-full border p-2"
                    required
                  />
                </div>
                <div>
                  <label>Salary per Hour</label>
                  <input
                    type="number"
                    step="0.01"
                    name="package"
                    value={form.package}
                    onChange={handleChange}
                    className="w-full border p-2"
                    required
                  />
                </div>
              </div>

              <label className="block mt-4">Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              >
                <option value="">Select Country</option>
                {countries.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <label className="block mt-4">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border p-2"
                rows="4"
                required
              ></textarea>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full border p-2"
                    required
                  />
                </div>
                <div>
                  <label>District</label>
                  <input
                    type="text"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full border p-2"
                    required
                  />
                </div>
              </div>

              <label className="block mt-4">State</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />

              <button
                type="submit"
                className="w-full mt-6 bg-[var(--primary--color)] py-2 text-white font-semibold rounded"
              >
                Update The Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceProfilesetup;
