import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, Globe, Trash2, X, Code } from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

const sourceLabels: Record<string, string> = {
  FILE_CSV: "CSV", FILE_JSON: "JSON", FILE_EXCEL: "Excel", DATABASE: "BDD", API: "API",
};

const typeStyles: Record<string, string> = {
  INTEGER:   "bg-blue-500/10 text-blue-700",
  STRING:    "bg-emerald-500/10 text-emerald-700",
  FLOAT:     "bg-amber-500/10 text-amber-700",
  DATE:      "bg-purple-500/10 text-purple-700",
  TIMESTAMP: "bg-indigo-500/10 text-indigo-700",
};

const DatasetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dataset = mockData.datasets.find((d) => d.id === id);
  const [showApi, setShowApi] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!dataset) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-muted-foreground">Dataset introuvable.</p>
      <Link to="/datasets" className="mt-4 text-sm text-primary hover:underline">
        Retour aux datasets
      </Link>
    </div>
  );

  const owner = mockData.users.find((u) => u.id === dataset.user_id);
  const columns = dataset.columns as Array<{ id: string; name: string; data_type: string; is_nullable: boolean }>;
  const preview = dataset.preview as Array<Record<string, unknown>>;

  const meta = [
    { label: "Propriétaire", value: owner?.email ?? "—" },
    { label: "Source",        value: sourceLabels[dataset.source_type] ?? dataset.source_type },
    { label: "Créé le",       value: new Date(dataset.created_at).toLocaleDateString("fr-FR") },
    { label: "Mis à jour",    value: new Date(dataset.updated_at).toLocaleDateString("fr-FR") },
    { label: "Lignes",        value: dataset.row_count.toLocaleString("fr-FR") },
    { label: "Colonnes",      value: dataset.column_count.toString() },
  ];

  return (
    <div className="space-y-6">

      {/* ── Retour ── */}
      <Link
        to="/datasets"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux datasets
      </Link>

      {/* ── En-tête + Actions ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">{dataset.name}</h2>
            <StatusBadge status={dataset.status} />
          </div>
          {dataset.description && (
            <p className="mt-1.5 text-sm text-muted-foreground">{dataset.description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toast.success("Téléchargement simulé")}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500"
          >
            <Download className="h-4 w-4" /> Télécharger CSV
          </button>
          <button
            onClick={() => setShowApi(!showApi)}
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition ${
              showApi
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-input text-foreground hover:bg-muted"
            }`}
          >
            <Globe className="h-4 w-4" /> Endpoint API
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/20"
          >
            <Trash2 className="h-4 w-4" /> Supprimer
          </button>
        </div>
      </div>

      {/* ── API endpoint ── */}
      {showApi && (
        <div className="flex items-start gap-3 rounded-xl bg-terminal-bg p-4 font-mono text-sm">
          <Code className="mt-0.5 h-4 w-4 shrink-0 text-terminal-fg/40" />
          <code className="text-terminal-fg">GET /api/v1/datasets/{dataset.id}/data</code>
        </div>
      )}

      {/* ── Métadonnées ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {meta.map(({ label, value }) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 truncate text-sm font-medium text-foreground" title={value}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Schéma ── */}
      {columns.length > 0 && (
        <div>
          <h3 className="mb-3 font-semibold text-foreground">Schéma</h3>
          <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Colonne</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Nullable</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 transition hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyles[c.data_type] ?? "bg-muted text-muted-foreground"}`}>
                        {c.data_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {c.is_nullable ? "Oui" : "Non"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Aperçu ── */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Aperçu des données</h3>
        {preview.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                  {Object.keys(preview[0]).map((k) => (
                    <th key={k} className="px-5 py-3 font-medium">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className={`border-b last:border-0 ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="px-5 py-2.5 text-foreground">{String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
            Aucun aperçu disponible pour ce dataset.
          </div>
        )}
      </div>

      {/* ── Modal suppression ── */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl ring-1 ring-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-foreground">Confirmer la suppression</h3>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Voulez-vous vraiment supprimer{" "}
              <strong className="text-foreground">« {dataset.name} »</strong> ?{" "}
              Cette action est irréversible.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => { setConfirmDelete(false); navigate("/datasets"); }}
                className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-medium text-destructive-foreground transition hover:bg-destructive/90"
              >
                Supprimer
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border border-input py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
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
