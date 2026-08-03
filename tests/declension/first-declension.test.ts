import { describe, expect, it } from 'vitest';
import { Case, decline } from '../../src/index.js';

describe('1st declension genitive-plural epenthesis', () => {
  it('inserts a vowel for a 2-consonant-cluster hard-group stem (сестра -> сестер)', () => {
    expect(decline('сестра', Case.GENITIVE, { number: 'plural' })).toBe('сестер');
  });
});
