import { getNumeralForm, NumeralForm } from './numeral-form.js';

export function pluralize(
  count: number,
  forms: readonly [one: string, few: string, many: string],
): string {
  const form = getNumeralForm(count);
  const [one, few, many] = forms;
  if (form === NumeralForm.ONE) return one;
  if (form === NumeralForm.FEW) return few;
  return many;
}
