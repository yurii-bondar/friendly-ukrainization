import { Animacy, Gender, type Case } from '../types.js';
import { decline } from '../core/engine.js';
import { getHundredsForms, getTensForms, getUnitForms } from '../data/numerals/numeral-words.js';
import { declineWithNumber } from './decline-with-number.js';

/** Scale words above 999, largest first. Each is a regular noun the group count agrees with (see declineWithNumber), and each group's own 1-999 digits agree in the scale word's gender, not the caller's. */
const SCALES: ReadonlyArray<{ value: number; word: string; gender: Gender }> = [
  { value: 1_000_000_000_000, word: 'трильйон', gender: Gender.MASCULINE },
  { value: 1_000_000_000, word: 'мільярд', gender: Gender.MASCULINE },
  { value: 1_000_000, word: 'мільйон', gender: Gender.MASCULINE },
  { value: 1_000, word: 'тисяча', gender: Gender.FEMININE },
];

const MAX_SUPPORTED = SCALES.reduce((sum, scale) => sum + scale.value * 999, 999);

// Below, every "!forms" guard is unreachable via the public API: n is
// always in a range the corresponding data table fully covers (1-19,
// 20/30/.../90, 100/200/.../900). They exist only because getUnitForms/
// getTensForms/getHundredsForms return `Forms | undefined` for the general
// case, which TypeScript's noUncheckedIndexedAccess otherwise flags.
function declineUnitsGroup(n: number, caseName: Case, gender: Gender, animacy: Animacy): string {
  if (n < 20) {
    const forms = getUnitForms(n, gender, animacy);
    /* v8 ignore next 3 */
    if (!forms) {
      throw new RangeError(`declineNumeralWord: unsupported number ${n}`);
    }
    return forms[caseName];
  }
  if (n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const units = n % 10;
    const tensForms = getTensForms(tens);
    /* v8 ignore next 3 */
    if (!tensForms) {
      throw new RangeError(`declineNumeralWord: unsupported number ${n}`);
    }
    const tensWord = tensForms[caseName];
    if (units === 0) {
      return tensWord;
    }
    const unitForms = getUnitForms(units, gender, animacy);
    /* v8 ignore next 3 */
    if (!unitForms) {
      throw new RangeError(`declineNumeralWord: unsupported number ${n}`);
    }
    return `${tensWord} ${unitForms[caseName]}`;
  }

  const hundreds = Math.floor(n / 100) * 100;
  const remainder = n % 100;
  const hundredsForms = getHundredsForms(hundreds);
  /* v8 ignore next 3 */
  if (!hundredsForms) {
    throw new RangeError(`declineNumeralWord: unsupported number ${n}`);
  }
  const hundredsWord = hundredsForms[caseName];
  if (remainder === 0) {
    return hundredsWord;
  }
  return `${hundredsWord} ${declineUnitsGroup(remainder, caseName, gender, animacy)}`;
}

/**
 * Declines a Ukrainian numeral word (not the noun it counts) for whole
 * numbers 0 up to 999 trillion. Composed from the closed, highly irregular
 * unit/teen/tens/hundreds tables in data/numerals/numeral-words.ts, plus a
 * scale noun (тисяча/мільйон/мільярд/трильйон) per group of 3 digits above
 * 999 — each scale noun is declined with declineWithNumber to agree with
 * its own group's count, and that group's 1-999 digit words take the scale
 * noun's grammatical gender (e.g. "двадцять одна тисяча", "два мільйони"),
 * not the gender/animacy passed for the trailing units group.
 */
export function declineNumeralWord(
  count: number,
  caseName: Case,
  gender: Gender = Gender.MASCULINE,
  animacy: Animacy = Animacy.INANIMATE,
): string {
  if (!Number.isInteger(count) || count < 0 || count > MAX_SUPPORTED) {
    throw new RangeError(`declineNumeralWord only supports whole numbers from 0 to ${MAX_SUPPORTED}.`);
  }
  if (count === 0) {
    return decline('нуль', caseName, { gender: Gender.MASCULINE, animacy: Animacy.INANIMATE });
  }

  const parts: string[] = [];
  let remaining = count;
  for (const scale of SCALES) {
    const groupValue = Math.floor(remaining / scale.value);
    remaining %= scale.value;
    if (groupValue > 0) {
      const digits = declineUnitsGroup(groupValue, caseName, scale.gender, Animacy.INANIMATE);
      const scaleWord = declineWithNumber(scale.word, groupValue, caseName, { gender: scale.gender });
      parts.push(`${digits} ${scaleWord}`);
    }
  }
  if (remaining > 0) {
    parts.push(declineUnitsGroup(remaining, caseName, gender, animacy));
  }
  return parts.join(' ');
}
