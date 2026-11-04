import { MEASUREMENTS } from "./measurements";

export const LANGS = ["it", "de", "en", "sq"] as const;
export type Lang = (typeof LANGS)[number];
export type L = Record<Lang, string>;

export type ToothTypeKey =
  | "centralIncisor"
  | "lateralIncisor"
  | "canine"
  | "firstPremolar"
  | "secondPremolar"
  | "firstMolar"
  | "secondMolar"
  | "thirdMolar";

export type Arch = "upper" | "lower";
export type Side = "right" | "left";

export interface Landmark {
  id: string;
  label: L;
  hint: L;
  /** normalized coords: x mesio-distal, y occlusal(-1) -> apical(1), z buccal(+1) / oral(-1) */
  x: number;
  y: number;
  z: number;
}

export interface Geometry {
  crownWidth: number;
  crownHeight: number;
  depth: number;
  cuspCount: number;
  rootCount: number;
  rootLength: number;
  rootSpread: number;
  silhouette: "blade" | "pointed" | "premolar" | "molar";
  /** "upper:firstMolar" etc.; selects the crown shape in toothShape.ts */
  kind?: string;
  /** cervical width as a fraction of the maximum crown width (mesio-distal / vestibulo-oral) */
  cervixX?: number;
  cervixZ?: number;
}

export interface Anatomy {
  crown: L;
  rootsTypical: L;
  rootsVariable: L;
  canalsTypical: L;
  canalsVariable: L;
  cuspsTypical: L;
  cuspsVariable: L;
  eruption: L;
  clinical: L;
}

export interface Tooth {
  fdi: string;
  quadrant: number;
  position: number;
  type: ToothTypeKey;
  arch: Arch;
  side: Side;
  name: L;
  shortName: L;
  anatomy: Anatomy;
  landmarks: Landmark[];
  geometry: Geometry;
  /** modular hook for future real GLB/GLTF assets */
  modelUrl: string | null;
}

const typeName: Record<ToothTypeKey, L> = {
  centralIncisor: { it: "Incisivo centrale", de: "Mittlerer Schneidezahn", en: "Central incisor", sq: "Prerës qendror" },
  lateralIncisor: { it: "Incisivo laterale", de: "Seitlicher Schneidezahn", en: "Lateral incisor", sq: "Prerës anësor" },
  canine: { it: "Canino", de: "Eckzahn", en: "Canine", sq: "Kanin" },
  firstPremolar: { it: "Primo premolare", de: "Erster Prämolar", en: "First premolar", sq: "Premolari i parë" },
  secondPremolar: { it: "Secondo premolare", de: "Zweiter Prämolar", en: "Second premolar", sq: "Premolari i dytë" },
  firstMolar: { it: "Primo molare", de: "Erster Molar", en: "First molar", sq: "Molari i parë" },
  secondMolar: { it: "Secondo molare", de: "Zweiter Molar", en: "Second molar", sq: "Molari i dytë" },
  thirdMolar: { it: "Terzo molare", de: "Weisheitszahn", en: "Third molar", sq: "Molari i tretë" },
};

const archName: Record<Arch, L> = {
  upper: { it: "superiore", de: "Oberkiefer", en: "upper", sq: "i sipërm" },
  lower: { it: "inferiore", de: "Unterkiefer", en: "lower", sq: "i poshtëm" },
};

const sideName: Record<Side, L> = {
  right: { it: "destro", de: "rechts", en: "right", sq: "djathtas" },
  left: { it: "sinistro", de: "links", en: "left", sq: "majtas" },
};

function lm(id: string, label: L, x: number, y: number, z: number, hint: L): Landmark {
  return { id, label, hint, x, y, z };
}

const CEJ: L = {
  it: "Giunzione amelo-cementizia",
  de: "Schmelz-Zement-Grenze",
  en: "Cementoenamel junction (CEJ)",
  sq: "Kufiri smalt-cement",
};
const APEX: L = { it: "Apice radicolare", de: "Wurzelspitze", en: "Root apex", sq: "Maja e rrënjës (apeksi)" };
const CINGULUM: L = { it: "Cingolo", de: "Zingulum", en: "Cingulum", sq: "Cingulumi" };
const CEJ_SHORT: L = {
  it: "Confine smalto/cemento.",
  de: "Schmelz-Zement-Grenze.",
  en: "Boundary between enamel and cementum.",
  sq: "Kufiri ndërmjet smaltit dhe cementit.",
};

const incisalLandmarks = (): Landmark[] => [
  lm("incisalEdge", { it: "Margine incisale", de: "Inzisalkante", en: "Incisal edge", sq: "Buza incizale" }, 0, -0.95, 0.1,
    { it: "Bordo tagliente della corona.", de: "Schneidende Kante der Krone.", en: "Cutting edge of the crown.", sq: "Buza prerëse e kurorës." }),
  lm("cingulum", CINGULUM, 0, 0.05, -0.85,
    { it: "Rilievo dello smalto sulla faccia orale del colletto.", de: "Schmelzwulst an der oralen Zahnhalsfläche.", en: "Enamel bulge on the cervical third of the oral surface.", sq: "Fryrje e smaltit në të tretën cervikale të sipërfaqes orale." }),
  lm("labialFace", { it: "Faccia vestibolare", de: "Vestibuläre Fläche", en: "Labial (facial) surface", sq: "Sipërfaqja vestibulare" }, 0, -0.35, 0.9,
    { it: "Superficie rivolta verso labbro/guancia.", de: "Zur Lippe bzw. Wange gerichtete Fläche.", en: "Surface facing the lip or cheek.", sq: "Sipërfaqja që shikon nga buza ose faqja." }),
  lm("mamelons", { it: "Mamelloni", de: "Mamelons", en: "Mamelons", sq: "Mamelonet" }, -0.45, -0.85, 0.5,
    { it: "Tre lobi incisali, visibili dopo l'eruzione e poi consumati.", de: "Drei inzisale Lappen, nach dem Durchbruch sichtbar, später abradiert.", en: "Three incisal lobes, visible after eruption and later worn away.", sq: "Tre lobe incizale, të dukshme pas shpërthimit dhe më pas të konsumuara." }),
  lm("cej", CEJ, 0.6, 0.18, 0.6,
    { it: "Confine tra smalto e cemento radicolare.", de: "Grenze zwischen Schmelz und Wurzelzement.", en: "Boundary between enamel and root cementum.", sq: "Kufiri ndërmjet smaltit dhe cementit të rrënjës." }),
  lm("apex", APEX, 0, 0.95, 0,
    { it: "Estremità apicale con forame.", de: "Apikales Ende mit Foramen.", en: "Apical end with the apical foramen.", sq: "Fundi apikal me foramenin apikal." }),
];

const canineLandmarks = (upper: boolean): Landmark[] => [
  lm("cuspTip", { it: "Apice cuspidale", de: "Höckerspitze", en: "Cusp tip", sq: "Maja e kuspidit" }, 0, -0.95, 0.05,
    { it: "Punta unica della corona.", de: "Einzige Spitze der Krone.", en: "The single point of the crown.", sq: "Maja e vetme e kurorës." }),
  lm("mesialRidge", { it: "Cresta cuspidale mesiale", de: "Mesiale Höckerleiste", en: "Mesial cusp ridge", sq: "Kreshta meziale e kuspidit" }, -0.5, -0.6, 0.4,
    { it: "Versante mesiale della cuspide, più corto.", de: "Mesialer, kürzerer Abhang des Höckers.", en: "Mesial slope of the cusp, the shorter one.", sq: "Pjerrësia meziale e kuspidit, më e shkurtra." }),
  lm("distalRidge", { it: "Cresta cuspidale distale", de: "Distale Höckerleiste", en: "Distal cusp ridge", sq: "Kreshta distale e kuspidit" }, 0.5, -0.55, 0.4,
    { it: "Versante distale, di norma più lungo.", de: "Distaler, meist längerer Abhang.", en: "Distal slope, usually the longer one.", sq: "Pjerrësia distale, zakonisht më e gjata." }),
  lm("cingulum", CINGULUM, 0, 0.05, -0.85,
    upper
      ? { it: "Cingolo palatale generalmente marcato.", de: "Meist ausgeprägtes palatinales Zingulum.", en: "Palatal cingulum, usually prominent.", sq: "Cingulum palatinal, zakonisht i theksuar." }
      : { it: "Cingolo linguale generalmente meno sviluppato che nel canino superiore.", de: "Linguales Zingulum meist schwächer als beim oberen Eckzahn.", en: "Lingual cingulum, usually less developed than on the upper canine.", sq: "Cingulum lingual, zakonisht më pak i zhvilluar se te kanini i sipërm." }),
  lm("cej", CEJ, 0.6, 0.2, 0.6, CEJ_SHORT),
  lm("apex", APEX, 0, 0.98, 0,
    upper
      ? { it: "Apice della radice di norma più lunga della dentatura.", de: "Spitze der gewöhnlich längsten Wurzel im Gebiss.", en: "Apex of what is usually the longest root in the dentition.", sq: "Maja e rrënjës që zakonisht është më e gjata në dhëmbësi." }
      : { it: "Apice della lunga radice singola, di norma la più lunga dell’arcata mandibolare.", de: "Spitze der langen Einzelwurzel, gewöhnlich der längsten im Unterkiefer.", en: "Apex of the long single root, usually the longest in the mandibular arch.", sq: "Maja e rrënjës së vetme të gjatë, zakonisht më e gjata në harkun mandibular." }),
];

const premolarLandmarks = (upper: boolean): Landmark[] => [
  lm("buccalCusp", { it: "Cuspide vestibolare", de: "Vestibulärer Höcker", en: "Buccal cusp", sq: "Kuspidi vestibular" }, -0.1, -0.9, 0.6,
    { it: "Cuspide rivolta verso la guancia.", de: "Zur Wange gerichteter Höcker.", en: "Cusp facing the cheek.", sq: "Kuspidi nga ana e faqes." }),
  lm("lingualCusp",
    upper
      ? { it: "Cuspide palatale", de: "Palatinaler Höcker", en: "Palatal cusp", sq: "Kuspidi palatinal" }
      : { it: "Cuspide linguale", de: "Lingualer Höcker", en: "Lingual cusp", sq: "Kuspidi lingual" },
    0.05, -0.8, -0.6,
    upper
      ? { it: "Cuspide rivolta verso il palato.", de: "Zum Gaumen gerichteter Höcker.", en: "Cusp facing the palate.", sq: "Kuspidi nga ana e qiellzës." }
      : { it: "Cuspide rivolta verso la lingua.", de: "Zur Zunge gerichteter Höcker.", en: "Cusp facing the tongue.", sq: "Kuspidi nga ana e gjuhës." }),
  lm("centralGroove", { it: "Solco centrale", de: "Zentrale Furche", en: "Central groove", sq: "Brazda qendrore" }, 0, -0.75, 0,
    { it: "Solco mesio-distale della faccia occlusale.", de: "Mesiodistale Furche der Kaufläche.", en: "Mesiodistal groove of the occlusal surface.", sq: "Brazda meziodistale e sipërfaqes okluzale." }),
  lm("mesialFossa", { it: "Fossa mesiale", de: "Mesiale Grube", en: "Mesial fossa", sq: "Gropëza meziale" }, -0.55, -0.72, 0,
    { it: "Depressione occlusale mesiale.", de: "Mesiale okklusale Vertiefung.", en: "Mesial occlusal depression.", sq: "Gropëzim okluzal mezial." }),
  lm("distalFossa", { it: "Fossa distale", de: "Distale Grube", en: "Distal fossa", sq: "Gropëza distale" }, 0.55, -0.72, 0,
    { it: "Depressione occlusale distale.", de: "Distale okklusale Vertiefung.", en: "Distal occlusal depression.", sq: "Gropëzim okluzal distal." }),
  lm("cej", CEJ, 0.62, 0.2, 0.6, CEJ_SHORT),
  lm("apex", APEX, 0, 0.95, 0,
    { it: "Apice radicolare.", de: "Wurzelspitze.", en: "Root apex.", sq: "Maja e rrënjës." }),
];

const molarLandmarks = (upper: boolean, first = false): Landmark[] => {
  const base = [
    lm("mbCusp", { it: "Cuspide mesio-vestibolare", de: "Mesiobukkaler Höcker", en: "Mesiobuccal cusp", sq: "Kuspidi meziobukal" }, -0.55, -0.9, 0.6,
      { it: "Cuspide vestibolare anteriore.", de: "Vorderer vestibulärer Höcker.", en: "Front buccal cusp.", sq: "Kuspidi bukal i përparmë." }),
    lm("dbCusp", { it: "Cuspide disto-vestibolare", de: "Distobukkaler Höcker", en: "Distobuccal cusp", sq: "Kuspidi distobukal" }, 0.55, -0.88, 0.6,
      { it: "Cuspide vestibolare posteriore.", de: "Hinterer vestibulärer Höcker.", en: "Back buccal cusp.", sq: "Kuspidi bukal i pasmë." }),
    lm("mlCusp",
      upper
        ? { it: "Cuspide mesio-palatale", de: "Mesiopalatinaler Höcker", en: "Mesiopalatal cusp", sq: "Kuspidi meziopalatinal" }
        : { it: "Cuspide mesio-linguale", de: "Mesiolingualer Höcker", en: "Mesiolingual cusp", sq: "Kuspidi meziolingual" },
      -0.55, -0.85, -0.6,
      upper
        ? { it: "Cuspide orale anteriore, di norma la più grande del molare superiore.", de: "Vorderer oraler Höcker, meist der größte des oberen Molaren.", en: "Front oral cusp, usually the largest of the upper molar.", sq: "Kuspidi oral i përparmë, zakonisht më i madhi i molarit të sipërm." }
        : { it: "Cuspide orale anteriore.", de: "Vorderer oraler Höcker.", en: "Front oral cusp.", sq: "Kuspidi oral i përparmë." }),
    lm("dlCusp",
      upper
        ? { it: "Cuspide disto-palatale", de: "Distopalatinaler Höcker", en: "Distopalatal cusp", sq: "Kuspidi distopalatinal" }
        : { it: "Cuspide disto-linguale", de: "Distolingualer Höcker", en: "Distolingual cusp", sq: "Kuspidi distolingual" },
      0.55, -0.82, -0.6,
      { it: "Cuspide orale posteriore.", de: "Hinterer oraler Höcker.", en: "Back oral cusp.", sq: "Kuspidi oral i pasmë." }),
    lm("centralFossa", { it: "Fossa centrale", de: "Zentrale Grube", en: "Central fossa", sq: "Gropëza qendrore" }, 0, -0.7, 0,
      { it: "Depressione principale della faccia occlusale.", de: "Hauptvertiefung der Kaufläche.", en: "Main depression of the occlusal surface.", sq: "Gropëzimi kryesor i sipërfaqes okluzale." }),
    lm("centralGroove", { it: "Solco centrale", de: "Zentrale Furche", en: "Central groove", sq: "Brazda qendrore" }, 0.2, -0.74, 0.15,
      { it: "Sistema di solchi occlusali.", de: "Okklusales Fissurensystem.", en: "Occlusal groove system.", sq: "Sistemi i brazdave okluzale." }),
    lm("furcation", { it: "Forcazione", de: "Furkation", en: "Furcation", sq: "Furkacioni" }, 0, 0.42, 0.2,
      { it: "Punto di divisione tra le radici.", de: "Aufteilungsstelle der Wurzeln.", en: "Point where the roots divide.", sq: "Pika ku ndahen rrënjët." }),
    lm("apex", APEX, -0.4, 0.95, 0.3,
      { it: "Estremità apicale di una radice.", de: "Apikales Ende einer Wurzel.", en: "Apical end of one root.", sq: "Fundi apikal i njërës rrënjë." }),
  ];
  if (upper) {
    base.splice(6, 0,
      lm("obliqueRidge", { it: "Cresta obliqua", de: "Schrägleiste", en: "Oblique ridge", sq: "Kreshta e pjerrët" }, 0.1, -0.72, -0.25,
        { it: "Cresta tra cuspide mesio-palatale e disto-vestibolare.", de: "Leiste zwischen mesiopalatinalem und distobukkalem Höcker.", en: "Ridge joining the mesiopalatal and distobuccal cusps.", sq: "Kreshta që bashkon kuspidin meziopalatinal me atë distobukal." }));
  } else if (first) {
    base.splice(6, 0,
      lm("distalCusp", { it: "Cuspide distale", de: "Distaler Höcker", en: "Distal cusp", sq: "Kuspidi distal" }, 0.85, -0.8, 0.15,
        { it: "Quinta cuspide, sul versante disto-vestibolare; tipica del primo molare inferiore.", de: "Fünfter Höcker, distobukkal gelegen; typisch für den ersten unteren Molaren.", en: "Fifth cusp, on the distobuccal side; typical of the lower first molar.", sq: "Kuspidi i pestë, në anën distobukale; tipik për molarin e parë të poshtëm." }));
  }
  return base;
};

type Template = { anatomy: Anatomy; landmarks: Landmark[]; geometry: Geometry };

const SUPPORTING_CUSPS: L = {
  it: "In occlusione ideale, le cuspidi vestibolari inferiori e palatali superiori sono cuspidi di sostegno; quelle opposte sono di guida.",
  de: "In idealer Okklusion sind untere bukkale und obere palatinale Höcker tragende Höcker; die gegenüberliegenden sind Führungshöcker.",
  en: "In ideal occlusion the lower buccal and upper palatal cusps are the supporting (stamp) cusps; the opposite ones are guiding (shearing) cusps.",
  sq: "Në okluzionin ideal, kuspidët bukalë të poshtëm dhe palatinalë të sipërm janë kuspidë mbajtës; të kundërtit janë kuspidë udhëzues.",
};

const THIRD_MOLAR_CANALS: L = {
  it: "Numero e configurazione dei canali molto variabili; non deducibili dalla forma esterna.",
  de: "Kanalzahl und -konfiguration sind stark variabel und nicht aus der äußeren Form ableitbar.",
  en: "Number and configuration of canals vary greatly and cannot be inferred from the external form.",
  sq: "Numri dhe konfigurimi i kanaleve ndryshojnë shumë dhe nuk nxirren nga forma e jashtme.",
};

const THIRD_MOLAR_ERUPTION: L = {
  it: "Eruzione generalmente a 17–21 anni, anche più tardi; distinguere agenesia, inclusione e mancata eruzione.",
  de: "Durchbruch meist mit 17–21 Jahren, auch später; Nichtanlage, Retention und ausbleibenden Durchbruch unterscheiden.",
  en: "Usually erupts at 17–21 years, sometimes later; distinguish agenesis, impaction and failure of eruption.",
  sq: "Zakonisht shpërthen në moshën 17–21 vjeç, ndonjëherë më vonë; dalloni agjenezinë, inkluzionin dhe mosshpërthimin.",
};

const ONE_CANAL: L = { it: "Tipicamente 1 canale.", de: "Typischerweise 1 Kanal.", en: "Typically 1 canal.", sq: "Zakonisht 1 kanal." };
const FOUR_CUSPS: L = { it: "Tipicamente 4 cuspidi.", de: "Typischerweise 4 Höcker.", en: "Typically 4 cusps.", sq: "Zakonisht 4 kuspidë." };
const TWO_CUSPS: L = { it: "Tipicamente 2 cuspidi.", de: "Typischerweise 2 Höcker.", en: "Typically 2 cusps.", sq: "Zakonisht 2 kuspidë." };

function template(arch: Arch, type: ToothTypeKey): Template {
  const upper = arch === "upper";
  const key = `${arch}:${type}`;
  switch (key) {
    case "upper:centralIncisor":
      return {
        geometry: { crownWidth: 0.86, crownHeight: 1, depth: 0.55, cuspCount: 0, rootCount: 1, rootLength: 1.25, rootSpread: 0, silhouette: "blade" },
        landmarks: incisalLandmarks(),
        anatomy: {
          crown: {
            it: "Corona a scalpello, la più larga tra gli anteriori; angolo mesio-incisale quasi retto (circa 90°), disto-incisale più arrotondato. Questi caratteri aiutano a riconoscere il lato, insieme ad altri reperi.",
            de: "Meißelförmige Krone, die breiteste der Frontzähne; mesioinzisale Ecke nahezu rechtwinklig (etwa 90°), distoinzisale Ecke stärker abgerundet. Zusammen mit weiteren Merkmalen hilfreich zur Seitenbestimmung.",
            en: "Chisel-shaped crown, the widest of the anterior teeth; mesioincisal angle almost a right angle (about 90°), distoincisal angle more rounded. Together with other features this helps to determine the side.",
            sq: "Kurorë në formë daltë, më e gjera ndër dhëmbët e përparmë; këndi mezioincizal pothuajse i drejtë (rreth 90°), këndi distoincizal më i rrumbullakosur. Bashkë me shenja të tjera ndihmon për të përcaktuar anën.",
          },
          rootsTypical: { it: "Tipicamente 1 radice conica, diritta.", de: "Typischerweise 1 konische, gerade Wurzel.", en: "Typically 1 straight, conical root.", sq: "Zakonisht 1 rrënjë konike, e drejtë." },
          rootsVariable: { it: "Variabile: lieve curvatura distale dell'apice, dilacerazioni dopo trauma.", de: "Variabel: leichte distale Apexkrümmung, Dilazerationen nach Trauma.", en: "Variable: slight distal curvature of the apex; dilaceration after trauma.", sq: "E ndryshueshme: lakim i lehtë distal i apeksit; dilaceracion pas traumës." },
          canalsTypical: { it: "Tipicamente 1 canale ampio.", de: "Typischerweise 1 weiter Kanal.", en: "Typically 1 wide canal.", sq: "Zakonisht 1 kanal i gjerë." },
          canalsVariable: { it: "Variabile: raramente 2 canali, canali accessori apicali.", de: "Variabel: selten 2 Kanäle, apikale Seitenkanäle.", en: "Variable: rarely 2 canals; apical accessory canals.", sq: "E ndryshueshme: rrallë 2 kanale; kanale aksesore apikale." },
          cuspsTypical: { it: "Nessuna cuspide: margine incisale con 3 mamelloni nei denti appena erotti.", de: "Keine Höcker: Inzisalkante mit 3 Mamelons bei frisch durchgebrochenen Zähnen.", en: "No cusps: incisal edge with 3 mamelons in newly erupted teeth.", sq: "Pa kuspidë: buza incizale me 3 mamelone te dhëmbët e sapo shpërthyer." },
          cuspsVariable: { it: "Variabile: mamelloni consumati precocemente, bordi incisali irregolari.", de: "Variabel: früh abradierte Mamelons, unregelmäßige Schneidekanten.", en: "Variable: mamelons worn early, irregular incisal edges.", sq: "E ndryshueshme: mamelone të konsumuara herët, buzë incizale të parregullta." },
          eruption: { it: "Eruzione tipica 7–8 anni.", de: "Typischer Durchbruch 7.–8. Lebensjahr.", en: "Typical eruption at 7–8 years.", sq: "Shpërthimi tipik në moshën 7–8 vjeç." },
          clinical: { it: "Dente più esposto al trauma frontale; riferimento estetico principale.", de: "Am häufigsten von Frontzahntraumata betroffen; ästhetische Leitstruktur.", en: "The tooth most exposed to anterior trauma; main aesthetic reference.", sq: "Dhëmbi më i ekspozuar ndaj traumës së përparme; referenca kryesore estetike." },
        },
      };
    case "upper:lateralIncisor":
      return {
        geometry: { crownWidth: 0.68, crownHeight: 0.9, depth: 0.5, cuspCount: 0, rootCount: 1, rootLength: 1.2, rootSpread: 0, silhouette: "blade" },
        landmarks: incisalLandmarks(),
        anatomy: {
          crown: {
            it: "Corona più stretta e corta del centrale, angolo disto-incisale arrotondato, fossa palatina profonda (talvolta con forame cieco).",
            de: "Schmalere und kürzere Krone als der mittlere Schneidezahn, abgerundete distoinzisale Ecke, tiefe palatinale Grube (teils mit Foramen caecum).",
            en: "Crown narrower and shorter than the central, rounded distoincisal angle, deep palatal fossa (sometimes with a foramen caecum / lingual pit).",
            sq: "Kurorë më e ngushtë dhe më e shkurtër se e qendrorit, këndi distoincizal i rrumbullakosur, gropëza palatinale e thellë (ndonjëherë me foramen caecum).",
          },
          rootsTypical: { it: "Tipicamente 1 radice sottile.", de: "Typischerweise 1 schlanke Wurzel.", en: "Typically 1 slender root.", sq: "Zakonisht 1 rrënjë e hollë." },
          rootsVariable: { it: "Variabile: frequente curvatura distale del terzo apicale.", de: "Variabel: häufige distale Krümmung des apikalen Drittels.", en: "Variable: frequent distal curvature of the apical third.", sq: "E ndryshueshme: lakim i shpeshtë distal i së tretës apikale." },
          canalsTypical: ONE_CANAL,
          canalsVariable: { it: "Variabile: dens invaginatus con anatomia canalare complessa.", de: "Variabel: Dens invaginatus mit komplexer Kanalanatomie.", en: "Variable: dens invaginatus with complex canal anatomy.", sq: "E ndryshueshme: dens invaginatus me anatomi kanalesh komplekse." },
          cuspsTypical: { it: "Nessuna cuspide; cingolo pronunciato.", de: "Keine Höcker; ausgeprägtes Zingulum.", en: "No cusps; prominent cingulum.", sq: "Pa kuspidë; cingulum i theksuar." },
          cuspsVariable: { it: "Variabile: forma conoide (dente a piolo) o agenesia.", de: "Variabel: Zapfenzahnform oder Nichtanlage.", en: "Variable: peg-shaped (conical) form or agenesis.", sq: "E ndryshueshme: formë konike (dhëmb kunj) ose agjenezi." },
          eruption: { it: "Eruzione tipica 8–9 anni.", de: "Typischer Durchbruch 8.–9. Lebensjahr.", en: "Typical eruption at 8–9 years.", sq: "Shpërthimi tipik në moshën 8–9 vjeç." },
          clinical: { it: "Uno dei denti con agenesia più frequente dopo i terzi molari.", de: "Nach den Weisheitszähnen einer der am häufigsten nicht angelegten Zähne.", en: "After third molars, one of the most frequently congenitally missing teeth.", sq: "Pas molarëve të tretë, një nga dhëmbët që mungojnë më shpesh në mënyrë kongjenitale." },
        },
      };
    case "upper:canine":
    case "lower:canine":
      return {
        geometry: { crownWidth: upper ? 0.78 : 0.7, crownHeight: 1.05, depth: 0.66, cuspCount: 1, rootCount: 1, rootLength: upper ? 1.5 : 1.4, rootSpread: 0, silhouette: "pointed" },
        landmarks: canineLandmarks(upper),
        anatomy: {
          crown: upper
            ? { it: "Corona robusta con singola cuspide e creste marcate; cresta cuspidale mesiale più corta della distale; forte convessità vestibolare.", de: "Kräftige Krone mit einem Höcker und deutlichen Leisten; mesiale Höckerleiste kürzer als die distale; starke vestibuläre Wölbung.", en: "Robust crown with a single cusp and marked ridges; mesial cusp ridge shorter than the distal; strong labial convexity.", sq: "Kurorë e fortë me një kuspid të vetëm dhe kreshta të theksuara; kreshta meziale më e shkurtër se distalja; konveksitet i fortë vestibular." }
            : { it: "Corona più stretta in senso mesio-distale e più simmetrica del canino superiore, cuspide meno acuta, cingolo meno marcato; contorno mesiale quasi in linea con la radice.", de: "Mesiodistal schmalere, symmetrischere Krone als der obere Eckzahn, weniger spitzer Höcker, schwächeres Zingulum; mesiale Kontur fast in Flucht mit der Wurzel.", en: "Crown narrower mesiodistally and more symmetrical than the upper canine, blunter cusp, less prominent cingulum; mesial outline almost in line with the root.", sq: "Kurorë më e ngushtë meziodistalisht dhe më simetrike se kanini i sipërm, kuspid më pak i mprehtë, cingulum më i dobët; kontura meziale pothuajse në vijë me rrënjën." },
          rootsTypical: upper
            ? { it: "Una radice lunga: di norma la più lunga della dentatura.", de: "Eine lange Wurzel: gewöhnlich die längste im Gebiss.", en: "One long root: usually the longest in the dentition.", sq: "Një rrënjë e gjatë: zakonisht më e gjata në dhëmbësi." }
            : { it: "Una radice lunga, di norma la più lunga dell'arcata inferiore (più corta di quella del canino superiore).", de: "Eine lange Wurzel, meist die längste im Unterkiefer (kürzer als beim oberen Eckzahn).", en: "One long root, usually the longest in the lower arch (shorter than the upper canine's).", sq: "Një rrënjë e gjatë, zakonisht më e gjata në harkun e poshtëm (më e shkurtër se e kaninit të sipërm)." },
          rootsVariable: upper
            ? { it: "Variabile: apice appiattito o leggermente curvo.", de: "Variabel: abgeflachter oder leicht gekrümmter Apex.", en: "Variable: flattened or slightly curved apex.", sq: "E ndryshueshme: apeks i rrafshuar ose pak i lakuar." }
            : { it: "Variabile: radice bifida vestibolo-linguale (fino a ~5% dei casi).", de: "Variabel: vestibulolingual zweigeteilte Wurzel (bis ca. 5 % der Fälle).", en: "Variable: root bifurcated buccolingually (up to ~5% of cases).", sq: "E ndryshueshme: rrënjë e ndarë vestibulo-lingualisht (deri rreth 5% e rasteve)." },
          canalsTypical: ONE_CANAL,
          canalsVariable: upper
            ? { it: "Variabile: canale ovalizzato in senso vestibolo-palatale.", de: "Variabel: vestibulopalatinal ovaler Kanal.", en: "Variable: canal oval in the buccopalatal direction.", sq: "E ndryshueshme: kanal oval në drejtimin vestibulo-palatinal." }
            : { it: "Due canali possono essere presenti anche in una radice unica.", de: "Zwei Kanäle können auch in einer einzelnen Wurzel vorkommen.", en: "Two canals may be present even in a single root.", sq: "Dy kanale mund të jenë të pranishme edhe në një rrënjë të vetme." },
          cuspsTypical: { it: "Tipicamente 1 cuspide con cresta mesiale e distale.", de: "Typischerweise 1 Höcker mit mesialer und distaler Leiste.", en: "Typically 1 cusp with mesial and distal ridges.", sq: "Zakonisht 1 kuspid me kreshtë meziale dhe distale." },
          cuspsVariable: { it: "Variabile: apice cuspidale abraso nei pazienti con bruxismo.", de: "Variabel: abradierte Höckerspitze bei Bruxismus.", en: "Variable: worn cusp tip in patients with bruxism.", sq: "E ndryshueshme: majë e konsumuar e kuspidit te pacientët me bruksizëm." },
          eruption: upper
            ? { it: "Eruzione tipica 11–12 anni.", de: "Typischer Durchbruch 11.–12. Lebensjahr.", en: "Typical eruption at 11–12 years.", sq: "Shpërthimi tipik në moshën 11–12 vjeç." }
            : { it: "Eruzione tipica 9–10 anni.", de: "Typischer Durchbruch 9.–10. Lebensjahr.", en: "Typical eruption at 9–10 years.", sq: "Shpërthimi tipik në moshën 9–10 vjeç." },
          clinical: upper
            ? { it: "Guida canina in lateralità; frequente inclusione palatale.", de: "Eckzahnführung bei Laterotrusion; häufige palatinale Retention.", en: "Canine guidance in lateral excursion; frequently impacted palatally.", sq: "Udhëzim kanin në lëvizjet laterale; shpesh i inkluduar palatinalisht." }
            : { it: "Spesso tra gli ultimi denti conservati in arcata inferiore; utile pilastro protesico.", de: "Oft einer der am längsten erhaltenen Unterkieferzähne; wertvoller Pfeilerzahn.", en: "Often among the last teeth retained in the lower arch; valuable prosthetic abutment.", sq: "Shpesh ndër dhëmbët e fundit që ruhen në harkun e poshtëm; mbështetje e vlefshme protetike." },
        },
      };
    case "upper:firstPremolar":
      return {
        geometry: { crownWidth: 0.8, crownHeight: 0.78, depth: 0.85, cuspCount: 2, rootCount: 2, rootLength: 1.15, rootSpread: 0.35, silhouette: "premolar" },
        landmarks: premolarLandmarks(true),
        anatomy: {
          crown: {
            it: "Due cuspidi, vestibolare più alta. La punta vestibolare è di norma spostata distalmente: cresta cuspidale mesiale più lunga della distale, al contrario del canino. Solco marginale mesiale attraverso la cresta marginale mesiale; concavità mesiale dalla corona cervicale alla radice.",
            de: "Zwei Höcker, vestibulär höher. Vestibuläre Höckerspitze meist distal versetzt: mesiale Höckerleiste länger als die distale, anders als beim Eckzahn. Mesiale Randleistenfurche über die mesiale Randleiste; mesiale Konkavität von der zervikalen Krone bis auf die Wurzel.",
            en: "Two cusps, the buccal one taller. The buccal cusp tip is usually displaced distally: mesial cusp ridge longer than the distal, the opposite of the canine. Mesial marginal developmental groove crossing the mesial marginal ridge; mesial concavity running from the cervical crown onto the root.",
            sq: "Dy kuspidë, ai vestibular më i lartë. Maja vestibulare zakonisht është e zhvendosur distalisht: kreshta meziale më e gjatë se distalja, e kundërta e kaninit. Brazdë margjinale meziale që kalon kreshtën margjinale meziale; konkavitet mezial nga kurora cervikale deri te rrënja.",
          },
          rootsTypical: { it: "Una o due radici sono forme comuni (più spesso due); quando separate sono vestibolare e palatale.", de: "Eine oder zwei Wurzeln sind häufig (meist zwei); getrennte Wurzeln liegen vestibulär und palatinal.", en: "One or two roots are both common (more often two); when separate they are buccal and palatal.", sq: "Një ose dy rrënjë janë të zakonshme (më shpesh dy); kur janë të ndara, janë vestibulare dhe palatinale." },
          rootsVariable: { it: "Una radice può contenere due canali; tre radici sono rare. Frequenze variabili tra popolazioni.", de: "Eine Wurzel kann zwei Kanäle enthalten; drei Wurzeln sind selten. Häufigkeiten variieren zwischen Populationen.", en: "A single root may contain two canals; three roots are rare. Frequencies vary between populations.", sq: "Një rrënjë mund të ketë dy kanale; tre rrënjë janë të rralla. Shpeshtësitë ndryshojnë ndërmjet popullatave." },
          canalsTypical: { it: "Tipicamente 2 canali (vestibolare e palatale).", de: "Typischerweise 2 Kanäle (vestibulär und palatinal).", en: "Typically 2 canals (buccal and palatal).", sq: "Zakonisht 2 kanale (vestibular dhe palatinal)." },
          canalsVariable: { it: "Variabile: 1 o 3 canali.", de: "Variabel: 1 oder 3 Kanäle.", en: "Variable: 1 or 3 canals.", sq: "E ndryshueshme: 1 ose 3 kanale." },
          cuspsTypical: TWO_CUSPS,
          cuspsVariable: { it: "Variabile: cuspide palatale ridotta.", de: "Variabel: reduzierter palatinaler Höcker.", en: "Variable: reduced palatal cusp.", sq: "E ndryshueshme: kuspid palatinal i reduktuar." },
          eruption: { it: "Eruzione tipica 10–11 anni.", de: "Typischer Durchbruch 10.–11. Lebensjahr.", en: "Typical eruption at 10–11 years.", sq: "Shpërthimi tipik në moshën 10–11 vjeç." },
          clinical: { it: "Frequente estrazione ortodontica; radici sottili a rischio di frattura.", de: "Häufiger kieferorthopädischer Extraktionszahn; frakturgefährdete schlanke Wurzeln.", en: "Frequently extracted for orthodontic reasons; slender roots at risk of fracture.", sq: "Shpesh nxirret për arsye ortodontike; rrënjë të holla me rrezik frakture." },
        },
      };
    case "upper:secondPremolar":
      return {
        geometry: { crownWidth: 0.78, crownHeight: 0.75, depth: 0.84, cuspCount: 2, rootCount: 1, rootLength: 1.2, rootSpread: 0, silhouette: "premolar" },
        landmarks: premolarLandmarks(true),
        anatomy: {
          crown: { it: "Cuspidi vestibolare e palatale quasi della stessa altezza, punta vestibolare centrata, solco centrale più corto con più solchi accessori; manca la concavità mesiale del primo premolare.", de: "Vestibulärer und palatinaler Höcker nahezu gleich hoch, zentrierte vestibuläre Höckerspitze, kürzere zentrale Fissur mit mehr Nebenfurchen; die mesiale Konkavität des ersten Prämolaren fehlt.", en: "Buccal and palatal cusps of almost equal height, centred buccal cusp tip, shorter central groove with more supplementary grooves; lacks the mesial concavity of the first premolar.", sq: "Kuspidët vestibular dhe palatinal pothuajse të së njëjtës lartësi, maja vestibulare e qendërzuar, brazda qendrore më e shkurtër me më shumë brazda shtesë; mungon konkaviteti mezial i premolarit të parë." },
          rootsTypical: { it: "Tipicamente 1 radice appiattita.", de: "Typischerweise 1 abgeflachte Wurzel.", en: "Typically 1 flattened root.", sq: "Zakonisht 1 rrënjë e rrafshuar." },
          rootsVariable: { it: "Variabile: 2 radici o radice con solco marcato.", de: "Variabel: 2 Wurzeln oder Wurzel mit tiefer Furche.", en: "Variable: 2 roots or a root with a deep groove.", sq: "E ndryshueshme: 2 rrënjë ose rrënjë me brazdë të thellë." },
          canalsTypical: { it: "1 o 2 canali sono entrambi comuni (circa metà ciascuno, con variazioni tra popolazioni); due canali possono confluire in un unico forame apicale.", de: "1 oder 2 Kanäle sind beide häufig (ungefähr je die Hälfte, mit Populationsunterschieden); zwei Kanäle können in ein gemeinsames apikales Foramen münden.", en: "1 or 2 canals are both common (roughly half each, varying by population); two canals may join into a single apical foramen.", sq: "1 ose 2 kanale janë të dyja të zakonshme (afërsisht gjysma secila, me ndryshime sipas popullatës); dy kanale mund të bashkohen në një foramen të vetëm apikal." },
          canalsVariable: { it: "Tre canali sono rari; possibili divisioni, confluenze e sbocchi apicali separati. Il numero di canali non si deduce dalle radici.", de: "Drei Kanäle sind selten; Aufteilungen, Vereinigungen und getrennte apikale Austritte sind möglich. Die Kanalzahl folgt nicht aus der Wurzelzahl.", en: "Three canals are rare; divisions, mergers and separate apical exits are possible. Canal number cannot be inferred from root number.", sq: "Tre kanale janë të rralla; janë të mundshme ndarje, bashkime dhe dalje apikale të veçanta. Numri i kanaleve nuk nxirret nga numri i rrënjëve." },
          cuspsTypical: TWO_CUSPS,
          cuspsVariable: { it: "Variabile: cuspidi accessorie sul versante palatale.", de: "Variabel: akzessorische Höcker palatinal.", en: "Variable: accessory cusps on the palatal side.", sq: "E ndryshueshme: kuspidë aksesorë në anën palatinale." },
          eruption: { it: "Eruzione tipica 10–12 anni.", de: "Typischer Durchbruch 10.–12. Lebensjahr.", en: "Typical eruption at 10–12 years.", sq: "Shpërthimi tipik në moshën 10–12 vjeç." },
          clinical: { it: "Rapporto stretto con il seno mascellare.", de: "Enge Lagebeziehung zur Kieferhöhle.", en: "Close relationship with the maxillary sinus.", sq: "Marrëdhënie e ngushtë me sinusin maksilar." },
        },
      };
    case "upper:firstMolar":
      return {
        geometry: { crownWidth: 1.1, crownHeight: 0.8, depth: 1.05, cuspCount: 4, rootCount: 3, rootLength: 1.2, rootSpread: 0.5, silhouette: "molar" },
        landmarks: molarLandmarks(true),
        anatomy: {
          crown: { it: "Corona generalmente romboidale con quattro cuspidi principali (la mesio-palatale è la più grande) e cresta obliqua; di norma il più grande molare superiore.", de: "Meist rhomboide Krone mit vier Haupthöckern (der mesiopalatinale ist der größte) und Schrägleiste; gewöhnlich der größte obere Molar.", en: "Usually rhomboid crown with four main cusps (the mesiopalatal is the largest) and an oblique ridge; normally the largest upper molar.", sq: "Kurorë zakonisht romboidale me katër kuspidë kryesorë (ai meziopalatinal është më i madhi) dhe kreshtë të pjerrët; zakonisht molari më i madh i sipërm." },
          rootsTypical: { it: "Tipicamente 3 radici (mesio-vestibolare, disto-vestibolare, palatale, quest'ultima la più lunga).", de: "Typischerweise 3 Wurzeln (mesiobukkal, distobukkal, palatinal; die palatinale ist die längste).", en: "Typically 3 roots (mesiobuccal, distobuccal, palatal; the palatal root is the longest).", sq: "Zakonisht 3 rrënjë (meziobukale, distobukale, palatinale; ajo palatinale është më e gjata)." },
          rootsVariable: { it: "Variabile: fusione delle radici vestibolari, radici divergenti o convergenti.", de: "Variabel: Verschmelzung der bukkalen Wurzeln, divergierende oder konvergierende Wurzeln.", en: "Variable: fusion of the buccal roots; divergent or convergent roots.", sq: "E ndryshueshme: bashkim i rrënjëve bukale; rrënjë divergjente ose konvergjente." },
          canalsTypical: { it: "Tipicamente 3–4 canali.", de: "Typischerweise 3–4 Kanäle.", en: "Typically 3–4 canals.", sq: "Zakonisht 3–4 kanale." },
          canalsVariable: { it: "MB2 è frequente; la prevalenza dipende da popolazione e metodo di rilevazione.", de: "MB2 ist häufig; die Prävalenz hängt von Population und Nachweismethode ab.", en: "MB2 is common; its reported prevalence depends on population and detection method.", sq: "MB2 është i shpeshtë; prevalenca varet nga popullata dhe metoda e zbulimit." },
          cuspsTypical: FOUR_CUSPS,
          cuspsVariable: { it: "Variabile: tubercolo di Carabelli sulla cuspide mesio-palatale.", de: "Variabel: Carabelli-Höcker am mesiopalatinalen Höcker.", en: "Variable: cusp of Carabelli on the mesiopalatal cusp.", sq: "E ndryshueshme: tuberkuli i Carabellit në kuspidin meziopalatinal." },
          eruption: { it: "Eruzione generalmente a 6–7 anni (dente dei sei anni); tempi individuali variabili.", de: "Durchbruch meist mit 6–7 Jahren (Sechsjahrmolar); individuelle Abweichungen möglich.", en: "Usually erupts at 6–7 years (the 'six-year molar'); individual timing varies.", sq: "Zakonisht shpërthen në moshën 6–7 vjeç ('molari i gjashtë vjetëve'); koha individuale ndryshon." },
          clinical: {
            it: `Chiave dell'occlusione di Angle; alta prevalenza di carie occlusale. ${SUPPORTING_CUSPS.it}`,
            de: `Schlüssel der Angle-Okklusion; hohe Prävalenz okklusaler Karies. ${SUPPORTING_CUSPS.de}`,
            en: `Key to Angle's classification of occlusion; high prevalence of occlusal caries. ${SUPPORTING_CUSPS.en}`,
            sq: `Çelësi i klasifikimit të okluzionit sipas Angle; prevalencë e lartë e kariesit okluzal. ${SUPPORTING_CUSPS.sq}`,
          },
        },
      };
    case "upper:secondMolar":
      return {
        geometry: { crownWidth: 1.02, crownHeight: 0.76, depth: 1, cuspCount: 4, rootCount: 3, rootLength: 1.12, rootSpread: 0.34, silhouette: "molar" },
        landmarks: molarLandmarks(true),
        anatomy: {
          crown: { it: "Simile al primo molare ma più piccola, cuspide disto-palatale ridotta, cresta obliqua meno marcata; nessun tubercolo di Carabelli di norma.", de: "Ähnlich dem ersten Molaren, jedoch kleiner, distopalatinaler Höcker reduziert, Schrägleiste schwächer; meist kein Carabelli-Höcker.", en: "Similar to the first molar but smaller, reduced distopalatal cusp, less prominent oblique ridge; usually no Carabelli cusp.", sq: "I ngjashëm me molarin e parë por më i vogël, kuspidi distopalatinal i reduktuar, kreshta e pjerrët më pak e theksuar; zakonisht pa tuberkul Carabelli." },
          rootsTypical: { it: "Tipicamente 3 radici più ravvicinate.", de: "Typischerweise 3 enger stehende Wurzeln.", en: "Typically 3 roots, closer together.", sq: "Zakonisht 3 rrënjë më afër njëra-tjetrës." },
          rootsVariable: { it: "Possibile fusione radicolare; non equivale necessariamente a un sistema canalare a C.", de: "Wurzelverschmelzung ist möglich; sie bedeutet nicht zwangsläufig ein C-förmiges Kanalsystem.", en: "Root fusion is possible; it does not necessarily mean a C-shaped canal system.", sq: "Bashkimi i rrënjëve është i mundshëm; nuk do të thotë domosdoshmërisht sistem kanalesh në formë C." },
          canalsTypical: { it: "Tipicamente 3 canali.", de: "Typischerweise 3 Kanäle.", en: "Typically 3 canals.", sq: "Zakonisht 3 kanale." },
          canalsVariable: { it: "Variabile: MB2 meno frequente rispetto al primo molare.", de: "Variabel: MB2 seltener als beim ersten Molaren.", en: "Variable: MB2 less frequent than in the first molar.", sq: "E ndryshueshme: MB2 më i rrallë se te molari i parë." },
          cuspsTypical: FOUR_CUSPS,
          cuspsVariable: { it: "Variabile: forma a 3 cuspidi, spesso con contorno a cuore per riduzione o assenza della cuspide disto-palatale.", de: "Variabel: dreihöckrige, oft herzförmige Form bei reduziertem oder fehlendem distopalatinalem Höcker.", en: "Variable: 3-cusp, often heart-shaped form when the distopalatal cusp is reduced or absent.", sq: "E ndryshueshme: formë me 3 kuspidë, shpesh në formë zemre kur kuspidi distopalatinal është i reduktuar ose mungon." },
          eruption: { it: "Eruzione tipica 12–13 anni.", de: "Typischer Durchbruch 12.–13. Lebensjahr.", en: "Typical eruption at 12–13 years.", sq: "Shpërthimi tipik në moshën 12–13 vjeç." },
          clinical: { it: "Accesso operativo difficile; prossimità al seno mascellare.", de: "Erschwerter Zugang; Nähe zur Kieferhöhle.", en: "Difficult operative access; close to the maxillary sinus.", sq: "Qasje e vështirë operative; afër sinusit maksilar." },
        },
      };
    case "upper:thirdMolar":
      return {
        geometry: { crownWidth: 0.95, crownHeight: 0.7, depth: 0.95, cuspCount: 3, rootCount: 1, rootLength: 0.95, rootSpread: 0, silhouette: "molar" },
        landmarks: molarLandmarks(true),
        anatomy: {
          crown: { it: "Corona di dimensioni e forma molto variabili, spesso a 3 cuspidi.", de: "Krone mit sehr variabler Größe und Form, oft dreihöckrig.", en: "Crown very variable in size and shape, often with 3 cusps.", sq: "Kurorë me madhësi dhe formë shumë të ndryshueshme, shpesh me 3 kuspidë." },
          rootsTypical: { it: "Tipicamente radici corte e fuse in un unico cono.", de: "Typischerweise kurze, zu einem Konus verschmolzene Wurzeln.", en: "Typically short roots fused into a single cone.", sq: "Zakonisht rrënjë të shkurtra të bashkuara në një kon të vetëm." },
          rootsVariable: { it: "Variabile: da 1 a 4 radici, curvature imprevedibili.", de: "Variabel: 1 bis 4 Wurzeln, unvorhersehbare Krümmungen.", en: "Variable: 1 to 4 roots, unpredictable curvatures.", sq: "E ndryshueshme: 1 deri në 4 rrënjë, lakime të paparashikueshme." },
          canalsTypical: THIRD_MOLAR_CANALS,
          canalsVariable: { it: "Variabile: anatomia canalare irregolare e imprevedibile.", de: "Variabel: unregelmäßige, unvorhersehbare Kanalanatomie.", en: "Variable: irregular, unpredictable canal anatomy.", sq: "E ndryshueshme: anatomi kanalesh e parregullt dhe e paparashikueshme." },
          cuspsTypical: { it: "Tipicamente 3 cuspidi.", de: "Typischerweise 3 Höcker.", en: "Typically 3 cusps.", sq: "Zakonisht 3 kuspidë." },
          cuspsVariable: { it: "Variabile: da 2 a 5 cuspidi, solchi accessori.", de: "Variabel: 2 bis 5 Höcker, akzessorische Fissuren.", en: "Variable: 2 to 5 cusps, accessory grooves.", sq: "E ndryshueshme: 2 deri në 5 kuspidë, brazda aksesore." },
          eruption: THIRD_MOLAR_ERUPTION,
          clinical: { it: "Agenesia e inclusione molto frequenti.", de: "Nichtanlage und Retention sehr häufig.", en: "Agenesis and impaction are very common.", sq: "Agjenezia dhe inkluzioni janë shumë të shpeshta." },
        },
      };
    case "lower:centralIncisor":
      return {
        geometry: { crownWidth: 0.55, crownHeight: 0.85, depth: 0.45, cuspCount: 0, rootCount: 1, rootLength: 1.1, rootSpread: 0, silhouette: "blade" },
        landmarks: incisalLandmarks(),
        anatomy: {
          crown: { it: "Il dente più piccolo della dentatura permanente, corona stretta e simmetrica: angoli mesio- e disto-incisale quasi uguali.", de: "Der kleinste Zahn des bleibenden Gebisses, schmale, symmetrische Krone: mesio- und distoinzisale Ecke nahezu gleich.", en: "The smallest tooth of the permanent dentition; narrow, symmetrical crown with almost identical mesioincisal and distoincisal angles.", sq: "Dhëmbi më i vogël i dhëmbësisë së përhershme; kurorë e ngushtë dhe simetrike, me kënde mezioincizal dhe distoincizal pothuajse të njëjta." },
          rootsTypical: { it: "Tipicamente 1 radice appiattita in senso mesio-distale.", de: "Typischerweise 1 mesiodistal abgeflachte Wurzel.", en: "Typically 1 root, flattened mesiodistally.", sq: "Zakonisht 1 rrënjë e rrafshuar meziodistalisht." },
          rootsVariable: { it: "Variabile: solchi radicolari profondi.", de: "Variabel: tiefe Wurzelfurchen.", en: "Variable: deep root grooves.", sq: "E ndryshueshme: brazda të thella rrënjësore." },
          canalsTypical: ONE_CANAL,
          canalsVariable: { it: "Variabile: 2 canali (vestibolare e linguale) fino al 40% dei casi.", de: "Variabel: 2 Kanäle (vestibulär und lingual) in bis zu 40 % der Fälle.", en: "Variable: 2 canals (labial and lingual) in up to 40% of cases.", sq: "E ndryshueshme: 2 kanale (vestibular dhe lingual) deri në 40% të rasteve." },
          cuspsTypical: { it: "Nessuna cuspide; margine incisale rettilineo.", de: "Keine Höcker; gerade Inzisalkante.", en: "No cusps; straight incisal edge.", sq: "Pa kuspidë; buzë incizale e drejtë." },
          cuspsVariable: { it: "Variabile: mamelloni visibili nei giovani.", de: "Variabel: sichtbare Mamelons bei Jugendlichen.", en: "Variable: mamelons visible in young patients.", sq: "E ndryshueshme: mamelone të dukshme te të rinjtë." },
          eruption: { it: "Eruzione tipica 6–7 anni.", de: "Typischer Durchbruch 6.–7. Lebensjahr.", en: "Typical eruption at 6–7 years.", sq: "Shpërthimi tipik në moshën 6–7 vjeç." },
          clinical: { it: "Sede tipica di accumulo di tartaro linguale (sbocco dei dotti sottomandibolari).", de: "Typische Stelle lingualer Zahnsteinbildung (Mündung der Unterkieferspeicheldrüsengänge).", en: "Typical site of lingual calculus (near the submandibular duct openings).", sq: "Vend tipik i gurëzave linguale (pranë daljes së kanaleve submandibulare)." },
        },
      };
    case "lower:lateralIncisor":
      return {
        geometry: { crownWidth: 0.6, crownHeight: 0.9, depth: 0.47, cuspCount: 0, rootCount: 1, rootLength: 1.15, rootSpread: 0, silhouette: "blade" },
        landmarks: incisalLandmarks(),
        anatomy: {
          crown: { it: "Leggermente più grande del centrale inferiore, margine incisale con torsione disto-linguale per seguire l’arcata; angolo disto-incisale più arrotondato.", de: "Etwas größer als der mittlere untere Schneidezahn, distolingual gedrehte Inzisalkante zur Anpassung an den Zahnbogen; distoinzisale Ecke stärker gerundet.", en: "Slightly larger than the lower central, incisal edge twisted distolingually to follow the arch; distoincisal angle more rounded.", sq: "Pak më i madh se prerësi qendror i poshtëm, buza incizale e rrotulluar distolingualisht për të ndjekur harkun; këndi distoincizal më i rrumbullakosur." },
          rootsTypical: { it: "Tipicamente 1 radice, più lunga di quella del centrale.", de: "Typischerweise 1 Wurzel, länger als beim mittleren Schneidezahn.", en: "Typically 1 root, longer than the central's.", sq: "Zakonisht 1 rrënjë, më e gjatë se e prerësit qendror." },
          rootsVariable: { it: "Variabile: curvatura distale apicale.", de: "Variabel: distale Krümmung im apikalen Bereich.", en: "Variable: distal apical curvature.", sq: "E ndryshueshme: lakim distal apikal." },
          canalsTypical: ONE_CANAL,
          canalsVariable: { it: "Due canali possono confluire prima dell’apice oppure terminare separatamente.", de: "Zwei Kanäle können vor der Wurzelspitze zusammenlaufen oder getrennt enden.", en: "Two canals may merge before the apex or exit separately.", sq: "Dy kanale mund të bashkohen para apeksit ose të përfundojnë veçmas." },
          cuspsTypical: { it: "Nessuna cuspide.", de: "Keine Höcker.", en: "No cusps.", sq: "Pa kuspidë." },
          cuspsVariable: { it: "Variabile: margine incisale asimmetrico.", de: "Variabel: asymmetrische Schneidekante.", en: "Variable: asymmetrical incisal edge.", sq: "E ndryshueshme: buzë incizale asimetrike." },
          eruption: { it: "Eruzione tipica 7–8 anni.", de: "Typischer Durchbruch 7.–8. Lebensjahr.", en: "Typical eruption at 7–8 years.", sq: "Shpërthimi tipik në moshën 7–8 vjeç." },
          clinical: { it: "Frequente affollamento incisivo inferiore.", de: "Häufiger Engstand der Unterkieferfront.", en: "Lower incisor crowding is common.", sq: "Mbushullimi i prerësve të poshtëm është i shpeshtë." },
        },
      };
    case "lower:firstPremolar":
      return {
        geometry: { crownWidth: 0.72, crownHeight: 0.76, depth: 0.78, cuspCount: 2, rootCount: 1, rootLength: 1.2, rootSpread: 0, silhouette: "premolar" },
        landmarks: premolarLandmarks(false),
        anatomy: {
          crown: { it: "Cuspide vestibolare dominante e piccola cuspide linguale normalmente non funzionale. Corona e tavola occlusale fortemente inclinate lingualmente; frequente solco mesio-linguale. Aspetto quasi caniniforme.", de: "Dominanter vestibulärer und kleiner, gewöhnlich nicht funktioneller lingualer Höcker. Krone und Okklusalfläche stark lingual geneigt; häufig mesiolinguale Entwicklungsfurche. Nahezu eckzahnähnlich.", en: "Dominant buccal cusp and a small, normally non-functional lingual cusp. Crown and occlusal table strongly tilted lingually; mesiolingual developmental groove is frequent. Almost canine-like appearance.", sq: "Kuspid vestibular dominues dhe kuspid lingual i vogël, zakonisht jofunksional. Kurora dhe tabela okluzale të pjerrëta fort nga lingualja; brazda meziolinguale është e shpeshtë. Pamje pothuajse si e kaninit." },
          rootsTypical: { it: "Tipicamente 1 radice conica.", de: "Typischerweise 1 konische Wurzel.", en: "Typically 1 conical root.", sq: "Zakonisht 1 rrënjë konike." },
          rootsVariable: { it: "Variabile: radice bifida nel terzo apicale.", de: "Variabel: im apikalen Drittel zweigeteilte Wurzel.", en: "Variable: root divided in the apical third.", sq: "E ndryshueshme: rrënjë e ndarë në të tretën apikale." },
          canalsTypical: ONE_CANAL,
          canalsVariable: { it: "Possibili divisioni e confluenze canalari; una configurazione a C è distinta dalla semplice biforcazione.", de: "Kanalaufteilungen und Vereinigungen sind möglich; eine C-Konfiguration ist nicht gleichbedeutend mit einer einfachen Aufteilung.", en: "Canal divisions and mergers are possible; a C-shaped configuration is not the same as a simple split.", sq: "Janë të mundshme ndarje dhe bashkime kanalesh; konfigurimi në formë C nuk është i njëjtë me një ndarje të thjeshtë." },
          cuspsTypical: { it: "Tipicamente 2 cuspidi con dislivello marcato.", de: "Typischerweise 2 Höcker mit deutlichem Höhenunterschied.", en: "Typically 2 cusps with a marked difference in height.", sq: "Zakonisht 2 kuspidë me diferencë të theksuar lartësie." },
          cuspsVariable: { it: "Variabile: cuspide linguale appena accennata.", de: "Variabel: nur angedeuteter lingualer Höcker.", en: "Variable: lingual cusp barely indicated.", sq: "E ndryshueshme: kuspid lingual mezi i dukshëm." },
          eruption: { it: "Eruzione tipica 10–12 anni.", de: "Typischer Durchbruch 10.–12. Lebensjahr.", en: "Typical eruption at 10–12 years.", sq: "Shpërthimi tipik në moshën 10–12 vjeç." },
          clinical: { it: "Possibile complessità endodontica per divisioni canalari e altre configurazioni variabili.", de: "Mögliche endodontische Komplexität durch Kanalaufteilungen und andere variable Konfigurationen.", en: "Possible endodontic complexity due to canal divisions and other variable configurations.", sq: "Kompleksitet i mundshëm endodontik për shkak të ndarjeve të kanaleve dhe konfigurimeve të tjera." },
        },
      };
    case "lower:secondPremolar":
      return {
        geometry: { crownWidth: 0.76, crownHeight: 0.78, depth: 0.82, cuspCount: 3, rootCount: 1, rootLength: 1.22, rootSpread: 0, silhouette: "premolar" },
        landmarks: premolarLandmarks(false),
        anatomy: {
          crown: { it: "Corona più squadrata e meno inclinata del primo premolare, con cuspide vestibolare e una o due cuspidi linguali ben sviluppate.", de: "Kantigere, weniger geneigte Krone als beim ersten Prämolaren, mit einem vestibulären und ein bis zwei gut entwickelten lingualen Höckern.", en: "Squarer, less tilted crown than the first premolar, with one buccal cusp and one or two well-developed lingual cusps.", sq: "Kurorë më katrore dhe më pak e pjerrët se e premolarit të parë, me një kuspid vestibular dhe një ose dy kuspidë linguale të zhvilluar mirë." },
          rootsTypical: { it: "Tipicamente 1 radice robusta.", de: "Typischerweise 1 kräftige Wurzel.", en: "Typically 1 sturdy root.", sq: "Zakonisht 1 rrënjë e fortë." },
          rootsVariable: { it: "Variabile: apice leggermente deviato in distale.", de: "Variabel: leicht nach distal abweichender Apex.", en: "Variable: apex slightly deviated distally.", sq: "E ndryshueshme: apeks pak i devijuar distalisht." },
          canalsTypical: ONE_CANAL,
          canalsVariable: { it: "Variabile: 2 canali in una minoranza di casi.", de: "Variabel: 2 Kanäle in einer Minderheit der Fälle.", en: "Variable: 2 canals in a minority of cases.", sq: "E ndryshueshme: 2 kanale në një pakicë rastesh." },
          cuspsTypical: { it: "Forma a 3 cuspidi con solchi a Y (una vestibolare, due linguali): la più comune nell’insegnamento classico, con frequenze variabili tra popolazioni.", de: "Dreihöckrige Form mit Y-Furchenmuster (ein vestibulärer, zwei linguale Höcker): häufigste Form in der klassischen Lehre, mit populationsabhängigen Häufigkeiten.", en: "3-cusp form with a Y-shaped groove pattern (one buccal, two lingual cusps): the most common form in classic teaching, with frequencies varying by population.", sq: "Formë me 3 kuspidë dhe brazda në formë Y (një vestibular, dy lingualë): forma më e zakonshme në mësimdhënien klasike, me shpeshtësi që ndryshon sipas popullatës." },
          cuspsVariable: { it: "Alternativa a 2 cuspidi (una vestibolare, una linguale), con solchi a H o U.", de: "Alternative zweihöckrige Form (ein vestibulärer, ein lingualer Höcker) mit H- oder U-Furchenmuster.", en: "Alternative 2-cusp form (one buccal, one lingual) with an H- or U-shaped groove pattern.", sq: "Formë alternative me 2 kuspidë (një vestibular, një lingual), me brazda në formë H ose U." },
          eruption: { it: "Eruzione tipica 11–12 anni.", de: "Typischer Durchbruch 11.–12. Lebensjahr.", en: "Typical eruption at 11–12 years.", sq: "Shpërthimi tipik në moshën 11–12 vjeç." },
          clinical: { it: "Vicinanza al forame mentoniero.", de: "Nähe zum Foramen mentale.", en: "Close to the mental foramen.", sq: "Afër foramenit mental." },
        },
      };
    case "lower:firstMolar":
      return {
        geometry: { crownWidth: 1.15, crownHeight: 0.8, depth: 1, cuspCount: 5, rootCount: 2, rootLength: 1.18, rootSpread: 0.55, silhouette: "molar" },
        landmarks: molarLandmarks(false, true),
        anatomy: {
          crown: { it: "Corona ampia con tipicamente 5 cuspidi: mesio-vestibolare, disto-vestibolare, distale, mesio-linguale, disto-linguale. Solchi di sviluppo generalmente a Y; esistono varianti.", de: "Breite Krone mit typischerweise 5 Höckern: mesiobukkal, distobukkal, distal, mesiolingual und distolingual. Entwicklungsfurchen meist Y-förmig; Varianten kommen vor.", en: "Wide crown with typically 5 cusps: mesiobuccal, distobuccal, distal, mesiolingual and distolingual. Developmental grooves usually form a Y pattern; variants exist.", sq: "Kurorë e gjerë me zakonisht 5 kuspidë: meziobukal, distobukal, distal, meziolingual dhe distolingual. Brazdat zakonisht në formë Y; ekzistojnë variante." },
          rootsTypical: { it: "Tipicamente 2 radici (mesiale e distale), ben separate.", de: "Typischerweise 2 Wurzeln (mesial und distal), deutlich getrennt.", en: "Typically 2 well-separated roots (mesial and distal).", sq: "Zakonisht 2 rrënjë mirë të ndara (meziale dhe distale)." },
          rootsVariable: { it: "Variabile: terza radice distolinguale (radix entomolaris), più frequente in popolazioni asiatiche.", de: "Variabel: dritte distolinguale Wurzel (Radix entomolaris), häufiger in asiatischen Populationen.", en: "Variable: third distolingual root (radix entomolaris), more frequent in Asian populations.", sq: "E ndryshueshme: rrënjë e tretë distolinguale (radix entomolaris), më e shpeshtë te popullatat aziatike." },
          canalsTypical: { it: "Tipicamente 3 canali (2 mesiali, 1 distale).", de: "Typischerweise 3 Kanäle (2 mesial, 1 distal).", en: "Typically 3 canals (2 mesial, 1 distal).", sq: "Zakonisht 3 kanale (2 meziale, 1 distal)." },
          canalsVariable: { it: "Possibile secondo canale distale (4 canali); possibile canale medio-mesiale tra mesio-vestibolare e mesio-linguale. Frequenze dipendenti da popolazione e metodo.", de: "Möglicher zweiter distaler Kanal (4 Kanäle); möglicher mittlerer mesialer Kanal zwischen mesiobukkalem und mesiolingualem Kanal. Häufigkeiten hängen von Population und Methode ab.", en: "Possible second distal canal (4 canals); possible middle mesial canal between the mesiobuccal and mesiolingual canals. Frequencies depend on population and method.", sq: "Kanal i dytë distal i mundshëm (4 kanale); kanal mezial i mesëm i mundshëm ndërmjet kanalit meziobukal dhe meziolingual. Shpeshtësitë varen nga popullata dhe metoda." },
          cuspsTypical: { it: "Tipicamente 5 cuspidi.", de: "Typischerweise 5 Höcker.", en: "Typically 5 cusps.", sq: "Zakonisht 5 kuspidë." },
          cuspsVariable: { it: "Variabile: 4 cuspidi con cuspide distale assente.", de: "Variabel: 4 Höcker bei fehlendem distalem Höcker.", en: "Variable: 4 cusps when the distal cusp is absent.", sq: "E ndryshueshme: 4 kuspidë kur mungon kuspidi distal." },
          eruption: { it: "Eruzione generalmente a 6–7 anni; tempi individuali variabili.", de: "Durchbruch meist mit 6–7 Jahren; individuelle Abweichungen möglich.", en: "Usually erupts at 6–7 years; individual timing varies.", sq: "Zakonisht shpërthen në moshën 6–7 vjeç; koha individuale ndryshon." },
          clinical: {
            it: `Tra i primi permanenti a erompere insieme agli incisivi centrali inferiori; fossette e fessure possono favorire la carie. ${SUPPORTING_CUSPS.it}`,
            de: `Gehört mit den unteren mittleren Schneidezähnen zu den zuerst durchbrechenden bleibenden Zähnen; Grübchen und Fissuren können Karies begünstigen. ${SUPPORTING_CUSPS.de}`,
            en: `Among the first permanent teeth to erupt, together with the lower central incisors; pits and fissures can favour caries. ${SUPPORTING_CUSPS.en}`,
            sq: `Ndër dhëmbët e parë të përhershëm që shpërthejnë, bashkë me prerësit qendrorë të poshtëm; gropëzat dhe fisurat mund të favorizojnë kariesin. ${SUPPORTING_CUSPS.sq}`,
          },
        },
      };
    case "lower:secondMolar":
      return {
        geometry: { crownWidth: 1.05, crownHeight: 0.78, depth: 0.96, cuspCount: 4, rootCount: 2, rootLength: 1.1, rootSpread: 0.35, silhouette: "molar" },
        landmarks: molarLandmarks(false),
        anatomy: {
          crown: { it: "Corona con tipicamente 4 cuspidi e solco a croce (+) regolare.", de: "Krone mit typischerweise 4 Höckern und regelmäßigem Kreuzfissurenmuster (+).", en: "Crown with typically 4 cusps and a regular cross-shaped (+) groove pattern.", sq: "Kurorë me zakonisht 4 kuspidë dhe brazda të rregullta në formë kryqi (+)." },
          rootsTypical: { it: "Tipicamente 2 radici ravvicinate.", de: "Typischerweise 2 eng stehende Wurzeln.", en: "Typically 2 roots, close together.", sq: "Zakonisht 2 rrënjë afër njëra-tjetrës." },
          rootsVariable: { it: "Possibile fusione radicolare, talvolta associata a un sistema canalare a C; fusione e configurazione a C non sono equivalenti.", de: "Wurzelverschmelzung ist möglich, teilweise mit C-förmigem Kanalsystem; Verschmelzung und C-Konfiguration sind nicht gleichbedeutend.", en: "Root fusion is possible, sometimes with a C-shaped canal system; fusion and C-configuration are not the same thing.", sq: "Bashkimi i rrënjëve është i mundshëm, ndonjëherë me sistem kanalesh në formë C; bashkimi dhe konfigurimi C nuk janë e njëjta gjë." },
          canalsTypical: { it: "Tipicamente 3 canali.", de: "Typischerweise 3 Kanäle.", en: "Typically 3 canals.", sq: "Zakonisht 3 kanale." },
          canalsVariable: { it: "Possibili quattro canali o configurazione a C; frequenze variabili tra popolazioni e metodi di rilevazione.", de: "Vier Kanäle oder C-Konfiguration möglich; Häufigkeiten variieren mit Population und Nachweismethode.", en: "Four canals or a C-shaped configuration are possible; frequencies vary with population and detection method.", sq: "Katër kanale ose konfigurim C janë të mundshme; shpeshtësitë ndryshojnë sipas popullatës dhe metodës." },
          cuspsTypical: FOUR_CUSPS,
          cuspsVariable: { it: "Variabile: cuspidi accessorie occasionali.", de: "Variabel: gelegentlich akzessorische Höcker.", en: "Variable: occasional accessory cusps.", sq: "E ndryshueshme: kuspidë aksesorë të rastësishëm." },
          eruption: { it: "Eruzione tipica 11–13 anni.", de: "Typischer Durchbruch 11.–13. Lebensjahr.", en: "Typical eruption at 11–13 years.", sq: "Shpërthimi tipik në moshën 11–13 vjeç." },
          clinical: { it: "Rapporto con il canale alveolare inferiore.", de: "Lagebeziehung zum Canalis mandibulae.", en: "Relationship with the inferior alveolar (mandibular) canal.", sq: "Marrëdhënie me kanalin alveolar të poshtëm (mandibular)." },
        },
      };
    case "lower:thirdMolar":
    default:
      return {
        geometry: { crownWidth: 1, crownHeight: 0.72, depth: 0.92, cuspCount: 4, rootCount: 2, rootLength: 0.9, rootSpread: 0.2, silhouette: "molar" },
        landmarks: molarLandmarks(false),
        anatomy: {
          crown: { it: "Corona irregolare, con numero di cuspidi e solchi molto variabile.", de: "Unregelmäßige Krone mit stark variabler Höcker- und Fissurenzahl.", en: "Irregular crown with a highly variable number of cusps and grooves.", sq: "Kurorë e parregullt me numër shumë të ndryshueshëm kuspidësh dhe brazdash." },
          rootsTypical: { it: "Tipicamente 2 radici corte, spesso fuse.", de: "Typischerweise 2 kurze, häufig verschmolzene Wurzeln.", en: "Typically 2 short roots, often fused.", sq: "Zakonisht 2 rrënjë të shkurtra, shpesh të bashkuara." },
          rootsVariable: { it: "Variabile: radici curve, uncinate o multiple.", de: "Variabel: gekrümmte, hakenförmige oder multiple Wurzeln.", en: "Variable: curved, hooked or multiple roots.", sq: "E ndryshueshme: rrënjë të lakuara, në formë grepi ose të shumëfishta." },
          canalsTypical: THIRD_MOLAR_CANALS,
          canalsVariable: { it: "Variabile: anatomia canalare imprevedibile.", de: "Variabel: unvorhersehbare Kanalanatomie.", en: "Variable: unpredictable canal anatomy.", sq: "E ndryshueshme: anatomi kanalesh e paparashikueshme." },
          cuspsTypical: FOUR_CUSPS,
          cuspsVariable: { it: "Variabile: da 3 a 6 cuspidi.", de: "Variabel: 3 bis 6 Höcker.", en: "Variable: 3 to 6 cusps.", sq: "E ndryshueshme: 3 deri në 6 kuspidë." },
          eruption: THIRD_MOLAR_ERUPTION,
          clinical: { it: "Inclusione mesio-angolata frequente, rischio per il nervo alveolare inferiore.", de: "Häufige mesioangulare Retention, Risiko für den N. alveolaris inferior.", en: "Mesioangular impaction is common; risk to the inferior alveolar nerve.", sq: "Inkluzioni meziangular është i shpeshtë; rrezik për nervin alveolar të poshtëm." },
        },
      };
  }
}

const typeByPosition: ToothTypeKey[] = [
  "centralIncisor",
  "lateralIncisor",
  "canine",
  "firstPremolar",
  "secondPremolar",
  "firstMolar",
  "secondMolar",
  "thirdMolar",
];

/** Real average proportions (1 unit = 10 mm); counts and silhouette stay from the template. */
function withMeasurements(g: Geometry, arch: Arch, type: ToothTypeKey): Geometry {
  const m = MEASUREMENTS[arch][type];
  return {
    ...g,
    kind: `${arch}:${type}`,
    crownWidth: m.mdCrown / 10,
    depth: m.blCrown / 10,
    crownHeight: m.crownLength / 10,
    rootLength: m.rootLength / 10 / 1.35,
    cervixX: m.mdCervix / m.mdCrown,
    cervixZ: m.blCervix / m.blCrown,
  };
}

function buildTooth(quadrant: number, position: number): Tooth {
  const arch: Arch = quadrant === 1 || quadrant === 2 ? "upper" : "lower";
  const side: Side = quadrant === 1 || quadrant === 4 ? "right" : "left";
  const type = typeByPosition[position - 1] as ToothTypeKey;
  const tpl = template(arch, type);
  const t = typeName[type];
  const a = archName[arch];
  const s = sideName[side];
  return {
    fdi: `${quadrant}${position}`,
    quadrant,
    position,
    type,
    arch,
    side,
    name: {
      it: `${t.it} ${a.it} ${s.it}`,
      de: `${t.de}, ${a.de} ${s.de}`,
      en: `${a.en[0]!.toUpperCase()}${a.en.slice(1)} ${s.en} ${t.en.toLowerCase()}`,
      sq: `${t.sq} ${a.sq} ${s.sq}`,
    },
    shortName: t,
    anatomy: tpl.anatomy,
    landmarks: tpl.landmarks,
    geometry: withMeasurements(tpl.geometry, arch, type),
    modelUrl: null,
  };
}

export const TEETH: Tooth[] = [1, 2, 3, 4]
  .flatMap((q) => [1, 2, 3, 4, 5, 6, 7, 8].map((p) => buildTooth(q, p)));

export const getTooth = (fdi: string): Tooth | undefined => TEETH.find((t) => t.fdi === fdi);

export const QUADRANT_LABEL: Record<number, L> = {
  1: { it: "Q1 · Superiore destro", de: "Q1 · Oberkiefer rechts", en: "Q1 · Upper right", sq: "Q1 · Sipër djathtas" },
  2: { it: "Q2 · Superiore sinistro", de: "Q2 · Oberkiefer links", en: "Q2 · Upper left", sq: "Q2 · Sipër majtas" },
  3: { it: "Q3 · Inferiore sinistro", de: "Q3 · Unterkiefer links", en: "Q3 · Lower left", sq: "Q3 · Poshtë majtas" },
  4: { it: "Q4 · Inferiore destro", de: "Q4 · Unterkiefer rechts", en: "Q4 · Lower right", sq: "Q4 · Poshtë djathtas" },
};

/** Pick a localized string; tolerant of older two-language objects. */
export const tr = (v: Partial<L> & { it: string }, lang: Lang): string => v[lang] ?? v.it;
