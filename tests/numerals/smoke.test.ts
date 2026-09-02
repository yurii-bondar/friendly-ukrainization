import { describe, expect, it } from 'vitest';
import {
  Case,
  declineNumeralWord,
  declineWithNumber,
  getNumeralForm,
  NumeralForm,
  pluralize,
} from '../../src/index.js';

describe('numerals smoke', () => {
  it('classifies count agreement forms, including the 11-14 exception', () => {
    expect(getNumeralForm(1)).toBe(NumeralForm.ONE);
    expect(getNumeralForm(21)).toBe(NumeralForm.ONE);
    expect(getNumeralForm(2)).toBe(NumeralForm.FEW);
    expect(getNumeralForm(3)).toBe(NumeralForm.FEW);
    expect(getNumeralForm(24)).toBe(NumeralForm.FEW);
    expect(getNumeralForm(5)).toBe(NumeralForm.MANY);
    expect(getNumeralForm(11)).toBe(NumeralForm.MANY);
    expect(getNumeralForm(12)).toBe(NumeralForm.MANY);
    expect(getNumeralForm(14)).toBe(NumeralForm.MANY);
    expect(getNumeralForm(0)).toBe(NumeralForm.MANY);
  });

  it('pluralizes a static tuple of forms', () => {
    expect(pluralize(1, ['товар', 'товари', 'товарів'])).toBe('товар');
    expect(pluralize(2, ['товар', 'товари', 'товарів'])).toBe('товари');
    expect(pluralize(5, ['товар', 'товари', 'товарів'])).toBe('товарів');
    expect(pluralize(21, ['товар', 'товари', 'товарів'])).toBe('товар');
  });

  it('declines a noun to agree with a count in nominative context', () => {
    expect(declineWithNumber('товар', 1, Case.NOMINATIVE)).toBe('товар');
    expect(declineWithNumber('товар', 2, Case.NOMINATIVE)).toBe('товари');
    expect(declineWithNumber('товар', 5, Case.NOMINATIVE)).toBe('товарів');
    expect(declineWithNumber('товар', 21, Case.NOMINATIVE)).toBe('товар');
  });

  it('does not force genitive outside nominative/inanimate-accusative context', () => {
    expect(declineWithNumber('товар', 1, Case.DATIVE)).toBe('товару');
    expect(declineWithNumber('товар', 5, Case.DATIVE)).toBe('товарам');
    expect(declineWithNumber('товар', 5, Case.INSTRUMENTAL)).toBe('товарами');
  });

  it('declines numeral words for small numbers', () => {
    expect(declineNumeralWord(5, Case.GENITIVE)).toBe("п'яти");
    expect(declineNumeralWord(1, Case.NOMINATIVE, 'feminine')).toBe('одна');
    expect(declineNumeralWord(2, Case.NOMINATIVE, 'feminine')).toBe('дві');
  });

  it('composes numeral words for tens and hundreds', () => {
    expect(declineNumeralWord(21, Case.NOMINATIVE, 'masculine')).toBe('двадцять один');
    expect(declineNumeralWord(100, Case.NOMINATIVE)).toBe('сто');
    expect(declineNumeralWord(125, Case.GENITIVE)).toBe("ста двадцяти п'яти");
  });

  it('declines thousands, millions and billions as scale-noun groups', () => {
    expect(declineNumeralWord(1000, Case.NOMINATIVE)).toBe('одна тисяча');
    expect(declineNumeralWord(2000, Case.NOMINATIVE)).toBe('дві тисячі');
    expect(declineNumeralWord(21000, Case.NOMINATIVE)).toBe('двадцять одна тисяча');
    expect(declineNumeralWord(125000, Case.GENITIVE)).toBe("ста двадцяти п'яти тисяч");
    expect(declineNumeralWord(1_000_000, Case.NOMINATIVE)).toBe('один мільйон');
    expect(declineNumeralWord(2_000_000, Case.NOMINATIVE)).toBe('два мільйони');
    expect(declineNumeralWord(1_000_000_000, Case.NOMINATIVE)).toBe('один мільярд');
    expect(declineNumeralWord(1001, Case.NOMINATIVE)).toBe('одна тисяча один');
  });

  it('rejects numbers outside the supported range', () => {
    expect(() => declineNumeralWord(1e15, Case.NOMINATIVE)).toThrow(RangeError);
    expect(() => declineNumeralWord(-1, Case.NOMINATIVE)).toThrow(RangeError);
  });
});
