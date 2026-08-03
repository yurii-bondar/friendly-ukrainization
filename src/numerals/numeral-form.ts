export const NumeralForm = {
  ONE: 'one',
  FEW: 'few',
  MANY: 'many',
} as const;
export type NumeralForm = (typeof NumeralForm)[keyof typeof NumeralForm];

/**
 * Ukrainian/Slavic count agreement class: n1 (1, 21, 31...) takes the
 * singular-like form, n2-n4 (2-4, 22-24...) takes the "few" form, and
 * everything else (0, 5-20, 25-30...) takes the "many"/genitive-plural
 * form. 11-14 are the well-known exception that stays in "many" despite
 * ending in 1-4.
 */
export function getNumeralForm(count: number): NumeralForm {
  const n = Math.abs(Math.trunc(count)) % 100;
  const n1 = n % 10;

  if (n1 === 1 && n !== 11) {
    return NumeralForm.ONE;
  }
  if (n1 >= 2 && n1 <= 4 && (n < 12 || n > 14)) {
    return NumeralForm.FEW;
  }
  return NumeralForm.MANY;
}
