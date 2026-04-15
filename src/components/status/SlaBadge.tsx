import { useEffect, useState } from "react";

type Props = {
  slaDeadline?: string | null;
  isSlaBreached: boolean;
};

function buildSlaLabel(deadline?: string | null, isBreached?: boolean) {
  if (!deadline) return "Tanpa SLA";

  const now = new Date().getTime();
  const end = new Date(deadline).getTime();
  const diff = end - now;

  if (isBreached || diff <= 0) {
    return "SLA Terlewat";
  }

  const totalMinutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}j ${minutes}m lagi`;
  }

  return `${minutes}m lagi`;
}

export default function SlaBadge({ slaDeadline, isSlaBreached }: Props) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000);

    return () => window.clearInterval(interval);
  }, []);

  const label = buildSlaLabel(slaDeadline, isSlaBreached);

  const className =
    isSlaBreached || label === "SLA Terlewat"
      ? "inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
      : "inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700";

  return <span className={className}>{label}</span>;
}
