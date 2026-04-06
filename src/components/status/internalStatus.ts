type KnownInternalStatus =
  | "new"
  | "responded"
  | "assigned"
  | "on_site"
  | "in_progress"
  | "resolved"
  | "closed"
  | "rejected";

type InternalStatusMeta = {
  key: string;
  label: string;
  badgeClassName: string;
  dotClassName: string;
};

const INTERNAL_STATUS_ORDER: KnownInternalStatus[] = [
  "new",
  "responded",
  "assigned",
  "on_site",
  "in_progress",
  "resolved",
  "closed",
  "rejected",
];

const INTERNAL_STATUS_META: Record<KnownInternalStatus, Omit<InternalStatusMeta, "key">> = {
  new: {
    label: "New",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-800",
    dotClassName: "bg-amber-500",
  },
  responded: {
    label: "Responded",
    badgeClassName: "border-blue-200 bg-blue-50 text-blue-800",
    dotClassName: "bg-blue-500",
  },
  assigned: {
    label: "Assigned",
    badgeClassName: "border-violet-200 bg-violet-50 text-violet-800",
    dotClassName: "bg-violet-500",
  },
  on_site: {
    label: "On Site",
    badgeClassName: "border-indigo-200 bg-indigo-50 text-indigo-800",
    dotClassName: "bg-indigo-500",
  },
  in_progress: {
    label: "In Progress",
    badgeClassName: "border-cyan-200 bg-cyan-50 text-cyan-800",
    dotClassName: "bg-cyan-500",
  },
  resolved: {
    label: "Resolved",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dotClassName: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    badgeClassName: "border-green-200 bg-green-50 text-green-800",
    dotClassName: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-800",
    dotClassName: "bg-rose-500",
  },
};

function normalizeInternalStatusKey(status: string): KnownInternalStatus | null {
  const normalized = status.trim().replace(/[\s-]+/g, "_").toLowerCase();
  if (normalized in INTERNAL_STATUS_META) {
    return normalized as KnownInternalStatus;
  }
  return null;
}

function titleCaseStatus(status: string) {
  if (!status.trim()) return "Unknown";

  return status
    .trim()
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getInternalStatusMeta(status: string): InternalStatusMeta {
  const normalized = normalizeInternalStatusKey(status);
  if (normalized) {
    return {
      key: normalized,
      ...INTERNAL_STATUS_META[normalized],
    };
  }

  return {
    key: status,
    label: titleCaseStatus(status),
    badgeClassName: "border-slate-200 bg-slate-100 text-slate-700",
    dotClassName: "bg-slate-400",
  };
}

export function formatInternalStatus(status: string): string {
  return getInternalStatusMeta(status).label;
}

export const internalStatusFilterOptions = INTERNAL_STATUS_ORDER.map((key) => ({
  value: key,
  label: INTERNAL_STATUS_META[key].label,
}));
