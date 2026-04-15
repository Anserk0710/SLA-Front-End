import { useState } from "react";
import TicketFilterBar from "../../tickets/components/TicketFilterBar";
import {
  emptyTicketFilterBarValue,
  type TicketFilterBarValue,
} from "../../tickets/components/ticketFilterBar.shared";
import type { TechnicianOption } from "../../../types/admin-ticket";

type Props = {
    technicians?: TechnicianOption[];
    onExport: (filters: TicketFilterBarValue) => void;
};

export default function ReportFilters({ technicians = [], onExport }: Props) {
    const [filters, setFilters] = useState<TicketFilterBarValue>(emptyTicketFilterBarValue);

    return (
        <div className="space-y-3">
      <TicketFilterBar
        key={`${filters.status}|${filters.category}|${filters.dateFrom}|${filters.dateTo}|${filters.technicianId}`}
        initialValue={filters}
        technicians={technicians}
        onChange={setFilters}
        onApply={(nextFilters) => setFilters(nextFilters)}
        onReset={() => setFilters(emptyTicketFilterBarValue)}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onExport(filters)}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Export Excel
        </button>
      </div>
    </div>
    );
}
