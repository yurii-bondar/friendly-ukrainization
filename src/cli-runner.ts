import { CASES, type Case, type Gender, type Animacy, GrammaticalNumber } from './types.js';
import { decline, declineAll } from './core/engine.js';
import { declineNumeralWord } from './numerals/decline-numeral-word.js';
import { declineAdjective, declineAdjectiveAll } from './adjectives/decline-adjective.js';
import { declineName, declineNameAll } from './names/declineName.js';
import { transliterate } from './transliteration/transliterate.js';

export const USAGE = `friendly-ukrainization — decline Ukrainian words from the command line

Usage:
  friendly-ukrainization decline <word> [--case <case>] [--gender <gender>] [--animacy <animacy>] [--number plural]
  friendly-ukrainization numeral <count> [--case <case>] [--gender <gender>] [--animacy <animacy>]
  friendly-ukrainization adjective <word> [--case <case>] [--gender <gender>] [--animacy <animacy>] [--number plural]
  friendly-ukrainization name <firstName> [patronymic] <lastName> [--case <case>] [--gender <gender>]
  friendly-ukrainization transliterate <text...>

Omitting --case prints all 7 cases as JSON.

Cases: ${CASES.join(', ')}
Genders: masculine, feminine, neuter
Animacy: animate, inanimate
`;

export class CliUsageError extends Error {}

function fail(message: string): never {
  throw new CliUsageError(message);
}

function parseArgs(args: string[]): { positional: string[]; flags: Record<string, string> } {
  const positional: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string;
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[++i];
      if (value === undefined) {
        fail(`Missing value for --${key}`);
      }
      flags[key] = value;
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

function parseCase(flags: Record<string, string>): Case | undefined {
  if (!flags.case) return undefined;
  if (!CASES.includes(flags.case as Case)) {
    fail(`Unknown case "${flags.case}". Valid cases: ${CASES.join(', ')}`);
  }
  return flags.case as Case;
}

/** Runs one CLI invocation and returns the text to print to stdout. Throws CliUsageError on bad input/flags. */
export function runCli(argv: string[]): string {
  const [command, ...rest] = argv;

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    return USAGE;
  }

  const { positional, flags } = parseArgs(rest);
  const caseName = parseCase(flags);
  const gender = flags.gender as Gender | undefined;
  const animacy = flags.animacy as Animacy | undefined;
  const number = flags.number === 'plural' ? GrammaticalNumber.PLURAL : undefined;

  switch (command) {
    case 'decline': {
      const [word] = positional;
      if (!word) fail('decline requires a word, e.g. `friendly-ukrainization decline студент --case genitive`');
      const options = { gender, animacy, number };
      return caseName ? decline(word, caseName, options) : JSON.stringify(declineAll(word, options), null, 2);
    }
    case 'numeral': {
      const [countStr] = positional;
      const count = Number(countStr);
      if (!countStr || !Number.isFinite(count)) {
        fail('numeral requires a whole number, e.g. `friendly-ukrainization numeral 21000 --case genitive`');
      }
      if (caseName) {
        return declineNumeralWord(count, caseName, gender, animacy);
      }
      const all = Object.fromEntries(CASES.map((c) => [c, declineNumeralWord(count, c, gender, animacy)]));
      return JSON.stringify(all, null, 2);
    }
    case 'adjective': {
      const [word] = positional;
      if (!word) {
        fail('adjective requires a masculine nominative singular word, e.g. `friendly-ukrainization adjective молодий --gender feminine`');
      }
      const options = { animacy, number };
      return caseName
        ? declineAdjective(word, caseName, gender, options)
        : JSON.stringify(declineAdjectiveAll(word, gender, options), null, 2);
    }
    case 'name': {
      if (positional.length < 2) {
        fail('name requires at least a firstName and lastName, e.g. `friendly-ukrainization name Дмитро Ковальчук --case genitive`');
      }
      const [firstName, middle, last] = positional;
      const name =
        positional.length >= 3
          ? { firstName, patronymic: middle, lastName: last }
          : { firstName, lastName: middle };
      return caseName ? declineName(name, caseName, gender).full : JSON.stringify(declineNameAll(name, gender), null, 2);
    }
    case 'transliterate': {
      if (positional.length === 0) {
        fail('transliterate requires text, e.g. `friendly-ukrainization transliterate Дмитро Ковальчук`');
      }
      return transliterate(positional.join(' '));
    }
    default:
      return fail(`Unknown command "${command}".`);
  }
}
