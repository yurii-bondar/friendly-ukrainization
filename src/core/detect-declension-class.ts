import { DeclensionClass, Gender } from '../types.js';

/**
 * Determines which of the 4 declensions a common noun's ending puts it in.
 * Gender must already be resolved — the same -я ending is 2nd declension
 * (geminated neuter: знання) or 4th declension (young-creature: теля)
 * depending on whether the stem is a doubled consonant, and the same
 * consonant/zero ending is 2nd declension for masculine or 3rd declension
 * for feminine.
 */
export function detectDeclensionClass(
  stem: string,
  ending: string,
  gender: Gender,
): DeclensionClass {
  if (ending === 'а' || ending === 'я') {
    if (gender === Gender.NEUTER) {
      return /(.)\1$/.test(stem) ? DeclensionClass.SECOND : DeclensionClass.FOURTH;
    }
    return DeclensionClass.FIRST;
  }
  if (ending === 'о' || ending === 'е' || ending === 'є') {
    return DeclensionClass.SECOND;
  }
  // Zero ending or -ь: masculine -> 2nd declension, feminine -> 3rd declension.
  return gender === Gender.FEMININE ? DeclensionClass.THIRD : DeclensionClass.SECOND;
}
