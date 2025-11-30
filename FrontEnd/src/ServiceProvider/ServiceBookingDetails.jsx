import { useEffect, useState } from "react";
import { Phone, Calendar, Clock, MapPin, Check, X, CheckCircle } from "lucide-react";
import ServiceNavbar from "./ServiceNavbar";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { 
  getProviderBookings, 
  updateBookingStatus, 
  getServiceProvider 
} from "../api";

export default function ServiceBookingDetails() {
  const user = getServiceProvider();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState({});

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const data = await getProviderBookings(user.id);
      setBookings(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bookingId, action) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: action }));
    try {
      const updated = await updateBookingStatus(bookingId, action);
      
      // Use the response from backend to update state
      setBookings(prev =>
        prev.map(b => (b.bookingId === bookingId ? updated : b))
      );

      const actionText = action === "ACCEPT" ? "accepted" : action === "COMPLETE" ? "completed" : "cancelled";
      toast.success(`Booking ${actionText} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: null }));
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const totalOrders = bookings.length;
  const totalPending = bookings.filter(b => b.status === "PENDING").length;
  const totalAccepted = bookings.filter(b => b.status === "ACCEPTED").length;
  const totalCompleted = bookings.filter(b => b.status === "COMPLETED").length;
  const totalCancelled = bookings.filter(b => b.status === "CANCELLED").length;

  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ServiceNavbar />
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto mt-24">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "All Orders", value: totalOrders, status: "All", color: "bg-blue-500" },
            { label: "Pending", value: totalPending, status: "PENDING", color: "bg-yellow-500" },
            { label: "Accepted", value: totalAccepted, status: "ACCEPTED", color: "bg-green-500" },
            { label: "Completed", value: totalCompleted, status: "COMPLETED", color: "bg-purple-500" },
            { label: "Cancelled", value: totalCancelled, status: "CANCELLED", color: "bg-red-500" },
          ].map((card) => (
            <button
              key={card.status}
              onClick={() => setFilter(card.status)}
              className={`p-4 rounded-xl shadow-md transition-all transform hover:scale-105 ${
                filter === card.status
                  ? `${card.color} text-white`
                  : "bg-white text-gray-700 hover:shadow-lg"
              }`}
            >
              <p className="text-sm font-medium opacity-90">{card.label}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No bookings found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(b => {
              const isActionPending = actionLoading[b.bookingId];
              const isPending = b.status === "PENDING";
              const isAccepted = b.status === "ACCEPTED";
              const isCompleted = b.status === "COMPLETED";
              const isCancelled = b.status === "CANCELLED";

              return (
                <div
                  key={b.bookingId}
                  className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                      {b.userName?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "US"}
                    </div>
                    <div className="ml-3">
                      <h2 className="text-lg font-semibold text-gray-800">{b.userName}</h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone size={14} /> +91 {b.userMobile}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="flex items-center gap-2 text-gray-700">
                      <MapPin size={16} className="text-blue-500" />
                      <span className="text-sm">{b.userAddress}</span>
                    </p>
                    <p className="text-gray-700">
                      <strong>Service:</strong> {b.serviceName}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} className="text-blue-500" />
                      {new Date(b.bookingDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-blue-500" />
                      {b.bookingTime}
                    </p>
                    <p className="text-gray-700">
                      <strong>Description:</strong> {b.description || "N/A"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      isPending ? "bg-yellow-100 text-yellow-700" :
                      isAccepted ? "bg-green-100 text-green-700" :
                      isCompleted ? "bg-purple-100 text-purple-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  {/* PENDING: Show Accept/Reject buttons */}
                  {isPending && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(b.bookingId, "ACCEPT")}
                        disabled={!!isActionPending}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Check size={18} />
                        {isActionPending === "ACCEPT" ? "Accepting..." : "Accept"}
                      </button>

                      <button
                        onClick={() => handleAction(b.bookingId, "CANCEL")}
                        disabled={!!isActionPending}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <X size={18} />
                        {isActionPending === "CANCEL" ? "Cancelling..." : "Reject"}
                      </button>
                    </div>
                  )}

                  {/* ACCEPTED: Show Complete button and Chat button */}
                  {isAccepted && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAction(b.bookingId, "COMPLETE")}
                        disabled={!!isActionPending}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        {isActionPending === "COMPLETE" ? "Completing..." : "Mark as Completed"}
                      </button>

                      <Link
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition w-full flex items-center justify-center gap-2 shadow-md"
                        to="/provider-chat">
                        <MessageCircle size={20} />
                        CHAT HERE
                      </Link>
                    </div>
                  )}

                  {/* COMPLETED: Show completed message */}
                  {isCompleted && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                      <p className="text-sm text-purple-700 font-medium">✓ Work completed</p>
                    </div>
                  )}

                  {/* CANCELLED: Show cancelled message */}
                  {isCancelled && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                      <p className="text-sm text-red-700 font-medium">Booking Cancelled</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}