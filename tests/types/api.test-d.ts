import { expectAssignable, expectError, expectType } from 'tsd';
import {
  Case,
  decline,
  declineAdjective,
  declineAdjectiveAll,
  declineAll,
  declineName,
  declineNameAll,
  declineNumeralWord,
  declineWithNumber,
  detectGender,
  detectNameGender,
  getNumeralForm,
  isIndeclinable,
  pluralize,
  transliterate,
  type DeclinedPersonName,
  type Gender,
  type NumeralForm,
} from '../../src/index.js';

expectType<string>(decline('Ольга', Case.GENITIVE));
expectType<string>(decline('Ольга', Case.GENITIVE, { gender: 'feminine' }));
expectError(decline(123, Case.GENITIVE));
expectError(decline('Ольга', 'not-a-case'));

expectType<Record<Case, string>>(declineAll('Ольга'));

expectType<Gender>(detectGender('Ольга'));

expectType<boolean>(isIndeclinable('пальто'));

expectType<DeclinedPersonName>(declineName({ firstName: 'Ольга' }, Case.GENITIVE));
expectType<Record<Case, DeclinedPersonName>>(declineNameAll({ firstName: 'Ольга' }));
expectType<Gender | undefined>(detectNameGender({ firstName: 'Ольга' }));

expectType<string>(pluralize(5, ['товар', 'товари', 'товарів']));
expectType<NumeralForm>(getNumeralForm(5));
expectAssignable<string>(getNumeralForm(5));
expectType<string>(declineWithNumber('товар', 5, Case.NOMINATIVE));
expectType<string>(declineNumeralWord(5, Case.GENITIVE));

expectType<string>(declineAdjective('молодий', Case.GENITIVE));
expectType<string>(declineAdjective('молодий', Case.GENITIVE, 'feminine', { animacy: 'animate' }));
expectType<Record<Case, string>>(declineAdjectiveAll('молодий'));

expectType<string>(transliterate('Дмитро Ковальчук'));
expectError(transliterate(123));
