const APOSTROPHE_VARIANTS = /['’ʼ`]/g;

const CANONICAL_APOSTROPHE = "'";

export function normalizeApostrophe(word: string): string {
  return word.replace(APOSTROPHE_VARIANTS, CANONICAL_APOSTROPHE);
}
