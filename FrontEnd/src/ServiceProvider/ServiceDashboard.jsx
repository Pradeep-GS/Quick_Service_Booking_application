import { useEffect, useState } from "react";
import ServiceNavbar from "./ServiceNavbar";
import { getServiceProvider, api } from "../api";
import toast, { Toaster } from "react-hot-toast";
import { Phone, Calendar, Clock, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ServiceDashboard() {
  const [user] = useState(() => getServiceProvider());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/booking/provider/${user.id}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, uiStatus) => {
    const statusMap = {
      PENDING: "ACCEPT",
      COMPLETED: "COMPLETE",
      CANCELLED: "CANCEL",
    };

    const newStatus = statusMap[uiStatus];

    try {
      await api.put(`/booking/provider/action/${bookingId}?action=${newStatus}`);
      toast.success("Booking updated");

      setBookings(prev =>
        prev.map(b =>
          b.bookingId === bookingId ? { ...b, status: uiStatus } : b
        )
      );

      if (uiStatus !== "PENDING") {
        setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <ServiceNavbar />
        <h2 className="text-center mt-32 text-gray-500">Loading bookings...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <ServiceNavbar />
        <h2 className="text-center mt-32 text-red-500">Please log in to view dashboard</h2>
      </div>
    );
  }

  const totalOrders = bookings.length;
  const totalPending = bookings.filter(b => b.status === "PENDING").length;
  const totalCompleted = bookings.filter(b => b.status === "COMPLETED").length;
  const totalCancelled = bookings.filter(b => b.status === "CANCELLED").length;
  const pendingBookings = bookings.filter(b => b.status === "PENDING");

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <ServiceNavbar />
      <Toaster />
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#4169E1] mb-6">Bookings Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: "Total Orders", value: totalOrders, bg: "bg-[#4169E1]" },
            { label: "Pending", value: totalPending, bg: "bg-yellow-500" },
            { label: "Completed", value: totalCompleted, bg: "bg-green-500" },
            { label: "Cancelled", value: totalCancelled, bg: "bg-red-500" },
          ].map(card => (
            <div
              key={card.label}
              className={`p-6 rounded-2xl shadow-lg text-white flex flex-col justify-center items-center ${card.bg}`}
            >
              <p className="text-sm font-medium">{card.label}</p>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {pendingBookings.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No pending bookings</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {pendingBookings.map(b => (
                <motion.div
                  key={b.bookingId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white shadow-lg rounded-3xl border border-gray-200 p-6 flex flex-col hover:shadow-2xl transition"
                >
                  <div className="w-16 h-16 rounded-full bg-[#E6EEF9] flex items-center justify-center text-xl font-bold text-[#4169E1] mb-4">
                    {b.userName
                      ? b.userName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
                      : "US"}
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800">{b.userName}</h2>
                  <p className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin size={16} className="text-[#4169E1]" /> {b.userAddress}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 mb-1">
                    <Phone size={16} className="text-[#4169E1]" /> +91 {b.userPhone || b.userMobile}
                  </p>

                  <p className="text-gray-700 mb-1"><strong>Service:</strong> {b.serviceName}</p>
                  <p className="text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={16} className="text-[#4169E1]" /> {new Date(b.bookingDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mb-1 flex items-center gap-2">
                    <Clock size={16} className="text-[#4169E1]" /> {b.bookingTime}
                  </p>
                  <p className="text-gray-700 mb-4"><strong>Description:</strong> {b.description || "N/A"}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
