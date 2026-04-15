import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { markNotificationAsRead } from "../../api/notification.api";
import {
  dispatchAdminTicketNotifications,
} from "../../features/notifications/notification-events";
import { useUnreadNotifications } from "../../features/notifications/hooks/useUnreadNotifications";
import type { NotificationItem } from "../../types/notification";

type ToastItem = NotificationItem;

function formatNotificationTime(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function playNotificationSound() {
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();

  try {
    await audioContext.resume();

    const firstOscillator = audioContext.createOscillator();
    const secondOscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    firstOscillator.type = "sine";
    secondOscillator.type = "sine";
    firstOscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    secondOscillator.frequency.setValueAtTime(1174, audioContext.currentTime + 0.09);

    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.28);

    firstOscillator.connect(gainNode);
    secondOscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    firstOscillator.start(audioContext.currentTime);
    firstOscillator.stop(audioContext.currentTime + 0.12);
    secondOscillator.start(audioContext.currentTime + 0.09);
    secondOscillator.stop(audioContext.currentTime + 0.28);

    window.setTimeout(() => {
      void audioContext.close();
    }, 350);
  } catch {
    void audioContext.close();
  }
}

export default function AdminNotificationToasts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useUnreadNotifications();

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const hasHydratedRef = useRef(false);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const timeoutMapRef = useRef<Map<string, number>>(new Map());

  const mutation = useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });

  const removeToast = useCallback((notificationId: string) => {
    setToasts((current) => current.filter((item) => item.id !== notificationId));

    const timeoutId = timeoutMapRef.current.get(notificationId);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutMapRef.current.delete(notificationId);
    }
  }, []);

  const pushToasts = useCallback((items: NotificationItem[]) => {
    setToasts((current) => {
      const nextMap = new Map(current.map((item) => [item.id, item]));
      items.forEach((item) => nextMap.set(item.id, item));
      return Array.from(nextMap.values())
        .sort((left, right) => {
          return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
        })
        .slice(0, 4);
    });

    items.forEach((item) => {
      const existingTimer = timeoutMapRef.current.get(item.id);
      if (existingTimer) {
        window.clearTimeout(existingTimer);
      }

      const timeoutId = window.setTimeout(() => {
        removeToast(item.id);
      }, 7000);

      timeoutMapRef.current.set(item.id, timeoutId);
    });
  }, [removeToast]);

  function handleToastClick(item: NotificationItem) {
    removeToast(item.id);
    mutation.mutate(item.id);
    navigate(item.ticket_id ? `/admin/tickets/${item.ticket_id}` : "/admin/tickets");
  }

  useEffect(() => {
    const timeoutMap = timeoutMapRef.current;

    return () => {
      timeoutMap.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutMap.clear();
    };
  }, []);

  useEffect(() => {
    const items = data?.items ?? [];

    if (!hasHydratedRef.current) {
      seenIdsRef.current = new Set(items.map((item) => item.id));
      hasHydratedRef.current = true;
      return;
    }

    const newItems = items.filter((item) => !seenIdsRef.current.has(item.id));
    if (newItems.length === 0) {
      return;
    }

    newItems.forEach((item) => seenIdsRef.current.add(item.id));

    const ticketItems = newItems.filter((item) => item.type === "TICKET");
    if (ticketItems.length > 0) {
      dispatchAdminTicketNotifications({ items: ticketItems });
    }

    pushToasts(newItems);
    void playNotificationSound();
  }, [data?.items, pushToasts]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[130] flex w-[min(26rem,calc(100vw-2rem))] flex-col gap-3 sm:right-6">
      {toasts.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-950/5"
        >
          <button
            type="button"
            onClick={() => handleToastClick(item)}
            className="block w-full bg-gradient-to-r from-sky-50 via-white to-emerald-50 px-4 py-4 text-left transition hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                  Notifikasi Baru
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{item.message}</p>
                <p className="mt-2 text-[11px] text-slate-400">
                  {formatNotificationTime(item.created_at)}
                </p>
              </div>

              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
            </div>
          </button>

          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
            <p className="text-[11px] text-slate-500">
              Klik notifikasi untuk membuka ticket terkait.
            </p>
            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Tutup
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
