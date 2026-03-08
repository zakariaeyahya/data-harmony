import { Link } from "react-router-dom";
import { Database, GitBranch, AlertTriangle, ArrowRight, Clock, ChevronRight } from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const HomePage = () => {
  const datasetCount = mockData.datasets.length;
  const runningCount = mockData.pipelines.filter((p) => p.status === "RUNNING").length;
  const errorCount = mockData.pipelines.filter((p) => p.status === "FAILED").length;

  const recentDatasets = [...mockData.datasets]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);

  const recentPipelines = mockData.pipelines.slice(0, 3);

  const user = JSON.parse(localStorage.getItem("dataplatform_user") || "{}");
  const username = user?.email?.split("@")[0] ?? "utilisateur";

  const stats = [
    {
      label: "Datasets",
      value: datasetCount,
      desc: "Sources de données actives",
      icon: Database,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      link: "/datasets",
    },
    {
      label: "Pipelines actifs",
      value: runningCount,
      desc: "En cours d'exécution",
      icon: GitBranch,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      link: "/pipelines",
    },
    {
      label: "Erreurs",
      value: errorCount,
      desc: "Pipelines en échec",
      icon: AlertTriangle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      link: "/pipelines",
    },
  ];

  return (
    <div className="space-y-8">

      {/* ── En-tête ── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground capitalize">
          Bonjour, {username}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Voici un aperçu de votre plateforme de données.
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.link}
            className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg}`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">{s.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Grille inférieure ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Datasets récents */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Datasets récents</h2>
            </div>
            <Link
              to="/datasets"
              className="flex items-center gap-1 text-xs text-primary transition-colors hover:text-primary/80"
            >
              Voir tous <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y">
            {recentDatasets.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{d.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    {formatDistanceToNow(new Date(d.updated_at), { addSuffix: true, locale: fr })}
                  </p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Pipelines récents */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Pipelines récents</h2>
            </div>
            <Link
              to="/pipelines"
              className="flex items-center gap-1 text-xs text-primary transition-colors hover:text-primary/80"
            >
              Voir tous <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y">
            {recentPipelines.map((p) => (
              <div key={p.id} className="px-6 py-4 transition hover:bg-muted/40">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {p.dataset_name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Pipeline #{p.id} · {p.duration ?? "En cours"}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                {/* Barre de progression (RUNNING) */}
                {"progress" in p && p.status === "RUNNING" && (
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Progression</span>
                      <span className="text-xs font-medium text-amber-500">
                        {(p as { progress: number }).progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all"
                        style={{ width: `${(p as { progress: number }).progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Message d'erreur (FAILED) */}
                {p.status === "FAILED" && p.error_message && (
                  <p className="mt-2 truncate text-xs text-destructive">{p.error_message}</p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
