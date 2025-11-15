import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLogin from "./UserPage/UserLogin";
import UserSignIn from "./UserPage/UserSignIn";
import Home from "./Home";
import UserDashBoard from "./UserPage/UserDashBoard";
import UserProfileSetUp from "./UserPage/UserProfileSetUp";
import ServiceLogin from "./ServiceProvider/ServiceLogin";
import ServiceSignin from "./ServiceProvider/ServiceSignin";
import ServiceProfilesetup from "./ServiceProvider/ServiceProfilesetup";
import UserBookingPage from "./UserPage/UserBookingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  // USER ROUTES
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
  path: "/user/booking/:providerId",
  element: <UserBookingPage />,
},

  // SERVICE ROUTES
  {
    path: "/service/login",
    element: <ServiceLogin />,
  },
  {
    path: "/service/sigin",
    element: <ServiceSignin />,
  },
  {
    path: "/service/profilesetup",
    element: <ServiceProfilesetup />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
