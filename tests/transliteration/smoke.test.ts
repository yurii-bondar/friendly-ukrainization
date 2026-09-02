import { describe, expect, it } from 'vitest';
import { transliterate } from '../../src/index.js';

describe('transliterate (KMU resolution No. 55 table)', () => {
  it('transliterates a full name', () => {
    expect(transliterate('Дмитро Олександрович Ковальчук')).toBe('Dmytro Oleksandrovych Kovalchuk');
  });

  it('uses the word-initial forms of є/ї/й/ю/я', () => {
    expect(transliterate('Євген')).toBe('Yevhen');
    expect(transliterate('Їжак')).toBe('Yizhak');
    expect(transliterate('Йосип')).toBe('Yosyp');
    expect(transliterate('Юрій')).toBe('Yurii');
    expect(transliterate('Ярослав')).toBe('Yaroslav');
  });

  it('uses the mid-word forms of є/ї/й/ю/я', () => {
    expect(transliterate('Марія')).toBe('Mariia');
    expect(transliterate('Ілля')).toBe('Illia');
    expect(transliterate('щастя')).toBe('shchastia');
    expect(transliterate('Гриньків')).toBe('Hrynkiv');
  });

  it('drops the apostrophe and ь without breaking word-initial detection for what follows', () => {
    expect(transliterate("Стеф'юк")).toBe('Stefiuk');
  });

  it('spells the зг digraph as zgh, distinct from ж (zh)', () => {
    expect(transliterate('Згорани')).toBe('Zghorany');
  });

  it('treats each hyphenated part as its own word', () => {
    expect(transliterate('Ковальчук-Дзюба')).toBe('Kovalchuk-Dziuba');
  });

  it('capitalizes only the first Latin letter of a multi-letter transliteration', () => {
    expect(transliterate('Щастя')).toBe('Shchastia');
  });
});
