// PublicSuccessPage.tsx
import { useState } from "react";
import { useSearchParams } from "react-router";
import {
  ButtonLink,
  DetailCard,
  FeatureCard,
  InlineNotice,
  PublicShell,
  PublicTopBar,
  SectionHeader,
  SurfaceCard,
} from "../../components/public/PublicUi";
import { logError } from "../../lib/logger";

const nextSteps = [
  {
    title: "Simpan kode tiket",
    description:
      "Kode tiket akan digunakan saat Anda ingin mengecek status atau melakukan verifikasi tambahan.",
  },
  {
    title: "Pantau proses penanganan",
    description:
      "Gunakan halaman tracking untuk melihat perkembangan tiket secara mandiri dan real-time.",
  },
  {
    title: "Siapkan nomor terdaftar",
    description:
      "Nomor HP yang Anda masukkan saat submit dibutuhkan untuk proses tracking dan validasi data.",
  },
];

export default function PublicSuccessPage() {
  const [searchParams] = useSearchParams();
  const ticketCode = searchParams.get("ticketCode") ?? "-";
  const status = searchParams.get("status") ?? "Submitted";
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "success" | "error">("idle");

  const hasTicketCode = ticketCode.trim() !== "-";

  async function handleCopyTicketCode() {
    if (!hasTicketCode) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(ticketCode);
      } else {
        const temporaryInput = document.createElement("input");
        temporaryInput.value = ticketCode;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "absolute";
        temporaryInput.style.left = "-9999px";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        document.execCommand("copy");
        document.body.removeChild(temporaryInput);
      }

      setCopyFeedback("success");
      window.setTimeout(() => setCopyFeedback("idle"), 2200);
    } catch (error) {
      logError(error);
      setCopyFeedback("error");
    }
  }

  return (
    <PublicShell>
      <PublicTopBar />

      <main className="mx-auto grid w-full max-w-5xl gap-6">
        <SectionHeader
          badge="Submit Berhasil"
          title="Aduan Anda sudah berhasil dikirim ke tim support."
          description="Kode tiket berikut sudah disiapkan oleh sistem. Simpan informasinya agar proses pelacakan dan komunikasi lanjutan berjalan lebih mudah."
        />

        <SurfaceCard className="p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <DetailCard
              label="Kode Tiket"
              value={
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg sm:text-xl">{ticketCode}</span>
                  <button
                    type="button"
                    onClick={handleCopyTicketCode}
                    disabled={!hasTicketCode}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {copyFeedback === "success" ? "Tersalin" : "Salin"}
                  </button>
                </div>
              }
            />
            <DetailCard
              label="Status Awal"
              value={<span className="text-lg sm:text-xl">{status}</span>}
            />
          </div>

          {copyFeedback === "error" ? (
            <div className="mt-4">
              <InlineNotice variant="error">
                Gagal menyalin kode tiket. Silakan salin manual.
              </InlineNotice>
            </div>
          ) : null}

          <div className="mt-5">
            <InlineNotice variant="success">
              Data aduan sudah diterima. Gunakan kode tiket dan nomor HP terdaftar untuk
              memantau progres penanganan.
            </InlineNotice>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ButtonLink to="/tracking" className="w-full">
              Lacak Tiket
            </ButtonLink>
            <ButtonLink to="/" variant="secondary" className="w-full">
              Buat Aduan Baru
            </ButtonLink>
          </div>
        </SurfaceCard>

        <section className="grid gap-4 md:grid-cols-3">
          {nextSteps.map((item) => (
            <FeatureCard key={item.title} title={item.title} description={item.description} />
          ))}
        </section>
      </main>
    </PublicShell>
  );
}

