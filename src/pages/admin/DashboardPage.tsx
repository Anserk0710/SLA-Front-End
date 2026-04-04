const stats = [
    { label: "Total Tickets", value: 128 },
    { label: "Belum Direspon", value: 32 },
    { label: "Sedang Dikerjakan", value: 45 },
    { label: "Selesai", value: 51 },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-slate-500">
          Skeleton dashboard untuk Phase 1
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
    )
}