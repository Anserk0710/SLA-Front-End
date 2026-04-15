import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { getTickets } from "../../api/ticket.api";
import { getTechnicians } from "../../api/user.api";
import { LoadingState } from "../../components/feedback/LoadingIndicator";
import InternalStatusBadge from "../../components/status/InternalStatusBadge";
import SlaBadge from "../../components/status/SlaBadge";
import { addAdminTicketNotificationsListener } from "../../features/notifications/notification-events";
import TicketFilterBar from "../../features/tickets/components/TicketFilterBar";
import {
  emptyTicketFilterBarValue,
  type TicketFilterBarValue,
} from "../../features/tickets/components/ticketFilterBar.shared";
import { getApiErrorMessage } from "../../lib/api-error";
import { logError } from "../../lib/logger";
import type { TechnicianOption, TicketListItem } from "../../types/admin-ticket";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TicketListPage() {
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TicketFilterBarValue>(emptyTicketFilterBarValue);

  const loadTickets = useCallback(async (
    nextFilters: TicketFilterBarValue,
    nextSearch: string,
    options?: { background?: boolean }
  ) => {
    try {
      if (options?.background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");
      const data = await getTickets({
        ...nextFilters,
        q: nextSearch,
      });
      setTickets(data);
    } catch (err) {
      logError(err);
      setError(getApiErrorMessage(err, "Gagal memuat daftar ticket. Silakan coba lagi."));
    } finally {
      if (options?.background) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    async function initializePage() {
      try {
        setLoading(true);
        setError("");

        const [ticketData, technicianData] = await Promise.all([
          getTickets(emptyTicketFilterBarValue),
          getTechnicians(),
        ]);

        setTickets(ticketData);
        setTechnicians(technicianData);
      } catch (err) {
        logError(err);
        setError(getApiErrorMessage(err, "Gagal memuat daftar ticket. Silakan coba lagi."));
      } finally {
        setLoading(false);
      }
    }

    void initializePage();
  }, []);

  useEffect(() => {
    return addAdminTicketNotificationsListener(() => {
      void loadTickets(filters, search, { background: true });
    });
  }, [filters, search, loadTickets]);

  async function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadTickets(filters, search);
  }

  async function handleReset() {
    setSearch("");
    setFilters(emptyTicketFilterBarValue);
    await loadTickets(emptyTicketFilterBarValue, "");
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Ticket List</h2>
        <p className="text-sm text-slate-500">
          Daftar ticket masuk untuk dikelola oleh admin dan head.
        </p>
        {refreshing ? <p className="mt-1 text-xs text-sky-700">Memperbarui ticket terbaru...</p> : null}
      </div>

      <form
        onSubmit={handleFilterSubmit}
        className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_auto]"
      >
        <input
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari kode ticket, pelapor, kategori, atau PIC"
        />

        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed ${
            loading ? "blur-[0.6px] opacity-70" : ""
          }`}
        >
          Cari Ticket
        </button>
      </form>

      <TicketFilterBar
        key={`${filters.status}|${filters.category}|${filters.dateFrom}|${filters.dateTo}|${filters.technicianId}`}
        initialValue={filters}
        technicians={technicians}
        disabled={loading}
        onApply={async (nextFilters) => {
          setFilters(nextFilters);
          await loadTickets(nextFilters, search);
        }}
        onReset={() => void handleReset()}
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-3 lg:hidden">
        {loading ? (
          <LoadingState label="Memuat daftar ticket..." />
        ) : tickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Belum ada data ticket.
          </div>
        ) : (
          tickets.map((ticket) => (
            <article key={ticket.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-900">
                    {ticket.ticket_code}
                  </p>
                  <p className="text-sm text-slate-500">{ticket.full_name}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <InternalStatusBadge status={ticket.internal_status} />
                  <SlaBadge
                    slaDeadline={ticket.sla_deadline}
                    isSlaBreached={ticket.is_sla_breached}
                  />
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-500">Kategori</dt>
                  <dd className="font-medium text-slate-800">{ticket.category}</dd>
                </div>

                <div>
                  <dt className="text-slate-500">PIC</dt>
                  <dd className="font-medium text-slate-800">{ticket.pic_name}</dd>
                </div>

                <div className="col-span-2">
                  <dt className="text-slate-500">Dibuat</dt>
                  <dd className="font-medium text-slate-800">
                    {formatDateTime(ticket.created_at)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {ticket.assigned_technicians.length > 0 ? (
                  ticket.assigned_technicians.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600"
                    >
                      {item.full_name}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                    Belum di-assign
                  </span>
                )}
              </div>

              <Link
                to={`/admin/tickets/${ticket.id}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Lihat Detail
              </Link>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 lg:block">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50 text-left text-sm text-slate-600">
            <tr>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Pelapor</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">SLA</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">Dibuat</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-5">
                  <LoadingState
                    label="Memuat daftar ticket..."
                    className="border-dashed bg-transparent py-4"
                  />
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500">
                  Belum ada data ticket.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t border-slate-200 text-sm">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{ticket.ticket_code}</p>
                    <p className="text-slate-500">{ticket.phone_number}</p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium">{ticket.full_name}</p>
                    <p className="text-slate-500">PIC: {ticket.pic_name}</p>
                  </td>

                  <td className="px-4 py-3">{ticket.category}</td>

                  <td className="px-4 py-3">
                    <InternalStatusBadge status={ticket.internal_status} />
                  </td>

                  <td className="px-4 py-3">
                    <SlaBadge
                      slaDeadline={ticket.sla_deadline}
                      isSlaBreached={ticket.is_sla_breached}
                    />
                  </td>

                  <td className="px-4 py-3">
                    {ticket.assigned_technicians.length > 0 ? (
                      <div className="space-y-1">
                        {ticket.assigned_technicians.map((item) => (
                          <p key={item.id}>{item.full_name}</p>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>

                  <td className="px-4 py-3">{formatDateTime(ticket.created_at)}</td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/tickets/${ticket.id}`}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

