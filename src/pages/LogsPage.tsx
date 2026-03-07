import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Download, Info, AlertTriangle, XCircle } from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

const levelConfig: Record<string, { icon: typeof Info; color: string; symbol: string }> = {
  INFO:    { icon: Info,           color: "text-info",        symbol: "ℹ" },
  WARNING: { icon: AlertTriangle,  color: "text-warning",     symbol: "⚠" },
  ERROR:   { icon: XCircle,        color: "text-destructive", symbol: "✕" },
};

const LogsPage = () => {
  const { id } = useParams();
  const pipeline = mockData.pipelines.find((p) => p.id === id);
  const logs = (mockData.pipeline_logs as Record<string, Array<{ id: string; level: string; message: string; timestamp: string }>>)[id || ""] || [];

  const [levelFilter, setLevelFilter] = useState("Tous");
  const [search, setSearch] = useState("");

  if (!pipeline) return <p className="text-muted-foreground">Pipeline introuvable.</p>;

  const levelMap: Record<string, string> = { "Info": "INFO", "Warning": "WARNING", "Erreur": "ERROR" };

  let filtered = logs;
  if (levelFilter !== "Tous") filtered = filtered.filter((l) => l.level === levelMap[levelFilter]);
  if (search) filtered = filtered.filter((l) => l.message.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <Link to="/pipelines" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Retour aux pipelines
      </Link>

      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-foreground">Pipeline #{pipeline.id}</h2>
        <StatusBadge status={pipeline.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-lg border bg-card p-5 text-sm">
        <div><p className="text-xs text-muted-foreground">Dataset</p><p className="font-medium text-foreground">{pipeline.dataset_name}</p></div>
        <div><p className="text-xs text-muted-foreground">Début</p><p className="font-medium text-foreground">{pipeline.started_at ? new Date(pipeline.started_at).toLocaleString("fr-FR") : "—"}</p></div>
        <div><p className="text-xs text-muted-foreground">Fin</p><p className="font-medium text-foreground">{pipeline.finished_at ? new Date(pipeline.finished_at).toLocaleString("fr-FR") : "—"}</p></div>
        <div><p className="text-xs text-muted-foreground">Durée</p><p className="font-medium text-foreground">{pipeline.duration || "—"}</p></div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
        >
          {["Tous", "Info", "Warning", "Erreur"].map((o) => <option key={o}>{o}</option>)}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher dans les logs..."
          className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Logs terminal */}
      <div className="max-h-[420px] overflow-y-auto rounded-lg bg-terminal-bg p-4 font-mono text-sm">
        {filtered.length > 0 ? (
          filtered.map((log) => {
            const cfg = levelConfig[log.level] || levelConfig.INFO;
            const time = new Date(log.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            return (
              <div key={log.id} className="flex gap-2 py-0.5">
                <span className="text-muted-foreground">{time}</span>
                <span className={cfg.color}>{cfg.symbol}</span>
                <span className="text-terminal-fg">{log.message}</span>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground">Aucun log disponible.</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {pipeline.status === "FAILED" && (
          <button
            onClick={() => toast.success("Pipeline relancé")}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" /> Relancer le pipeline
          </button>
        )}
        <button
          onClick={() => toast.success("Téléchargement simulé")}
          className="flex items-center gap-1.5 rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Download className="h-4 w-4" /> Télécharger les logs
        </button>
      </div>
    </div>
  );
};

export default LogsPage;
