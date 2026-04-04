import { createBrowserRouter } from "react-router";
import AppShell from "../components/layout/AppShell";
import DashboardPage from "../pages/admin/DashboardPage";
import LoginPage from "../pages/admin/LoginPage";
import TicketListPage from "../pages/admin/TicketListPage";
import PublicFormPage from "../pages/public/PublicFormPage";
import PublicSuccessPage from "../pages/public/PublicSuccessPage";
import TrackingPage from "../pages/public/TrackingPage";
import PrivateRoute from "../routes/PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicFormPage />,
  },
  {
    path: "/success",
    element: <PublicSuccessPage />,
  },
  {
    path: "/tracking",
    element: <TrackingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/admin",
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "tickets",
            element: <TicketListPage />,
          },
        ],
      },
    ],
  },
]);
