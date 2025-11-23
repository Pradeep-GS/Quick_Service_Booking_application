import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const PaymentUpdate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      alert("Payment session not found.");
      navigate("/user/dashboard");
      return;
    }

    const markPayment = async () => {
      try {
        // Calling corrected backend API
        await axios.put("http://localhost:8080/booking/update-payment", null, {
          params: { sessionId },
        });

        setLoading(false);

        setTimeout(() => {
          navigate("/user/dashboard");
        }, 3000);
      } catch (err) {
        console.error("Payment verification failed:", err);

        alert("Payment verification failed. Please contact support.");
        navigate("/user/dashboard");
      }
    };

    markPayment();
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        className="bg-white p-10 rounded-3xl shadow-lg flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!loading && (
          <motion.div
            className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
              className="w-16 h-16 stroke-green-500"
            >
              <motion.path
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l7 7 17-17"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </motion.svg>
          </motion.div>
        )}

        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? "Verifying payment..." : "Payment Successful!"}
        </motion.h2>

        {!loading ? (
          <motion.p
            className="text-gray-500 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Redirecting to your dashboard...
          </motion.p>
        ) : (
          <p className="text-gray-500 text-center">Please wait while we verify your payment.</p>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentUpdate;
