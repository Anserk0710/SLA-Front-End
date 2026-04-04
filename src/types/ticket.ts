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
    created_at: string;
    updated_at: string;
};