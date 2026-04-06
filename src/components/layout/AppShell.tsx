import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { clearAuthSession, getUser, resolveUserRoleName } from "../../lib/auth";

const navItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Ticket List", to: "/admin/tickets" },
];

export default function AppShell() {
  const user = getUser();
  const roleName = resolveUserRoleName(user);
  const roleLabel = roleName ? roleName.toUpperCase() : "-";
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    clearAuthSession();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e0f2fe_0%,#f8fafc_38%,#eef2ff_100%)]">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-950 sm:text-xl">Ticketing System CIM</h1>
            <p className="truncate text-xs text-slate-600 sm:text-sm">
              {user?.full_name} | {roleLabel}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-5 lg:py-5">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white/88 p-3 shadow-sm backdrop-blur-sm lg:sticky lg:top-4">
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const active =
                item.to === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition lg:w-full ${
                    active
                      ? "bg-slate-950 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 rounded-2xl border border-slate-200 bg-white/92 p-4 shadow-sm backdrop-blur-sm sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
