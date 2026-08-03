import { describe, expect, it } from 'vitest';
import { Case, decline } from '../../src/index.js';

describe('3rd declension (feminine consonant/-ь nouns)', () => {
  it('declines радість (soft group) through genitive/dative/locative/plural', () => {
    expect(decline('радість', Case.GENITIVE)).toBe('радості');
    expect(decline('радість', Case.DATIVE)).toBe('радості');
    expect(decline('радість', Case.LOCATIVE)).toBe('радості');
    expect(decline('радість', Case.NOMINATIVE, { number: 'plural' })).toBe('радості');
    expect(decline('радість', Case.DATIVE, { number: 'plural' })).toBe('радостям');
  });

  it('declines любов with the -в apostrophe instrumental and regular genitive', () => {
    expect(decline('любов', Case.GENITIVE)).toBe('любові');
    expect(decline('любов', Case.INSTRUMENTAL)).toBe("любов'ю");
  });

  it('declines a mixed-group (sibilant-final) noun in the plural, de-iotifying the ям/ями/ях endings', () => {
    expect(decline('розкіш', Case.NOMINATIVE, { number: 'plural' })).toBe('розкіші');
    expect(decline('розкіш', Case.DATIVE, { number: 'plural' })).toBe('розкішам');
    expect(decline('розкіш', Case.GENITIVE, { number: 'plural' })).toBe('розкішей');
  });
});
