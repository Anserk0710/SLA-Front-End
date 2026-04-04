// PublicStatusBadge.tsx
type PublicStatusBadgeProps = {
  status: string;
};

function getStatusStyle(status: string) {
  switch (status) {
    case "Dalam Antrian":
      return {
        wrapper: "border-amber-200 bg-amber-50 text-amber-800",
        dot: "bg-amber-500",
      };
    case "Sudah Direspon":
      return {
        wrapper: "border-sky-200 bg-sky-50 text-sky-800",
        dot: "bg-sky-500",
      };
    case "Sedang Dikerjakan":
      return {
        wrapper: "border-violet-200 bg-violet-50 text-violet-800",
        dot: "bg-violet-500",
      };
    case "Sudah Selesai":
      return {
        wrapper: "border-emerald-200 bg-emerald-50 text-emerald-800",
        dot: "bg-emerald-500",
      };
    case "Ditolak":
      return {
        wrapper: "border-rose-200 bg-rose-50 text-rose-800",
        dot: "bg-rose-500",
      };
    default:
      return {
        wrapper: "border-slate-200 bg-slate-100 text-slate-700",
        dot: "bg-slate-400",
      };
  }
}

export default function PublicStatusBadge({ status }: PublicStatusBadgeProps) {
  const style = getStatusStyle(status);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${style.wrapper}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}