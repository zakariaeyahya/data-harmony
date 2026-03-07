import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Database } from "lucide-react";
import mockData from "@/mockData.json";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "marie@exemple.com" && password === "admin123") {
      localStorage.setItem("dataplatform_user", JSON.stringify(mockData.currentUser));
      navigate("/home");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0f172a" }}>
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-card p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Data Plateforme</h1>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="email@exemple.com"
        />

        <label className="mb-1 block text-sm font-medium text-foreground">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="••••••••"
        />

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Se connecter
        </button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Pas de compte ?{" "}
          <Link to="/signup" className="text-primary hover:underline">S'inscrire</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
