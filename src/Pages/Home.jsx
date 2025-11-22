// src/Pages/Home.jsx
import { Link } from "react-router-dom";
import imageHome from "../assets/image_home.avif";

/* ---------------- Helpers d'état ---------------- */
function getAuthState() {
  const isPremium = localStorage.getItem("pf.premium") === "1";
  const email = localStorage.getItem("auth.userEmail") || localStorage.getItem("auth.pendingEmail") || "";
  const displayName = localStorage.getItem("auth.displayName") || email?.split("@")[0] || "";
  const isLoggedIn = !!email || isPremium;

  // stats rapides depuis le storage
  const testsCompleted =
    Array.isArray(JSON.parse(localStorage.getItem("fullTest.answers") || "[]")) &&
    JSON.parse(localStorage.getItem("fullTest.answers") || "[]").length > 0
      ? 1
      : 0;

  const paths = Object.keys(localStorage).filter((k) => k.startsWith("pf.path."));
  const jobsExplored = paths.length;

  // Progression très simple (exemple) : 30% si test fait, +20% par parcours enregistré
  const progress = Math.min(100, (testsCompleted ? 30 : 0) + jobsExplored * 20);

  return { isLoggedIn, isPremium, email, displayName, testsCompleted, jobsExplored, progress };
}

/* ===== Icônes inline ===== */
const LogoPF = () => (
  <div className="h-8 w-8 rounded-md bg-orange-600 grid place-items-center text-white font-black">PF</div>
);
const SparkIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path d="M12 2l1.8 4.7L18 8.5l-4.2 1.7L12 15l-1.8-4.8L6 8.5l4.2-1.8L12 2Z" fill="currentColor"/>
  </svg>
);
const BoltIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path d="M13 2 3 14h7l-1 8 11-14h-7l0-6Z" fill="currentColor"/>
  </svg>
);
const Check = () => <span className="text-green-600">✓</span>;
const Crown = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
    <path d="M3 7l4 3 5-6 5 6 4-3v10H3V7Z" fill="currentColor"/>
  </svg>
);

/* ===================== Composant principal ===================== */
export default function Home() {
  const { isLoggedIn, isPremium, displayName, testsCompleted, jobsExplored, progress } = getAuthState();

  return (
    <div className="min-h-screen text-gray-900 relative">
      {/* Fond doux */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(900px_450px_at_20%_-100px,rgba(255,122,89,0.1),transparent),radial-gradient(900px_450px_at_90%_120%,rgba(106,117,255,0.1),transparent)]" />

      {/* ===== Topbar ===== */}
      <header className="sticky top-0 z-10 border-b border-orange-100/50 bg-white/75 backdrop-blur">
        <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoPF />
            <div>
              <div className="font-semibold">PathFinder</div>
              <div className="text-xs text-gray-500 -mt-0.5">Orientation professionnelle</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPremium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-2 py-1 text-xs">
                ⭐ Premium
              </span>
            )}
            <Link
              to="/connexion"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Se connecter
            </Link>
            <Link
              to={isLoggedIn ? "/profil" : "/login"}
              className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 hover:bg-gray-50"
              title={isLoggedIn ? "Mon profil" : "Se connecter"}
            >
              {isLoggedIn ? "👤" : "⟳"}
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Contenu ===== */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {isLoggedIn ? <LoggedInHero
          displayName={displayName}
          progress={progress}
          testsCompleted={testsCompleted}
          jobsExplored={jobsExplored}
        /> : <GuestHero />}

        {/* Bloc Premium (reste visible pour tous) */}
        <section className="mt-8 rounded-2xl border-2 border-indigo-500 bg-indigo-50 p-6 md:p-8 relative">
          <span className="absolute right-4 top-4 rounded-full bg-indigo-700 px-3 py-1 text-xs font-medium text-white">
            Premium
          </span>

          <div className="flex items-start gap-3">
            <div className="h-11 w-11 grid place-items-center rounded-xl bg-white/70 text-indigo-700">
              <Crown />
            </div>

            <div className="flex-1">
              <div className="font-semibold">Construis ton parcours</div>
              <Link to="/formations" className="text-indigo-700 hover:text-indigo-800">
                Pack complet d'accompagnement professionnel
              </Link>

              <p className="mt-1 text-sm text-indigo-900/80">
                Accède aux parcours détaillés, recommandations d'écoles et synthèse personnalisée en PDF.
              </p>

              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check /> Accès illimité aux métiers recommandés</li>
                <li className="flex items-center gap-2"><Check /> Parcours type détaillé</li>
                <li className="flex items-center gap-2"><Check /> Recommandations d’écoles</li>
                <li className="flex items-center gap-2"><Check /> Synthèse PDF</li>
                <li className="flex items-center gap-2"><Check /> Descriptions complètes</li>
              </ul>

              <div className="mt-6 text-2xl font-semibold">300 €</div>
              <div className="text-sm text-gray-600 -mt-1">Paiement unique</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ===================== Vues ===================== */
function GuestHero() {
  return (
    <>
      {/* Hero invité */}
      <section className="rounded-2xl bg-white shadow-sm ring-1 ring-orange-100 p-6 md:p-8 grid md:grid-cols-2 gap-6">
        <div className="self-center">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            Découvrez votre voie professionnelle
          </h1>
          <p className="mt-3 text-gray-600">
            Explorez les métiers, passez nos tests d'orientation ou demandez conseil à notre assistant IA.
          </p>

          <Link
            to="/tests/complet"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-white hover:bg-orange-600 transition"
          >
            Commencer le test →
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl">
          <img className="h-full w-full object-cover" src={imageHome} alt="Illustration orientation professionnelle" />
        </div>
      </section>

      {/* Statistiques invité */}
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <StatCard icon="◎" colorClass="bg-orange-50 text-orange-600" value="0" label="Tests complétés" />
        <StatCard icon={<SparkIcon />} colorClass="bg-indigo-50 text-indigo-600" value="0" label="Métiers explorés" />
      </section>

      {/* Offres + Test */}
      <h2 className="mt-8 text-lg font-semibold">Nos offres</h2>
      <TestCard />
      <HowItWorks />
    </>
  );
}

function LoggedInHero({ displayName, progress, testsCompleted, jobsExplored }) {
  return (
    <>
      {/* Bandeau bienvenue */}
      <div className="rounded-xl bg-gradient-to-r from-orange-50 to-indigo-50 p-3 ring-1 ring-orange-100">
        <div className="text-sm">
          <span className="mr-1">👋 Bienvenue <b>{displayName || "membre"}</b> ! ✨</span>
          <span>Tu as accès à toutes les fonctionnalités premium.</span>
        </div>
      </div>

      {/* Hero membre */}
      <section className="mt-4 rounded-2xl bg-white shadow-sm ring-1 ring-orange-100 p-6 md:p-8 grid md:grid-cols-2 gap-6">
        <div className="self-center">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">Continue ton parcours</h1>
          <p className="mt-3 text-gray-600">
            Découvre ton profil, tes résultats et explore de nouveaux métiers.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <Link to="/tests/complet" className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
              Commancer le test
            </Link>
          
          </div>

          {/* Progression */}
          <div className="mt-6">
            <div className="text-sm text-gray-600 mb-1">Votre progression</div>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div className="h-2 bg-orange-500" style={{ width: `${progress || 0}%` }} />
            </div>
            <div className="text-xs text-orange-700 mt-1">{Math.round(progress)}%</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl">
          <img className="h-full w-full object-cover" src={imageHome} alt="Étudiants qui travaillent" />
        </div>
      </section>

      {/* Statistiques membre */}
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <StatCard icon="◎" colorClass="bg-orange-50 text-orange-600" value={String(testsCompleted)} label="Tests complétés" />
        <StatCard icon={<SparkIcon />} colorClass="bg-indigo-50 text-indigo-600" value={String(jobsExplored)} label="Métiers explorés" />
      </section>

      {/* Offres + Test toujours visibles */}
      <h2 className="mt-8 text-lg font-semibold">Nos offres</h2>
      <TestCard />
    </>
  );
}

/* ===================== Petits composants ===================== */
function StatCard({ icon, colorClass, value, label }) {
  return (
    <div className="rounded-xl bg-white ring-1 ring-gray-200 p-4 flex items-center gap-4">
      <div className={`h-10 w-10 grid place-items-center rounded-xl ${colorClass}`}>{icon}</div>
      <div>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
}

function TestCard() {
  return (
    <section className="mt-3 rounded-2xl bg-white ring-1 ring-gray-200 p-6 md:p-8 relative">
      <span className="absolute right-4 top-4 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        Gratuit
      </span>

      <div className="flex items-start gap-3">
        <div className="h-10 w-10 grid place-items-center rounded-xl bg-orange-50 text-orange-600">
          <BoltIcon />
        </div>

        <div className="flex-1">
          <div className="font-semibold">Test Complet</div>
          <Link to="/tests/complet" className="text-orange-600 hover:text-orange-700">
            Découvre ton orientation professionnelle
          </Link>

          <p className="mt-1 text-sm text-gray-600 max-w-3xl">
            Une analyse complète de ton profil professionnel avec proposition de métiers adaptés.
          </p>

          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Check /> Analyse de tes compétences principales</li>
            <li className="flex items-center gap-2"><Check /> Profil de personnalité détaillé</li>
            <li className="flex items-center gap-2"><Check /> Liste de domaines d'intérêt</li>
            <li className="flex items-center gap-2"><Check /> Accès à 3 métiers recommandés</li>
          </ul>

          <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
            <div className="inline-flex items-center gap-2">🕒 15-20 min</div>
            <div className="inline-flex items-center gap-2">❓ 8 questions</div>
          </div>

          <Link
            to="/tests/complet"
            className="mt-6 block w-full rounded-xl bg-orange-500 px-4 py-3 text-center font-medium text-white hover:bg-orange-600 transition"
          >
            Commencer le test gratuit
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { step: 1, title: "Réponds au questionnaire", desc: "Prends 15-20 min pour répondre honnêtement aux questions." },
    { step: 2, title: "Découvre ton profil", desc: "Obtiens immédiatement ton profil détaillé." },
    { step: 3, title: "Explore les métiers recommandés", desc: "Consulte les métiers les plus compatibles avec toi." },
    { step: 4, title: "Découvrez ton  parcours", desc: "Explorez le parcours du métier que tu as  choisi." },

  ];

  return (
    <>
      <h2 className="mt-8 text-lg font-semibold">Comment ça marche ?</h2>
      <div className="mt-3 space-y-4">
        {steps.map(({ step, title, desc }) => (
          <div key={step} className="rounded-2xl bg-white ring-1 ring-gray-200 p-5 flex items-start gap-4">
            <div className="h-10 w-10 grid place-items-center rounded-full bg-orange-50 text-orange-600 font-semibold">
              {step}
            </div>
            <div>
              <div className="font-medium">{title}</div>
              <p className="text-sm text-gray-600 mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
