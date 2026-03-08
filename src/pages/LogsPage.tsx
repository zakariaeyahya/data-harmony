import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, RefreshCw, Download,
  Info, AlertTriangle, XCircle,
  Search, Terminal, GitBranch,
} from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

const LEVEL_OPTIONS = ["Tous", "Info", "Warning", "Erreur"];
const levelMap: Record<string, string> = { Info: "INFO", Warning: "WARNING", Erreur: "ERROR" };

const levelConfig: Record<string, { label: string; badgeBg: string; badgeText: string; lineColor: string }> = {
  INFO:    { label: "INFO", badgeBg: "bg-blue-500/20",   badgeText: "text-blue-300",    lineColor: "text-slate-300"  },
  WARNING: { label: "WARN", badgeBg: "bg-amber-500/20",  badgeText: "text-amber-300",   lineColor: "text-amber-300"  },
  ERROR:   { label: "ERR ", badgeBg: "bg-red-500/20",    badgeText: "text-red-300",     lineColor: "text-red-300"    },
};

type LogEntry = { id: string; level: string; message: string; timestamp: string };

const LogsPage = () => {
  const { id } = useParams();
  const pipeline = mockData.pipelines.find((p) => p.id === id);
  const logs = (mockData.pipeline_logs as Record<string, LogEntry[]>)[id ?? ""] ?? [];

  const [levelFilter, setLevelFilter] = useState("Tous");
  const [search, setSearch] = useState("");

  if (!pipeline) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <GitBranch className="mb-3 h-10 w-10 text-slate-700" />
      <p className="text-slate-500">Pipeline introuvable.</p>
      <Link to="/pipelines" className="mt-4 text-sm text-blue-400 hover:text-blue-300">
        Retour aux pipelines
      </Link>
    </div>
  );

  let filtered = logs;
  if (levelFilter !== "Tous") filtered = filtered.filter((l) => l.level === levelMap[levelFilter]);
  if (search) filtered = filtered.filter((l) => l.message.toLowerCase().includes(search.toLowerCase()));

  const infoCount = logs.filter((l) => l.level === "INFO").length;
  const warnCount = logs.filter((l) => l.level === "WARNING").length;
  const errCount  = logs.filter((l) => l.level === "ERROR").length;

  return (
    <div className="space-y-6">

      {/* ── Retour ── */}
      <Link
        to="/pipelines"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux pipelines
      </Link>

      {/* ── En-tête + Actions ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Pipeline #{pipeline.id}</h2>
            <StatusBadge status={pipeline.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">{pipeline.dataset_name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pipeline.status === "FAILED" && (
            <button
              onClick={() => toast.success("Pipeline relancé")}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500"
            >
              <RefreshCw className="h-4 w-4" /> Relancer
            </button>
          )}
          <button
            onClick={() => toast.success("Téléchargement simulé")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
          >
            <Download className="h-4 w-4" /> Télécharger
          </button>
        </div>
      </div>

      {/* ── Métadonnées ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Dataset", value: pipeline.dataset_name },
          { label: "Début",   value: pipeline.started_at  ? new Date(pipeline.started_at).toLocaleString("fr-FR")  : "—" },
          { label: "Fin",     value: pipeline.finished_at ? new Date(pipeline.finished_at).toLocaleString("fr-FR") : "—" },
          { label: "Durée",   value: pipeline.duration ?? "—" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-200">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Compteurs par niveau ── */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
          <Info className="h-3 w-3" /> {infoCount} info
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300">
          <AlertTriangle className="h-3 w-3" /> {warnCount} warning
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-300">
          <XCircle className="h-3 w-3" /> {errCount} erreur
        </span>
      </div>

      {/* ── Filtres ── */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-600">Niveau :</span>
          {LEVEL_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setLevelFilter(opt)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                levelFilter === opt
                  ? "bg-blue-600/30 text-blue-300 ring-1 ring-blue-500/40"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans les logs..."
            className="rounded-xl border border-slate-700 bg-slate-800 py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* ── Terminal ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">

        {/* Barre titre terminal */}
        <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-amber-500/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Terminal className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-xs text-slate-500">pipeline-{id}.log</span>
          </div>
          <span className="ml-auto text-xs text-slate-600">
            {filtered.length} entrée{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Contenu logs */}
        <div className="max-h-[520px] overflow-y-auto p-4 font-mono text-sm">
          {filtered.length > 0 ? (
            <div className="space-y-0.5">
              {filtered.map((log, i) => {
                const cfg = levelConfig[log.level] ?? levelConfig.INFO;
                const time = new Date(log.timestamp).toLocaleTimeString("fr-FR", {
                  hour: "2-digit", minute: "2-digit", second: "2-digit",
                });
                return (
                  <div
                    key={log.id}
                    className="group flex items-start gap-3 rounded-lg px-2 py-1 transition hover:bg-white/[0.03]"
                  >
                    {/* Numéro de ligne */}
                    <span className="mt-0.5 w-6 shrink-0 select-none text-right text-xs tabular-nums text-slate-700">
                      {i + 1}
                    </span>
                    {/* Timestamp */}
                    <span className="mt-0.5 shrink-0 text-xs tabular-nums text-slate-600">
                      {time}
                    </span>
                    {/* Badge niveau */}
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-bold font-mono tabular-nums ${cfg.badgeBg} ${cfg.badgeText}`}>
                      {cfg.label}
                    </span>
                    {/* Message */}
                    <span className={`leading-relaxed ${cfg.lineColor}`}>
                      {log.message}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Terminal className="mb-2 h-6 w-6 text-slate-700" />
              <p className="text-sm text-slate-600">Aucun log correspondant au filtre.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
