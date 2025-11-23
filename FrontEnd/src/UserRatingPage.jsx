import { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function UserRatingPage() {
  const { bookingId } = useParams(); // if you're passing booking id in URL
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const submitRating = async () => {
    if (rating === 0) {
      toast.error("Please select a rating!");
      return;
    }

    try {
      const payload = {
        rating,
        comment: review,
        bookingId,
      };

      await axios.post("http://localhost:8080/rating/add", payload);

      toast.success("Thank you for your feedback!");

      setTimeout(() => navigate("/user/dashboard"), 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit rating");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
      <Toaster />

      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Rate Your Service
        </h2>

        {/* Stars */}
        <div className="flex justify-center gap-3 my-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={35}
              className={`cursor-pointer transition-all duration-150 ${
                (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* Review Box */}
        <textarea
          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          rows="4"
          placeholder="Write your review (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={submitRating}
          className="w-full mt-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
}
