import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, X } from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const sourceLabels: Record<string, string> = {
  FILE_CSV: "CSV", FILE_JSON: "JSON", FILE_EXCEL: "Excel", DATABASE: "BDD", API: "API",
};

const statusFilterMap: Record<string, string> = {
  "Prêt": "READY", "En cours": "PROCESSING", "Erreur": "ERROR", "En attente": "PENDING",
};

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

  if (statusFilter !== "Tous") {
    filtered = filtered.filter((d) => d.status === statusFilterMap[statusFilter]);
  }

  if (sourceFilter !== "Tous") {
    const sourceKey = Object.entries(sourceLabels).find(([, v]) => v === sourceFilter)?.[0];
    if (sourceKey) filtered = filtered.filter((d) => d.source_type === sourceKey);
  }

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher un dataset..."
            className="rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Ajouter dataset
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
        >
          {["Tous", "Prêt", "En cours", "Erreur", "En attente"].map((o) => <option key={o}>{o}</option>)}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
        >
          {["Tous", "CSV", "JSON", "Excel", "BDD", "API"].map((o) => <option key={o}>{o}</option>)}
        </select>
        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none">
          <option>Tous</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="px-5 py-3 font-medium">Nom</th>
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">Lignes</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium">MAJ</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((d) => (
              <tr
                key={d.id}
                onClick={() => navigate(`/datasets/${d.id}`)}
                className="cursor-pointer border-b last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="px-5 py-3 font-medium text-foreground">{d.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{sourceLabels[d.source_type] || d.source_type}</td>
                <td className="px-5 py-3 text-muted-foreground">{d.row_count.toLocaleString()}</td>
                <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-5 py-3 text-muted-foreground">
                  {formatDistanceToNow(new Date(d.updated_at), { addSuffix: true, locale: fr })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-md px-3 py-1 text-sm ${p === page ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Ajouter un dataset</h3>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <p className="text-sm text-muted-foreground">Fonctionnalité bientôt disponible</p>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
