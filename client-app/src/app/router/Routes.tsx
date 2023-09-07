import { RouteObject, Navigate, createBrowserRouter } from "react-router-dom";
import NotFound from "../../features/Errors/NotFound";
import TestErrors from "../../features/Errors/TestErrors";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ProfilePage from "../../features/profiles/ProfilePage";
import App from "../App";
import RouterAuth from "./RouterAuth";
import HomePage from "../../features/home/HomePage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RouterAuth />,
        children: [
          { path: "activities", element: <ActivityDashboard /> },
          { path: "activities/:id", element: <ActivityDetails /> },
          { path: "createActivity", element: <ActivityForm /> },
          { path: "createActivity/edit/:id", element: <ActivityForm /> },
          { path: "profiles/:userName", element: <ProfilePage /> },
          { path: "errors", element: <TestErrors /> }, //TODO: admin only
        ],
      },
      {
        path: "/",
        element: <HomePage />,
      },
      { path: "not-found", element: <NotFound /> },
      { path: "server-error", element: <TestErrors /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
