export type AssignedTechnician = {
    id: string;
    full_name: string;
    email: string;
};

export type TicketStatusLog = {
    id: string;
    old_status: string | null;
    new_status: string;
    notes: string | null;
    changed_by_name: string | null;
    created_at: string;
}

export type DashboardSummary = {
    total_tickets: number;
    belum_direspon: number;
    sudah_direspon: number;
    on_progress: number;
    selesai: number;
    sla_breached: number;
};

export type TicketListItem = {
    id: string;
    ticket_code: string;
    full_name: string;
    category: string;
    pic_name: string;
    phone_number: string;
    public_status: string;
    internal_status: string;
    sla_deadline: string | null;
    is_sla_breached: boolean;
    created_at: string;
    assigned_technicians: AssignedTechnician[];
};

export type TicketDetail = TicketListItem & {
    full_address: string;
    description: string;
    inital_respons: string | null;
    responded_at: string | null;
    responded_by_name: string | null;
    status_logs: TicketStatusLog[];
};

export type TechnicianOption = {
    id: string;
    full_name: string;
    email: string;
};
