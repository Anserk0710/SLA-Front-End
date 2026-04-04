import { api } from "./axios";
import type { LoginResponse, User } from "../types/auth";

export async function login(email: string, password: string): Promise<LoginResponse> {
    const body = new URLSearchParams();
    body.set("username", email);
    body.set("password", password);

    const { data } = await api.post<LoginResponse>("/auth/login", body, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    return data;
}

export async function getMe(): Promise<User> {
    const { data } = await api.get<User>("/auth/me");
    return data;
}