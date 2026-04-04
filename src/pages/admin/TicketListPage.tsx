const rows = [
    {
        code: "TCK-001",
        category: "Software",
        status: "NEW",
        pic: "Budi"
    },
    {
        code: "TCK-002",
        category: "Hardware",
        status: "RESPONDED",
        pic: "Ani"
    },
];

export default function TicketListPage() {
    return (
        <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ticket List</h2>
        <p className="text-sm text-slate-500">
          Skeleton halaman list ticket untuk Phase 1
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50 text-left text-sm text-slate-600">
            <tr>
              <th className="px-4 py-3">Ticket Code</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">PIC</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.code} className="border-t border-slate-200 text-sm">
                <td className="px-4 py-3 font-medium">{row.code}</td>
                <td className="px-4 py-3">{row.category}</td>
                <td className="px-4 py-3">{row.pic}</td>
                <td className="px-4 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )
}