import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Database, Mail, Lock, Eye, EyeOff, BarChart3, GitBranch, Layers } from "lucide-react";
import mockData from "@/mockData.json";

const FEATURES = [
  { icon: BarChart3, title: "Analyse en temps réel", desc: "Tableaux de bord interactifs" },
  { icon: GitBranch, title: "Pipelines de données", desc: "ETL automatisé et orchestré" },
  { icon: Layers, title: "Multi-sources", desc: "Connecteurs natifs intégrés" },
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    if (email === "marie@exemple.com" && password === "admin123") {
      localStorage.setItem("dataplatform_user", JSON.stringify(mockData.currentUser));
      navigate("/home");
    } else {
      setError("Email ou mot de passe incorrect.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">

      {/* ── Panneau gauche – Branding ── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-16">
        {/* Fond dégradé */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/10 via-slate-900 to-indigo-700/15" />
        {/* Grille décorative */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Orbes lumineux */}
        <div className="pointer-events-none absolute -top-10 left-10 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

        {/* Contenu */}
        <div className="relative z-10 max-w-sm w-full">
          {/* Logo + Nom */}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
              <Database className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Data Harmony Hub</span>
          </div>

          {/* Accroche */}
          <h1 className="text-4xl font-bold leading-tight text-white">
            Vos données,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              parfaitement orchestrées.
            </span>
          </h1>
          <p className="mt-4 text-slate-400 leading-relaxed text-sm">
            Centralisez, transformez et analysez vos flux de données en temps réel sur une seule plateforme.
          </p>

          {/* Fonctionnalités */}
          <div className="mt-10 space-y-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15">
                  <Icon className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panneau droit – Formulaire ── */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <Database className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Data Harmony Hub</span>
          </div>

          {/* Carte */}
          <div className="rounded-2xl bg-slate-800 p-8 shadow-2xl ring-1 ring-slate-700">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Bon retour !</h2>
              <p className="mt-1 text-sm text-slate-400">
                Connectez-vous à votre espace de travail
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="email@exemple.com"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">Mot de passe</label>
                  <button
                    type="button"
                    className="text-xs text-blue-400 transition-colors hover:text-blue-300"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-12 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Bouton connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Connexion en cours…
                  </span>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Pas encore de compte ?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Indice compte démo */}
          <p className="mt-5 text-center text-xs text-slate-700">
            Démo :{" "}
            <span className="text-slate-600">marie@exemple.com</span>
            {" / "}
            <span className="text-slate-600">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
