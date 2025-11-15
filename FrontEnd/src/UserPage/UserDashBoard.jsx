import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavbar from "./UserNavbar";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // ✅ Fetch providers and categories from backend
  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/service/getproviders");
      setProviders(res.data);
    } catch (err) {
      console.error("Error fetching providers:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/service/getcat");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // 🆕 Extract unique districts dynamically from provider data
  const districts = [...new Set(providers.map((p) => p.district))];

  // ✅ Filter providers by name/category/district
  const filteredProviders = providers.filter((p) => {
    const matchByName = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchByCategory =
      p.serviceProviding &&
      p.serviceProviding.some((cat) =>
        cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchByDistrict =
      !selectedDistrict || p.district === selectedDistrict;

    return (matchByName || matchByCategory) && matchByDistrict;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      {/* Search Section */}
      <div className="pt-32 text-center px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Find Service Providers Near You
        </h2>

        <div className="flex  justify-center gap-3 max-w-3xl mx-auto">
          {/* 🔍 Search bar */}
          <input
            type="text"
            placeholder="Search for electrician, plumber..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-2/3 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
          />

          {/* 🧩 Category Filter */}
          <select
            className="border border-gray-300  px-4  focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          {/* 📍 District Filter */}
          <select
            className="border border-gray-300  px-4 focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            {districts.map((dist, i) => (
              <option key={i} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Providers List */}
      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProviders.length > 0 ? (
          filteredProviders.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 p-6 text-center"
            >
              <img
                src={`https://randomuser.me/api/portraits/${
                  p.gender === "Male" ? "men" : "women"
                }/${p.id * 5}.jpg`}
                alt={p.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>

              {/* ✅ Show categories from serviceProviding */}
              <p className="text-sm text-gray-500">
                {p.serviceProviding &&
                  p.serviceProviding.map((c) => c.categoryName).join(", ")}
              </p>

              <p className="mt-2 text-yellow-500">
                ⭐ {Math.floor(Math.random() * (5 - 3 + 1)) + 3}.0
              </p>
              <p className="text-gray-600">{p.district}</p>
              <p className="font-bold text-[#4169E1]">₹{p.salaryPerHr}/hr</p>

              <button
                onClick={() => navigate(`/user/booking/${p.id}`)}
                className="mt-4 bg-[#4169E1] text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-3">
            No providers found for “{searchTerm || selectedDistrict}”.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
