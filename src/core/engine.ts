import {
  Animacy,
  CASES,
  Case as CaseEnum,
  DeclensionClass,
  Gender,
  GrammaticalNumber,
  StemGroup,
  type Case,
  type DeclensionOptions,
  type WordEntry,
} from '../types.js';
import { EXCEPTIONS } from '../data/exceptions/index.js';
import { normalizeApostrophe } from '../utils/apostrophe.js';
import { restoreCasing } from '../utils/casing.js';
import { isVowel, isSibilant, lastChar } from '../utils/text.js';
import { detectGender } from './detect-gender.js';
import { detectDeclensionClass } from './detect-declension-class.js';
import { splitStem } from './stem-split.js';
import { detectFirstDeclensionGroup, detectSecondDeclensionGroup } from './stem-group.js';
import { applyAlternation } from './alternation.js';
import { hasFleetingVowel, dropFleetingVowel, insertGenitivePluralEpenthesis } from './fleeting-vowel.js';
import { getFirstDeclensionCaseRule } from './rules/first-declension.js';
import {
  detectNeuterSubtype,
  getSecondDeclensionMasculineCaseRule,
  getSecondDeclensionNeuterCaseRule,
} from './rules/second-declension.js';
import {
  getThirdDeclensionTable,
  formThirdDeclensionInstrumental,
  applyIstOstAlternation,
} from './rules/third-declension.js';
import { detectFourthDeclensionExtension, getFourthDeclensionTable } from './rules/fourth-declension.js';

function resolvedNumber(options: DeclensionOptions | undefined): 'singular' | 'plural' {
  return options?.number === GrammaticalNumber.PLURAL ? 'plural' : 'singular';
}

export function decline(word: string, caseName: Case, options: DeclensionOptions = {}): string {
  const trimmed = word.trim();
  const normalized = normalizeApostrophe(trimmed);
  const lower = normalized.toLowerCase();
  const entry = options.exceptions?.[lower] ?? EXCEPTIONS[lower];
  const number = resolvedNumber(options);

  if (entry) {
    const formsMap = number === 'plural' ? entry.pluralForms : entry.forms;
    const override = formsMap?.[caseName];
    if (override !== undefined) {
      return restoreCasing(normalized, override);
    }
    if (entry.indeclinable) {
      return word;
    }
  }

  const animacy = options.animacy ?? entry?.animacy ?? Animacy.INANIMATE;
  const gender = options.gender ?? entry?.gender ?? detectGender(lower);
  const { stem, ending } = splitStem(lower);
  const declensionClass =
    options.declensionClass ?? entry?.declension ?? detectDeclensionClass(stem, ending, gender);

  // Plural accusative = genitive for animate referents, nominative otherwise
  // (true across every gender/declension in Ukrainian).
  if (caseName === CaseEnum.ACCUSATIVE && number === 'plural') {
    const target = animacy === Animacy.ANIMATE ? CaseEnum.GENITIVE : CaseEnum.NOMINATIVE;
    return decline(word, target, { ...options, gender, declensionClass, animacy });
  }

  // Masculine 2nd-declension singular accusative follows the same rule.
  if (
    caseName === CaseEnum.ACCUSATIVE &&
    number === 'singular' &&
    declensionClass === DeclensionClass.SECOND &&
    gender === Gender.MASCULINE
  ) {
    const target = animacy === Animacy.ANIMATE ? CaseEnum.GENITIVE : CaseEnum.NOMINATIVE;
    return decline(word, target, { ...options, gender, declensionClass, animacy });
  }

  let result: string;

  if (declensionClass === DeclensionClass.FIRST) {
    const stemEndsInVowel = isVowel(lastChar(stem));
    const group = detectFirstDeclensionGroup(stem, ending);
    const rule = getFirstDeclensionCaseRule(group, stemEndsInVowel, number, caseName);
    let resultStem = stem;
    if (caseName === CaseEnum.GENITIVE && number === 'plural' && rule.suffix === '') {
      resultStem = insertGenitivePluralEpenthesis(stem);
    }
    if (rule.alternation) {
      resultStem = applyAlternation(resultStem, rule.alternation);
    }
    result = resultStem + rule.suffix;
  } else if (declensionClass === DeclensionClass.SECOND && gender === Gender.NEUTER) {
    const subtype = detectNeuterSubtype(stem, ending);
    const rule = getSecondDeclensionNeuterCaseRule(subtype, number, caseName);
    let resultStem = stem;
    if (caseName === CaseEnum.GENITIVE && number === 'plural' && rule.suffix === '') {
      resultStem = insertGenitivePluralEpenthesis(stem);
    }
    if (rule.alternation) {
      resultStem = applyAlternation(resultStem, rule.alternation);
    }
    result = resultStem + rule.suffix;
  } else if (declensionClass === DeclensionClass.SECOND) {
    const group = detectSecondDeclensionGroup(stem, ending);
    const explicitAnimacy = options.animacy ?? entry?.animacy;
    const preferAForms = explicitAnimacy !== Animacy.INANIMATE;
    const stemEndsInVowel = isVowel(lastChar(stem));
    const rule = getSecondDeclensionMasculineCaseRule(group, preferAForms, stemEndsInVowel, number, caseName);
    let resultStem = stem;
    const fleeting = entry?.fleetingVowel ?? hasFleetingVowel(stem);
    const suffixStartsWithVowel = rule.suffix.length > 0 && isVowel(rule.suffix.charAt(0));
    if (fleeting && suffixStartsWithVowel) {
      resultStem = dropFleetingVowel(resultStem);
    }
    if (rule.alternation) {
      resultStem = applyAlternation(resultStem, rule.alternation);
    }
    result = resultStem + rule.suffix;
  } else if (declensionClass === DeclensionClass.THIRD) {
    if (caseName === CaseEnum.INSTRUMENTAL && number === 'singular') {
      result = formThirdDeclensionInstrumental(stem);
    } else {
      const group = isSibilant(lastChar(stem)) ? StemGroup.MIXED : StemGroup.SOFT;
      const rule = getThirdDeclensionTable(group)[number][caseName];
      const isBareSingular =
        number === 'singular' &&
        (caseName === CaseEnum.NOMINATIVE ||
          caseName === CaseEnum.ACCUSATIVE ||
          caseName === CaseEnum.VOCATIVE);
      const resultStem = isBareSingular ? stem : applyIstOstAlternation(stem);
      result = resultStem + rule.suffix;
    }
  } else {
    const extension = detectFourthDeclensionExtension(ending);
    const needsDeIotify = ending === 'а';
    const rule = getFourthDeclensionTable(extension, needsDeIotify, ending)[number][caseName];
    result = stem + rule.suffix;
  }

  return restoreCasing(normalized, result);
}

export function declension(word: string, caseName: Case, options?: DeclensionOptions): string {
  return decline(word, caseName, options);
}

export function declineAll(word: string, options?: DeclensionOptions): Record<Case, string> {
  const entries = CASES.map((c) => [c, decline(word, c, options)] as const);
  return Object.fromEntries(entries) as Record<Case, string>;
}

export { detectGender } from './detect-gender.js';

export function isIndeclinable(word: string, exceptions?: Record<string, WordEntry>): boolean {
  const lower = normalizeApostrophe(word.trim()).toLowerCase();
  const entry = exceptions?.[lower] ?? EXCEPTIONS[lower];
  return entry?.indeclinable ?? false;
}
