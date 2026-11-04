import type { Lang } from "./teeth";
import { BASE } from "./i18n.base";
import { V2 } from "./i18n.v2";
import { EN } from "./i18n.en";
import { SQ } from "./i18n.sq";

/**
 * Keys added for the four-language version, plus corrections of Italian/German
 * texts that previously described the app as IT/DE only or did not match the code.
 */
const EXTRA = {
  it: {
    "app.tagline": "Anatomia dentale in 3D — IT / DE / EN / SQ",
    "home.subtitle": "32 denti permanenti, notazione FDI, in italiano, tedesco, inglese e albanese.",
    "home.know.badge": "Inizia qui",
    "home.know.text": "Prima di imparare a riconoscere i denti, scopri come sono fatti, quali tessuti li compongono e perché hanno forme diverse.",
    "home.know.cta": "Inizia dalle basi",
    "lang.en": "English",
    "lang.sq": "Shqip",
    "vocab.title": "Vocabolario IT–DE–EN–SQ",
    "vocab.subtitle": "Terminologia odontoiatrica essenziale in quattro lingue.",
    "settings.terms": "Mostra i termini anche in una seconda lingua",
    "settings.secondLang": "Seconda lingua",
    "settings.translationNote": "Le traduzioni in inglese e albanese sono nuove: segnala eventuali errori di terminologia.",
    "quiz.firstTryNote": "Risposte corrette al primo tentativo senza aiuti; non certifica competenza clinica.",
    "chart.clinicalView": "Vista clinica (vista dell'odontoiatra)",
    "chart.aria": "Schema dentale in vista clinica",
    "chart.sideNote": "La destra del paziente è a sinistra dello schermo.",
    "exam.timeUpText": "Il tempo è terminato. Riprova con un ripasso mirato.",
    "path.l2.req": "Studia 4 denti e rispondi correttamente a 5 domande.",
    "path.l5.req": "Rispondi correttamente a 12 domande.",
    "path.l7.req": "Completa 2 sessioni di quiz.",
    "path.l8.desc": "Terminologia applicata in quattro lingue.",
    "path.l9.req": "Completa 4 sessioni con almeno 60 risposte corrette.",
    "nav.lab": "Laboratorio",
    "study.measurements": "Misure medie",
    "lab.title": "Laboratorio odontotecnico",
    "lab.subtitle": "Le basi per chi vuole diventare odontotecnico: occlusione, modelli, materiali, protesi, CAD/CAM, colore e sicurezza.",
    "lab.workflow.title": "Esercizio: le fasi di una corona",
    "lab.workflow.text": "Tocca le fasi nell'ordine giusto per realizzare una corona in metallo-ceramica.",
    "lab.workflow.done": "Sequenza completata. Errori: {errors}.",
    "lab.workflow.errors": "Errori: {errors}",
    "lab.quiz.title": "Quiz di laboratorio",
    "lab.disclaimer": "Contenuti generali di studio. Programmi di formazione, prodotti e norme cambiano da Paese a Paese.",
  },
  de: {
    "app.tagline": "Zahnanatomie in 3D — IT / DE / EN / SQ",
    "home.subtitle": "32 bleibende Zähne, FDI-Schema, auf Italienisch, Deutsch, Englisch und Albanisch.",
    "home.know.badge": "Hier starten",
    "home.know.text": "Bevor du Zähne erkennen lernst, entdecke ihren Aufbau, ihre Gewebe und warum sie unterschiedliche Formen haben.",
    "home.know.cta": "Mit den Grundlagen beginnen",
    "lang.en": "English",
    "lang.sq": "Shqip",
    "vocab.title": "Vokabular IT–DE–EN–SQ",
    "vocab.subtitle": "Wichtige zahnmedizinische Fachbegriffe in vier Sprachen.",
    "settings.terms": "Fachbegriffe zusätzlich in einer zweiten Sprache anzeigen",
    "settings.secondLang": "Zweite Sprache",
    "settings.translationNote": "Die englische und albanische Übersetzung ist neu: Bitte melde Fehler in der Fachterminologie.",
    "quiz.firstTryNote": "Beim ersten Versuch ohne Hilfe richtig; kein klinischer Kompetenznachweis.",
    "chart.clinicalView": "Zahnärztliche Ansicht",
    "chart.aria": "Zahnschema in zahnärztlicher Ansicht",
    "chart.sideNote": "Die rechte Patientenseite liegt links auf dem Bildschirm.",
    "exam.timeUpText": "Die Zeit ist abgelaufen. Versuche es nach gezielter Wiederholung erneut.",
    "path.l2.req": "Lerne 4 Zähne und beantworte 5 Fragen richtig.",
    "path.l5.req": "Beantworte 12 Fragen richtig.",
    "path.l7.req": "Schließe 2 Quiz-Runden ab.",
    "path.l8.desc": "Angewandte Terminologie in vier Sprachen.",
    "path.l9.req": "Schließe 4 Runden mit mindestens 60 richtigen Antworten ab.",
    "nav.lab": "Labor",
    "study.measurements": "Durchschnittsmaße",
    "lab.title": "Zahntechnisches Labor",
    "lab.subtitle": "Grundlagen für angehende Zahntechniker: Okklusion, Modelle, Werkstoffe, Zahnersatz, CAD/CAM, Farbe und Arbeitsschutz.",
    "lab.workflow.title": "Übung: Arbeitsschritte einer Krone",
    "lab.workflow.text": "Tippe die Arbeitsschritte für eine metallkeramische Krone in der richtigen Reihenfolge an.",
    "lab.workflow.done": "Reihenfolge abgeschlossen. Fehler: {errors}.",
    "lab.workflow.errors": "Fehler: {errors}",
    "lab.quiz.title": "Labor-Quiz",
    "lab.disclaimer": "Allgemeine Lerninhalte. Ausbildung, Produkte und Vorschriften unterscheiden sich von Land zu Land.",
  },
} satisfies Record<"it" | "de", Record<string, string>>;

export const DICTS: Record<Lang, Record<string, string>> = {
  it: { ...BASE.it, ...V2.it, ...EXTRA.it },
  de: { ...BASE.de, ...V2.de, ...EXTRA.de },
  en: EN,
  sq: SQ,
};

export type ExtraKey = keyof (typeof EXTRA)["it"];
