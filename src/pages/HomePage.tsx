import { Link } from "react-router-dom";
import { Database, GitBranch, AlertTriangle } from "lucide-react";
import mockData from "@/mockData.json";
import StatusBadge from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const HomePage = () => {
  const datasetCount = mockData.datasets.length;
  const runningCount = mockData.pipelines.filter((p) => p.status === "RUNNING").length;
  const errorCount = mockData.pipelines.filter((p) => p.status === "FAILED").length;

  const recentDatasets = [...mockData.datasets]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);

  const recentPipelines = mockData.pipelines.slice(0, 2);

  const stats = [
    { label: "Datasets", value: datasetCount, icon: Database, color: "text-primary" },
    { label: "Pipelines actifs", value: runningCount, icon: GitBranch, color: "text-warning" },
    { label: "Erreurs", value: errorCount, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent datasets */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="font-semibold text-foreground">Datasets récents</h2>
          <Link to="/datasets" className="text-sm text-primary hover:underline">Voir tous les datasets</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="px-5 py-2 font-medium">Nom</th>
              <th className="px-5 py-2 font-medium">Statut</th>
              <th className="px-5 py-2 font-medium">Mis à jour</th>
            </tr>
          </thead>
          <tbody>
            {recentDatasets.map((d) => (
              <tr key={d.id} className="border-b last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{d.name}</td>
                <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-5 py-3 text-muted-foreground">
                  {formatDistanceToNow(new Date(d.updated_at), { addSuffix: true, locale: fr })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent pipelines */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-5 py-3">
          <h2 className="font-semibold text-foreground">Pipelines récents</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="px-5 py-2 font-medium">Pipeline</th>
              <th className="px-5 py-2 font-medium">Statut</th>
              <th className="px-5 py-2 font-medium">Durée</th>
            </tr>
          </thead>
          <tbody>
            {recentPipelines.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">Pipeline #{p.id} — {p.dataset_name}</td>
                <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-3 text-muted-foreground">{p.duration || "En cours"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
