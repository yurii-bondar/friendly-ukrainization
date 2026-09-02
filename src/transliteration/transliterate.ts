/**
 * Cyrillic-to-Latin transliteration of Ukrainian text following the
 * official table from Ukraine's Cabinet of Ministers resolution No. 55
 * (2010) — the standard used for passports and other official documents.
 *
 * Case is applied per source letter (an uppercase Cyrillic letter produces
 * a transliteration with only its own initial Latin letter capitalized,
 * e.g. Щ → "Shch" not "SHCH") — an all-caps source word is not rendered as
 * an all-caps result, matching how the official table itself is printed.
 */

const MAP: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ie',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'iu',
  я: 'ia',
  "'": '',
  '’': '',
};

/** є/ї/й/ю/я take a different transliteration at the start of a word. */
const WORD_INITIAL_MAP: Record<string, string> = {
  є: 'ye',
  ї: 'yi',
  й: 'y',
  ю: 'yu',
  я: 'ya',
};

function capitalize(s: string): string {
  return s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
}

export function transliterate(text: string): string {
  let result = '';
  let wordStart = true;
  const chars = [...text];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i] as string;
    const lower = char.toLowerCase();
    const isUpper = char !== lower;

    // "зг" is two separate sounds (з + г), not the ж sound — spelled out as
    // "zgh" to keep it distinct from "zh" (е.g. Згорани -> Zghorany).
    const next = chars[i + 1];
    if (lower === 'з' && next && next.toLowerCase() === 'г') {
      result += isUpper ? capitalize('zgh') : 'zgh';
      i++;
      wordStart = false;
      continue;
    }

    if (lower in MAP) {
      const base = (wordStart && WORD_INITIAL_MAP[lower]) || MAP[lower] || '';
      result += isUpper ? capitalize(base) : base;
      wordStart = false;
      continue;
    }

    result += char;
    wordStart = true;
  }

  return result;
}
