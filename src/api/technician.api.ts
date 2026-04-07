import { api } from "./axios";
import type {
    TechnicianActionResponse,
    TechnicianAssignedTicket,
    TechnicianTicketDetail,
} from "../types/technician-ticket";

export async function getAssignedTickets(): Promise<TechnicianAssignedTicket[]> {
    const { data } = await api.get<TechnicianAssignedTicket[]>("/technician/tickets/assigned");
    return data;
}

export async function getAssignedTicketDetail(ticketId: string): Promise<TechnicianTicketDetail> {
    const { data } = await api.get<TechnicianTicketDetail>(`/technician/tickets/${ticketId}`);
    return data;
}

export async function submitCheckIn(
    ticketId: string,
    formData: FormData,
    onProgress?: (percent: number) => void
): Promise<TechnicianActionResponse> {
    const { data } = await api.post<TechnicianActionResponse>(
        `/technician/tickets/${ticketId}/check-in`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (event) => {
                if (!event.total) return;
                const percent = Math.round((event.loaded * 100) / event.total);
                onProgress?.(percent);
            },
        }
    );

    return data;
}

export async function submitResolution(
    ticketId: string,
    formData: FormData,
    onProgress?: (percent: number) => void
): Promise<TechnicianActionResponse> {
    const { data } = await api.post<TechnicianActionResponse>(
        `/technician/tickets/${ticketId}/resolve`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (event) => {
                if (!event.total) return;
                const percent = Math.round((event.loaded * 100) / event.total);
                onProgress?.(percent);
            },
        }
    );

    return data;
}