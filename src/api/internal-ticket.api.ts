import { api } from "./axios";
import type { TicketDetail, TicketListItem } from "../types/admin-ticket";

type ActionMessageResponse = {
    message: string;
};

export async function getInternalTickets(params?: {
    status?: string;
    q?: string;
}): Promise<TicketListItem[]> {
    const { data } = await api.get<TicketListItem[]>("/tickets", {
        params,
    });
    return data;
}

export async function getInternalTicketDetail(ticketId: string): Promise<TicketDetail> {
    const { data } = await api.get<TicketDetail>(`/tickets/${ticketId}`);
    return data;
}

export async function respondTicket(ticketId: string, responseNote: string): Promise<ActionMessageResponse> {
    const { data } = await api.post<ActionMessageResponse>(`/tickets/${ticketId}/respond`, {
        response_note: responseNote,
    });
    return data;
}

export async function assignTicket(ticketId: string, technicianUserIds: string[]): Promise<ActionMessageResponse> {
    const { data } = await api.post<ActionMessageResponse>(`/tickets/${ticketId}/assign`, {
        technician_user_ids: technicianUserIds,
    });
    return data;
}
