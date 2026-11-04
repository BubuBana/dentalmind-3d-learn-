import { describe, expect, it } from "vitest";
import { LANGS, TEETH, getTooth } from "./teeth";
import { classIAntagonists, cuspCounts, opposingHomologue, rootCounts } from "./anatomyFacts";
import { buildQuestion, mulberry32 } from "./quiz";
import { mesialNeighbour, distalNeighbour, mirrorFdi, recognitionSteps, TRICK_QUESTIONS, MESIAL_DISTAL_LESSON, MIRROR_LESSON, UPPER_PAIRS, LOWER_PAIRS } from "./lessons";
import { assessRecognitionAnswer } from "./tutorAssessment";
import { VOCABULARY } from "./vocabulary";
import { DICTS } from "./i18n.dict";
import { CROWN_WORKFLOW, LAB_QUIZ, LAB_SECTIONS } from "./lab";
import { crownMesh, rootMeshes } from "./toothShape";
import { MEASUREMENTS, MEASUREMENT_LABELS, MEASUREMENT_NOTE } from "./measurements";

function tooth(fdi: string) {
  const result = getTooth(fdi);
  if (!result) throw new Error("Missing FDI tooth");
  return result;
}

/** Collect every {it,de,...} object reachable from a value. */
function localized(value: unknown, out: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(value)) value.forEach((v) => localized(v, out));
  else if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (typeof o["it"] === "string") out.push(o);
    else Object.values(o).forEach((v) => localized(v, out));
  }
  return out;
}

describe("Clinically sound permanent dentition", () => {
  it("keeps all 32 FDI teeth and patient-relative quadrants", () => {
    expect(TEETH).toHaveLength(32);
    expect(tooth("11").side).toBe("right");
    expect(tooth("21").side).toBe("left");
    expect(tooth("31").arch).toBe("lower");
    expect(tooth("41").side).toBe("right");
  });
  it("recognizes both common maxillary first-premolar root forms", () => {
    expect(rootCounts(tooth("14"))).toEqual([1, 2]);
    expect(rootCounts(tooth("24"))).toEqual([1, 2]);
  });
  it("accepts both mandibular second-premolar cusp forms", () => {
    expect(cuspCounts(tooth("35"))).toEqual([2, 3]);
    expect(cuspCounts(tooth("45"))).toEqual([2, 3]);
  });
  it("does not invent one typical count for third molars", () => {
    for (const fdi of ["18", "28", "38", "48"]) {
      expect(rootCounts(tooth(fdi))).toEqual([]);
      expect(cuspCounts(tooth(fdi))).toEqual([]);
    }
  });
  it("keeps the 3D mesh consistent with the taught counts", () => {
    for (const t of TEETH) {
      const roots = rootCounts(t);
      const cusps = cuspCounts(t);
      if (roots.length) expect(roots).toContain(t.geometry.rootCount);
      if (cusps.length && t.position >= 4) expect(cusps).toContain(t.geometry.cuspCount);
    }
  });
  it("builds valid 3D meshes for every tooth", () => {
    for (const t of TEETH) {
      const parts = [crownMesh(t.geometry), ...rootMeshes(t.geometry).map((r) => r.mesh)];
      expect(parts.length, t.fdi).toBe(t.geometry.rootCount === 1 ? 2 : t.geometry.rootCount + 2);
      for (const p of parts) {
        expect(p.positions.every(Number.isFinite), t.fdi).toBe(true);
        expect(p.normals.every(Number.isFinite), t.fdi).toBe(true);
        expect(Math.max(...p.indices) < p.positions.length / 3, t.fdi).toBe(true);
      }
      const crown = parts[0]!.positions;
      let maxY = -Infinity;
      for (let i = 1; i < crown.length; i += 3) maxY = Math.max(maxY, crown[i]!);
      expect(Math.abs(maxY - t.geometry.crownHeight) < t.geometry.crownHeight * 0.45, t.fdi).toBe(true);
    }
  });
  it("only calls the upper canine root the longest in the dentition", () => {
    const apexHint = (fdi: string) => tooth(fdi).landmarks.find((l) => l.id === "apex")!.hint.en;
    expect(apexHint("13")).toMatch(/longest root in the dentition/);
    expect(apexHint("33")).toMatch(/mandibular arch/);
  });
  it("keeps the average measurements consistent with the anatomy texts", () => {
    const all = (["upper", "lower"] as const).flatMap((a) => Object.entries(MEASUREMENTS[a]).map(([type, m]) => ({ a, type, m })));
    expect(all).toHaveLength(16);
    const longestRoot = all.reduce((x, y) => (y.m.rootLength > x.m.rootLength ? y : x));
    expect(`${longestRoot.a}:${longestRoot.type}`).toBe("upper:canine");
    const narrowest = all.reduce((x, y) => (y.m.mdCrown < x.m.mdCrown ? y : x));
    expect(`${narrowest.a}:${narrowest.type}`).toBe("lower:centralIncisor");
    expect(MEASUREMENTS.lower.canine.rootLength).toBe(Math.max(...Object.values(MEASUREMENTS.lower).map((m) => m.rootLength)));
    for (const { m } of all) {
      expect(m.mdCervix < m.mdCrown).toBe(true);
      expect(m.blCervix <= m.blCrown).toBe(true);
    }
    for (const q of LAB_QUIZ) expect(q.correct < q.options.length).toBe(true);
  });
  it("distinguishes opposite-arch homologue from Class I antagonists", () => {
    expect(opposingHomologue("16")).toBe("46");
    expect(classIAntagonists("16")).toEqual(["46", "47"]);
    expect(classIAntagonists("46")).toEqual(["16", "15"]);
    expect(classIAntagonists("41")).toEqual(["11"]);
    expect(classIAntagonists("18")).toEqual(["48"]);
  });
  it("handles mesial contacts across the midline", () => {
    expect(mesialNeighbour("11")).toBe("21");
    expect(mesialNeighbour("41")).toBe("31");
    expect(mesialNeighbour("23")).toBe("22");
    expect(distalNeighbour("18")).toBeNull();
    expect(mirrorFdi("16")).toBe("26");
  });
  it("uses facts even if the mesh parameters are changed", () => {
    expect(rootCounts({ ...tooth("16"), geometry: { ...tooth("16").geometry, rootCount: 8 } })).toEqual([3]);
    expect(cuspCounts({ ...tooth("35"), geometry: { ...tooth("35").geometry, cuspCount: 9 } })).toEqual([2, 3]);
  });
});

describe("Four languages", () => {
  it("translates every content string into it, de, en and sq", () => {
    const sources = [
      TEETH,
      TEETH.map(recognitionSteps),
      TRICK_QUESTIONS,
      MESIAL_DISTAL_LESSON,
      MIRROR_LESSON,
      UPPER_PAIRS,
      LOWER_PAIRS,
      VOCABULARY,
      LAB_SECTIONS,
      CROWN_WORKFLOW,
      LAB_QUIZ,
      MEASUREMENT_LABELS,
      MEASUREMENT_NOTE,
    ];
    const objects = localized(sources);
    expect(objects.length).toBeGreaterThan(500);
    for (const o of objects) {
      for (const lang of LANGS) {
        expect(typeof o[lang], JSON.stringify(o).slice(0, 120)).toBe("string");
        expect((o[lang] as string).trim().length).toBeGreaterThan(0);
      }
    }
  });
  it("has the same interface keys in every language", () => {
    const keys = Object.keys(DICTS.it).sort();
    for (const lang of LANGS) {
      expect(Object.keys(DICTS[lang]).sort(), lang).toEqual(keys);
      for (const k of keys) {
        const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join();
        expect(placeholders(DICTS[lang][k]!), `${lang}:${k}`).toBe(placeholders(DICTS.it[k]!));
      }
    }
  });
  it("generates a single distinct correct option including boundary teeth in all languages", () => {
    for (const lang of LANGS) {
      for (const fdi of TEETH.map((t) => t.fdi)) {
        for (const mode of ["standard", "orientation", "mirror", "trick", "vocab"] as const) {
          const rnd = mulberry32(174);
          for (let i = 0; i < 12; i++) {
            const q = buildQuestion({ level: 3, lang, rnd, focusFdi: fdi, mode });
            expect(q.options.filter((o) => o.id === q.answerId)).toHaveLength(1);
            expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length);
            expect(new Set(q.options.map((o) => o.label)).size).toBe(q.options.length);
            expect(q.prompt).not.toMatch(/undefined/);
            if (q.topic === "roots") expect(q.answerId).toBe(rootCounts(tooth(fdi)).join("–"));
            if (q.topic === "cusps") expect(q.answerId).toBe(cuspCounts(tooth(fdi)).join("–"));
          }
        }
      }
    }
  });
  it("lets the vocabulary quiz use any source/target pair", () => {
    for (const from of LANGS) {
      for (const to of LANGS) {
        if (from === to) continue;
        const q = buildQuestion({ level: 1, lang: "it", rnd: mulberry32(3), mode: "vocab", vocabFrom: from, vocabTo: to });
        const entry = VOCABULARY.find((v) => v.id === q.answerId)!;
        expect(q.prompt).toContain(entry[from]);
        expect(q.options.find((o) => o.id === q.answerId)!.label).toBe(entry[to]);
      }
    }
  });
});

describe("Tutor answer checker", () => {
  it("does not mark arbitrary or contradictory replies correct", () => {
    expect(assessRecognitionAnswer(tooth("14"), 0, "inferiore")).toBe(false);
    expect(assessRecognitionAnswer(tooth("14"), 0, "superiore e inferiore")).toBe(false);
    expect(assessRecognitionAnswer(tooth("14"), 0, "non superiore")).toBe(false);
    expect(assessRecognitionAnswer(tooth("14"), 0, "not upper")).toBe(false);
    expect(assessRecognitionAnswer(tooth("14"), 0, "nuk është i sipërm")).toBe(false);
    expect(assessRecognitionAnswer(tooth("14"), 4, "14 oppure 24")).toBe(false);
  });
  it("accepts correct answers in all four languages", () => {
    const t = tooth("14");
    for (const s of ["Arcata superiore", "Oberkiefer", "upper arch", "harku i sipërm"]) expect(assessRecognitionAnswer(t, 0, s)).toBe(true);
    for (const s of ["premolare", "Prämolar", "premolar", "premolarët"]) expect(assessRecognitionAnswer(t, 1, s)).toBe(true);
    for (const s of ["primo", "erster", "first", "i parë"]) expect(assessRecognitionAnswer(t, 2, s)).toBe(true);
    for (const s of ["destro", "rechts", "right", "djathtas"]) expect(assessRecognitionAnswer(t, 3, s)).toBe(true);
    expect(assessRecognitionAnswer(t, 4, "FDI 14")).toBe(true);
    expect(assessRecognitionAnswer(tooth("36"), 0, "lower")).toBe(true);
    expect(assessRecognitionAnswer(tooth("36"), 0, "i poshtëm")).toBe(true);
    expect(assessRecognitionAnswer(tooth("36"), 1, "dhëmballë")).toBe(true);
    expect(assessRecognitionAnswer(tooth("38"), 2, "molari i tretë")).toBe(true);
    expect(assessRecognitionAnswer(tooth("38"), 2, "wisdom tooth")).toBe(true);
    expect(assessRecognitionAnswer(tooth("22"), 3, "majtas")).toBe(true);
    expect(assessRecognitionAnswer(tooth("22"), 2, "prerës anësor")).toBe(true);
    expect(assessRecognitionAnswer(tooth("13"), 1, "kanin")).toBe(true);
  });
});
