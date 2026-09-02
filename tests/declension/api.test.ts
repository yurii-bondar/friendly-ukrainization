import { describe, expect, it } from 'vitest';
import { Case, decline, declension, declineAll, isIndeclinable } from '../../src/index.js';

describe('declineAll / declension / isIndeclinable', () => {
  it('declineAll returns every case keyed by the Case enum', () => {
    const all = declineAll('рука');
    expect(all[Case.NOMINATIVE]).toBe('рука');
    expect(all[Case.GENITIVE]).toBe('руки');
    expect(all[Case.DATIVE]).toBe('руці');
    expect(all[Case.VOCATIVE]).toBe('руко');
  });

  it('declension is an alias for decline', () => {
    expect(declension('рука', Case.GENITIVE)).toBe(decline('рука', Case.GENITIVE));
  });

  it('isIndeclinable reports exceptions-dictionary indeclinable nouns', () => {
    expect(isIndeclinable('пальто')).toBe(true);
    expect(isIndeclinable('рука')).toBe(false);
  });

  it('uses genitive plural for an animate plural accusative referent', () => {
    expect(decline('студент', Case.ACCUSATIVE, { animacy: 'animate', number: 'plural' })).toBe('студентів');
    expect(decline('студент', Case.GENITIVE, { number: 'plural' })).toBe('студентів');
  });

  it('uses nominative plural for an inanimate (default) plural accusative referent', () => {
    expect(decline('товар', Case.ACCUSATIVE, { number: 'plural' })).toBe('товари');
    expect(decline('товар', Case.NOMINATIVE, { number: 'plural' })).toBe('товари');
  });
});
