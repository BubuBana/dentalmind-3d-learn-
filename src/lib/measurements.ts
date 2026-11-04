import type { Arch, L, ToothTypeKey } from "./teeth";

/**
 * Average dimensions of permanent teeth in millimetres, from the classic
 * measurement table in Wheeler's Dental Anatomy, Physiology and Occlusion
 * (Ash & Nelson). Values are teaching averages: individual teeth vary.
 * For maxillary molars the root length is given for the buccal roots;
 * the palatal root is about 1 mm longer.
 */
export interface ToothMeasurements {
  crownLength: number;
  rootLength: number;
  mdCrown: number;
  mdCervix: number;
  blCrown: number;
  blCervix: number;
}

const M = (
  crownLength: number,
  rootLength: number,
  mdCrown: number,
  mdCervix: number,
  blCrown: number,
  blCervix: number,
): ToothMeasurements => ({ crownLength, rootLength, mdCrown, mdCervix, blCrown, blCervix });

export const MEASUREMENTS: Record<Arch, Record<ToothTypeKey, ToothMeasurements>> = {
  upper: {
    centralIncisor: M(10.5, 13, 8.5, 7, 7, 6),
    lateralIncisor: M(9, 13, 6.5, 5, 6, 5),
    canine: M(10, 17, 7.5, 5.5, 8, 7),
    firstPremolar: M(8.5, 14, 7, 5, 9, 8),
    secondPremolar: M(8.5, 14, 7, 5, 9, 8),
    firstMolar: M(7.5, 12, 10, 8, 11, 10),
    secondMolar: M(7, 11, 9, 7, 11, 10),
    thirdMolar: M(6.5, 11, 8.5, 6.5, 10, 9.5),
  },
  lower: {
    centralIncisor: M(9, 12.5, 5, 3.5, 6, 5.3),
    lateralIncisor: M(9.5, 14, 5.5, 4, 6.5, 5.8),
    canine: M(11, 16, 7, 5.5, 7.5, 7),
    firstPremolar: M(8.5, 14, 7, 5, 7.5, 6.5),
    secondPremolar: M(8, 14.5, 7, 5, 8, 7),
    firstMolar: M(7.5, 14, 11, 9, 10.5, 9),
    secondMolar: M(7, 13, 10.5, 8, 10, 9),
    thirdMolar: M(7, 11, 10, 7.5, 9.5, 9),
  },
};

export const MEASUREMENT_LABELS: Record<keyof ToothMeasurements, L> = {
  crownLength: { it: "Altezza corona", de: "Kronenlänge", en: "Crown length", sq: "Gjatësia e kurorës" },
  rootLength: { it: "Lunghezza radice", de: "Wurzellänge", en: "Root length", sq: "Gjatësia e rrënjës" },
  mdCrown: { it: "Mesio-distale corona", de: "Mesiodistal Krone", en: "Mesiodistal crown", sq: "Meziodistal kurora" },
  mdCervix: { it: "Mesio-distale colletto", de: "Mesiodistal Zahnhals", en: "Mesiodistal cervix", sq: "Meziodistal qafa" },
  blCrown: { it: "Vestibolo-orale corona", de: "Vestibulo-oral Krone", en: "Labio/bucco-lingual crown", sq: "Vestibulo-oral kurora" },
  blCervix: { it: "Vestibolo-orale colletto", de: "Vestibulo-oral Zahnhals", en: "Labio/bucco-lingual cervix", sq: "Vestibulo-oral qafa" },
};

export const MEASUREMENT_NOTE: L = {
  it: "Valori medi in mm (tabella di Wheeler). Ogni dente reale può differire di 1–2 mm. Nei molari superiori la radice palatale è circa 1 mm più lunga delle vestibolari.",
  de: "Durchschnittswerte in mm (Wheeler-Tabelle). Jeder reale Zahn kann um 1–2 mm abweichen. Bei oberen Molaren ist die palatinale Wurzel etwa 1 mm länger als die bukkalen.",
  en: "Average values in mm (Wheeler's table). Any real tooth can differ by 1–2 mm. On upper molars the palatal root is about 1 mm longer than the buccal roots.",
  sq: "Vlera mesatare në mm (tabela e Wheeler-it). Çdo dhëmb real mund të ndryshojë me 1–2 mm. Te molarët e sipërm rrënja palatinale është rreth 1 mm më e gjatë se ato bukale.",
};
