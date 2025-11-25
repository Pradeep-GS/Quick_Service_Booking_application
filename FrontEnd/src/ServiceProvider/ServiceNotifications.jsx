import { useEffect, useState } from "react";
import ServiceNavbar from "./ServiceNavbar";
import { getServiceProvider, getProviderBookings, updateBookingStatus } from "../api";
import toast, { Toaster } from "react-hot-toast";
import { Phone, Calendar, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ServiceNotifications() {
  const user = getServiceProvider();
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const data = await getProviderBookings(user.id);
      setBookings(data.filter(b => b.status === "NOT_YET_CONFIRMED" || b.status === "PENDING"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success("Status updated");
      fetchBookings();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <ServiceNavbar />
        <Toaster />
        <p className="text-center mt-32 text-gray-500">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <ServiceNavbar />
      <Toaster />
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        {bookings.map(b => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0 md:space-x-6"
          >
            <div className="flex-1">
              <h1 className="text-[20px] font-semibold text-[#4169E1]">{b.userName}</h1>
              <p className="text-gray-700 flex items-center gap-2 mb-1">
                <MapPin size={16} className="text-[#4169E1]" /> {b.userAddress}
              </p>
              <p className="text-gray-700 flex items-center gap-2 mb-1">
                <Phone size={16} className="text-[#4169E1]" /> +91 {b.userPhone}
              </p>
              <p className="text-gray-700 flex items-center gap-2 mb-1">
                <Calendar size={16} className="text-[#4169E1]" /> {new Date(b.bookingDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700 flex items-center gap-2 mb-1">
                <Clock size={16} className="text-[#4169E1]" /> {b.bookingTime}
              </p>
              <p className="text-gray-700 mb-1"><strong>Service:</strong> {b.serviceName}</p>
              <p className="text-gray-700 mb-1"><strong>Description:</strong> {b.description || "N/A"}</p>
            </div>

            <div className="flex flex-col space-y-2">
              <select
                value={b.status}
                onChange={e => handleStatusChange(b.id, e.target.value)}
                className="border px-3 py-2 rounded text-[#4169E1] font-medium"
              >
                {b.status === "NOT_YET_CONFIRMED" && <option value="PENDING">Accept</option>}
                <option value="CANCELLED">Cancel</option>
                {b.status === "PENDING" && <option value="COMPLETED">Complete</option>}
              </select>

              <button
                onClick={() => navigate(`/service/booking/${b.id}`)}
                className="bg-[#4169E1] text-white px-3 py-2 rounded hover:bg-blue-700 transition"
              >
                Go to Booking Page
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}