import { Animacy, Case, GrammaticalNumber, type DeclensionOptions } from '../types.js';
import { decline } from '../core/engine.js';
import { getNumeralForm, NumeralForm } from './numeral-form.js';

/**
 * Declines a noun to agree with a preceding count, in a given case. The
 * ONE/FEW/MANY split only forces a genitive-plural form ("п'ять товарів")
 * when the governing case is nominative (or inanimate accusative, which
 * mirrors it); every other case just picks singular-vs-plural of that
 * same case ("п'яти товарам", not a genitive override).
 */
export function declineWithNumber(
  word: string,
  count: number,
  caseName: Case,
  options: DeclensionOptions = {},
): string {
  const form = getNumeralForm(count);
  const animacy = options.animacy ?? Animacy.INANIMATE;
  const isNominativeLike =
    caseName === Case.NOMINATIVE ||
    (caseName === Case.ACCUSATIVE && animacy === Animacy.INANIMATE);

  if (isNominativeLike) {
    if (form === NumeralForm.ONE) {
      return decline(word, caseName, { ...options, animacy, number: GrammaticalNumber.SINGULAR });
    }
    if (form === NumeralForm.FEW) {
      return decline(word, caseName, { ...options, animacy, number: GrammaticalNumber.PLURAL });
    }
    return decline(word, Case.GENITIVE, { ...options, animacy, number: GrammaticalNumber.PLURAL });
  }

  if (caseName === Case.ACCUSATIVE) {
    // Animate accusative: 1 -> singular accusative, 2+ -> genitive plural.
    if (form === NumeralForm.ONE) {
      return decline(word, Case.ACCUSATIVE, { ...options, animacy, number: GrammaticalNumber.SINGULAR });
    }
    return decline(word, Case.GENITIVE, { ...options, animacy, number: GrammaticalNumber.PLURAL });
  }

  // Genitive/dative/instrumental/locative/vocative: singular only for
  // count-form ONE, plural of the same case otherwise — no genitive override.
  const number = form === NumeralForm.ONE ? GrammaticalNumber.SINGULAR : GrammaticalNumber.PLURAL;
  return decline(word, caseName, { ...options, animacy, number });
}
