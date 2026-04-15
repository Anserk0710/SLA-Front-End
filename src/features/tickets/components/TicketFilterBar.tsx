import { useState } from "react";
import { internalStatusFilterOptions } from "../../../components/status/internalStatus";
import type { TechnicianOption } from "../../../types/admin-ticket";
import {
  emptyTicketFilterBarValue,
  type TicketFilterBarValue,
} from "./ticketFilterBar.shared";

type Props = {
  initialValue?: Partial<TicketFilterBarValue>;
  technicians?: TechnicianOption[];
  disabled?: boolean;
  onChange?: (filters: TicketFilterBarValue) => void;
  onApply: (filters: TicketFilterBarValue) => void | Promise<void>;
  onReset: () => void | Promise<void>;
};

const categoryOptions = ["Critical", "High", "Medium", "Low"];

function buildFilterValue(initialValue?: Partial<TicketFilterBarValue>): TicketFilterBarValue {
  return {
    ...emptyTicketFilterBarValue,
    ...initialValue,
  };
}

export default function TicketFilterBar({
  initialValue,
  technicians = [],
  disabled = false,
  onChange,
  onApply,
  onReset,
}: Props) {
  const [filters, setFilters] = useState<TicketFilterBarValue>(() => buildFilterValue(initialValue));

  function handleChange(key: keyof TicketFilterBarValue, value: string) {
    const nextFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(nextFilters);
    onChange?.(nextFilters);
  }

  function handleReset() {
    setFilters(emptyTicketFilterBarValue);
    onChange?.(emptyTicketFilterBarValue);
    void onReset();
  }

  return (
    <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <select
          value={filters.status}
          onChange={(event) => handleChange("status", event.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">Semua Status</option>
          {internalStatusFilterOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(event) => handleChange("category", event.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">Semua Kategori</option>
          {categoryOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => handleChange("dateFrom", event.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
        />

        <input
          type="date"
          value={filters.dateTo}
          onChange={(event) => handleChange("dateTo", event.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
        />

        {technicians.length > 0 ? (
          <select
            value={filters.technicianId}
            onChange={(event) => handleChange("technicianId", event.target.value)}
            disabled={disabled}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">Semua Teknisi</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.full_name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Technician ID"
            value={filters.technicianId}
            onChange={(event) => handleChange("technicianId", event.target.value)}
            disabled={disabled}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void onApply(filters)}
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Terapkan Filter
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
