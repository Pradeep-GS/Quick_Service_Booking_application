import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import axios from 'axios';

const RatingCard = ({ userName, bookingId, ratingValue, comments, createdAt }) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <User className="w-6 h-6" style={{ color: '#4169E1' }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{userName}</h3>
            <p className="text-sm text-gray-500">Booking #{bookingId}</p>
            <p className="text-xs text-gray-400 mt-1">{formatDate(createdAt)}</p>
          </div>
        </div>
        
        {/* Rating Badge */}
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#4169E1' }}>
          <Star className="w-4 h-4 text-white fill-white" />
          <span className="text-white font-semibold text-sm">{ratingValue}.0</span>
        </div>
      </div>

      {/* Star Rating Display */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= ratingValue 
                ? 'fill-current' 
                : 'fill-none'
            }`}
            style={{ color: star <= ratingValue ? '#4169E1' : '#E5E7EB' }}
          />
        ))}
      </div>

      {/* Comment Section */}
      {comments && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {comments}
          </p>
        </div>
      )}
    </div>
  );
};

// Main Component with API Integration
const ServiceRating = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const providerId = 1;

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/rating/provider/${providerId}`);
        setRatings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching ratings:', err);
        setError('Failed to load ratings');
        setRatings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [providerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
          <p className="text-gray-600 mb-8">See what our customers are saying</p>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading ratings...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
          <p className="text-gray-600 mb-8">See what our customers are saying</p>
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
        <p className="text-gray-600 mb-8">
          {ratings.length > 0 
            ? `See what our ${ratings.length} customer${ratings.length > 1 ? 's' : ''} are saying` 
            : 'No reviews yet'
          }
        </p>
        
        {ratings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {ratings.map((rating) => (
              <RatingCard
                key={rating.id}
                userName={rating.userName}
                bookingId={rating.bookingId}
                ratingValue={rating.ratingValue}
                comments={rating.comments}
                createdAt={rating.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No reviews yet</p>
              <p className="text-sm">Customer reviews will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRating;