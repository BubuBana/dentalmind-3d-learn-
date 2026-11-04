import type { L } from "./teeth";

/**
 * Findings codes (Befundkürzel) as used on German dental charts and in the
 * KZBV treatment-plan form. The codes stay in German in every language,
 * because they are written like this in practice; only the meaning is translated.
 */

export type BefundGroup = "missing" | "restored" | "treat";

export interface BefundCode {
  code: string;
  group: BefundGroup;
  label: L;
}

const t = (it: string, de: string, en: string, sq: string): L => ({ it, de, en, sq });

export const BEFUND_CODES: BefundCode[] = [
  { code: "f", group: "missing", label: t("dente mancante", "fehlender Zahn", "missing tooth", "dhëmb që mungon") },
  { code: "e", group: "missing", label: t("dente sostituito (protesi)", "ersetzter Zahn", "replaced tooth (prosthesis)", "dhëmb i zëvendësuar (protezë)") },
  { code: "ew", group: "treat", label: t("dente sostituito, sostituzione da rifare", "ersetzter, aber erneuerungsbedürftiger Zahn", "replaced tooth, replacement needs renewal", "dhëmb i zëvendësuar, zëvendësimi duhet rinovuar") },
  { code: "b", group: "restored", label: t("elemento di ponte", "Brückenglied", "bridge pontic", "element ure") },
  { code: "k", group: "restored", label: t("corona clinicamente intatta", "klinisch intakte Krone", "clinically intact crown", "kurorë klinikisht e paprekur") },
  { code: "kw", group: "treat", label: t("corona da rifare", "erneuerungsbedürftige Krone", "crown needs renewal", "kurorë që duhet rinovuar") },
  { code: "t", group: "restored", label: t("corona telescopica", "Teleskop", "telescopic crown", "kurorë teleskopike") },
  { code: "tw", group: "treat", label: t("telescopica da rifare", "erneuerungsbedürftiges Teleskop", "telescopic crown needs renewal", "kurorë teleskopike që duhet rinovuar") },
  { code: "r", group: "restored", label: t("cappetta su perno radicolare", "Wurzelstiftkappe", "root post coping", "kapak mbi kunj rrënjor") },
  { code: "rw", group: "treat", label: t("cappetta su perno da rifare", "erneuerungsbedürftige Wurzelstiftkappe", "root post coping needs renewal", "kapak mbi kunj që duhet rinovuar") },
  { code: "i", group: "restored", label: t("impianto con sovrastruttura intatta", "Implantat mit intakter Suprakonstruktion", "implant with intact superstructure", "implant me suprastrukturë të paprekur") },
  { code: "ix", group: "treat", label: t("impianto da rimuovere", "zu entfernendes Implantat", "implant to be removed", "implant që duhet hequr") },
  { code: "pw", group: "treat", label: t("dente conservabile con difetti parziali", "erhaltungswürdiger Zahn mit partiellen Substanzdefekten", "tooth worth keeping, partial defects", "dhëmb i ruajtshëm me defekte të pjesshme") },
  { code: "ww", group: "treat", label: t("dente conservabile molto distrutto", "erhaltungswürdiger Zahn mit weitgehender Zerstörung", "tooth worth keeping, extensively destroyed", "dhëmb i ruajtshëm shumë i shkatërruar") },
  { code: "x", group: "treat", label: t("dente non conservabile", "nicht erhaltungswürdiger Zahn", "tooth not worth keeping", "dhëmb që nuk ruhet") },
];

export const BEFUND_BY_CODE = new Map(BEFUND_CODES.map((c) => [c.code, c]));

/** Upper row 18…11 | 21…28 and lower row 48…41 | 31…38, as seen by the dentist. */
export const CHART_UPPER = ["18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28"];
export const CHART_LOWER = ["48", "47", "46", "45", "44", "43", "42", "41", "31", "32", "33", "34", "35", "36", "37", "38"];

export type Chart = Record<string, string>;

export interface BefundCase {
  id: string;
  text: L;
  solution: Chart;
}

export const BEFUND_CASES: BefundCase[] = [
  {
    id: "c1",
    text: t(
      "Mancano il 36 e il 46. Il 16 ha una corona intatta.",
      "36 und 46 fehlen. 16 hat eine intakte Krone.",
      "36 and 46 are missing. 16 has an intact crown.",
      "Mungojnë 36 dhe 46. 16 ka një kurorë të paprekur.",
    ),
    solution: { "36": "f", "46": "f", "16": "k" },
  },
  {
    id: "c2",
    text: t(
      "Ponte 24–26 intatto: il 25 è l'elemento di ponte, il 24 e il 26 sono pilastri con corona.",
      "Intakte Brücke 24–26: 25 ist das Brückenglied, 24 und 26 sind überkronte Pfeiler.",
      "Intact bridge 24–26: 25 is the pontic, 24 and 26 are crowned abutments.",
      "Urë e paprekur 24–26: 25 është elementi i urës, 24 dhe 26 janë shtylla me kurorë.",
    ),
    solution: { "24": "k", "25": "b", "26": "k" },
  },
  {
    id: "c3",
    text: t(
      "Il 47 non è conservabile. Il 37 è molto distrutto ma conservabile. La corona sull'11 è da rifare.",
      "47 ist nicht erhaltungswürdig. 37 ist weitgehend zerstört, aber erhaltungswürdig. Die Krone auf 11 ist erneuerungsbedürftig.",
      "47 is not worth keeping. 37 is extensively destroyed but worth keeping. The crown on 11 needs renewal.",
      "47 nuk ruhet. 37 është shumë i shkatërruar por i ruajtshëm. Kurora mbi 11 duhet rinovuar.",
    ),
    solution: { "47": "x", "37": "ww", "11": "kw" },
  },
  {
    id: "c4",
    text: t(
      "Nel 36 c'è un impianto con corona intatta. Il 46 manca. Il 45 ha difetti parziali ma è conservabile.",
      "In regio 36 steht ein Implantat mit intakter Krone. 46 fehlt. 45 hat partielle Defekte, ist aber erhaltungswürdig.",
      "There is an implant with an intact crown at 36. 46 is missing. 45 has partial defects but is worth keeping.",
      "Te 36 ka një implant me kurorë të paprekur. 46 mungon. 45 ka defekte të pjesshme, por është i ruajtshëm.",
    ),
    solution: { "36": "i", "46": "f", "45": "pw" },
  },
  {
    id: "c5",
    text: t(
      "Arcata superiore: mancano il 18 e il 28. Il 13 e il 23 portano corone telescopiche. Gli incisivi da 12 a 22 sono sostituiti dalla protesi.",
      "Oberkiefer: 18 und 28 fehlen. 13 und 23 tragen Teleskope. Die Schneidezähne 12 bis 22 sind durch die Prothese ersetzt.",
      "Upper arch: 18 and 28 are missing. 13 and 23 carry telescopic crowns. The incisors 12 to 22 are replaced by the denture.",
      "Harku i sipërm: mungojnë 18 dhe 28. 13 dhe 23 kanë kurora teleskopike. Prerësit nga 12 deri te 22 janë zëvendësuar nga proteza.",
    ),
    solution: { "18": "f", "28": "f", "13": "t", "23": "t", "12": "e", "11": "e", "21": "e", "22": "e" },
  },
  {
    id: "c6",
    text: t(
      "L'impianto nel 46 è da rimuovere. Il ponte 44–46 era su impianto: il 45 è l'elemento di ponte, il 44 ha una corona da rifare.",
      "Das Implantat regio 46 muss entfernt werden. Die Brücke 44–46 stand auf dem Implantat: 45 ist das Brückenglied, die Krone auf 44 ist erneuerungsbedürftig.",
      "The implant at 46 must be removed. Bridge 44–46 was on the implant: 45 is the pontic, the crown on 44 needs renewal.",
      "Implanti te 46 duhet hequr. Ura 44–46 ishte mbi implant: 45 është elementi i urës, kurora mbi 44 duhet rinovuar.",
    ),
    solution: { "46": "ix", "45": "b", "44": "kw" },
  },
];

export interface CheckResult {
  correct: string[];
  wrong: string[];
  missing: string[];
}

/** Compare a filled chart with a solution, tooth by tooth. */
export function checkChart(chart: Chart, solution: Chart): CheckResult {
  const correct: string[] = [];
  const wrong: string[] = [];
  const missing: string[] = [];
  for (const [fdi, code] of Object.entries(solution)) {
    if (!chart[fdi]) missing.push(fdi);
    else if (chart[fdi] === code) correct.push(fdi);
    else wrong.push(fdi);
  }
  for (const fdi of Object.keys(chart)) {
    if (chart[fdi] && !(fdi in solution)) wrong.push(fdi);
  }
  return { correct, wrong, missing };
}
