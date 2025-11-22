// src/Pages/Auth/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // 👉 plus tard, appeler ton backend ici

    setTimeout(() => {
      // ✅ On enregistre un "user connecté" dans le localStorage
      try {
        const pseudoName = email.split("@")[0] || "Utilisateur";
        localStorage.setItem("auth.userEmail", email);
        localStorage.setItem("auth.userName", pseudoName);
        // tu pourras aussi mettre un token plus tard : localStorage.setItem("auth.token", "xxx");
      } catch {}

      setLoading(false);
      navigate("/onboarding/step-1"); // tu gardes ta redirection actuelle
    }, 600);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      {/* Fond gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(255,173,138,0.22),transparent),radial-gradient(900px_500px_at_80%_120%,rgba(255,214,196,0.25),transparent),radial-gradient(900px_500px_at_10%_120%,rgba(202,235,255,0.22),transparent)]" />

      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-orange-500/90 grid place-items-center shadow-sm">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white">
              <path
                d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm0 3.5a1 1 0 0 1 1 1V11h3.5a1 1 0 0 1 0 2H12a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="mt-2 text-lg font-semibold">PathFinder</h1>
          <p className="text-sm text-gray-600 -mt-0.5">
            Trouve ta voie professionnelle
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Bon retour ! <span role="img">👋</span>
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Connecte-toi pour accéder à ton profil et tes résultats
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <label className="block text-sm font-medium text-gray-700">
              Email
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500/40 bg-white">
                <span className="pl-3 text-gray-400">
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M20 4H4a2 2 0 0 0-2 2v.4l10 6.25L22 6.4V6a2 2 0 0 0-2-2Zm0 4.15-8 5-8-5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.15Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  placeholder="ton.email@exemple.com"
                  className="w-full rounded-xl border-0 px-3 py-2.5 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>

            {/* Mot de passe */}
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500/40 bg-white">
                <span className="pl-3 text-gray-400">
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M17 10h-1V8a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V8Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border-0 px-3 py-2.5 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </label>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-3 font-medium text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 transition"
            >
              {loading ? "Connexion..." : "Se connecter"}
              <span className="ml-2">➜</span>
            </button>
          </form>

          {/* Séparateur */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">
                Première visite ?
              </span>
            </div>
          </div>

          {/* Continuer sans compte */}
          <button
            onClick={() => navigate("/home")}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium hover:bg-gray-50 transition"
          >
            Continuer sans compte
          </button>

          {/* Liens bas */}
          {/* Liens bas */}
<div className="mt-6 space-y-2 text-center">
  <button
    onClick={() => navigate("/presentation")}
    className="block w-full text-sm text-blue-600 hover:underline"
  >
    Revoir la présentation de PathFinder
  </button>

  <button
    onClick={() => navigate("/auth/register")}
    className="block w-full text-sm text-gray-700 hover:underline"
  >
    Pas encore de compte ? Créer un compte
  </button>
</div>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          PathFinder • Orientation professionnelle intelligente
        </p>
      </div>
    </div>
  );
}
