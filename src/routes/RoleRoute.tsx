import { Navigate, Outlet } from "react-router";
import { getUser, resolveUserRoleName } from "../lib/auth";

type RoleRouteProps = {
    allowedRoles: string[];
};

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
    const user = getUser();
    const roleName = resolveUserRoleName(user);
    const normalizedAllowedRoles = allowedRoles.map((role) =>
        role.trim().toLowerCase()
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (!roleName || !normalizedAllowedRoles.includes(roleName)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
