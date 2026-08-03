import { Animacy, Case, Gender, type WordEntry } from '../../types.js';

/**
 * Common nouns whose declension the generalized rule engine gets wrong —
 * either fully suppletive words (мати, дитина -> діти) or fully irregular
 * paradigms. Keyed by lowercase nominative singular.
 */
export const COMMON_NOUN_EXCEPTIONS: Record<string, WordEntry> = {
  мати: {
    gender: Gender.FEMININE,
    forms: {
      [Case.NOMINATIVE]: 'мати',
      [Case.GENITIVE]: 'матері',
      [Case.DATIVE]: 'матері',
      [Case.ACCUSATIVE]: 'матір',
      [Case.INSTRUMENTAL]: "матір'ю",
      [Case.LOCATIVE]: 'матері',
      [Case.VOCATIVE]: 'мати',
    },
    pluralForms: {
      [Case.NOMINATIVE]: 'матері',
      [Case.GENITIVE]: 'матерів',
      [Case.DATIVE]: 'матерям',
      [Case.ACCUSATIVE]: 'матерів',
      [Case.INSTRUMENTAL]: 'матерями',
      [Case.LOCATIVE]: 'матерях',
      [Case.VOCATIVE]: 'матері',
    },
  },
  дитина: {
    gender: Gender.FEMININE,
    pluralForms: {
      [Case.NOMINATIVE]: 'діти',
      [Case.GENITIVE]: 'дітей',
      [Case.DATIVE]: 'дітям',
      [Case.ACCUSATIVE]: 'дітей',
      [Case.INSTRUMENTAL]: 'дітьми',
      [Case.LOCATIVE]: 'дітях',
      [Case.VOCATIVE]: 'діти',
    },
  },
  людина: {
    gender: Gender.FEMININE,
    pluralForms: {
      [Case.NOMINATIVE]: 'люди',
      [Case.GENITIVE]: 'людей',
      [Case.DATIVE]: 'людям',
      [Case.ACCUSATIVE]: 'людей',
      [Case.INSTRUMENTAL]: 'людьми',
      [Case.LOCATIVE]: 'людях',
      [Case.VOCATIVE]: 'люди',
    },
  },
  "ім'я": {
    gender: Gender.NEUTER,
    forms: {
      [Case.NOMINATIVE]: "ім'я",
      [Case.GENITIVE]: "імені",
      [Case.DATIVE]: "імені",
      [Case.ACCUSATIVE]: "ім'я",
      [Case.INSTRUMENTAL]: "ім'ям",
      [Case.LOCATIVE]: "імені",
      [Case.VOCATIVE]: "ім'я",
    },
    pluralForms: {
      [Case.NOMINATIVE]: 'імена',
      [Case.GENITIVE]: 'імен',
      [Case.DATIVE]: 'іменам',
      [Case.ACCUSATIVE]: 'імена',
      [Case.INSTRUMENTAL]: 'іменами',
      [Case.LOCATIVE]: 'іменах',
      [Case.VOCATIVE]: 'імена',
    },
  },
  "плем'я": {
    gender: Gender.NEUTER,
    forms: {
      [Case.NOMINATIVE]: "плем'я",
      [Case.GENITIVE]: 'племені',
      [Case.DATIVE]: 'племені',
      [Case.ACCUSATIVE]: "плем'я",
      [Case.INSTRUMENTAL]: "плем'ям",
      [Case.LOCATIVE]: 'племені',
      [Case.VOCATIVE]: "плем'я",
    },
  },
  дошка: {
    gender: Gender.FEMININE,
    pluralForms: {
      [Case.GENITIVE]: 'дощок',
    },
  },
  рука: {
    gender: Gender.FEMININE,
    pluralForms: {
      [Case.GENITIVE]: 'рук',
    },
  },
  крок: {
    gender: Gender.MASCULINE,
    animacy: Animacy.INANIMATE,
    fleetingVowel: false,
  },
  // "пес" has a fleeting е that the -ок/-ець/-ень heuristic doesn't catch
  // (пес -> пса, пси, псів...) since it isn't one of those three suffixes.
  пес: {
    gender: Gender.MASCULINE,
    animacy: Animacy.ANIMATE,
    fleetingVowel: true,
  },
  // These 3rd-declension nouns undergo an і/о stem alternation (ніч -> ночі)
  // that the generalized rule engine does not attempt (see README limitations).
  ніч: {
    gender: Gender.FEMININE,
    forms: {
      [Case.NOMINATIVE]: 'ніч',
      [Case.GENITIVE]: 'ночі',
      [Case.DATIVE]: 'ночі',
      [Case.ACCUSATIVE]: 'ніч',
      [Case.INSTRUMENTAL]: 'ніччю',
      [Case.LOCATIVE]: 'ночі',
      [Case.VOCATIVE]: 'ноче',
    },
    pluralForms: {
      [Case.NOMINATIVE]: 'ночі',
      [Case.GENITIVE]: 'ночей',
      [Case.DATIVE]: 'ночам',
      [Case.ACCUSATIVE]: 'ночі',
      [Case.INSTRUMENTAL]: 'ночами',
      [Case.LOCATIVE]: 'ночах',
      [Case.VOCATIVE]: 'ночі',
    },
  },
  річ: {
    gender: Gender.FEMININE,
    forms: {
      [Case.NOMINATIVE]: 'річ',
      [Case.GENITIVE]: 'речі',
      [Case.DATIVE]: 'речі',
      [Case.ACCUSATIVE]: 'річ',
      [Case.INSTRUMENTAL]: 'річчю',
      [Case.LOCATIVE]: 'речі',
      [Case.VOCATIVE]: 'річ',
    },
    pluralForms: {
      [Case.NOMINATIVE]: 'речі',
      [Case.GENITIVE]: 'речей',
      [Case.DATIVE]: 'речам',
      [Case.ACCUSATIVE]: 'речі',
      [Case.INSTRUMENTAL]: 'речами',
      [Case.LOCATIVE]: 'речах',
      [Case.VOCATIVE]: 'речі',
    },
  },
  // -ар/-яр occupational nouns are a lexically closed set that takes
  // soft-group endings (лікаря) unlike most other р-final masculine nouns,
  // which are hard group (Олександра, базару, товару) — see stem-group.ts.
  лікар: {
    gender: Gender.MASCULINE,
    animacy: Animacy.ANIMATE,
    forms: {
      [Case.NOMINATIVE]: 'лікар',
      [Case.GENITIVE]: 'лікаря',
      [Case.DATIVE]: 'лікареві',
      [Case.ACCUSATIVE]: 'лікаря',
      [Case.INSTRUMENTAL]: 'лікарем',
      [Case.LOCATIVE]: 'лікарі',
      [Case.VOCATIVE]: 'лікарю',
    },
  },
  // Same -ар occupational pattern as лікар — бондар (a cooper/barrel-maker)
  // is also a common Ukrainian surname, which inherits the soft declension.
  бондар: {
    gender: Gender.MASCULINE,
    animacy: Animacy.ANIMATE,
    forms: {
      [Case.NOMINATIVE]: 'бондар',
      [Case.GENITIVE]: 'бондаря',
      [Case.DATIVE]: 'бондареві',
      [Case.ACCUSATIVE]: 'бондаря',
      [Case.INSTRUMENTAL]: 'бондарем',
      [Case.LOCATIVE]: 'бондарі',
      [Case.VOCATIVE]: 'бондарю',
    },
  },
  сіль: {
    gender: Gender.FEMININE,
    forms: {
      [Case.NOMINATIVE]: 'сіль',
      [Case.GENITIVE]: 'солі',
      [Case.DATIVE]: 'солі',
      [Case.ACCUSATIVE]: 'сіль',
      [Case.INSTRUMENTAL]: 'сіллю',
      [Case.LOCATIVE]: 'солі',
      [Case.VOCATIVE]: 'соле',
    },
  },
};
