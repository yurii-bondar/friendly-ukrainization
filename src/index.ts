export {
  Case,
  CASES,
  Gender,
  Animacy,
  GrammaticalNumber,
  DeclensionClass,
  AmbiguousGenderError,
  AmbiguousDeclensionClassError,
  type DeclensionOptions,
  type PersonName,
  type DeclinedPersonName,
} from './types.js';

export { decline, declension, declineAll, detectGender, isIndeclinable } from './core/engine.js';

export { declineName, declineNameAll, detectNameGender } from './names/declineName.js';

export { NumeralForm, getNumeralForm } from './numerals/numeral-form.js';
export { pluralize } from './numerals/pluralize.js';
export { declineWithNumber } from './numerals/decline-with-number.js';
export { declineNumeralWord } from './numerals/decline-numeral-word.js';
