import { TEETH, LANGS, type Tooth, type Lang, type Arch, type L } from "./teeth";
import { VOCABULARY } from "./vocabulary";
import { rootCounts, cuspCounts, opposingHomologue } from "./anatomyFacts";
import {
  TRICK_QUESTIONS,
  mirrorFdi,
  mesialNeighbour,
  distalNeighbour,
} from "./lessons";

export type QuizLevel = 1 | 2 | 3;
export type QuizMode = "standard" | "trick" | "orientation" | "mirror" | "arch" | "vocab";

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  level: QuizLevel;
  mode: QuizMode;
  /** Topic used for the end-of-session analysis. */
  topic: "fdi" | "roots" | "cusps" | "landmarks" | "vocabulary" | "orientation" | "mirror" | "trick";
  fdi: string | null;
  /** Fully localized question text. */
  prompt: string;
  options: QuizOption[];
  answerId: string;
  /** Progressive hints, from vague to explicit. */
  hints: string[];
  /** Explanation of the reasoning, shown after the answer or on reveal. */
  reasoning: string;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(arr: readonly T[], rnd: () => number): T => arr[Math.floor(rnd() * arr.length)] as T;

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j] as T, a[i] as T];
  }
  return a;
}

function distractors(pool: Tooth[], correct: Tooth, rnd: () => number, n = 3): Tooth[] {
  const sameType = pool.filter((t) => t.fdi !== correct.fdi && t.type === correct.type);
  const sameArch = pool.filter((t) => t.fdi !== correct.fdi && t.arch === correct.arch);
  const rest = TEETH.filter((t) => t.fdi !== correct.fdi);
  const chosen: Tooth[] = [];
  for (const source of [sameType, sameArch, rest]) {
    for (const t of shuffle(source, rnd)) {
      if (chosen.length >= n) break;
      if (!chosen.some((c) => c.fdi === t.fdi)) chosen.push(t);
    }
  }
  return chosen.slice(0, n);
}

/** Localize an inline four-language literal. */
const P = (lang: Lang, v: L): string => v[lang];

/** Names of the four languages, written in each interface language. */
export const LANG_NAME: Record<Lang, L> = {
  it: { it: "italiano", de: "Italienisch", en: "Italian", sq: "italisht" },
  de: { it: "tedesco", de: "Deutsch", en: "German", sq: "gjermanisht" },
  en: { it: "inglese", de: "Englisch", en: "English", sq: "anglisht" },
  sq: { it: "albanese", de: "Albanisch", en: "Albanian", sq: "shqip" },
};

const ARCH_WORD: Record<Arch, L> = {
  upper: { it: "superiore", de: "Oberkiefer", en: "upper", sq: "i sipërm" },
  lower: { it: "inferiore", de: "Unterkiefer", en: "lower", sq: "i poshtëm" },
};

/** "a lower first molar" etc., localized. */
function toothKind(t: Tooth, lang: Lang): string {
  const short = t.shortName[lang];
  const arch = ARCH_WORD[t.arch][lang];
  switch (lang) {
    case "it":
      return `un ${short.toLowerCase()} ${arch}`;
    case "de":
      return `einen ${short} im ${arch}`;
    case "en":
      return `${/^[aeiou]/i.test(arch) ? "an" : "a"} ${arch} ${short.toLowerCase()}`;
    case "sq":
      return `një ${short.toLowerCase()} ${arch}`;
  }
}

export interface BuildOptions {
  level: QuizLevel;
  lang: Lang;
  rnd: () => number;
  mode?: QuizMode;
  focusFdi?: string;
  arch?: Arch;
  /** Vocabulary quiz: language of the term shown. Defaults to the interface language. */
  vocabFrom?: Lang;
  /** Vocabulary quiz: language of the answer options. Defaults to a random other language. */
  vocabTo?: Lang;
}

/* ------------------------------------------------------------------ */

function trickQuestion(o: BuildOptions): QuizQuestion {
  const { lang, rnd, level } = o;
  const item = pick(TRICK_QUESTIONS, rnd);
  const options = shuffle(
    item.options.map((op, i) => ({ id: String(i), label: op[lang] })),
    rnd,
  );
  return {
    id: `${item.id}-${Math.floor(rnd() * 1e6)}`,
    level,
    mode: "trick",
    topic: "trick",
    fdi: item.fdi,
    prompt: item.prompt[lang],
    options,
    answerId: String(item.answerIndex),
    hints: item.hints.map((h) => h[lang]),
    reasoning: item.reasoning[lang],
  };
}

function orientationQuestion(o: BuildOptions): QuizQuestion {
  const { lang, rnd, level } = o;
  const pool = (o.arch ? TEETH.filter((t) => t.arch === o.arch) : TEETH).filter((t) => t.position > 1 && t.position < 8);
  const tooth = TEETH.find((t) => t.fdi === o.focusFdi) ?? pick(pool, rnd);
  const kinds: Array<"mesial" | "distal" | "surface"> = ["mesial", "surface"];
  if (tooth.position < 8) kinds.push("distal");
  const kind = pick(kinds, rnd);
  const id = `orient-${kind}-${tooth.fdi}-${Math.floor(rnd() * 1e6)}`;

  if (kind === "surface") {
    const opts = [
      { id: "mesial", label: P(lang, { it: "Superficie mesiale", de: "Mesialfläche", en: "Mesial surface", sq: "Sipërfaqja meziale" }) },
      { id: "distal", label: P(lang, { it: "Superficie distale", de: "Distalfläche", en: "Distal surface", sq: "Sipërfaqja distale" }) },
      { id: "buccal", label: P(lang, { it: "Superficie vestibolare", de: "Vestibulärfläche", en: "Vestibular surface", sq: "Sipërfaqja vestibulare" }) },
      { id: "oral", label: P(lang, { it: "Superficie orale", de: "Oralfläche", en: "Oral surface", sq: "Sipërfaqja orale" }) },
    ];
    return {
      id,
      level,
      mode: "orientation",
      topic: "orientation",
      fdi: tooth.fdi,
      prompt: P(lang, {
        it: `Come si chiama la superficie del dente ${tooth.fdi} rivolta verso la linea mediana?`,
        de: `Wie heißt die zur Mittellinie gerichtete Fläche von Zahn ${tooth.fdi}?`,
        en: `What is the surface of tooth ${tooth.fdi} that faces the midline called?`,
        sq: `Si quhet sipërfaqja e dhëmbit ${tooth.fdi} që shikon nga vija mesore?`,
      }),
      options: shuffle(opts, rnd),
      answerId: "mesial",
      hints: [
        P(lang, {
          it: "Il riferimento è sempre la linea mediana tra gli incisivi centrali.",
          de: "Bezugspunkt ist immer die Mittellinie zwischen den mittleren Schneidezähnen.",
          en: "The reference is always the midline between the central incisors.",
          sq: "Referenca është gjithmonë vija mesore ndërmjet prerësve qendrorë.",
        }),
        P(lang, {
          it: "«Verso la linea mediana» ha un nome preciso.",
          de: "„Zur Mittellinie hin“ hat einen festen Namen.",
          en: "'Towards the midline' has a specific name.",
          sq: "«Drejt vijës mesore» ka një emër të saktë.",
        }),
      ],
      reasoning: P(lang, {
        it: "La faccia rivolta verso la linea mediana è mesiale; quella opposta è distale.",
        de: "Die zur Mittellinie gerichtete Fläche ist mesial; die gegenüberliegende ist distal.",
        en: "The surface facing the midline is mesial; the opposite one is distal.",
        sq: "Sipërfaqja që shikon nga vija mesore është meziale; e kundërta është distale.",
      }),
    };
  }

  const answer = kind === "mesial" ? mesialNeighbour(tooth.fdi) : distalNeighbour(tooth.fdi);
  if (!answer) return anatomyQuestion(o);
  const wrong = shuffle(
    [
      kind === "mesial" ? distalNeighbour(tooth.fdi) : mesialNeighbour(tooth.fdi),
      mirrorFdi(answer),
      opposingHomologue(tooth.fdi),
      tooth.fdi,
    ].filter((x): x is string => Boolean(x) && x !== answer).filter((x, i, all) => all.indexOf(x) === i),
    rnd,
  ).slice(0, 3);
  const dir: L =
    kind === "mesial"
      ? { it: "mesiale", de: "mesiale", en: "mesial", sq: "mezial" }
      : { it: "distale", de: "distale", en: "distal", sq: "distal" };
  const central = tooth.position === 1;
  return {
    id,
    level,
    mode: "orientation",
    topic: "orientation",
    fdi: tooth.fdi,
    prompt:
      kind === "mesial"
        ? P(lang, {
            it: `In un’arcata completa e allineata, quale dente è immediatamente adiacente sul lato mesiale al ${tooth.fdi}?`,
            de: `Welcher Zahn grenzt im vollständigen, regelrecht angeordneten Zahnbogen unmittelbar mesial an ${tooth.fdi}?`,
            en: `In a complete, well-aligned arch, which tooth is immediately adjacent on the mesial side of ${tooth.fdi}?`,
            sq: `Në një hark të plotë dhe të rreshtuar, cili dhëmb është menjëherë ngjitur në anën meziale të ${tooth.fdi}?`,
          })
        : P(lang, {
            it: `In un’arcata completa e allineata, quale dente è immediatamente adiacente sul lato distale al ${tooth.fdi}?`,
            de: `Welcher Zahn grenzt im vollständigen, regelrecht angeordneten Zahnbogen unmittelbar distal an ${tooth.fdi}?`,
            en: `In a complete, well-aligned arch, which tooth is immediately adjacent on the distal side of ${tooth.fdi}?`,
            sq: `Në një hark të plotë dhe të rreshtuar, cili dhëmb është menjëherë ngjitur në anën distale të ${tooth.fdi}?`,
          }),
    options: shuffle([answer, ...wrong].map((f) => ({ id: f, label: f })), rnd),
    answerId: answer,
    hints: [
      central
        ? P(lang, { it: "Gli incisivi centrali si toccano alla linea mediana.", de: "Die mittleren Schneidezähne berühren sich an der Mittellinie.", en: "The central incisors touch at the midline.", sq: "Prerësit qendrorë takohen te vija mesore." })
        : P(lang, { it: "Resta nello stesso quadrante.", de: "Bleibe im selben Quadranten.", en: "Stay in the same quadrant.", sq: "Qëndroni në të njëjtin kuadrant." }),
      kind === "mesial"
        ? P(lang, {
            it: "Mesiale = verso la linea mediana; al centrale segue il centrale controlaterale.",
            de: "Mesial = zur Mittellinie; am mittleren Schneidezahn folgt der kontralaterale mittlere Schneidezahn.",
            en: "Mesial = towards the midline; next to a central incisor comes the contralateral central incisor.",
            sq: "Mezial = drejt vijës mesore; pas prerësit qendror vjen prerësi qendror kontralateral.",
          })
        : P(lang, {
            it: "Distale = lontano dalla linea mediana → cifra più alta.",
            de: "Distal = von der Mittellinie weg → höhere Ziffer.",
            en: "Distal = away from the midline → higher digit.",
            sq: "Distal = larg vijës mesore → shifër më e lartë.",
          }),
    ],
    reasoning: P(lang, {
      it: `Nell’arcata completa, il vicino ${dir.it} di ${tooth.fdi} è ${answer}${central ? ", oltre la linea mediana" : ""}.`,
      de: `Im vollständigen Zahnbogen ist der ${dir.de} Nachbar von ${tooth.fdi} der Zahn ${answer}${central ? " jenseits der Mittellinie" : ""}.`,
      en: `In a complete arch, the ${dir.en} neighbour of ${tooth.fdi} is ${answer}${central ? ", across the midline" : ""}.`,
      sq: `Në një hark të plotë, fqinji ${dir.sq} i ${tooth.fdi} është ${answer}${central ? ", përtej vijës mesore" : ""}.`,
    }),
  };
}

function mirrorQuestion(o: BuildOptions): QuizQuestion {
  const { lang, rnd, level } = o;
  const pool = o.arch ? TEETH.filter((t) => t.arch === o.arch) : TEETH;
  const tooth = TEETH.find((t) => t.fdi === o.focusFdi) ?? pick(pool, rnd);
  const kind = pick(["mirror", "antagonist", "quadrant"] as const, rnd);
  const id = `mirror-${kind}-${tooth.fdi}-${Math.floor(rnd() * 1e6)}`;

  if (kind === "quadrant") {
    const quadName: Record<number, L> = {
      1: { it: "superiore destro", de: "Oberkiefer rechts", en: "upper right", sq: "sipër djathtas" },
      2: { it: "superiore sinistro", de: "Oberkiefer links", en: "upper left", sq: "sipër majtas" },
      3: { it: "inferiore sinistro", de: "Unterkiefer links", en: "lower left", sq: "poshtë majtas" },
      4: { it: "inferiore destro", de: "Unterkiefer rechts", en: "lower right", sq: "poshtë djathtas" },
    };
    const word = P(lang, { it: "Quadrante", de: "Quadrant", en: "Quadrant", sq: "Kuadranti" });
    const opts = [1, 2, 3, 4].map((q) => ({ id: String(q), label: `${word} ${q} — ${quadName[q]![lang]}` }));
    return {
      id,
      level,
      mode: "mirror",
      topic: "mirror",
      fdi: tooth.fdi,
      prompt: P(lang, {
        it: `In quale quadrante si trova il dente ${tooth.fdi}?`,
        de: `In welchem Quadranten liegt Zahn ${tooth.fdi}?`,
        en: `Which quadrant is tooth ${tooth.fdi} in?`,
        sq: `Në cilin kuadrant ndodhet dhëmbi ${tooth.fdi}?`,
      }),
      options: opts,
      answerId: String(tooth.quadrant),
      hints: [
        P(lang, { it: "La prima cifra FDI indica il quadrante.", de: "Die erste FDI-Ziffer gibt den Quadranten an.", en: "The first FDI digit gives the quadrant.", sq: "Shifra e parë FDI tregon kuadrantin." }),
        P(lang, {
          it: "1–2 superiori, 3–4 inferiori; 1 e 4 a destra del paziente.",
          de: "1–2 Oberkiefer, 3–4 Unterkiefer; 1 und 4 rechts beim Patienten.",
          en: "1–2 upper, 3–4 lower; 1 and 4 on the patient's right.",
          sq: "1–2 sipër, 3–4 poshtë; 1 dhe 4 në të djathtën e pacientit.",
        }),
      ],
      reasoning: P(lang, {
        it: `${tooth.fdi} inizia con ${tooth.quadrant}: quadrante ${tooth.quadrant}.`,
        de: `${tooth.fdi} beginnt mit ${tooth.quadrant}: Quadrant ${tooth.quadrant}.`,
        en: `${tooth.fdi} starts with ${tooth.quadrant}: quadrant ${tooth.quadrant}.`,
        sq: `${tooth.fdi} fillon me ${tooth.quadrant}: kuadranti ${tooth.quadrant}.`,
      }),
    };
  }

  const answer = kind === "mirror" ? mirrorFdi(tooth.fdi) : opposingHomologue(tooth.fdi);
  const other = kind === "mirror" ? opposingHomologue(tooth.fdi) : mirrorFdi(tooth.fdi);
  const wrong = shuffle(
    [other, mirrorFdi(opposingHomologue(tooth.fdi)), distalNeighbour(tooth.fdi) ?? mesialNeighbour(tooth.fdi) ?? tooth.fdi].filter(
      (x, i, all) => x !== answer && all.indexOf(x) === i,
    ),
    rnd,
  ).slice(0, 3);
  return {
    id,
    level,
    mode: "mirror",
    topic: "mirror",
    fdi: tooth.fdi,
    prompt:
      kind === "mirror"
        ? P(lang, {
            it: `Qual è il dente speculare di ${tooth.fdi}?`,
            de: `Welcher Zahn ist das Spiegelbild von ${tooth.fdi}?`,
            en: `Which tooth is the mirror image of ${tooth.fdi}?`,
            sq: `Cili dhëmb është pasqyra e ${tooth.fdi}?`,
          })
        : P(lang, {
            it: `Quale dente ha la stessa posizione FDI nell’arcata opposta, sullo stesso lato del ${tooth.fdi} (non tutti i contatti occlusali)?`,
            de: `Welcher Zahn hat die gleiche FDI-Position im Gegenkiefer auf derselben Seite wie ${tooth.fdi} (nicht alle Okklusionskontakte)?`,
            en: `Which tooth has the same FDI position in the opposite arch, on the same side as ${tooth.fdi} (not all occlusal contacts)?`,
            sq: `Cili dhëmb ka të njëjtin pozicion FDI në harkun e kundërt, në të njëjtën anë me ${tooth.fdi} (jo të gjitha kontaktet okluzale)?`,
          }),
    options: shuffle([answer, ...wrong].map((f) => ({ id: f, label: f })), rnd),
    answerId: answer,
    hints: [
      kind === "mirror"
        ? P(lang, { it: "Stessa arcata, lato opposto.", de: "Gleicher Kiefer, andere Seite.", en: "Same arch, opposite side.", sq: "I njëjti hark, ana e kundërt." })
        : P(lang, { it: "Stesso lato, arcata opposta.", de: "Gleiche Seite, anderer Kiefer.", en: "Same side, opposite arch.", sq: "E njëjta anë, harku i kundërt." }),
      P(lang, { it: "La seconda cifra non cambia mai.", de: "Die zweite Ziffer bleibt unverändert.", en: "The second digit never changes.", sq: "Shifra e dytë nuk ndryshon kurrë." }),
    ],
    reasoning:
      kind === "mirror"
        ? P(lang, {
            it: `Q1↔Q2 e Q3↔Q4 sono speculari: ${tooth.fdi} → ${answer}.`,
            de: `Q1↔Q2 und Q3↔Q4 sind Spiegelbilder: ${tooth.fdi} → ${answer}.`,
            en: `Q1↔Q2 and Q3↔Q4 are mirror images: ${tooth.fdi} → ${answer}.`,
            sq: `Q1↔Q2 dhe Q3↔Q4 janë pasqyrë: ${tooth.fdi} → ${answer}.`,
          })
        : P(lang, {
            it: `Corrispondenza FDI: ${tooth.fdi} → ${answer}. Non identifica tutti gli antagonisti: in un’occlusione ideale di Classe I la maggior parte dei denti contatta due denti opposti; fanno eccezione gli incisivi centrali inferiori e i terzi molari superiori. I contatti reali vanno verificati clinicamente.`,
            de: `FDI-Zuordnung: ${tooth.fdi} → ${answer}. Sie benennt nicht alle Antagonisten: In idealer Klasse-I-Okklusion haben die meisten Zähne zwei Gegenzähne; Ausnahmen sind die unteren mittleren Schneidezähne und oberen Weisheitszähne. Tatsächliche Kontakte müssen klinisch geprüft werden.`,
            en: `FDI correspondence: ${tooth.fdi} → ${answer}. It does not name all antagonists: in ideal Class I occlusion most teeth contact two opposing teeth; the exceptions are the lower central incisors and the upper third molars. Actual contacts must be checked clinically.`,
            sq: `Korrespondenca FDI: ${tooth.fdi} → ${answer}. Nuk i tregon të gjithë antagonistët: në okluzionin ideal të Klasës I shumica e dhëmbëve kontaktojnë dy dhëmbë të kundërt; përjashtim bëjnë prerësit qendrorë të poshtëm dhe molarët e tretë të sipërm. Kontaktet reale duhen verifikuar klinikisht.`,
          }),
  };
}

const CATEGORY: Record<string, L> = {
  anatomy: { it: "Anatomia", de: "Anatomie", en: "Anatomy", sq: "Anatomi" },
  surfaces: { it: "Superfici", de: "Flächen", en: "Surfaces", sq: "Sipërfaqet" },
  clinic: { it: "Clinica", de: "Klinik", en: "Clinic", sq: "Klinikë" },
  materials: { it: "Materiali e strumenti", de: "Materialien und Instrumente", en: "Materials and instruments", sq: "Materiale dhe instrumente" },
};

function vocabQuestion(o: BuildOptions): QuizQuestion {
  const { lang, rnd, level } = o;
  const entry = pick(VOCABULARY, rnd);
  const from: Lang = o.vocabFrom ?? lang;
  const to: Lang =
    o.vocabTo && o.vocabTo !== from ? o.vocabTo : pick(LANGS.filter((l) => l !== from), rnd);
  const others = shuffle(VOCABULARY.filter((v) => v.id !== entry.id), rnd).slice(0, 3);
  const options = shuffle(
    [entry, ...others].map((v) => ({ id: v.id, label: v[to] })),
    rnd,
  );
  const target = LANG_NAME[to][lang];
  const answerText = entry[to];
  const initial = answerText.replace(/^(der|die|das)\s/, "").charAt(0);
  return {
    id: `vocab-${entry.id}-${Math.floor(rnd() * 1e6)}`,
    level,
    mode: "vocab",
    topic: "vocabulary",
    fdi: null,
    prompt: P(lang, {
      it: `Come si dice in ${target}: ${entry[from]}?`,
      de: `Wie heißt auf ${target}: ${entry[from]}?`,
      en: `How do you say in ${target}: ${entry[from]}?`,
      sq: `Si thuhet në ${target}: ${entry[from]}?`,
    }),
    options,
    answerId: entry.id,
    hints: [
      P(lang, {
        it: `Categoria: ${CATEGORY[entry.category]!.it}.`,
        de: `Kategorie: ${CATEGORY[entry.category]!.de}.`,
        en: `Category: ${CATEGORY[entry.category]!.en}.`,
        sq: `Kategoria: ${CATEGORY[entry.category]!.sq}.`,
      }),
      P(lang, {
        it: `Iniziale: «${initial}».`,
        de: `Anfangsbuchstabe: „${initial}“.`,
        en: `First letter: '${initial}'.`,
        sq: `Shkronja e parë: «${initial}».`,
      }),
    ],
    reasoning: `${LANGS.map((l) => `${l.toUpperCase()}: ${entry[l]}`).join(" · ")}`,
  };
}

function anatomyQuestion(o: BuildOptions): QuizQuestion {
  const { lang, rnd, level } = o;
  const pool = o.arch ? TEETH.filter((t) => t.arch === o.arch) : TEETH;
  const tooth = TEETH.find((t) => t.fdi === o.focusFdi) ?? pick(pool, rnd);
  const kinds =
    level === 1
      ? (["name", "fdi"] as const)
      : level === 2
        ? (["roots", "cusps", "fdi"] as const)
        : (["landmark", "roots", "cusps"] as const);
  const eligibleKinds = [...kinds].filter((kind) =>
    kind === "roots" ? rootCounts(tooth).length > 0 : kind === "cusps" ? cuspCounts(tooth).length > 0 : true,
  );
  const kind = eligibleKinds.length ? pick(eligibleKinds, rnd) : "fdi";
  const id = `${kind}-${tooth.fdi}-${Math.floor(rnd() * 1e6)}`;
  const kindText = toothKind(tooth, lang);

  if (kind === "roots" || kind === "cusps") {
    const isRoots = kind === "roots";
    const counts = isRoots ? rootCounts(tooth) : cuspCounts(tooth);
    const correct = counts.join("–");
    const candidates = [correct, ...[0, 1, 2, 3, 4, 5, 6].filter((n) => !counts.includes(n)).map(String)].slice(0, 4);
    return {
      id,
      level,
      mode: o.mode ?? "standard",
      topic: isRoots ? "roots" : "cusps",
      fdi: tooth.fdi,
      prompt: isRoots
        ? P(lang, {
            it: `Quale numero di radici descrive le forme comuni del ${tooth.fdi} (escluse le varianti rare)?`,
            de: `Welche Wurzelzahl beschreibt häufige Formen von Zahn ${tooth.fdi} (ohne seltene Varianten)?`,
            en: `Which number of roots describes the common forms of ${tooth.fdi} (excluding rare variants)?`,
            sq: `Cili numër rrënjësh përshkruan format e zakonshme të ${tooth.fdi} (pa variantet e rralla)?`,
          })
        : P(lang, {
            it: `Quale numero di cuspidi principali descrive le forme comuni del ${tooth.fdi} (escluse le varianti accessorie)?`,
            de: `Welche Zahl der Haupthöcker beschreibt häufige Formen von Zahn ${tooth.fdi} (ohne zusätzliche Varianten)?`,
            en: `Which number of main cusps describes the common forms of ${tooth.fdi} (excluding accessory variants)?`,
            sq: `Cili numër kuspidësh kryesorë përshkruan format e zakonshme të ${tooth.fdi} (pa variantet aksesore)?`,
          }),
      options: shuffle(candidates.map((n) => ({ id: String(n), label: String(n) })), rnd),
      answerId: String(correct),
      hints: [
        P(lang, { it: `Si tratta di ${kindText}.`, de: `Es handelt sich um ${kindText}.`, en: `It is ${kindText}.`, sq: `Bëhet fjalë për ${kindText}.` }),
        isRoots
          ? P(lang, {
              it: "Pensa all'arcata: i molari superiori ne hanno tipicamente più degli inferiori.",
              de: "Denke an den Kiefer: obere Molaren haben typischerweise mehr als untere.",
              en: "Think of the arch: upper molars typically have more than lower ones.",
              sq: "Mendoni për harkun: molarët e sipërm zakonisht kanë më shumë se të poshtmit.",
            })
          : P(lang, {
              it: "Richiama le configurazioni anatomiche comuni: il modello è schematico e mostra solo un esempio.",
              de: "Erinnere dich an häufige anatomische Konfigurationen: Das Modell ist schematisch und zeigt nur ein Beispiel.",
              en: "Recall the common anatomical configurations: the model is schematic and shows only one example.",
              sq: "Kujtoni konfigurimet anatomike të zakonshme: modeli është skematik dhe tregon vetëm një shembull.",
            }),
        isRoots ? tooth.anatomy.rootsTypical[lang] : tooth.anatomy.cuspsTypical[lang],
      ],
      reasoning: isRoots
        ? `${tooth.anatomy.rootsTypical[lang]} ${tooth.anatomy.rootsVariable[lang]}`
        : `${tooth.anatomy.cuspsTypical[lang]} ${tooth.anatomy.cuspsVariable[lang]}`,
    };
  }

  if (kind === "landmark") {
    const l = pick(tooth.landmarks, rnd);
    const wrong = shuffle(TEETH.flatMap((t) => t.landmarks).filter((item) => item.id !== l.id), rnd)
      .filter((item, index, items) => items.findIndex((other) => other.hint[lang] === item.hint[lang]) === index)
      .slice(0, 3);
    return {
      id,
      level,
      mode: o.mode ?? "standard",
      topic: "landmarks",
      fdi: tooth.fdi,
      prompt: P(lang, {
        it: `Sul dente ${tooth.fdi}, quale descrizione definisce il repere «${l.label.it}»?`,
        de: `Welche Beschreibung definiert am Zahn ${tooth.fdi} die Landmarke „${l.label.de}“?`,
        en: `On tooth ${tooth.fdi}, which description defines the landmark '${l.label.en}'?`,
        sq: `Te dhëmbi ${tooth.fdi}, cili përshkrim e përcakton pikën referuese «${l.label.sq}»?`,
      }),
      options: shuffle([l, ...wrong].map((item, index) => ({ id: String(index), label: item.hint[lang] })), rnd),
      answerId: "0",
      hints: [
        P(lang, {
          it: "Il nome descrive una struttura, non un dente unico.",
          de: "Der Name beschreibt eine Struktur, keinen eindeutig bestimmten Zahn.",
          en: "The name describes a structure, not a unique tooth.",
          sq: "Emri përshkruan një strukturë, jo një dhëmb të vetëm.",
        }),
        P(lang, { it: `Appartiene a ${kindText}.`, de: `Er gehört zu ${kindText.replace(/^einen /, "einem ")}.`, en: `It belongs to ${kindText}.`, sq: `I përket ${kindText}.` }),
      ],
      reasoning: P(lang, {
        it: `${l.label.it}: ${l.hint.it} Un repere può essere condiviso da più denti e non basta da solo a identificarne il numero FDI.`,
        de: `${l.label.de}: ${l.hint.de} Eine Landmarke kann an mehreren Zähnen vorkommen und reicht allein nicht zur FDI-Identifikation.`,
        en: `${l.label.en}: ${l.hint.en} A landmark may be shared by several teeth and alone is not enough to identify the FDI number.`,
        sq: `${l.label.sq}: ${l.hint.sq} Një pikë referuese mund të jetë e përbashkët për disa dhëmbë dhe vetëm ajo nuk mjafton për të identifikuar numrin FDI.`,
      }),
    };
  }

  const askName = kind === "name";
  const wrong = distractors(pool, tooth, rnd, 3);
  return {
    id,
    level,
    mode: o.mode ?? "standard",
    topic: "fdi",
    fdi: tooth.fdi,
    prompt: askName
      ? P(lang, {
          it: `Quale dente corrisponde al numero FDI ${tooth.fdi}?`,
          de: `Welcher Zahn entspricht der FDI-Nummer ${tooth.fdi}?`,
          en: `Which tooth corresponds to FDI number ${tooth.fdi}?`,
          sq: `Cili dhëmb i përgjigjet numrit FDI ${tooth.fdi}?`,
        })
      : P(lang, {
          it: `Qual è il numero FDI di: ${tooth.name.it}?`,
          de: `Wie lautet die FDI-Nummer von: ${tooth.name.de}?`,
          en: `What is the FDI number of: ${tooth.name.en}?`,
          sq: `Cili është numri FDI i: ${tooth.name.sq}?`,
        }),
    options: shuffle([tooth, ...wrong].map((t) => ({ id: t.fdi, label: askName ? t.name[lang] : t.fdi })), rnd),
    answerId: tooth.fdi,
    hints: [
      P(lang, {
        it: `La prima cifra è il quadrante (${tooth.quadrant}).`,
        de: `Die erste Ziffer ist der Quadrant (${tooth.quadrant}).`,
        en: `The first digit is the quadrant (${tooth.quadrant}).`,
        sq: `Shifra e parë është kuadranti (${tooth.quadrant}).`,
      }),
      P(lang, {
        it: `La seconda cifra è la posizione dalla linea mediana (${tooth.position}).`,
        de: `Die zweite Ziffer ist die Position ab der Mittellinie (${tooth.position}).`,
        en: `The second digit is the position from the midline (${tooth.position}).`,
        sq: `Shifra e dytë është pozicioni nga vija mesore (${tooth.position}).`,
      }),
    ],
    reasoning: P(lang, {
      it: `FDI ${tooth.fdi}: quadrante ${tooth.quadrant}, posizione ${tooth.position} → ${tooth.name.it}.`,
      de: `FDI ${tooth.fdi}: Quadrant ${tooth.quadrant}, Position ${tooth.position} → ${tooth.name.de}.`,
      en: `FDI ${tooth.fdi}: quadrant ${tooth.quadrant}, position ${tooth.position} → ${tooth.name.en}.`,
      sq: `FDI ${tooth.fdi}: kuadranti ${tooth.quadrant}, pozicioni ${tooth.position} → ${tooth.name.sq}.`,
    }),
  };
}

export function buildQuestion(o: BuildOptions): QuizQuestion {
  const mode = o.mode ?? "standard";
  if (mode === "trick") return trickQuestion(o);
  if (mode === "orientation") return orientationQuestion(o);
  if (mode === "mirror") return mirrorQuestion(o);
  if (mode === "vocab") return vocabQuestion(o);
  // standard / arch: mixed pool of topics
  const roll = o.rnd();
  if (roll < 0.12) return vocabQuestion({ ...o, mode });
  if (roll < 0.22) return mirrorQuestion({ ...o, mode });
  if (roll < 0.32) return orientationQuestion({ ...o, mode });
  if (roll < 0.38 && o.level === 3) return trickQuestion({ ...o, mode });
  return anatomyQuestion({ ...o, mode });
}

export function nextLevel(level: QuizLevel, correctFirstTry: boolean): QuizLevel {
  if (correctFirstTry) return Math.min(3, level + 1) as QuizLevel;
  return Math.max(1, level - 1) as QuizLevel;
}

export function dailySeed(dateKey: string): number {
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const TOPIC_LABEL: Record<QuizQuestion["topic"], L> = {
  fdi: { it: "Numerazione FDI", de: "FDI-Nummerierung", en: "FDI numbering", sq: "Numërimi FDI" },
  roots: { it: "Radici", de: "Wurzeln", en: "Roots", sq: "Rrënjët" },
  cusps: { it: "Cuspidi", de: "Höcker", en: "Cusps", sq: "Kuspidët" },
  landmarks: { it: "Punti di repere", de: "Landmarken", en: "Landmarks", sq: "Pikat referuese" },
  vocabulary: { it: "Vocabolario", de: "Vokabular", en: "Vocabulary", sq: "Fjalori" },
  orientation: { it: "Mesiale/distale", de: "Mesial/distal", en: "Mesial/distal", sq: "Mezial/distal" },
  mirror: { it: "Logica dello specchio", de: "Spiegellogik", en: "Mirror logic", sq: "Logjika e pasqyrës" },
  trick: { it: "Domande trabocchetto", de: "Fangfragen", en: "Trick questions", sq: "Pyetje kurth" },
};
