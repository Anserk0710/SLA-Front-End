import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { getInternalTickets } from "../../api/internal-ticket.api";
import { LoadingState } from "../../components/feedback/LoadingIndicator";
import InternalStatusBadge from "../../components/status/InternalStatusBadge";
import { internalStatusFilterOptions } from "../../components/status/internalStatus";
import { getApiErrorMessage } from "../../lib/api-error";
import { logError } from "../../lib/logger";
import type { TicketListItem } from "../../types/admin-ticket";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TicketListPage() {
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  async function loadTickets(params?: { q?: string; status?: string }) {
    try {
      setLoading(true);
      setError("");
      const data = await getInternalTickets(params);
      setTickets(data);
    } catch (err) {
      logError(err);
      setError(getApiErrorMessage(err, "Gagal memuat daftar ticket. Silakan coba lagi."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTickets();
  }, []);

  async function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadTickets({
      q: search || undefined,
      status: status || undefined,
    });
  }

  async function handleReset() {
    setSearch("");
    setStatus("");
    await loadTickets();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Ticket List</h2>
        <p className="text-sm text-slate-500">
          Daftar ticket masuk untuk dikelola oleh admin dan head.
        </p>
      </div>

      <form
        onSubmit={handleFilterSubmit}
        className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_220px_auto_auto]"
      >
        <input
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari kode ticket, pelapor, kategori, atau PIC"
        />

        <select
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">Semua Status</option>
          {internalStatusFilterOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed ${
            loading ? "blur-[0.6px] opacity-70" : ""
          }`}
        >
          Filter
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Reset
        </button>
      </form>

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
                <InternalStatusBadge status={ticket.internal_status} />
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
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">Dibuat</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-5">
                  <LoadingState
                    label="Memuat daftar ticket..."
                    className="border-dashed bg-transparent py-4"
                  />
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
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

