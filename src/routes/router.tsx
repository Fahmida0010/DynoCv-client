import {
    createBrowserRouter,
    Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../pages/Dashboard/common/profile";
import { SocialSuccess } from "../pages/SocialSuccess";
import { PrivateRoute } from "./PrivateRoute";
import { AttributesPage } from "../pages/Dashboard/candidate/Attributespage";
import { ProjectsPage } from "../pages/Dashboard/candidate/ProjectsPage";

// Candidate Pages
// import { AttributesPage } from "../pages/Dashboard/Attributespage";
// import { ProjectsPage } from "../pages/Dashboard/candidate/ProjectsPage";

// Recruiter & Admin Pages (আপনার প্রজেক্টের সঠিক পাথ অনুযায়ী এগুলো পরে ইমপোর্ট করে নিবেন)
// import { MyCVsPage } from "../pages/Dashboard/candidate/MyCVsPage";
// import { AvailablePositionsPage } from "../pages/Dashboard/candidate/AvailablePositionsPage";
// import { DiscussionsPage } from "../pages/Dashboard/common/DiscussionsPage";
// import { PositionsPage } from "../pages/Dashboard/recruiter/PositionsPage";
// import { CreatePositionPage } from "../pages/Dashboard/recruiter/CreatePositionPage";
// import { AttributeLibraryPage } from "../pages/Dashboard/recruiter/AttributeLibraryPage";
// import { CandidateCVsPage } from "../pages/Dashboard/recruiter/CandidateCVsPage";
// import { StatisticsPage } from "../pages/Dashboard/admin/StatisticsPage";
// import { ManageUsersPage } from "../pages/Dashboard/admin/ManageUsersPage";
// import { AllCVsPage } from "../pages/Dashboard/admin/AllCVsPage";
// import { SystemSettingsPage } from "../pages/Dashboard/admin/SystemSettingsPage";

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
            // ১. ড্যাশবোর্ডের রুট লিংকে ঢুকলে সরাসরি প্রোফাইলে রিডাইরেক্ট হবে
            { index: true, element: <Navigate to="/dashboard/profile" replace /> },
            
            // ২. কমন পেজ (সবার প্রোফাইল পাথ এক)
            { path: "profile", element: <Profile /> },
            // { path: "discussions", element: <DiscussionsPage /> }, // ক্যান্ডিডেট ও রিক্রুটার উভয়ের জন্যই কমন

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