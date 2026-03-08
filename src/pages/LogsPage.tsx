import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, RefreshCw, Download,
  Info, AlertTriangle, XCircle,
  Search, Terminal,
} from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

const LEVEL_OPTIONS = ["Tous", "Info", "Warning", "Erreur"];
const levelMap: Record<string, string> = { Info: "INFO", Warning: "WARNING", Erreur: "ERROR" };

const levelConfig: Record<string, { label: string; bgColor: string; textColor: string; lineColor: string }> = {
  INFO:    { label: "INFO", bgColor: "bg-blue-500/15",        textColor: "text-blue-600",    lineColor: "text-terminal-fg"  },
  WARNING: { label: "WARN", bgColor: "bg-amber-500/15",       textColor: "text-amber-600",   lineColor: "text-amber-400"    },
  ERROR:   { label: "ERR",  bgColor: "bg-destructive/15",     textColor: "text-destructive", lineColor: "text-red-400"      },
};

type LogEntry = { id: string; level: string; message: string; timestamp: string };

const LogsPage = () => {
  const { id } = useParams();
  const pipeline = mockData.pipelines.find((p) => p.id === id);
  const logs = (mockData.pipeline_logs as Record<string, LogEntry[]>)[id ?? ""] ?? [];

  const [levelFilter, setLevelFilter] = useState("Tous");
  const [search, setSearch] = useState("");

  if (!pipeline) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-muted-foreground">Pipeline introuvable.</p>
      <Link to="/pipelines" className="mt-4 text-sm text-primary hover:underline">
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
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux pipelines
      </Link>

      {/* ── En-tête + Actions ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Pipeline #{pipeline.id}</h2>
            <StatusBadge status={pipeline.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{pipeline.dataset_name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pipeline.status === "FAILED" && (
            <button
              onClick={() => toast.success("Pipeline relancé")}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-blue-500 hover:to-indigo-500"
            >
              <RefreshCw className="h-4 w-4" /> Relancer
            </button>
          )}
          <button
            onClick={() => toast.success("Téléchargement simulé")}
            className="flex items-center gap-1.5 rounded-xl border border-input px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
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
          <div key={label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Compteurs par niveau ── */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-700">
          <Info className="h-3 w-3" /> {infoCount} info
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700">
          <AlertTriangle className="h-3 w-3" /> {warnCount} warning
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
          <XCircle className="h-3 w-3" /> {errCount} erreur
        </span>
      </div>

      {/* ── Filtres ── */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Niveau :</span>
          {LEVEL_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setLevelFilter(opt)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                levelFilter === opt
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans les logs..."
            className="rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>

      {/* ── Terminal ── */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-terminal-bg shadow-lg">
        {/* Barre du terminal */}
        <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-800/60 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-amber-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <Terminal className="ml-2 h-3.5 w-3.5 text-terminal-fg/40" />
          <span className="text-xs text-terminal-fg/40">pipeline-{id}.log</span>
          <span className="ml-auto text-xs text-terminal-fg/30">
            {filtered.length} entrée{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Contenu */}
        <div className="max-h-[480px] overflow-y-auto p-4 font-mono text-sm">
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
                    className="group flex items-start gap-3 rounded px-2 py-1 transition hover:bg-white/5"
                  >
                    <span className="mt-0.5 w-5 shrink-0 select-none text-right text-xs text-terminal-fg/25 tabular-nums">
                      {i + 1}
                    </span>
                    <span className="mt-0.5 shrink-0 text-xs text-terminal-fg/40 tabular-nums">
                      {time}
                    </span>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-bold tabular-nums ${cfg.bgColor} ${cfg.textColor}`}>
                      {cfg.label}
                    </span>
                    <span className={`leading-relaxed ${cfg.lineColor}`}>
                      {log.message}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-terminal-fg/40">Aucun log correspondant au filtre.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
