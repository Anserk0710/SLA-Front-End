import { api } from "./axios";
import { resolveOptionalFilterParam } from "./filter-params";
import type { TicketListItem } from "../types/admin-ticket";
import type {
    CreatePublicTicketPayload,
    CreatePublicTicketResponse,
    TrackingTicketResponse,
} from "../types/ticket";

export async function createPublicTicket(payload: CreatePublicTicketPayload): Promise<CreatePublicTicketResponse> {
    const { data } = await api.post<CreatePublicTicketResponse>('/public/tickets', payload);
    return data;
}

export async function trackPublicTicket(
    ticketCode: string,
    phoneNumber: string
): Promise<TrackingTicketResponse> {
    const { data } = await api.get<TrackingTicketResponse>("/public/tracking", {
        params: {
            ticket_code: ticketCode,
            phone_number: phoneNumber,
        },
    });

    return data;
}

export type TicketFilters = {
    status?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    technicianId?: string | number;
    q?: string;
    date_from?: string;
    date_to?: string;
    technician_id?: string | number;
    skip?: number;
    limit?: number;
};

export const getTickets = async (filters: TicketFilters = {}) => {
    const { data } = await api.get<TicketListItem[]>("/tickets", {
        params: {
            status: resolveOptionalFilterParam(filters.status),
            category: resolveOptionalFilterParam(filters.category),
            q: resolveOptionalFilterParam(filters.q),
            date_from: resolveOptionalFilterParam(filters.dateFrom, filters.date_from),
            date_to: resolveOptionalFilterParam(filters.dateTo, filters.date_to),
            technician_id: resolveOptionalFilterParam(filters.technicianId, filters.technician_id),
            skip: filters.skip ?? 0,
            limit: filters.limit ?? 20,
        },
    });

    return data;
};
