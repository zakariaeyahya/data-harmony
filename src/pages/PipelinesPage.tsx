import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, RefreshCw, X, CheckCircle, XCircle, Clock, Circle } from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  SUCCESS: "bg-success", FAILED: "bg-destructive", RUNNING: "bg-warning", QUEUED: "bg-muted-foreground",
};

const statusFilterMap: Record<string, string> = {
  "Succès": "SUCCESS", "Échec": "FAILED", "En cours": "RUNNING", "En attente": "QUEUED",
};

const PipelinesPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [page, setPage] = useState(1);
  const perPage = 3;

  let filtered = mockData.pipelines;
  if (statusFilter !== "Tous") {
    filtered = filtered.filter((p) => p.status === statusFilterMap[statusFilter]);
  }

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
        >
          {["Tous", "Succès", "Échec", "En cours", "En attente"].map((o) => <option key={o}>{o}</option>)}
        </select>
        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none">
          <option>Aujourd'hui</option>
          <option>Cette semaine</option>
        </select>
      </div>

      <div className="space-y-4">
        {paginated.map((p) => (
          <div key={p.id} className="rounded-lg border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${statusColors[p.status]}`} />
                <div>
                  <p className="font-semibold text-foreground">Pipeline #{p.id}</p>
                  <p className="text-sm text-muted-foreground">{p.dataset_name}</p>
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              {p.started_at && <span>Début : {new Date(p.started_at).toLocaleString("fr-FR")}</span>}
              <span>Durée : {p.duration || "En cours"}</span>
            </div>

            {/* Steps */}
            {p.steps.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.steps.map((s) => (
                  <span key={s.order} className="flex items-center gap-1 text-xs text-muted-foreground">
                    {s.done ? (
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                    ) : p.status === "RUNNING" && !s.done && p.steps.findIndex((x) => !x.done) === p.steps.indexOf(s) ? (
                      <Clock className="h-3.5 w-3.5 text-warning" />
                    ) : (
                      <Circle className="h-3.5 w-3.5" />
                    )}
                    {s.label}
                  </span>
                ))}
              </div>
            )}

            {/* Progress bar */}
            {p.status === "RUNNING" && (p as any).progress != null && (
              <div className="mt-3">
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-warning transition-all" style={{ width: `${(p as any).progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{(p as any).progress}%</p>
              </div>
            )}

            {/* Error */}
            {p.error_message && (
              <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{p.error_message}</p>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/logs/${p.id}`)}
                className="flex items-center gap-1 rounded-md border border-input px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                <Eye className="h-3.5 w-3.5" /> Voir logs
              </button>
              {(p.status === "SUCCESS" || p.status === "FAILED") && (
                <button
                  onClick={() => toast.success("Pipeline relancé")}
                  className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Relancer
                </button>
              )}
              {(p.status === "RUNNING" || p.status === "QUEUED") && (
                <button
                  onClick={() => toast.info("Pipeline annulé")}
                  className="flex items-center gap-1 rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
                >
                  <X className="h-3.5 w-3.5" /> Annuler
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setPage(pg)}
              className={`rounded-md px-3 py-1 text-sm ${pg === page ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
            >
              {pg}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PipelinesPage;
