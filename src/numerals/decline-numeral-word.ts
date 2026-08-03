import { Animacy, Gender, type Case } from '../types.js';
import { decline } from '../core/engine.js';
import { getHundredsForms, getTensForms, getUnitForms } from '../data/numerals/numeral-words.js';

function declineTens(n: number, caseName: Case, gender: Gender, animacy: Animacy): string {
  if (n < 20) {
    const forms = getUnitForms(n, gender, animacy);
    if (!forms) {
      throw new RangeError(`declineNumeralWord: unsupported number ${n}`);
    }
    return forms[caseName];
  }
  const tens = Math.floor(n / 10) * 10;
  const units = n % 10;
  const tensForms = getTensForms(tens);
  if (!tensForms) {
    throw new RangeError(`declineNumeralWord: unsupported number ${n}`);
  }
  const tensWord = tensForms[caseName];
  if (units === 0) {
    return tensWord;
  }
  const unitForms = getUnitForms(units, gender, animacy);
  if (!unitForms) {
    throw new RangeError(`declineNumeralWord: unsupported number ${n}`);
  }
  return `${tensWord} ${unitForms[caseName]}`;
}

/**
 * Declines a Ukrainian numeral word (not the noun it counts) for 0-999.
 * Composed from the closed, highly irregular unit/teen/tens/hundreds
 * tables in data/numerals/numeral-words.ts — declining numbers beyond 999
 * (thousands and up) is out of scope for v1.
 */
export function declineNumeralWord(
  count: number,
  caseName: Case,
  gender: Gender = Gender.MASCULINE,
  animacy: Animacy = Animacy.INANIMATE,
): string {
  if (!Number.isInteger(count) || count < 0 || count > 999) {
    throw new RangeError('declineNumeralWord only supports whole numbers from 0 to 999.');
  }
  if (count === 0) {
    return decline('нуль', caseName, { gender: Gender.MASCULINE, animacy: Animacy.INANIMATE });
  }
  if (count < 100) {
    return declineTens(count, caseName, gender, animacy);
  }

  const hundreds = Math.floor(count / 100) * 100;
  const remainder = count % 100;
  const hundredsForms = getHundredsForms(hundreds);
  if (!hundredsForms) {
    throw new RangeError(`declineNumeralWord: unsupported number ${count}`);
  }
  const hundredsWord = hundredsForms[caseName];
  if (remainder === 0) {
    return hundredsWord;
  }
  return `${hundredsWord} ${declineTens(remainder, caseName, gender, animacy)}`;
}
