export interface Ticket {
    id: string;
    ticket_code: string;
    category: string;
    status: string;
    created_at?: string;
    sla_deadline?: string | null;
    is_sla_breached: boolean;
}

export type CreatePublicTicketPayload = {
    full_name: string;
    full_address: string;
    category: string;
    description: string;
    pic_name: string;
    phone_number: string;
};

export type CreatePublicTicketResponse = {
    ticket_code: string;
    public_status: string;
    message: string;
};

export type TrackingTicketResponse = {
    ticket_code: string;
    full_name: string;
    category: string;
    public_status: string;
    internal_status: string;
    sla_deadline: string | null;
    is_sla_breached: boolean;
    created_at: string;
    updated_at: string;
};
