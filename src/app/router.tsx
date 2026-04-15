import { createBrowserRouter } from "react-router";
import AppShell from "../components/layout/AppShell";
import TechnicianShell from "../components/layout/TechnicianShell";
import DashboardPage from "../pages/admin/DashboardPage";
import LoginPage from "../pages/admin/LoginPage";
import TicketDetailPage from "../pages/admin/TicketDetailPage";
import TicketListPage from "../pages/admin/TicketListPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import PublicFormPage from "../pages/public/PublicFormPage";
import PublicSuccessPage from "../pages/public/PublicSuccessPage";
import TrackingPage from "../pages/public/TrackingPage";
import MyAssignedTicketsPage from "../pages/technician/MyAssignedTicketsPage";
import TechnicianTicketDetailPage from "../pages/technician/TechnicianTicketDetailPage";
import PrivateRoute from "../routes/PrivateRoute";
import RoleRoute from "../routes/RoleRoute";
import ReportsPage from "../pages/admin/ReportsPage";

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
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={["ADMIN", "HEAD"]} />,
        children: [
          {
            path: "/admin",
            element: <AppShell />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: "tickets", element: <TicketListPage /> },
              { path: "tickets/:ticketId", element: <TicketDetailPage /> },
              { path: "reports", element: <ReportsPage /> },
            ],
          },
        ],
      },
      {
        element: <RoleRoute allowedRoles={["TECHNICIAN"]} />,
        children: [
          {
            path: "/technician",
            element: <TechnicianShell />,
            children: [
              { index: true, element: <MyAssignedTicketsPage /> },
              {
                path: "tickets/:ticketId",
                element: <TechnicianTicketDetailPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
