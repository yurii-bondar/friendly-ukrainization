import type { Case } from '../../types.js';
import type { Alternation } from '../alternation.js';

export interface CaseRule {
  suffix: string;
  alternation?: Alternation;
}

export type CaseSuffixTable = Record<Case, CaseRule>;

export interface NumberTable {
  singular: CaseSuffixTable;
  plural: CaseSuffixTable;
}

function rule(suffix: string, alternation?: Alternation): CaseRule {
  return alternation ? { suffix, alternation } : { suffix };
}

/** Builds a full 7-case table from an ordered tuple, in Case-enum order. */
export function table(
  [nom, gen, dat, acc, instr, loc, voc]: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ],
  alternations: Partial<Record<Case, Alternation>> = {},
): CaseSuffixTable {
  return {
    nominative: rule(nom, alternations.nominative),
    genitive: rule(gen, alternations.genitive),
    dative: rule(dat, alternations.dative),
    accusative: rule(acc, alternations.accusative),
    instrumental: rule(instr, alternations.instrumental),
    locative: rule(loc, alternations.locative),
    vocative: rule(voc, alternations.vocative),
  };
}

/**
 * Substitutes a suffix's *leading* я/ю with its plain counterpart (а/у) —
 * used to derive "mixed" group tables from "soft" ones, since Ukrainian
 * orthography forbids я/ю directly after ж,ч,ш,щ. Only the first character
 * is checked: a suffix like "ею" is unaffected because the я/ю isn't
 * adjacent to the stem-final consonant, e.g. груша -> грушею (not "грушеу").
 */
export function deIotify(caseSuffixTable: CaseSuffixTable): CaseSuffixTable {
  const swap = (s: string): string => {
    if (s.startsWith('я')) return `а${s.slice(1)}`;
    if (s.startsWith('ю')) return `у${s.slice(1)}`;
    return s;
  };
  const entries = Object.entries(caseSuffixTable) as [Case, CaseRule][];
  return Object.fromEntries(
    entries.map(([caseName, r]) => [caseName, { ...r, suffix: swap(r.suffix) }]),
  ) as CaseSuffixTable;
}

/**
 * Substitutes a suffix's *leading* е/і with its post-vowel counterpart
 * (є/ї) — used to derive the vowel-final-stem variant of a soft-group
 * table (Юрій -> Юрі- + suffix) from the consonant-final-stem variant,
 * e.g. dative -еві -> -єві, locative -і -> -ї.
 */
export function toVowelStemVariant(caseSuffixTable: CaseSuffixTable): CaseSuffixTable {
  const swap = (s: string): string => {
    if (s.startsWith('е')) return `є${s.slice(1)}`;
    if (s.startsWith('і')) return `ї${s.slice(1)}`;
    return s;
  };
  const entries = Object.entries(caseSuffixTable) as [Case, CaseRule][];
  return Object.fromEntries(
    entries.map(([caseName, r]) => [caseName, { ...r, suffix: swap(r.suffix) }]),
  ) as CaseSuffixTable;
}
