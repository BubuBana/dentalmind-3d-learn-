import { TEETH, getTooth, type L, type Lang, type Tooth, type ToothTypeKey, type Arch } from "./teeth";

import { classIAntagonists } from "./anatomyFacts";

export const pickL = (v: L, lang: Lang) => v[lang];

/* ------------------------------------------------------------------ */
/* Mirror logic                                                        */
/* ------------------------------------------------------------------ */

/** Same arch, opposite side (left/right mirror). */
export function mirrorFdi(fdi: string): string {
  const q = Number(fdi[0]);
  const p = fdi.slice(1);
  const map: Record<number, number> = { 1: 2, 2: 1, 3: 4, 4: 3 };
  return `${map[q]}${p}`;
}

/* ------------------------------------------------------------------ */
/* Mesial / distal logic                                               */
/* ------------------------------------------------------------------ */

/** Mesial contact in a complete arch, including the contralateral central incisor. */
export function mesialNeighbour(fdi: string): string | null {
  const q = Number(fdi[0]);
  const p = Number(fdi[1]);
  if (!/^[1-4][1-8]$/.test(fdi)) return null;
  if (p === 1) return mirrorFdi(fdi);
  return `${q}${p - 1}`;
}

/** Neighbour away from the midline (distal); null for third molars. */
export function distalNeighbour(fdi: string): string | null {
  const q = Number(fdi[0]);
  const p = Number(fdi[1]);
  if (!/^[1-4][1-8]$/.test(fdi) || p === 8) return null;
  return `${q}${p + 1}`;
}

export interface LessonSection {
  title: L;
  body: L;
  tip?: L;
}

export const MESIAL_DISTAL_LESSON: LessonSection[] = [
  {
    title: { it: "Il punto di riferimento è la linea mediana", de: "Bezugspunkt ist die Mittellinie", en: "The reference point is the midline", sq: "Pika e referimit është vija mesore" },
    body: {
      it: "Mesiale significa «verso la linea mediana» (tra gli incisivi centrali), distale significa «lontano dalla linea mediana». Non sono destra e sinistra: dipendono sempre dal quadrante in cui si trova il dente.",
      de: "Mesial bedeutet „zur Mittellinie hin“ (zwischen den mittleren Schneidezähnen), distal bedeutet „von der Mittellinie weg“. Es sind nicht rechts und links: Die Richtung hängt immer vom Quadranten ab.",
      en: "Mesial means 'towards the midline' (between the central incisors), distal means 'away from the midline'. They are not right and left: the direction always depends on the quadrant the tooth is in.",
      sq: "Mezial do të thotë «drejt vijës mesore» (ndërmjet prerësve qendrorë), distal do të thotë «larg vijës mesore». Nuk janë djathtas dhe majtas: drejtimi varet gjithmonë nga kuadranti ku ndodhet dhëmbi.",
    },
    tip: {
      it: "Regola pratica: la cifra FDI più bassa sta sempre più mesialmente nello stesso quadrante.",
      de: "Faustregel: Die niedrigere FDI-Ziffer liegt im selben Quadranten immer weiter mesial.",
      en: "Rule of thumb: within the same quadrant, the lower FDI digit is always more mesial.",
      sq: "Rregull praktik: brenda të njëjtit kuadrant, shifra FDI më e ulët është gjithmonë më meziale.",
    },
  },
  {
    title: { it: "Le altre direzioni", de: "Die weiteren Richtungen", en: "The other directions", sq: "Drejtimet e tjera" },
    body: {
      it: "Vestibolare (buccale/labiale) è verso guancia o labbro; orale è verso palato (palatale, arcata superiore) o lingua (linguale, arcata inferiore). Occlusale è la superficie masticatoria, incisale il margine tagliente, apicale verso l'apice della radice, coronale verso la corona.",
      de: "Vestibulär (bukkal/labial) zeigt zu Wange oder Lippe; oral zeigt zum Gaumen (palatinal, Oberkiefer) oder zur Zunge (lingual, Unterkiefer). Okklusal ist die Kaufläche, inzisal die Schneidekante, apikal Richtung Wurzelspitze, koronal Richtung Krone.",
      en: "Vestibular (buccal/labial) faces the cheek or lip; oral faces the palate (palatal, upper arch) or the tongue (lingual, lower arch). Occlusal is the chewing surface, incisal the cutting edge, apical towards the root apex, coronal towards the crown.",
      sq: "Vestibular (bukal/labial) është nga faqja ose buza; oral është nga qiellza (palatinal, harku i sipërm) ose gjuha (lingual, harku i poshtëm). Okluzal është sipërfaqja përtypëse, incizal buza prerëse, apikal drejt majës së rrënjës, koronal drejt kurorës.",
    },
  },
  {
    title: { it: "Come si riconosce mesiale su un dente estratto", de: "Mesial an einem extrahierten Zahn erkennen", en: "Recognising mesial on an extracted tooth", sq: "Si njihet ana meziale te një dhëmb i nxjerrë" },
    body: {
      it: "Tipicamente il contorno mesiale della corona è più diritto e il punto di contatto è più vicino al margine incisale/occlusale; il contorno distale è più convesso e il contatto più cervicale. Nei molari la faccia mesiale è di norma più piatta e ampia. Le radici tendono a inclinarsi distalmente. Queste caratteristiche possono variare da individuo a individuo.",
      de: "Typischerweise ist die mesiale Kontur der Krone gerader und der Kontaktpunkt liegt näher an der Inzisal-/Okklusalkante; die distale Kontur ist konvexer und der Kontakt liegt zervikaler. Bei Molaren ist die Mesialfläche in der Regel flacher und breiter. Wurzeln neigen sich meist nach distal. Diese Merkmale können individuell abweichen.",
      en: "Typically the mesial outline of the crown is straighter and the contact area lies closer to the incisal/occlusal edge; the distal outline is more convex and its contact more cervical. On molars the mesial surface is usually flatter and broader. Roots tend to incline distally. These features can vary between individuals.",
      sq: "Zakonisht kontura meziale e kurorës është më e drejtë dhe pika e kontaktit është më afër buzës incizale/okluzale; kontura distale është më konvekse dhe kontakti më cervikal. Te molarët sipërfaqja meziale zakonisht është më e rrafshët dhe më e gjerë. Rrënjët priren të anojnë distalisht. Këto tipare mund të ndryshojnë nga individi në individ.",
    },
    tip: {
      it: "Nel primo premolare superiore è caratteristica una concavità mesiale che può estendersi dalla corona alla radice; non generalizzarla al secondo premolare né usarla come unico criterio.",
      de: "Beim ersten oberen Prämolaren ist eine mesiale Konkavität charakteristisch, die von der Krone zur Wurzel reichen kann; nicht auf den zweiten Prämolaren verallgemeinern oder als einziges Kriterium verwenden.",
      en: "The upper first premolar has a characteristic mesial concavity that can extend from crown to root; do not generalise it to the second premolar or use it as the only criterion.",
      sq: "Premolari i parë i sipërm ka një konkavitet mezial karakteristik që mund të shtrihet nga kurora te rrënja; mos e përgjithësoni te premolari i dytë dhe mos e përdorni si kriterin e vetëm.",
    },
  },
];

export const MIRROR_LESSON: LessonSection[] = [
  {
    title: { it: "Quadranti a specchio", de: "Quadranten im Spiegelbild", en: "Mirror-image quadrants", sq: "Kuadrantët pasqyrë" },
    body: {
      it: "Q1 (superiore destro) e Q2 (superiore sinistro) sono immagini speculari, così come Q4 (inferiore destro) e Q3 (inferiore sinistro). La seconda cifra FDI resta identica: 16 e 26 sono denti omologhi controlaterali, non lo stesso dente; l’anatomia individuale può differire.",
      de: "Q1 (Oberkiefer rechts) und Q2 (Oberkiefer links) sind Spiegelbilder, ebenso Q4 (Unterkiefer rechts) und Q3 (Unterkiefer links). Die zweite FDI-Ziffer bleibt gleich: 16 und 26 sind kontralaterale homologe Zähne, nicht derselbe Zahn; die individuelle Anatomie kann abweichen.",
      en: "Q1 (upper right) and Q2 (upper left) are mirror images, as are Q4 (lower right) and Q3 (lower left). The second FDI digit stays the same: 16 and 26 are contralateral homologous teeth, not the same tooth; individual anatomy may differ.",
      sq: "Q1 (sipër djathtas) dhe Q2 (sipër majtas) janë pasqyrë të njëri-tjetrit, po ashtu Q4 (poshtë djathtas) dhe Q3 (poshtë majtas). Shifra e dytë FDI mbetet e njëjtë: 16 dhe 26 janë dhëmbë homologë kontralateralë, jo i njëjti dhëmb; anatomia individuale mund të ndryshojë.",
    },
  },
  {
    title: { it: "Antagonista invece che specchio", de: "Antagonist statt Spiegelbild", en: "Antagonist, not mirror image", sq: "Antagonisti, jo pasqyra" },
    body: {
      it: "Gli antagonisti sono i denti dell’arcata opposta con cui un dente ha contatti occlusali. Nell’occlusione ideale di Classe I e dentatura completa, il 16 ha come antagonisti 46 e 47; il 46, 15 e 16. La maggior parte dei denti ha due antagonisti, eccetto gli incisivi centrali inferiori e i terzi molari superiori. La coppia 16 ↔ 46 indica soltanto la stessa posizione FDI nell’arcata opposta. Malocclusioni, denti mancanti e restauri possono modificare i contatti.",
      de: "Antagonisten sind die Zähne des Gegenkiefers mit Okklusionskontakten. In idealer Klasse-I-Okklusion bei vollständigem Gebiss hat 16 die Antagonisten 46 und 47; 46 hat 15 und 16. Die meisten Zähne haben zwei Antagonisten, außer den unteren mittleren Schneidezähnen und oberen Weisheitszähnen. Das Paar 16 ↔ 46 beschreibt nur dieselbe FDI-Position im Gegenkiefer. Fehlstellungen, fehlende Zähne und Restaurationen können Kontakte verändern.",
      en: "Antagonists are the teeth of the opposite arch that a tooth contacts in occlusion. In ideal Class I occlusion with a complete dentition, 16 occludes with 46 and 47; 46 with 15 and 16. Most teeth have two antagonists, except the lower central incisors and the upper third molars. The pair 16 ↔ 46 only indicates the same FDI position in the opposite arch. Malocclusion, missing teeth and restorations can change the contacts.",
      sq: "Antagonistët janë dhëmbët e harkut të kundërt me të cilët një dhëmb ka kontakte okluzale. Në okluzionin ideal të Klasës I me dhëmbësi të plotë, 16 ka antagonistë 46 dhe 47; 46 ka 15 dhe 16. Shumica e dhëmbëve kanë dy antagonistë, përveç prerësve qendrorë të poshtëm dhe molarëve të tretë të sipërm. Çifti 16 ↔ 46 tregon vetëm të njëjtin pozicion FDI në harkun e kundërt. Malokluzionet, dhëmbët që mungojnë dhe restaurimet mund t'i ndryshojnë kontaktet.",
    },
  },
  {
    title: { it: "Come stabilire il lato", de: "Wie man die Seite bestimmt", en: "How to determine the side", sq: "Si përcaktohet ana" },
    body: {
      it: "Nella vista clinica frontale la corona dei denti superiori è rivolta in basso e quella degli inferiori in alto; la superficie vestibolare guarda l’osservatore. Il lato destro del paziente è alla tua sinistra: sui denti di destra il mesiale è verso la tua destra, cioè verso il centro dell’arcata. Su un dente isolato identifica prima vestibolare/orale e mesiale/distale usando più caratteri specifici del tipo di dente; nessun contorno da solo determina con certezza il lato.",
      de: "In frontaler zahnärztlicher Ansicht zeigen Oberkieferkronen nach unten und Unterkieferkronen nach oben; die Vestibulärfläche zeigt zum Betrachter. Die rechte Patientenseite liegt links vom Betrachter: Bei rechten Zähnen liegt mesial rechts im Bild, zur Zahnbogenmitte hin. Bestimme am isolierten Zahn zunächst vestibulär/oral und mesial/distal anhand mehrerer zahntypspezifischer Merkmale; eine einzelne Kontur legt die Seite nicht sicher fest.",
      en: "In the frontal clinical view the crowns of the upper teeth point down and those of the lower teeth point up; the vestibular surface faces the observer. The patient's right side is on your left: on the right-side teeth, mesial is towards your right, i.e. towards the centre of the arch. On an isolated tooth, first identify vestibular/oral and mesial/distal using several type-specific features; no single outline determines the side with certainty.",
      sq: "Në pamjen klinike frontale kurorat e dhëmbëve të sipërm drejtohen poshtë dhe ato të poshtmit lart; sipërfaqja vestibulare shikon nga vëzhguesi. Ana e djathtë e pacientit është në të majtën tuaj: te dhëmbët e djathtë, meziali është nga e djathta juaj, pra drejt qendrës së harkut. Te një dhëmb i veçuar, përcaktoni fillimisht vestibular/oral dhe mezial/distal duke përdorur disa tipare specifike të llojit të dhëmbit; asnjë konturë e vetme nuk e përcakton anën me siguri.",
    },
    tip: {
      it: "Nel paziente, destra e sinistra sono sempre quelle del paziente, non le tue.",
      de: "Rechts und links beziehen sich immer auf die Patientenseite, nicht auf deine.",
      en: "Right and left always refer to the patient's side, not yours.",
      sq: "Djathtas dhe majtas i referohen gjithmonë anës së pacientit, jo tuajës.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Recognition walkthrough                                             */
/* ------------------------------------------------------------------ */

export interface RecognitionStep {
  title: L;
  question: L;
  answer: L;
  tip: L;
}

const groupOf = (t: Tooth): L => {
  if (t.position <= 2) return { it: "gruppo incisivo", de: "Schneidezahn-Gruppe", en: "incisor group", sq: "grupi i prerësve" };
  if (t.position === 3) return { it: "gruppo canino", de: "Eckzahn-Gruppe", en: "canine group", sq: "grupi i kaninëve" };
  if (t.position <= 5) return { it: "gruppo premolare", de: "Prämolaren-Gruppe", en: "premolar group", sq: "grupi i premolarëve" };
  return { it: "gruppo molare", de: "Molaren-Gruppe", en: "molar group", sq: "grupi i molarëve" };
};

const AND: L = { it: " e ", de: " und ", en: " and ", sq: " dhe " };

export function recognitionSteps(t: Tooth): RecognitionStep[] {
  const ant = classIAntagonists(t.fdi);
  const mirror = mirrorFdi(t.fdi);
  return [
    {
      title: { it: "1 · Arcata", de: "1 · Kiefer", en: "1 · Arch", sq: "1 · Harku" },
      question: { it: "Superiore o inferiore?", de: "Ober- oder Unterkiefer?", en: "Upper or lower?", sq: "I sipërm apo i poshtëm?" },
      answer:
        t.arch === "upper"
          ? { it: "Arcata superiore (mascellare).", de: "Oberkiefer (Maxilla).", en: "Upper arch (maxillary).", sq: "Harku i sipërm (maksilar)." }
          : { it: "Arcata inferiore (mandibolare).", de: "Unterkiefer (Mandibula).", en: "Lower arch (mandibular).", sq: "Harku i poshtëm (mandibular)." },
      tip: {
        it: `${t.anatomy.crown.it} ${t.anatomy.rootsTypical.it} Confronta più caratteri: nessuno è da solo una regola universale per l’arcata.`,
        de: `${t.anatomy.crown.de} ${t.anatomy.rootsTypical.de} Vergleiche mehrere Merkmale: Keines ist allein eine allgemeingültige Kieferregel.`,
        en: `${t.anatomy.crown.en} ${t.anatomy.rootsTypical.en} Compare several features: none on its own is a universal rule for the arch.`,
        sq: `${t.anatomy.crown.sq} ${t.anatomy.rootsTypical.sq} Krahasoni disa tipare: asnjëri vetëm nuk është rregull universal për harkun.`,
      },
    },
    {
      title: { it: "2 · Gruppo", de: "2 · Zahngruppe", en: "2 · Group", sq: "2 · Grupi" },
      question: { it: "A quale gruppo appartiene?", de: "Zu welcher Gruppe gehört er?", en: "Which group does it belong to?", sq: "Në cilin grup bën pjesë?" },
      answer: groupOf(t),
      tip: {
        it: `Indizio: ${t.anatomy.cuspsTypical.it.toLowerCase()}`,
        de: `Hinweis: ${t.anatomy.cuspsTypical.de}`,
        en: `Clue: ${t.anatomy.cuspsTypical.en}`,
        sq: `Të dhënë: ${t.anatomy.cuspsTypical.sq}`,
      },
    },
    {
      title: { it: "3 · Posizione nel gruppo", de: "3 · Position in der Gruppe", en: "3 · Position in the group", sq: "3 · Pozicioni në grup" },
      question: {
        it: "Centrale o laterale, canino, oppure primo/secondo/terzo del gruppo?",
        de: "Mittlerer oder seitlicher Schneidezahn, Eckzahn oder erster/zweiter/dritter Zahn der Gruppe?",
        en: "Central or lateral, canine, or first/second/third of the group?",
        sq: "Qendror apo anësor, kanin, apo i pari/i dyti/i treti i grupit?",
      },
      answer: {
        it: `Posizione ${t.position} → ${t.shortName.it}.`,
        de: `Position ${t.position} → ${t.shortName.de}.`,
        en: `Position ${t.position} → ${t.shortName.en}.`,
        sq: `Pozicioni ${t.position} → ${t.shortName.sq}.`,
      },
      tip: t.anatomy.crown,
    },
    {
      title: { it: "4 · Lato (logica dello specchio)", de: "4 · Seite (Spiegellogik)", en: "4 · Side (mirror logic)", sq: "4 · Ana (logjika e pasqyrës)" },
      question: { it: "Destro o sinistro?", de: "Rechts oder links?", en: "Right or left?", sq: "Djathtas apo majtas?" },
      answer:
        t.side === "right"
          ? { it: `Lato destro del paziente → quadrante ${t.quadrant}.`, de: `Rechte Patientenseite → Quadrant ${t.quadrant}.`, en: `Patient's right side → quadrant ${t.quadrant}.`, sq: `Ana e djathtë e pacientit → kuadranti ${t.quadrant}.` }
          : { it: `Lato sinistro del paziente → quadrante ${t.quadrant}.`, de: `Linke Patientenseite → Quadrant ${t.quadrant}.`, en: `Patient's left side → quadrant ${t.quadrant}.`, sq: `Ana e majtë e pacientit → kuadranti ${t.quadrant}.` },
      tip: {
        it: `L’omologo controlaterale è ${mirror}. Gli antagonisti nell’occlusione ideale di Classe I sono ${ant.join(AND.it)}; i contatti individuali possono differire.`,
        de: `Der kontralaterale homologe Zahn ist ${mirror}. Antagonisten in idealer Klasse-I-Okklusion: ${ant.join(AND.de)}; individuelle Kontakte können abweichen.`,
        en: `The contralateral homologue is ${mirror}. Antagonists in ideal Class I occlusion: ${ant.join(AND.en)}; individual contacts may differ.`,
        sq: `Homologu kontralateral është ${mirror}. Antagonistët në okluzionin ideal të Klasës I: ${ant.join(AND.sq)}; kontaktet individuale mund të ndryshojnë.`,
      },
    },
    {
      title: { it: "5 · Conferma", de: "5 · Bestätigung", en: "5 · Confirm", sq: "5 · Konfirmimi" },
      question: { it: "Quale numero FDI?", de: "Welche FDI-Nummer?", en: "Which FDI number?", sq: "Cili numër FDI?" },
      answer: {
        it: `FDI ${t.fdi} — ${t.name.it}.`,
        de: `FDI ${t.fdi} — ${t.name.de}.`,
        en: `FDI ${t.fdi} — ${t.name.en}.`,
        sq: `FDI ${t.fdi} — ${t.name.sq}.`,
      },
      tip: t.anatomy.clinical,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Tell-them-apart guidance                                            */
/* ------------------------------------------------------------------ */

export interface PairCue {
  a: string;
  b: string;
  cue: L;
}

export const UPPER_PAIRS: PairCue[] = [
  {
    a: "11",
    b: "12",
    cue: {
      it: "Il centrale (11) è tipicamente più largo, con angolo mesio-incisale quasi retto; il laterale (12) è più stretto, con angolo disto-incisale arrotondato e fossa palatina più profonda.",
      de: "Der mittlere Schneidezahn (11) ist typischerweise breiter, mit nahezu rechtwinkliger mesioinzisaler Ecke; der seitliche (12) ist schmaler, mit abgerundeter distoinzisaler Ecke und tieferer palatinaler Grube.",
      en: "The central (11) is typically wider, with an almost right-angled mesioincisal angle; the lateral (12) is narrower, with a rounded distoincisal angle and a deeper palatal fossa.",
      sq: "Qendrori (11) zakonisht është më i gjerë, me kënd mezioincizal pothuajse të drejtë; anësori (12) është më i ngushtë, me kënd distoincizal të rrumbullakosur dhe gropëz palatinale më të thellë.",
    },
  },
  {
    a: "13",
    b: "14",
    cue: {
      it: "Il canino (13) ha tipicamente una sola cuspide, cresta mesiale più corta e la radice più lunga; il primo premolare (14) ha di norma due cuspidi, cresta mesiale più lunga e spesso due radici.",
      de: "Der Eckzahn (13) hat typischerweise nur einen Höcker, eine kürzere mesiale Leiste und die längste Wurzel; der erste Prämolar (14) hat in der Regel zwei Höcker, eine längere mesiale Leiste und häufig zwei Wurzeln.",
      en: "The canine (13) typically has a single cusp, a shorter mesial ridge and the longest root; the first premolar (14) usually has two cusps, a longer mesial ridge and often two roots.",
      sq: "Kanini (13) zakonisht ka një kuspid të vetëm, kreshtë meziale më të shkurtër dhe rrënjën më të gjatë; premolari i parë (14) zakonisht ka dy kuspidë, kreshtë meziale më të gjatë dhe shpesh dy rrënjë.",
    },
  },
  {
    a: "14",
    b: "15",
    cue: {
      it: "Il 14 presenta comunemente una o due radici, una cuspide vestibolare più alta e spostata in distale; sono caratteristici il solco marginale mesiale e la concavità mesiale. Il 15 ha più spesso una radice, cuspidi di altezza simile, solco centrale più corto e più solchi accessori. Radici e canali non coincidono necessariamente.",
      de: "Der 14 hat häufig eine oder zwei Wurzeln und einen höheren, nach distal versetzten vestibulären Höcker; charakteristisch sind mesiale Randleistenfurche und mesiale Konkavität. Der 15 hat meist eine Wurzel, ähnlich hohe Höcker, eine kürzere Zentralfurche und mehr Nebenfurchen. Wurzel- und Kanalzahl müssen nicht übereinstimmen.",
      en: "14 commonly has one or two roots and a taller buccal cusp displaced distally; the mesial marginal groove and mesial concavity are characteristic. 15 more often has one root, cusps of similar height, a shorter central groove and more supplementary grooves. Root and canal numbers do not necessarily match.",
      sq: "14 zakonisht ka një ose dy rrënjë dhe një kuspid vestibular më të lartë të zhvendosur distalisht; karakteristike janë brazda margjinale meziale dhe konkaviteti mezial. 15 më shpesh ka një rrënjë, kuspidë me lartësi të ngjashme, brazdë qendrore më të shkurtër dhe më shumë brazda shtesë. Numri i rrënjëve dhe i kanaleve nuk përputhet domosdoshmërisht.",
    },
  },
  {
    a: "16",
    b: "17",
    cue: {
      it: "Il 16 è tipicamente più voluminoso, con cresta obliqua marcata, cuspide disto-palatale ben sviluppata e spesso tubercolo di Carabelli; nel 17 la cuspide disto-palatale è spesso ridotta e le radici sono più ravvicinate.",
      de: "Der 16 ist typischerweise voluminöser, mit deutlicher Schrägleiste, gut entwickeltem distopalatinalem Höcker und oft Carabelli-Höcker; beim 17 ist der distopalatinale Höcker oft reduziert und die Wurzeln stehen enger.",
      en: "16 is typically bulkier, with a marked oblique ridge, a well-developed distopalatal cusp and often a Carabelli cusp; on 17 the distopalatal cusp is often reduced and the roots are closer together.",
      sq: "16 zakonisht është më voluminoz, me kreshtë të pjerrët të theksuar, kuspid distopalatinal të zhvilluar mirë dhe shpesh tuberkul Carabelli; te 17 kuspidi distopalatinal shpesh është i reduktuar dhe rrënjët janë më afër.",
    },
  },
  {
    a: "16",
    b: "26",
    cue: {
      it: "Omologhi controlaterali: orienta vestibolare e palatale, poi individua insieme la cuspide mesio-palatale, di norma la più grande, e la cresta obliqua verso la disto-vestibolare. Questi caratteri aiutano a distinguere mesiale e distale; la sola dimensione di una cuspide non determina il lato.",
      de: "Kontralaterale homologe Zähne: Orientiere vestibulär und palatinal, dann bestimme gemeinsam den meist größten mesiopalatinalen Höcker und die Schrägleiste zum distobukkalen Höcker. Diese Merkmale helfen bei mesial/distal; die Größe eines Höckers allein legt die Seite nicht fest.",
      en: "Contralateral homologues: orient buccal and palatal first, then identify together the mesiopalatal cusp (usually the largest) and the oblique ridge running to the distobuccal cusp. These features help distinguish mesial from distal; the size of a single cusp alone does not determine the side.",
      sq: "Homologë kontralateralë: orientoni fillimisht anën bukale dhe palatinale, pastaj identifikoni së bashku kuspidin meziopalatinal (zakonisht më i madhi) dhe kreshtën e pjerrët drejt kuspidit distobukal. Këto tipare ndihmojnë të dallohet meziali nga distali; vetëm madhësia e një kuspidi nuk e përcakton anën.",
    },
  },
];

export const LOWER_PAIRS: PairCue[] = [
  {
    a: "31",
    b: "32",
    cue: {
      it: "Il centrale inferiore (31) è tipicamente il dente più piccolo e simmetrico; il laterale (32) è leggermente più largo, con margine incisale che si torce disto-lingualmente per seguire l’arcata.",
      de: "Der mittlere untere Schneidezahn (31) ist typischerweise der kleinste und symmetrischste Zahn; der seitliche (32) ist etwas breiter, mit distolingual gedrehter Inzisalkante zur Anpassung an den Zahnbogen.",
      en: "The lower central (31) is typically the smallest and most symmetrical tooth; the lateral (32) is slightly wider, with an incisal edge that twists distolingually to follow the arch.",
      sq: "Prerësi qendror i poshtëm (31) zakonisht është dhëmbi më i vogël dhe më simetrik; anësori (32) është pak më i gjerë, me buzë incizale që rrotullohet distolingualisht për të ndjekur harkun.",
    },
  },
  {
    a: "33",
    b: "34",
    cue: {
      it: "Il canino inferiore (33) è stretto e monocuspidato; il 34 ha una piccola cuspide linguale accanto a quella vestibolare dominante.",
      de: "Der untere Eckzahn (33) ist schmal und einhöckrig; der 34 hat neben dem dominanten vestibulären Höcker einen kleinen lingualen Höcker.",
      en: "The lower canine (33) is narrow with a single cusp; 34 has a small lingual cusp next to the dominant buccal cusp.",
      sq: "Kanini i poshtëm (33) është i ngushtë me një kuspid të vetëm; 34 ka një kuspid lingual të vogël pranë kuspidit dominues vestibular.",
    },
  },
  {
    a: "34",
    b: "35",
    cue: {
      it: "Il 34 ha di norma una cuspide linguale piccola, tavola occlusale inclinata lingualmente e aspetto caniniforme; il 35 è più squadrato e mostra spesso due cuspidi linguali (forma a Y). Può variare.",
      de: "Der 34 hat in der Regel einen kleinen lingualen Höcker, eine lingual geneigte Okklusalfläche und wirkt eckzahnähnlich; der 35 ist kantiger und zeigt häufig zwei linguale Höcker (Y-Form). Kann variieren.",
      en: "34 usually has a small lingual cusp, a lingually tilted occlusal table and a canine-like look; 35 is squarer and often shows two lingual cusps (Y form). May vary.",
      sq: "34 zakonisht ka një kuspid lingual të vogël, tabelë okluzale të pjerrët nga lingualja dhe pamje si kanin; 35 është më katror dhe shpesh ka dy kuspidë lingualë (forma Y). Mund të ndryshojë.",
    },
  },
  {
    a: "36",
    b: "37",
    cue: {
      it: "Il 36 ha tipicamente 5 cuspidi con cuspide distale e solco a Y; il 37 ne ha di norma 4 con solco a croce regolare.",
      de: "Der 36 hat typischerweise 5 Höcker mit distalem Höcker und Y-Fissur; der 37 in der Regel 4 Höcker mit regelmäßiger Kreuzfissur.",
      en: "36 typically has 5 cusps including a distal cusp and a Y-shaped groove; 37 usually has 4 cusps with a regular cross-shaped groove.",
      sq: "36 zakonisht ka 5 kuspidë me kuspid distal dhe brazdë në formë Y; 37 zakonisht ka 4 kuspidë me brazdë të rregullt në formë kryqi.",
    },
  },
  {
    a: "36",
    b: "46",
    cue: {
      it: "Coppia speculare: la cuspide distale supplementare si trova sul versante disto-vestibolare; individuato il mesiale, il lato è determinato.",
      de: "Spiegelpaar: Der zusätzliche distale Höcker liegt distobukkal; ist mesial bestimmt, ergibt sich die Seite.",
      en: "Mirror pair: the extra distal cusp lies on the distobuccal side; once mesial is identified, the side follows.",
      sq: "Çift pasqyrë: kuspidi distal shtesë ndodhet në anën distobukale; pasi përcaktohet meziali, përcaktohet edhe ana.",
    },
  },
];

export function pairsFor(arch: Arch): PairCue[] {
  return arch === "upper" ? UPPER_PAIRS : LOWER_PAIRS;
}

const TELL: Record<"arches" | "roots" | "cusps" | "mirror", L> = {
  arches: {
    it: "Arcate diverse: confronta prima il numero di radici e la forma della corona, che differiscono tipicamente tra mascellare e mandibola.",
    de: "Unterschiedliche Kiefer: Vergleiche zuerst Wurzelzahl und Kronenform, die sich zwischen Ober- und Unterkiefer typischerweise unterscheiden.",
    en: "Different arches: compare root number and crown form first, which typically differ between maxilla and mandible.",
    sq: "Harqe të ndryshme: krahasoni fillimisht numrin e rrënjëve dhe formën e kurorës, që zakonisht ndryshojnë ndërmjet maksilës dhe mandibulës.",
  },
  roots: { it: "Radici", de: "Wurzeln", en: "Roots", sq: "Rrënjët" },
  cusps: { it: "Cuspidi", de: "Höcker", en: "Cusps", sq: "Kuspidët" },
  mirror: {
    it: "Stesso tipo in quadranti speculari: usa più caratteri mesiali/distali specifici del tipo di dente, non un solo contorno. Lo specchio di {a} è {m}.",
    de: "Gleicher Typ in gespiegelten Quadranten: Nutze mehrere zahntypspezifische mesiale/distale Merkmale zur Seitenbestimmung, nicht nur eine Kontur. Das Spiegelbild von {a} ist {m}.",
    en: "Same type in mirrored quadrants: use several type-specific mesial/distal features, not a single outline. The mirror of {a} is {m}.",
    sq: "I njëjti lloj në kuadrantë pasqyrë: përdorni disa tipare meziale/distale specifike të llojit të dhëmbit, jo vetëm një konturë. Pasqyra e {a} është {m}.",
  },
};

/** Generated tell-apart guidance for any two teeth. */
export function tellApart(a: Tooth, b: Tooth, lang: Lang): string[] {
  const out: string[] = [];
  const curated = [...UPPER_PAIRS, ...LOWER_PAIRS].find(
    (p) => (p.a === a.fdi && p.b === b.fdi) || (p.a === b.fdi && p.b === a.fdi),
  );
  if (curated) out.push(curated.cue[lang]);
  if (a.arch !== b.arch) out.push(TELL.arches[lang]);
  if (a.fdi !== b.fdi) {
    out.push(`${TELL.roots[lang]} ${a.fdi}: ${a.anatomy.rootsTypical[lang]} ${TELL.roots[lang]} ${b.fdi}: ${b.anatomy.rootsTypical[lang]}`);
    out.push(`${TELL.cusps[lang]} ${a.fdi}: ${a.anatomy.cuspsTypical[lang]} ${TELL.cusps[lang]} ${b.fdi}: ${b.anatomy.cuspsTypical[lang]}`);
  }
  if (a.type === b.type && a.arch === b.arch) {
    out.push(TELL.mirror[lang].replace("{a}", a.fdi).replace("{m}", mirrorFdi(a.fdi)));
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Trick questions                                                     */
/* ------------------------------------------------------------------ */

export interface TrickItem {
  id: string;
  fdi: string | null;
  prompt: L;
  options: L[];
  answerIndex: number;
  hints: L[];
  reasoning: L;
}

const ALWAYS_NEVER: L = {
  it: "Diffida delle parole «sempre» e «mai».",
  de: "Misstraue den Wörtern „immer“ und „nie“.",
  en: "Be wary of the words 'always' and 'never'.",
  sq: "Kini kujdes me fjalët «gjithmonë» dhe «kurrë».",
};

export const TRICK_QUESTIONS: TrickItem[] = [
  {
    id: "trick-14-roots",
    fdi: "14",
    prompt: {
      it: "«Il primo premolare superiore ha sempre due radici.» Qual è l'affermazione corretta?",
      de: "„Der erste obere Prämolar hat immer zwei Wurzeln.“ Welche Aussage ist korrekt?",
      en: "'The upper first premolar always has two roots.' Which statement is correct?",
      sq: "«Premolari i parë i sipërm ka gjithmonë dy rrënjë.» Cili pohim është i saktë?",
    },
    options: [
      { it: "Una o due radici sono forme comuni; tre radici sono una variante rara.", de: "Eine oder zwei Wurzeln sind häufige Formen; drei Wurzeln sind eine seltene Variante.", en: "One or two roots are both common; three roots are a rare variant.", sq: "Një ose dy rrënjë janë forma të zakonshme; tre rrënjë janë variant i rrallë." },
      { it: "Ha sempre esattamente 2 radici.", de: "Er hat immer genau 2 Wurzeln.", en: "It always has exactly 2 roots.", sq: "Ka gjithmonë saktësisht 2 rrënjë." },
      { it: "Non può mai avere una radice unica.", de: "Er kann niemals nur eine Wurzel haben.", en: "It can never have a single root.", sq: "Nuk mund të ketë kurrë vetëm një rrënjë." },
      { it: "Ha sempre 3 radici come i molari.", de: "Er hat immer 3 Wurzeln wie die Molaren.", en: "It always has 3 roots like the molars.", sq: "Ka gjithmonë 3 rrënjë si molarët." },
    ],
    answerIndex: 0,
    hints: [
      ALWAYS_NEVER,
      { it: "Una e due radici sono entrambe comuni; la frequenza dipende dalla popolazione.", de: "Eine und zwei Wurzeln sind beide häufig; die Häufigkeit hängt von der Population ab.", en: "One and two roots are both common; frequency depends on the population.", sq: "Një dhe dy rrënjë janë të dyja të zakonshme; shpeshtësia varet nga popullata." },
    ],
    reasoning: {
      it: "Il 14 può avere comunemente una o due radici, raramente tre. Due canali sono frequenti anche in una radice unica: non dedurre i canali dal numero di radici.",
      de: "Der 14 hat häufig eine oder zwei Wurzeln, selten drei. Zwei Kanäle sind auch in einer einzelnen Wurzel häufig: Die Kanalzahl lässt sich nicht aus der Wurzelzahl ableiten.",
      en: "14 commonly has one or two roots, rarely three. Two canals are frequent even in a single root: do not infer canals from the number of roots.",
      sq: "14 zakonisht ka një ose dy rrënjë, rrallë tre. Dy kanale janë të shpeshta edhe në një rrënjë të vetme: mos e nxirrni numrin e kanaleve nga numri i rrënjëve.",
    },
  },
  {
    id: "trick-mb2",
    fdi: "16",
    prompt: {
      it: "Quanti canali ci si attende tipicamente nel primo molare superiore?",
      de: "Wie viele Kanäle erwartet man typischerweise im ersten oberen Molaren?",
      en: "How many canals are typically expected in the upper first molar?",
      sq: "Sa kanale priten zakonisht te molari i parë i sipërm?",
    },
    options: [
      { it: "3–4: il secondo canale mesio-vestibolare (MB2) è molto frequente.", de: "3–4: Der zweite mesiobukkale Kanal (MB2) ist sehr häufig.", en: "3–4: the second mesiobuccal canal (MB2) is very common.", sq: "3–4: kanali i dytë meziobukal (MB2) është shumë i shpeshtë." },
      { it: "Esattamente 3, sempre.", de: "Genau 3, immer.", en: "Exactly 3, always.", sq: "Saktësisht 3, gjithmonë." },
      { it: "2, come nei premolari.", de: "2, wie bei den Prämolaren.", en: "2, as in the premolars.", sq: "2, si te premolarët." },
      { it: "5 nella maggior parte dei casi.", de: "5 in den meisten Fällen.", en: "5 in most cases.", sq: "5 në shumicën e rasteve." },
    ],
    answerIndex: 0,
    hints: [
      { it: "Il numero di radici non coincide sempre con il numero di canali.", de: "Die Wurzelzahl entspricht nicht immer der Kanalzahl.", en: "The number of roots does not always match the number of canals.", sq: "Numri i rrënjëve nuk përputhet gjithmonë me numrin e kanaleve." },
      { it: "Pensa alla radice mesio-vestibolare.", de: "Denke an die mesiobukkale Wurzel.", en: "Think of the mesiobuccal root.", sq: "Mendoni për rrënjën meziobukale." },
    ],
    reasoning: {
      it: "Tipicamente 3 radici ma 3–4 canali: MB2 è frequente; la frequenza riportata dipende da popolazione e metodo di rilevazione.",
      de: "Typischerweise 3 Wurzeln, aber 3–4 Kanäle: MB2 ist häufig; berichtete Häufigkeiten hängen von Population und Nachweismethode ab.",
      en: "Typically 3 roots but 3–4 canals: MB2 is common; reported frequency depends on population and detection method.",
      sq: "Zakonisht 3 rrënjë por 3–4 kanale: MB2 është i shpeshtë; shpeshtësia e raportuar varet nga popullata dhe metoda e zbulimit.",
    },
  },
  {
    id: "trick-mirror-16",
    fdi: "16",
    prompt: {
      it: "Quali sono gli antagonisti del 16 in una dentatura completa con occlusione ideale di Classe I?",
      de: "Welche Antagonisten hat Zahn 16 im vollständigen Gebiss bei idealer Klasse-I-Okklusion?",
      en: "Which teeth are the antagonists of 16 in a complete dentition with ideal Class I occlusion?",
      sq: "Cilët janë antagonistët e 16 në një dhëmbësi të plotë me okluzion ideal të Klasës I?",
    },
    options: [
      { it: "46 e 47", de: "46 und 47", en: "46 and 47", sq: "46 dhe 47" },
      { it: "Solo 46", de: "Nur 46", en: "Only 46", sq: "Vetëm 46" },
      { it: "36", de: "36", en: "36", sq: "36" },
      { it: "17", de: "17", en: "17", sq: "17" },
    ],
    answerIndex: 0,
    hints: [
      { it: "Considera i contatti occlusali, non soltanto la stessa posizione FDI.", de: "Betrachte Okklusionskontakte, nicht nur dieselbe FDI-Position.", en: "Consider the occlusal contacts, not just the same FDI position.", sq: "Merrni parasysh kontaktet okluzale, jo vetëm të njëjtin pozicion FDI." },
      { it: "Il primo molare superiore contatta il primo e il secondo molare inferiore dello stesso lato.", de: "Der erste obere Molar kontaktiert den ersten und zweiten unteren Molaren derselben Seite.", en: "The upper first molar contacts the lower first and second molars on the same side.", sq: "Molari i parë i sipërm kontakton molarin e parë dhe të dytë të poshtëm në të njëjtën anë." },
    ],
    reasoning: {
      it: "In occlusione ideale di Classe I, il 16 contatta 46 e 47. Il 26 è l’omologo controlaterale. Nei pazienti i contatti dipendono dall’occlusione e vanno verificati clinicamente.",
      de: "In idealer Klasse-I-Okklusion kontaktiert 16 die Zähne 46 und 47. 26 ist der kontralaterale homologe Zahn. Patientenspezifische Kontakte hängen von der Okklusion ab und müssen klinisch geprüft werden.",
      en: "In ideal Class I occlusion, 16 contacts 46 and 47. 26 is the contralateral homologue. In patients, contacts depend on the occlusion and must be checked clinically.",
      sq: "Në okluzionin ideal të Klasës I, 16 kontakton 46 dhe 47. 26 është homologu kontralateral. Te pacientët kontaktet varen nga okluzioni dhe duhen verifikuar klinikisht.",
    },
  },
  {
    id: "trick-smallest",
    fdi: "31",
    prompt: {
      it: "Qual è tipicamente il dente più piccolo della dentatura permanente?",
      de: "Welcher Zahn ist typischerweise der kleinste im bleibenden Gebiss?",
      en: "Which is typically the smallest tooth of the permanent dentition?",
      sq: "Cili është zakonisht dhëmbi më i vogël i dhëmbësisë së përhershme?",
    },
    options: [
      { it: "Incisivo centrale inferiore (31/41)", de: "Mittlerer unterer Schneidezahn (31/41)", en: "Lower central incisor (31/41)", sq: "Prerësi qendror i poshtëm (31/41)" },
      { it: "Incisivo laterale superiore (12/22)", de: "Seitlicher oberer Schneidezahn (12/22)", en: "Upper lateral incisor (12/22)", sq: "Prerësi anësor i sipërm (12/22)" },
      { it: "Secondo premolare inferiore (35/45)", de: "Zweiter unterer Prämolar (35/45)", en: "Lower second premolar (35/45)", sq: "Premolari i dytë i poshtëm (35/45)" },
      { it: "Terzo molare superiore (18/28)", de: "Oberer Weisheitszahn (18/28)", en: "Upper third molar (18/28)", sq: "Molari i tretë i sipërm (18/28)" },
    ],
    answerIndex: 0,
    hints: [
      { it: "Guarda la larghezza mesio-distale della corona.", de: "Achte auf die mesiodistale Kronenbreite.", en: "Look at the mesiodistal width of the crown.", sq: "Shikoni gjerësinë meziodistale të kurorës." },
      { it: "È un dente frontale dell'arcata inferiore.", de: "Es ist ein Frontzahn des Unterkiefers.", en: "It is an anterior tooth of the lower arch.", sq: "Është dhëmb i përparmë i harkut të poshtëm." },
    ],
    reasoning: {
      it: "L'incisivo centrale inferiore ha tipicamente la corona più stretta della dentatura permanente.",
      de: "Der mittlere untere Schneidezahn hat typischerweise die schmalste Krone des bleibenden Gebisses.",
      en: "The lower central incisor typically has the narrowest crown of the permanent dentition.",
      sq: "Prerësi qendror i poshtëm zakonisht ka kurorën më të ngushtë të dhëmbësisë së përhershme.",
    },
  },
  {
    id: "trick-carabelli",
    fdi: "16",
    prompt: { it: "Il tubercolo di Carabelli è…", de: "Der Carabelli-Höcker ist…", en: "The cusp (tubercle) of Carabelli is…", sq: "Tuberkuli i Carabellit është…" },
    options: [
      { it: "una variante che può comparire sulla cuspide mesio-palatale del primo molare superiore.", de: "eine Variante, die am mesiopalatinalen Höcker des ersten oberen Molaren auftreten kann.", en: "a variant that can appear on the mesiopalatal cusp of the upper first molar.", sq: "një variant që mund të shfaqet në kuspidin meziopalatinal të molarit të parë të sipërm." },
      { it: "una cuspide costante di tutti i molari superiori.", de: "ein konstanter Höcker aller oberen Molaren.", en: "a constant cusp of all upper molars.", sq: "një kuspid i përhershëm i të gjithë molarëve të sipërm." },
      { it: "una cuspide tipica del primo molare inferiore.", de: "ein typischer Höcker des ersten unteren Molaren.", en: "a typical cusp of the lower first molar.", sq: "një kuspid tipik i molarit të parë të poshtëm." },
      { it: "un difetto patologico dello smalto.", de: "ein pathologischer Schmelzdefekt.", en: "a pathological enamel defect.", sq: "një defekt patologjik i smaltit." },
    ],
    answerIndex: 0,
    hints: [
      { it: "È una variante anatomica, non una patologia.", de: "Es ist eine anatomische Variante, keine Pathologie.", en: "It is an anatomical variant, not a pathology.", sq: "Është variant anatomik, jo patologji." },
      { it: "Si trova sul versante palatale del 16/26.", de: "Er liegt palatinal am 16/26.", en: "It lies on the palatal side of 16/26.", sq: "Ndodhet në anën palatinale të 16/26." },
    ],
    reasoning: {
      it: "Variante frequente ma non costante, localizzata tipicamente sulla cuspide mesio-palatale del primo molare superiore.",
      de: "Häufige, aber nicht konstante Variante, typischerweise am mesiopalatinalen Höcker des ersten oberen Molaren.",
      en: "A frequent but not constant variant, typically located on the mesiopalatal cusp of the upper first molar.",
      sq: "Variant i shpeshtë por jo i përhershëm, zakonisht i vendosur në kuspidin meziopalatinal të molarit të parë të sipërm.",
    },
  },
  {
    id: "trick-mesial",
    fdi: "23",
    prompt: { it: "Quale dente si trova mesialmente al 23?", de: "Welcher Zahn liegt mesial von 23?", en: "Which tooth lies mesial to 23?", sq: "Cili dhëmb ndodhet mezialisht nga 23?" },
    options: [
      { it: "22", de: "22", en: "22", sq: "22" },
      { it: "24", de: "24", en: "24", sq: "24" },
      { it: "13", de: "13", en: "13", sq: "13" },
      { it: "33", de: "33", en: "33", sq: "33" },
    ],
    answerIndex: 0,
    hints: [
      { it: "Mesiale = verso la linea mediana.", de: "Mesial = zur Mittellinie hin.", en: "Mesial = towards the midline.", sq: "Mezial = drejt vijës mesore." },
      { it: "Nello stesso quadrante, cifra più bassa.", de: "Im selben Quadranten die niedrigere Ziffer.", en: "Same quadrant, lower digit.", sq: "I njëjti kuadrant, shifra më e ulët." },
    ],
    reasoning: {
      it: "Nello stesso quadrante la posizione inferiore è più mesiale: 22 sta mesialmente al 23.",
      de: "Im selben Quadranten liegt die niedrigere Position weiter mesial: 22 liegt mesial von 23.",
      en: "Within the same quadrant the lower position is more mesial: 22 lies mesial to 23.",
      sq: "Brenda të njëjtit kuadrant pozicioni më i ulët është më mezial: 22 ndodhet mezialisht nga 23.",
    },
  },
  {
    id: "trick-eruption",
    fdi: "36",
    prompt: {
      it: "Quale gruppo di denti rientra tipicamente tra i primi permanenti a erompere?",
      de: "Welche Zahngruppe gehört typischerweise zu den zuerst durchbrechenden bleibenden Zähnen?",
      en: "Which group of teeth is typically among the first permanent teeth to erupt?",
      sq: "Cili grup dhëmbësh është zakonisht ndër dhëmbët e parë të përhershëm që shpërthejnë?",
    },
    options: [
      { it: "Il primo molare (dente dei sei anni), spesso insieme agli incisivi centrali inferiori.", de: "Der erste Molar (Sechsjahrmolar), oft zusammen mit den unteren mittleren Schneidezähnen.", en: "The first molar (six-year molar), often together with the lower central incisors.", sq: "Molari i parë (molari i gjashtë vjetëve), shpesh bashkë me prerësit qendrorë të poshtëm." },
      { it: "Il canino superiore.", de: "Der obere Eckzahn.", en: "The upper canine.", sq: "Kanini i sipërm." },
      { it: "Il secondo premolare.", de: "Der zweite Prämolar.", en: "The second premolar.", sq: "Premolari i dytë." },
      { it: "Il terzo molare.", de: "Der Weisheitszahn.", en: "The third molar.", sq: "Molari i tretë." },
    ],
    answerIndex: 0,
    hints: [
      { it: "Erompe distalmente ai molari decidui, senza sostituirli.", de: "Er bricht distal der Milchmolaren durch, ohne sie zu ersetzen.", en: "It erupts distal to the primary molars without replacing them.", sq: "Shpërthen distalisht nga molarët e qumështit pa i zëvendësuar ata." },
      { it: "Intorno ai 6 anni.", de: "Etwa im 6. Lebensjahr.", en: "Around 6 years of age.", sq: "Rreth moshës 6 vjeç." },
    ],
    reasoning: {
      it: "I primi molari e gli incisivi centrali inferiori erompono tipicamente tra 6 e 7 anni; l'ordine esatto può variare da bambino a bambino.",
      de: "Erste Molaren und untere mittlere Schneidezähne brechen typischerweise zwischen 6 und 7 Jahren durch; die genaue Reihenfolge kann individuell variieren.",
      en: "First molars and lower central incisors typically erupt between 6 and 7 years; the exact order can vary from child to child.",
      sq: "Molarët e parë dhe prerësit qendrorë të poshtëm zakonisht shpërthejnë ndërmjet 6 dhe 7 vjeç; rendi i saktë mund të ndryshojë nga fëmija në fëmijë.",
    },
  },
  {
    id: "trick-lower-first-molar-cusps",
    fdi: "36",
    prompt: { it: "Quante cuspidi ha il primo molare inferiore?", de: "Wie viele Höcker hat der erste untere Molar?", en: "How many cusps does the lower first molar have?", sq: "Sa kuspidë ka molari i parë i poshtëm?" },
    options: [
      { it: "Tipicamente 5, ma esistono forme a 4 cuspidi.", de: "Typischerweise 5, es gibt aber vierhöckrige Formen.", en: "Typically 5, but 4-cusp forms exist.", sq: "Zakonisht 5, por ekzistojnë forma me 4 kuspidë." },
      { it: "Sempre 4.", de: "Immer 4.", en: "Always 4.", sq: "Gjithmonë 4." },
      { it: "Sempre 5.", de: "Immer 5.", en: "Always 5.", sq: "Gjithmonë 5." },
      { it: "Tipicamente 3.", de: "Typischerweise 3.", en: "Typically 3.", sq: "Zakonisht 3." },
    ],
    answerIndex: 0,
    hints: [
      { it: "La quinta cuspide è distale.", de: "Der fünfte Höcker liegt distal.", en: "The fifth cusp is distal.", sq: "Kuspidi i pestë është distal." },
      { it: "«Sempre» è quasi mai corretto in anatomia.", de: "„Immer“ ist in der Anatomie fast nie korrekt.", en: "'Always' is almost never correct in anatomy.", sq: "«Gjithmonë» pothuajse kurrë nuk është i saktë në anatomi." },
    ],
    reasoning: {
      it: "Il 36/46 presenta tipicamente 5 cuspidi (con cuspide distale); la variante a 4 cuspidi è descritta.",
      de: "Der 36/46 hat typischerweise 5 Höcker (mit distalem Höcker); die vierhöckrige Variante ist beschrieben.",
      en: "36/46 typically has 5 cusps (including the distal cusp); a 4-cusp variant is described.",
      sq: "36/46 zakonisht ka 5 kuspidë (përfshirë kuspidin distal); varianti me 4 kuspidë është i përshkruar.",
    },
  },
  {
    id: "trick-longest-root",
    fdi: "13",
    prompt: { it: "Quale dente ha tipicamente la radice più lunga?", de: "Welcher Zahn hat typischerweise die längste Wurzel?", en: "Which tooth typically has the longest root?", sq: "Cili dhëmb zakonisht ka rrënjën më të gjatë?" },
    options: [
      { it: "Il canino superiore (13/23).", de: "Der obere Eckzahn (13/23).", en: "The upper canine (13/23).", sq: "Kanini i sipërm (13/23)." },
      { it: "Il primo molare superiore (16/26).", de: "Der erste obere Molar (16/26).", en: "The upper first molar (16/26).", sq: "Molari i parë i sipërm (16/26)." },
      { it: "L'incisivo centrale superiore (11/21).", de: "Der mittlere obere Schneidezahn (11/21).", en: "The upper central incisor (11/21).", sq: "Prerësi qendror i sipërm (11/21)." },
      { it: "Il secondo premolare inferiore (35/45).", de: "Der zweite untere Prämolar (35/45).", en: "The lower second premolar (35/45).", sq: "Premolari i dytë i poshtëm (35/45)." },
    ],
    answerIndex: 0,
    hints: [
      { it: "È il dente della guida canina.", de: "Es ist der Zahn der Eckzahnführung.", en: "It is the tooth of canine guidance.", sq: "Është dhëmbi i udhëzimit kanin." },
      { it: "Una sola radice, molto lunga.", de: "Eine einzige, sehr lange Wurzel.", en: "A single, very long root.", sq: "Një rrënjë e vetme, shumë e gjatë." },
    ],
    reasoning: {
      it: "Il canino superiore ha tipicamente la radice più lunga della dentatura; le misure variano tra individui.",
      de: "Der obere Eckzahn hat typischerweise die längste Wurzel des Gebisses; die Maße variieren individuell.",
      en: "The upper canine typically has the longest root in the dentition; measurements vary between individuals.",
      sq: "Kanini i sipërm zakonisht ka rrënjën më të gjatë në dhëmbësi; matjet ndryshojnë ndërmjet individëve.",
    },
  },
  {
    id: "trick-quadrant",
    fdi: null,
    prompt: { it: "Nel sistema FDI, che cosa indica la prima cifra?", de: "Was gibt im FDI-System die erste Ziffer an?", en: "In the FDI system, what does the first digit indicate?", sq: "Në sistemin FDI, çfarë tregon shifra e parë?" },
    options: [
      { it: "Il quadrante.", de: "Den Quadranten.", en: "The quadrant.", sq: "Kuadrantin." },
      { it: "Il tipo di dente.", de: "Den Zahntyp.", en: "The tooth type.", sq: "Llojin e dhëmbit." },
      { it: "Il numero di radici.", de: "Die Wurzelzahl.", en: "The number of roots.", sq: "Numrin e rrënjëve." },
      { it: "L'età di eruzione.", de: "Das Durchbruchsalter.", en: "The age of eruption.", sq: "Moshën e shpërthimit." },
    ],
    answerIndex: 0,
    hints: [
      { it: "1–4 nella dentatura permanente.", de: "1–4 im bleibenden Gebiss.", en: "1–4 in the permanent dentition.", sq: "1–4 në dhëmbësinë e përhershme." },
      { it: "La seconda cifra indica la posizione dalla linea mediana.", de: "Die zweite Ziffer gibt die Position ab der Mittellinie an.", en: "The second digit gives the position from the midline.", sq: "Shifra e dytë tregon pozicionin nga vija mesore." },
    ],
    reasoning: {
      it: "Prima cifra = quadrante (1–4 nei permanenti), seconda cifra = posizione 1–8 dalla linea mediana.",
      de: "Erste Ziffer = Quadrant (1–4 bleibend), zweite Ziffer = Position 1–8 ab der Mittellinie.",
      en: "First digit = quadrant (1–4 for permanent teeth), second digit = position 1–8 from the midline.",
      sq: "Shifra e parë = kuadranti (1–4 te dhëmbët e përhershëm), shifra e dytë = pozicioni 1–8 nga vija mesore.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Arch training sets                                                  */
/* ------------------------------------------------------------------ */

export const archTeeth = (arch: Arch): Tooth[] => TEETH.filter((t) => t.arch === arch);

export const toothOrThrow = (fdi: string): Tooth => getTooth(fdi) as Tooth;

export type { ToothTypeKey };
