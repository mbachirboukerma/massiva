export type BacSerie = "SN" | "LN" | "SE" | "TM";
export type DiplomaType = "Doctorat" | "Master" | "Licence" | "Ingéniorat";
export type Confidence = "Stable" | "Volatile" | "Trending Up" | "Trending Down";
export type CareerIconKey =
  | "stethoscope" | "pill" | "tooth" | "code" | "building" | "ruler"
  | "trending" | "briefcase" | "languages" | "globe" | "zap";

/** Aligns with form interest picker ids */
export type InterestTag =
  | "sciences" | "sante" | "tech" | "langues" | "art" | "business"
  | "ingenierie" | "social" | "lettres" | "international";

/** Aligns with form goal picker ids */
export type GoalTag = "salary" | "stability" | "abroad" | "passion";

export type SectorTag = "health" | "tech" | "engineering" | "business" | "languages" | "design";

export interface Career {
  name: string;
  duration: string;
  /** translation keys (preferred for display) */
  nameKey?: string;
  durationKey?: string;
}

export interface Specialty {
  id: number;
  name: string;
  /** stable group identifier used for collision detection (language-independent) */
  nameGroup: string;
  fullTitle: string;
  diplomaType: DiplomaType;
  duration: number;
  series: BacSerie[];
  thresholds: Record<number, number>;
  predicted2027: number;
  confidence: Confidence;
  places: number;
  city: string;
  university: string;
  description: string;
  careers: Career[];
  warnings: string[];
  iconKey: CareerIconKey;
  estimatedSalary: number;
  stability: 1 | 2 | 3 | 4 | 5;
  competition: 1 | 2 | 3 | 4 | 5;
  internationalOpportunity: 1 | 2 | 3 | 4 | 5;
  /** Recommendation engine tags */
  interestTags: InterestTag[];
  goalTags: GoalTag[];
  sectorTags: SectorTag[];
  // ----- translation keys (preferred when rendering) -----
  nameKey: string;
  fullTitleKey: string;
  descriptionKey: string;
  universityKey: string;
  cityKey: string;
  warningKeys: string[];
}

export const bacSeries: { code: BacSerie; name: string; label: string; nameKey: string; labelKey: string }[] = [
  { code: "SN", name: "Sciences Naturelles",        label: "SN — Sciences Naturelles",        nameKey: "serie.SN.name", labelKey: "serie.SN.label" },
  { code: "LN", name: "Langues",                    label: "LN — Langues",                    nameKey: "serie.LN.name", labelKey: "serie.LN.label" },
  { code: "SE", name: "Sciences Économiques",       label: "SE — Sciences Économiques",       nameKey: "serie.SE.name", labelKey: "serie.SE.label" },
  { code: "TM", name: "Techniques Mathématiques",   label: "TM — Techniques Mathématiques",   nameKey: "serie.TM.name", labelKey: "serie.TM.label" },
];

function S(
  base: {
    id: number; name: string; nameGroup: string; fullTitle: string; diplomaType: DiplomaType;
    duration: number; series: BacSerie[]; thresholds: Record<number, number>; predicted2027: number;
    confidence: Confidence; places: number; city: string; university: string; description: string;
    careers: Array<{ name: string; duration: string }>; warnings: string[]; iconKey: CareerIconKey;
    estimatedSalary: number; stability: 1 | 2 | 3 | 4 | 5; competition: 1 | 2 | 3 | 4 | 5;
    internationalOpportunity: 1 | 2 | 3 | 4 | 5;
    interestTags: InterestTag[];
    goalTags: GoalTag[];
    sectorTags: SectorTag[];
  },
): Specialty {
  const careers: Career[] = base.careers.map((c, i) => ({
    name: c.name,
    duration: c.duration,
    nameKey: `spec.${base.id}.c${i + 1}.n`,
    durationKey: `spec.${base.id}.c${i + 1}.d`,
  }));
  const warningKeys = base.warnings.map((_, i) => `spec.${base.id}.w${i + 1}`);
  return {
    ...base,
    careers,
    warningKeys,
    nameKey: `spec.${base.id}.name`,
    fullTitleKey: `spec.${base.id}.full`,
    descriptionKey: `spec.${base.id}.desc`,
    universityKey: `spec.${base.id}.uni`,
    cityKey: `city.${base.city}`,
  };
}

export const specialties: Specialty[] = [
  S({
    id: 1, name: "Médecine", nameGroup: "medicine", fullTitle: "Doctorat en Médecine", diplomaType: "Doctorat", duration: 7,
    series: ["SN"],
    thresholds: { 2020: 15.2, 2021: 15.5, 2022: 15.8, 2023: 16.1, 2024: 15.9, 2025: 16.2 },
    predicted2027: 16.4, confidence: "Stable", places: 1200, city: "Alger",
    university: "Université d'Alger 1 — Benyoucef Benkhedda",
    description: "Formation de médecins généralistes avec résidanat obligatoire.",
    careers: [
      { name: "Étudiant en médecine", duration: "7 ans" },
      { name: "Résidanat", duration: "2 ans" },
      { name: "Spécialisation", duration: "4–5 ans" },
      { name: "Médecin spécialiste", duration: "Carrière" },
    ],
    warnings: [], iconKey: "stethoscope",
    estimatedSalary: 180, stability: 5, competition: 5, internationalOpportunity: 5,
    interestTags: ["sciences", "sante", "social"], goalTags: ["stability", "salary", "passion"], sectorTags: ["health"],
  }),
  S({
    id: 2, name: "Pharmacie", nameGroup: "pharmacy", fullTitle: "Doctorat en Pharmacie", diplomaType: "Doctorat", duration: 5,
    series: ["SN"],
    thresholds: { 2020: 14.0, 2021: 14.2, 2022: 14.5, 2023: 14.8, 2024: 14.3, 2025: 14.6 },
    predicted2027: 14.8, confidence: "Trending Up", places: 400, city: "Alger", university: "USTHB",
    description: "Science du médicament, officine, industrie pharmaceutique.",
    careers: [
      { name: "Étudiant en pharmacie", duration: "5 ans" },
      { name: "Pharmacien d'officine", duration: "Direct" },
      { name: "Pharmacien industriel", duration: "+ Master" },
    ],
    warnings: [], iconKey: "pill",
    estimatedSalary: 140, stability: 5, competition: 4, internationalOpportunity: 4,
    interestTags: ["sciences", "sante"], goalTags: ["stability", "salary"], sectorTags: ["health"],
  }),
  S({
    id: 3, name: "Médecine Dentaire", nameGroup: "dentistry", fullTitle: "Doctorat en Médecine Dentaire", diplomaType: "Doctorat", duration: 6,
    series: ["SN"],
    thresholds: { 2020: 14.5, 2021: 14.7, 2022: 15.0, 2023: 15.3, 2024: 15.1, 2025: 15.4 },
    predicted2027: 15.5, confidence: "Stable", places: 500, city: "Constantine",
    university: "Université Constantine 3",
    description: "Chirurgie dentaire, orthodontie et soins bucco-dentaires.",
    careers: [
      { name: "Étudiant en dentaire", duration: "6 ans" },
      { name: "Dentiste généraliste", duration: "Direct" },
      { name: "Orthodontiste", duration: "+ Spécialisation" },
    ],
    warnings: [], iconKey: "tooth",
    estimatedSalary: 160, stability: 5, competition: 4, internationalOpportunity: 4,
    interestTags: ["sciences", "sante"], goalTags: ["stability", "salary"], sectorTags: ["health"],
  }),
  S({
    id: 4, name: "Informatique", nameGroup: "cs", fullTitle: "Ingéniorat d'État en Informatique", diplomaType: "Ingéniorat", duration: 5,
    series: ["SN", "TM"],
    thresholds: { 2020: 13.8, 2021: 14.1, 2022: 14.4, 2023: 14.8, 2024: 15.0, 2025: 15.3 },
    predicted2027: 15.6, confidence: "Trending Up", places: 600, city: "Alger",
    university: "ESI — École Supérieure d'Informatique",
    description: "Génie logiciel, IA, cybersécurité — formation d'ingénieur en 5 ans.",
    careers: [
      { name: "Élève ingénieur", duration: "5 ans" },
      { name: "Ingénieur logiciel", duration: "Direct" },
      { name: "Architecte / CTO", duration: "+ Expérience" },
    ],
    warnings: ["Même nom, diplôme différent"], iconKey: "code",
    estimatedSalary: 150, stability: 4, competition: 4, internationalOpportunity: 5,
    interestTags: ["tech", "ingenierie", "sciences"], goalTags: ["salary", "abroad"], sectorTags: ["tech"],
  }),
  S({
    id: 5, name: "Informatique", nameGroup: "cs", fullTitle: "Licence en Informatique", diplomaType: "Licence", duration: 3,
    series: ["SN", "TM"],
    thresholds: { 2020: 11.5, 2021: 11.8, 2022: 12.0, 2023: 12.3, 2024: 12.5, 2025: 12.8 },
    predicted2027: 13.0, confidence: "Trending Up", places: 2500, city: "Oran",
    university: "USTO — Mohamed Boudiaf",
    description: "Licence générale en informatique, débouche sur Master.",
    careers: [
      { name: "Étudiant Licence", duration: "3 ans" },
      { name: "Master Informatique", duration: "+ 2 ans" },
      { name: "Développeur", duration: "Direct après Licence" },
    ],
    warnings: ["Même nom, diplôme différent"], iconKey: "code",
    estimatedSalary: 90, stability: 4, competition: 3, internationalOpportunity: 5,
    interestTags: ["tech", "sciences"], goalTags: ["salary", "abroad", "passion"], sectorTags: ["tech"],
  }),
  S({
    id: 6, name: "Génie Civil", nameGroup: "civil", fullTitle: "Ingéniorat en Génie Civil", diplomaType: "Ingéniorat", duration: 5,
    series: ["SN", "TM"],
    thresholds: { 2020: 13.2, 2021: 13.0, 2022: 13.4, 2023: 13.6, 2024: 13.3, 2025: 13.5 },
    predicted2027: 13.6, confidence: "Volatile", places: 800, city: "Alger",
    university: "ENP — École Nationale Polytechnique",
    description: "Construction, ouvrages d'art, hydraulique, structures.",
    careers: [
      { name: "Élève ingénieur", duration: "5 ans" },
      { name: "Ingénieur d'études", duration: "Direct" },
      { name: "Chef de projet", duration: "+ 5 ans expérience" },
    ],
    warnings: [], iconKey: "building",
    estimatedSalary: 110, stability: 4, competition: 3, internationalOpportunity: 4,
    interestTags: ["ingenierie", "sciences"], goalTags: ["stability", "salary"], sectorTags: ["engineering"],
  }),
  S({
    id: 7, name: "Architecture", nameGroup: "architecture", fullTitle: "Master en Architecture", diplomaType: "Master", duration: 6,
    series: ["SN", "TM"],
    thresholds: { 2020: 13.5, 2021: 13.7, 2022: 13.9, 2023: 14.0, 2024: 13.8, 2025: 14.1 },
    predicted2027: 14.2, confidence: "Stable", places: 450, city: "Alger",
    university: "EPAU — École Polytechnique d'Architecture",
    description: "Conception architecturale, urbanisme, patrimoine bâti.",
    careers: [
      { name: "Étudiant en architecture", duration: "6 ans" },
      { name: "Architecte agréé", duration: "+ Stage HMONP" },
      { name: "Architecte associé", duration: "Carrière" },
    ],
    warnings: [], iconKey: "ruler",
    estimatedSalary: 120, stability: 4, competition: 3, internationalOpportunity: 4,
    interestTags: ["art", "ingenierie"], goalTags: ["passion", "abroad"], sectorTags: ["design", "engineering"],
  }),
  S({
    id: 8, name: "Sciences Économiques", nameGroup: "economics", fullTitle: "Licence en Sciences Économiques", diplomaType: "Licence", duration: 3,
    series: ["SE", "TM"],
    thresholds: { 2020: 10.5, 2021: 10.8, 2022: 11.0, 2023: 11.2, 2024: 11.0, 2025: 11.3 },
    predicted2027: 11.4, confidence: "Stable", places: 3000, city: "Alger",
    university: "Université d'Alger 3",
    description: "Macro/micro-économie, finance, statistiques économiques.",
    careers: [
      { name: "Étudiant Licence", duration: "3 ans" },
      { name: "Master en Finance", duration: "+ 2 ans" },
      { name: "Analyste / Économiste", duration: "Direct" },
    ],
    warnings: [], iconKey: "trending",
    estimatedSalary: 85, stability: 3, competition: 2, internationalOpportunity: 3,
    interestTags: ["business", "sciences"], goalTags: ["salary", "stability"], sectorTags: ["business"],
  }),
  S({
    id: 9, name: "Sciences Commerciales", nameGroup: "business", fullTitle: "Master en Sciences Commerciales", diplomaType: "Master", duration: 5,
    series: ["SE", "TM", "LN"],
    thresholds: { 2020: 11.2, 2021: 11.5, 2022: 11.8, 2023: 12.0, 2024: 12.2, 2025: 12.5 },
    predicted2027: 12.8, confidence: "Trending Up", places: 1500, city: "Alger",
    university: "ESC — École Supérieure de Commerce",
    description: "Marketing, management, commerce international.",
    careers: [
      { name: "Étudiant ESC", duration: "5 ans" },
      { name: "Cadre commercial", duration: "Direct" },
      { name: "Directeur marketing", duration: "+ Expérience" },
    ],
    warnings: [], iconKey: "briefcase",
    estimatedSalary: 130, stability: 3, competition: 3, internationalOpportunity: 4,
    interestTags: ["business", "international", "langues"], goalTags: ["salary", "abroad"], sectorTags: ["business"],
  }),
  S({
    id: 10, name: "Langue Anglaise", nameGroup: "english", fullTitle: "Licence en Langue et Littérature Anglaise", diplomaType: "Licence", duration: 3,
    series: ["LN"],
    thresholds: { 2020: 11.0, 2021: 11.3, 2022: 11.5, 2023: 11.8, 2024: 12.0, 2025: 12.3 },
    predicted2027: 12.5, confidence: "Trending Up", places: 2000, city: "Oran",
    university: "Université d'Oran 2",
    description: "Linguistique, civilisation et littérature anglophone.",
    careers: [
      { name: "Étudiant Licence", duration: "3 ans" },
      { name: "Enseignant / Traducteur", duration: "Direct" },
      { name: "Master / Doctorat", duration: "+ 2–5 ans" },
    ],
    warnings: [], iconKey: "languages",
    estimatedSalary: 75, stability: 4, competition: 2, internationalOpportunity: 5,
    interestTags: ["langues", "lettres", "international"], goalTags: ["abroad", "stability"], sectorTags: ["languages"],
  }),
  S({
    id: 11, name: "Traduction", nameGroup: "translation", fullTitle: "Licence en Traduction (Arabe-Français-Anglais)", diplomaType: "Licence", duration: 3,
    series: ["LN"],
    thresholds: { 2020: 12.0, 2021: 12.3, 2022: 12.5, 2023: 12.7, 2024: 13.0, 2025: 13.2 },
    predicted2027: 13.4, confidence: "Stable", places: 800, city: "Alger",
    university: "Université d'Alger 2",
    description: "Traduction trilingue spécialisée et interprétariat.",
    careers: [
      { name: "Étudiant Licence", duration: "3 ans" },
      { name: "Traducteur assermenté", duration: "+ Concours" },
      { name: "Interprète de conférence", duration: "+ Master" },
    ],
    warnings: [], iconKey: "globe",
    estimatedSalary: 90, stability: 3, competition: 3, internationalOpportunity: 5,
    interestTags: ["langues", "international", "lettres"], goalTags: ["abroad", "stability"], sectorTags: ["languages"],
  }),
  S({
    id: 12, name: "Génie Électrique", nameGroup: "electrical", fullTitle: "Ingéniorat en Génie Électrique", diplomaType: "Ingéniorat", duration: 5,
    series: ["SN", "TM"],
    thresholds: { 2020: 13.0, 2021: 13.2, 2022: 13.1, 2023: 13.4, 2024: 13.6, 2025: 13.8 },
    predicted2027: 14.0, confidence: "Trending Up", places: 700, city: "Alger",
    university: "ENP — École Nationale Polytechnique",
    description: "Énergies, automatique, électronique de puissance.",
    careers: [
      { name: "Élève ingénieur", duration: "5 ans" },
      { name: "Ingénieur Sonelgaz", duration: "Direct" },
      { name: "Expert énergies renouvelables", duration: "+ Master" },
    ],
    warnings: [], iconKey: "zap",
    estimatedSalary: 120, stability: 5, competition: 3, internationalOpportunity: 4,
    interestTags: ["tech", "ingenierie", "sciences"], goalTags: ["salary", "stability"], sectorTags: ["engineering", "tech"],
  }),
];

export function specialtyById(id: number): Specialty | undefined {
  return specialties.find((s) => s.id === id);
}

export function findSameNameCollisions(): Map<string, Specialty[]> {
  const groups = new Map<string, Specialty[]>();
  for (const s of specialties) {
    const list = groups.get(s.nameGroup) ?? [];
    list.push(s);
    groups.set(s.nameGroup, list);
  }
  for (const [g, list] of groups) {
    const diplomas = new Set(list.map((s) => s.diplomaType));
    if (list.length < 2 || diplomas.size < 2) groups.delete(g);
  }
  return groups;
}

/** Accepts either a display name (back-compat) or a nameGroup. */
export function hasNameCollision(nameOrGroup: string): boolean {
  const groups = findSameNameCollisions();
  if (groups.has(nameOrGroup)) return true;
  for (const list of groups.values()) {
    if (list.some((s) => s.name === nameOrGroup || s.nameGroup === nameOrGroup)) return true;
  }
  return false;
}
