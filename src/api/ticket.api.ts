import { api } from "./axios";
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