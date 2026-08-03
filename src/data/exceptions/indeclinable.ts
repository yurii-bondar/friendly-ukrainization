import { Gender, type WordEntry } from '../../types.js';

/**
 * Indeclinable common nouns — mostly unassimilated loanwords ending in a
 * vowel that Ukrainian morphology can't attach case endings to.
 */
const INDECLINABLE_NEUTER_NOUNS = [
  'пальто', 'кіно', 'метро', 'радіо', 'таксі', 'кафе', 'меню', 'журі', 'бюро',
  'депо', 'піаніно', 'какао', 'кашне', 'колібрі', 'ательє', 'портфоліо', 'шосе',
];

export const INDECLINABLE_EXCEPTIONS: Record<string, WordEntry> = Object.fromEntries(
  INDECLINABLE_NEUTER_NOUNS.map((word) => [word, { gender: Gender.NEUTER, indeclinable: true }]),
);
