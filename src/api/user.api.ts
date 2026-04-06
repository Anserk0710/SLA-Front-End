import { api } from "./axios";
import type { TechnicianOption } from "../types/admin-ticket";

export async function getTechnicians(): Promise<TechnicianOption[]> {
    const { data } = await api.get<TechnicianOption[]>("/users/technicians");
    return data;
}