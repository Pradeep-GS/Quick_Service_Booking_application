import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";

// User pages
import UserLogin from "./UserPage/UserLogin";
import UserSignIn from "./UserPage/UserSignIn";
import UserDashBoard from "./UserPage/UserDashBoard";
import UserProfileSetUp from "./UserPage/UserProfileSetUp";
import UserProfileUpdate from "./UserPage/UserProfileUpdate";
import UserBookingPage from "./UserPage/UserBookingPage";
import UserRatingPage from "./UserRatingPage";
import UserBookingHistoryPage from "./UserPage/UserBookingHistoryPage";
// Service Provider pages
import ServiceLogin from "./ServiceProvider/ServiceLogin";
import ServiceSignin from "./ServiceProvider/ServiceSignin";
import ServiceProfilesetup from "./ServiceProvider/ServiceProfilesetup";
import ServiceProfileUpdate from "./ServiceProvider/ServiceProfileUpdate";
import ServiceDashboard from "./ServiceProvider/ServiceDashboard"; // Corrected import
import ServiceBookingDetails from "./ServiceProvider/ServiceBookingDetails";
import PaymentUpdate from "./UserPage/PaymentUpdate";
import Admin from "./Admin";
import ServiceRating from "./ServiceProvider/ServiceRating";
import UserChat from "./UserChat";
import ProviderChat from "./ProviderChat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/user/login",
    element: <UserLogin />,
  },
  {
    path: "/user/signup",
    element: <UserSignIn />,
  },
  {
    path: "/user/dashboard",
    element: <UserDashBoard />,
  },
  {
    path: "/user/profilesetup",
    element: <UserProfileSetUp />,
  },
  {
  path: "/user/bookings",
  element: <UserBookingHistoryPage />,
  },
  {
    path: "/user/profileupdate",
    element: <UserProfileUpdate />,
  },
  {
    path: "/user/booking/:providerId",
    element: <UserBookingPage />,
  },
  {
    path: "/service/login",
    element: <ServiceLogin />,
  },
  {
    path: "/service/signin",
    element: <ServiceSignin />,
  },
  {
    path: "/service/profilesetup",
    element: <ServiceProfilesetup />,
  },
  {
    path: "/service/dashboard",
    element: <ServiceDashboard />,
  },
  {
    path: "/service/history",
    element: <ServiceBookingDetails />,
  },
  {
    path: "/service/profileupdate",
    element: <ServiceProfileUpdate />,
  },
  {
    path: "/rate/:bookingId",
    element: <UserRatingPage />,
  },
  {
    path: "/service/myratings",
    element:<ServiceRating/>
  },
  {
    path: "/admin/panel",
    element: <Admin />,
  },
  {
    path: "/payment-success",
    element: <PaymentUpdate />,
  },
  {path:"/user-chat",
    element:<UserChat/>
  },
  {path:"/provider-chat",
    element:<ProviderChat/>
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
