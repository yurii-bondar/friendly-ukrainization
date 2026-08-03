import { Alternation } from '../alternation.js';
import { StemGroup, type Case } from '../../types.js';
import { deIotify, table, type CaseRule, type NumberTable } from './types.js';

// Order: nominative, genitive, dative, accusative, instrumental, locative, vocative.

const HARD: NumberTable = {
  singular: table(['а', 'и', 'і', 'у', 'ою', 'і', 'о'], {
    dative: Alternation.PALATAL_1,
    locative: Alternation.PALATAL_1,
  }),
  plural: table(['и', '', 'ам', '', 'ами', 'ах', 'и']),
};

const SOFT_CONSONANT: NumberTable = {
  singular: table(['я', 'і', 'і', 'ю', 'ею', 'і', 'е']),
  plural: table(['і', '', 'ям', '', 'ями', 'ях', 'і']),
};

const SOFT_VOWEL: NumberTable = {
  singular: table(['я', 'ї', 'ї', 'ю', 'єю', 'ї', 'є']),
  plural: table(['ї', 'й', 'ям', 'й', 'ями', 'ях', 'ї']),
};

const MIXED: NumberTable = {
  singular: deIotify(SOFT_CONSONANT.singular),
  plural: deIotify(SOFT_CONSONANT.plural),
};

/**
 * Returns the case-suffix table for a 1st-declension (-а/-я) noun.
 * `stemEndsInVowel` distinguishes the -ія/-ея pattern (надія, армія),
 * which spells its oblique endings with ї/є instead of і/е.
 */
export function getFirstDeclensionTable(group: StemGroup, stemEndsInVowel: boolean): NumberTable {
  if (group === StemGroup.MIXED) {
    return MIXED;
  }
  if (group === StemGroup.SOFT) {
    return stemEndsInVowel ? SOFT_VOWEL : SOFT_CONSONANT;
  }
  return HARD;
}

export function getFirstDeclensionCaseRule(
  group: StemGroup,
  stemEndsInVowel: boolean,
  number: 'singular' | 'plural',
  caseName: Case,
): CaseRule {
  return getFirstDeclensionTable(group, stemEndsInVowel)[number][caseName];
}
