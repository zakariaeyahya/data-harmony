import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, Globe, Trash2 } from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

const sourceLabels: Record<string, string> = {
  FILE_CSV: "CSV", FILE_JSON: "JSON", FILE_EXCEL: "Excel", DATABASE: "BDD", API: "API",
};

const DatasetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dataset = mockData.datasets.find((d) => d.id === id);
  const [showApi, setShowApi] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!dataset) return <p className="text-muted-foreground">Dataset introuvable.</p>;

  const owner = mockData.users.find((u) => u.id === dataset.user_id);
  const columns = dataset.columns as Array<{ id: string; name: string; data_type: string; is_nullable: boolean }>;
  const preview = dataset.preview as Array<Record<string, unknown>>;

  return (
    <div className="space-y-6">
      <Link to="/datasets" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>

      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-foreground">{dataset.name}</h2>
        <StatusBadge status={dataset.status} />
      </div>

      <p className="text-sm text-muted-foreground">{dataset.description}</p>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 rounded-lg border bg-card p-5">
        {[
          ["Propriétaire", owner?.email || "—"],
          ["Source", sourceLabels[dataset.source_type] || dataset.source_type],
          ["Créé le", new Date(dataset.created_at).toLocaleDateString("fr-FR")],
          ["Mis à jour", new Date(dataset.updated_at).toLocaleDateString("fr-FR")],
          ["Lignes", dataset.row_count.toLocaleString()],
          ["Colonnes", dataset.column_count.toString()],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Schema */}
      {columns.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold text-foreground">Schéma</h3>
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-5 py-2 font-medium">Colonne</th>
                  <th className="px-5 py-2 font-medium">Type</th>
                  <th className="px-5 py-2 font-medium">Nullable</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="px-5 py-2 font-medium text-foreground">{c.name}</td>
                    <td className="px-5 py-2 text-muted-foreground">{c.data_type}</td>
                    <td className="px-5 py-2 text-muted-foreground">{c.is_nullable ? "Oui" : "Non"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview */}
      <div>
        <h3 className="mb-2 font-semibold text-foreground">Aperçu (10 premières lignes)</h3>
        {preview.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  {Object.keys(preview[0]).map((k) => (
                    <th key={k} className="px-5 py-2 font-medium">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="px-5 py-2 text-foreground">{String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun aperçu disponible.</p>
        )}
      </div>

      {/* API block */}
      {showApi && (
        <div className="rounded-lg bg-terminal-bg p-4 font-mono text-sm text-terminal-fg">
          GET /api/v1/datasets/{dataset.id}/data
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => toast.success("Téléchargement simulé")}
          className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Download className="h-4 w-4" /> Télécharger CSV
        </button>
        <button
          onClick={() => setShowApi(!showApi)}
          className="flex items-center gap-1.5 rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Globe className="h-4 w-4" /> Endpoint API
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
        >
          <Trash2 className="h-4 w-4" /> Supprimer
        </button>
      </div>

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-xl">
            <h3 className="mb-2 font-semibold text-foreground">Confirmer la suppression</h3>
            <p className="text-sm text-muted-foreground">Voulez-vous vraiment supprimer « {dataset.name} » ?</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => { setConfirmDelete(false); navigate("/datasets"); }}
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetDetailPage;
