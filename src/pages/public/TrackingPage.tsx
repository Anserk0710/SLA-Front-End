// TrackingPage.tsx
import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { trackPublicTicket } from "../../api/ticket.api";
import {
  DetailCard,
  EmptyState,
  FieldInput,
  InlineNotice,
  PublicShell,
  PublicTopBar,
  SectionHeader,
  SubmitButton,
  SurfaceCard,
} from "../../components/public/PublicUi";
import PublicStatusBadge from "../../components/status/PublicStatusBadge";
import type { TrackingTicketResponse } from "../../types/ticket";

type FormErrors = {
  ticketCode?: string;
  phoneNumber?: string;
};

const steps = [
  {
    title: "Masukkan kode tiket",
    detail: "Gunakan kode yang diterima setelah aduan berhasil dikirim melalui form publik.",
  },
  {
    title: "Verifikasi nomor terdaftar",
    detail: "Nomor HP membantu memastikan data tracking yang ditampilkan sesuai dengan pelapor.",
  },
  {
    title: "Lihat progres terbaru",
    detail: "Status tiket, waktu pembaruan, dan informasi inti tiket akan tampil setelah verifikasi berhasil.",
  },
];

const progressStages = [
  "Dalam Antrian",
  "Sudah Ditanggapi",
  "Sedang Dikerjakan",
  "Sudah Selesai",
];

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getProgressIndex(status: string) {
  const index = progressStages.indexOf(status);
  return index === -1 ? 0 : index;
}

function getTrackingErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "Permintaan ke server terlalu lama. Coba lagi, lalu pastikan backend berjalan normal.";
    }

    if (!error.response) {
      return "Backend tidak merespons. Pastikan server API aktif di http://localhost:8000.";
    }

    if (error.response.status === 404) {
      return "Tiket tidak ditemukan. Periksa kembali kode tiket dan nomor HP.";
    }
  }

  return "Terjadi kendala saat mengecek status tiket. Silakan coba lagi.";
}

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const [ticketCode, setTicketCode] = useState(searchParams.get("ticketCode") ?? "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<TrackingTicketResponse | null>(null);

  useEffect(() => {
    const queryTicketCode = searchParams.get("ticketCode");

    if (queryTicketCode) {
      setTicketCode(queryTicketCode);
    }
  }, [searchParams]);

  function validate() {
    const nextErrors: FormErrors = {};

    if (ticketCode.trim().length < 5) {
      nextErrors.ticketCode = "Kode tiket wajib diisi.";
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, "");
    if (normalizedPhone.length < 8 || normalizedPhone.length > 20) {
      nextErrors.phoneNumber = "Nomor HP tidak valid.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleTicketCodeChange(value: string) {
    setTicketCode(value.toUpperCase());
    setErrors((prev) => ({ ...prev, ticketCode: "" }));
    setSubmitError("");
    setResult(null);
  }

  function handlePhoneNumberChange(value: string) {
    setPhoneNumber(value);
    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    setSubmitError("");
    setResult(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setSubmitError("");
    setResult(null);

    try {
      const data = await trackPublicTicket(ticketCode.trim(), phoneNumber.trim());
      setResult(data);
    } catch (error: unknown) {
      console.error(error);
      setSubmitError(getTrackingErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  const progressIndex = result ? getProgressIndex(result.public_status) : -1;

  return (
    <PublicShell>
      <PublicTopBar />

      <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start xl:grid-cols-[minmax(0,1fr)_480px]">
        <section className="order-2 space-y-6 lg:order-1 lg:pr-2">
          <SectionHeader
            badge="Tracking Ticket"
            title="Pantau status tiket Anda secara real-time dengan tampilan yang lebih rapi dan nyaman di desktop."
            description="Halaman tracking membantu pelapor mengecek status penanganan, waktu pembaruan terakhir, serta informasi dasar tiket tanpa perlu menghubungi admin secara manual."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {steps.map((step, index) => (
              <SurfaceCard
                key={step.title}
                className="border-slate-200/80 bg-white/72 p-4 sm:p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="text-base font-semibold leading-6 text-slate-950">
                      {step.title}
                    </p>
                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </section>

        <SurfaceCard className="order-1 h-fit p-5 sm:p-6 lg:order-2 lg:sticky lg:top-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-950">Lacak Tiket</h2>
            <p className="text-sm leading-6 text-slate-600">
              Masukkan kode tiket dan nomor HP terdaftar untuk melihat status terbaru.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <FieldInput
              id="ticket-code"
              label="Kode Tiket"
              placeholder="Contoh: SLA-2026-00124"
              value={ticketCode}
              onChange={(event) => handleTicketCodeChange(event.target.value)}
              error={errors.ticketCode}
              hint="Kode tiket otomatis dibuat setelah submit aduan berhasil."
              disabled={loading}
            />

            <FieldInput
              id="tracking-phone"
              label="Nomor HP Terdaftar"
              placeholder="08xxxxxxxxxx"
              value={phoneNumber}
              onChange={(event) => handlePhoneNumberChange(event.target.value)}
              error={errors.phoneNumber}
              hint="Gunakan nomor yang sama seperti saat membuat aduan."
              disabled={loading}
            />

            {submitError ? <InlineNotice variant="error">{submitError}</InlineNotice> : null}

            <SubmitButton
              loading={loading}
              loadingText="Mengecek status..."
              idleText="Cek Status"
            />
          </form>

          <div className="mt-6 space-y-4">
            {result ? (
              <>
                <div className="rounded-3xl border border-slate-200 bg-slate-50/95 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Hasil Tracking
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">
                        {result.ticket_code}
                      </p>
                    </div>
                    <PublicStatusBadge status={result.public_status} />
                  </div>
                </div>

                {result.public_status !== "Ditolak" ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Progress Penanganan
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {progressStages.map((stage, index) => {
                        const isDone = progressIndex >= index;
                        const isCurrent = result.public_status === stage;

                        return (
                          <div
                            key={stage}
                            className={`rounded-2xl border px-3 py-3 text-center text-xs font-semibold ${
                              isCurrent
                                ? "border-slate-950 bg-slate-950 text-white"
                                : isDone
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-slate-50 text-slate-500"
                            }`}
                          >
                            {stage}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <InlineNotice variant="error">
                    Tiket berada pada status ditolak. Silakan hubungi admin bila memerlukan
                    klarifikasi lebih lanjut.
                  </InlineNotice>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailCard label="Nama Pelapor" value={result.full_name} />
                  <DetailCard label="Kategori" value={result.category} />
                  <DetailCard label="Dibuat" value={formatDateTime(result.created_at)} />
                  <DetailCard
                    label="Terakhir Diupdate"
                    value={formatDateTime(result.updated_at)}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                title="Status tiket akan tampil di sini"
                description="Setelah pencarian berhasil, halaman ini akan menampilkan status, waktu update terakhir, dan detail penting tiket Anda."
              />
            )}
          </div>
        </SurfaceCard>
      </main>
    </PublicShell>
  );
}
