import { describe, expect, it } from 'vitest';
import { Case, decline, declineAll, Gender, isIndeclinable } from '../../src/index.js';

describe('custom exceptions (options.exceptions)', () => {
  it('overrides the rule engine for a word supplied via options', () => {
    const exceptions = {
      кутюк: {
        gender: Gender.MASCULINE,
        forms: { [Case.GENITIVE]: 'кутюка-особливий' },
      },
    };
    expect(decline('кутюк', Case.GENITIVE, { exceptions })).toBe('кутюка-особливий');
  });

  it('is independent per call and does not leak into calls without it', () => {
    const exceptions = { бренд: { forms: { [Case.GENITIVE]: 'брендаZ' } } };
    expect(decline('бренд', Case.GENITIVE, { exceptions })).toBe('брендаZ');
    expect(decline('бренд', Case.GENITIVE)).toBe('бренда');
  });

  it('takes priority over a bundled exception for the same word', () => {
    const exceptions = { мати: { gender: Gender.FEMININE, forms: { [Case.GENITIVE]: 'матиCUSTOM' } } };
    expect(decline('мати', Case.GENITIVE, { exceptions })).toBe('матиCUSTOM');
  });

  it('flows through declineAll', () => {
    const exceptions = { гаджет: { forms: { [Case.INSTRUMENTAL]: 'гаджетомX' } } };
    expect(declineAll('гаджет', { exceptions }).instrumental).toBe('гаджетомX');
  });

  it('can mark a custom word indeclinable', () => {
    const exceptions = { бренд: { indeclinable: true } };
    expect(decline('бренд', Case.GENITIVE, { exceptions })).toBe('бренд');
    expect(isIndeclinable('бренд', exceptions)).toBe(true);
    expect(isIndeclinable('бренд')).toBe(false);
  });
});
