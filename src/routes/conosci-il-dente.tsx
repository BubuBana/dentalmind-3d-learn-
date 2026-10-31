import * as React from "react";
import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import type { L, Lang } from "@/lib/teeth";
import { Card } from "@/components/ui";
import { Brain, BookOpen, Check, ChevronDown, CircleDot, Droplets, Languages, Lightbulb, MessageCircle, Scan, Shield, Sparkles } from "lucide-react";

export const Route = createFileRoute("/conosci-il-dente")({
  head: () => ({ meta: [
    { title: "Conosci il dente — DentalMind3D" },
    { name: "description", content: "Fondamenti di anatomia dentale in quattro lingue: parti, tessuti, superfici, orientamento e morfologia del dente." },
    { property: "og:title", content: "Conosci il dente — DentalMind3D" },
    { property: "og:description", content: "Scopri struttura, tessuti, superfici e morfologia del dente in italiano, tedesco, inglese e albanese." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: KnowTheToothPage,
});

type Copy = L;
const c = (it: string, de: string, en: string, sq: string): Copy => ({ it, de, en, sq });

const functions = [
  c("Taglio", "Schneiden", "Cutting", "Prerja"),
  c("Lacerazione", "Reißen", "Tearing", "Shqyerja"),
  c("Triturazione", "Zerkleinern", "Grinding", "Bluarja"),
  c("Fonazione", "Lautbildung", "Speech", "Të folurit"),
  c("Deglutizione", "Schlucken", "Swallowing", "Gëlltitja"),
  c("Forma del volto", "Gesichtsform", "Facial form", "Forma e fytyrës"),
];
const toothTypes = [
  c("Incisivi — margine sottile per tagliare", "Schneidezähne — dünne Kante zum Schneiden", "Incisors — thin edge for cutting", "Prerësit — buzë e hollë për të prerë"),
  c("Canini — cuspide robusta per lacerare", "Eckzähne — kräftige Spitze zum Reißen", "Canines — strong cusp for tearing", "Kaninët — kuspid i fortë për të shqyer"),
  c("Premolari — cuspidi per schiacciare e triturare", "Prämolaren — Höcker zum Zerdrücken und Zerkleinern", "Premolars — cusps for crushing and grinding", "Premolarët — kuspidë për të shtypur dhe bluar"),
  c("Molari — ampia superficie pluricuspidata per triturare", "Molaren — breite, mehrhöckrige Fläche zum Zerkleinern", "Molars — broad, multi-cusped surface for grinding", "Molarët — sipërfaqe e gjerë me shumë kuspidë për të bluar"),
];
/** `key` is a stable id used for highlighting, independent of the language. */
const tissues = [
  {
    key: "enamel",
    name: c("Smalto", "Zahnschmelz", "Enamel", "Smalti"),
    text: c(
      "È lo strato esterno della corona: il tessuto più mineralizzato e duro del corpo. Lo smalto maturo non contiene cellule, vasi né nervi e non percepisce direttamente il dolore. Lo smalto perso non ricresce; una demineralizzazione iniziale senza perdita di struttura può remineralizzarsi.",
      "Die äußere Schicht der Krone: das am stärksten mineralisierte und härteste Gewebe des Körpers. Reifer Schmelz enthält weder Zellen noch Gefäße oder Nerven. Verlorener Schmelz wächst nicht nach; anfängliche Entmineralisierung ohne Strukturverlust kann remineralisiert werden.",
      "The outer layer of the crown: the most highly mineralised and hardest tissue in the body. Mature enamel contains no cells, vessels or nerves and does not sense pain directly. Lost enamel does not grow back; early demineralisation without loss of structure can remineralise.",
      "Është shtresa e jashtme e kurorës: indi më i mineralizuar dhe më i fortë i trupit. Smalti i pjekur nuk përmban qeliza, enë gjaku as nerva dhe nuk e ndien drejtpërdrejt dhimbjen. Smalti i humbur nuk rritet përsëri; një demineralizim fillestar pa humbje strukture mund të remineralizohet.",
    ),
    color: "bg-[var(--tooth-enamel)]",
  },
  {
    key: "dentin",
    name: c("Dentina", "Dentin", "Dentin", "Dentina"),
    text: c(
      "È il corpo del dente, sotto smalto e cemento: meno dura dello smalto, giallastra e percorsa da minuscoli canalini (tubuli) che portano gli stimoli verso la polpa. Per questo un dente con dentina esposta può diventare sensibile.",
      "Sie bildet den Körper des Zahns unter Schmelz und Zement: weniger hart, gelblich und von winzigen Kanälchen (Tubuli) durchzogen, die Reize zur Pulpa leiten. Deshalb kann freiliegendes Dentin empfindlich sein.",
      "It forms the body of the tooth beneath enamel and cementum: softer than enamel, yellowish and crossed by tiny channels (tubules) that carry stimuli towards the pulp. This is why a tooth with exposed dentin can become sensitive.",
      "Është trupi i dhëmbit, nën smalt dhe cement: më pak e fortë se smalti, e verdhë dhe e përshkuar nga kanale të vegjël (tubula) që i çojnë stimujt drejt pulpës. Prandaj një dhëmb me dentinë të zbuluar mund të bëhet i ndjeshëm.",
    ),
    color: "bg-[var(--tooth-dentin)]",
  },
  {
    key: "cementum",
    name: c("Cemento", "Wurzelzement", "Cementum", "Cementi"),
    text: c(
      "Riveste la dentina della radice e offre inserzione alle fibre del legamento parodontale che ancorano il dente all'alveolo.",
      "Bedeckt das Wurzeldentin und dient den Fasern des Zahnhalteapparats als Ansatz, die den Zahn im Alveolarfach verankern.",
      "It covers the root dentin and provides attachment for the periodontal ligament fibres that anchor the tooth in its socket.",
      "Mbulon dentinën e rrënjës dhe u jep vend ngjitjeje fibrave të ligamentit periodontal që e ankorojnë dhëmbin në alveol.",
    ),
    color: "bg-[var(--tooth-cement)]",
  },
  {
    key: "pulp",
    name: c("Polpa", "Pulpa", "Pulp", "Pulpa"),
    text: c(
      "È il tessuto molle al centro del dente, nella camera pulpare e nei canali radicolari: contiene vasi sanguigni, nervi e le cellule che producono dentina. Forma con la dentina il complesso dentino-pulpare; non è l’unico tessuto dentale biologicamente attivo.",
      "Das weiche Gewebe im Zahninneren, in Pulpakammer und Wurzelkanälen: mit Blutgefäßen, Nerven und den Zellen, die Dentin bilden. Mit dem Dentin bildet sie den Dentin-Pulpa-Komplex; sie ist nicht das einzige biologisch aktive Zahngewebe.",
      "The soft tissue in the centre of the tooth, in the pulp chamber and root canals: it contains blood vessels, nerves and the cells that produce dentin. Together with dentin it forms the dentin–pulp complex; it is not the only biologically active dental tissue.",
      "Është indi i butë në qendër të dhëmbit, në dhomën pulpare dhe në kanalet rrënjore: përmban enë gjaku, nerva dhe qelizat që prodhojnë dentinë. Bashkë me dentinën formon kompleksin dentino-pulpar; nuk është i vetmi ind dentar biologjikisht aktiv.",
    ),
    color: "bg-destructive/70",
  },
];
const surfaces = [
  c("Vestibolare — rivolta verso labbra o guance", "Vestibulär — zu Lippen oder Wangen gerichtet", "Vestibular — facing the lips or cheeks", "Vestibulare — nga buzët ose faqet"),
  c("Linguale / palatale — verso la lingua nella mandibola, verso il palato nel mascellare", "Lingual / palatinal — im Unterkiefer zur Zunge, im Oberkiefer zum Gaumen", "Lingual / palatal — towards the tongue in the mandible, towards the palate in the maxilla", "Linguale / palatinale — nga gjuha në mandibulë, nga qiellza në maksilë"),
  c("Mesiale — rivolta verso la linea mediana dell'arcata", "Mesial — zur Mittellinie des Zahnbogens gerichtet", "Mesial — facing the midline of the arch", "Meziale — nga vija mesore e harkut"),
  c("Distale — rivolta lontano dalla linea mediana", "Distal — von der Mittellinie abgewandt", "Distal — facing away from the midline", "Distale — larg vijës mesore"),
  c("Incisale — margine tagliente dei denti anteriori", "Inzisal — Schneidekante der Frontzähne", "Incisal — cutting edge of the anterior teeth", "Incizale — buza prerëse e dhëmbëve të përparmë"),
  c("Occlusale — superficie masticatoria dei denti posteriori", "Okklusal — Kaufläche der Seitenzähne", "Occlusal — chewing surface of the posterior teeth", "Okluzale — sipërfaqja përtypëse e dhëmbëve të pasmë"),
];
const morphology = [
  c("Cuspide", "Höcker", "Cusp", "Kuspidi"),
  c("Cresta", "Leiste", "Ridge", "Kreshta"),
  c("Cresta marginale", "Randleiste", "Marginal ridge", "Kreshta margjinale"),
  c("Solco", "Furche", "Groove", "Brazda"),
  c("Fossa", "Grube (Fossa)", "Fossa", "Gropëza (fossa)"),
  c("Fossetta", "Grübchen", "Pit", "Gropëzë e vogël"),
  c("Cingolo", "Cingulum", "Cingulum", "Cingulumi"),
];
const morphologyText = [
  c("Rilievo coronale arrotondato o appuntito, tipico soprattutto dei denti posteriori e del canino.", "Gerundete oder spitze Erhebung der Krone, besonders typisch für Seitenzähne und Eckzahn.", "Rounded or pointed elevation of the crown, typical especially of posterior teeth and the canine.", "Ngritje e rrumbullakët ose e mprehtë e kurorës, tipike sidomos për dhëmbët e pasmë dhe kaninin."),
  c("Rilievo lineare allungato sulla superficie coronale.", "Längliche, linienförmige Erhebung auf der Kronenfläche.", "Elongated linear elevation on the crown surface.", "Ngritje lineare e zgjatur në sipërfaqen e kurorës."),
  c("Rilievo che delimita mesialmente o distalmente la superficie linguale/palatale degli anteriori o occlusale dei posteriori.", "Leiste, die die linguale/palatinale Fläche der Frontzähne oder die Okklusalfläche der Seitenzähne mesial oder distal begrenzt.", "Ridge bounding, mesially or distally, the lingual/palatal surface of anterior teeth or the occlusal surface of posterior teeth.", "Kreshtë që kufizon mezialisht ose distalisht sipërfaqen linguale/palatinale të dhëmbëve të përparmë ose atë okluzale të dhëmbëve të pasmë."),
  c("Depressione lineare che separa rilievi o lobi di sviluppo.", "Linienförmige Vertiefung, die Erhebungen oder Entwicklungslappen trennt.", "Linear depression separating ridges or developmental lobes.", "Gropëzim linear që ndan ngritjet ose lobet e zhvillimit."),
  c("Depressione ampia e poco profonda della superficie coronale.", "Breite, flache Vertiefung der Kronenfläche.", "Broad, shallow depression of the crown surface.", "Gropëzim i gjerë dhe i cekët i sipërfaqes së kurorës."),
  c("Piccola depressione puntiforme, spesso all'incontro di solchi.", "Kleine punktförmige Vertiefung, häufig am Zusammentreffen von Furchen.", "Small pinpoint depression, often where grooves meet.", "Gropëzim i vogël si pikë, shpesh aty ku takohen brazdat."),
  c("Convessità nel terzo cervicale della superficie linguale o palatale dei denti anteriori.", "Wölbung im zervikalen Drittel der lingualen oder palatinalen Fläche von Frontzähnen.", "Convexity in the cervical third of the lingual or palatal surface of anterior teeth.", "Konveksitet në të tretën cervikale të sipërfaqes linguale ose palatinale të dhëmbëve të përparmë."),
];

function KnowTheToothPage() {
  const { lang } = useI18n();
  const text = (copy: Copy) => copy[lang];
  const [part, setPart] = React.useState<PartKey | null>(null);
  const [tissue, setTissue] = React.useState<string | null>(null);
  return <div className="space-y-6">
    <header className="border-b border-border pb-6"><p className="text-xs font-bold uppercase text-primary">{text(c("Fondamenti di anatomia dentale", "Grundlagen der Zahnanatomie", "Dental anatomy basics", "Bazat e anatomisë dentare"))}</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">{text(c("🦷 Conosci il dente", "🦷 Lerne den Zahn kennen", "🦷 Get to know the tooth", "🦷 Njih dhëmbin"))}</h1><p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{text(c("Prima di imparare a riconoscere i denti, scopri come sono fatti, quali tessuti li compongono e perché hanno forme diverse.", "Bevor du Zähne erkennen lernst, entdecke ihren Aufbau, ihre Gewebe und warum sie unterschiedliche Formen haben.", "Before learning to recognise teeth, discover how they are built, which tissues they are made of and why they have different shapes.", "Para se të mësosh t'i njohësh dhëmbët, zbulo si janë ndërtuar, nga cilat inde përbëhen dhe pse kanë forma të ndryshme."))}</p></header>

    <LessonSection number="01" title={text(c("Che cos'è un dente?", "Was ist ein Zahn?", "What is a tooth?", "Çfarë është një dhëmb?"))} icon={<BookOpen />}>
      <p className="leading-7">{text(c(
        "Il dente è un organo vivo e mineralizzato: la parte dura che vedi in bocca è sostenuta da tessuti molli e vasi al suo interno. Ogni dente è alloggiato in una cavità dell'osso (l'alveolo) e ancorato dal legamento parodontale. Il parodonto comprende gengiva, legamento parodontale, cemento e osso alveolare. Non serve soltanto a masticare: partecipa a più funzioni coordinate.",
        "Der Zahn ist ein lebendes, mineralisiertes Organ: Der harte, sichtbare Teil wird innen von Weichgewebe und Gefäßen versorgt. Jeder Zahn sitzt in einer Knochenhöhle (dem Alveolarfach) und wird durch das Desmodont verankert. Zum Zahnhalteapparat gehören Gingiva, Desmodont, Wurzelzement und Alveolarknochen. Er dient nicht nur dem Kauen, sondern erfüllt mehrere koordinierte Aufgaben.",
        "A tooth is a living, mineralised organ: the hard part you see in the mouth is supplied by soft tissue and vessels inside it. Each tooth sits in a socket in the bone (the alveolus) and is anchored by the periodontal ligament. The periodontium comprises gingiva, periodontal ligament, cementum and alveolar bone. Teeth are not only for chewing: they take part in several coordinated functions.",
        "Dhëmbi është një organ i gjallë dhe i mineralizuar: pjesa e fortë që sheh në gojë ushqehet nga inde të buta dhe enë gjaku në brendësi. Çdo dhëmb ndodhet në një zgavër të kockës (alveoli) dhe ankorohet nga ligamenti periodontal. Parodonti përfshin gingivën, ligamentin periodontal, cementin dhe kockën alveolare. Dhëmbi nuk shërben vetëm për përtypje: merr pjesë në disa funksione të koordinuara.",
      ))}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{functions.map((item) => <FactChip key={item.it}>{text(item)}</FactChip>)}</div>
      <details className="group mt-4 rounded-lg border border-border bg-secondary/50 p-4" open><summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-primary">{text(c("La forma del dente è legata alla sua funzione", "Die Zahnform hängt mit ihrer Funktion zusammen", "A tooth's shape is linked to its function", "Forma e dhëmbit lidhet me funksionin e tij"))}<ChevronDown className="h-4 w-4 transition group-open:rotate-180" /></summary><ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">{toothTypes.map((item) => <li key={item.it} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{text(item)}</li>)}</ul></details>
    </LessonSection>

    <LessonSection number="02" title={text(c("Le tre parti del dente", "Die drei Teile des Zahns", "The three parts of a tooth", "Tri pjesët e dhëmbit"))} icon={<Scan />}>
      <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center"><ToothPartsDiagram lang={lang} active={part} /><div className="grid gap-3">
        <Definition title={text(c("Corona", "Krone", "Crown", "Kurora"))} partKey="crown" active={part === "crown"} onToggle={() => setPart(part === "crown" ? null : "crown")}>{text(c(
          "La corona anatomica è rivestita di smalto e termina alla giunzione smalto-cemento. La corona clinica è la porzione esposta in bocca: con una recessione può comprendere parte della radice.",
          "Die anatomische Krone ist schmelzbedeckt und endet an der Schmelz-Zement-Grenze. Die klinische Krone ist der freiliegende Abschnitt; bei Rezession kann sie einen Teil der Wurzel umfassen.",
          "The anatomical crown is covered by enamel and ends at the cementoenamel junction. The clinical crown is the part exposed in the mouth: with gingival recession it can include part of the root.",
          "Kurora anatomike është e mbuluar me smalt dhe mbaron te kufiri smalt-cement. Kurora klinike është pjesa e dukshme në gojë: me tërheqje të gingivës mund të përfshijë edhe një pjesë të rrënjës.",
        ))}</Definition>
        <Definition title={text(c("Colletto", "Zahnhals", "Neck (cervix)", "Qafa"))} partKey="neck" active={part === "neck"} onToggle={() => setPart(part === "neck" ? null : "neck")}>{text(c(
          "Zona di passaggio tra corona e radice, in corrispondenza della giunzione smalto-cemento.",
          "Übergangszone zwischen Krone und Wurzel an der Schmelz-Zement-Grenze.",
          "Transition zone between crown and root, at the cementoenamel junction.",
          "Zona e kalimit ndërmjet kurorës dhe rrënjës, te kufiri smalt-cement.",
        ))}</Definition>
        <Definition title={text(c("Radice", "Wurzel", "Root", "Rrënja"))} partKey="root" active={part === "root"} onToggle={() => setPart(part === "root" ? null : "root")}>{text(c(
          "Parte normalmente inserita nell'alveolo osseo; può essere singola o multipla e termina verso l'apice.",
          "Der normalerweise im knöchernen Zahnfach liegende Teil; er kann ein- oder mehrwurzelig sein und endet zur Wurzelspitze hin.",
          "The part normally held in the bony socket; there may be one or several roots, each ending at the apex.",
          "Pjesa që normalisht ndodhet në alveolin kockor; mund të jetë e vetme ose e shumëfishtë dhe mbaron te apeksi.",
        ))}</Definition>
      </div></div>
      <Warning>{text(c("Corona e smalto non sono la stessa cosa.", "Krone und Zahnschmelz sind nicht dasselbe.", "Crown and enamel are not the same thing.", "Kurora dhe smalti nuk janë e njëjta gjë."))}</Warning>
    </LessonSection>

    <LessonSection number="03" title={text(c("I tessuti del dente", "Die Gewebe des Zahns", "The tissues of the tooth", "Indet e dhëmbit"))} icon={<CircleDot />}>
      <p className="mb-4 leading-7 text-muted-foreground">{text(c(
        "Le tre parti (corona, colletto, radice) dicono DOVE ci troviamo; i tessuti dicono DI COSA è fatto il dente in quel punto. Tocca un tessuto per evidenziarlo nella sezione.",
        "Die drei Teile (Krone, Hals, Wurzel) sagen, WO wir uns befinden; die Gewebe sagen, WORAUS der Zahn dort besteht. Tippe ein Gewebe an, um es im Querschnitt hervorzuheben.",
        "The three parts (crown, neck, root) tell you WHERE you are; the tissues tell you WHAT the tooth is made of at that point. Tap a tissue to highlight it in the section.",
        "Tri pjesët (kurora, qafa, rrënja) tregojnë KU ndodhemi; indet tregojnë NGA ÇFARË përbëhet dhëmbi në atë pikë. Prek një ind për ta theksuar në prerje.",
      ))}</p><div className="grid gap-5 lg:grid-cols-[260px_1fr]"><CrossSectionDiagram lang={lang} active={tissue} /><div className="grid gap-3 sm:grid-cols-2">{tissues.map((item) => { const on = tissue === item.key; return <button type="button" key={item.key} aria-pressed={on} onClick={() => setTissue(on ? null : item.key)} className={`rounded-lg border p-4 text-left transition ${on ? "border-primary bg-primary/8 ring-2 ring-primary/30" : "border-border hover:border-primary/50"}`}><span className="flex items-center gap-2 font-bold"><span className={`h-3 w-3 rounded-full ${item.color}`} />{text(item.name)}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{text(item.text)}</span></button>; })}</div></div>
    </LessonSection>

    <LessonSection number="04" title={text(c("Perché i denti sono bianchi?", "Warum sind Zähne weiß?", "Why are teeth white?", "Pse dhëmbët janë të bardhë?"))} icon={<Sparkles />}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Definition title={text(c("Smalto traslucido", "Durchscheinender Schmelz", "Translucent enamel", "Smalt i tejdukshëm"))}>{text(c("Lo smalto non è completamente opaco: lascia filtrare e riflette la luce.", "Zahnschmelz ist nicht völlig undurchsichtig: Er lässt Licht durch und reflektiert es.", "Enamel is not completely opaque: it lets light through and reflects it.", "Smalti nuk është plotësisht i patejdukshëm: e lë dritën të kalojë dhe e reflekton."))}</Definition>
        <Definition title={text(c("Dentina giallastra", "Gelbliches Dentin", "Yellowish dentin", "Dentinë e verdhë"))}>{text(c("Il colore percepito dipende anche dalla dentina sottostante, naturalmente più giallastra. Spessore, traslucenza e luce modificano l'aspetto.", "Die wahrgenommene Farbe hängt auch vom darunterliegenden, natürlich gelblicheren Dentin ab. Dicke, Lichtdurchlässigkeit und Beleuchtung verändern das Aussehen.", "The perceived colour also depends on the underlying dentin, which is naturally more yellow. Thickness, translucency and lighting change the appearance.", "Ngjyra që shohim varet edhe nga dentina poshtë, natyrshëm më e verdhë. Trashësia, tejdukshmëria dhe drita e ndryshojnë pamjen."))}</Definition>
      </div>
    </LessonSection>

    <LessonSection number="05" title={text(c("Le superfici del dente", "Die Zahnflächen", "The surfaces of the tooth", "Sipërfaqet e dhëmbit"))} icon={<Languages />}>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-primary/8 p-4"><strong>{text(c("Denti anteriori", "Frontzähne", "Anterior teeth", "Dhëmbët e përparmë"))}</strong><p className="mt-1 text-sm text-muted-foreground">{text(c("Gli incisivi hanno un margine incisale; i canini una cuspide con due versanti.", "Schneidezähne besitzen eine Inzisalkante; Eckzähne eine Höckerspitze mit zwei Abhängen.", "Incisors have an incisal edge; canines have a cusp with two slopes.", "Prerësit kanë buzë incizale; kaninët kanë një kuspid me dy pjerrësi."))}</p></div>
        <div className="rounded-lg bg-primary/8 p-4"><strong>{text(c("Denti posteriori", "Seitenzähne", "Posterior teeth", "Dhëmbët e pasmë"))}</strong><p className="mt-1 text-sm text-muted-foreground">{text(c("Hanno una superficie occlusale.", "Sie besitzen eine Okklusalfläche.", "They have an occlusal surface.", "Kanë një sipërfaqe okluzale."))}</p></div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">{surfaces.map((item) => <FactChip key={item.it}>{text(item)}</FactChip>)}</div>
    </LessonSection>

    <LessonSection number="06" title={text(c("Mesiale e distale", "Mesial und distal", "Mesial and distal", "Mezial dhe distal"))} icon={<Scan />}>
      <p className="leading-7 text-muted-foreground">{text(c(
        "La linea mediana divide le arcate in metà destra e sinistra. Mesiale indica la superficie rivolta verso questa linea; distale quella che se ne allontana.",
        "Die Mittellinie teilt die Zahnbögen in eine rechte und eine linke Hälfte. Mesial bezeichnet die Fläche zur Mittellinie hin, distal die davon abgewandte Fläche.",
        "The midline divides the arches into right and left halves. Mesial is the surface facing this line; distal is the one facing away from it.",
        "Vija mesore i ndan harqet në gjysmën e djathtë dhe të majtë. Mezial është sipërfaqja që shikon nga kjo vijë; distal ajo që largohet prej saj.",
      ))}</p><MidlineDiagram lang={lang} /><Warning>{text(c("Destra e sinistra si riferiscono sempre al paziente, non all'osservatore.", "Rechts und links beziehen sich immer auf den Patienten, nicht auf den Betrachter.", "Right and left always refer to the patient, not the observer.", "Djathtas dhe majtas i referohen gjithmonë pacientit, jo vëzhguesit."))}</Warning>
    </LessonSection>

    <LessonSection number="07" title={text(c("Introduzione alla morfologia", "Einführung in die Morphologie", "Introduction to morphology", "Hyrje në morfologji"))} icon={<Droplets />}>
      <p className="mb-4 font-semibold text-primary">🔬 {text(c("Impariamo a leggere la forma del dente", "Wir lernen, die Zahnform zu lesen", "Learning to read the shape of a tooth", "Mësojmë të lexojmë formën e dhëmbit"))}</p><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{morphology.map((term, index) => { const description = morphologyText[index]; if (!description) return null; return <details key={term.it} className="group rounded-lg border border-border p-4 open:border-primary/40 open:bg-primary/5"><summary className="flex cursor-pointer list-none items-center justify-between font-bold"><span className="flex items-center gap-3"><MorphologyMark index={index} />{text(term)}</span><ChevronDown className="h-4 w-4 text-muted-foreground transition group-open:rotate-180" /></summary><p className="mt-3 text-sm leading-6 text-muted-foreground">{text(description)}</p></details>; })}</div>
    </LessonSection>

    <LessonSection number="08" title={text(c("Quiz di fine sezione", "Quiz zum Abschluss", "End-of-section quiz", "Kuiz në fund të pjesës"))} icon={<Brain />}>
      <MiniQuiz lang={lang} />
    </LessonSection>

    <section className="rounded-lg border border-primary/30 bg-primary/8 p-5 sm:p-6"><div className="flex items-center gap-3"><Lightbulb className="h-6 w-6 text-primary" /><h2 className="text-xl font-black">🧠 {text(c("Da ricordare", "Merke dir", "Remember", "Mbaj mend"))}</h2></div><ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">{[
      c("Il dente è un organo: forma e funzione sono collegate.", "Der Zahn ist ein Organ: Form und Funktion hängen zusammen.", "A tooth is an organ: form and function are linked.", "Dhëmbi është organ: forma dhe funksioni janë të lidhura."),
      c("Corona, colletto e radice descrivono regioni; smalto, dentina, cemento e polpa sono tessuti.", "Krone, Hals und Wurzel bezeichnen Bereiche; Schmelz, Dentin, Zement und Pulpa sind Gewebe.", "Crown, neck and root describe regions; enamel, dentin, cementum and pulp are tissues.", "Kurora, qafa dhe rrënja përshkruajnë zona; smalti, dentina, cementi dhe pulpa janë inde."),
      c("Mesiale va verso la linea mediana; distale se ne allontana.", "Mesial zeigt zur Mittellinie; distal von ihr weg.", "Mesial points towards the midline; distal points away from it.", "Meziali drejtohet nga vija mesore; distali largohet prej saj."),
      c("Le superfici e i rilievi sono il linguaggio con cui si descrive e riconosce ogni dente.", "Flächen und Reliefs bilden die Sprache, mit der jeder Zahn beschrieben und erkannt wird.", "Surfaces and reliefs are the language used to describe and recognise every tooth.", "Sipërfaqet dhe relievet janë gjuha me të cilën përshkruhet dhe njihet çdo dhëmb."),
    ].map((item) => <li key={item.it} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{text(item)}</li>)}</ul></section>
    <p className="flex items-center justify-center gap-2 pb-2 text-xs text-muted-foreground"><MessageCircle className="h-4 w-4" />{text(c("Ora hai le basi per iniziare a riconoscere i denti.", "Jetzt hast du die Grundlagen, um Zähne erkennen zu lernen.", "You now have the basics to start recognising teeth.", "Tani ke bazat për të filluar t'i njohësh dhëmbët."))}</p>
  </div>;
}

function LessonSection({ number, title, icon, children }: { number: string; title: string; icon: ReactNode; children: ReactNode }) { return <Card className="rounded-lg p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/12 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span><div><span className="text-[10px] font-bold uppercase text-muted-foreground">{number}</span><h2 className="text-xl font-black sm:text-2xl">{title}</h2></div></div>{children}</Card>; }
function FactChip({ children }: { children: ReactNode }) { return <div className="flex min-h-12 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"><Check className="h-4 w-4 shrink-0 text-primary" />{children}</div>; }
type PartKey = "crown" | "neck" | "root";
function Definition({ title, children, partKey, active, onToggle }: { title: string; children: ReactNode; partKey?: PartKey; active?: boolean; onToggle?: () => void }) {
  const base = `rounded-lg border-l-4 border-primary bg-secondary/50 p-4 ${active ? "bg-primary/10 ring-2 ring-primary/30" : ""}`;
  const body = <><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{children}</p></>;
  if (!partKey || !onToggle) return <div className={base}>{body}</div>;
  return <button type="button" aria-pressed={Boolean(active)} onClick={onToggle} className={`${base} w-full text-left transition hover:ring-2 hover:ring-primary/20`}>{body}</button>;
}
function Warning({ children }: { children: ReactNode }) { return <div className="mt-4 flex gap-3 rounded-lg bg-[var(--warn-bg)] p-4 text-sm font-semibold text-[var(--warn-fg)]"><Shield className="h-5 w-5 shrink-0" /><span>⚠️ {children}</span></div>; }
function DiagramLabel({ className, children }: { className: string; children: ReactNode }) { return <span className={`absolute z-10 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground ${className}`}>{children}</span>; }

const DIAGRAM = {
  partsAria: c(
    "Schema di un dente: in alto la corona rivestita di smalto, al centro il colletto alla giunzione smalto-cemento e in basso due radici che si assottigliano verso l'apice.",
    "Schema eines Zahns: oben die schmelzbedeckte Krone, in der Mitte der Zahnhals an der Schmelz-Zement-Grenze und unten zwei Wurzeln, die sich zur Spitze verjüngen.",
    "Diagram of a tooth: at the top the enamel-covered crown, in the middle the neck at the cementoenamel junction, and at the bottom two roots tapering towards the apex.",
    "Skemë e një dhëmbi: sipër kurora e mbuluar me smalt, në mes qafa te kufiri smalt-cement dhe poshtë dy rrënjë që hollohen drejt apeksit.",
  ),
  crown: c("Corona", "Krone", "Crown", "Kurora"),
  neck: c("Colletto", "Hals", "Neck", "Qafa"),
  root: c("Radice", "Wurzel", "Root", "Rrënja"),
  partsCaption: c("Seleziona una parte per evidenziarla.", "Wähle einen Teil, um ihn hervorzuheben.", "Select a part to highlight it.", "Zgjidh një pjesë për ta theksuar."),
  sectionAria: c(
    "Sezione schematica monoradicolare: smalto sulla corona, dentina continua nella radice, cemento esterno sottile e polpa con canale fino all’apice.",
    "Schematischer einwurzeliger Schnitt: Kronenschmelz, durchgehendes Dentin, dünne äußere Zementschicht und Pulpa mit Kanal bis zur Wurzelspitze.",
    "Schematic single-rooted section: enamel on the crown, continuous dentin into the root, a thin outer layer of cementum and pulp with a canal down to the apex.",
    "Prerje skematike e një dhëmbi me një rrënjë: smalt në kurorë, dentinë e vazhdueshme në rrënjë, shtresë e hollë e jashtme cementi dhe pulpë me kanal deri te apeksi.",
  ),
  sectionCaption: c(
    "Schema monoradicolare, non in scala: spessori e canali sono semplificati.",
    "Einwurzeliges Schema, nicht maßstabsgetreu: Gewebedicken und Kanäle sind vereinfacht.",
    "Single-rooted diagram, not to scale: thicknesses and canals are simplified.",
    "Skemë me një rrënjë, jo në shkallë: trashësitë dhe kanalet janë thjeshtuar.",
  ),
  midline: c("Linea mediana", "Mittellinie", "Midline", "Vija mesore"),
  patientRight: c("Destra del paziente", "Rechte Patientenseite", "Patient's right", "Djathtas i pacientit"),
  patientLeft: c("Sinistra del paziente", "Linke Patientenseite", "Patient's left", "Majtas i pacientit"),
};

function ToothPartsDiagram({ lang, active }: { lang: Lang; active?: PartKey | null }) {
  const on = (k: PartKey) => (active === k ? "ring-4 ring-primary ring-offset-2 ring-offset-card" : "");
  return (
    <figure className="mx-auto w-full max-w-[210px]">
      <div role="img" aria-label={DIAGRAM.partsAria[lang]} className="relative mx-auto h-72 w-36">
        <div className={`absolute left-2 top-0 h-32 w-[7.5rem] rounded-[48%_48%_32%_32%] border-4 border-primary/30 bg-[var(--tooth-enamel)] shadow-[var(--shadow-soft)] ${on("crown")}`} />
        <div className={`absolute left-8 top-28 h-8 w-20 rounded-lg bg-primary/35 ${on("neck")}`} />
        <div className={`absolute left-10 top-[8.5rem] h-[8.5rem] w-7 -rotate-6 rounded-b-full bg-[var(--tooth-dentin)] ${on("root")}`} />
        <div className={`absolute right-10 top-[8.5rem] h-[8.5rem] w-7 rotate-6 rounded-b-full bg-[var(--tooth-dentin)] ${on("root")}`} />
        <DiagramLabel className="right-0 top-10">{DIAGRAM.crown[lang]}</DiagramLabel>
        <DiagramLabel className="left-0 top-[7.5rem]">{DIAGRAM.neck[lang]}</DiagramLabel>
        <DiagramLabel className="right-0 top-52">{DIAGRAM.root[lang]}</DiagramLabel>
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">{DIAGRAM.partsCaption[lang]}</figcaption>
    </figure>
  );
}
function CrossSectionDiagram({ lang, active }: { lang: Lang; active?: string | null }) {
  const opacity = (key: string) => active && active !== key ? 0.35 : 1;
  return <figure className="rounded-lg border border-border bg-secondary/40 p-5 text-center">
    <svg viewBox="0 0 180 280" role="img" aria-label={DIAGRAM.sectionAria[lang]} className="mx-auto h-64 w-44">
      <path d="M48 120 L132 120 Q120 215 94 270 Q90 280 86 270 Q60 215 48 120Z" fill="var(--tooth-cement)" opacity={opacity("cementum")} />
      <path d="M48 120 Q25 95 30 40 Q35 10 60 16 Q90 28 120 16 Q145 10 150 40 Q155 95 132 120Z" fill="var(--tooth-enamel)" opacity={opacity("enamel")} />
      <path d="M54 120 Q39 86 44 44 Q47 28 65 31 Q90 42 115 31 Q133 28 136 44 Q141 86 126 120 Q115 216 90 263 Q65 216 54 120Z" fill="var(--tooth-dentin)" opacity={opacity("dentin")} />
      <path d="M74 61 Q90 75 106 61 L113 100 Q106 128 98 145 L92 264 L88 264 L82 145 Q74 128 67 100Z" fill="var(--destructive)" opacity={opacity("pulp")} />
    </svg>
    <figcaption className="mt-2 text-xs text-muted-foreground">{DIAGRAM.sectionCaption[lang]}</figcaption>
  </figure>;
}
function MidlineDiagram({ lang }: { lang: Lang }) { return <div className="my-5 rounded-lg border border-border bg-secondary/40 p-4"><div className="text-center text-xs font-bold uppercase text-primary">{DIAGRAM.midline[lang]}</div><div className="mt-3 grid grid-cols-[1fr_2px_1fr] items-center gap-3"><div className="text-right"><span className="font-black text-primary">D ← M</span><p className="text-xs text-muted-foreground">{DIAGRAM.patientRight[lang]}</p></div><div className="h-16 bg-primary" /><div><span className="font-black text-primary">M → D</span><p className="text-xs text-muted-foreground">{DIAGRAM.patientLeft[lang]}</p></div></div></div>; }
function MorphologyMark({ index }: { index: number }) { const shapes = ["rounded-t-full", "rounded-full", "rounded-sm", "rounded-full", "rounded-b-full", "rounded-full", "rounded-t-full"]; return <span className={`block h-7 w-7 border-2 border-primary bg-primary/12 ${shapes[index]}`} aria-hidden="true" />; }
interface QuizItem { q: Copy; options: Copy[]; correct: number; why: Copy }
const quizItems: QuizItem[] = [
  {
    q: c("Quale affermazione è corretta?", "Welche Aussage ist richtig?", "Which statement is correct?", "Cili pohim është i saktë?"),
    options: [
      c("Corona e smalto sono sinonimi.", "Krone und Schmelz sind dasselbe.", "Crown and enamel are synonyms.", "Kurora dhe smalti janë sinonime."),
      c("La corona è una regione del dente, lo smalto è un tessuto che la riveste.", "Die Krone ist ein Bereich des Zahns, der Schmelz ein Gewebe, das sie bedeckt.", "The crown is a region of the tooth; enamel is a tissue that covers it.", "Kurora është një zonë e dhëmbit; smalti është një ind që e mbulon."),
      c("Lo smalto riveste anche la radice.", "Der Schmelz bedeckt auch die Wurzel.", "Enamel also covers the root.", "Smalti mbulon edhe rrënjën."),
    ],
    correct: 1,
    why: c(
      "Corona, colletto e radice sono regioni anatomiche; smalto, dentina, cemento e polpa sono tessuti. La radice è rivestita di cemento, non di smalto.",
      "Krone, Hals und Wurzel sind anatomische Bereiche; Schmelz, Dentin, Zement und Pulpa sind Gewebe. Die Wurzel ist von Zement bedeckt, nicht von Schmelz.",
      "Crown, neck and root are anatomical regions; enamel, dentin, cementum and pulp are tissues. The root is covered by cementum, not enamel.",
      "Kurora, qafa dhe rrënja janë zona anatomike; smalti, dentina, cementi dhe pulpa janë inde. Rrënja mbulohet nga cementi, jo nga smalti.",
    ),
  },
  {
    q: c("Quale tessuto contiene vasi e nervi?", "Welches Gewebe enthält Gefäße und Nerven?", "Which tissue contains vessels and nerves?", "Cili ind përmban enë gjaku dhe nerva?"),
    options: [c("Smalto", "Schmelz", "Enamel", "Smalti"), c("Dentina", "Dentin", "Dentin", "Dentina"), c("Polpa", "Pulpa", "Pulp", "Pulpa")],
    correct: 2,
    why: c(
      "La polpa occupa la camera pulpare e i canali radicolari e contiene vasi, nervi e cellule che producono dentina.",
      "Die Pulpa füllt Pulpakammer und Wurzelkanäle und enthält Gefäße, Nerven und dentinbildende Zellen.",
      "The pulp fills the pulp chamber and root canals and contains vessels, nerves and dentin-forming cells.",
      "Pulpa mbush dhomën pulpare dhe kanalet rrënjore dhe përmban enë gjaku, nerva dhe qeliza që prodhojnë dentinë.",
    ),
  },
  {
    q: c("«Mesiale» indica la superficie...", "„Mesial“ bezeichnet die Fläche...", "'Mesial' refers to the surface...", "«Mezial» tregon sipërfaqen..."),
    options: [
      c("rivolta verso la linea mediana.", "zur Mittellinie hin.", "facing the midline.", "që shikon nga vija mesore."),
      c("rivolta lontano dalla linea mediana.", "von der Mittellinie weg.", "facing away from the midline.", "që largohet nga vija mesore."),
      c("rivolta verso la guancia.", "zur Wange hin.", "facing the cheek.", "që shikon nga faqja."),
    ],
    correct: 0,
    why: c(
      "Mesiale è verso la linea mediana, distale se ne allontana; vestibolare è verso guance o labbra.",
      "Mesial zeigt zur Mittellinie, distal davon weg; vestibulär zeigt zu Wangen oder Lippen.",
      "Mesial faces the midline, distal faces away from it; vestibular faces the cheeks or lips.",
      "Meziali shikon nga vija mesore, distali largohet prej saj; vestibulari shikon nga faqet ose buzët.",
    ),
  },
  {
    q: c("Destra e sinistra, in odontoiatria, si riferiscono a chi?", "Worauf beziehen sich rechts und links in der Zahnmedizin?", "In dentistry, whose right and left are meant?", "Në stomatologji, djathtas dhe majtas i referohen kujt?"),
    options: [
      c("All'osservatore.", "Auf den Betrachter.", "The observer's.", "Vëzhguesit."),
      c("Al paziente.", "Auf den Patienten.", "The patient's.", "Pacientit."),
      c("Dipende dall'arcata.", "Je nach Kiefer.", "It depends on the arch.", "Varet nga harku."),
    ],
    correct: 1,
    why: c(
      "Il riferimento è sempre il paziente: per questo nella vista clinica il quadrante 1 (superiore destro) appare in alto a sinistra dello schermo.",
      "Bezug ist immer der Patient: Deshalb erscheint in der zahnärztlichen Ansicht Quadrant 1 (oben rechts) links oben auf dem Bildschirm.",
      "The reference is always the patient: that is why, in the clinical view, quadrant 1 (upper right) appears at the top left of the screen.",
      "Referenca është gjithmonë pacienti: prandaj në pamjen klinike kuadranti 1 (sipër djathtas) shfaqet lart majtas në ekran.",
    ),
  },
  {
    q: c("Perché i molari hanno una superficie ampia con più cuspidi?", "Warum haben Molaren eine breite Fläche mit mehreren Höckern?", "Why do molars have a broad surface with several cusps?", "Pse molarët kanë sipërfaqe të gjerë me shumë kuspidë?"),
    options: [
      c("Per tagliare il cibo.", "Zum Schneiden der Nahrung.", "To cut food.", "Për të prerë ushqimin."),
      c("Per lacerare il cibo.", "Zum Reißen der Nahrung.", "To tear food.", "Për të shqyer ushqimin."),
      c("Per triturare il cibo.", "Zum Zerkleinern der Nahrung.", "To grind food.", "Për të bluar ushqimin."),
    ],
    correct: 2,
    why: c(
      "La forma segue la funzione: incisivi tagliano, canini lacerano, premolari e molari schiacciano e triturano.",
      "Die Form folgt der Funktion: Schneidezähne schneiden, Eckzähne reißen, Prämolaren und Molaren zerdrücken und zerkleinern.",
      "Form follows function: incisors cut, canines tear, premolars and molars crush and grind.",
      "Forma ndjek funksionin: prerësit presin, kaninët shqyejnë, premolarët dhe molarët shtypin dhe bluajnë.",
    ),
  },
];

const QUIZ_TXT = {
  intro: c("Cinque domande sui concetti chiave. Riceverai subito la spiegazione.", "Fünf Fragen zu den Kernbegriffen. Die Erklärung erscheint sofort.", "Five questions on the key concepts. You'll get the explanation straight away.", "Pesë pyetje për konceptet kryesore. Shpjegimin do ta marrësh menjëherë."),
  right: c("Corretto.", "Richtig.", "Correct.", "E saktë."),
  notYet: c("Non ancora.", "Noch nicht.", "Not yet.", "Jo ende."),
  score: c("Punteggio", "Punktzahl", "Score", "Pikët"),
  left: c("domande rimaste", "verbleibende Fragen", "questions left", "pyetje të mbetura"),
};

function MiniQuiz({ lang }: { lang: Lang }) {
  const text = (copy: Copy) => copy[lang];
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const score = quizItems.filter((item, i) => answers[i] === item.correct).length;
  const answered = Object.keys(answers).length;
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{text(QUIZ_TXT.intro)}</p>
      {quizItems.map((item, i) => {
        const given = answers[i];
        const done = given !== undefined;
        return (
          <fieldset key={item.q.it} className="rounded-lg border border-border p-4">
            <legend className="px-1 text-sm font-bold">{i + 1}. {text(item.q)}</legend>
            <div className="mt-2 grid gap-2">
              {item.options.map((opt, o) => {
                const isCorrect = o === item.correct;
                const chosen = given === o;
                return (
                  <button
                    key={opt.it}
                    type="button"
                    aria-pressed={chosen}
                    onClick={() => setAnswers((prev) => ({ ...prev, [i]: o }))}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                      done && isCorrect
                        ? "border-primary bg-primary/12 font-semibold text-primary"
                        : done && chosen
                          ? "border-[var(--warn-fg)] bg-[var(--warn-bg)] text-[var(--warn-fg)]"
                          : "border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {text(opt)}
                  </button>
                );
              })}
            </div>
            {done && (
              <p role="status" className="mt-3 rounded-lg bg-secondary/60 p-3 text-sm leading-6 text-muted-foreground">
                <strong className="text-foreground">
                  {given === item.correct ? text(QUIZ_TXT.right) : text(QUIZ_TXT.notYet)}
                </strong>{" "}
                {text(item.why)}
              </p>
            )}
          </fieldset>
        );
      })}
      <p aria-live="polite" className="text-sm font-semibold text-primary">
        {text(QUIZ_TXT.score)}: {score}/{quizItems.length}
        {answered < quizItems.length ? ` · ${text(QUIZ_TXT.left)}: ${quizItems.length - answered}` : ""}
      </p>
    </div>
  );
}
