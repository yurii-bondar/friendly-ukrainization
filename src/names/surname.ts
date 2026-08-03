import { Animacy, Case as CaseEnum, Gender, type Case } from '../types.js';
import { decline } from '../core/engine.js';
import { restoreCasing } from '../utils/casing.js';
import { isVowel } from '../utils/text.js';
import { table, type CaseSuffixTable } from '../core/rules/types.js';

const ADJECTIVAL_MASCULINE = /(ськ|цьк|зьк)ий$/i;
const ADJECTIVAL_FEMININE = /(ськ|цьк|зьк)а$/i;
const KO_SURNAME = /(ко)$/i;

const ADJ_MASC: CaseSuffixTable = table(['ий', 'ого', 'ому', 'ий', 'им', 'ому', 'ий']);
const ADJ_FEM: CaseSuffixTable = table(['а', 'ої', 'ій', 'у', 'ою', 'ій', 'а']);

function declineAdjectivalSurname(word: string, caseName: Case, gender: Gender): string {
  const trimmed = word.trim();
  const lower = trimmed.toLowerCase();
  const isMasc = gender === Gender.MASCULINE;
  const stem = isMasc ? lower.slice(0, -2) : lower.slice(0, -1);
  const table_ = isMasc ? ADJ_MASC : ADJ_FEM;
  // Masculine adjectival surnames are always animate (a person), so the
  // accusative equals the genitive, same as regular 2nd-declension masc nouns.
  const rule = isMasc && caseName === CaseEnum.ACCUSATIVE ? table_.genitive : table_[caseName];
  return restoreCasing(trimmed, stem + rule.suffix);
}

function isKoSurname(lower: string): boolean {
  return KO_SURNAME.test(lower);
}

function declineSurnameSingle(word: string, caseName: Case, gender: Gender): string {
  const trimmed = word.trim();
  const lower = trimmed.toLowerCase();

  if (isKoSurname(lower)) {
    return word;
  }
  if (ADJECTIVAL_MASCULINE.test(lower) || ADJECTIVAL_FEMININE.test(lower)) {
    return declineAdjectivalSurname(word, caseName, gender);
  }

  const lastChar = lower.charAt(lower.length - 1);
  const endsInConsonant = !isVowel(lastChar) && lastChar !== 'ь';
  if (endsInConsonant && gender === Gender.FEMININE) {
    // A consonant-final surname is indeclinable for a female bearer
    // (Ковальчук stays Ковальчук for her, but declines for him).
    return word;
  }

  return decline(word, caseName, { gender, animacy: Animacy.ANIMATE });
}

export function declineSurname(word: string, caseName: Case, gender: Gender): string {
  const trimmed = word.trim();
  if (trimmed.includes('-')) {
    return trimmed
      .split('-')
      .map((part) => declineSurnameSingle(part, caseName, gender))
      .join('-');
  }
  return declineSurnameSingle(trimmed, caseName, gender);
}

export function detectSurnameGender(word: string): Gender | undefined {
  const lower = word.trim().toLowerCase();
  if (ADJECTIVAL_MASCULINE.test(lower)) {
    return Gender.MASCULINE;
  }
  if (ADJECTIVAL_FEMININE.test(lower)) {
    return Gender.FEMININE;
  }
  return undefined;
}
