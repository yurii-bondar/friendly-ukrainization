import { describe, expect, it } from 'vitest';
import { AmbiguousGenderError, Case, declineName, detectNameGender } from '../../src/index.js';
import { detectGivenNameGender } from '../../src/names/given-name.js';
import { detectPatronymicGender } from '../../src/names/patronymic.js';
import { detectSurnameGender } from '../../src/names/surname.js';

describe('gender detection', () => {
  it('detects patronymic gender, or undefined for an unrecognized suffix', () => {
    expect(detectPatronymicGender('Олександрович')).toBe('masculine');
    expect(detectPatronymicGender('Олександрівна')).toBe('feminine');
    expect(detectPatronymicGender('Смит')).toBeUndefined();
  });

  it('uses the given-name hint dictionary for ambiguous -а/-я masculine names', () => {
    expect(detectGivenNameGender('Микола')).toBe('masculine');
    expect(detectGivenNameGender('Ілля')).toBe('masculine');
    expect(detectGivenNameGender('Ольга')).toBe('feminine');
  });

  it('detects adjectival surname gender, or undefined otherwise', () => {
    expect(detectSurnameGender('Ковальський')).toBe('masculine');
    expect(detectSurnameGender('Ковальська')).toBe('feminine');
    expect(detectSurnameGender('Шевченко')).toBeUndefined();
  });

  it('falls back through patronymic -> first name -> last name', () => {
    expect(detectNameGender({ lastName: 'Ковальська' })).toBe('feminine');
    expect(detectNameGender({ lastName: 'Шевченко' })).toBeUndefined();
  });

  it('throws AmbiguousGenderError when nothing determines gender', () => {
    expect(() => declineName({ lastName: 'Шевченко' }, Case.GENITIVE)).toThrow(AmbiguousGenderError);
  });
});

describe('given names ending in -о', () => {
  it('declines Марко as a masculine given name (Марка), not as an indeclinable -ко surname', () => {
    expect(declineName({ firstName: 'Марко' }, Case.GENITIVE, 'masculine').firstName).toBe('Марка');
  });

  it('defaults an unhinted -о given name to masculine', () => {
    expect(detectGivenNameGender('Дмитро')).toBe('masculine');
  });

  it('declines the accusative of a -о given name as its genitive', () => {
    expect(declineName({ firstName: 'Дмитро' }, Case.ACCUSATIVE, 'masculine').firstName).toBe('Дмитра');
  });
});
