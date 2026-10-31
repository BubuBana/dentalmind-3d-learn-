import type { Lang } from "./teeth";

export type VocabCategory = "anatomy" | "surfaces" | "clinic" | "materials";

export interface VocabEntry extends Record<Lang, string> {
  id: string;
  category: VocabCategory;
}

export const VOCABULARY: VocabEntry[] = [
  { id: "tooth", it: "dente", de: "der Zahn", en: "tooth", sq: "dhëmb", category: "anatomy" },
  { id: "crown", it: "corona", de: "die Krone", en: "crown", sq: "kurorë", category: "anatomy" },
  { id: "root", it: "radice", de: "die Wurzel", en: "root", sq: "rrënjë", category: "anatomy" },
  { id: "enamel", it: "smalto", de: "der Schmelz", en: "enamel", sq: "smalt", category: "anatomy" },
  { id: "dentin", it: "dentina", de: "das Dentin", en: "dentin", sq: "dentinë", category: "anatomy" },
  { id: "pulp", it: "polpa", de: "die Pulpa", en: "pulp", sq: "pulpë", category: "anatomy" },
  { id: "cementum", it: "cemento", de: "das Zement / der Zement", en: "cementum", sq: "cement", category: "anatomy" },
  { id: "cusp", it: "cuspide", de: "der Höcker", en: "cusp", sq: "kuspid", category: "anatomy" },
  { id: "fissure", it: "fessura", de: "die Fissur", en: "fissure", sq: "fisurë", category: "anatomy" },
  { id: "groove", it: "solco", de: "die Furche", en: "groove", sq: "brazdë", category: "anatomy" },
  { id: "fossa", it: "fossa", de: "die Grube", en: "fossa", sq: "gropëz", category: "anatomy" },
  { id: "cingulum", it: "cingolo", de: "das Zingulum", en: "cingulum", sq: "cingulum", category: "anatomy" },
  { id: "apex", it: "apice", de: "die Wurzelspitze", en: "apex", sq: "majë e rrënjës / apeks", category: "anatomy" },
  { id: "furcation", it: "forcazione", de: "die Furkation", en: "furcation", sq: "furkacion", category: "anatomy" },
  { id: "canal", it: "canale radicolare", de: "der Wurzelkanal", en: "root canal", sq: "kanal rrënjor", category: "anatomy" },
  { id: "neck", it: "colletto", de: "der Zahnhals", en: "cervix (tooth neck)", sq: "qafa e dhëmbit", category: "anatomy" },
  { id: "incisalEdge", it: "margine incisale", de: "die Inzisalkante", en: "incisal edge", sq: "buzë incizale", category: "anatomy" },
  { id: "gingiva", it: "gengiva", de: "das Zahnfleisch", en: "gingiva (gum)", sq: "gingivë / mishi i dhëmbëve", category: "anatomy" },
  { id: "periodontium", it: "parodonto", de: "das Parodont", en: "periodontium", sq: "parodont", category: "anatomy" },
  { id: "alveolus", it: "alveolo", de: "die Alveole", en: "alveolus (tooth socket)", sq: "alveol", category: "anatomy" },
  { id: "jawUpper", it: "mascella", de: "der Oberkiefer", en: "maxilla (upper jaw)", sq: "nofulla e sipërme (maksila)", category: "anatomy" },
  { id: "jawLower", it: "mandibola", de: "der Unterkiefer", en: "mandible (lower jaw)", sq: "nofulla e poshtme (mandibula)", category: "anatomy" },

  { id: "buccal", it: "buccale — verso la guancia", de: "bukkal — zur Wange", en: "buccal — towards the cheek", sq: "bukal — nga faqja", category: "surfaces" },
  { id: "vestibular", it: "vestibolare — verso labbra o guance", de: "vestibulär — zu Lippen oder Wangen", en: "vestibular (facial) — towards lips or cheeks", sq: "vestibular — nga buzët ose faqet", category: "surfaces" },
  { id: "labial", it: "labiale — verso le labbra", de: "labial — zu den Lippen", en: "labial — towards the lips", sq: "labial — nga buzët", category: "surfaces" },
  { id: "palatal", it: "palatale", de: "palatinal", en: "palatal", sq: "palatinal", category: "surfaces" },
  { id: "lingual", it: "linguale", de: "lingual", en: "lingual", sq: "lingual", category: "surfaces" },
  { id: "mesial", it: "mesiale", de: "mesial", en: "mesial", sq: "mezial", category: "surfaces" },
  { id: "distal", it: "distale", de: "distal", en: "distal", sq: "distal", category: "surfaces" },
  { id: "occlusal", it: "occlusale", de: "okklusal", en: "occlusal", sq: "okluzal", category: "surfaces" },
  { id: "apical", it: "apicale", de: "apikal", en: "apical", sq: "apikal", category: "surfaces" },
  { id: "coronal", it: "coronale", de: "koronal", en: "coronal", sq: "koronal", category: "surfaces" },
  { id: "proximal", it: "prossimale", de: "approximal", en: "proximal", sq: "proksimal", category: "surfaces" },

  { id: "caries", it: "carie", de: "die Karies", en: "caries (tooth decay)", sq: "karies", category: "clinic" },
  { id: "plaque", it: "placca", de: "der Zahnbelag / die Plaque", en: "dental plaque", sq: "pllakë dentare", category: "clinic" },
  { id: "calculus", it: "tartaro", de: "der Zahnstein", en: "calculus (tartar)", sq: "gurëza", category: "clinic" },
  { id: "extraction", it: "estrazione", de: "die Extraktion", en: "extraction", sq: "nxjerrje", category: "clinic" },
  { id: "filling", it: "otturazione", de: "die Füllung", en: "filling", sq: "mbushje", category: "clinic" },
  { id: "anesthesia", it: "anestesia", de: "die Anästhesie", en: "anaesthesia", sq: "anestezi", category: "clinic" },
  { id: "impaction", it: "inclusione dentale", de: "die Zahnretention", en: "impaction", sq: "inkluzion dentar", category: "clinic" },
  { id: "agenesis", it: "agenesia", de: "die Nichtanlage", en: "agenesis (congenitally missing tooth)", sq: "agjenezi", category: "clinic" },
  { id: "occlusion", it: "occlusione", de: "die Okklusion", en: "occlusion", sq: "okluzion", category: "clinic" },
  { id: "eruption", it: "eruzione", de: "der Zahndurchbruch", en: "eruption", sq: "shpërthim", category: "clinic" },
  { id: "abrasion", it: "abrasione", de: "die Abrasion", en: "abrasion", sq: "abrazion", category: "clinic" },
  { id: "bruxism", it: "bruxismo", de: "der Bruxismus", en: "bruxism", sq: "bruksizëm", category: "clinic" },
  { id: "xray", it: "radiografia", de: "das Röntgenbild", en: "radiograph (X-ray)", sq: "radiografi", category: "clinic" },
  { id: "prophylaxis", it: "igiene professionale", de: "die Prophylaxe", en: "professional cleaning (prophylaxis)", sq: "higjienë profesionale", category: "clinic" },

  { id: "drill", it: "fresa", de: "der Bohrer", en: "bur (drill)", sq: "frezë", category: "materials" },
  { id: "probe", it: "sonda", de: "die Sonde", en: "probe (explorer)", sq: "sondë", category: "materials" },
  { id: "mirror", it: "specchietto", de: "der Mundspiegel", en: "mouth mirror", sq: "pasqyrë dentare", category: "materials" },
  { id: "forceps", it: "pinza", de: "die Zange", en: "forceps", sq: "pincë", category: "materials" },
  { id: "composite", it: "composito", de: "das Komposit", en: "composite", sq: "kompozit", category: "materials" },
  { id: "amalgam", it: "amalgama", de: "das Amalgam", en: "amalgam", sq: "amalgamë", category: "materials" },
  { id: "impression", it: "impronta", de: "der Abdruck", en: "impression", sq: "masë (përshtypje)", category: "materials" },
  { id: "crownProsthetic", it: "corona protesica", de: "die (Zahn)krone", en: "dental crown (prosthetic)", sq: "kurorë protetike", category: "materials" },
];
