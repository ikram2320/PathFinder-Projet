// src/Pages/tests/Results.jsx
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import jsPDF from "jspdf"; // 👉 pense à faire: npm install jspdf

/* ------------------ Helpers d'état "auth/premium" ------------------ */
function getAuthState() {
  const isPremium = localStorage.getItem("pf.premium") === "1";
  const isLoggedIn =
    !!localStorage.getItem("auth.userEmail") ||
    !!localStorage.getItem("auth.pendingEmail") ||
    isPremium;
  return { isLoggedIn, isPremium };
}

/* ---------------------- Axes & scoring (démo) ---------------------- */
const AXES = {
  E: "EI",
  I: "EI",
  S: "SN",
  N: "SN",
  T: "TF",
  F: "TF",
  J: "JP",
  P: "JP",
  G: "MO",
  M: "MO",
  PRACT: "LP",
  CONC: "LP",
};
const LEFT = {
  EI: "E",
  SN: "S",
  TF: "T",
  JP: "J",
  MO: "G",
  LP: "PRACT",
};
const RIGHT = {
  EI: "I",
  SN: "N",
  TF: "F",
  JP: "P",
  MO: "M",
  LP: "CONC",
};
const SPAN = 6;

function axisScoresFromLocalStorage() {
  const raw = JSON.parse(localStorage.getItem("fullTest.answers") || "[]");
  const questions = JSON.parse(
    localStorage.getItem("fullTest.questions") || "null"
  );
  const qlist = questions || window.__questions__ || [];
  const s = { EI: 0, SN: 0, TF: 0, JP: 0, MO: 0, LP: 0 };

  raw.forEach((optIdx, i) => {
    const q = qlist[i];
    if (!q) return;
    const opt = q.options?.[optIdx];
    if (!opt) return;
    const key = opt.scoreKey;
    const axis = AXES[key];
    if (!axis) return;
    if (key === LEFT[axis]) s[axis] += 1;
    else s[axis] -= 1;
  });
  return s;
}
function toward10(axisValue, wantsLeft) {
  const signed = wantsLeft ? axisValue : -axisValue;
  const pct = Math.min(1, Math.max(0, (signed + SPAN) / (2 * SPAN)));
  return Math.round(pct * 100) / 10;
}
function headlineProfileType(s) {
  const e = s.EI,
    t = s.TF,
    j = s.JP,
    n = s.SN;
  if (e >= 0 && t >= 0) return "Le Leader Créatif";
  if (n < 0 && t >= 0) return "Stratège créatif";
  if (j >= 0 && t >= 0) return "Exécutant fiable";
  if (e < 0 && t < 0) return "Facilitateur/trice empathique";
  return "Profil polyvalent";
}

/* ------------------------ Données métiers (démo) ------------------------ */
const ALL_JOBS = [
  {
    id: "fullstack",
    name: "Développeur Full-Stack",
    tag: "Technologie",
    score: 95,
    why: "Ton fort score en analyse et technique correspond parfaitement aux compétences requises.",
    pros: [
      "Forte demande sur le marché",
      "Salaires attractifs",
      "Télétravail possible",
    ],
    cons: [
      "Apprentissage continu nécessaire",
      "Parfois long devant l’écran",
      "Deadlines serrées",
    ],
  },
  {
    id: "uxui",
    name: "Designer UX/UI",
    tag: "Design",
    score: 92,
    why: "Ta créativité élevée et ton sens de la communication sont des atouts majeurs.",
    pros: [
      "Créativité au quotidien",
      "Impact direct sur l’expérience utilisateur",
      "Secteur en croissance",
    ],
    cons: [
      "Retours clients parfois difficiles",
      "Tendances changeantes",
      "Beaucoup de révisions",
    ],
  },
  {
    id: "cpd",
    name: "Chef de Projet Digital",
    tag: "Gestion",
    score: 88,
    why: "Ton leadership et ta communication font de toi un excellent candidat.",
    pros: [
      "Gestion d’équipes",
      "Vision stratégique",
      "Responsabilités importantes",
    ],
    cons: [
      "Pression sur les résultats",
      "Gestion de conflits",
      "Disponibilité élevée",
    ],
  },
  {
    id: "datasci",
    name: "Data Scientist",
    tag: "Data & IA",
    score: 87,
    why: "Tes capacités d'analyse et ta rigueur sont idéales pour interpréter des données complexes.",
    pros: ["Secteur porteur", "Salaires élevés", "Innovation constante"],
    cons: [
      "Forte compétition",
      "Maths avancées requises",
      "Nettoyage de données fastidieux",
    ],
  },
  {
    id: "pm",
    name: "Product Manager",
    tag: "Produit",
    score: 85,
    why: "Ta vision stratégique et ta capacité à communiquer sont essentielles pour ce rôle.",
    pros: ["Vision d’ensemble", "Impact stratégique", "Diversité des missions"],
    cons: [
      "Nombreux stakeholders",
      "Arbitrages difficiles",
      "Responsabilités importantes",
    ],
  },
  {
    id: "cloudarch",
    name: "Architecte Cloud",
    tag: "Infrastructure",
    score: 83,
    why: "Ton expertise technique et ta vision à grande échelle correspondent aux besoins.",
    pros: [
      "Expertise recherchée",
      "Rémunération attractive",
      "Projets à grande échelle",
    ],
    cons: [
      "Complexité technique",
      "Astreintes possibles",
      "Certifications coûteuses",
    ],
  },
  {
    id: "devops",
    name: "DevOps Engineer",
    tag: "Technologie",
    score: 79,
    why: "Ton sens de l’optimisation et ta rigueur technique sont des atouts pour les pipelines.",
    pros: ["Automatisation", "Amélioration continue", "Forte demande"],
    cons: ["Gestion d’incidents", "Astreintes fréquentes", "Pression opérationnelle"],
  },
  {
    id: "dataeng",
    name: "Data Engineer",
    tag: "Data & IA",
    score: 78,
    why: "Ton profil technique/analytique convient à la construction de plateformes de données.",
    pros: ["Rôle central data", "Écosystème moderne", "Impact transversal"],
    cons: ["Complexité systèmes", "On-call possible", "Dette technique"],
  },
];

/* ------------------------------ Icons ------------------------------ */

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <circle cx="12" cy="12" r="11" fill="white" opacity="0.15" />
      <path
        d="M20 7l-9 9-5-5"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M12 3v10.17l3.59-3.58L17 11l-5 5-5-5 1.41-1.41L11 13.17V3h2Zm-7 14h14v2H5v-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Icônes réseaux pour la modale */

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        d="M17.5 7.3c-1.3-.4-2.3-1.4-2.7-2.7h0V4h-2.7v10.2c0 1.5-1.2 2.7-2.7 2.7S6.7 15.7 6.7 14.2c0-1.3.9-2.4 2.2-2.6v-2.8c-2.8.2-5 2.5-5 5.4 0 3 2.4 5.4 5.4 5.4s5.4-2.4 5.4-5.4v-4.5c1 .8 2.2 1.4 3.5 1.4V7.3h-0.2Z"
        fill="white"
      />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        d="M6 6.5A1.75 1.75 0 1 1 6 3a1.75 1.75 0 0 1 0 3.5ZM4.5 9H7v9.5H4.5V9Zm4.75 0H12v1.3c.4-.7 1.1-1.5 2.6-1.5 2.1 0 3.6 1.3 3.6 4.2v5.5H15.7v-5c0-1.3-.5-2.1-1.6-2.1-1 0-1.6.7-1.6 2.1v5H9.25V9Z"
        fill="white"
      />
    </svg>
  );
}
function TwitterXIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        d="M6 5h3l2.3 3.4L14.6 5H18l-4.4 4.8L18 19h-3l-2.6-3.9L9 19H6l4.4-4.8L6 5Z"
        fill="white"
      />
    </svg>
  );
}
function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        d="M12 3a8 8 0 0 0-6.9 12l-1.1 4 4.1-1.1A8 8 0 1 0 12 3Zm0 2a6 6 0 0 1 4.9 9.5l-.3.4a6 6 0 0 1-6.9 1.8l-2.4.7.7-2.4A6 6 0 0 1 12 5Zm-3 3.5c-.2 0-.5 0-.7.4-.2.3-.7.7-.7 1.6 0 .9.6 1.7.7 1.9l.1.1c1.1 2 2.9 2.8 4.1 3.2.5.2.9.2 1.2.1.4-.1 1.1-.5 1.3-1 .2-.5.2-.9.1-1-.1-.2-.2-.2-.4-.3l-1.1-.5c-.2-.1-.3 0-.4.1l-.4.5c-.1.2-.3.2-.5.1-.2-.1-.9-.4-1.6-1.1-.6-.5-1-1.3-1.1-1.5-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3v-.4l-.9-1.5c-.1-.2-.2-.2-.3-.3h-.3Z"
        fill="white"
      />
    </svg>
  );
}

/* ------------------------------ UI principale ------------------------------ */

export default function ResultsPage() {
  const navigate = useNavigate();
  const { isLoggedIn, isPremium } = getAuthState();
  const [showShare, setShowShare] = useState(false);

  /* --- Calculs profil --- */
  const axes = useMemo(() => axisScoresFromLocalStorage(), []);
  const competences = useMemo(() => {
    const data = [
      {
        key: "technique",
        name: "Technique",
        color: "bg-emerald-500",
        score:
          0.6 * toward10(axes.SN, true) + 0.4 * toward10(axes.LP, true),
      },
      {
        key: "analyse",
        name: "Analyse",
        color: "bg-violet-500",
        score:
          0.6 * toward10(axes.TF, true) + 0.4 * toward10(axes.SN, true),
      },
      {
        key: "communication",
        name: "Communication",
        color: "bg-blue-600",
        score:
          0.5 * toward10(axes.EI, true) + 0.5 * toward10(axes.TF, false),
      },
      {
        key: "creativite",
        name: "Créativité",
        color: "bg-pink-500",
        score:
          0.7 * toward10(axes.SN, false) + 0.3 * toward10(axes.LP, false),
      },
      {
        key: "leadership",
        name: "Leadership",
        color: "bg-amber-600",
        score:
          0.6 * toward10(axes.EI, true) + 0.4 * toward10(axes.TF, true),
      },
    ].map((x) => ({ ...x, score: Math.round(x.score * 10) / 10 }));
    return data;
  }, [axes]);

  const headline = headlineProfileType(axes);
  const showCount = isPremium ? 8 : 3;
  const jobs = useMemo(() => ALL_JOBS.slice(0, showCount), [showCount]);

  function restart() {
    try {
      localStorage.removeItem("fullTest.answers");
    } catch {}
    navigate("/tests/complet");
  }

  function handlePayNow() {
    if (isLoggedIn) {
      navigate("/paiement");
    } else {
      navigate("/premium/inscription");
    }
  }

  // 👉 Génération d’un PDF simple avec jsPDF
  function handleDownloadPDF() {
    const doc = new jsPDF();
    let y = 15;

    // Titre
    doc.setFontSize(14);
    doc.text("Résultats du test PathFinder", 105, y, { align: "center" });
    y += 8;

    // Profil principal
    doc.setFontSize(11);
    doc.text(`Profil principal : ${headline}`, 10, y);
    y += 8;

    // Compétences
    doc.setFontSize(12);
    doc.text("Ton profil en un coup d’œil", 10, y);
    y += 6;
    doc.setFontSize(10);
    competences.forEach((c) => {
      const pct = Math.round((c.score / 10) * 100);
      doc.text(`- ${c.name} : ${pct}%`, 12, y);
      y += 5;
    });

    y += 4;
    // Métiers
    doc.setFontSize(12);
    doc.text("Métiers recommandés", 10, y);
    y += 6;

    jobs.forEach((j) => {
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
      doc.setFontSize(11);
      doc.text(`• ${j.name} (${j.score}%)`, 12, y);
      y += 5;

      if (isPremium) {
        doc.setFontSize(9);
        const split = doc.splitTextToSize(j.why, 180);
        doc.text(split, 16, y);
        y += split.length * 4 + 2;
      }
    });

    doc.save("resultats-pathfinder.pdf");
  }

  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";

  function copyLink() {
    if (navigator.clipboard && pageUrl) {
      navigator.clipboard.writeText(pageUrl);
      alert("Lien copié dans le presse-papiers !");
    }
  }

  return (
    <div className="min-h-screen bg-[#fffdfb]">
      {/* Topbar simple */}
      <header className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-white">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-700 hover:text-gray-900"
        >
          ← Retour
        </button>

        <div className="flex items-center gap-3">
          <div className="text-sm font-medium">Résultats du test</div>
          <div className="flex items-center gap-2">
            {/* Télécharger PDF */}
            <button
              onClick={handleDownloadPDF}
              className="h-8 w-8 rounded-xl bg-white border border-gray-200 grid place-items-center shadow-sm hover:bg-gray-50"
              title="Télécharger en PDF"
            >
              <DownloadIcon />
            </button>

            {/* Partager (texte) */}
            <button
              onClick={() => setShowShare(true)}
              className="h-8 px-3 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-800 shadow-sm hover:bg-gray-50"
              title="Partager mes résultats"
            >
              Partager
            </button>
          </div>
        </div>

        <div className="w-10" />
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Bannière réussite */}
        <div className="rounded-2xl bg-orange-500 text-white p-10 text-center">
          <div className="mx-auto mb-3 h-12 w-12 grid place-items-center rounded-full bg-white/20">
            <CheckIcon />
          </div>
          <div className="text-lg font-semibold">Test terminé !</div>
          <div className="mt-1 text-white/90">
            Félicitations, tu as complété le test avec succès
          </div>
        </div>

        {/* Bandeau Premium activé */}
        {isPremium && (
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-600 text-white p-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                👑
              </span>
              <div className="font-medium">Premium activé !</div>
            </div>
            <div className="text-sm text-white/90 mt-1">
              Tu as maintenant accès à tous les métiers et parcours détaillés.
            </div>
          </div>
        )}

        {/* Profil skills */}
        <section className="mt-8 rounded-2xl border bg-white p-6">
          <div className="font-semibold text-gray-900">
            Ton profil en un coup d’œil
          </div>
          <div className="mt-4 space-y-4">
            {competences.map((c) => {
              const pct = Math.round((c.score / 10) * 100);
              return (
                <div key={c.key}>
                  <div className="flex items-center justify-between text-sm text-gray-800">
                    <span>{c.name}</span>
                    <span className="text-gray-500">{pct}%</span>
                  </div>
                  <div className="mt-2 h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-3 rounded-full ${c.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Type de personnalité */}
        <section className="mt-8 rounded-2xl border bg-white p-6">
          <div className="text-gray-900 font-semibold">
            Type de personnalité
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-orange-50 to-blue-50 p-4 border">
            <div className="inline-flex items-center gap-2">
              <span className="h-8 w-8 grid place-items-center rounded-full bg-orange-100 text-orange-600">
                ✸
              </span>
              <span className="font-medium">{headline}</span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Ton profil révèle une forte orientation vers <b>Technique</b> et{" "}
              <b>Analyse</b>. Tu excelles dans les environnements dynamiques qui
              valorisent l’innovation et la collaboration.
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-blue-50 p-4">
              <div className="text-sm text-gray-500">Force</div>
              <div className="font-medium">Technique</div>
            </div>
            <div className="rounded-xl bg-green-50 p-4">
              <div className="text-sm text-gray-500">Style</div>
              <div className="font-medium">Collaboratif</div>
            </div>
            <div className="rounded-xl bg-indigo-50 p-4">
              <div className="text-sm text-gray-500">Motivation</div>
              <div className="font-medium">Innovation</div>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <div className="text-sm text-gray-500">Potentiel</div>
              <div className="font-medium">Élevé</div>
            </div>
          </div>
        </section>

        {/* Carte Premium (non premium) */}
        {!isPremium && (
          <section className="mt-8 rounded-2xl border-2 border-indigo-300 bg-indigo-50 p-0 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  Débloque ton avenir professionnel
                </div>
                <div className="text-indigo-900/90 text-sm mt-1">
                  Accède aux descriptions complètes des métiers, aux parcours
                  détaillés, aux recommandations d’écoles et à une synthèse PDF
                  personnalisée.
                </div>
              </div>
              <span className="rounded-full bg-indigo-600/10 text-indigo-700 px-2 py-1 text-xs">
                Premium
              </span>
            </div>

            <ul className="px-5 pb-0 text-sm text-indigo-900 space-y-2">
              <li>• 8 métiers recommandés (au lieu de 3)</li>
              <li>• Descriptions complètes + parcours détaillés</li>
              <li>• Recommandations d’écoles et établissements</li>
              <li>• Synthèse PDF personnalisée</li>
            </ul>

            <div className="px-5 pt-4 pb-5">
              <div className="text-2xl font-semibold">300€</div>
              <div className="text-xs text-indigo-900/70">
                Paiement unique • Accès à vie
              </div>

              <button
                onClick={handlePayNow}
                className="mt-4 w-full rounded-xl bg-indigo-700 text-white py-3 font-medium hover:bg-indigo-800"
              >
                👑 Payer maintenant
              </button>

              {!isLoggedIn && (
                <button
                  onClick={() => navigate("/connexion")}
                  className="mt-2 w-full rounded-xl border border-indigo-200 bg-white py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                >
                  Vous avez déjà un compte ? Connectez-vous
                </button>
              )}
            </div>
          </section>
        )}

        {/* Liste des métiers */}
        <section className="mt-8">
          <div className="text-gray-900 font-semibold">
            Tes métiers recommandés
          </div>

          {!isPremium && (
            <div className="mt-3 rounded-xl bg-violet-50 border border-violet-200 p-4 text-sm text-violet-900">
              <div className="font-medium">Version gratuite limitée :</div>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>Seulement 3 métiers visibles</li>
                <li>Pas de descriptions détaillées</li>
                <li>Pas d’accès aux parcours</li>
              </ul>
              <button
                onClick={handlePayNow}
                className="mt-3 inline-flex items-center rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-violet-900 hover:bg-violet-100"
              >
                Passer à la version Premium pour tout débloquer
              </button>
            </div>
          )}

          <div className="mt-4 space-y-6">
            {jobs.map((j) => (
              <div
                key={j.id}
                className="rounded-2xl border bg-white overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">{j.name}</div>
                      <div className="mt-1 inline-flex items-center gap-2 text-xs">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5">
                          {j.tag}
                        </span>
                      </div>
                    </div>
                    <div className="text-orange-600 font-semibold">
                      {j.score}%
                    </div>
                  </div>

                  {isPremium ? (
                    <>
                      <p className="mt-3 text-sm text-gray-700">
                        <span className="text-orange-600 font-medium">
                          Pourquoi ce métier pour toi :
                        </span>{" "}
                        {j.why}
                      </p>

                      <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-green-50 p-4">
                          <div className="font-medium text-green-900">
                            Avantages
                          </div>
                          <ul className="mt-2 text-sm text-green-800 list-disc ml-5">
                            {j.pros.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl bg-amber-50 p-4">
                          <div className="font-medium text-amber-900">
                            Défis
                          </div>
                          <ul className="mt-2 text-sm text-amber-800 list-disc ml-5">
                            {j.cons.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link
                          to={`/parcours/${j.id}`}
                          className="inline-flex items-center justify-center w-full md:w-auto rounded-xl border px-4 py-2 hover:bg-indigo-50"
                        >
                          Voir le parcours détaillé →
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="mt-3 text-sm text-gray-500 inline-flex items-center gap-2">
                      <span className="inline-block h-4 w-4 rounded-full bg-gray-200" />
                      Détails disponibles en version Premium
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={restart}
              className="w-full rounded-xl border bg-white px-4 py-3 hover:bg-gray-50"
            >
              Repasser le test
            </button>
          </div>
        </section>

        {/* Conseils */}
        <section className="mt-8 rounded-2xl border bg-white p-6">
          <div className="font-semibold text-gray-900">
            Conseils personnalisés
          </div>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>✓ Explore les métiers qui combinent technique et analyse</li>
            <li>✓ Considère des formations qui renforcent tes points forts</li>
            <li>✓ N’hésite pas à contacter des professionnels pour des conseils</li>
          </ul>
        </section>

        {/* Debug (dev only) */}
        <section className="mt-8 rounded-2xl border border-dashed bg-gray-50 p-4 text-sm text-gray-700">
          <div className="font-medium">🔧 Debug Info (dev only)</div>
          <div className="mt-1">
            • isPremium:{" "}
            {isPremium ? (
              <span className="text-green-700">TRUE (Premium)</span>
            ) : (
              <span className="text-rose-700">FALSE (Gratuit)</span>
            )}
          </div>
          <div>• Métiers affichés: {jobs.length} / 8</div>
          <div>
            • Version:{" "}
            {isPremium
              ? "PREMIUM (détails complets)"
              : "GRATUITE (3 métiers basiques)"}
          </div>
        </section>
      </main>

      {/* Modale de partage */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg relative">
            <button
              onClick={() => setShowShare(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Fermer"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold">Partager mes résultats</h2>
            <p className="mt-1 text-sm text-gray-600">
              Choisis un réseau pour partager la page de résultats, ou copie
              le lien.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href={`https://www.tiktok.com`}
                  
                
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-white hover:bg-[#1666d1]"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                  <TikTokIcon />
                </span>
                <span className="text-sm font-medium">TikTok</span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  pageUrl
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-3 text-white hover:bg-[#0957a7]"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                  <LinkedinIcon />
                </span>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  pageUrl
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-white hover:bg-black/90"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                  <TwitterXIcon />
                </span>
                <span className="text-sm font-medium">X / Twitter</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  pageUrl
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-white hover:bg-[#21be5b]"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                  <WhatsappIcon />
                </span>
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
            </div>

            <button
              onClick={copyLink}
              className="mt-5 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-black"
            >
              Copier le lien (pour Instagram, etc.)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
