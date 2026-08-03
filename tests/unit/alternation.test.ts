import { describe, expect, it } from 'vitest';
import { Alternation, applyAlternation } from '../../src/core/alternation.js';

describe('applyAlternation', () => {
  it('applies г/к/х -> з/ц/с before dative/locative -і (palatal1)', () => {
    expect(applyAlternation('рук', Alternation.PALATAL_1)).toBe('руц');
    expect(applyAlternation('ніг', Alternation.PALATAL_1)).toBe('ніз');
    expect(applyAlternation('мух', Alternation.PALATAL_1)).toBe('мус');
  });

  it('applies г/к/х -> ж/ч/ш before vocative -е (palatal2)', () => {
    expect(applyAlternation('друг', Alternation.PALATAL_2)).toBe('друж');
    expect(applyAlternation('козак', Alternation.PALATAL_2)).toBe('козач');
  });

  it('preserves case of the alternated consonant', () => {
    expect(applyAlternation('нІГ', Alternation.PALATAL_1)).toBe('нІЗ');
  });

  it('leaves non-alternating consonants unchanged', () => {
    expect(applyAlternation('стіл', Alternation.PALATAL_1)).toBe('стіл');
  });
});
