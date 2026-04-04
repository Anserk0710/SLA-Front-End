// PublicFormPage.tsx
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { createPublicTicket } from "../../api/ticket.api";
import {
  ButtonLink,
  FeatureCard,
  FieldInput,
  FieldSelect,
  FieldTextArea,
  InlineNotice,
  PublicShell,
  PublicTopBar,
  SectionHeader,
  StatCard,
  SubmitButton,
  SurfaceCard,
} from "../../components/public/PublicUi";

type FormValues = {
  full_name: string;
  full_address: string;
  category: string;
  description: string;
  pic_name: string;
  phone_number: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  full_name: "",
  full_address: "",
  category: "",
  description: "",
  pic_name: "",
  phone_number: "",
};

const categories = ["Critical", "High", "Medium", "Low"];

const quickStats = [
  {
    label: "Respon Awal",
    value: "< 15 Menit",
    helper: "untuk kategori kritikal dan high priority",
  },
  {
    label: "Monitoring",
    value: "24/7",
    helper: "tim support siap menerima laporan operasional",
  },
  {
    label: "Status Update",
    value: "Realtime",
    helper: "pelapor dapat mengecek progres kapan saja",
  },
];

const servicePoints = [
  {
    title: "Input lebih terstruktur",
    description:
      "Form dirancang agar data inti terkumpul sejak awal, sehingga tim teknis dapat melakukan triase dengan lebih cepat.",
  },
  {
    title: "Prioritas berdasarkan dampak",
    description:
      "Setiap tiket diproses sesuai kategori urgensi untuk membantu menjaga stabilitas layanan dan operasional.",
  },
  {
    title: "Transparan untuk pelapor",
    description:
      "Setelah submit, sistem menyiapkan kode tiket yang bisa digunakan untuk memantau progres penanganan.",
  },
  {
    title: "Siap dipakai di semua device",
    description:
      "Tata letak responsif memastikan pengalaman tetap nyaman di desktop, tablet, maupun layar ponsel.",
  },
];

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.full_name.trim().length < 3) {
    errors.full_name = "Nama lengkap minimal 3 karakter.";
  }

  if (values.full_address.trim().length < 10) {
    errors.full_address = "Alamat lengkap minimal 10 karakter.";
  }

  if (values.category.trim().length < 3) {
    errors.category = "Kategori wajib dipilih.";
  }

  if (values.description.trim().length < 10) {
    errors.description = "Deskripsi kendala minimal 10 karakter.";
  }

  if (values.pic_name.trim().length < 3) {
    errors.pic_name = "Nama PIC minimal 3 karakter.";
  }

  const normalizedPhone = values.phone_number.replace(/\D/g, "");
  if (normalizedPhone.length < 8 || normalizedPhone.length > 20) {
    errors.phone_number = "Nomor HP tidak valid.";
  }

  return errors;
}

export default function PublicFormPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    setSubmitError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const result = await createPublicTicket(values);
      navigate(
        `/success?ticketCode=${encodeURIComponent(result.ticket_code)}&status=${encodeURIComponent(
          result.public_status
        )}`
      );
    } catch (error) {
      console.error(error);
      setSubmitError("Gagal mengirim aduan. Silakan coba lagi dalam beberapa saat.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <PublicTopBar />

      <main className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <section className="order-2 space-y-6 lg:order-1 lg:pr-4">
          <SectionHeader
            badge="Portal Aduan Publik"
            title="Laporkan kendala dengan tampilan yang modern, proses yang profesional, dan alur yang mudah dipahami."
            description="Halaman ini dirancang untuk mempercepat pelaporan insiden atau kendala layanan. Semua informasi penting dikumpulkan sejak awal agar tim support bisa memproses tiket secara lebih akurat dan konsisten."
          />

          <div className="grid gap-4 sm:grid-cols-3">
            {quickStats.map((item) => (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
                helper={item.helper}
              />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {servicePoints.map((point) => (
              <FeatureCard
                key={point.title}
                title={point.title}
                description={point.description}
              />
            ))}
          </div>
        </section>

        <SurfaceCard className="order-1 h-fit p-5 sm:p-6 lg:order-2 lg:sticky lg:top-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-950">Form Aduan Publik</h2>
            <p className="text-sm leading-6 text-slate-600">
              Lengkapi detail pelaporan berikut agar tim support dapat melakukan validasi,
              klasifikasi, dan penanganan dengan lebih cepat.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldInput
                id="full-name"
                label="Nama Lengkap"
                placeholder="Contoh: Budi Santoso"
                value={values.full_name}
                onChange={(event) => updateField("full_name", event.target.value)}
                error={errors.full_name}
                hint="Masukkan nama pelapor utama."
                disabled={loading}
              />

              <FieldInput
                id="pic-name"
                label="Nama PIC"
                placeholder="Contoh: Rina Putri"
                value={values.pic_name}
                onChange={(event) => updateField("pic_name", event.target.value)}
                error={errors.pic_name}
                hint="PIC akan dihubungi jika perlu verifikasi tambahan."
                disabled={loading}
              />

              <div className="sm:col-span-2">
                <FieldInput
                  id="full-address"
                  label="Alamat Lengkap"
                  placeholder="Jl. Sudirman No. 20, Jakarta"
                  value={values.full_address}
                  onChange={(event) => updateField("full_address", event.target.value)}
                  error={errors.full_address}
                  hint="Gunakan alamat lokasi kejadian atau lokasi layanan terdampak."
                  disabled={loading}
                />
              </div>

              <FieldSelect
                id="issue-category"
                label="Kategori Kendala"
                value={values.category}
                onChange={(event) => updateField("category", event.target.value)}
                error={errors.category}
                hint="Pilih tingkat prioritas berdasarkan dampak masalah."
                disabled={loading}
              >
                <option value="">Pilih kategori</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </FieldSelect>

              <FieldInput
                id="phone-number"
                label="Nomor yang Bisa Dihubungi"
                placeholder="08xxxxxxxxxx"
                value={values.phone_number}
                onChange={(event) => updateField("phone_number", event.target.value)}
                error={errors.phone_number}
                hint="Gunakan nomor aktif untuk kebutuhan pelacakan tiket."
                disabled={loading}
              />
            </div>

            <FieldTextArea
              id="issue-description"
              label="Deskripsi Kendala"
              placeholder="Jelaskan kronologi, waktu kejadian, area terdampak, dan dampak operasional yang dirasakan."
              value={values.description}
              onChange={(event) => updateField("description", event.target.value)}
              error={errors.description}
              hint="Informasi yang detail membantu percepatan triase dan investigasi."
              disabled={loading}
            />

            <InlineNotice>
              Setelah submit, sistem akan menyiapkan kode tiket untuk pelacakan progres dan
              verifikasi lanjutan.
            </InlineNotice>

            {submitError ? <InlineNotice variant="error">{submitError}</InlineNotice> : null}

            <SubmitButton
              loading={loading}
              loadingText="Mengirim aduan..."
              idleText="Kirim Aduan"
            />
          </form>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-600">
              Sudah memiliki kode tiket? Gunakan halaman tracking untuk melihat status
              penanganan terbaru.
            </p>
            <ButtonLink to="/tracking" variant="secondary" className="sm:w-auto">
              Lacak Status
            </ButtonLink>
          </div>
        </SurfaceCard>
      </main>

      <footer className="px-1 pb-2 text-center text-[11px] uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
        Portal ini dirancang untuk pengelolaan aduan yang cepat, transparan, dan terukur.
      </footer>
    </PublicShell>
  );
}