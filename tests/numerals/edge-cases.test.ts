import { describe, expect, it } from 'vitest';
import { Case, declineNumeralWord, declineWithNumber } from '../../src/index.js';

describe('declineWithNumber animate accusative', () => {
  it('uses singular accusative for count 1 and genitive plural for 2+ when animate', () => {
    expect(declineWithNumber('студент', 1, Case.ACCUSATIVE, { animacy: 'animate' })).toBe('студента');
    expect(declineWithNumber('студент', 5, Case.ACCUSATIVE, { animacy: 'animate' })).toBe('студентів');
  });
});

describe('declineNumeralWord composition edge cases', () => {
  it('declines zero as the regular noun "нуль"', () => {
    expect(declineNumeralWord(0, Case.GENITIVE)).toBe('нуля');
  });

  it('declines an exact multiple of ten with no trailing unit', () => {
    expect(declineNumeralWord(20, Case.GENITIVE)).toBe('двадцяти');
  });

  it('declines a three-digit number with hundreds + tens + units', () => {
    expect(declineNumeralWord(305, Case.NOMINATIVE)).toBe("триста п'ять");
  });

  it('resolves the animate accusative for two and reflects gender for units', () => {
    expect(declineNumeralWord(2, Case.ACCUSATIVE, 'masculine', 'animate')).toBe('двох');
    expect(declineNumeralWord(3, Case.NOMINATIVE, 'feminine')).toBe('три');
  });

  it('rejects non-integer input', () => {
    expect(() => declineNumeralWord(1.5, Case.NOMINATIVE)).toThrow(RangeError);
  });
});
