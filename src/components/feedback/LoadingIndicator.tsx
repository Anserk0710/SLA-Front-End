type SpinnerSize = "sm" | "md" | "lg";

type LoadingSpinnerProps = {
  size?: SpinnerSize;
  className?: string;
};

type LoadingInlineProps = {
  label: string;
  className?: string;
  spinnerClassName?: string;
};

type LoadingStateProps = {
  label?: string;
  className?: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const spinnerSizeClass: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <span className={cn("inline-flex items-center justify-center", className)} aria-hidden="true">
      <span
        className={cn(
          "inline-block rounded-full border-current border-t-transparent align-[-0.125em] animate-spin",
          spinnerSizeClass[size]
        )}
      />
    </span>
  );
}

export function LoadingInline({ label, className, spinnerClassName }: LoadingInlineProps) {
  return (
    <span className={cn("inline-flex items-center justify-center gap-2", className)} role="status">
      <LoadingSpinner size="sm" className={spinnerClassName} />
      <span>{label}</span>
    </span>
  );
}

export function LoadingState({ label = "Memuat data...", className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-7 text-sm text-slate-600",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="md" className="text-slate-500" />
      <span>{label}</span>
    </div>
  );
}
