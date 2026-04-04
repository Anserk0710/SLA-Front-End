import { Navigate, Outlet } from "react-router";
import { getUser } from "../lib/auth";

type RoleRouteProps = {
    allowedRoles: string[];
};

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
    const user = getUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (!allowedRoles.includes(user.role.full_name)) {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
}