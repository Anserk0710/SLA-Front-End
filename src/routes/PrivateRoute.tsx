import { Navigate, Outlet, useLocation } from "react-router";
import { getToken } from "../lib/auth";

export default function PrivateRoute() {
    const location = useLocation();

    if (!getToken()) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}