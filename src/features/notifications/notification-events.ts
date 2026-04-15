import type { NotificationItem } from "../../types/notification";

export const adminTicketNotificationsEventName = "admin-ticket-notifications";

export type AdminTicketNotificationsDetail = {
  items: NotificationItem[];
};

export function dispatchAdminTicketNotifications(detail: AdminTicketNotificationsDetail) {
  window.dispatchEvent(
    new CustomEvent<AdminTicketNotificationsDetail>(adminTicketNotificationsEventName, {
      detail,
    })
  );
}

export function addAdminTicketNotificationsListener(
  listener: (detail: AdminTicketNotificationsDetail) => void
) {
  function handleEvent(event: Event) {
    listener((event as CustomEvent<AdminTicketNotificationsDetail>).detail);
  }

  window.addEventListener(adminTicketNotificationsEventName, handleEvent);

  return () => {
    window.removeEventListener(adminTicketNotificationsEventName, handleEvent);
  };
}
