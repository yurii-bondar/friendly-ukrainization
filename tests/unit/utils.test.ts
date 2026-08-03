import { describe, expect, it } from 'vitest';
import { normalizeApostrophe } from '../../src/utils/apostrophe.js';
import { restoreCasing } from '../../src/utils/casing.js';
import { endsWith, isConsonant, isSibilant, isSoftMarker, isVowel, lastChar } from '../../src/utils/text.js';

describe('normalizeApostrophe', () => {
  it('canonicalizes every apostrophe variant', () => {
    expect(normalizeApostrophe("сім’я")).toBe("сім'я");
    expect(normalizeApostrophe('сімʼя')).toBe("сім'я");
    expect(normalizeApostrophe("сім'я")).toBe("сім'я");
  });
});

describe('restoreCasing', () => {
  it('preserves all-uppercase input', () => {
    expect(restoreCasing('ОЛЬГА', 'ольги')).toBe('ОЛЬГИ');
  });

  it('preserves capitalized input', () => {
    expect(restoreCasing('Ольга', 'ольги')).toBe('Ольги');
  });

  it('leaves lowercase input as-is', () => {
    expect(restoreCasing('ольга', 'ольги')).toBe('ольги');
  });

  it('returns the inflected form unchanged for an empty original', () => {
    expect(restoreCasing('', 'ольги')).toBe('ольги');
  });
});

describe('text helpers', () => {
  it('classifies vowels and consonants', () => {
    expect(isVowel('а')).toBe(true);
    expect(isVowel('б')).toBe(false);
    expect(isConsonant('б')).toBe(true);
    expect(isConsonant('а')).toBe(false);
  });

  it('classifies sibilants and soft markers', () => {
    expect(isSibilant('ш')).toBe(true);
    expect(isSibilant('с')).toBe(false);
    expect(isSoftMarker('ь')).toBe(true);
    expect(isSoftMarker('й')).toBe(true);
    expect(isSoftMarker('а')).toBe(false);
  });

  it('reads the last character and checks suffixes case-insensitively', () => {
    expect(lastChar('рука')).toBe('а');
    expect(endsWith('Рука', 'КА')).toBe(true);
    expect(endsWith('рука', 'о')).toBe(false);
  });
});
