import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Briefcase,
  IndianRupee,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import UserNavbar from "./UserNavbar";

const UserBookingPage = () => {
  const { providerId } = useParams(); // 👈 FIXED: consistent param name
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking fields
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [description, setDescription] = useState("");

  const userId = localStorage.getItem("userId"); // assuming logged user id stored in localStorage

  // ✅ Fetch provider data
  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) {
        toast.error("Provider ID not found in URL");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8080/service/provider/${providerId}`
        );
        setProvider(res.data);
      } catch (error) {
        console.error("Error fetching provider:", error);
        toast.error("Failed to load provider details");
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [providerId]);

  // ✅ Handle Booking Submission
  const handleBooking = async () => {
    if (!bookingDate || !bookingTime) {
      toast.error("Please select date and time for booking");
      return;
    }

    if (!userId) {
      toast.error("Please log in before booking");
      return;
    }

    try {
      const bookingData = {
        userId: parseInt(userId),
        providerId: parseInt(providerId),
        serviceId: provider.serviceProviding?.[0]?.id || null,
        bookingDate,
        bookingTime,
        description,
      };

      console.log("Booking Data Sent:", bookingData); // ✅ for debugging

      await axios.post("http://localhost:8080/booking/create", bookingData);

      toast.success("🎉 Booking Request Sent to Provider!", {
        position: "bottom-right",
        style: {
          background: "#4169E1",
          color: "white",
          fontWeight: "500",
          borderRadius: "8px",
        },
      });

      setTimeout(() => navigate("/user/dashboard"), 2500);
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Failed to confirm booking. Try again later.");
    }
  };

  if (loading) {
    return (
      <h2 className="text-center mt-32 text-gray-500">
        Loading provider details...
      </h2>
    );
  }

  if (!provider) {
    return (
      <h2 className="text-center mt-32 text-gray-600">Provider Not Found</h2>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <UserNavbar />
      <Toaster />

      <div className="pt-32 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-gray-200"
        >
          <div className="md:flex">
            {/* LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex flex-col items-center bg-gradient-to-b from-[#4169E1]/10 to-white">
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src={provider.imageUrl || "https://via.placeholder.com/150"}
                alt={provider.name}
                className="w-40 h-40 rounded-full object-cover shadow-lg mb-4"
              />

              <h2 className="text-2xl font-bold text-gray-800">
                {provider.name}
              </h2>

              <p className="text-[#4169E1] font-medium text-center">
                {provider.serviceProviding &&
                  provider.serviceProviding.map((cat, index) => (
                    <span key={cat.id}>
                      {cat.categoryName}
                      {index !== provider.serviceProviding.length - 1 ? ", " : ""}
                    </span>
                  ))}
              </p>

              <div className="mt-4 flex flex-col gap-2 text-gray-700 text-sm">
                <p className="flex items-center gap-2">
                  <Star className="text-yellow-400" size={18} /> 4.8 / 5.0
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase size={18} className="text-gray-500" />{" "}
                  {provider.yearOfExperience} years
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={18} className="text-gray-500" />{" "}
                  {provider.district}, {provider.state}
                </p>
                <p className="flex items-center gap-2">
                  <IndianRupee size={18} className="text-gray-500" /> ₹
                  {provider.salaryPerHr}/hr
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="md:w-1/2 p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Book {provider.name?.split(" ")[0]}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-[#4169E1]" />
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#4169E1] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-[#4169E1]" />
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#4169E1] focus:outline-none"
                    />
                  </div>

                  <textarea
                    placeholder="Any additional instructions or notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4169E1] focus:outline-none"
                  ></textarea>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl shadow-inner mt-6">
                  <p className="text-sm text-gray-500 mb-1">Contact</p>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <Phone size={18} className="text-[#4169E1]" /> +91{" "}
                    {provider.mobileNumber}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  className="flex-1 border-2 border-[#4169E1] text-[#4169E1] font-semibold py-3 rounded-full hover:bg-[#4169E1] hover:text-white transition"
                >
                  Contact Now
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 bg-[#4169E1] text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserBookingPage;
