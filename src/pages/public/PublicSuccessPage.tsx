// PublicSuccessPage.tsx
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
              value={<span className="text-lg sm:text-xl">{ticketCode}</span>}
            />
            <DetailCard
              label="Status Awal"
              value={<span className="text-lg sm:text-xl">{status}</span>}
            />
          </div>

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