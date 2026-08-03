import { isVowel } from '../utils/text.js';

export interface StemSplit {
  stem: string;
  /** The nominative singular ending: '', 'а', 'я', 'о', 'е', 'є', 'ь', or 'й'. */
  ending: string;
}

const NOMINATIVE_ENDINGS = ['я', 'а', 'є', 'е', 'о', 'ь'];

/**
 * Peels the nominative-singular ending off a word. All four Ukrainian
 * declensions use one of a zero ending or {а, я, о, е, є, ь} in the
 * nominative singular — declension-specific stem extensions (e.g. the
 * -ат-/-ят-/-ен- insert of the 4th declension) are applied on top of this
 * split by the relevant rule table, not here.
 *
 * A vowel-final й (Юрій, трамвай, музей) is also peeled off as its own
 * one-letter ending: masculine nouns/names of this shape decline from the
 * vowel-final stem (Юрій -> Юрі- + я = Юрія), not from the "-ій"/"-ай" stem
 * as a whole.
 */
export function splitStem(word: string): StemSplit {
  const lower = word.toLowerCase();
  if (lower.length >= 2 && lower.endsWith('й') && isVowel(lower.charAt(lower.length - 2))) {
    return { stem: word.slice(0, -1), ending: 'й' };
  }
  for (const ending of NOMINATIVE_ENDINGS) {
    if (lower.endsWith(ending)) {
      return { stem: word.slice(0, word.length - ending.length), ending };
    }
  }
  return { stem: word, ending: '' };
}
