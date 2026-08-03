import { Animacy, Gender, type Case } from '../types.js';
import { decline } from '../core/engine.js';

/**
 * Patronymics decline fully regularly once gender is known: -ович/-ич is a
 * hard-stem masculine noun, -івна/-ївна a regular 1st-declension feminine
 * noun — so this just forwards into the shared core engine.
 */
export function declinePatronymic(word: string, caseName: Case, gender: Gender): string {
  return decline(word, caseName, { gender, animacy: Animacy.ANIMATE });
}

export function detectPatronymicGender(word: string): Gender | undefined {
  const lower = word.trim().toLowerCase();
  if (/(ович|ич)$/i.test(lower)) {
    return Gender.MASCULINE;
  }
  if (/(івна|ївна)$/i.test(lower)) {
    return Gender.FEMININE;
  }
  return undefined;
}
