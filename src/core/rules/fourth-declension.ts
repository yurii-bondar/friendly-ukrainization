import type { CaseSuffixTable, NumberTable } from './types.js';

/**
 * Neuter -я/-а nouns denoting young creatures (теля, лоша, кошеня) that
 * insert a stem extension (-ят- when the nominative ends in -я, -ат- when
 * it's spelled -а after a sibilant, e.g. лоша) in every case except
 * nominative/accusative/vocative singular and the instrumental singular.
 * The closed, lexically irregular -ен- extension group (ім'я -> імені,
 * плем'я -> племені) is handled via the exceptions dictionary instead of
 * this generalized rule.
 */
export function detectFourthDeclensionExtension(nominativeEnding: string): string {
  return nominativeEnding === 'я' ? 'ят' : 'ат';
}

function deIotifySuffix(suffix: string, needsDeIotify: boolean): string {
  return needsDeIotify ? suffix.replace(/я/g, 'а').replace(/ю/g, 'у') : suffix;
}

export function getFourthDeclensionTable(
  extension: string,
  needsDeIotify: boolean,
  nominativeEnding: string,
): NumberTable {
  const nom = nominativeEnding;
  const instrSuffix = deIotifySuffix('ям', needsDeIotify);

  const singular: CaseSuffixTable = {
    nominative: { suffix: nom },
    genitive: { suffix: `${extension}и` },
    dative: { suffix: `${extension}і` },
    accusative: { suffix: nom },
    instrumental: { suffix: instrSuffix },
    locative: { suffix: `${extension}і` },
    vocative: { suffix: nom },
  };

  const plural: CaseSuffixTable = {
    nominative: { suffix: `${extension}а` },
    genitive: { suffix: extension },
    dative: { suffix: `${extension}ам` },
    accusative: { suffix: `${extension}а` },
    instrumental: { suffix: `${extension}ами` },
    locative: { suffix: `${extension}ах` },
    vocative: { suffix: `${extension}а` },
  };

  return { singular, plural };
}
