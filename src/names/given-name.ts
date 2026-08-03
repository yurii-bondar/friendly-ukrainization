import { Animacy, Gender, StemGroup, type Case } from '../types.js';
import { decline } from '../core/engine.js';
import { splitStem } from '../core/stem-split.js';
import { getSecondDeclensionMasculineCaseRule } from '../core/rules/second-declension.js';
import { restoreCasing } from '../utils/casing.js';
import { normalizeApostrophe } from '../utils/apostrophe.js';
import { GIVEN_NAME_GENDER_HINTS } from '../data/names/given-names-gender.js';
import { detectGender } from '../core/detect-gender.js';

const MASCULINE_O_EXCEPTIONS = new Set(['ко']); // -ко/-енко are surnames, never given names

/**
 * Masculine given names ending in -о (Дмитро, Петро, Марко) strip the -о
 * and decline as a hard-stem 2nd-declension masculine noun (Дмитра,
 * Дмитру, Дмитром...) — a distinct pattern from common -о neuter nouns
 * and from the (indeclinable) -ко/-енко surname pattern.
 */
function declineMasculineONames(word: string, caseName: Case): string {
  const normalized = normalizeApostrophe(word.trim());
  const lower = normalized.toLowerCase();
  const { stem } = splitStem(lower);

  if (caseName === 'accusative') {
    return declineMasculineONames(word, 'genitive');
  }

  const rule = getSecondDeclensionMasculineCaseRule(StemGroup.HARD, true, false, 'singular', caseName);
  return restoreCasing(normalized, stem + rule.suffix);
}

export function isMasculineOGivenName(word: string, gender: Gender): boolean {
  const lower = word.trim().toLowerCase();
  return gender === Gender.MASCULINE && lower.endsWith('о') && !MASCULINE_O_EXCEPTIONS.has(lower.slice(-2));
}

export function declineGivenName(word: string, caseName: Case, gender: Gender): string {
  if (isMasculineOGivenName(word, gender)) {
    return declineMasculineONames(word, caseName);
  }
  return decline(word, caseName, { gender, animacy: Animacy.ANIMATE });
}

export function detectGivenNameGender(word: string): Gender | undefined {
  const lower = normalizeApostrophe(word.trim()).toLowerCase();
  if (GIVEN_NAME_GENDER_HINTS[lower]) {
    return GIVEN_NAME_GENDER_HINTS[lower];
  }
  const last = lower.charAt(lower.length - 1);
  if (last === 'о') {
    return Gender.MASCULINE;
  }
  if (last === 'а' || last === 'я') {
    return Gender.FEMININE;
  }
  // Consonant/ь-final given names are almost always masculine in
  // Ukrainian; delegate to the common-noun heuristic, which already
  // special-cases the rare feminine exception (Любов).
  return detectGender(lower);
}
