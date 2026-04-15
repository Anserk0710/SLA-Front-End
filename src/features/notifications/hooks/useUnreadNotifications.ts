import { useQuery } from "@tanstack/react-query";
import { getUnreadNotifications } from "../../../api/notification.api";

export function useUnreadNotifications() {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => getUnreadNotifications(10),
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });
}
