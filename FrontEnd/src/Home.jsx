import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4169E1] to-[#89A7FF] flex flex-col items-center justify-center p-4">
      
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Left Section: Text */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4169E1] leading-tight">
            Welcome To <span className="text-[#FF6B6B]">Quick</span> Service Booking App
          </h1>
          <p className="text-gray-700 text-lg">
            Looking for a reliable professional to get the job done quickly? QuickServe connects you with verified service providers near you. Book services easily and track your bookings effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              to="/user/login"
              className="px-6 py-3 bg-[#4169E1] text-white font-semibold rounded-lg shadow hover:bg-[#2b4ab2] transition"
            >
              Log In As Customer
            </Link>
            <Link
              to="/service/login"
              className="px-6 py-3 border-2 border-[#4169E1] text-[#4169E1] font-semibold rounded-lg shadow hover:bg-[#4169E1] hover:text-white transition"
            >
              Log In As Service Provider
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold text-[#4169E1] mb-2">For Customers</h2>
          <p className="text-gray-700">
            Find verified professionals, book services instantly, track your bookings, and provide feedback. Save time and ensure quality service with QuickServe.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold text-[#4169E1] mb-2">For Service Providers</h2>
          <p className="text-gray-700">
            Grow your business, reach more clients, and manage bookings efficiently. Showcase your skills, set availability, and get rated by satisfied customers.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-16 text-center text-gray-700 max-w-3xl">
        <p>
          QuickServe is designed for everyone who values <span className="font-bold text-[#4169E1]">time, convenience, and quality</span>. Seamless communication, instant bookings, and stress-free service experiences—all in one app.
        </p>
      </div>
    </div>
  );
};

export default Home;
