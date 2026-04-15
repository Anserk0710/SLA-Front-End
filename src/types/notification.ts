export interface NotificationItem {
    id: string;
    user_id: string;
    ticket_id?: string | null;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

export interface UnreadNotificationResponse {
    unread_count: number;
    items: NotificationItem[];
}
