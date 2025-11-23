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
  const { providerId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [description, setDescription] = useState("");

  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const user = JSON.parse(localStorage.getItem("serviceUser"));
  const userId = user?.id;
  const userName = user?.name || "";
  const userMobile = user?.mobile || "";
  const userAddress = user?.address || "";


  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/service/provider/${providerId}`
        );

        const data = res.data.provider || res.data;

        if (data) {
          setProvider(data);

          if (Array.isArray(data.serviceProviding) && data.serviceProviding[0]) {
            setSelectedServiceId(data.serviceProviding[0].id);
          }
        }
      } catch (err) {
        console.error("Provider load failed:", err);
        toast.error("Failed to load provider");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);


  const handleBooking = async () => {
    if (!userId) return toast.error("Login required");
    if (!bookingDate || !bookingTime)
      return toast.error("Select date & time");
    if (!selectedServiceId)
      return toast.error("Select a service");

    const bookingData = {
      userId: Number(userId),
      providerId: Number(providerId),
      serviceId: Number(selectedServiceId),

      userName,
      userAddress,
      userMobile,

      bookingDate,
      bookingTime,
      description,

      paymentDone: false,
      status: "PENDING",
    };

    console.log("Sending booking:", bookingData);

    try {
      await axios.post("http://localhost:8080/booking/create", bookingData);

      toast.success("Booking created successfully!");

      setTimeout(() => navigate("/user/dashboard"), 1200);
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err);
      toast.error("Booking failed. Check console.");
    }
  };

  if (loading)
    return (
      <h2 className="text-center mt-32 text-gray-500">Loading provider...</h2>
    );

  if (!provider)
    return (
      <h2 className="text-center mt-32 text-gray-600">Provider Not Found</h2>
    );

  const services = Array.isArray(provider.serviceProviding)
    ? provider.serviceProviding
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <Toaster />

      <div className="pt-32 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-2xl overflow-hidden border"
        >
          <div className="md:flex">
            {/* LEFT */}
            <div className="md:w-1/2 p-8 flex flex-col items-center bg-gradient-to-b from-blue-100 to-white">
              <div className="w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center text-4xl font-bold text-blue-700 shadow-lg mb-4">
                {provider.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              <h2 className="text-2xl font-bold text-gray-800">
                {provider.name}
              </h2>

              <p className="text-blue-600 font-medium text-center">
                {services.map((s) => s.categoryName).join(", ")}
              </p>

              <div className="mt-4 flex flex-col gap-2 text-gray-700 text-sm">
                <p className="flex items-center gap-2">
                  <Star className="text-yellow-400" size={18} /> 4.8 / 5.0
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase size={18} className="text-gray-500" />{" "}
                  {provider.yearOfExperience ?? 0} years
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

            {/* RIGHT */}
            <div className="md:w-1/2 p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Book {provider.name?.split(" ")[0]}
                </h3>

                <div className="space-y-4">
                  {/* SERVICE LIST */}
                  <select
                    value={selectedServiceId || ""}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.categoryName}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-blue-600" />
                    <input
                      type="date"
                      className="border rounded-lg w-full px-3 py-2"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-blue-600" />
                    <input
                      type="time"
                      className="border rounded-lg w-full px-3 py-2"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                    />
                  </div>

                  <textarea
                    rows="3"
                    className="border rounded-lg w-full px-3 py-2"
                    placeholder="Additional notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="bg-gray-100 p-4 rounded-xl shadow-inner mt-6">
                  <p className="text-sm text-gray-500 mb-1">Contact</p>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <Phone size={18} className="text-blue-600" /> +91{" "}
                    {provider.mobileNumber}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  className="flex-1 border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-full hover:bg-blue-600 hover:text-white transition"
                  onClick={() =>
                    provider.mobileNumber &&
                    window.open(`tel:+91${provider.mobileNumber}`)
                  }
                >
                  Contact Now
                </button>

                <button
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition"
                  onClick={handleBooking}
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
