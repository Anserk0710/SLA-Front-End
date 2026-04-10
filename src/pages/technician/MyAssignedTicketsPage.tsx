import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAssignedTickets } from "../../api/technician.api";
import InternalStatusBadge from "../../components/status/InternalStatusBadge";
import { getApiErrorMessage } from "../../lib/api-error";
import { logError } from "../../lib/logger";
import type { TechnicianAssignedTicket } from "../../types/technician-ticket";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("id-ID");
}

export default function MyAssignedTicketsPage() {
  const [tickets, setTickets] = useState<TechnicianAssignedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getAssignedTickets();
        setTickets(data);
      } catch (err) {
        logError(err);
        setError(getApiErrorMessage(err, "Gagal memuat assigned tickets."));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Assigned Tickets</h2>
        <p className="text-sm text-slate-500">
          Ticket yang di-assign ke akun technician Anda.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
            Memuat data...
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
            Belum ada ticket yang di-assign.
          </div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold">{ticket.ticket_code}</h3>
                    <InternalStatusBadge status={ticket.internal_status} />
                  </div>

                  <p className="text-sm text-slate-500">
                    Dibuat: {formatDateTime(ticket.created_at)}
                  </p>

                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <p>
                      <span className="text-slate-500">Pelapor:</span>{" "}
                      <span className="font-medium">{ticket.full_name}</span>
                    </p>
                    <p>
                      <span className="text-slate-500">PIC:</span>{" "}
                      <span className="font-medium">{ticket.pic_name}</span>
                    </p>
                    <p>
                      <span className="text-slate-500">Kategori:</span>{" "}
                      <span className="font-medium">{ticket.category}</span>
                    </p>
                    <p>
                      <span className="text-slate-500">HP:</span>{" "}
                      <span className="font-medium">{ticket.phone_number}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 text-xs">
                    <span
                      className={`rounded-full px-3 py-1 ${
                        ticket.has_checkin
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {ticket.has_checkin ? "Check-in sudah ada" : "Belum check-in"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 ${
                        ticket.has_resolution
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {ticket.has_resolution ? "Bukti selesai sudah ada" : "Belum submit selesai"}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/technician/tickets/${ticket.id}`}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Buka Detail
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
