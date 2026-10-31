import type { Tooth } from "./teeth";

/** Educational anatomical ranges, never inferred from the procedural mesh. */
export function rootCounts(tooth: Tooth): number[] {
  if (tooth.position === 8) return []; // No single teaching count for third molars.
  if (tooth.arch === "upper" && tooth.position === 4) return [1, 2];
  if (tooth.position >= 6) return [tooth.arch === "upper" ? 3 : 2];
  return [1];
}

export function cuspCounts(tooth: Tooth): number[] {
  if (tooth.position === 8) return [];
  if (tooth.position <= 2) return [0];
  if (tooth.position === 3) return [1];
  if (tooth.arch === "lower" && tooth.position === 5) return [2, 3];
  if (tooth.arch === "upper" && tooth.position === 7) return [3, 4];
  if (tooth.position <= 5) return [2];
  return [tooth.arch === "lower" && tooth.position === 6 ? 5 : 4];
}

/** Same-position tooth in the opposite arch: a numbering correspondence, not an occlusal rule. */
export function opposingHomologue(fdi: string): string {
  if (!/^[1-4][1-8]$/.test(fdi)) throw new Error("Invalid permanent FDI number");
  const map: Record<string, string> = { "1": "4", "4": "1", "2": "3", "3": "2" };
  return `${map[fdi.charAt(0)]}${fdi.charAt(1)}`;
}

/** Ideal complete Class I dentition; actual contacts require clinical examination. */
export function classIAntagonists(fdi: string): string[] {
  const other = opposingHomologue(fdi);
  const position = Number(fdi.charAt(1));
  const upper = Number(fdi.charAt(0)) <= 2;
  if ((upper && position === 8) || (!upper && position === 1)) return [other];
  return [other, `${other.charAt(0)}${position + (upper ? 1 : -1)}`];
}
