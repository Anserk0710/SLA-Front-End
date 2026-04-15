import { api } from "./axios";
import type { UnreadNotificationResponse } from "../types/notification";

export async function getUnreadNotifications(
    limit = 10
): Promise<UnreadNotificationResponse> {
    const { data } = await api.get<UnreadNotificationResponse>("/notifications/unread", {
        params: { limit },
    });

    return data;
}

export async function markNotificationAsRead(notificationId: string | number) {
    const { data } = await api.post<{ message: string }>(`/notifications/${notificationId}/read`);
    return data;
}
