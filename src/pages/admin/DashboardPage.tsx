import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { getDashboardSummary } from "../../api/dashboard.api";
import type { DashboardSummary } from "../../types/admin-ticket";

const emptySummary: DashboardSummary = {
  total_tickets: 0,
  belum_direspon: 0,
  sudah_direspon: 0,
  on_progress: 0,
  selesai: 0,
};

function formatPercentage(value: number, total: number) {
  if (total <= 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat dashboard. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const total = summary.total_tickets;
  const activeTickets = Math.max(total - summary.selesai, 0);

  const stats = [
    {
      label: "Total Ticket",
      value: summary.total_tickets,
      helper: "Keseluruhan ticket",
    },
    {
      label: "Belum Direspon",
      value: summary.belum_direspon,
      helper: "Menunggu respon awal",
    },
    {
      label: "Sudah Direspon",
      value: summary.sudah_direspon,
      helper: "Sudah diberi respon",
    },
    {
      label: "On Progress",
      value: summary.on_progress,
      helper: "Dalam penanganan teknisi",
    },
    {
      label: "Selesai",
      value: summary.selesai,
      helper: "Sudah ditutup",
    },
  ];

  const workflow = useMemo(
    () => [
      { label: "Belum Direspon", value: summary.belum_direspon, color: "bg-amber-500" },
      { label: "Sudah Direspon", value: summary.sudah_direspon, color: "bg-blue-500" },
      { label: "On Progress", value: summary.on_progress, color: "bg-cyan-500" },
      { label: "Selesai", value: summary.selesai, color: "bg-emerald-500" },
    ],
    [summary]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Dashboard</h2>
          <p className="text-sm text-slate-500">
            Ringkasan ticket operasional untuk admin dan head.
          </p>
        </div>

        <Link
          to="/admin/tickets"
          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
        >
          Buka Ticket List
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => (
          <section
            key={item.label}
            className="rounded-xl border border-sky-200/80 bg-gradient-to-br from-sky-50 to-sky-100 px-4 py-4 text-sky-950 shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">
              {item.label}
            </p>

            <div className="mt-2">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded-md bg-white/45" />
              ) : (
                <p className="text-3xl font-bold">{item.value}</p>
              )}
            </div>

            <p className="mt-1 text-xs opacity-80">{item.helper}</p>
          </section>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            Distribusi Status
          </h3>

          <div className="mt-3 space-y-3">
            {workflow.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <p className="font-medium text-slate-700">{item.label}</p>
                  {loading ? (
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                  ) : (
                    <p className="font-semibold text-slate-900">
                      {item.value} ({formatPercentage(item.value, total)})
                    </p>
                  )}
                </div>

                {loading ? (
                  <div className="h-2.5 w-full animate-pulse rounded-full bg-slate-200" />
                ) : (
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: total > 0 ? `${Math.max((item.value / total) * 100, 4)}%` : "0%",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            Snapshot Operasional
          </h3>

          <div className="mt-3 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <article className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-xs text-slate-500">Ticket Aktif</p>
              {loading ? (
                <div className="mt-2 h-7 w-12 animate-pulse rounded bg-slate-200" />
              ) : (
                <p className="mt-1 text-2xl font-bold text-slate-900">{activeTickets}</p>
              )}
            </article>

            <article className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-xs text-slate-500">Progress Tuntas</p>
              {loading ? (
                <div className="mt-2 h-7 w-20 animate-pulse rounded bg-slate-200" />
              ) : (
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {formatPercentage(summary.selesai, total)}
                </p>
              )}
            </article>

            <article className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-xs text-slate-500">Perlu Follow Up</p>
              {loading ? (
                <div className="mt-2 h-7 w-12 animate-pulse rounded bg-slate-200" />
              ) : (
                <p className="mt-1 text-2xl font-bold text-slate-900">{summary.belum_direspon}</p>
              )}
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
