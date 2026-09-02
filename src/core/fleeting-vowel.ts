/**
 * Best-effort detection of a "fleeting" о/е that disappears from a masculine
 * zero-ending stem once a vowel-initial case suffix is attached (садок ->
 * садка, хлопець -> хлопця, день -> дня). This is only reliably productive
 * for the -ок/-ець/-ень derivational endings; words that merely happen to
 * end in those three letters without the vowel being fleeting (e.g. крок ->
 * кроку, not "крка") must be listed in the exceptions dictionary to opt out.
 */
export function hasFleetingVowel(stem: string): boolean {
  // Matches against the already ending-stripped stem, so -ець/-ень (whose
  // nominative -ь has already been peeled off by splitStem) show up as -ец/-ен.
  return /(ок|ец|ен)$/i.test(stem);
}

export function dropFleetingVowel(stem: string): string {
  // Unreachable via the public API: hasFleetingVowel only returns true when
  // the stem ends in ок/ец/ен, which is already 2 characters long.
  /* v8 ignore next 3 */
  if (stem.length < 2) {
    return stem;
  }
  return stem.slice(0, -2) + stem.slice(-1);
}

const VELARS = new Set(['г', 'к', 'х']);
const CONSONANT_PATTERN = /[бвгґджзйклмнпрстфхцчшщ]/i;

/**
 * Best-effort epenthetic vowel insertion for the genitive plural zero
 * ending (сестра -> сестер, вікно -> вікон). Only fires when the stem ends
 * in a two-consonant cluster; single-consonant-final stems need no
 * insertion (рука -> рук). Real Ukrainian epenthesis has lexical
 * exceptions (e.g. дошка -> дощок) that this heuristic will miss — those
 * belong in the exceptions dictionary.
 */
export function insertGenitivePluralEpenthesis(stem: string): string {
  const last = stem.charAt(stem.length - 1);
  const secondLast = stem.charAt(stem.length - 2);
  if (!secondLast || !CONSONANT_PATTERN.test(last) || !CONSONANT_PATTERN.test(secondLast)) {
    return stem;
  }
  const vowel = VELARS.has(secondLast.toLowerCase()) ? 'о' : 'е';
  return stem.slice(0, -1) + vowel + stem.slice(-1);
}
