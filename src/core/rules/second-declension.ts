import { Alternation } from '../alternation.js';
import { StemGroup, type Case } from '../../types.js';
import { deIotify, table, toVowelStemVariant, type CaseRule, type CaseSuffixTable, type NumberTable } from './types.js';

export const NeuterSubtype = {
  /** вікно, місто — hard, -о nominative. */
  O: 'o',
  /** поле, серце, сонце — soft/mixed, -е nominative. */
  E: 'e',
  /** знання, життя — -я nominative from a geminated (doubled) consonant. */
  GEMINATED: 'geminated',
} as const;
export type NeuterSubtype = (typeof NeuterSubtype)[keyof typeof NeuterSubtype];

export function detectNeuterSubtype(stem: string, ending: string): NeuterSubtype {
  if (ending === 'о') {
    return NeuterSubtype.O;
  }
  if (ending === 'я' && /(.)\1$/.test(stem)) {
    return NeuterSubtype.GEMINATED;
  }
  return NeuterSubtype.E;
}

/**
 * `preferAForms` picks the -а/-ові genitive/dative spelling over -у/-у.
 * This is driven by animacy but not identical to it: it defaults to true
 * (matching common concrete/diminutive nouns like студент or садок) and
 * only flips to the -у forms when the caller explicitly marks a word
 * inanimate — the true animate/inanimate split still governs the separate
 * accusative-equals-genitive syncretism rule in the engine.
 *
 * `stemEndsInVowel` picks the vowel-stem soft variant (Юрій -> Юрі- +
 * suffix, dative -єві/locative -ї) over the consonant-stem one (лікар ->
 * лікар- + suffix, dative -еві/locative -і) — see stem-split.ts's -й
 * handling.
 */
function masculineSingular(
  group: StemGroup,
  preferAForms: boolean,
  stemEndsInVowel: boolean,
): CaseSuffixTable {
  if (group === StemGroup.HARD) {
    return table(
      ['', preferAForms ? 'а' : 'у', preferAForms ? 'ові' : 'у', preferAForms ? 'а' : '', 'ом', 'і', 'е'],
      { locative: Alternation.PALATAL_1, vocative: Alternation.PALATAL_2 },
    );
  }
  // A vowel-final stem (Юрій stripped to Юрі-) reattaches the stripped -й
  // in nominative/inanimate-accusative instead of using a true zero ending.
  const zero = stemEndsInVowel ? 'й' : '';
  const base = table([zero, 'я', preferAForms ? 'еві' : 'ю', preferAForms ? 'я' : zero, 'ем', 'і', 'ю']);
  const withVowelStem = stemEndsInVowel ? toVowelStemVariant(base) : base;
  return group === StemGroup.MIXED ? deIotify(withVowelStem) : withVowelStem;
}

const MASC_PLURAL_HARD = table(['и', 'ів', 'ам', '', 'ами', 'ах', 'и']);
const MASC_PLURAL_SOFT = table(['і', 'ів', 'ям', '', 'ями', 'ях', 'і']);
const MASC_PLURAL_MIXED = deIotify(MASC_PLURAL_SOFT);
const MASC_PLURAL_SOFT_VOWEL = toVowelStemVariant(MASC_PLURAL_SOFT);

function masculinePlural(group: StemGroup, stemEndsInVowel: boolean): CaseSuffixTable {
  if (group === StemGroup.HARD) return MASC_PLURAL_HARD;
  if (group === StemGroup.MIXED) return MASC_PLURAL_MIXED;
  return stemEndsInVowel ? MASC_PLURAL_SOFT_VOWEL : MASC_PLURAL_SOFT;
}

export function getSecondDeclensionMasculineTable(
  group: StemGroup,
  preferAForms: boolean,
  stemEndsInVowel: boolean,
): NumberTable {
  return {
    singular: masculineSingular(group, preferAForms, stemEndsInVowel),
    plural: masculinePlural(group, stemEndsInVowel),
  };
}

const NEUTER_O: NumberTable = {
  singular: table(['о', 'а', 'у', 'о', 'ом', 'і', 'о'], { locative: Alternation.PALATAL_1 }),
  plural: table(['а', '', 'ам', 'а', 'ами', 'ах', 'а']),
};

const NEUTER_E: NumberTable = {
  singular: table(['е', 'я', 'ю', 'е', 'ем', 'і', 'е']),
  plural: table(['я', 'ів', 'ям', 'я', 'ями', 'ях', 'я']),
};

const NEUTER_GEMINATED: NumberTable = {
  singular: table(['я', 'я', 'ю', 'я', 'ям', 'і', 'я']),
  plural: table(['я', 'ів', 'ям', 'я', 'ями', 'ях', 'я']),
};

export function getSecondDeclensionNeuterTable(subtype: NeuterSubtype): NumberTable {
  if (subtype === NeuterSubtype.O) return NEUTER_O;
  if (subtype === NeuterSubtype.GEMINATED) return NEUTER_GEMINATED;
  return NEUTER_E;
}

export function getSecondDeclensionMasculineCaseRule(
  group: StemGroup,
  preferAForms: boolean,
  stemEndsInVowel: boolean,
  number: 'singular' | 'plural',
  caseName: Case,
): CaseRule {
  return getSecondDeclensionMasculineTable(group, preferAForms, stemEndsInVowel)[number][caseName];
}

export function getSecondDeclensionNeuterCaseRule(
  subtype: NeuterSubtype,
  number: 'singular' | 'plural',
  caseName: Case,
): CaseRule {
  return getSecondDeclensionNeuterTable(subtype)[number][caseName];
}
