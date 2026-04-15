import { api } from "./axios";
import { resolveOptionalFilterParam } from "./filter-params";
import type { TicketFilters } from "./ticket.api";

export async function downloadTicketReport(filters: TicketFilters = {}) {
    const response = await api.get("/reports/tickets/export", {
        params: {
            status: resolveOptionalFilterParam(filters.status),
            category: resolveOptionalFilterParam(filters.category),
            date_from: resolveOptionalFilterParam(filters.dateFrom, filters.date_from),
            date_to: resolveOptionalFilterParam(filters.dateTo, filters.date_to),
            technician_id: resolveOptionalFilterParam(filters.technicianId, filters.technician_id),
        },
        responseType: "blob",
    });

    const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `ticket-report-${Date.now()}.xlsx`;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
}
