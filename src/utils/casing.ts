function isUpperCase(char: string): boolean {
  return char !== char.toLowerCase() && char === char.toUpperCase();
}

export function restoreCasing(original: string, inflected: string): string {
  if (!original) {
    return inflected;
  }

  const letters = [...original].filter((char) => /\p{L}/u.test(char));
  const isAllUpper = letters.length > 0 && letters.every(isUpperCase);

  if (isAllUpper) {
    return inflected.toUpperCase();
  }

  if (isUpperCase(original.charAt(0))) {
    return inflected.charAt(0).toUpperCase() + inflected.slice(1);
  }

  return inflected;
}
