const statusMap: Record<string, { label: string; classes: string }> = {
  READY:      { label: "Prêt",       classes: "bg-success/15 text-success" },
  PROCESSING: { label: "En cours",   classes: "bg-warning/15 text-warning" },
  ERROR:      { label: "Erreur",     classes: "bg-destructive/15 text-destructive" },
  PENDING:    { label: "En attente", classes: "bg-muted text-muted-foreground" },
  SUCCESS:    { label: "Succès",     classes: "bg-success/15 text-success" },
  FAILED:     { label: "Échec",      classes: "bg-destructive/15 text-destructive" },
  RUNNING:    { label: "En cours",   classes: "bg-warning/15 text-warning" },
  QUEUED:     { label: "En attente", classes: "bg-muted text-muted-foreground" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = statusMap[status] || { label: status, classes: "bg-muted text-muted-foreground" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.classes}`}>
      {s.label}
    </span>
  );
};

export default StatusBadge;
