import { api } from "./axios";
import { resolveOptionalFilterParam } from "./filter-params";
import type { DashboardSummary } from "../types/admin-ticket";
import type { TicketFilters } from "./ticket.api";

export async function getDashboardSummary(filters: TicketFilters = {}): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>("/dashboard/summary", {
        params: {
            status: resolveOptionalFilterParam(filters.status),
            category: resolveOptionalFilterParam(filters.category),
            date_from: resolveOptionalFilterParam(filters.dateFrom, filters.date_from),
            date_to: resolveOptionalFilterParam(filters.dateTo, filters.date_to),
            technician_id: resolveOptionalFilterParam(filters.technicianId, filters.technician_id),
        },
    });

    return data;
}
