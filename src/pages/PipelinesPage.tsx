import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, RefreshCw, X, CheckCircle, Clock, Circle, GitBranch } from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

const statusFilterMap: Record<string, string> = {
  "Succès": "SUCCESS", "Échec": "FAILED", "En cours": "RUNNING", "En attente": "QUEUED",
};

const STATUS_OPTIONS = ["Tous", "Succès", "Échec", "En cours", "En attente"];

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

  const counts = {
    total:   mockData.pipelines.length,
    running: mockData.pipelines.filter((p) => p.status === "RUNNING").length,
    failed:  mockData.pipelines.filter((p) => p.status === "FAILED").length,
    success: mockData.pipelines.filter((p) => p.status === "SUCCESS").length,
  };

  return (
    <div className="space-y-6">

      {/* ── En-tête ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Pipelines</h1>
        <div className="mt-1 flex flex-wrap gap-3 text-sm">
          <span className="text-slate-500">{counts.total} total</span>
          <span className="text-amber-400">{counts.running} en cours</span>
          <span className="text-red-400">{counts.failed} en échec</span>
          <span className="text-emerald-400">{counts.success} réussis</span>
        </div>
      </div>

      {/* ── Filtres pills ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-600">Statut :</span>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => { setStatusFilter(opt); setPage(1); }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              statusFilter === opt
                ? "bg-blue-600/30 text-blue-300 ring-1 ring-blue-500/40"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* ── Cards pipelines ── */}
      <div className="space-y-4">
        {paginated.length > 0 ? (
          paginated.map((p) => {
            const activeStepIndex = p.steps.findIndex((s) => !s.done);

            const iconBg =
              p.status === "RUNNING" ? "bg-amber-500/15" :
              p.status === "SUCCESS" ? "bg-emerald-500/15" :
              p.status === "FAILED"  ? "bg-red-500/15" :
              "bg-slate-700/50";

            const iconColor =
              p.status === "RUNNING" ? "text-amber-400" :
              p.status === "SUCCESS" ? "text-emerald-400" :
              p.status === "FAILED"  ? "text-red-400" :
              "text-slate-500";

            return (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl transition hover:border-slate-700"
              >
                {/* ── Card header ── */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                      <GitBranch className={`h-4.5 w-4.5 ${iconColor}`} />
                      {p.status === "RUNNING" && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                          <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-75" />
                          <span className="relative h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">Pipeline #{p.id}</p>
                      <p className="text-sm text-slate-500">{p.dataset_name}</p>
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                {/* ── Meta ── */}
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                  {p.started_at && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {new Date(p.started_at).toLocaleString("fr-FR")}
                    </span>
                  )}
                  <span>Durée : {p.duration ?? "En cours"}</span>
                </div>

                {/* ── Steps timeline ── */}
                {p.steps.length > 0 && (
                  <div className="mt-5 flex items-start">
                    {p.steps.map((s, i) => {
                      const isActive = p.status === "RUNNING" && i === activeStepIndex;
                      return (
                        <div key={s.order} className="flex flex-1 items-start">
                          <div className="flex flex-col items-center">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                              s.done    ? "border-emerald-500  bg-emerald-500/15" :
                              isActive  ? "border-amber-500   bg-amber-500/15"   :
                                          "border-slate-700   bg-slate-800"
                            }`}>
                              {s.done ? (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                              ) : isActive ? (
                                <Clock className="h-3.5 w-3.5 text-amber-400" />
                              ) : (
                                <Circle className="h-3.5 w-3.5 text-slate-600" />
                              )}
                            </div>
                            <span className="mt-1.5 max-w-[72px] text-center text-xs leading-tight text-slate-500">
                              {s.label}
                            </span>
                          </div>
                          {i < p.steps.length - 1 && (
                            <div className={`mt-3.5 h-px flex-1 mx-1 ${s.done ? "bg-emerald-500/40" : "bg-slate-700"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── Progress bar (RUNNING) ── */}
                {"progress" in p && p.status === "RUNNING" && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Progression globale</span>
                      <span className="text-xs font-semibold text-amber-400">
                        {(p as { progress: number }).progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all"
                        style={{ width: `${(p as { progress: number }).progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* ── Error message ── */}
                {p.error_message && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5">
                    <p className="text-xs text-red-400">{p.error_message}</p>
                  </div>
                )}

                {/* ── Actions ── */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
                  <button
                    onClick={() => navigate(`/logs/${p.id}`)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
                  >
                    <Eye className="h-3.5 w-3.5" /> Voir les logs
                  </button>
                  {(p.status === "SUCCESS" || p.status === "FAILED") && (
                    <button
                      onClick={() => toast.success("Pipeline relancé")}
                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:from-blue-500 hover:to-indigo-500"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Relancer
                    </button>
                  )}
                  {(p.status === "RUNNING" || p.status === "QUEUED") && (
                    <button
                      onClick={() => toast.info("Pipeline annulé")}
                      className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                    >
                      <X className="h-3.5 w-3.5" /> Annuler
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 py-16 text-center">
            <GitBranch className="mb-3 h-8 w-8 text-slate-700" />
            <p className="text-sm text-slate-500">Aucun pipeline ne correspond au filtre sélectionné.</p>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setPage(pg)}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition ${
                pg === page
                  ? "bg-blue-600 text-white shadow shadow-blue-500/30"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
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
