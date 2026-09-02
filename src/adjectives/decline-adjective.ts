import { Animacy, CASES, Case as CaseEnum, Gender, GrammaticalNumber, type Case } from '../types.js';
import { restoreCasing } from '../utils/casing.js';

type CaseForms = Record<Case, string>;

function forms(
  nominative: string,
  genitive: string,
  dative: string,
  accusative: string,
  instrumental: string,
  locative: string,
  vocative: string,
): CaseForms {
  return {
    [CaseEnum.NOMINATIVE]: nominative,
    [CaseEnum.GENITIVE]: genitive,
    [CaseEnum.DATIVE]: dative,
    [CaseEnum.ACCUSATIVE]: accusative,
    [CaseEnum.INSTRUMENTAL]: instrumental,
    [CaseEnum.LOCATIVE]: locative,
    [CaseEnum.VOCATIVE]: vocative,
  };
}

/** Hard-group adjectives (e.g. молодий, великий) — the vast majority. */
const HARD: Record<Gender, CaseForms> & { plural: CaseForms } = {
  [Gender.MASCULINE]: forms('ий', 'ого', 'ому', 'ий', 'им', 'ому', 'ий'),
  [Gender.FEMININE]: forms('а', 'ої', 'ій', 'у', 'ою', 'ій', 'а'),
  [Gender.NEUTER]: forms('е', 'ого', 'ому', 'е', 'им', 'ому', 'е'),
  plural: forms('і', 'их', 'им', 'і', 'ими', 'их', 'і'),
};

/** Soft-group adjectives — the small closed set ending in -ій (синій, останній, справжній). */
const SOFT: Record<Gender, CaseForms> & { plural: CaseForms } = {
  [Gender.MASCULINE]: forms('ій', 'ього', 'ьому', 'ій', 'ім', 'ьому', 'ій'),
  [Gender.FEMININE]: forms('я', 'ьої', 'ій', 'ю', 'ьою', 'ій', 'я'),
  [Gender.NEUTER]: forms('є', 'ього', 'ьому', 'є', 'ім', 'ьому', 'є'),
  plural: forms('і', 'іх', 'ім', 'і', 'іми', 'іх', 'і'),
};

interface AdjectiveDeclensionOptions {
  number?: GrammaticalNumber;
  animacy?: Animacy;
}

function detectStem(lower: string, word: string): { stem: string; table: typeof HARD } {
  if (lower.endsWith('ій')) {
    return { stem: lower.slice(0, -2), table: SOFT };
  }
  if (lower.endsWith('ий')) {
    return { stem: lower.slice(0, -2), table: HARD };
  }
  throw new RangeError(
    `declineAdjective: "${word}" is not a recognized masculine nominative singular adjective (expected an -ий/-ій ending).`,
  );
}

/**
 * Declines a Ukrainian adjective to agree with a noun in gender, number and
 * case. `word` must be given in its dictionary form — masculine nominative
 * singular (e.g. "молодий", "синій") — the same convention used for nouns
 * looked up by their nominative singular.
 */
export function declineAdjective(
  word: string,
  caseName: Case,
  gender: Gender = Gender.MASCULINE,
  options: AdjectiveDeclensionOptions = {},
): string {
  const trimmed = word.trim();
  const lower = trimmed.toLowerCase();
  const { stem, table } = detectStem(lower, word);

  const number = options.number === GrammaticalNumber.PLURAL ? 'plural' : 'singular';
  const animacy = options.animacy ?? Animacy.INANIMATE;
  const paradigm = number === 'plural' ? table.plural : table[gender];

  // Accusative = genitive for an animate referent: masculine singular, and
  // every gender in the plural (feminine/neuter singular never distinguish).
  const isAnimateAccusative =
    caseName === CaseEnum.ACCUSATIVE &&
    animacy === Animacy.ANIMATE &&
    (number === 'plural' || gender === Gender.MASCULINE);
  const effectiveCase = isAnimateAccusative ? CaseEnum.GENITIVE : caseName;

  return restoreCasing(trimmed, stem + paradigm[effectiveCase]);
}

export function declineAdjectiveAll(
  word: string,
  gender: Gender = Gender.MASCULINE,
  options: AdjectiveDeclensionOptions = {},
): Record<Case, string> {
  const entries = CASES.map((c) => [c, declineAdjective(word, c, gender, options)] as const);
  return Object.fromEntries(entries) as Record<Case, string>;
}
