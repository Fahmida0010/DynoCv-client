import {
    createBrowserRouter,
    Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import { SocialSuccess } from "../pages/SocialSuccess";
import { PrivateRoute } from "./PrivateRoute";
import { AttributesPage } from "../pages/Dashboard/candidate/Attributespage";
import { ProjectsPage } from "../pages/Dashboard/candidate/ProjectsPage";
import Profile from "../pages/Dashboard/Common/profile";




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
                element: <Register />
            },
            {
                path: "oauth-success",
                element: <SocialSuccess />
            },
        ]
    },

    // Dashboard Layout & Protected Routes
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            
            { index: true, element: <Navigate to="/dashboard/profile" replace /> },
            
            // ২. কমন পেজ (সবার প্রোফাইল পাথ এক)
            { path: "profile", element: <Profile /> },
            // { path: "discussions", element: <DiscussionsPage /> }, 

            // ৩. CANDIDATE Protected Routes
            {
                element: <PrivateRoute allowedRoles={["CANDIDATE"]} />,
                children: [
                    {
                        path: "attributes",
                        element: <AttributesPage />
                    },
                    {
                        path: "projects",
                        element: <ProjectsPage />
                    },
                    // {
                    //     path: "my-cvs", 
                    //     element: <MyCVsPage />
                    // },
                    // {
                    //     path: "available-positions", 
                    //     element: <AvailablePositionsPage />
                    // },
                ]
            },

            // ৪. RECRUITER Protected Routes
            {
                element: <PrivateRoute allowedRoles={["RECRUITER"]} />,
                children: [
                    // {
                    //     path: "positions",
                    //     element: <PositionsPage />
                    // },
                    // {
                    //     path: "create-position",
                    //     element: <CreatePositionPage />
                    // },
                    // {
                    //     path: "attribute-library",
                    //     element: <AttributeLibraryPage />
                    // },
                    // {
                    //     path: "candidate-cvs",
                    //     element: <CandidateCVsPage />
                    // },
                ]
            },

            // ৫. ADMIN Protected Routes
            {
                element: <PrivateRoute allowedRoles={["ADMIN"]} />,
                children: [
                    // {
                    //     path: "statistics",
                    //     element: <StatisticsPage />
                    // },
                    // {
                    //     path: "users",
                    //     element: <ManageUsersPage />
                    // },
                    // {
                    //     path: "all-cvs",
                    //     element: <AllCVsPage />
                    // },
                    // {
                    //     path: "settings",
                    //     element: <SystemSettingsPage />
                    // },
                ]
            }
        ]
    }
]);