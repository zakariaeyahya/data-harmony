import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Home, Database, GitBranch, LogOut, Bell } from "lucide-react";

const navItems = [
  { to: "/home",      label: "Accueil",   icon: Home },
  { to: "/datasets",  label: "Datasets",  icon: Database },
  { to: "/pipelines", label: "Pipelines", icon: GitBranch },
];

const pageTitles: Record<string, string> = {
  "/home":      "Tableau de bord",
  "/datasets":  "Datasets",
  "/pipelines": "Pipelines",
};

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("dataplatform_user") || "{}");
  const initials = user.email?.[0]?.toUpperCase() ?? "?";
  const username = user.email?.split("@")[0] ?? "utilisateur";

  const getTitle = () => {
    if (location.pathname.startsWith("/logs/")) return "Logs pipeline";
    if (location.pathname.startsWith("/datasets/") && location.pathname !== "/datasets") return "Détail dataset";
    return pageTitles[location.pathname] ?? "Data Harmony Hub";
  };

  const handleLogout = () => {
    localStorage.removeItem("dataplatform_user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-950">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[240px] flex-col border-r border-slate-800 bg-slate-900">

        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30">
            <Database className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white">Data Harmony Hub</span>
        </div>

        {/* Label section */}
        <div className="px-5 pb-2 pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
            Navigation
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active =
              location.pathname === item.to ||
              (item.to !== "/home" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition ${
                  active ? "bg-blue-500/30" : "bg-slate-800 group-hover:bg-slate-700"
                }`}>
                  <item.icon className="h-3.5 w-3.5" />
                </div>
                {item.label}
                {active && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User block */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow shadow-blue-500/20">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium capitalize text-slate-200">{username}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* ── Zone principale ── */}
      <div className="ml-[240px] flex flex-1 flex-col">

        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur-md">
          <div>
            <h1 className="text-base font-semibold text-white">{getTitle()}</h1>
            <p className="text-xs text-slate-500">Data Harmony Hub</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Bell */}
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition hover:border-slate-600 hover:text-slate-200">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-900" />
            </button>
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow shadow-blue-500/20">
              {initials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-slate-950 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
