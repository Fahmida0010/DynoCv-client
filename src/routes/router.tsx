import {
    createBrowserRouter,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";


import Home from "../pages/Home";
import { Login } from "../pages/Login";
import {Register} from "../pages/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/common/DashboardHome";
import Profile from "../pages/Dashboard/common/profile";
import { SocialSuccess } from "../pages/SocialSuccess";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [

            {
                index: true,
                element: <Home />
            },
             

            {
                path: "login",
                element: <Login />
            },

            {
                path: "register",
                element: <Register/>
            },
 { path:"oauth-success",
     element :<SocialSuccess />
    },

        ]
    },

     //dashboardlayout
              {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome/>,
      },
        {
                path: "profile",
                element: <Profile/>
              },
     
        ]
    }

]);