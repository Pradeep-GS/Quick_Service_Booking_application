import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserLogin from './UserPage/UserLogin';
import UserSignIn from './UserPage/UserSignIn';
import Home from './Home';
import UserDashBoard from './UserPage/UserDashBoard';
import UserProfileSetUp from './UserPage/UserProfileSetUp';

const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
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
    path:"/user/dashboard",
    element:<UserDashBoard/>
  },
  {
    path:"/user/profilesetup",
    element:<UserProfileSetUp/>
  }
  
]);

  const App = ()=>{
    return(
      <RouterProvider router={router}/>
    )
  }

export default App;
