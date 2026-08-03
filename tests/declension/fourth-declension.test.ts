import { describe, expect, it } from 'vitest';
import { Case, decline } from '../../src/index.js';

describe('4th declension (young creatures)', () => {
  it('declines теля (-я extension) through the full singular paradigm', () => {
    expect(decline('теля', Case.NOMINATIVE)).toBe('теля');
    expect(decline('теля', Case.GENITIVE)).toBe('теляти');
    expect(decline('теля', Case.DATIVE)).toBe('теляті');
    expect(decline('теля', Case.ACCUSATIVE)).toBe('теля');
    expect(decline('теля', Case.INSTRUMENTAL)).toBe('телям');
    expect(decline('теля', Case.LOCATIVE)).toBe('теляті');
    expect(decline('теля', Case.VOCATIVE)).toBe('теля');
  });

  it('declines теля through the full plural paradigm', () => {
    expect(decline('теля', Case.NOMINATIVE, { number: 'plural' })).toBe('телята');
    expect(decline('теля', Case.GENITIVE, { number: 'plural' })).toBe('телят');
    expect(decline('теля', Case.DATIVE, { number: 'plural' })).toBe('телятам');
    expect(decline('теля', Case.ACCUSATIVE, { number: 'plural', animacy: 'animate' })).toBe('телят');
    expect(decline('теля', Case.INSTRUMENTAL, { number: 'plural' })).toBe('телятами');
    expect(decline('теля', Case.LOCATIVE, { number: 'plural' })).toBe('телятах');
  });

  it('declines лоша (-а extension after a sibilant) with de-iotified instrumental', () => {
    expect(decline('лоша', Case.GENITIVE)).toBe('лошати');
    expect(decline('лоша', Case.INSTRUMENTAL)).toBe('лошам');
    expect(decline('лоша', Case.NOMINATIVE, { number: 'plural' })).toBe('лошата');
  });
});
