import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavbar from "./UserNavbar";
import { Star, IndianRupee } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/service/getproviders");
      setProviders(res.data || []);
    } catch (err) {
      console.error("Error fetching providers:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/service/getcat");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const districts = [...new Set(providers.map(p => p.district).filter(Boolean))];

  const filteredProviders = providers.filter((p) => {
    const matchName = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !selectedCategory || p.serviceProviding?.some(
      c => c.categoryName === selectedCategory
    );
    const matchDistrict = !selectedDistrict || p.district === selectedDistrict;
    return (matchName || searchTerm === "") && matchCategory && matchDistrict;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="pt-32 text-center px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Find Service Providers Near You
        </h2>

        <div className="flex justify-center gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Search services or provider..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-2/3 border border-gray-300 rounded-full px-5 py-3 focus:ring-2 focus:ring-[#4169E1]"
          />

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="border border-gray-300 px-4 focus:ring-2 focus:ring-[#4169E1]"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.categoryName}>{c.categoryName}</option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="border border-gray-300 px-4 focus:ring-2 focus:ring-[#4169E1]"
          >
            <option value="">All Districts</option>
            {districts.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProviders.length > 0 ? filteredProviders.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#E6EEF9] mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-[#4169E1]">
              {p.name?.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase() || "SP"}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.serviceProviding?.map(c => c.categoryName).join(", ")}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Star size={16} />
              <span className="text-yellow-500">⭐ {Math.floor(Math.random() * 3 + 3)}.0</span>
            </div>
            <p className="text-gray-600 mt-2">{p.district}</p>
            <p className="font-bold text-[#4169E1] mt-1 flex items-center justify-center gap-1">
              <IndianRupee size={16} /> ₹{p.salaryPerHr}/hr
            </p>
            <button
              onClick={() => navigate(`/user/booking/${p.id}`)}
              className="mt-4 bg-[#4169E1] text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              View Details
            </button>
          </div>
        )) : (
          <p className="text-center text-gray-600 col-span-3">
            No providers found for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
