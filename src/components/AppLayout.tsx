import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Home, Database, GitBranch, FileText, LogOut, Bell } from "lucide-react";

const navItems = [
  { to: "/home", label: "Accueil", icon: Home },
  { to: "/datasets", label: "Datasets", icon: Database },
  { to: "/pipelines", label: "Pipelines", icon: GitBranch },
];

const pageTitles: Record<string, string> = {
  "/home": "Accueil",
  "/datasets": "Datasets",
  "/pipelines": "Pipelines",
};

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("dataplatform_user") || "{}");

  const getTitle = () => {
    if (location.pathname.startsWith("/logs/")) return "Logs";
    if (location.pathname.startsWith("/datasets/") && location.pathname !== "/datasets") return "Détail Dataset";
    return pageTitles[location.pathname] || "Data Plateforme";
  };

  const handleLogout = () => {
    localStorage.removeItem("dataplatform_user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[220px] flex-col bg-sidebar-bg text-sidebar-fg">
        <div className="flex h-14 items-center px-5">
          <Database className="mr-2 h-5 w-5 text-primary" />
          <span className="text-lg font-bold text-primary-foreground">Data Plateforme</span>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = location.pathname === item.to || (item.to !== "/home" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-sidebar-active text-primary-foreground" : "hover:bg-sidebar-hover"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-hover p-4">
          <p className="truncate text-xs text-sidebar-fg">{user.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-2 text-xs text-sidebar-fg hover:text-primary-foreground transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-[220px] flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background px-6">
          <h1 className="text-lg font-semibold text-foreground">{getTitle()}</h1>
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {user.email?.[0]?.toUpperCase() || "?"}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
