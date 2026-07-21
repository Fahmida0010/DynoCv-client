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
import Profile from "../pages/Dashboard/Common/profile-temp";
import { Discussions } from "../pages/Dashboard/Common/Discussions";
import { MyCVs } from "../pages/Dashboard/candidate/MyCVs";
import { AvailablePositions } from "../pages/Dashboard/candidate/AvailablePositions";
import { Settings } from "../pages/Dashboard/Common/settings";
import { Positions } from "../pages/Dashboard/recruiter/Positions";
import { CreatePosition } from "../pages/Dashboard/recruiter/CreatePosition";
import { AttributeLibrary } from "../pages/Dashboard/recruiter/AttributeLibrary";
import { CandidateCVs } from "../pages/Dashboard/recruiter/CandidateCVs";
import { Statistics } from "../pages/Dashboard/admin/Statistics";
import { ManageUsers } from "../pages/Dashboard/admin/ManageUsers";
import { AllCVs } from "../pages/Dashboard/admin/AllCVs";
import NotFound from "../pages/NotFound";




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
            { path: "discussions", element: <Discussions /> }, 
             { path: "settings", element: <Settings /> },

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
                    {
                        path: "my-cvs", 
                        element: <MyCVs />
                    },
                    {
                        path: "available-positions", 
                        element: <AvailablePositions/>
                    },
                ]
            },

            // ৪. RECRUITER Protected Routes
            {
                element: <PrivateRoute allowedRoles={["RECRUITER"]} />,
                children: [
                    {
                        path: "positions",
                        element: <Positions />
                    },
                    {
                        path: "create-position",
                        element: <CreatePosition/>
                    },
                    {
                        path: "attribute-library",
                        element: <AttributeLibrary />
                    },
                    {
                        path: "candidate-cvs",
                        element: <CandidateCVs />
                    },
                ]
            },

            // ৫. ADMIN Protected Routes
            {
                element: <PrivateRoute allowedRoles={["ADMIN"]} />,
                children: [
                    {
                        path: "statistics",
                        element: <Statistics />
                    },
                    {
                        path: "users",
                        element: <ManageUsers/>
                    },
                    {
                        path: "all-cvs",
                        element: <AllCVs/>
                    },
                    
                ]
            }
        ]
    },

  {
            path: "*",
            element: <NotFound />
        }
]);