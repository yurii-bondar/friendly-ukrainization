import { describe, expect, it } from 'vitest';
import {
  dropFleetingVowel,
  hasFleetingVowel,
  insertGenitivePluralEpenthesis,
} from '../../src/core/fleeting-vowel.js';

describe('hasFleetingVowel / dropFleetingVowel', () => {
  it('detects the -ок/-ец/-ен productive patterns on an ending-stripped stem', () => {
    expect(hasFleetingVowel('садок')).toBe(true);
    expect(hasFleetingVowel('хлопец')).toBe(true);
    expect(hasFleetingVowel('ден')).toBe(true);
    expect(hasFleetingVowel('студент')).toBe(false);
  });

  it('drops the vowel immediately before the final consonant', () => {
    expect(dropFleetingVowel('садок')).toBe('садк');
    expect(dropFleetingVowel('ден')).toBe('дн');
  });
});

describe('insertGenitivePluralEpenthesis', () => {
  it('inserts о after a velar in a two-consonant cluster', () => {
    expect(insertGenitivePluralEpenthesis('вікн')).toBe('вікон');
  });

  it('inserts е after a non-velar in a two-consonant cluster', () => {
    expect(insertGenitivePluralEpenthesis('сестр')).toBe('сестер');
  });

  it('leaves a single-consonant-final stem unchanged', () => {
    expect(insertGenitivePluralEpenthesis('рук')).toBe('рук');
  });
});
