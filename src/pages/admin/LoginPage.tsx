import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { login } from "../../api/auth.api";
import { LoadingInline } from "../../components/feedback/LoadingIndicator";
import {
  clearAuthSession,
  getToken,
  getUser,
  resolveUserRoleName,
  setAuthSession,
} from "../../lib/auth";

const ADMIN_ALLOWED_ROLES = ["admin", "head"];

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    const roleName = resolveUserRoleName(getUser());

    if (token && roleName && ADMIN_ALLOWED_ROLES.includes(roleName)) {
      navigate("/admin", { replace: true });
      return;
    }

    if (token) clearAuthSession();
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      setAuthSession(result.access_token, result.user);
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      setError("Login gagal. Periksa kembali email dan password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(14,116,144,0.2),transparent_34%),linear-gradient(145deg,#020617_0%,#0f172a_52%,#1e293b_100%)]" />
      <div className="pointer-events-none absolute -left-16 top-14 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl ornament-drift" />
      <div className="pointer-events-none absolute bottom-8 right-[-3rem] h-64 w-64 rounded-full bg-sky-300/20 blur-3xl ornament-drift" />

      <section className="relative w-full max-w-md rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_40px_120px_-65px_rgba(15,23,42,0.7)] backdrop-blur-md sm:p-8">
        <div className="space-y-3">
          <p className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Login Internal
          </p>
          <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
            Ticketing System CIM
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Masuk dengan akun admin atau head.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 pr-24 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-1.5 right-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
          </label>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <LoadingInline label="Memproses login..." spinnerClassName="text-white" />
            ) : (
              "Masuk ke Dashboard"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
