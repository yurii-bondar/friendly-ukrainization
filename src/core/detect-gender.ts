import { Gender } from '../types.js';
import { lastChar } from '../utils/text.js';

const FEMININE_CONSONANT_SUFFIXES = ['ість'];

const KNOWN_FEMININE_CONSONANT_NOUNS = new Set([
  'ніч', 'річ', 'піч', 'сіль', 'кров', 'любов', 'осінь', 'подорож', 'розкіш', 'тінь', 'мати',
]);

/**
 * Best-effort grammatical gender detection for a common noun from its
 * bare ending — this is only a fallback for when no explicit `gender` and
 * no exceptions-dictionary hint is available. Feminine and masculine
 * consonant-final nouns (студент vs ніч) are not distinguishable from the
 * ending alone; this defaults to masculine (the larger class) and relies
 * on a small built-in list plus the -ість/-ність suffix pattern to catch
 * the common feminine exceptions.
 */
export function detectGender(word: string): Gender {
  const lower = word.toLowerCase();
  const last = lastChar(lower);

  if (last === 'я' && /(.)\1$/.test(lower.slice(0, -1))) {
    // Geminated-consonant -я nouns (знання, життя) are always neuter.
    return Gender.NEUTER;
  }
  if (last === 'а' || last === 'я') {
    return Gender.FEMININE;
  }
  if (last === 'о' || last === 'е' || last === 'є') {
    return Gender.NEUTER;
  }

  if (
    KNOWN_FEMININE_CONSONANT_NOUNS.has(lower) ||
    FEMININE_CONSONANT_SUFFIXES.some((suffix) => lower.endsWith(suffix))
  ) {
    return Gender.FEMININE;
  }

  return Gender.MASCULINE;
}
