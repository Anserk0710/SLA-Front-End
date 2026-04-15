import { useEffect, useState } from "react";
import ReportFilters from "../../features/reports/components/ReportFilters";
import { downloadTicketReport } from "../../api/report.api";
import { getTechnicians } from "../../api/user.api";
import { getApiErrorMessage } from "../../lib/api-error";
import { logError } from "../../lib/logger";
import type { TechnicianOption } from "../../types/admin-ticket";

export default function ReportsPage() {
    const [technicians, setTechnicians] = useState<TechnicianOption[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTechnicians() {
            try {
                setError("");
                const data = await getTechnicians();
                setTechnicians(data);
            } catch (err) {
                logError(err);
                setError(getApiErrorMessage(err, "Gagal memuat daftar teknisi."));
            }
        }

        void loadTechnicians();
    }, []);

    return (
        <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Reports</h1>
        <p className="text-sm text-slate-500">
          Export laporan ticket berdasarkan filter.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <ReportFilters technicians={technicians} onExport={downloadTicketReport} />
    </div>
    );
}
