import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, X, Database, ChevronRight, Clock } from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const sourceLabels: Record<string, string> = {
  FILE_CSV: "CSV", FILE_JSON: "JSON", FILE_EXCEL: "Excel", DATABASE: "BDD", API: "API",
};

const sourceStyles: Record<string, string> = {
  FILE_CSV:    "bg-emerald-500/10 text-emerald-700",
  FILE_JSON:   "bg-blue-500/10 text-blue-700",
  FILE_EXCEL:  "bg-green-500/10 text-green-700",
  DATABASE:    "bg-purple-500/10 text-purple-700",
  API:         "bg-orange-500/10 text-orange-700",
};

const statusFilterMap: Record<string, string> = {
  "Prêt": "READY", "En cours": "PROCESSING", "Erreur": "ERROR", "En attente": "PENDING",
};

const STATUS_OPTIONS = ["Tous", "Prêt", "En cours", "Erreur", "En attente"];
const SOURCE_OPTIONS = ["Tous", "CSV", "JSON", "Excel", "BDD", "API"];

const DatasetsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sourceFilter, setSourceFilter] = useState("Tous");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const perPage = 6;

  let filtered = mockData.datasets.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  if (statusFilter !== "Tous") filtered = filtered.filter((d) => d.status === statusFilterMap[statusFilter]);
  if (sourceFilter !== "Tous") {
    const sourceKey = Object.entries(sourceLabels).find(([, v]) => v === sourceFilter)?.[0];
    if (sourceKey) filtered = filtered.filter((d) => d.source_type === sourceKey);
  }

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">

      {/* ── En-tête ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Datasets</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {mockData.datasets.length} sources de données
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500"
        >
          <Plus className="h-4 w-4" /> Ajouter un dataset
        </button>
      </div>

      {/* ── Recherche + Filtres ── */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un dataset..."
            className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Statut :</span>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => { setStatusFilter(opt); setPage(1); }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  statusFilter === opt
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Source :</span>
            {SOURCE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => { setSourceFilter(opt); setPage(1); }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  sourceFilter === opt
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-muted-foreground">
              <th className="px-5 py-3 font-medium">Nom</th>
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">Lignes</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium">Mis à jour</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => navigate(`/datasets/${d.id}`)}
                  className="group cursor-pointer border-b last:border-0 transition hover:bg-muted/40"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium text-foreground">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sourceStyles[d.source_type] ?? "bg-muted text-muted-foreground"}`}>
                      {sourceLabels[d.source_type] ?? d.source_type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                    {d.row_count.toLocaleString("fr-FR")}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      {formatDistanceToNow(new Date(d.updated_at), { addSuffix: true, locale: fr })}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Aucun dataset ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition ${
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl ring-1 ring-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Ajouter un dataset</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Connectez une nouvelle source de données
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              Fonctionnalité bientôt disponible.
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetsPage;
