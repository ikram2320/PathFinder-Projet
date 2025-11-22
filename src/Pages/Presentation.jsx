import { useNavigate } from "react-router-dom";

export default function Presentation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-blue-50/20">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="h-10 w-10 rounded-xl bg-orange-500 grid place-items-center text-white font-bold text-xl">
          ⌁
        </div>
        <div>
          <h1 className="font-semibold text-orange-600">PathFinder</h1>
          <p className="text-sm text-gray-500 -mt-1">Découvrez votre voie</p>
        </div>
      </div>

      {/* Centre */}
      <div className="max-w-4xl mx-auto text-center px-6 mt-6">
        <div className="h-20 w-20 bg-orange-100 rounded-full mx-auto flex items-center justify-center">
          <span className="text-3xl">🎯</span>
        </div>

        <h2 className="mt-4 text-xl font-semibold">
          Bienvenue sur PathFinder ! 🎯
        </h2>

        <p className="mt-2 text-gray-600 leading-relaxed">
          Votre assistant intelligent pour l'orientation professionnelle
        </p>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          PathFinder vous accompagne dans la découverte de votre voie grâce
          à l’intelligence artificielle et des méthodes d’orientation éprouvées.
        </p>

        {/* 3 blocs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="text-orange-500 text-3xl mb-3">📊</div>
            <h3 className="font-semibold">Tests personnalisés</h3>
            <p classname="mt-2 text-sm text-gray-600">
              Analyse de votre personnalité et métiers adaptés
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="text-blue-500 text-3xl mb-3">💬</div>
            <h3 className="font-semibold">Recommandation des méties</h3>
            <p className="mt-2 text-sm text-gray-600">
              Retrouve les méties personnalisés adaptés a ton profil
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="text-green-500 text-3xl mb-3">🎓</div>
            <h3 className="font-semibold">Parcours détaillées</h3>
            <p className="mt-2 text-sm text-gray-600">
              Parcours complets selon vos objectifs
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
  onClick={() => navigate("/visite/parcours")}
  className="mt-10 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-6 py-3 text-white font-medium rounded-xl shadow-sm transition"
>
  📍 Commencer la visite guidée
</button>


        {/* Skip */}
        <div className="mt-4">
          <button
            onClick={() => navigate("/tests/rapide/1")}
            className="text-gray-500 text-sm hover:underline"
          >
            Passer l’introduction
          </button>
        </div>
      </div>
    </div>
  );
}
