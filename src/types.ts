export const Case = {
  NOMINATIVE: 'nominative',
  GENITIVE: 'genitive',
  DATIVE: 'dative',
  ACCUSATIVE: 'accusative',
  INSTRUMENTAL: 'instrumental',
  LOCATIVE: 'locative',
  VOCATIVE: 'vocative',
} as const;
export type Case = (typeof Case)[keyof typeof Case];

export const CASES: readonly Case[] = [
  Case.NOMINATIVE,
  Case.GENITIVE,
  Case.DATIVE,
  Case.ACCUSATIVE,
  Case.INSTRUMENTAL,
  Case.LOCATIVE,
  Case.VOCATIVE,
];

export const Gender = {
  MASCULINE: 'masculine',
  FEMININE: 'feminine',
  NEUTER: 'neuter',
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const Animacy = {
  ANIMATE: 'animate',
  INANIMATE: 'inanimate',
} as const;
export type Animacy = (typeof Animacy)[keyof typeof Animacy];

export const GrammaticalNumber = {
  SINGULAR: 'singular',
  PLURAL: 'plural',
} as const;
export type GrammaticalNumber = (typeof GrammaticalNumber)[keyof typeof GrammaticalNumber];

export const DeclensionClass = {
  FIRST: 'first',
  SECOND: 'second',
  THIRD: 'third',
  FOURTH: 'fourth',
} as const;
export type DeclensionClass = (typeof DeclensionClass)[keyof typeof DeclensionClass];

export const StemGroup = {
  HARD: 'hard',
  SOFT: 'soft',
  MIXED: 'mixed',
} as const;
export type StemGroup = (typeof StemGroup)[keyof typeof StemGroup];

export interface DeclensionOptions {
  gender?: Gender;
  animacy?: Animacy;
  number?: GrammaticalNumber;
  declensionClass?: DeclensionClass;
}

export interface WordEntry {
  gender?: Gender;
  animacy?: Animacy;
  declension?: DeclensionClass;
  indeclinable?: boolean;
  /** Explicit override for whether the stem has a fleeting о/е (see core/fleeting-vowel.ts); only needed to opt a word *out* of the ending-based heuristic. */
  fleetingVowel?: boolean;
  forms?: Partial<Record<Case, string>>;
  pluralForms?: Partial<Record<Case, string>>;
}

export interface PersonName {
  firstName?: string;
  patronymic?: string;
  lastName?: string;
}

export interface DeclinedPersonName extends PersonName {
  full: string;
}

export class AmbiguousGenderError extends Error {
  constructor(word: string) {
    super(
      `Cannot determine grammatical gender for "${word}" automatically — pass { gender } explicitly.`,
    );
    this.name = 'AmbiguousGenderError';
  }
}

export class AmbiguousDeclensionClassError extends Error {
  constructor(word: string) {
    super(
      `Cannot determine declension class for "${word}" automatically — pass { declensionClass } explicitly.`,
    );
    this.name = 'AmbiguousDeclensionClassError';
  }
}
