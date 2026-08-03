import { DeclensionClass, Gender, type WordEntry } from '../../types.js';

/**
 * 4th-declension young-creature nouns (теля, лоша). Their nominative -я/-а
 * ending is structurally identical to 1st-declension feminine nouns
 * (теля vs земля), so gender/declension can't be told apart from the bare
 * word — these hints steer the engine to the correct paradigm without
 * hardcoding the actual case forms, which the rule engine computes.
 */
const YOUNG_CREATURE_NOUNS = [
  'теля', 'лоша', 'порося', 'ягня', 'кошеня', 'вовченя', 'гусеня', 'курча',
  'каченя', 'ведмежа', 'слоненя', 'тигреня', 'левеня', 'зайченя', 'їжаченя',
];

export const YOUNG_CREATURE_EXCEPTIONS: Record<string, WordEntry> = Object.fromEntries(
  YOUNG_CREATURE_NOUNS.map((word) => [
    word,
    { gender: Gender.NEUTER, declension: DeclensionClass.FOURTH },
  ]),
);
