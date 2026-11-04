import type { L } from "./teeth";

/**
 * Dental-laboratory content for future dental technicians, in IT / DE / EN / SQ.
 * General international teaching content; national training rules and product
 * names differ and must be checked locally.
 */

export interface LabItem {
  term: L;
  text: L;
}

export interface LabSection {
  id: string;
  title: L;
  intro: L;
  items: LabItem[];
}

const t = (it: string, de: string, en: string, sq: string): L => ({ it, de, en, sq });

export const LAB_SECTIONS: LabSection[] = [
  {
    id: "occlusion",
    title: t("Occlusione", "Okklusion", "Occlusion", "Okluzioni"),
    intro: t(
      "Ogni corona o protesi deve chiudere bene con i denti antagonisti. Per questo l'odontotecnico deve conoscere i contatti e i movimenti della mandibola.",
      "Jede Krone und jede Prothese muss mit den Gegenzähnen richtig schließen. Darum muss der Zahntechniker Kontakte und Unterkieferbewegungen kennen.",
      "Every crown or prosthesis must close correctly against the opposing teeth. This is why a dental technician must know the contacts and the movements of the mandible.",
      "Çdo kurorë ose protezë duhet të mbyllet mirë me dhëmbët antagonistë. Prandaj tekniku dentar duhet të njohë kontaktet dhe lëvizjet e mandibulës.",
    ),
    items: [
      {
        term: t("Massima intercuspidazione", "Maximale Interkuspidation", "Maximum intercuspation", "Interkuspidimi maksimal"),
        text: t(
          "Posizione con il numero massimo di contatti tra i denti superiori e inferiori. Il modello montato in articolatore parte di solito da questa posizione.",
          "Position mit der größten Zahl von Kontakten zwischen oberen und unteren Zähnen. Das Modell im Artikulator wird meist in dieser Position montiert.",
          "The position with the greatest number of contacts between upper and lower teeth. Models are usually mounted in the articulator in this position.",
          "Pozicioni me numrin më të madh të kontakteve ndërmjet dhëmbëve të sipërm dhe të poshtëm. Modelet zakonisht montohen në artikulator në këtë pozicion.",
        ),
      },
      {
        term: t("Relazione centrica", "Zentrische Relation", "Centric relation", "Relacioni qendror"),
        text: t(
          "Posizione della mandibola determinata dalle articolazioni, non dai denti. Il dentista la registra quando mancano molti denti o serve una nuova occlusione.",
          "Position des Unterkiefers, die durch die Kiefergelenke bestimmt wird, nicht durch die Zähne. Der Zahnarzt registriert sie, wenn viele Zähne fehlen oder eine neue Okklusion nötig ist.",
          "A jaw position set by the joints, not by the teeth. The dentist records it when many teeth are missing or when a new occlusion is needed.",
          "Pozicion i mandibulës që përcaktohet nga nyjet, jo nga dhëmbët. Stomatologu e regjistron kur mungojnë shumë dhëmbë ose kur nevojitet një okluzion i ri.",
        ),
      },
      {
        term: t("Cuspidi di sostegno e di guida", "Tragende Höcker und Führungshöcker", "Supporting and guiding cusps", "Kuspidët mbajtës dhe udhëzues"),
        text: t(
          "Nei denti posteriori le cuspidi palatali superiori e vestibolari inferiori sono di sostegno: entrano nelle fosse antagoniste. Le altre cuspidi sono di guida. Non bisogna ridurre troppo le cuspidi di sostegno.",
          "Bei Seitenzähnen sind die oberen palatinalen und die unteren bukkalen Höcker tragend: Sie greifen in die Gegengruben. Die anderen Höcker sind Führungshöcker. Tragende Höcker darf man nicht zu stark reduzieren.",
          "On posterior teeth the upper palatal and lower buccal cusps are supporting cusps: they fit into the opposing fossae. The others are guiding cusps. Do not reduce supporting cusps too much.",
          "Te dhëmbët e pasmë kuspidët palatinalë të sipërm dhe bukalë të poshtëm janë mbajtës: hyjnë në gropëzat antagoniste. Të tjerët janë udhëzues. Kuspidët mbajtës nuk duhen reduktuar shumë.",
        ),
      },
      {
        term: t("Curva di Spee e curva di Wilson", "Spee-Kurve und Wilson-Kurve", "Curve of Spee and curve of Wilson", "Lakorja e Spee-së dhe lakorja e Wilson-it"),
        text: t(
          "Curva di Spee: curva antero-posteriore delle cuspidi vista di lato. Curva di Wilson: curva trasversale tra i molari dei due lati. Una protesi deve seguire queste curve.",
          "Spee-Kurve: Kurve der Höcker von vorn nach hinten in der Seitenansicht. Wilson-Kurve: Querkurve zwischen den Molaren beider Seiten. Eine Prothese muss diesen Kurven folgen.",
          "Curve of Spee: the front-to-back curve of the cusps seen from the side. Curve of Wilson: the side-to-side curve between the molars of both sides. A prosthesis must follow these curves.",
          "Lakorja e Spee-së: lakorja e kuspidëve nga para mbrapa, parë anash. Lakorja e Wilson-it: lakorja tërthore ndërmjet molarëve të dy anëve. Një protezë duhet t'i ndjekë këto lakore.",
        ),
      },
      {
        term: t("Guida canina e funzione di gruppo", "Eckzahnführung und Gruppenführung", "Canine guidance and group function", "Udhëzimi kanin dhe funksioni grupor"),
        text: t(
          "Nel movimento laterale i denti posteriori devono separarsi. Con la guida canina tocca solo il canino; con la funzione di gruppo toccano più denti dello stesso lato. Contatti sul lato opposto sono da evitare.",
          "Bei der Seitwärtsbewegung müssen sich die Seitenzähne trennen. Bei Eckzahnführung berührt nur der Eckzahn; bei Gruppenführung berühren mehrere Zähne derselben Seite. Kontakte auf der Gegenseite vermeidet man.",
          "In lateral movement the posterior teeth must separate. With canine guidance only the canine touches; with group function several teeth on the same side touch. Avoid contacts on the opposite side.",
          "Në lëvizjen anësore dhëmbët e pasmë duhet të ndahen. Me udhëzimin kanin prek vetëm kanini; me funksionin grupor prekin disa dhëmbë të së njëjtës anë. Kontaktet në anën e kundërt duhen shmangur.",
        ),
      },
      {
        term: t("Overjet e overbite", "Overjet und Overbite", "Overjet and overbite", "Overjet dhe overbite"),
        text: t(
          "Overjet: distanza orizzontale tra incisivi superiori e inferiori. Overbite: sovrapposizione verticale. Valori normali di circa 2–3 mm ciascuno. Determinano la guida anteriore.",
          "Overjet: horizontaler Abstand zwischen oberen und unteren Schneidezähnen. Overbite: vertikale Überdeckung. Normal sind jeweils etwa 2–3 mm. Sie bestimmen die Frontzahnführung.",
          "Overjet: horizontal distance between upper and lower incisors. Overbite: vertical overlap. Normal values are about 2–3 mm each. They determine anterior guidance.",
          "Overjet: largësia horizontale ndërmjet prerësve të sipërm dhe të poshtëm. Overbite: mbulimi vertikal. Vlerat normale janë rreth 2–3 mm secila. Ato përcaktojnë udhëzimin e përparmë.",
        ),
      },
    ],
  },
  {
    id: "models",
    title: t("Modelli e articolatore", "Modelle und Artikulator", "Models and articulator", "Modelet dhe artikulatori"),
    intro: t(
      "Il laboratorio lavora sulla copia della bocca: il modello. Un modello preciso è la base di ogni lavoro.",
      "Das Labor arbeitet an einer Kopie des Mundes: dem Modell. Ein genaues Modell ist die Grundlage jeder Arbeit.",
      "The laboratory works on a copy of the mouth: the model. An accurate model is the basis of every job.",
      "Laboratori punon mbi një kopje të gojës: modelin. Një model i saktë është baza e çdo pune.",
    ),
    items: [
      {
        term: t("Impronta", "Abformung", "Impression", "Masa (përshtypja)"),
        text: t(
          "Il dentista prende l'impronta (alginato, siliconi, polietere) oppure una scansione intraorale. Il laboratorio disinfetta ogni impronta prima di lavorarla.",
          "Der Zahnarzt nimmt die Abformung (Alginat, Silikone, Polyether) oder einen Intraoralscan. Das Labor desinfiziert jede Abformung vor der Bearbeitung.",
          "The dentist takes the impression (alginate, silicones, polyether) or an intraoral scan. The laboratory disinfects every impression before working on it.",
          "Stomatologu merr masën (alginat, silikone, polieter) ose një skanim intraoral. Laboratori dezinfekton çdo masë para se ta përpunojë.",
        ),
      },
      {
        term: t("Tipi di gesso (ISO 6873)", "Gipsklassen (ISO 6873)", "Gypsum types (ISO 6873)", "Llojet e gipsit (ISO 6873)"),
        text: t(
          "Tipo 1: gesso da impronta. Tipo 2: gesso per modelli. Tipo 3: gesso duro (modelli di studio, protesi mobile). Tipo 4: gesso extraduro a bassa espansione, per monconi di protesi fissa. Tipo 5: extraduro ad alta espansione.",
          "Klasse 1: Abdruckgips. Klasse 2: Alabastergips. Klasse 3: Hartgips (Situationsmodelle, Prothetik). Klasse 4: Superhartgips mit geringer Expansion, für Stümpfe der festsitzenden Prothetik. Klasse 5: Superhartgips mit hoher Expansion.",
          "Type 1: impression plaster. Type 2: model plaster. Type 3: dental stone (study models, removable prostheses). Type 4: high-strength, low-expansion die stone for fixed prosthodontics. Type 5: high-strength, high-expansion stone.",
          "Lloji 1: gips për masë. Lloji 2: gips për modele. Lloji 3: gips i fortë (modele studimi, proteza të lëvizshme). Lloji 4: gips shumë i fortë me zgjerim të ulët, për monconet e protezës fikse. Lloji 5: shumë i fortë me zgjerim të lartë.",
        ),
      },
      {
        term: t("Modello sezionato e monconi", "Sägemodell und Stümpfe", "Sectioned model and dies", "Modeli i seksionuar dhe monconet"),
        text: t(
          "Per corone e ponti si taglia il modello. Ogni dente preparato diventa un moncone estraibile con perno. Il margine della preparazione si rifinisce e si evidenzia.",
          "Für Kronen und Brücken wird das Modell gesägt. Jeder präparierte Zahn wird ein herausnehmbarer Stumpf mit Pin. Die Präparationsgrenze wird freigelegt und markiert.",
          "For crowns and bridges the model is sectioned. Each prepared tooth becomes a removable die with a pin. The preparation margin is trimmed and marked.",
          "Për kurora dhe ura modeli pritet. Çdo dhëmb i preparuar bëhet moncon i lëvizshëm me kunj. Kufiri i preparimit pastrohet dhe shënohet.",
        ),
      },
      {
        term: t("Arco facciale e articolatore", "Gesichtsbogen und Artikulator", "Facebow and articulator", "Harku facial dhe artikulatori"),
        text: t(
          "L'articolatore simula i movimenti della mandibola. Può essere non regolabile, semi-regolabile o totalmente regolabile. L'arco facciale trasferisce la posizione del mascellare rispetto alle articolazioni.",
          "Der Artikulator simuliert die Unterkieferbewegungen. Er kann nicht einstellbar, teiljustierbar oder volljustierbar sein. Der Gesichtsbogen überträgt die Lage des Oberkiefers zu den Kiefergelenken.",
          "The articulator simulates jaw movements. It can be non-adjustable, semi-adjustable or fully adjustable. The facebow transfers the position of the maxilla relative to the jaw joints.",
          "Artikulatori simulon lëvizjet e mandibulës. Mund të jetë i parregullueshëm, gjysmë i rregullueshëm ose plotësisht i rregullueshëm. Harku facial transferon pozicionin e maksilës në raport me nyjet.",
        ),
      },
    ],
  },
  {
    id: "materials",
    title: t("Materiali", "Werkstoffe", "Materials", "Materialet"),
    intro: t(
      "Ogni materiale ha regole di lavorazione precise. Seguire sempre le istruzioni del produttore.",
      "Jeder Werkstoff hat genaue Verarbeitungsregeln. Immer die Herstellerangaben befolgen.",
      "Every material has precise processing rules. Always follow the manufacturer's instructions.",
      "Çdo material ka rregulla të sakta përpunimi. Ndiqni gjithmonë udhëzimet e prodhuesit.",
    ),
    items: [
      {
        term: t("Cere", "Wachse", "Waxes", "Dyllërat"),
        text: t(
          "Cera da modellazione per corone e ponti (si brucia senza residui). Cera per basi e valli di masticazione nella protesi mobile.",
          "Modellierwachs für Kronen und Brücken (verbrennt rückstandsfrei). Basisplattenwachs und Bisswälle für die herausnehmbare Prothetik.",
          "Modelling (inlay) wax for crowns and bridges, which burns out without residue. Baseplate wax and occlusion rims for removable prostheses.",
          "Dyll modelimi për kurora dhe ura (digjet pa mbetje). Dyll baze dhe valë kafshimi për protezat e lëvizshme.",
        ),
      },
      {
        term: t("Rivestimenti", "Einbettmassen", "Investments", "Masat e veshjes"),
        text: t(
          "Servono per la fusione dei metalli e la pressatura della ceramica. A legante gesso per leghe a bassa temperatura; a legante fosfato per leghe ad alta temperatura e ceramica pressata.",
          "Für den Metallguss und das Pressen von Keramik. Gipsgebunden für Legierungen mit niedriger Gießtemperatur; phosphatgebunden für hochschmelzende Legierungen und Presskeramik.",
          "Used for metal casting and pressing ceramics. Gypsum-bonded for low-melting alloys; phosphate-bonded for high-melting alloys and pressed ceramics.",
          "Përdoren për derdhjen e metaleve dhe presimin e qeramikës. Me lidhës gipsi për lidhje me temperaturë të ulët; me lidhës fosfati për lidhje me temperaturë të lartë dhe qeramikë të presuar.",
        ),
      },
      {
        term: t("Leghe", "Legierungen", "Alloys", "Lidhjet metalike"),
        text: t(
          "Leghe nobili (oro, palladio) e leghe non nobili (cromo-cobalto, nichel-cromo), oltre al titanio. Il cromo-cobalto si usa molto per scheletrati e strutture metallo-ceramiche.",
          "Edelmetalllegierungen (Gold, Palladium) und Nichtedelmetalllegierungen (Kobalt-Chrom, Nickel-Chrom) sowie Titan. Kobalt-Chrom ist häufig für Modellguss und Metallkeramikgerüste.",
          "Noble alloys (gold, palladium) and base-metal alloys (cobalt-chromium, nickel-chromium), plus titanium. Cobalt-chromium is widely used for partial-denture frameworks and metal-ceramic frameworks.",
          "Lidhje fisnike (ar, paladium) dhe lidhje jofisnike (kobalt-krom, nikel-krom), si dhe titani. Kobalt-kromi përdoret shumë për skeletet e protezave të pjesshme dhe strukturat metal-qeramike.",
        ),
      },
      {
        term: t("Ceramiche", "Keramiken", "Ceramics", "Qeramikat"),
        text: t(
          "Feldspatica: molto estetica, per stratificazione e faccette. Disilicato di litio: buon equilibrio tra estetica e resistenza. Zirconia: molto resistente, per strutture e corone monolitiche.",
          "Feldspatkeramik: sehr ästhetisch, zum Schichten und für Veneers. Lithiumdisilikat: gute Balance aus Ästhetik und Festigkeit. Zirkonoxid: sehr fest, für Gerüste und monolithische Kronen.",
          "Feldspathic: very aesthetic, for layering and veneers. Lithium disilicate: a good balance of aesthetics and strength. Zirconia: very strong, for frameworks and monolithic crowns.",
          "Feldspatike: shumë estetike, për shtresëzim dhe faseta. Disilikat litiumi: ekuilibër i mirë ndërmjet estetikës dhe fortësisë. Zirkoni: shumë i fortë, për struktura dhe kurora monolitike.",
        ),
      },
      {
        term: t("Resine", "Kunststoffe", "Resins", "Rrëshirat"),
        text: t(
          "PMMA per basi di protesi mobili e provvisori. Compositi per faccette e ricostruzioni. Resine per stampa 3D per modelli, guide e provvisori.",
          "PMMA für Prothesenbasen und Provisorien. Komposite für Verblendungen und Rekonstruktionen. 3D-Druck-Harze für Modelle, Schablonen und Provisorien.",
          "PMMA for denture bases and temporaries. Composites for veneering and restorations. 3D-printing resins for models, guides and temporaries.",
          "PMMA për bazat e protezave dhe për protezat e përkohshme. Kompozitet për veshje dhe rindërtime. Rrëshira për printim 3D për modele, udhëzues dhe të përkohshme.",
        ),
      },
    ],
  },
  {
    id: "prosthetics",
    title: t("Tipi di protesi", "Prothesenarten", "Types of prosthesis", "Llojet e protezave"),
    intro: t(
      "Il laboratorio realizza dispositivi su misura per un solo paziente, su prescrizione del dentista.",
      "Das Labor fertigt Sonderanfertigungen für einen einzelnen Patienten nach Verordnung des Zahnarztes.",
      "The laboratory makes custom-made devices for one patient, on the dentist's prescription.",
      "Laboratori prodhon pajisje me porosi për një pacient të vetëm, me recetën e stomatologut.",
    ),
    items: [
      {
        term: t("Protesi fissa", "Festsitzender Zahnersatz", "Fixed prosthesis", "Proteza fikse"),
        text: t(
          "Corone, ponti, intarsi (inlay, onlay) e faccette. Un ponte ha pilastri (i denti preparati) ed elementi intermedi che sostituiscono i denti mancanti.",
          "Kronen, Brücken, Inlays, Onlays und Veneers. Eine Brücke hat Pfeiler (die präparierten Zähne) und Zwischenglieder, die fehlende Zähne ersetzen.",
          "Crowns, bridges, inlays, onlays and veneers. A bridge has abutments (the prepared teeth) and pontics that replace missing teeth.",
          "Kurora, ura, inlay, onlay dhe faseta. Një urë ka shtylla (dhëmbët e preparuar) dhe elemente të ndërmjetme që zëvendësojnë dhëmbët që mungojnë.",
        ),
      },
      {
        term: t("Protesi mobile", "Herausnehmbarer Zahnersatz", "Removable prosthesis", "Proteza e lëvizshme"),
        text: t(
          "Protesi totale quando mancano tutti i denti di un'arcata. Protesi parziale in resina o scheletrata in metallo, con ganci o attacchi sui denti rimasti.",
          "Totalprothese, wenn alle Zähne eines Kiefers fehlen. Teilprothese aus Kunststoff oder als Modellgussprothese mit Klammern oder Geschieben an den Restzähnen.",
          "A complete denture when all teeth in an arch are missing. A partial denture in resin or with a cast metal framework, retained by clasps or attachments on the remaining teeth.",
          "Proteza totale kur mungojnë të gjithë dhëmbët e një harku. Proteza e pjesshme prej rrëshire ose me skelet metalik, me kapëse ose bashkues te dhëmbët e mbetur.",
        ),
      },
      {
        term: t("Protesi su impianti", "Implantatprothetik", "Implant prosthesis", "Proteza mbi implante"),
        text: t(
          "Corone e ponti su impianti, cementati o avvitati sull'abutment. Esistono anche protesi mobili ancorate a impianti (overdenture).",
          "Kronen und Brücken auf Implantaten, auf dem Abutment zementiert oder verschraubt. Es gibt auch herausnehmbare, implantatgetragene Prothesen (Overdentures).",
          "Crowns and bridges on implants, cemented or screw-retained on the abutment. There are also removable implant-retained dentures (overdentures).",
          "Kurora dhe ura mbi implante, të çimentuara ose të vidhosura mbi abutment. Ka edhe proteza të lëvizshme të mbajtura nga implante (overdenture).",
        ),
      },
      {
        term: t("Ortodonzia e bite", "Kieferorthopädie und Schienen", "Orthodontics and splints", "Ortodonci dhe bite"),
        text: t(
          "Apparecchi ortodontici rimovibili, mantenitori di spazio, bite e paradenti. Anche questi sono dispositivi su misura.",
          "Herausnehmbare kieferorthopädische Geräte, Lückenhalter, Aufbissschienen und Sportmundschutz. Auch diese sind Sonderanfertigungen.",
          "Removable orthodontic appliances, space maintainers, occlusal splints and mouthguards. These are custom-made devices too.",
          "Aparate ortodontike të lëvizshme, ruajtës hapësire, bite dhe mbrojtëse goje. Edhe këto janë pajisje me porosi.",
        ),
      },
    ],
  },
  {
    id: "cadcam",
    title: t("CAD/CAM e digitale", "CAD/CAM und digitaler Workflow", "CAD/CAM and digital workflow", "CAD/CAM dhe puna dixhitale"),
    intro: t(
      "Oggi molti lavori nascono al computer. Il flusso digitale sostituisce o integra quello tradizionale.",
      "Viele Arbeiten entstehen heute am Computer. Der digitale Workflow ersetzt oder ergänzt den analogen.",
      "Today many jobs start on a computer. The digital workflow replaces or complements the traditional one.",
      "Sot shumë punë fillojnë në kompjuter. Puna dixhitale zëvendëson ose plotëson atë tradicionale.",
    ),
    items: [
      {
        term: t("Scansione", "Scan", "Scanning", "Skanimi"),
        text: t(
          "Scansione intraorale dal dentista o scansione del modello con lo scanner da laboratorio. Il risultato è un file 3D, spesso in formato STL.",
          "Intraoralscan beim Zahnarzt oder Modellscan mit dem Laborscanner. Ergebnis ist eine 3D-Datei, oft im STL-Format.",
          "Intraoral scan at the dentist or model scan with the lab scanner. The result is a 3D file, often in STL format.",
          "Skanim intraoral te stomatologu ose skanim i modelit me skanerin e laboratorit. Rezultati është një skedar 3D, shpesh në formatin STL.",
        ),
      },
      {
        term: t("Progettazione (CAD)", "Konstruktion (CAD)", "Design (CAD)", "Projektimi (CAD)"),
        text: t(
          "Nel software si definisce il margine, lo spessore minimo del materiale, i contatti e la forma anatomica. La conoscenza della morfologia resta indispensabile.",
          "In der Software legt man Präparationsgrenze, Mindeststärke des Materials, Kontakte und anatomische Form fest. Morphologie-Wissen bleibt unverzichtbar.",
          "In the software you define the margin, the minimum material thickness, the contacts and the anatomical shape. Knowledge of morphology remains essential.",
          "Në softuer përcaktohen kufiri, trashësia minimale e materialit, kontaktet dhe forma anatomike. Njohja e morfologjisë mbetet e domosdoshme.",
        ),
      },
      {
        term: t("Produzione (CAM)", "Fertigung (CAM)", "Manufacturing (CAM)", "Prodhimi (CAM)"),
        text: t(
          "Fresatura (sottrattiva) da blocchi o dischi, oppure stampa 3D (additiva). La zirconia si fresa prima della sinterizzazione: in forno si ritira di circa il 20–25 %, quindi si fresa più grande.",
          "Fräsen (subtraktiv) aus Blöcken oder Ronden oder 3D-Druck (additiv). Zirkonoxid wird vor dem Sintern gefräst: Es schrumpft im Ofen um etwa 20–25 %, daher fräst man es vergrößert.",
          "Milling (subtractive) from blocks or discs, or 3D printing (additive). Zirconia is milled before sintering: it shrinks by about 20–25 % in the furnace, so it is milled oversized.",
          "Frezim (zbritës) nga blloqe ose disqe, ose printim 3D (shtues). Zirkoni frezohet para sinterizimit: në furrë tkurret rreth 20–25 %, prandaj frezohet më i madh.",
        ),
      },
    ],
  },
  {
    id: "shade",
    title: t("Colore ed estetica", "Farbe und Ästhetik", "Shade and aesthetics", "Ngjyra dhe estetika"),
    intro: t(
      "Un dente naturale non ha un solo colore. Il tecnico deve riprodurre colore, traslucenza e superficie.",
      "Ein natürlicher Zahn hat nicht nur eine Farbe. Der Techniker muss Farbe, Transluzenz und Oberfläche nachbilden.",
      "A natural tooth does not have a single colour. The technician must reproduce colour, translucency and surface texture.",
      "Një dhëmb natyral nuk ka vetëm një ngjyrë. Tekniku duhet të riprodhojë ngjyrën, tejdukshmërinë dhe sipërfaqen.",
    ),
    items: [
      {
        term: t("Tinta, saturazione, luminosità", "Farbton, Sättigung, Helligkeit", "Hue, chroma, value", "Toni, ngopja, ndriçimi"),
        text: t(
          "La tinta è il colore di base, la saturazione è l'intensità, la luminosità indica quanto è chiaro o scuro. La luminosità è l'errore più visibile.",
          "Farbton ist die Grundfarbe, Sättigung die Intensität, Helligkeit zeigt, wie hell oder dunkel der Zahn ist. Fehler in der Helligkeit fallen am stärksten auf.",
          "Hue is the basic colour, chroma is its intensity, value is how light or dark the tooth is. Errors in value are the most visible.",
          "Toni është ngjyra bazë, ngopja është intensiteti, ndriçimi tregon sa i çelët ose i errët është dhëmbi. Gabimet në ndriçim duken më shumë.",
        ),
      },
      {
        term: t("Scale colore", "Farbskalen", "Shade guides", "Shkallët e ngjyrave"),
        text: t(
          "Le scale più usate sono la VITA classical (A1–D4) e la VITA 3D-Master. Il colore si sceglie con luce diurna o una lampada a luce neutra, in pochi secondi, per non affaticare l'occhio.",
          "Die üblichsten Skalen sind VITA classical (A1–D4) und VITA 3D-Master. Die Farbe bestimmt man bei Tageslicht oder unter Normlicht, in wenigen Sekunden, damit das Auge nicht ermüdet.",
          "The most used guides are VITA classical (A1–D4) and VITA 3D-Master. Choose the shade in daylight or under a neutral daylight lamp, in a few seconds, so the eye does not tire.",
          "Shkallët më të përdorura janë VITA classical (A1–D4) dhe VITA 3D-Master. Ngjyra zgjidhet në dritë dite ose me llambë neutrale, brenda pak sekondave, që syri të mos lodhet.",
        ),
      },
      {
        term: t("Stratificazione", "Schichttechnik", "Layering", "Shtresëzimi"),
        text: t(
          "La ceramica si applica a strati: opaco sulla struttura, dentina, smalto e masse incisali traslucide. Così si imita la struttura del dente naturale.",
          "Keramik wird in Schichten aufgetragen: Opaker auf dem Gerüst, Dentin, Schmelz und transluzente Inzisalmassen. So imitiert man den Aufbau des natürlichen Zahns.",
          "Ceramic is applied in layers: opaque on the framework, dentine, enamel and translucent incisal materials. This imitates the structure of the natural tooth.",
          "Qeramika vendoset me shtresa: opaker mbi strukturë, dentinë, smalt dhe masa incizale të tejdukshme. Kështu imitohet struktura e dhëmbit natyral.",
        ),
      },
    ],
  },
  {
    id: "safety",
    title: t("Sicurezza e norme", "Arbeitsschutz und Vorschriften", "Safety and regulations", "Siguria dhe rregullat"),
    intro: t(
      "Il laboratorio usa polveri, fiamme, forni e prodotti chimici. Le regole proteggono il tecnico e il paziente. Le norme nazionali possono essere diverse: controllale sempre.",
      "Im Labor gibt es Stäube, Flammen, Öfen und Chemikalien. Die Regeln schützen Techniker und Patient. Nationale Vorschriften können abweichen: immer prüfen.",
      "The laboratory uses dust, flames, furnaces and chemicals. Rules protect both the technician and the patient. National rules can differ: always check them.",
      "Laboratori përdor pluhura, flakë, furra dhe kimikate. Rregullat mbrojnë teknikun dhe pacientin. Rregullat kombëtare mund të ndryshojnë: kontrollojini gjithmonë.",
    ),
    items: [
      {
        term: t("Polveri e aspirazione", "Staub und Absaugung", "Dust and extraction", "Pluhuri dhe thithja"),
        text: t(
          "Rivestimenti e materiali da sabbiatura possono contenere silice: la polvere fine è dannosa per i polmoni. Usare aspirazione al banco, mascherina adatta e occhiali.",
          "Einbettmassen und Strahlmittel können Quarz enthalten: Feinstaub schädigt die Lunge. Arbeitsplatzabsaugung, geeignete Atemschutzmaske und Schutzbrille benutzen.",
          "Investments and blasting media can contain silica: fine dust harms the lungs. Use bench extraction, a suitable respirator mask and eye protection.",
          "Masat e veshjes dhe materialet e rërëpastrimit mund të përmbajnë silicë: pluhuri i imët dëmton mushkëritë. Përdorni thithje në tavolinë, maskë të përshtatshme dhe syze.",
        ),
      },
      {
        term: t("Igiene", "Hygiene", "Hygiene", "Higjiena"),
        text: t(
          "Impronte, modelli e protesi che arrivano dallo studio possono essere contaminati. Disinfettarli all'arrivo e prima della consegna.",
          "Abformungen, Modelle und Prothesen aus der Praxis können kontaminiert sein. Beim Eingang und vor der Auslieferung desinfizieren.",
          "Impressions, models and prostheses coming from the practice may be contaminated. Disinfect them on arrival and before delivery.",
          "Masat, modelet dhe protezat që vijnë nga klinika mund të jenë të ndotura. Dezinfektojini kur mbërrijnë dhe para dorëzimit.",
        ),
      },
      {
        term: t("Dispositivi su misura (UE)", "Sonderanfertigungen (EU)", "Custom-made devices (EU)", "Pajisjet me porosi (BE)"),
        text: t(
          "Nell'Unione Europea le protesi dentali sono dispositivi medici su misura secondo il regolamento (UE) 2017/745 (MDR). Il laboratorio deve documentare il lavoro, i materiali usati e consegnare una dichiarazione per ogni dispositivo.",
          "In der EU sind Zahnersatz und Schienen Sonderanfertigungen nach der Verordnung (EU) 2017/745 (MDR). Das Labor muss die Arbeit und die verwendeten Materialien dokumentieren und für jedes Produkt eine Erklärung ausstellen.",
          "In the EU, dental prostheses are custom-made medical devices under Regulation (EU) 2017/745 (MDR). The laboratory must document the work and the materials used, and issue a statement for each device.",
          "Në Bashkimin Evropian protezat dentare janë pajisje mjekësore me porosi sipas Rregullores (BE) 2017/745 (MDR). Laboratori duhet të dokumentojë punën dhe materialet e përdorura dhe të lëshojë një deklaratë për çdo pajisje.",
        ),
      },
    ],
  },
];

/** Steps for a layered metal-ceramic crown, in the correct order (for the ordering exercise). */
export const CROWN_WORKFLOW: L[] = [
  t("Ricevere prescrizione e impronta, disinfettare", "Auftrag und Abformung annehmen, desinfizieren", "Receive the prescription and impression, disinfect", "Merr recetën dhe masën, dezinfektoji"),
  t("Colare il modello in gesso tipo 4", "Modell aus Gips Klasse 4 herstellen", "Pour the model in type 4 die stone", "Derdh modelin me gips të llojit 4"),
  t("Sezionare il modello e preparare il moncone", "Modell sägen und Stumpf vorbereiten", "Section the model and prepare the die", "Seksiono modelin dhe përgatit monconin"),
  t("Montare i modelli in articolatore", "Modelle in den Artikulator montieren", "Mount the models in the articulator", "Monto modelet në artikulator"),
  t("Modellare la struttura in cera (o progettarla al CAD)", "Gerüst in Wachs modellieren (oder im CAD konstruieren)", "Wax up the framework (or design it in CAD)", "Modelo strukturën me dyll (ose projektoje në CAD)"),
  t("Mettere in rivestimento e fondere (o fresare)", "Einbetten und gießen (oder fräsen)", "Invest and cast (or mill)", "Vish dhe derdh (ose frezo)"),
  t("Rifinire la struttura e provarla sul moncone", "Gerüst ausarbeiten und auf dem Stumpf anpassen", "Finish the framework and fit it on the die", "Përpuno strukturën dhe provoje mbi moncon"),
  t("Stratificare e cuocere la ceramica", "Keramik schichten und brennen", "Layer and fire the ceramic", "Shtreso dhe piq qeramikën"),
  t("Controllare contatti e occlusione, glasare", "Kontakte und Okklusion prüfen, glasieren", "Check contacts and occlusion, glaze", "Kontrollo kontaktet dhe okluzionin, glazuro"),
  t("Disinfettare, documentare e consegnare", "Desinfizieren, dokumentieren und ausliefern", "Disinfect, document and deliver", "Dezinfekto, dokumento dhe dorëzo"),
];

export interface LabQuizItem {
  q: L;
  options: L[];
  correct: number;
  why: L;
}

export const LAB_QUIZ: LabQuizItem[] = [
  {
    q: t("Quale gesso si usa per i monconi di una corona?", "Welcher Gips wird für die Stümpfe einer Krone verwendet?", "Which gypsum is used for crown dies?", "Cili gips përdoret për monconet e një kurore?"),
    options: [t("Tipo 2", "Klasse 2", "Type 2", "Lloji 2"), t("Tipo 4", "Klasse 4", "Type 4", "Lloji 4"), t("Tipo 1", "Klasse 1", "Type 1", "Lloji 1")],
    correct: 1,
    why: t("Il tipo 4 è extraduro e ha bassa espansione: il moncone resta preciso.", "Klasse 4 ist superhart und expandiert wenig: der Stumpf bleibt genau.", "Type 4 is very hard and has low expansion, so the die stays accurate.", "Lloji 4 është shumë i fortë dhe zgjerohet pak, kështu monconi mbetet i saktë."),
  },
  {
    q: t("Quali cuspidi sono di sostegno nei molari inferiori?", "Welche Höcker sind bei unteren Molaren tragend?", "Which cusps are supporting cusps on lower molars?", "Cilët kuspidë janë mbajtës te molarët e poshtëm?"),
    options: [t("Le vestibolari", "Die bukkalen", "The buccal cusps", "Kuspidët bukalë"), t("Le linguali", "Die lingualen", "The lingual cusps", "Kuspidët lingualë"), t("Nessuna", "Keine", "None", "Asnjë")],
    correct: 0,
    why: t("In basso sono di sostegno le vestibolari, in alto le palatali.", "Unten sind die bukkalen tragend, oben die palatinalen.", "Below, the buccal cusps support; above, the palatal cusps.", "Poshtë mbajnë kuspidët bukalë, sipër ata palatinalë."),
  },
  {
    q: t("Perché la zirconia si fresa più grande?", "Warum wird Zirkonoxid vergrößert gefräst?", "Why is zirconia milled oversized?", "Pse zirkoni frezohet më i madh?"),
    options: [
      t("Perché si ritira durante la sinterizzazione", "Weil es beim Sintern schrumpft", "Because it shrinks during sintering", "Sepse tkurret gjatë sinterizimit"),
      t("Per lasciare spazio al cemento", "Um Platz für den Zement zu lassen", "To leave space for the cement", "Për të lënë vend për çimenton"),
      t("Perché si consuma in bocca", "Weil es sich im Mund abnutzt", "Because it wears in the mouth", "Sepse konsumohet në gojë"),
    ],
    correct: 0,
    why: t("Nel forno di sinterizzazione la zirconia si ritira di circa il 20–25 %.", "Im Sinterofen schrumpft Zirkonoxid um etwa 20–25 %.", "In the sintering furnace zirconia shrinks by about 20–25 %.", "Në furrën e sinterizimit zirkoni tkurret rreth 20–25 %."),
  },
  {
    q: t("Quale errore di colore si nota di più?", "Welcher Farbfehler fällt am meisten auf?", "Which shade error is the most visible?", "Cili gabim ngjyre duket më shumë?"),
    options: [t("Tinta", "Farbton", "Hue", "Toni"), t("Luminosità", "Helligkeit", "Value", "Ndriçimi"), t("Saturazione", "Sättigung", "Chroma", "Ngopja")],
    correct: 1,
    why: t("Un dente troppo chiaro o troppo scuro si vede subito, anche da lontano.", "Ein zu heller oder zu dunkler Zahn fällt sofort auf, auch aus der Distanz.", "A tooth that is too light or too dark is seen at once, even from a distance.", "Një dhëmb shumë i çelët ose shumë i errët duket menjëherë, edhe nga larg."),
  },
  {
    q: t("Nel movimento laterale con guida canina...", "Bei der Seitwärtsbewegung mit Eckzahnführung...", "In lateral movement with canine guidance...", "Në lëvizjen anësore me udhëzim kanin..."),
    options: [
      t("tutti i denti posteriori restano in contatto", "bleiben alle Seitenzähne in Kontakt", "all posterior teeth stay in contact", "të gjithë dhëmbët e pasmë mbeten në kontakt"),
      t("toccano solo i canini del lato di lavoro", "berühren sich nur die Eckzähne der Arbeitsseite", "only the working-side canines touch", "prekin vetëm kaninët e anës së punës"),
      t("toccano i molari del lato opposto", "berühren sich die Molaren der Gegenseite", "the molars on the opposite side touch", "prekin molarët e anës së kundërt"),
    ],
    correct: 1,
    why: t("I canini guidano il movimento e separano i denti posteriori.", "Die Eckzähne führen die Bewegung und trennen die Seitenzähne.", "The canines guide the movement and separate the posterior teeth.", "Kaninët udhëheqin lëvizjen dhe ndajnë dhëmbët e pasmë."),
  },
  {
    q: t("Perché si usa l'aspirazione al banco?", "Warum benutzt man die Arbeitsplatzabsaugung?", "Why is bench extraction used?", "Pse përdoret thithja në tavolinë?"),
    options: [
      t("Per proteggere i polmoni dalle polveri", "Um die Lunge vor Staub zu schützen", "To protect the lungs from dust", "Për të mbrojtur mushkëritë nga pluhuri"),
      t("Per raffreddare il pezzo", "Um das Werkstück zu kühlen", "To cool the workpiece", "Për të ftohur punimin"),
      t("Per asciugare il gesso", "Um den Gips zu trocknen", "To dry the gypsum", "Për të tharë gipsin"),
    ],
    correct: 0,
    why: t("Le polveri fini, specialmente con silice, danneggiano i polmoni.", "Feinstaub, vor allem mit Quarz, schädigt die Lunge.", "Fine dust, especially with silica, damages the lungs.", "Pluhuri i imët, sidomos me silicë, dëmton mushkëritë."),
  },
];
