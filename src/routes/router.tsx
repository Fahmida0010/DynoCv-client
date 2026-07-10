import {
    createBrowserRouter,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";


import Home from "../pages/Home";
import { Login } from "../pages/Login";
import {Register} from "../pages/Register";
import Profile from "../pages/Profile";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/common/DashboardHome";


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
                path: "profile",
                element: <Profile/>
            },

            {
                path: "login",
                element: <Login />
            },

            {
                path: "register",
                element: <Register/>
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
        ]
    }

]);