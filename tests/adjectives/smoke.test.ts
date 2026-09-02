import { describe, expect, it } from 'vitest';
import { Animacy, Case, declineAdjective, declineAdjectiveAll, Gender, GrammaticalNumber } from '../../src/index.js';

describe('declineAdjective (hard group)', () => {
  it('declines masculine, feminine, and neuter singular', () => {
    expect(declineAdjective('молодий', Case.GENITIVE, Gender.MASCULINE)).toBe('молодого');
    expect(declineAdjective('молодий', Case.DATIVE, Gender.FEMININE)).toBe('молодій');
    expect(declineAdjective('молодий', Case.INSTRUMENTAL, Gender.NEUTER)).toBe('молодим');
  });

  it('declines the plural', () => {
    expect(declineAdjective('молодий', Case.NOMINATIVE, Gender.MASCULINE, { number: GrammaticalNumber.PLURAL })).toBe(
      'молоді',
    );
    expect(declineAdjective('молодий', Case.GENITIVE, Gender.MASCULINE, { number: GrammaticalNumber.PLURAL })).toBe(
      'молодих',
    );
  });

  it('uses genitive-as-accusative for an animate referent (masculine singular and any plural)', () => {
    expect(declineAdjective('молодий', Case.ACCUSATIVE, Gender.MASCULINE, { animacy: Animacy.ANIMATE })).toBe(
      'молодого',
    );
    expect(
      declineAdjective('молодий', Case.ACCUSATIVE, Gender.MASCULINE, {
        animacy: Animacy.ANIMATE,
        number: GrammaticalNumber.PLURAL,
      }),
    ).toBe('молодих');
  });

  it('never uses genitive-as-accusative for feminine/neuter singular, animate or not', () => {
    expect(declineAdjective('молодий', Case.ACCUSATIVE, Gender.FEMININE, { animacy: Animacy.ANIMATE })).toBe(
      'молоду',
    );
    expect(declineAdjective('молодий', Case.ACCUSATIVE, Gender.NEUTER, { animacy: Animacy.ANIMATE })).toBe('молоде');
  });

  it('returns every case via declineAdjectiveAll', () => {
    expect(declineAdjectiveAll('молодий', Gender.MASCULINE)).toEqual({
      nominative: 'молодий',
      genitive: 'молодого',
      dative: 'молодому',
      accusative: 'молодий',
      instrumental: 'молодим',
      locative: 'молодому',
      vocative: 'молодий',
    });
  });
});

describe('declineAdjective (soft group, -ій)', () => {
  it('declines синій across genders and plural', () => {
    expect(declineAdjective('синій', Case.NOMINATIVE, Gender.MASCULINE)).toBe('синій');
    expect(declineAdjective('синій', Case.GENITIVE, Gender.FEMININE)).toBe('синьої');
    expect(declineAdjective('синій', Case.DATIVE, Gender.NEUTER)).toBe('синьому');
    expect(declineAdjective('синій', Case.LOCATIVE, Gender.MASCULINE, { number: GrammaticalNumber.PLURAL })).toBe(
      'синіх',
    );
  });
});

describe('declineAdjective input validation', () => {
  it('rejects a word that is not a masculine nominative singular adjective', () => {
    expect(() => declineAdjective('студент', Case.GENITIVE)).toThrow(RangeError);
  });
});
