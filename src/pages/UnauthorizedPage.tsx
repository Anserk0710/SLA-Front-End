import { Link } from "react-router";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold">Akses Ditolak</h1>
        <p className="mt-3 text-sm text-slate-500">
          Anda tidak memiliki akses ke halaman ini.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
}