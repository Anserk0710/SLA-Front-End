import { api } from "./axios";
import type { DashboardSummary } from "../types/admin-ticket";

export async function getDashboardSummary(): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>("/dashboard/summary");
    return data;
}