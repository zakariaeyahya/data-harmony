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
  FILE_CSV:   "bg-emerald-500/20 text-emerald-300",
  FILE_JSON:  "bg-blue-500/20    text-blue-300",
  FILE_EXCEL: "bg-green-500/20   text-green-300",
  DATABASE:   "bg-purple-500/20  text-purple-300",
  API:        "bg-orange-500/20  text-orange-300",
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
          <h1 className="text-2xl font-bold text-white">Datasets</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {mockData.datasets.length} sources de données
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500"
        >
          <Plus className="h-4 w-4" /> Ajouter un dataset
        </button>
      </div>

      {/* ── Recherche + Filtres ── */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un dataset..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-600">Source :</span>
            {SOURCE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => { setSourceFilter(opt); setPage(1); }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  sourceFilter === opt
                    ? "bg-blue-600/30 text-blue-300 ring-1 ring-blue-500/40"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nom</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Source</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Lignes</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Statut</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Mis à jour</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {paginated.length > 0 ? (
              paginated.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => navigate(`/datasets/${d.id}`)}
                  className="group cursor-pointer transition hover:bg-slate-800/60"
                >
                  {/* Nom */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/15">
                        <Database className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{d.name}</p>
                        <p className="mt-0.5 text-xs text-slate-600 line-clamp-1">{d.description}</p>
                      </div>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sourceStyles[d.source_type] ?? "bg-slate-700 text-slate-400"}`}>
                      {sourceLabels[d.source_type] ?? d.source_type}
                    </span>
                  </td>

                  {/* Lignes */}
                  <td className="px-5 py-4 tabular-nums text-slate-400">
                    {d.row_count.toLocaleString("fr-FR")}
                  </td>

                  {/* Statut */}
                  <td className="px-5 py-4">
                    <StatusBadge status={d.status} />
                  </td>

                  {/* Mis à jour */}
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="h-3 w-3 shrink-0" />
                      {formatDistanceToNow(new Date(d.updated_at), { addSuffix: true, locale: fr })}
                    </span>
                  </td>

                  {/* Arrow */}
                  <td className="px-5 py-4">
                    <ChevronRight className="h-4 w-4 text-slate-600 opacity-0 transition group-hover:opacity-100" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <Database className="mx-auto mb-3 h-8 w-8 text-slate-700" />
                  <p className="text-sm text-slate-500">Aucun dataset ne correspond à votre recherche.</p>
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
                  ? "bg-blue-600 text-white shadow shadow-blue-500/30"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Ajouter un dataset</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Connectez une nouvelle source de données
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-slate-400">
              Fonctionnalité bientôt disponible.
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-medium text-white transition hover:from-blue-500 hover:to-indigo-500"
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
