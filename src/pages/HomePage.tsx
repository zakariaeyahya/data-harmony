import { Link } from "react-router-dom";
import {
  Database, GitBranch, AlertTriangle,
  ArrowRight, Clock, ChevronRight,
} from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

/* ── Helpers ─────────────────────────────────────── */
const sourceLabels: Record<string, string> = {
  FILE_CSV: "CSV", FILE_JSON: "JSON", FILE_EXCEL: "Excel", DATABASE: "BDD", API: "API",
};

const sourceStyles: Record<string, string> = {
  FILE_CSV:   "bg-emerald-500/20 text-emerald-300",
  FILE_JSON:  "bg-blue-500/20    text-blue-300",
  FILE_EXCEL: "bg-green-500/20   text-green-300",
  DATABASE:   "bg-purple-500/20  text-purple-300",
  API:        "bg-orange-500/20  text-orange-300",
};

const hour = new Date().getHours();
const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
const today = new Date().toLocaleDateString("fr-FR", {
  weekday: "long", day: "numeric", month: "long",
});

/* ── Component ───────────────────────────────────── */
const HomePage = () => {
  const user     = JSON.parse(localStorage.getItem("dataplatform_user") || "{}");
  const username = (user?.email?.split("@")[0] ?? "utilisateur") as string;

  const datasetCount = mockData.datasets.length;
  const runningCount = mockData.pipelines.filter((p) => p.status === "RUNNING").length;
  const errorCount   = mockData.pipelines.filter((p) => p.status === "FAILED").length;

  const recentDatasets = [...mockData.datasets]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 4);

  const recentPipelines = mockData.pipelines.slice(0, 4);

  const stats = [
    {
      label:     "Datasets",
      value:     datasetCount,
      desc:      "Sources connectées",
      icon:      Database,
      gradient:  "from-blue-400 to-cyan-400",
      glow:      "hover:shadow-blue-500/20",
      iconBg:    "bg-blue-500/20",
      iconColor: "text-blue-400",
      orb:       "bg-blue-500",
      link:      "/datasets",
    },
    {
      label:     "En cours",
      value:     runningCount,
      desc:      "Pipelines actifs",
      icon:      GitBranch,
      gradient:  "from-amber-400 to-orange-400",
      glow:      "hover:shadow-amber-500/20",
      iconBg:    "bg-amber-500/20",
      iconColor: "text-amber-400",
      orb:       "bg-amber-500",
      link:      "/pipelines",
    },
    {
      label:     "Erreurs",
      value:     errorCount,
      desc:      "Pipelines en échec",
      icon:      AlertTriangle,
      gradient:  "from-red-400 to-rose-400",
      glow:      "hover:shadow-red-500/20",
      iconBg:    "bg-red-500/20",
      iconColor: "text-red-400",
      orb:       "bg-red-500",
      link:      "/pipelines",
    },
  ];

  return (
    <div className="relative space-y-8 overflow-hidden">

      {/* Orbes décoratifs (relatifs au contenu) */}
      <div className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-indigo-600/10 blur-3xl" />

      {/* ── Hero / Greeting ── */}
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium capitalize text-slate-600">{today}</p>
          <h1 className="mt-1 text-3xl font-bold text-white">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent capitalize">
              {username}
            </span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Voici l'état de votre plateforme de données en temps réel.
          </p>
        </div>

        {/* Indicateur système */}
        <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Système opérationnel
        </span>
      </div>

      {/* ── KPI Cards ── */}
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.link}
            className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-2xl ${s.glow}`}
          >
            {/* Orbe interne */}
            <div className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full ${s.orb} opacity-[0.08] blur-2xl`} />

            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg}`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <ChevronRight className="h-4 w-4 text-slate-700 opacity-0 transition group-hover:opacity-100" />
            </div>

            <div className="mt-5">
              <p className={`text-4xl font-bold bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                {s.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-200">{s.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Grille inférieure ── */}
      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Datasets récents */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20">
                <Database className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <h2 className="font-semibold text-white">Datasets récents</h2>
            </div>
            <Link
              to="/datasets"
              className="flex items-center gap-1 text-xs text-blue-400 transition hover:text-blue-300"
            >
              Voir tous <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {recentDatasets.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-800/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-200">{d.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${sourceStyles[d.source_type] ?? "bg-slate-700 text-slate-400"}`}>
                      {sourceLabels[d.source_type] ?? d.source_type}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-600">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(d.updated_at), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Pipelines récents */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20">
                <GitBranch className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <h2 className="font-semibold text-white">Pipelines récents</h2>
            </div>
            <Link
              to="/pipelines"
              className="flex items-center gap-1 text-xs text-blue-400 transition hover:text-blue-300"
            >
              Voir tous <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {recentPipelines.map((p) => (
              <div key={p.id} className="px-6 py-4 transition hover:bg-slate-800/60">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">{p.dataset_name}</p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      Pipeline #{p.id} · {p.duration ?? "En cours"}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                {/* Barre de progression RUNNING */}
                {"progress" in p && p.status === "RUNNING" && (
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-slate-600">Progression</span>
                      <span className="text-xs font-medium text-amber-400">
                        {(p as { progress: number }).progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                        style={{ width: `${(p as { progress: number }).progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Message erreur FAILED */}
                {p.status === "FAILED" && p.error_message && (
                  <p className="mt-2 truncate text-xs text-red-400">{p.error_message}</p>
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
