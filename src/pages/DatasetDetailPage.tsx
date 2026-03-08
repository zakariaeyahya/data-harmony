import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, Globe, Trash2, X, Code, User, Database, Calendar, Hash } from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

const sourceLabels: Record<string, string> = {
  FILE_CSV: "CSV", FILE_JSON: "JSON", FILE_EXCEL: "Excel", DATABASE: "BDD", API: "API",
};

const typeStyles: Record<string, string> = {
  INTEGER:   "bg-blue-500/20   text-blue-300",
  STRING:    "bg-emerald-500/20 text-emerald-300",
  FLOAT:     "bg-amber-500/20  text-amber-300",
  DATE:      "bg-purple-500/20 text-purple-300",
  TIMESTAMP: "bg-indigo-500/20 text-indigo-300",
};

const DatasetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dataset = mockData.datasets.find((d) => d.id === id);
  const [showApi, setShowApi] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!dataset) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Database className="mb-3 h-10 w-10 text-slate-700" />
      <p className="text-slate-500">Dataset introuvable.</p>
      <Link to="/datasets" className="mt-4 text-sm text-blue-400 hover:text-blue-300">
        Retour aux datasets
      </Link>
    </div>
  );

  const owner = mockData.users.find((u) => u.id === dataset.user_id);
  const columns = dataset.columns as Array<{ id: string; name: string; data_type: string; is_nullable: boolean }>;
  const preview = dataset.preview as Array<Record<string, unknown>>;

  const meta = [
    { label: "Propriétaire", value: owner?.email ?? "—",                                          icon: User },
    { label: "Source",        value: sourceLabels[dataset.source_type] ?? dataset.source_type,    icon: Database },
    { label: "Créé le",       value: new Date(dataset.created_at).toLocaleDateString("fr-FR"),    icon: Calendar },
    { label: "Mis à jour",    value: new Date(dataset.updated_at).toLocaleDateString("fr-FR"),    icon: Calendar },
    { label: "Lignes",        value: dataset.row_count.toLocaleString("fr-FR"),                   icon: Hash },
    { label: "Colonnes",      value: dataset.column_count.toString(),                             icon: Hash },
  ];

  return (
    <div className="space-y-6">

      {/* ── Retour ── */}
      <Link
        to="/datasets"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux datasets
      </Link>

      {/* ── En-tête + Actions ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-white">{dataset.name}</h2>
            <StatusBadge status={dataset.status} />
          </div>
          {dataset.description && (
            <p className="mt-1.5 text-sm text-slate-500">{dataset.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toast.success("Téléchargement simulé")}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500"
          >
            <Download className="h-4 w-4" /> Télécharger CSV
          </button>
          <button
            onClick={() => setShowApi(!showApi)}
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition ${
              showApi
                ? "border-blue-500/40 bg-blue-600/20 text-blue-300"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white"
            }`}
          >
            <Globe className="h-4 w-4" /> Endpoint API
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4" /> Supprimer
          </button>
        </div>
      </div>

      {/* ── API endpoint ── */}
      {showApi && (
        <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-sm">
          <Code className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
          <code className="text-slate-300">GET /api/v1/datasets/{dataset.id}/data</code>
        </div>
      )}

      {/* ── Métadonnées ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {meta.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-1.5">
              <Icon className="h-3 w-3 text-slate-600" />
              <p className="text-xs text-slate-500">{label}</p>
            </div>
            <p className="mt-1.5 truncate text-sm font-semibold text-slate-200" title={value}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Schéma ── */}
      {columns.length > 0 && (
        <div>
          <h3 className="mb-3 font-semibold text-white">Schéma</h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Colonne</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nullable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {columns.map((c) => (
                  <tr key={c.id} className="transition hover:bg-slate-800/60">
                    <td className="px-5 py-3.5 font-medium text-slate-200">{c.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyles[c.data_type] ?? "bg-slate-700 text-slate-400"}`}>
                        {c.data_type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium ${c.is_nullable ? "text-amber-400" : "text-slate-500"}`}>
                        {c.is_nullable ? "Oui" : "Non"}
                      </span>
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
        <h3 className="mb-3 font-semibold text-white">Aperçu des données</h3>
        {preview.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {Object.keys(preview[0]).map((k) => (
                    <th key={k} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {preview.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-slate-800/30" : ""}>
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="px-5 py-3 text-slate-300">{String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 py-12 text-center">
            <Database className="mb-2 h-7 w-7 text-slate-700" />
            <p className="text-sm text-slate-500">Aucun aperçu disponible pour ce dataset.</p>
          </div>
        )}
      </div>

      {/* ── Modal suppression ── */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-white">Confirmer la suppression</h3>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Voulez-vous vraiment supprimer{" "}
              <strong className="text-white">« {dataset.name} »</strong> ?{" "}
              Cette action est irréversible.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => { setConfirmDelete(false); navigate("/datasets"); }}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
              >
                Supprimer
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
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
