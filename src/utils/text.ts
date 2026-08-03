const VOWELS = new Set(['а', 'е', 'є', 'и', 'і', 'ї', 'о', 'у', 'ю', 'я']);

const CONSONANTS = new Set([
  'б', 'в', 'г', 'ґ', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р',
  'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ',
]);

const SIBILANTS = new Set(['ж', 'ч', 'ш', 'щ']);

const SOFT_MARKERS = new Set(['й', 'ь']);

export function isVowel(char: string): boolean {
  return VOWELS.has(char.toLowerCase());
}

export function isConsonant(char: string): boolean {
  return CONSONANTS.has(char.toLowerCase());
}

export function isSibilant(char: string): boolean {
  return SIBILANTS.has(char.toLowerCase());
}

export function isSoftMarker(char: string): boolean {
  return SOFT_MARKERS.has(char.toLowerCase());
}

export function lastChar(word: string): string {
  return word.charAt(word.length - 1);
}

export function endsWith(word: string, suffix: string): boolean {
  return word.toLowerCase().endsWith(suffix.toLowerCase());
}
