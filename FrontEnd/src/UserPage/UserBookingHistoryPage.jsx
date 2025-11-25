import { useEffect, useState } from "react";
import axios from "axios";
import UserNavbar from "./UserNavbar";
import { toast} from "react-hot-toast";
import {getAppUser} from "../api";
const UserBookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingBookingId, setPayingBookingId] = useState(null);

  const user = getAppUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError("User not found. Please login first.");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/booking/user/${userId}`);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load previous bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const handlePayNow = async (bookingId) => {
    try {
      setPayingBookingId(bookingId);
      const res = await axios.post(
        `http://localhost:8080/booking/create-checkout-session`,
        null,
        { params: { bookingId } }
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Payment URL not received. Try again later.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment. Please try again.")
    } finally {
      setPayingBookingId(null);
    }
  };

  const getDisplayStatus = (booking) => {
    if (booking.status === "PENDING") {
      return { text: "PENDING", color: "text-yellow-600" };
    } else if (booking.status === "ACCEPTED" && !booking.paymentDone) {
      return { text: "ACCEPTED - PAYMENT PENDING", color: "text-blue-600" };
    } else if (booking.status === "ACCEPTED" && booking.paymentDone) {
      return { text: "COMPLETED", color: "text-green-600" };
    } else if (booking.status === "COMPLETED" && !booking.paymentDone) {
      return { text: "COMPLETED - PAYMENT PENDING", color: "text-purple-600" };
    } else if (booking.status === "COMPLETED" && booking.paymentDone) {
      return { text: "COMPLETED", color: "text-green-600" };
    } else if (booking.status === "CANCELLED") {
      return { text: "CANCELLED", color: "text-red-600" };
    }
    return { text: booking.status, color: "text-gray-600" };
  };

  const renderBookingCard = (b) => {
    const displayStatus = getDisplayStatus(b);
    const showPayButton =!b.paymentDone;

    return (
      <div
        key={b.bookingId}
        className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition hover:-translate-y-1"
      >
        <div className="mb-3">
          <p className="text-gray-500 text-sm">Service</p>
          <p className="text-lg font-semibold">{b.serviceName || "N/A"}</p>
        </div>

        <div className="mb-3 flex justify-between">
          <div>
            <p className="text-gray-500 text-sm">Date</p>
            <p className="text-lg">{b.bookingDate}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Time</p>
            <p className="text-lg">{b.bookingTime}</p>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-gray-500 text-sm">Description</p>
          <p className="text-lg">{b.description || "None"}</p>
        </div>

        <div className="mb-3">
          <p className="text-gray-500 text-sm">Status</p>
          <p className={`text-lg font-bold ${displayStatus.color}`}>
            {displayStatus.text}
          </p>
        </div>

        {showPayButton && (
          <button
            onClick={() => handlePayNow(b.bookingId)}
            disabled={ b.status === "ACCEPTED" || b.status==="PENDING"}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 w-full"
          >
            {payingBookingId === b.bookingId ? "Processing..." : "Pay Now"}
          </button>
        )}


        {b.paymentDone && (
          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-green-600 font-semibold">✓ Payment Completed</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="container mx-auto p-4 pt-28">
        <h1 className="text-3xl font-bold text-center text-[#4169E1] mb-2">
          Your Previous Bookings
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Track your service bookings and complete payments
        </p>

        {loading && <p className="text-center text-gray-600 mt-4">Loading...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {!loading && bookings.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No bookings found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {bookings.map(renderBookingCard)}
        </div>
      </div>
    </div>
  );
};

export default UserBookingHistoryPage;