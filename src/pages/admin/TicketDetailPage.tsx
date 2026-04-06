import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { assignTicket, getInternalTicketDetail, respondTicket } from "../../api/internal-ticket.api";
import { getTechnicians } from "../../api/user.api";
import { LoadingInline, LoadingState } from "../../components/feedback/LoadingIndicator";
import InternalStatusBadge from "../../components/status/InternalStatusBadge";
import { formatInternalStatus } from "../../components/status/internalStatus";
import type { TechnicianOption, TicketDetail } from "../../types/admin-ticket";

function formatDateTime(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.ticketId ?? "";

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [technicians, setTechnicians] = useState<TechnicianOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [responseNote, setResponseNote] = useState("");
  const [selectedTechnicianIds, setSelectedTechnicianIds] = useState<string[]>([]);

  const [respondLoading, setRespondLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const validTicketId = useMemo(() => ticketId.trim().length > 0, [ticketId]);

  const loadDetail = useCallback(async () => {
    if (!validTicketId) return;

    try {
      setLoading(true);
      setError("");

      const [ticketData, technicianData] = await Promise.all([
        getInternalTicketDetail(ticketId),
        getTechnicians(),
      ]);

      setTicket(ticketData);
      setTechnicians(technicianData);
      setResponseNote(ticketData.inital_respons ?? "");
      setSelectedTechnicianIds(ticketData.assigned_technicians.map((item) => item.id));
    } catch (err) {
      console.error(err);
      setError("Gagal memuat detail ticket. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [ticketId, validTicketId]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  function toggleTechnician(id: string) {
    setSelectedTechnicianIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function handleRespondSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validTicketId) return;
    if (responseNote.trim().length < 10) {
      setActionError("Respon minimal 10 karakter.");
      setActionMessage("");
      return;
    }

    try {
      setRespondLoading(true);
      setActionMessage("");
      setActionError("");

      await respondTicket(ticketId, responseNote);
      await loadDetail();
      setActionMessage("Respon ticket berhasil disimpan.");
    } catch (err) {
      console.error(err);
      setActionError("Gagal menyimpan respon. Silakan coba lagi.");
    } finally {
      setRespondLoading(false);
    }
  }

  async function handleAssignSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validTicketId) return;
    if (selectedTechnicianIds.length === 0) {
      setActionError("Pilih minimal satu teknisi.");
      setActionMessage("");
      return;
    }

    try {
      setAssignLoading(true);
      setActionError("");
      setActionMessage("");

      await assignTicket(ticketId, selectedTechnicianIds);
      await loadDetail();
      setActionMessage("Assign teknisi berhasil disimpan.");
    } catch (err) {
      console.error(err);
      setActionError("Gagal menyimpan assign teknisi. Silakan coba lagi.");
    } finally {
      setAssignLoading(false);
    }
  }

  if (!validTicketId) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        Ticket ID tidak valid.
      </div>
    );
  }

  if (loading) {
    return <LoadingState label="Memuat detail ticket..." />;
  }

  if (error || !ticket) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error || "Gagal memuat detail ticket. Silakan coba lagi."}
        </div>
        <Link
          to="/admin/tickets"
          className="inline-block rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Kembali ke Ticket List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">Ticket Detail</p>
          <h2 className="text-2xl font-bold text-slate-950">{ticket.ticket_code}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <InternalStatusBadge status={ticket.internal_status} />
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            Public: {ticket.public_status}
          </span>
          <Link
            to="/admin/tickets"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Kembali
          </Link>
        </div>
      </div>

      {actionMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {actionMessage}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-slate-950">Informasi Ticket</h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Nama Pelapor</p>
                <p className="font-semibold text-slate-900">{ticket.full_name}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">PIC</p>
                <p className="font-semibold text-slate-900">{ticket.pic_name}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Kategori</p>
                <p className="font-semibold text-slate-900">{ticket.category}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Nomor HP</p>
                <p className="font-semibold text-slate-900">{ticket.phone_number}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-slate-500">Alamat Lengkap</p>
                <p className="font-semibold text-slate-900">{ticket.full_address}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-slate-500">Deskripsi Kendala</p>
                <p className="font-semibold text-slate-900">{ticket.description}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Dibuat</p>
                <p className="font-semibold text-slate-900">{formatDateTime(ticket.created_at)}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Status Internal</p>
                <div className="mt-1">
                  <InternalStatusBadge status={ticket.internal_status} />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-slate-950">Respon Awal</h3>

            <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm">
              <p className="text-slate-500">Respon Tersimpan</p>
              <p className="mt-1 font-medium text-slate-900">{ticket.inital_respons || "-"}</p>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-slate-500">Direspon Oleh</p>
                  <p className="font-medium text-slate-900">{ticket.responded_by_name || "-"}</p>
                </div>

                <div>
                  <p className="text-slate-500">Waktu Respon</p>
                  <p className="font-medium text-slate-900">
                    {formatDateTime(ticket.responded_at)}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleRespondSubmit} className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-slate-700">Isi Respon Awal</label>
              <textarea
                className="min-h-32 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                value={responseNote}
                onChange={(event) => setResponseNote(event.target.value)}
                placeholder="Tulis respon awal untuk ticket ini"
              />

              <button
                type="submit"
                disabled={respondLoading}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {respondLoading ? (
                  <LoadingInline label="Menyimpan respon..." spinnerClassName="text-white" />
                ) : (
                  "Simpan Respon"
                )}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-slate-200 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-slate-950">Status Log</h3>

            <div className="mt-4 space-y-4">
              {ticket.status_logs.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada status log.</p>
              ) : (
                ticket.status_logs.map((log) => (
                  <article key={log.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-col justify-between gap-2 md:flex-row">
                      <div className="flex flex-wrap items-center gap-2">
                        <InternalStatusBadge status={log.new_status} />
                        <p className="text-sm text-slate-500">
                          dari {log.old_status ? formatInternalStatus(log.old_status) : "-"}
                        </p>
                      </div>

                      <p className="text-sm text-slate-500">{formatDateTime(log.created_at)}</p>
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-900">
                      {log.notes || "Tidak ada catatan."}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Oleh: {log.changed_by_name || "System / Public"}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-slate-950">Assigned Technician</h3>

            <div className="mt-4 space-y-2">
              {ticket.assigned_technicians.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada technician yang di-assign.</p>
              ) : (
                ticket.assigned_technicians.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-slate-900">{item.full_name}</p>
                    <p className="text-slate-500">{item.email}</p>
                  </article>
                ))
              )}
            </div>

            <form onSubmit={handleAssignSubmit} className="mt-5 space-y-3">
              <p className="text-sm font-medium text-slate-700">Pilih Technician</p>

              <div className="max-h-80 space-y-2 overflow-auto rounded-lg border border-slate-200 p-3">
                {technicians.length === 0 ? (
                  <p className="text-sm text-slate-500">Belum ada data technician.</p>
                ) : (
                  technicians.map((technician) => (
                    <label
                      key={technician.id}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTechnicianIds.includes(technician.id)}
                        onChange={() => toggleTechnician(technician.id)}
                        className="mt-1"
                      />

                      <div>
                        <p className="font-medium text-slate-900">{technician.full_name}</p>
                        <p className="text-sm text-slate-500">{technician.email}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>

              <button
                type="submit"
                disabled={assignLoading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {assignLoading ? (
                  <LoadingInline label="Menyimpan assignment..." spinnerClassName="text-white" />
                ) : (
                  "Simpan Assignment"
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
