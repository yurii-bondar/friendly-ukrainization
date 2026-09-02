import { StemGroup } from '../../types.js';
import { deIotify, table, type NumberTable } from './types.js';

// Feminine nouns with a zero (consonant-final) or -ь nominative singular
// ending (ніч, радість, любов). A single paradigm serves both — the only
// real split is in the plural, where sibilant-final stems (ніч, річ) spell
// their oblique endings without я/ю (Ukrainian orthography forbids я/ю
// after ж,ч,ш,щ), unlike ь-marked stems (радість, тінь).

// The nominative/accusative/vocative singular suffix here is never actually
// used — the engine reconstructs those three bare forms directly as
// stem + the original nominative ending (see engine.ts), since that ending
// is 'ь' for some 3rd-declension nouns (радість, сіль) and '' for others
// (ніч, любов) independently of the SOFT/MIXED split below (which is a
// separate, purely phonological classification: sibilant-final stems spell
// their plural endings without я/ю, regardless of whether the nominative
// singular had a trailing ь).
const SINGULAR = table(['', 'і', 'і', '', 'ю', 'і', '']);

const PLURAL_SOFT = table(['і', 'ей', 'ям', 'і', 'ями', 'ях', 'і']);
const PLURAL_MIXED = deIotify(PLURAL_SOFT);

export function getThirdDeclensionTable(group: StemGroup): NumberTable {
  return {
    singular: SINGULAR,
    plural: group === StemGroup.MIXED ? PLURAL_MIXED : PLURAL_SOFT,
  };
}

/**
 * The productive -ість abstract-noun suffix (радість, вірність, свіжість)
 * alternates і -> о in every form except the bare nominative/accusative/
 * vocative singular and the instrumental singular (an open- vs
 * closed-syllable alternation: радість but радості, радістю).
 */
export function applyIstOstAlternation(stem: string): string {
  return /іст$/i.test(stem) ? stem.replace(/іст$/i, 'ост') : stem;
}

const VELAR_LIKE_NO_DOUBLE = /[бвгґджзйклмнпрстфхцчшщ]{2}$/i;

/**
 * Instrumental singular for 3rd-declension feminine nouns doubles a
 * single final consonant before -ю (ніч ->ніччю, сіль -> сіллю), inserts
 * an apostrophe after -в (любов -> любов'ю), and adds a plain -ю with no
 * change after an existing consonant cluster (радість -> радістю).
 */
export function formThirdDeclensionInstrumental(stem: string): string {
  if (/в$/i.test(stem)) {
    return `${stem}'ю`;
  }
  if (VELAR_LIKE_NO_DOUBLE.test(stem)) {
    return `${stem}ю`;
  }
  const final = stem.charAt(stem.length - 1);
  return `${stem}${final}ю`;
}
