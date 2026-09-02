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

  it('reconstructs the bare nominative/accusative/vocative singular exactly, with or without a trailing ь', () => {
    // радість peels off a trailing ь (splitStem) and must get it back;
    // любов has no trailing ь to begin with and must not gain one.
    expect(decline('радість', Case.NOMINATIVE)).toBe('радість');
    expect(decline('радість', Case.ACCUSATIVE)).toBe('радість');
    expect(decline('радість', Case.VOCATIVE)).toBe('радість');
    expect(decline('любов', Case.NOMINATIVE)).toBe('любов');
    expect(decline('любов', Case.ACCUSATIVE)).toBe('любов');
  });

  it('doubles a single final consonant in the instrumental singular (подорож -> подорожжю)', () => {
    // ніч/річ/любов are bundled exceptions-dictionary overrides, so they'd
    // exercise the exceptions lookup rather than this rule; подорож isn't.
    expect(decline('подорож', Case.INSTRUMENTAL)).toBe('подорожжю');
  });

  it('adds a plain -ю with no doubling after an existing consonant cluster (радість -> радістю)', () => {
    expect(decline('радість', Case.INSTRUMENTAL)).toBe('радістю');
  });
});
