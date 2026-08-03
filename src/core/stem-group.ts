import { StemGroup } from '../types.js';
import { isSibilant, lastChar } from '../utils/text.js';

/**
 * Determines the hard/soft/mixed stem group for the 1st declension
 * (-а/-я nouns), which drives which case-suffix subtable applies.
 * Soft group is always spelled with a -я nominative ending; mixed group
 * is spelled -а but has a sibilant/ц stem-final consonant; everything
 * else is hard group.
 */
export function detectFirstDeclensionGroup(stem: string, nominativeEnding: string): StemGroup {
  if (nominativeEnding === 'я') {
    return StemGroup.SOFT;
  }
  const final = lastChar(stem).toLowerCase();
  if (isSibilant(final)) {
    return StemGroup.MIXED;
  }
  return StemGroup.HARD;
}

/**
 * Determines the hard/soft/mixed stem group for the 2nd declension
 * (masculine zero-ending / neuter -о,-е,-я nouns). Stems ending in a
 * sibilant or ц take mixed-group endings; stems ending in й or ь-marked
 * softness take soft-group endings; everything else (including р, which
 * is only soft for a lexically specific set of occupational nouns like
 * лікар/кобзар — those are handled via the exceptions dictionary) is
 * hard group.
 */
export function detectSecondDeclensionGroup(stem: string, nominativeEnding: string): StemGroup {
  const final = lastChar(stem).toLowerCase();
  if (isSibilant(final)) {
    return StemGroup.MIXED;
  }
  if (
    final === 'ц' ||
    nominativeEnding === 'е' ||
    nominativeEnding === 'я' ||
    nominativeEnding === 'ь' ||
    nominativeEnding === 'й'
  ) {
    return StemGroup.SOFT;
  }
  return StemGroup.HARD;
}
