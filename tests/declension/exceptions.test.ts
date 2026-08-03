import { describe, expect, it } from 'vitest';
import { EXCEPTIONS } from '../../src/data/exceptions/index.js';
import { decline } from '../../src/core/engine.js';
import { CASES } from '../../src/types.js';

describe('exceptions dictionary', () => {
  for (const [word, entry] of Object.entries(EXCEPTIONS)) {
    it(`"${word}" matches every declared form override`, () => {
      if (entry.indeclinable) {
        for (const caseName of CASES) {
          expect(decline(word, caseName)).toBe(word);
        }
        return;
      }

      expect(() => decline(word, 'nominative', { gender: entry.gender, animacy: entry.animacy })).not.toThrow();

      for (const caseName of CASES) {
        const expected = entry.forms?.[caseName];
        if (expected !== undefined) {
          expect(decline(word, caseName, { gender: entry.gender, animacy: entry.animacy })).toBe(
            expected,
          );
        }
        const expectedPlural = entry.pluralForms?.[caseName];
        if (expectedPlural !== undefined) {
          expect(
            decline(word, caseName, { gender: entry.gender, animacy: entry.animacy, number: 'plural' }),
          ).toBe(expectedPlural);
        }
      }
    });
  }
});
