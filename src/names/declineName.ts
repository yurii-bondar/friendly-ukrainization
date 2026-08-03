import {
  AmbiguousGenderError,
  CASES,
  type Case,
  type DeclinedPersonName,
  type Gender,
  type PersonName,
} from '../types.js';
import { declineGivenName, detectGivenNameGender } from './given-name.js';
import { declinePatronymic, detectPatronymicGender } from './patronymic.js';
import { declineSurname, detectSurnameGender } from './surname.js';

/**
 * Resolves gender from the strongest available signal: patronymic suffix
 * first (unambiguous), then the given name, then adjectival surname
 * endings. Returns undefined if none of the parts give a reliable signal
 * — callers should require an explicit `gender` in that case rather than
 * risk silently declining a surname with the wrong (gender-dependent)
 * pattern.
 */
export function detectNameGender(name: PersonName): Gender | undefined {
  if (name.patronymic) {
    const fromPatronymic = detectPatronymicGender(name.patronymic);
    if (fromPatronymic) return fromPatronymic;
  }
  if (name.firstName) {
    const fromFirstName = detectGivenNameGender(name.firstName);
    if (fromFirstName) return fromFirstName;
  }
  if (name.lastName) {
    const fromLastName = detectSurnameGender(name.lastName);
    if (fromLastName) return fromLastName;
  }
  return undefined;
}

function resolveGender(name: PersonName, gender?: Gender): Gender {
  const resolved = gender ?? detectNameGender(name);
  if (!resolved) {
    const label = [name.firstName, name.patronymic, name.lastName].filter(Boolean).join(' ');
    throw new AmbiguousGenderError(label || '(empty name)');
  }
  return resolved;
}

export function declineName(name: PersonName, caseName: Case, gender?: Gender): DeclinedPersonName {
  const resolvedGender = resolveGender(name, gender);

  const firstName = name.firstName
    ? declineGivenName(name.firstName, caseName, resolvedGender)
    : undefined;
  const patronymic = name.patronymic
    ? declinePatronymic(name.patronymic, caseName, resolvedGender)
    : undefined;
  const lastName = name.lastName
    ? declineSurname(name.lastName, caseName, resolvedGender)
    : undefined;

  const full = [firstName, patronymic, lastName].filter(Boolean).join(' ');

  return { firstName, patronymic, lastName, full };
}

export function declineNameAll(
  name: PersonName,
  gender?: Gender,
): Record<Case, DeclinedPersonName> {
  const resolvedGender = resolveGender(name, gender);
  const entries = CASES.map((c) => [c, declineName(name, c, resolvedGender)] as const);
  return Object.fromEntries(entries) as Record<Case, DeclinedPersonName>;
}
