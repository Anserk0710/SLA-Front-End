import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { login } from "../../api/auth.api";
import { getToken, getUser, setAuthSession } from "../../lib/auth";

function getHomeByRole(roleName?: string) {
  const normalizedRole = roleName?.trim().toLowerCase();
  if (normalizedRole === "technician") return "/technician";
  return "/admin";
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getToken()) {
      const user = getUser();
      navigate(getHomeByRole(user?.role.name), { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      setAuthSession(result.access_token, result.user);
      navigate(getHomeByRole(result.user.role.name), { replace: true });
    } catch (err: unknown) {
      setError("Login gagal. Periksa email dan password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">Login Internal</h1>
        <p className="mb-2 text-sm text-slate-500">
          Login sebagai Admin, Head, atau Technician
        </p>

        <div className="mb-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-semibold">Akun test:</p>
          <p>ADMIN: admin@example.com / admin123</p>
          <p>HEAD: head@example.com / head123</p>
          <p>TECHNICIAN: technician@example.com / technician123</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
            />
          </div>

          {error ? (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
