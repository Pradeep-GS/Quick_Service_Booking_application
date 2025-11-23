import { Link, useNavigate } from "react-router-dom";
import { getServiceUser, removeServiceUser } from "../api";

export default function ServiceNavbar() {
  const navigate = useNavigate();
  const user = getServiceUser();

  const handleLogout = () => {
    removeServiceUser();
    navigate("/service/login");
  };

  return (
     <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#4169E1]">QuickServe</h1>
        <div className="space-x-6 text-gray-700 font-medium">
          <Link to="/service/dashboard" className="hover:text-[#4169E1] transition">Home</Link>
          <Link to="/service/history" className="hover:text-[#4169E1] transition">History of My Booking</Link>
          <Link to="/service/notifications" className="hover:text-[#4169E1] transition">Notification</Link>
          <Link to="/" className="text-red-500 hover:text-red-600 transition">Logout</Link>
        </div>
      </div>
    </nav>
  );
}
