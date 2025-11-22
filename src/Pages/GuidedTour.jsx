// src/Pages/GuidedTour.jsx
import { useNavigate } from "react-router-dom";

export default function GuidedTour() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 to-blue-50/20">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500 grid place-items-center text-white font-bold text-xl shadow-sm">
            ⌁
          </div>
          <div>
            <p className="font-semibold text-orange-600">PathFinder</p>
            <p className="text-xs text-gray-500 -mt-0.5">Visite guidée</p>
          </div>
        </div>

        <button
          className="text-sm text-gray-500 hover:underline"
          onClick={() => navigate("/")}
        >
          Terminer plus tard
        </button>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-6 pb-16">
        {/* Barre de progression */}
        <section>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Progression de la visite
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-orange-100 overflow-hidden">
            {/* Pour l'instant 0%, tu pourras l'animer plus tard */}
            <div className="h-full w-0 bg-orange-500 rounded-full" />
          </div>
          <p className="mt-1 text-xs text-right text-gray-400">0 / 6 étapes</p>
        </section>

        {/* Titre + description */}
        <section className="mt-10 text-center">
          <h1 className="text-xl font-semibold">Votre parcours de découverte 🗺️</h1>
          <p className="mt-3 text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Suivez ces étapes pour tirer le meilleur parti de PathFinder.
            Vous pouvez les faire dans l&apos;ordre qui vous convient !
          </p>
        </section>

        {/* GRID DES 6 CARTES */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Étape 1 : profil / inscription */}
          <div className="rounded-2xl border border-orange-100 bg-white shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-50 grid place-items-center text-orange-500">
                  👤
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Créer votre profil</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Renseignez vos informations personnelles et votre
                    niveau d&apos;études
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">1</span>
            </div>
            <button
              onClick={() => navigate("/auth/register")}
              className="mt-4 text-sm text-orange-500 font-medium inline-flex items-center gap-1"
            >
              Cliquez pour commencer
              <span aria-hidden>➜</span>
            </button>
          </div>

          {/* Étape 2 : test d’orientation */}
          <div className="rounded-2xl border border-orange-100 bg-white shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-50 grid place-items-center text-orange-500">
                  📊
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Passer un test d&apos;orientation
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Découvrez votre personnalité et vos métiers recommandés
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">2</span>
            </div>
            <button
              onClick={() => navigate("/tests/complet")} // début du test
              className="mt-4 text-sm text-orange-500 font-medium inline-flex items-center gap-1"
            >
              Cliquez pour commencer
              <span aria-hidden>➜</span>
            </button>
          </div>

          {/* Étape 3 : explorer les métiers */}
          <div className="rounded-2xl border border-orange-100 bg-white shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-50 grid place-items-center text-orange-500">
                  🧳
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Explorer les métiers
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Parcourez nos fiches métiers détaillées et découvrez vos options
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">3</span>
            </div>
            <button
              onClick={() => navigate("/metiers")}
              className="mt-4 text-sm text-orange-500 font-medium inline-flex items-center gap-1"
            >
              Cliquez pour commencer
              <span aria-hidden>➜</span>
            </button>
          </div>

         
          {/* Étape 3 : assistant IA */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50/60 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-500 grid place-items-center text-white">
                🎓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">
                      Découvrez votre parcours
                    </h2>
                    
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Un parcours sur mesure, pensé pour guider tes choix et façonner ton avenir.
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">5</span>
            </div>
            <button
              onClick={() => navigate("/home")}
              className="mt-4 text-sm text-orange-500 font-medium inline-flex items-center gap-1"
            >
              Cliquez pour commencer
              <span aria-hidden>➜</span>
            </button>
          </div>

        </section>

        {/* Bloc conseils */}
        <section className="mt-10 rounded-2xl bg-blue-50 border border-blue-100 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-blue-500 text-xl">💡</span>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800">
                Conseils pour bien commencer
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-blue-900/90">
                <li>
                  ⭐ Commencez par créer votre profil et passer un test
                  d&apos;orientation
                </li>
                <li>📘 Explorez plusieurs métiers pour élargir vos horizons</li>
                <li>💬 N&apos;hésitez pas à utiliser l&apos;assistant IA pour vos questions</li>
                <li>❤️ Sauvegardez en favoris les métiers qui vous intéressent</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bouton final */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/home")} // change le chemin si besoin
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-sm font-medium hover:bg-gray-50 transition"
          >
            Commencer à explorer
          </button>
        </div>
      </main>
    </div>
  );
}
