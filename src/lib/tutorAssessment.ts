import type { Tooth } from "./teeth";

/**
 * Conservative simulator check: uncertain prose is never classified as correct.
 * Accepts Italian, German, English and Albanian answers (diacritics are stripped,
 * so Albanian "ë"/"ç" are matched as "e"/"c").
 */
export function assessRecognitionAnswer(tooth: Tooth, step: number, raw: string): boolean {
  const text = raw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (/\b(non|nicht|kein|keine|no|not|nuk|jo)\b/.test(text)) return false;
  const matches = (pattern: RegExp) => pattern.test(text);
  if (step === 0) {
    const upper = matches(/\b(superiore|mascellare|maxilla\w*|oberkiefer|oben|upper|maxillary|siperm\w*|siper|maksil\w*)\b/);
    const lower = matches(/\b(inferiore|mandibolare|mandibola|mandibula\w*|unterkiefer|unten|lower|mandibular|poshtem\w*|poshte|mandibul\w*)\b/);
    return tooth.arch === "upper" ? upper && !lower : lower && !upper;
  }
  if (step === 1) {
    const groups = [
      /\b(incisiv\w*|schneidezahn\w*|schneidezahne|incisor\w*|preres\w*)\b/,
      /\b(canin\w*|eckzahn\w*|eckzahne|kanin\w*|syrit|cuspid)\b/,
      /\b(premolar\w*|pramolar\w*|bicuspid\w*)\b/,
      /\b(molar\w*|mahlzahn\w*|mahlzahne|dhemball\w*)\b/,
    ];
    const expected = tooth.position <= 2 ? 0 : tooth.position === 3 ? 1 : tooth.position <= 5 ? 2 : 3;
    return groups.every((pattern, index) => pattern.test(text) === (index === expected));
  }
  if (step === 2) {
    const pattern: Record<Tooth["type"], RegExp> = {
      centralIncisor: /\b(centrale|centrali|central|mittler\w*|zentral\w*|qendror\w*)\b/,
      lateralIncisor: /\b(laterale|laterali|lateral|seitlich\w*|anesor\w*)\b/,
      canine: /\b(canino|canine|eckzahn|kanin\w*|syrit)\b/,
      firstPremolar: /\b(prim\w*|erst\w*|first|1st|pare)\b/,
      secondPremolar: /\b(second\w*|zweit\w*|2nd|dyte)\b/,
      firstMolar: /\b(prim\w*|erst\w*|first|1st|pare)\b/,
      secondMolar: /\b(second\w*|zweit\w*|2nd|dyte)\b/,
      thirdMolar: /\b(terz\w*|dritt\w*|weisheitszahn|third|3rd|wisdom|trete|pjekuri\w*)\b/,
    };
    return pattern[tooth.type].test(text);
  }
  if (step === 3) {
    const right = matches(/\b(destr\w*|rechts|recht\w*|right|djathta?s?|djathte)\b/);
    const left = matches(/\b(sinistr\w*|links|link\w*|left|majta?s?|majte)\b/);
    return tooth.side === "right" ? right && !left : left && !right;
  }
  const fdis = text.match(/\b[1-4][1-8]\b/g) ?? [];
  return fdis.length === 1 && fdis[0] === tooth.fdi;
}
