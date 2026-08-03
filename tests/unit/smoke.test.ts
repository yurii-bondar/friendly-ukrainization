import { describe, expect, it } from 'vitest';
import { Case, decline } from '../../src/index.js';

describe('smoke', () => {
  it('declines a common 1st-declension feminine noun (hard group)', () => {
    expect(decline('Ольга', Case.GENITIVE)).toBe('Ольги');
    expect(decline('рука', Case.DATIVE)).toBe('руці');
    expect(decline('рука', Case.VOCATIVE)).toBe('руко');
    expect(decline('нога', Case.DATIVE)).toBe('нозі');
    expect(decline('муха', Case.DATIVE)).toBe('мусі');
  });

  it('declines 1st-declension soft group (consonant-final stem)', () => {
    expect(decline('земля', Case.GENITIVE)).toBe('землі');
    expect(decline('земля', Case.INSTRUMENTAL)).toBe('землею');
    expect(decline('земля', Case.VOCATIVE)).toBe('земле');
  });

  it('declines 1st-declension soft group (vowel-final stem, -ія pattern)', () => {
    expect(decline('надія', Case.GENITIVE)).toBe('надії');
    expect(decline('надія', Case.INSTRUMENTAL)).toBe('надією');
    expect(decline('надія', Case.VOCATIVE)).toBe('надіє');
  });

  it('declines 1st-declension mixed group (sibilant-final stem)', () => {
    expect(decline('груша', Case.GENITIVE)).toBe('груші');
    expect(decline('груша', Case.INSTRUMENTAL)).toBe('грушею');
    expect(decline('груша', Case.VOCATIVE)).toBe('груше');
  });

  it('declines a common 2nd-declension masculine noun (hard, animate)', () => {
    expect(decline('студент', Case.GENITIVE, { animacy: 'animate' })).toBe('студента');
    expect(decline('студент', Case.ACCUSATIVE, { animacy: 'animate' })).toBe('студента');
    expect(decline('друг', Case.VOCATIVE, { animacy: 'animate' })).toBe('друже');
  });

  it('declines 2nd-declension masculine soft group (animate)', () => {
    expect(decline('лікар', Case.GENITIVE, { animacy: 'animate' })).toBe('лікаря');
    expect(decline('лікар', Case.INSTRUMENTAL, { animacy: 'animate' })).toBe('лікарем');
    expect(decline('лікар', Case.VOCATIVE, { animacy: 'animate' })).toBe('лікарю');
  });

  it('declines 2nd-declension masculine nouns ending in vowel + й', () => {
    expect(decline('трамвай', Case.GENITIVE)).toBe('трамвая');
    expect(decline('трамвай', Case.DATIVE, { animacy: 'inanimate' })).toBe('трамваю');
    expect(decline('трамвай', Case.INSTRUMENTAL)).toBe('трамваєм');
    expect(decline('трамвай', Case.LOCATIVE)).toBe('трамваї');
    expect(decline('трамвай', Case.NOMINATIVE, { number: 'plural' })).toBe('трамваї');
  });

  it('declines 2nd-declension masculine mixed group', () => {
    expect(decline('ключ', Case.GENITIVE)).toBe('ключа');
    expect(decline('ключ', Case.INSTRUMENTAL)).toBe('ключем');
  });

  it('applies fleeting vowel for -ок/-ець/-ень nouns', () => {
    expect(decline('садок', Case.GENITIVE)).toBe('садка');
    expect(decline('хлопець', Case.GENITIVE, { animacy: 'animate' })).toBe('хлопця');
    expect(decline('крок', Case.GENITIVE)).toBe('кроку');
  });

  it('declines a neuter noun (hard, -о)', () => {
    expect(decline('вікно', Case.GENITIVE)).toBe('вікна');
    expect(decline('вікно', Case.GENITIVE, { number: 'plural' })).toBe('вікон');
    expect(decline('яблуко', Case.LOCATIVE)).toBe('яблуці');
  });

  it('declines a neuter noun (soft, -е)', () => {
    expect(decline('поле', Case.GENITIVE)).toBe('поля');
    expect(decline('поле', Case.INSTRUMENTAL)).toBe('полем');
  });

  it('declines a geminated neuter noun (-я from doubled consonant)', () => {
    expect(decline('знання', Case.GENITIVE)).toBe('знання');
    expect(decline('знання', Case.INSTRUMENTAL)).toBe('знанням');
  });

  it('declines 3rd-declension feminine nouns with instrumental doubling', () => {
    expect(decline('ніч', Case.GENITIVE)).toBe('ночі');
    expect(decline('ніч', Case.INSTRUMENTAL)).toBe('ніччю');
    expect(decline('сіль', Case.INSTRUMENTAL)).toBe('сіллю');
    expect(decline('любов', Case.INSTRUMENTAL)).toBe("любов'ю");
    expect(decline('радість', Case.INSTRUMENTAL)).toBe('радістю');
  });

  it('declines 4th-declension young-creature nouns with stem extension', () => {
    expect(decline('теля', Case.GENITIVE)).toBe('теляти');
    expect(decline('теля', Case.INSTRUMENTAL)).toBe('телям');
    expect(decline('теля', Case.NOMINATIVE, { number: 'plural' })).toBe('телята');
    expect(decline('теля', Case.GENITIVE, { number: 'plural' })).toBe('телят');
  });

  it('handles suppletive plurals from the exceptions dictionary', () => {
    expect(decline('дитина', Case.NOMINATIVE, { number: 'plural' })).toBe('діти');
    expect(decline('людина', Case.GENITIVE, { number: 'plural' })).toBe('людей');
  });

  it('handles the fully irregular "мати"', () => {
    expect(decline('мати', Case.GENITIVE)).toBe('матері');
    expect(decline('мати', Case.INSTRUMENTAL)).toBe("матір'ю");
  });

  it('leaves indeclinable nouns unchanged', () => {
    expect(decline('пальто', Case.DATIVE)).toBe('пальто');
    expect(decline('метро', Case.INSTRUMENTAL)).toBe('метро');
  });
});
