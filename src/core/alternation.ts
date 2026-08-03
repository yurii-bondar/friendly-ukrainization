export const Alternation = {
  /** г/з, к/ц, х/с — triggered before the dative/locative -і ending. */
  PALATAL_1: 'palatal1',
  /** г/ж, к/ч, х/ш — triggered before the vocative -е ending. */
  PALATAL_2: 'palatal2',
} as const;
export type Alternation = (typeof Alternation)[keyof typeof Alternation];

const PALATAL_1_MAP: Record<string, string> = { г: 'з', к: 'ц', х: 'с' };
const PALATAL_2_MAP: Record<string, string> = { г: 'ж', к: 'ч', х: 'ш' };

/**
 * Applies a consonant alternation to the final consonant of a stem, if
 * that consonant participates in the given alternation. Returns the stem
 * unchanged otherwise (most consonants never alternate).
 */
export function applyAlternation(stem: string, alternation: Alternation): string {
  const final = stem.charAt(stem.length - 1);
  const lower = final.toLowerCase();
  const map = alternation === Alternation.PALATAL_1 ? PALATAL_1_MAP : PALATAL_2_MAP;
  const replacement = map[lower];
  if (!replacement) {
    return stem;
  }
  const cased = final === lower ? replacement : replacement.toUpperCase();
  return stem.slice(0, -1) + cased;
}
