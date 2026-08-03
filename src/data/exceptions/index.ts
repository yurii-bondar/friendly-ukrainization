import type { WordEntry } from '../../types.js';
import { COMMON_NOUN_EXCEPTIONS } from './common-nouns.js';
import { INDECLINABLE_EXCEPTIONS } from './indeclinable.js';
import { YOUNG_CREATURE_EXCEPTIONS } from './young-creatures.js';

export const EXCEPTIONS: Record<string, WordEntry> = {
  ...INDECLINABLE_EXCEPTIONS,
  ...YOUNG_CREATURE_EXCEPTIONS,
  ...COMMON_NOUN_EXCEPTIONS,
};
