import type { User } from "../types/auth";

const TOKEN_KEY = "ticketing_token";
const USER_KEY = "ticketing_user";
const LEGACY_ROLE_FULL_NAME_KEY = "full_name";

export function setAuthSession(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as User;
    } catch {
        return null;
    }
}

export function clearAuthSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function resolveUserRoleName(user: User | null): string | null {
    if (!user?.role) return null;

    const roleRecord = user.role as unknown as Record<string, unknown>;
    const roleName =
        (typeof roleRecord.name === "string" && roleRecord.name) ||
        (typeof roleRecord[LEGACY_ROLE_FULL_NAME_KEY] === "string" &&
            (roleRecord[LEGACY_ROLE_FULL_NAME_KEY] as string)) ||
        "";

    const normalized = roleName.trim().toLowerCase();
    return normalized.length > 0 ? normalized : null;
}
