export type TechnicianAssignedTicket = {
    id: string;
    ticket_code: string;
    full_name: string;
    category: string;
    pic_name: string;
    phone_number: string;
    internal_status: string;
    public_status: string;
    created_at: string;
    has_checkin: boolean;
    has_resolution: boolean;
};

export type TechnicianCheckIn = {
    id: string;
    photo_secure_url: string;
    photo_format: string | null;
    photo_bytes: number;
    latitude: number;
    longitude: number;
    address: string;
    notes: string | null;
    server_timestamp: string;
};

export type TechnicianResolution = {
    id: string;
    video_secure_url: string;
    video_format: string | null;
    video_bytes: number;
    video_duration: number | null;
    latitude: number;
    longitude: number;
    address: string;
    resolution_note: string;
    server_timestamp: string;
};

export type TechnicianTicketDetail = {
    id: string;
    ticket_code: string;
    full_name: string;
    full_address: string;
    category: string;
    description: string;
    pic_name: string;
    phone_number: string;
    internal_status: string;
    public_status: string;
    created_at: string;
    checkin: TechnicianCheckIn | null;
    resolution: TechnicianResolution | null;
};

export type TechnicianActionResponse = {
    message: string;
    internal_status: string;
    public_status: string;
};