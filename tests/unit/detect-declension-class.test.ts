import { describe, expect, it } from 'vitest';
import { detectDeclensionClass } from '../../src/core/detect-declension-class.js';
import { DeclensionClass, Gender } from '../../src/types.js';

describe('detectDeclensionClass', () => {
  it('routes -а/-я feminine and masculine-person nouns to the 1st declension', () => {
    expect(detectDeclensionClass('рук', 'а', Gender.FEMININE)).toBe(DeclensionClass.FIRST);
    expect(detectDeclensionClass('микол', 'а', Gender.MASCULINE)).toBe(DeclensionClass.FIRST);
  });

  it('routes -о/-е/-є neuter nouns to the 2nd declension', () => {
    expect(detectDeclensionClass('вікн', 'о', Gender.NEUTER)).toBe(DeclensionClass.SECOND);
    expect(detectDeclensionClass('пол', 'е', Gender.NEUTER)).toBe(DeclensionClass.SECOND);
  });

  it('splits neuter -я between the geminated 2nd declension and the 4th declension', () => {
    expect(detectDeclensionClass('знанн', 'я', Gender.NEUTER)).toBe(DeclensionClass.SECOND);
    expect(detectDeclensionClass('тел', 'я', Gender.NEUTER)).toBe(DeclensionClass.FOURTH);
  });

  it('splits zero/ь ending between masculine (2nd) and feminine (3rd)', () => {
    expect(detectDeclensionClass('студент', '', Gender.MASCULINE)).toBe(DeclensionClass.SECOND);
    expect(detectDeclensionClass('ніч', '', Gender.FEMININE)).toBe(DeclensionClass.THIRD);
  });
});
