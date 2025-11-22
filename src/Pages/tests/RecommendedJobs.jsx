// src/Pages/tests/RecommendedJobs.jsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ===== Axes & helpers: même logique que Results.jsx ===== */
const AXES = {
  E: "EI", I: "EI",
  S: "SN", N: "SN",
  T: "TF", F: "TF",
  J: "JP", P: "JP",
  G: "MO", M: "MO",
  PRACT: "LP", CONC: "LP",
};
const LEFT  = { EI: "E",  SN: "S",  TF: "T",  JP: "J",  MO: "G",  LP: "PRACT" };
const RIGHT = { EI: "I",  SN: "N",  TF: "F",  JP: "P",  MO: "M",  LP: "CONC" };
const SPAN = 6;

function axisScoresFromLocalStorage() {
  const raw = JSON.parse(localStorage.getItem("fullTest.answers") || "[]");
  const questions = JSON.parse(localStorage.getItem("fullTest.questions") || "null");
  const qlist = questions || (window.__questions__ || []);
  const s = { EI:0, SN:0, TF:0, JP:0, MO:0, LP:0 };
  raw.forEach((optIdx, i) => {
    const q = qlist[i]; if (!q) return;
    const opt = q.options?.[optIdx]; if (!opt) return;
    const k = opt.scoreKey; const axis = AXES[k]; if (!axis) return;
    if (k === LEFT[axis]) s[axis] += 1; else s[axis] -= 1;
  });
  return s;
}
function toward10(axisValue, wantsLeft) {
  const signed = wantsLeft ? axisValue : -axisValue;
  const pct = Math.min(1, Math.max(0, (signed + SPAN) / (2 * SPAN)));
  return Math.round(pct * 100) / 10; // 0..10
}

/* ===== Construction des 8 compétences (0..10) ===== */
function computeCompetences(axes) {
  return {
    creativite:   +(0.7 * toward10(axes.SN, false) + 0.3 * toward10(axes.LP, false)).toFixed(1), // N + Conceptuel
    analyse:      +(0.6 * toward10(axes.TF, true)   + 0.4 * toward10(axes.SN, true)).toFixed(1),  // T + S
    communication:+(0.5 * toward10(axes.EI, true)   + 0.5 * toward10(axes.TF, false)).toFixed(1), // E + F
    empathie:     +(0.7 * toward10(axes.TF, false)  + 0.3 * toward10(axes.EI, false)).toFixed(1), // F + I
    organisation: +(1.0 * toward10(axes.JP, true)).toFixed(1),                                    // J
    stress:       +(0.5 * toward10(axes.JP, true)   + 0.5 * toward10(axes.MO, true)).toFixed(1),   // J + Objectifs
    leadership:   +(0.6 * toward10(axes.EI, true)   + 0.4 * toward10(axes.TF, true)).toFixed(1),   // E + T
    technique:    +(0.6 * toward10(axes.SN, true)   + 0.4 * toward10(axes.LP, true)).toFixed(1),   // S + Pratique
  };
}

/* ===== Dataset métiers (exemple) =====
   Chaque métier a un poids par compétence (somme ≈ 1) pour le matching.
*/
const JOBS = [
  {
    id: "commercial",
    title: "Commercial",
    icon: "🧳",
    category: "Social",
    badges: ["Recommandé"],
    keySkills: ["Communication", "Persuasion", "Relationnel"],
    weights: { // pondération pour le score de compatibilité
      communication: 0.30, empathie: 0.20, leadership: 0.15,
      analyse: 0.10, organisation: 0.10, technique: 0.05, creativite: 0.05, stress: 0.05
    },
    salary: "28–60k€",
    growth: "+5%",
    mode: "Terrain",
    team: "2–10 personnes",
    formation: "Bac+2 à Bac+5",
    path: [
      { step: "Formation commerciale", duration: "2–3 ans", details: "BTS NDRC/MCO, DUT Techniques de commercialisation…" },
      { step: "Stage commercial", duration: "3–6 mois", details: "Prospection, cycle de vente, CRM…" },
      { step: "Commercial junior/Attaché commercial", duration: "2–4 ans", details: "Portefeuille clients, objectifs mensuels…" },
      { step: "▶ + 1 étape supplémentaire" },
    ],
  },
  {
    id: "designer",
    title: "Designer graphique",
    icon: "🎨",
    category: "Créatif",
    badges: ["Recommandé"],
    keySkills: ["Créativité", "Sens esthétique", "Maîtrise des outils"],
    weights: {
      creativite: 0.35, technique: 0.20, communication: 0.15,
      organisation: 0.10, analyse: 0.10, empathie: 0.05, leadership: 0.03, stress: 0.02
    },
    salary: "30–50k€",
    growth: "+8%",
    mode: "Hybride",
    team: "3–8 personnes",
    formation: "Bac+2 à Bac+5",
    path: [
      { step: "Formation en design graphique", duration: "2–3 ans", details: "BUT MMI, écoles d'art, logiciels (PS/AI/Figma)…" },
      { step: "Stage et premiers projets", duration: "6 mois–1 an", details: "Agence, portfolio, premiers clients…" },
      { step: "Designer graphique junior", duration: "2–3 ans", details: "Identité visuelle, maquettes, prod multi-supports…" },
      { step: "▶ + 1 étape supplémentaire" },
    ],
  },
  {
    id: "developpeur",
    title: "Développeur",
    icon: "💻",
    category: "Technique",
    badges: ["Recommandé"],
    keySkills: ["Logique", "Résolution de problèmes", "Technologies"],
    weights: {
      technique: 0.35, analyse: 0.30, organisation: 0.15,
      communication: 0.08, stress: 0.07, creativite: 0.03, empathy: 0.01, leadership: 0.01
    },
    salary: "35–70k€",
    growth: "+15%",
    mode: "Hybride",
    team: "5–15 personnes",
    formation: "Bac+2 à Bac+5",
    path: [
      { step: "Formation en informatique", duration: "2–5 ans", details: "BUT/BTS info, écoles d'ingénieurs, autodidacte." },
      { step: "Projets personnels & stages", duration: "6 mois–1 an", details: "GitHub, open source, stage en entreprise." },
      { step: "Développeur junior", duration: "1–3 ans", details: "Montée en compétence, meilleures pratiques." },
      { step: "▶ + 1 étape supplémentaire" },
    ],
  },
];

/* ===== Utils d’UI ===== */
function Badge({ children }) {
  return <span className="rounded-full bg-green-50 text-green-700 px-2 py-0.5 text-xs">{children}</span>;
}
function Tag({ children }) {
  return <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-1">{children}</span>;
}
function ProgressBar({ value }) {
  const w = Math.round(value);
  return (
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className="h-2 bg-orange-500" style={{ width: `${w}%` }} />
    </div>
  );
}

export default function RecommendedJobs() {
  const navigate = useNavigate();
  const axes = useMemo(() => axisScoresFromLocalStorage(), []);
  const comps = useMemo(() => computeCompetences(axes), [axes]);

  /* --- Compatibilité --- */
  function jobCompatibility(job) {
    const w = job.weights;
    const dot =
      (comps.creativite  * (w.creativite  || 0)) +
      (comps.analyse      * (w.analyse      || 0)) +
      (comps.communication* (w.communication|| 0)) +
      (comps.empathie     * (w.empathie     || 0)) +
      (comps.organisation * (w.organisation || 0)) +
      (comps.stress       * (w.stress       || 0)) +
      (comps.leadership   * (w.leadership   || 0)) +
      (comps.technique    * (w.technique    || 0));
    // dot est entre 0..10 (car chaque comp est /10 et la somme des poids ≈ 1)
    return Math.round((dot / 10) * 100); // %
  }

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Tous");

  const jobsWithScore = useMemo(() => {
    return JOBS.map(j => ({ ...j, score: jobCompatibility(j) }))
      .sort((a,b) => b.score - a.score);
  }, [comps]);

  const categories = useMemo(() => {
    const counts = { Tous: jobsWithScore.length, Créatif:0, Technique:0, Social:0, Management:0 };
    jobsWithScore.forEach(j => { counts[j.category] = (counts[j.category] || 0) + 1; });
    return counts;
  }, [jobsWithScore]);

  const filtered = jobsWithScore.filter(j => {
    const okCat = activeCat === "Tous" ? true : j.category === activeCat;
    const q = query.trim().toLowerCase();
    const okQuery =
      !q ||
      j.title.toLowerCase().includes(q) ||
      j.keySkills.some(k => k.toLowerCase().includes(q));
    return okCat && okQuery;
  });

  function restart() {
    try { localStorage.removeItem("fullTest.answers"); } catch {}
    navigate("/tests/complet");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="h-14 border-b border-gray-100 flex items-center justify-between px-4">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-800">← Retour</button>
        <div className="text-sm font-medium">Métiers Recommandés</div>
        <Link to="/home" className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
          commencer a explorer
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-center text-2xl font-semibold">Découvrez Votre Futur Métier</h1>
        <p className="text-center text-gray-600 mt-2">
          Basé sur votre profil de compétences, voici les métiers qui vous correspondent.
        </p>

        {/* Recherche */}
        <div className="max-w-xl mx-auto mt-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Rechercher un métier…"
              className="w-full rounded-2xl border border-gray-200 pl-9 pr-3 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
          {["Tous","Créatif","Technique","Social","Management"].map(cat => (
            <button
              key={cat}
              onClick={()=>setActiveCat(cat)}
              className={`rounded-full px-3 py-1.5 text-sm border ${
                activeCat===cat ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat} ({categories[cat] || 0})
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(job => (
            <article key={job.id} className="rounded-2xl border p-5">
              {/* header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{job.icon}</div>
                  <div>
                    <div className="font-semibold">{job.title}</div>
                    <div className="text-xs text-gray-500"><span className="text-amber-500">★</span> {job.score}% compatible</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.badges.map((b,i)=><Badge key={i}>{b}</Badge>)}
                </div>
              </div>

              {/* description (placeholder court) */}
              <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                {job.id === "commercial" && "Développez les ventes et entretenez les relations clients. Négociez et concluez des contrats en représentant l'entreprise."}
                {job.id === "designer" && "Créez des visuels impactants pour différents supports. Travaillez l'identité visuelle et la communication de marque."}
                {job.id === "developpeur" && "Concevez des applications web et mobiles. Résolvez des problèmes complexes et contribuez à des produits utilisés par des milliers d’utilisateurs."}
              </p>

              {/* compétences clés */}
              <div className="mt-4">
                <div className="text-sm font-medium">Compétences clés :</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.keySkills.map((k,i)=><Tag key={i}>{k}</Tag>)}
                </div>
              </div>

              {/* métriques */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="flex items-center gap-2"><span>💶</span><span>{job.salary}</span></div>
                <div className="flex items-center gap-2"><span>📈</span><span>{job.growth}</span></div>
                <div className="flex items-center gap-2"><span>📍</span><span>{job.mode}</span></div>
                <div className="flex items-center gap-2"><span>👥</span><span>{job.team}</span></div>
              </div>

              {/* compat progress */}
              <div className="mt-3">
                <ProgressBar value={job.score} />
              </div>

              {/* formation & parcours */}
              <div className="mt-5 border-t pt-4">
                <div className="text-sm">
                  <span className="font-medium">Formation : </span>{job.formation}
                </div>
                <div className="mt-3 text-sm font-medium">Parcours classique :</div>
                <ol className="mt-2 space-y-2">
                  {job.path.map((p,i)=>(
                    <li key={i} className="flex items-start gap-3">
                      <span className="h-6 w-6 shrink-0 rounded-full bg-orange-100 text-orange-700 grid place-items-center text-sm font-semibold">
                        {i+1 <= 3 ? i+1 : "•"}
                      </span>
                      <div>
                        <div className="font-medium">{p.step} {p.duration && <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">{p.duration}</span>}</div>
                        {p.details && <div className="text-xs text-gray-600">{p.details}</div>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          ))}
        </div>

        {/* CTA bas */}
        <div className="mt-8 flex flex-col md:flex-row gap-3 items-center justify-center">
          <button onClick={restart} className="rounded-xl border px-5 py-3 hover:bg-white">
            Refaire le test d'orientation
          </button>
          <Link to="/assistant" className="rounded-xl border px-5 py-3 hover:bg-white">
            Parler à l'assistant
          </Link>
        </div>

        <p className="mt-3 text-center text-sm text-gray-500">
          Ces recommandations sont basées sur votre profil de compétences. N’hésitez pas à explorer d’autres métiers qui vous intéressent !
        </p>
      </main>
    </div>
  );
}
