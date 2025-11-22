// src/Pages/tests/CareerPath.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";

/* ---------------------- Données de base réutilisables ---------------------- */

// Formations “tech / digital”
const TECH_FORMATIONS = [
  {
    id: "ecole42",
    kind: "École d'informatique",
    name: "École 42",
    desc: "Formation gratuite et innovante en développement web et software",
    duration: "3 ans",
    cost: "Gratuit",
    location: "Paris, Lyon, Perpignan",
    admission: "Sur dossier et tests",
    marketStat: {
      label: "Développeurs web issus de cette école",
      pct: 28,
      trend: "Croissance",
    },
  },
  {
    id: "wagon",
    kind: "Bootcamp",
    name: "Le Wagon",
    desc: "Bootcamp intensif de développement web full-stack",
    duration: "9 semaines",
    cost: "6 900€",
    location: "Paris, Lyon, Bordeaux",
    admission: "Entretien de motivation",
    marketStat: {
      label: "Développeurs web issus de cette école",
      pct: 22,
      trend: "Croissance",
    },
  },
  {
    id: "epitech",
    kind: "École d'informatique",
    name: "Epitech",
    desc: "École d'expertise informatique et de technologie",
    duration: "5 ans",
    cost: "7 500€/an",
    location: "Paris, Lyon, Bordeaux, Lille",
    admission: "Sur dossier et entretien",
    marketStat: {
      label: "Développeurs web issus de cette école",
      pct: 18,
      trend: "Stable",
    },
  },
  {
    id: "saclay",
    kind: "Université",
    name: "Université Paris-Saclay",
    desc: "Licence et Master en informatique",
    duration: "3-5 ans",
    cost: "250€/an",
    location: "Orsay",
    admission: "Parcoursup",
    marketStat: {
      label: "Développeurs web issus de cette école",
      pct: 15,
      trend: "Stable",
    },
  },
  {
    id: "openclassrooms",
    kind: "Formation en ligne",
    name: "OpenClassrooms",
    desc: "Formation diplômante en développement web à distance",
    duration: "12-18 mois",
    cost: "300€/mois",
    location: "En ligne",
    admission: "Ouvert à tous",
    marketStat: {
      label: "Développeurs web issus de cette école",
      pct: 17,
      trend: "Croissance",
    },
  },
];

// Formations “data”
const DATA_FORMATIONS = [
  {
    id: "m2ds",
    kind: "Master",
    name: "M2 Data Science (Université)",
    desc: "Parcours scientifique en statistiques, ML, deep learning",
    duration: "2 ans",
    cost: "250€/an",
    location: "France (Sorbonne, PSL, Paris-Saclay...)",
    admission: "Dossier + Pré-requis",
    marketStat: {
      label: "Data scientists issus de cette filière",
      pct: 24,
      trend: "Stable",
    },
  },
  {
    id: "ensae",
    kind: "Grande École",
    name: "ENSAE / ENSAI",
    desc: "Écoles spécialisées en stats/éco et data science",
    duration: "3 ans",
    cost: "~3 000€/an",
    location: "Palaiseau / Rennes",
    admission: "Concours / Dossier",
    marketStat: {
      label: "Data scientists issus de cette filière",
      pct: 19,
      trend: "Croissance",
    },
  },
  {
    id: "oc-ds",
    kind: "Formation en ligne",
    name: "OpenClassrooms - Data Scientist",
    desc: "Parcours diplômant à distance axé projets",
    duration: "12-18 mois",
    cost: "300€/mois",
    location: "En ligne",
    admission: "Ouvert à tous",
    marketStat: {
      label: "Data scientists issus de cette filière",
      pct: 14,
      trend: "Croissance",
    },
  },
];

// Types d’entreprises “génériques”
const TECH_COMPANY_TYPES = [
  {
    id: "startup",
    icon: "🚀",
    title: "Start-up Tech",
    subtitle: "Environnement dynamique et innovant, culture agile",
    examples: "Fintech, SaaS, E-commerce",
    pros: ["Innovation constante", "Responsabilités rapides", "Stock-options"],
    cons: ["Moins de stabilité", "Charge de travail élevée"],
    companies: [
      "Alan",
      "Qonto",
      "Doctolib",
      "PayFit",
      "Swile",
      "Back Market",
      "Contentsquare",
      "Mirakl",
    ],
    market: { stagePct: 32, workPct: 22, trend: "Croissance" },
  },
  {
    id: "grandgroupe",
    icon: "🏢",
    title: "Grand groupe / CAC40",
    subtitle: "Entreprises établies avec process structurés",
    examples: "Banques, Assurances, Retail",
    pros: ["Stabilité", "Avantages sociaux", "Carrière structurée"],
    cons: ["Hiérarchie importante", "Moins d'innovation"],
    companies: [
      "BNP Paribas",
      "Société Générale",
      "Crédit Agricole",
      "AXA",
      "Orange",
      "Carrefour",
      "SNCF",
      "Décathlon",
    ],
    market: { stagePct: 18, workPct: 22, trend: "Stable" },
  },
  {
    id: "freelance",
    icon: "⚡",
    title: "Freelance / Indépendant",
    subtitle: "Autonomie complète et choix des projets",
    examples: "Consultant, Développeur freelance",
    pros: ["Liberté totale", "Revenus potentiels élevés", "Choix des clients"],
    cons: ["Pas de sécurité", "Gestion administrative", "Isolement"],
    companies: [
      "Malt",
      "Comet",
      "Crème de la Crème",
      "Kicklox",
      "FreelanceRepublik",
      "Upwork",
      "Fiverr",
      "Independant.io",
    ],
    market: { stagePct: 12, workPct: 15, trend: "Croissance" },
  },
  {
    id: "agence",
    icon: "🧩",
    title: "Agence digitale / ESN",
    subtitle: "Projets variés chez plusieurs clients",
    examples: "Conseil, Intégration, Agences digitales",
    pros: ["Variété de missions", "Montée en compétences rapide", "Réseau"],
    cons: ["Contexte client variable", "Mission-driven"],
    companies: [
      "Publicis Sapient",
      "Wavestone",
      "Valtech",
      "OCTO Technology",
      "Theodo",
      "BAM",
      "Ekino",
      "Eleven Labs",
    ],
    market: { stagePct: 12, workPct: 15, trend: "Stable" },
  },
];

// Types d’entreprises “data”
const DATA_COMPANY_TYPES = [
  {
    id: "research",
    icon: "🔬",
    title: "R&D / Recherche",
    subtitle: "Labs, équipes IA, publis",
    examples: "Labs internes / publics",
    pros: ["Excellence technique", "Impact scientifique"],
    cons: ["Sélection élevée", "Cadence publications"],
    companies: ["Inria", "Meta FAIR Paris", "DeepMind (EU)", "CNRS", "NavAlgo"],
    market: { stagePct: 9, workPct: 12, trend: "Stable" },
  },
  {
    id: "product-ai",
    icon: "🧠",
    title: "Produit IA",
    subtitle: "Équipes produit avec features ML",
    examples: "SaaS, plateformes",
    pros: ["Impact utilisateur", "Data volumineuse"],
    cons: ["Priorisation produit", "MLOps requis"],
    companies: ["Doctolib", "Back Market", "Qonto", "Alan"],
    market: { stagePct: 15, workPct: 19, trend: "Croissance" },
  },
];

/* ---------------------- CATALOG : tous les métiers ---------------------- */

const CATALOG = {
  fullstack: {
    id: "fullstack",
    title: "Développeur Full-Stack",
    badge: "Ton parcours personnalisé",
    market: {
      demand: "Demande très forte sur le marché",
      hires:
        "12 500 offres d’emploi actives • Taux d’embauche +18% • Pénurie de talents confirmée",
      trend: "Croissance forte",
    },
    formations: TECH_FORMATIONS,
    companyTypes: TECH_COMPANY_TYPES,
  },

  uxui: {
    id: "uxui",
    title: "Designer UX/UI",
    badge: "Ton parcours personnalisé",
    market: {
      demand: "Forte demande sur les profils UX/UI",
      hires:
        "8 000 offres d’emploi actives • +15% d’embauches • importance de l’expérience utilisateur",
      trend: "Croissance forte",
    },
    formations: TECH_FORMATIONS,
    companyTypes: TECH_COMPANY_TYPES,
  },

  cpd: {
    id: "cpd",
    title: "Chef de Projet Digital",
    badge: "Ton parcours personnalisé",
    market: {
      demand: "Besoin croissant de coordination de projets digitaux",
      hires:
        "5 000 offres d’emploi actives • +10% d’embauches • profils hybrides très recherchés",
      trend: "Croissance modérée",
    },
    formations: TECH_FORMATIONS,
    companyTypes: TECH_COMPANY_TYPES,
  },

  pm: {
    id: "pm",
    title: "Product Manager",
    badge: "Ton parcours personnalisé",
    market: {
      demand: "Rôle clé dans les équipes produit modernes",
      hires:
        "4 500 offres d’emploi actives • +14% d’embauches • forte responsabilité business",
      trend: "Croissance forte",
    },
    formations: TECH_FORMATIONS,
    companyTypes: TECH_COMPANY_TYPES,
  },

  cloudarch: {
    id: "cloudarch",
    title: "Architecte Cloud",
    badge: "Ton parcours personnalisé",
    market: {
      demand: "Forte demande sur les architectures cloud",
      hires:
        "3 200 offres d’emploi actives • +16% d’embauches • expertise très recherchée",
      trend: "Croissance forte",
    },
    formations: TECH_FORMATIONS,
    companyTypes: TECH_COMPANY_TYPES,
  },

  devops: {
    id: "devops",
    title: "DevOps Engineer",
    badge: "Ton parcours personnalisé",
    market: {
      demand: "Besoin constant d’automatisation et de fiabilité",
      hires:
        "6 000 offres d’emploi actives • +18% d’embauches • rôle clé dans les équipes techniques",
      trend: "Croissance forte",
    },
    formations: TECH_FORMATIONS,
    companyTypes: TECH_COMPANY_TYPES,
  },

  datasci: {
    id: "datasci",
    title: "Data Scientist",
    badge: "Ton parcours personnalisé",
    market: {
      demand: "Demande élevée sur le marché",
      hires: "6 000 offres • +12% d’embauches • forte compétition",
      trend: "Croissance modérée",
    },
    formations: DATA_FORMATIONS,
    companyTypes: DATA_COMPANY_TYPES,
  },

  dataeng: {
    id: "dataeng",
    title: "Data Engineer",
    badge: "Ton parcours personnalisé",
    market: {
      demand: "Besoin massif d’infrastructures data",
      hires:
        "4 000 offres • +15% d’embauches • rôle central dans les plateformes data",
      trend: "Croissance forte",
    },
    formations: DATA_FORMATIONS,
    companyTypes: DATA_COMPANY_TYPES,
  },
};

/* ------------------------- Helpers visuels ------------------------- */

function Badge({ children, tone = "gray" }) {
  const tones = {
    gray: "bg-gray-100 text-gray-800",
    green: "bg-green-100 text-green-800",
    orange: "bg-orange-100 text-orange-800",
    blue: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
}

function StatBar({ pct, color = "bg-blue-600" }) {
  return (
    <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
      <div className={`h-2 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

const Check = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path
      d="M20 7l-9 9-5-5"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

/* ------------------- Helpers pour les filtres ------------------- */

// Convertit une chaîne de coût en nombre annuel approximatif
function parseCostToYearlyNumber(costStr) {
  if (!costStr) return Infinity;
  const lower = costStr.toLowerCase();

  if (lower.includes("gratuit")) return 0;

  const match = lower.match(/([\d\s]+)\s*€/);
  if (!match) return Infinity;

  const raw = match[1].replace(/\s/g, "");
  const value = Number(raw || "0");

  if (lower.includes("mois")) {
    return value * 12; // coût mensuel → annuel
  }
  return value; // coût annuel ou unique
}

/* ------------------------- Page principale ------------------------- */

export default function CareerPath() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const job = useMemo(() => CATALOG[jobId], [jobId]);

  const storageKey = `pf.path.${jobId}`;
  const [selectedFormationId, setSelectedFormationId] = useState(null);
  const [validatedFormationId, setValidatedFormationId] = useState(null);
  const [steps, setSteps] = useState([]); // { companyTypeId, step }
  const [lastSavedAt, setLastSavedAt] = useState(null);

  // Filtres
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showPriceMenu, setShowPriceMenu] = useState(false);

  useEffect(() => {
    if (!job) return;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved) {
        if (typeof saved.selectedFormationId === "string") {
          setSelectedFormationId(saved.selectedFormationId);
        }
        if (typeof saved.validatedFormationId === "string") {
          setValidatedFormationId(saved.validatedFormationId);
        } else if (
          Array.isArray(saved.validatedFormationIds) &&
          saved.validatedFormationIds.length > 0
        ) {
          // compat ancienne version
          setValidatedFormationId(saved.validatedFormationIds[0]);
        }
        setSteps(saved.steps || []);
        if (saved.savedAt) setLastSavedAt(saved.savedAt);
      }
    } catch {}
  }, [job, storageKey]);

  const [toast, setToast] = useState("");

  function addStep(companyTypeId, step) {
    setSteps((prev) => [...prev, { companyTypeId, step }]);
    setToast("Étape ajoutée à ton parcours");
  }

  // Modifier une étape (stage/alt/junior/inter)
  function updateStep(stepIndex, newStep) {
    setSteps((prev) =>
      prev.map((s, idx) => (idx === stepIndex ? { ...s, step: newStep } : s))
    );
    setToast("Étape mise à jour");
  }

  // Supprimer une étape
  function deleteStep(stepIndex) {
    setSteps((prev) => prev.filter((_, idx) => idx !== stepIndex));
    setToast("Étape supprimée");
  }

  // Sélectionner une formation (mais pas encore "validée")
  function selectFormation(id) {
    setSelectedFormationId(id);
    setToast("Formation sélectionnée, tu peux maintenant la valider");
  }

  // Valider la formation sélectionnée (une seule formation possible)
  function validateFormation(id) {
    setValidatedFormationId(id);
    setToast("Formation validée dans ton parcours");
  }

  function savePath() {
    const now = Date.now();
    const payload = {
      selectedFormationId,
      validatedFormationId,
      steps,
      savedAt: now,
      jobId,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
      setLastSavedAt(now);
    } catch {}
    setToast("Parcours enregistré ! Retrouve-le dans ton profil à tout moment");
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border bg-white p-6">
          <div className="font-semibold">Métier introuvable</div>
          <button
            onClick={() => navigate(-1)}
            className="mt-3 rounded-lg border px-3 py-1.5 hover:bg-gray-50"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  const DURATIONS = {
    formationInit: "2-5 ans",
    stageAlt: "6-12 mois",
    stageFreelance: "3-6 mois",
    junior: "1-2 ans",
    montee: "2-3 ans",
    senior: "3-5 ans",
  };

  const STEP_OPTIONS = [
    { value: "stage", label: "Stage" },
    { value: "alt", label: "Alternance" },
    { value: "junior", label: "Junior" },
    { value: "inter", label: "Intermédiaire" },
  ];

  // première formation validée
  const firstValidatedFormation = validatedFormationId
    ? job.formations.find((f) => f.id === validatedFormationId)
    : null;

  // états dérivés pour les steps (pour les badges "Validé")
  const hasStageOrAlt = steps.some(
    (s) => s.step === "stage" || s.step === "alt"
  );
  const hasFreelanceStage = steps.some(
    (s) => s.companyTypeId === "freelance" && s.step === "stage"
  );
  const hasJunior = steps.some((s) => s.step === "junior");
  const hasInter = steps.some((s) => s.step === "inter");

  // index rapide par id pour les types d'entreprises
  const companyTypeById = useMemo(() => {
    const map = {};
    job.companyTypes.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [job.companyTypes]);

  /* ------------ étapes du parcours (réutilisées dans le PDF + UI) ------------ */

  const stageCompanySteps = steps
    .map((s, idx) => ({ ...s, _idx: idx }))
    .filter((s) => s.step === "stage")
    .map((s) => {
      const t = companyTypeById[s.companyTypeId];
      if (!t) return null;
      return {
        key: `stage-company-${s._idx}-${t.id}`,
        title: `Stage en ${t.title}`,
        subtitle: t.subtitle,
        right: DURATIONS.stageFreelance,
        dot: "orange",
        badge: "Sélectionné",
        badgeTone: "orange",
        editableStepIndex: s._idx,
        currentStepType: s.step,
        isCustom: true,
      };
    })
    .filter(Boolean);

  const altCompanySteps = steps
    .map((s, idx) => ({ ...s, _idx: idx }))
    .filter((s) => s.step === "alt")
    .map((s) => {
      const t = companyTypeById[s.companyTypeId];
      if (!t) return null;
      return {
        key: `alt-company-${s._idx}-${t.id}`,
        title: `Alternance en ${t.title}`,
        subtitle: t.subtitle,
        right: DURATIONS.stageAlt,
        dot: "orange",
        badge: "Sélectionné",
        badgeTone: "orange",
        editableStepIndex: s._idx,
        currentStepType: s.step,
        isCustom: true,
      };
    })
    .filter(Boolean);

  const juniorCompanySteps = steps
    .map((s, idx) => ({ ...s, _idx: idx }))
    .filter((s) => s.step === "junior")
    .map((s) => {
      const t = companyTypeById[s.companyTypeId];
      if (!t) return null;
      return {
        key: `junior-company-${s._idx}-${t.id}`,
        title: `Premier emploi (Junior) - ${t.title}`,
        subtitle: t.subtitle,
        right: DURATIONS.junior,
        dot: "blue",
        badge: "Sélectionné",
        badgeTone: "orange",
        editableStepIndex: s._idx,
        currentStepType: s.step,
        isCustom: true,
      };
    })
    .filter(Boolean);

  const interCompanySteps = steps
    .map((s, idx) => ({ ...s, _idx: idx }))
    .filter((s) => s.step === "inter")
    .map((s) => {
      const t = companyTypeById[s.companyTypeId];
      if (!t) return null;
      return {
        key: `inter-company-${s._idx}-${t.id}`,
        title: `Poste intermédiaire - ${t.title}`,
        subtitle: t.subtitle,
        right: DURATIONS.montee,
        dot: "orange",
        badge: "Sélectionné",
        badgeTone: "orange",
        editableStepIndex: s._idx,
        currentStepType: s.step,
        isCustom: true,
      };
    })
    .filter(Boolean);

  const formationInitStep = {
    key: "formationInit",
    title: "Formation initiale",
    subtitle: "Acquérir les bases techniques et théoriques du métier",
    right: DURATIONS.formationInit,
    dot: "orange",
    badge: null,
  };

  const formationChoisieStep = {
    key: "formationChoisie",
    title: firstValidatedFormation?.name || "M2 Data Science (Université)",
    subtitle: firstValidatedFormation
      ? `${firstValidatedFormation.kind} · ${firstValidatedFormation.location}`
      : "Master · France (Sorbonne, PSL, Paris-Saclay…)",
    right: firstValidatedFormation?.duration || "2 ans",
    dot: "green",
    badge: firstValidatedFormation ? "Validé" : null,
    badgeTone: "green",
  };

  const genericStageStep = {
    key: "stageAlt",
    title: "Premier stage / Alternance",
    subtitle: "Première expérience professionnelle en entreprise",
    right: DURATIONS.stageAlt,
    dot: "blue",
    badge: null,
  };

  const freelanceStep = {
    key: "freelance",
    title: "Stage en Freelance / Indépendant",
    subtitle: "Autonomie complète et choix des projets",
    right: DURATIONS.stageFreelance,
    dot: "orange",
    badge: hasFreelanceStage ? "Validé" : null,
    badgeTone: "green",
  };

  const juniorStep = {
    key: "junior",
    title: "Premier emploi (Junior)",
    subtitle: "Développer ses compétences sur des projets réels",
    right: DURATIONS.junior,
    dot: "blue",
    badge: hasJunior ? "Validé" : null,
    badgeTone: "green",
  };

  const monteeStep = {
    key: "montee",
    title: "Montée en compétences",
    subtitle: "Devenir autonome et expert dans son domaine",
    right: DURATIONS.montee,
    dot: "orange",
    badge: hasInter ? "Validé" : null,
    badgeTone: "green",
  };

  const seniorStep = {
    key: "senior",
    title: `${job.title} Senior`,
    subtitle: "Leadership technique et mentorat",
    right: DURATIONS.senior,
    dot: "blue",
    badge: null,
  };

  const timelineSteps = [
    formationInitStep,
    formationChoisieStep,
    ...(hasStageOrAlt ? [] : [genericStageStep]), // on enlève l'étape générique dès qu'il y a un stage/alt
    ...stageCompanySteps,
    ...altCompanySteps,
    freelanceStep,
    juniorStep,
    ...juniorCompanySteps,
    monteeStep,
    ...interCompanySteps,
    seniorStep,
  ];

  /* ------------ application des filtres formations ------------ */

  const filteredFormations = useMemo(() => {
    return job.formations.filter((f) => {
      // filtre localisation
      if (locationFilter !== "all") {
        const loc = (f.location || "").toLowerCase();
        if (!loc.includes(locationFilter.toLowerCase())) return false;
      }

      // filtre prix
      const yearly = parseCostToYearlyNumber(f.cost);

      if (priceFilter === "lt5k" && !(yearly < 5000)) return false;
      if (priceFilter === "5k-10k" && !(yearly >= 5000 && yearly <= 10000))
        return false;
      if (priceFilter === "gt10k" && !(yearly > 10000)) return false;

      return true;
    });
  }, [job.formations, locationFilter, priceFilter]);

  const locationLabel = (() => {
    switch (locationFilter) {
      case "paris":
        return "Paris";
      case "lyon":
        return "Lyon";
      case "bordeaux":
        return "Bordeaux";
      case "marseille":
        return "Marseille";
      default:
        return "Toutes";
    }
  })();

  const priceLabel = (() => {
    switch (priceFilter) {
      case "lt5k":
        return "Moins de 5 000€";
      case "5k-10k":
        return "5 000€ - 10 000€";
      case "gt10k":
        return "Plus de 10 000€";
      default:
        return "Tous les prix";
    }
  })();

  function formatTime(ts) {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /* ---------------------- Génération du PDF ---------------------- */

  function exportPdf() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 40;

    // Bandeau orange
    doc.setFillColor(255, 122, 89);
    doc.rect(0, 0, pageWidth, 80, "F");

    // Titre PathFinder
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("PathFinder", marginX, 40);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Ton orientation professionnelle personnalisée", marginX, 60);

    // Badge rapport
    const badgeWidth = 160;
    doc.setFillColor(255, 185, 145);
    doc.roundedRect(
      pageWidth - badgeWidth - marginX,
      25,
      badgeWidth,
      30,
      4,
      4,
      "F"
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("RAPPORT PARCOURS", pageWidth - badgeWidth - marginX + 18, 45);

    // Date
    let y = 110;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(9);
    const dateStr = new Date().toLocaleDateString("fr-FR");
    doc.text(`Généré le ${dateStr}`, marginX, y);
    y += 25;

    // Ligne
    doc.setDrawColor(220, 220, 220);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 25;

    // Titre parcours classique
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 72, 180);
    doc.setFontSize(14);
    doc.text("Parcours classique vers ce métier", marginX, y);
    y += 18;

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(job.title, marginX, y);
    y += 22;

    // Étapes
    timelineSteps.forEach((step, idx) => {
      if (y > 720) {
        doc.addPage();
        y = 80;
      }

      // Pastille (on garde le même orange dans le PDF)
      doc.setFillColor(255, 122, 89);
      doc.circle(marginX + 4, y - 4, 3, "F");

      // Titre étape
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text(`${idx + 1}. ${step.title}`, marginX + 15, y);

      // Durée à droite
      doc.setFontSize(9);
      doc.setTextColor(255, 122, 89);
      const txt = step.right || "";
      const txtW = doc.getTextWidth(txt);
      doc.text(txt, pageWidth - marginX - txtW, y);

      // Sous-titre
      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 90, 90);
      doc.setFontSize(9);
      doc.text(step.subtitle, marginX + 15, y + 12);

      y += 32;
    });

    // Nouvelle page : formations populaires
    doc.addPage();
    let y2 = 80;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(41, 82, 204);
    doc.text("Formations populaires pour ce métier", marginX, y2);
    y2 += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(
      "Répartition des professionnels en activité par formation",
      marginX,
      y2
    );
    y2 += 35;

    const boxHeight = 90;
    const gap = 10;
    const usableWidth = pageWidth - marginX * 2;

    const colors = [
      [255, 122, 89],
      [40, 76, 214],
      [255, 166, 135],
      [72, 92, 230],
      [255, 188, 160],
    ];

    const totalPct =
      job.formations.reduce(
        (acc, f) => acc + (f.marketStat?.pct || 0),
        0
      ) || 1;

    let currentX = marginX;
    let currentY = y2;

    job.formations.forEach((f, idx) => {
      const pct = f.marketStat?.pct || 0;
      let width = (pct / totalPct) * usableWidth;
      if (width < 90) width = 90;

      if (currentX + width > pageWidth - marginX) {
        currentX = marginX;
        currentY += boxHeight + gap;
      }

      const [r, g, b] = colors[idx % colors.length];
      doc.setFillColor(r, g, b);
      doc.roundedRect(currentX, currentY, width, boxHeight, 8, 8, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`#${idx + 1}`, currentX + 10, currentY + 18);
      doc.setFontSize(12);
      doc.text(f.name, currentX + 10, currentY + 36);
      doc.setFontSize(18);
      doc.text(`${pct}%`, currentX + 10, currentY + 58);
      doc.setFontSize(8);
      doc.text("des professionnels", currentX + 10, currentY + 72);

      currentX += width + gap;
    });

    doc.save(`PathFinder_${job.id}_parcours.pdf`);
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header + actions */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">{job.title}</div>
          <div className="text-sm text-gray-600">{job.badge}</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profil")}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
          >
            <span className="inline-block h-5 w-5 rounded-md bg-gray-100 grid place-items-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path
                  d="M12 2a5 5 0 0 1 5 5c0 2.76-2.24 5-5 5s-5-2.24-5-5a5 5 0 0 1 5-5Zm0 12c3.31 0 6 2.24 6 5v1H6v-1c0-2.76 2.69-5 6-5Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Profil
          </button>

          <button
            onClick={savePath}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          >
            <span className="inline-block h-5 w-5 rounded-md bg-white/25 grid place-items-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M17 3H7a2 2 0 0 0-2 2v14h14V7l-2-4Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Enregistrer
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="mt-4 flex flex-wrap gap-3 items-center relative">
        <button className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-sm">
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path d="M3 4h18l-7 8v6l-4 2v-8L3 4Z" fill="currentColor" />
          </svg>
          Filtres
        </button>

        {/* Localisation */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowLocationMenu((v) => !v);
              setShowPriceMenu(false);
            }}
            className="inline-flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-1.5 text-sm"
          >
            <span className="text-base">📍</span>
            <span>{locationLabel}</span>
            <span className="text-xs">▾</span>
          </button>

          {showLocationMenu && (
            <div className="absolute z-20 mt-2 w-40 rounded-xl border bg-white shadow-lg text-sm">
              {[
                { id: "all", label: "Toutes" },
                { id: "paris", label: "Paris" },
                { id: "lyon", label: "Lyon" },
                { id: "bordeaux", label: "Bordeaux" },
                { id: "marseille", label: "Marseille" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setLocationFilter(opt.id);
                    setShowLocationMenu(false);
                  }}
                  className={`block w-full text-left px-3 py-2 hover:bg-gray-50 ${
                    locationFilter === opt.id ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Prix */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowPriceMenu((v) => !v);
              setShowLocationMenu(false);
            }}
            className="inline-flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-1.5 text-sm"
          >
            <span className="text-base">💶</span>
            <span>{priceLabel}</span>
            <span className="text-xs">▾</span>
          </button>

          {showPriceMenu && (
            <div className="absolute z-20 mt-2 w-56 rounded-xl border bg-white shadow-lg text-sm">
              {[
                { id: "all", label: "Tous les prix" },
                { id: "lt5k", label: "Moins de 5 000€" },
                { id: "5k-10k", label: "5 000€ - 10 000€" },
                { id: "gt10k", label: "Plus de 10 000€" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setPriceFilter(opt.id);
                    setShowPriceMenu(false);
                  }}
                  className={`block w-full text-left px-3 py-2 hover:bg-gray-50 ${
                    priceFilter === opt.id ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats métier */}
      <section className="mt-6 rounded-2xl border bg-gradient-to-r from-indigo-50 to-orange-50 p-5">
        <div className="text-gray-900 font-semibold">
          Statistiques du métier de {job.title}
        </div>
        <p className="mt-2 text-sm text-gray-700">{job.market.hires}</p>
        <div className="mt-4 rounded-xl bg-orange-100/60 text-orange-900 p-4 flex items-center justify-between">
          <div className="font-medium">{job.market.demand}</div>
          <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">
            ✔ {job.market.trend}
          </span>
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Parcours classique vers ce métier
        </h2>

        <ul className="relative pl-28 space-y-12">
          <span
            aria-hidden
            className="pointer-events-none absolute left-9 top-0 bottom-0 w-[3px] bg-gradient-to-b from-orange-400 via-blue-400 to-orange-400"
          />

          {timelineSteps.map((step) => {
            const isCustom = !!step.isCustom;

            let dotColorClass = "";
            if (step.dot === "orange") {
              dotColorClass =
                step.key === "formationInit"
                  ? "border-orange-500"
                  : "border-orange-300";
            } else if (step.dot === "blue") {
              dotColorClass = "border-blue-300";
            } else if (step.dot === "green") {
              dotColorClass = "border-green-500 bg-green-500";
            }

            return (
              <li key={step.key} className="relative pl-16 md:pl-20">
                <span
                  aria-hidden
                  className={[
                    "absolute left-6 top-[2px] h-6 w-6 rounded-full bg-white border-[5px]",
                    dotColorClass,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />

                <div
                  className={[
                    "flex items-start justify-between gap-8 ml-0",
                    isCustom
                      ? "rounded-2xl border border-orange-100 bg-orange-50/40 px-4 py-3"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`font-semibold ${
                          isCustom ? "text-base" : "text-lg"
                        }`}
                      >
                        {step.title}
                      </div>
                      {step.badge && (
                        <span
                          className={[
                            "inline-flex items-center rounded-full text-xs px-2 py-0.5",
                            step.badgeTone === "orange"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {step.badge}
                        </span>
                      )}
                    </div>

                    <div className="text-gray-600 text-sm">
                      {step.subtitle}
                    </div>

                    {/* Boutons modifier / supprimer pour les étapes éditables */}
                    {typeof step.editableStepIndex === "number" && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-gray-500">Étape :</span>
                        <select
                          className="rounded-lg border bg-white px-2 py-1 text-xs"
                          value={step.currentStepType}
                          onChange={(e) =>
                            updateStep(step.editableStepIndex, e.target.value)
                          }
                        >
                          {STEP_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteStep(step.editableStepIndex)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-700 hover:bg-red-100"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="shrink-0 rounded-full bg-gray-100 text-gray-700 text-xs px-3 py-1">
                    {step.right}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Formations */}
      <section className="mt-8">
        <div className="text-gray-900 font-semibold">
          Formations disponibles
        </div>
        <p className="text-sm text-gray-600">
          Sélectionne la formation qui correspond le mieux à ton projet
        </p>

        <div className="mt-4 space-y-6">
          {filteredFormations.length === 0 && (
            <div className="text-sm text-gray-500">
              Aucune formation ne correspond à ces filtres.
            </div>
          )}

          {filteredFormations.map((f) => {
            const isValidated = validatedFormationId === f.id;
            const isSelected = selectedFormationId === f.id;

            return (
              <div
                key={f.id}
                className="rounded-2xl border-2 border-orange-300 bg-orange-50/40 p-0 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-semibold">{f.name}</div>
                      {isValidated && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          <Check />
                          Validé
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2">
                    <Badge>{f.kind}</Badge>
                  </div>

                  <p className="mt-3 text-gray-700">{f.desc}</p>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <div className="text-sm text-gray-500">Durée</div>
                      <div className="font-medium">{f.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Coût</div>
                      <div className="font-medium">{f.cost}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Localisation</div>
                      <div className="font-medium">{f.location}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Admission</div>
                      <div className="font-medium">{f.admission}</div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-indigo-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-indigo-900">
                        Statistiques du marché
                      </div>
                      <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs">
                        {f.marketStat.trend}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-indigo-900/90">
                      {f.marketStat.label}
                    </div>
                    <StatBar pct={f.marketStat.pct} />
                    <div className="text-right text-xs text-indigo-900/70 mt-1">
                      {f.marketStat.pct}%
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  {isValidated ? (
                    <div className="rounded-xl bg-green-200/70 text-green-900 px-4 py-3 font-medium grid place-items-center">
                      <span className="inline-flex items-center gap-2">
                        <Check /> Formation validée
                      </span>
                    </div>
                  ) : isSelected ? (
                    <button
                      onClick={() => validateFormation(f.id)}
                      className="w-full rounded-xl bg-orange-500 text-white py-3 font-medium hover:bg-orange-600"
                    >
                      Valider cette formation
                    </button>
                  ) : (
                    <button
                      onClick={() => selectFormation(f.id)}
                      className="w-full rounded-xl border border-blue-500 text-blue-600 py-3 font-medium bg-white hover:bg-blue-50"
                    >
                      Sélectionner
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Les étapes de ton parcours + Types d’entreprises */}
      <section className="mt-10">
        <div className="text-gray-900 font-semibold">
          Types d&apos;entreprises
        </div>
        <p className="text-sm text-gray-600">
          Choisis le type d&apos;entreprise qui correspond à tes aspirations.
          Tu peux ajouter chaque type à différentes étapes de ton parcours :
          <b> Stage</b> (courte durée), <b>Alternance</b> (formation longue),{" "}
          <b>Junior</b> ou <b>Intermédiaire</b>.
        </p>

        {/* Bloc "Les étapes de ton parcours" */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-orange-50 to-pink-50 p-5 border border-orange-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎓</span>
            <div className="font-semibold text-gray-900">
              Les étapes de ton parcours professionnel
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-800">
            <div>
              <div className="flex items-center gap-2 font-semibold mb-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Stage
              </div>
              <ul className="list-disc ml-5 space-y-1">
                <li>Durée : 3 à 6 mois</li>
                <li>Découverte du métier</li>
                <li>Mission ponctuelle</li>
                <li>Gratification minimum</li>
                <li>Pendant les études</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold mb-1">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Alternance
              </div>
              <ul className="list-disc ml-5 space-y-1">
                <li>Durée : 1 à 2 ans</li>
                <li>Formation diplômante</li>
                <li>Contrat pro / apprentissage</li>
                <li>Rémunération complète</li>
                <li>Frais de formation pris en charge</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold mb-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Junior
              </div>
              <ul className="list-disc ml-5 space-y-1">
                <li>Durée : 1 à 2 ans</li>
                <li>Premier emploi (CDI/CDD)</li>
                <li>Accompagnement &amp; formation</li>
                <li>Salaire : 28k–40k€/an</li>
                <li>Développer autonomie</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold mb-1">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Intermédiaire
              </div>
              <ul className="list-disc ml-5 space-y-1">
                <li>Durée : 2 à 3 ans</li>
                <li>Poste confirmé</li>
                <li>Autonomie complète</li>
                <li>Salaire : 40k–55k€/an</li>
                <li>Mentorat &amp; leadership</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Ajoute-les à une étape : <b>Stage</b>, <b>Alternance</b>, <b>Junior</b>{" "}
          ou <b>Intermédiaire</b>. Tu peux ensuite gérer les étapes directement
          dans le parcours ci-dessus.
        </p>

        <div className="mt-5 space-y-8">
          {job.companyTypes.map((t) => (
            <div key={t.id} className="rounded-2xl border bg-white">
              <div className="p-5">
                <div className="inline-flex items-center gap-2">
                  <span className="text-xl">{t.icon}</span>
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-gray-600">{t.subtitle}</div>
                    <div className="text-xs text-gray-500">
                      Exemples : {t.examples}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="rounded-xl bg-green-50 p-4">
                    <div className="font-medium text-green-900">
                      Avantages
                    </div>
                    <ul className="mt-2 text-sm text-green-800 list-disc ml-5">
                      {t.pros.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-4">
                    <div className="font-medium text-amber-900">
                      Points d&apos;attention
                    </div>
                    <ul className="mt-2 text-sm text-amber-800 list-disc ml-5">
                      {t.cons.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-sm font-medium text-gray-900">
                    Entreprises dans ce domaine :
                  </div>
                  <div className="mt-2 grid md:grid-cols-2 gap-3">
                    {t.companies.map((c) => (
                      <div key={c} className="rounded-xl bg-gray-50 px-4 py-3">
                        {c}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-orange-50 p-4">
                  <div className="text-sm font-medium text-gray-900">
                    Statistiques du marché
                  </div>
                  <div className="mt-3 text-sm text-gray-800">
                    Ont fait un stage dans ce type d&apos;entreprise
                  </div>
                  <StatBar pct={t.market.stagePct} color="bg-blue-600" />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {t.market.stagePct}%
                  </div>

                  <div className="mt-3 text-sm text-gray-800">
                    Travaillent actuellement dans ce type
                  </div>
                  <StatBar pct={t.market.workPct} color="bg-orange-500" />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {t.market.workPct}%
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Ajouter ce type d&apos;entreprise à quelle étape ?
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <button
                      onClick={() => addStep(t.id, "stage")}
                      className="rounded-xl border bg-white px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <div className="font-medium">Stage</div>
                      <div className="text-xs text-gray-500">3–6 mois</div>
                    </button>
                    <button
                      onClick={() => addStep(t.id, "alt")}
                      className="rounded-xl border bg-white px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <div className="font-medium">Alternance</div>
                      <div className="text-xs text-gray-500">1–2 ans</div>
                    </button>
                    <button
                      onClick={() => addStep(t.id, "junior")}
                      className="rounded-xl border bg-white px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <div className="font-medium">Junior</div>
                      <div className="text-xs text-gray-500">1–2 ans</div>
                    </button>
                    <button
                      onClick={() => addStep(t.id, "inter")}
                      className="rounded-xl border bg-white px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <div className="font-medium">Intermédiaire</div>
                      <div className="text-xs text-gray-500">2–3 ans</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sauvegarde & export */}
      <section className="mt-10 rounded-2xl border border-orange-100 bg-orange-50/40 px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              ✓
            </span>
            <span className="text-gray-700">
              Dernière sauvegarde :{" "}
              <span className="font-medium">
                {lastSavedAt ? formatTime(lastSavedAt) : "—"}
              </span>
            </span>
          </div>
          <div className="mt-3">
            <div className="font-semibold text-gray-900">
              Sauvegarde et export
            </div>
            <p className="text-sm text-gray-600">
              Enregistre ton parcours ou télécharge-le en PDF.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={savePath}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path
                  d="M17 3H7a2 2 0 0 0-2 2v14h14V7l-2-4Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Enregistrer
          </button>

          <button
            onClick={exportPdf}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path
                  d="M12 3v12.17l3.59-3.58L17 13l-5 5-5-5 1.41-1.41L11 15.17V3h1Zm-7 16h14v2H5v-2Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            PDF
          </button>
        </div>
      </section>

      {!!toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-xl bg-emerald-900 text-white px-4 py-2 shadow-lg text-sm">
            {toast}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border bg-white px-4 py-2 hover:bg-gray-50"
        >
          ← Retour
        </button>
      </div>
    </div>
  );
}