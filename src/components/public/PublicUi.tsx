// PublicUi.tsx
import type {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Link, useLocation, type LinkProps } from "react-router";

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type PublicShellProps = {
  children: ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_24%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_44%,#f8fafc_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(15,23,42,0.06),transparent)]" />
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-4rem] top-16 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-300/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </div>
    </div>
  );
}

const navItems = [
  {
    label: "Buat Aduan",
    to: "/",
    matches: ["/", "/success"],
  },
  {
    label: "Lacak Tiket",
    to: "/tracking",
    matches: ["/tracking"],
  },
];

export function PublicTopBar() {
  const location = useLocation();

  return (
    <header className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.25)] backdrop-blur-md sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950 sm:text-base">
            Portal Aduan Publik
          </p>
          <p className="text-xs text-slate-500 sm:text-sm">
            Buat aduan dan lacak status tiket dengan lebih mudah
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const isActive = item.matches.includes(location.pathname);

            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function SurfaceCard({ children, className, style }: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.5)] backdrop-blur-md sm:p-6",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

type InfoBadgeProps = {
  children: ReactNode;
};

export function InfoBadge({ children }: InfoBadgeProps) {
  return (
    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300/80 bg-white/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      {children}
    </div>
  );
}

type SectionHeaderProps = {
  badge?: string;
  title: string;
  description: string;
  className?: string;
};

export function SectionHeader({ badge, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {badge ? <InfoBadge>{badge}</InfoBadge> : null}
      <div className="space-y-3">
        <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
  className?: string;
  style?: CSSProperties;
};

export function StatCard({ label, value, helper, className, style }: StatCardProps) {
  return (
    <SurfaceCard className={cn("space-y-2 p-4", className)} style={style}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="text-2xl font-semibold text-slate-950">{value}</p>
      <p className="text-sm leading-6 text-slate-600">{helper}</p>
    </SurfaceCard>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
  className?: string;
};

export function FeatureCard({ title, description, className }: FeatureCardProps) {
  return (
    <SurfaceCard className={cn("h-full border-slate-200/80 bg-white/72 p-4", className)}>
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
          •
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-950">{title}</p>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
    </SurfaceCard>
  );
}

type DetailCardProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export function DetailCard({ label, value, className }: DetailCardProps) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white px-4 py-4", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <div className="mt-2 text-sm font-semibold leading-6 text-slate-950">{value}</div>
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/90 px-5 py-6 text-center">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

type InlineNoticeProps = {
  children: ReactNode;
  variant?: "neutral" | "error" | "success";
};

export function InlineNotice({ children, variant = "neutral" }: InlineNoticeProps) {
  const styles = {
    neutral: "border-slate-200 bg-slate-50 text-slate-600",
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  } as const;

  return (
    <div className={cn("rounded-2xl border px-4 py-3 text-sm leading-6", styles[variant])}>
      {children}
    </div>
  );
}

type ButtonLinkProps = LinkProps & {
  variant?: "primary" | "secondary";
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition duration-200",
        variant === "primary"
          ? "bg-slate-950 text-white hover:bg-slate-800"
          : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
        className
      )}
    >
      {children}
    </Link>
  );
}

type SubmitButtonProps = {
  loading?: boolean;
  loadingText?: string;
  idleText: string;
  className?: string;
};

export function SubmitButton({
  loading = false,
  loadingText = "Memproses...",
  idleText,
  className,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        "inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {loading ? loadingText : idleText}
    </button>
  );
}

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

function FieldShell({ id, label, error, hint, children }: FieldShellProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

type BaseFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

type FieldInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & BaseFieldProps;

export function FieldInput({ id, label, error, hint, ...props }: FieldInputProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        {...props}
        aria-invalid={Boolean(error)}
        className={cn(
          "w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400",
          error
            ? "border-red-300 ring-2 ring-red-100"
            : "border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        )}
      />
    </FieldShell>
  );
}

type FieldSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> &
  BaseFieldProps & {
    children: ReactNode;
  };

export function FieldSelect({ id, label, error, hint, children, ...props }: FieldSelectProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <select
        id={id}
        {...props}
        aria-invalid={Boolean(error)}
        className={cn(
          "w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition duration-200",
          error
            ? "border-red-300 ring-2 ring-red-100"
            : "border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        )}
      >
        {children}
      </select>
    </FieldShell>
  );
}

type FieldTextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> &
  BaseFieldProps;

export function FieldTextArea({ id, label, error, hint, ...props }: FieldTextAreaProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        {...props}
        aria-invalid={Boolean(error)}
        className={cn(
          "min-h-32 w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400",
          error
            ? "border-red-300 ring-2 ring-red-100"
            : "border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        )}
      />
    </FieldShell>
  );
}
