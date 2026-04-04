import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { clearAuthSession, getUser } from "../../lib/auth";

const navItems = [
    { label: "Dashboard", to: "/admin"},
    { label: "Users", to: "/admin/tickets"},
]

export default function AppShell() {
    const user = getUser();
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        clearAuthSession();
        navigate("/login");
    }
    return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Ticketing Internal</h1>
            <p className="text-sm text-slate-500">
              {user?.full_name} • {user?.role.full_name}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl bg-white p-4 shadow-sm">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="rounded-xl bg-white p-6 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
}