import { describe, expect, it } from 'vitest';
import { AmbiguousDeclensionClassError, AmbiguousGenderError } from '../../src/index.js';

describe('error types', () => {
  it('AmbiguousGenderError carries the offending word in its message', () => {
    const err = new AmbiguousGenderError('щось');
    expect(err.name).toBe('AmbiguousGenderError');
    expect(err.message).toContain('щось');
  });

  it('AmbiguousDeclensionClassError carries the offending word in its message', () => {
    const err = new AmbiguousDeclensionClassError('щось');
    expect(err.name).toBe('AmbiguousDeclensionClassError');
    expect(err.message).toContain('щось');
  });
});
