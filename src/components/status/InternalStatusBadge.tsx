type InternalStatusBadgeProps = {
  status: string;
};

import { getInternalStatusMeta } from "./internalStatus";

export default function InternalStatusBadge({
  status,
}: InternalStatusBadgeProps) {
  const meta = getInternalStatusMeta(status);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${meta.badgeClassName}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${meta.dotClassName}`} />
      {meta.label}
    </span>
  );
}
