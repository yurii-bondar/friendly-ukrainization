# friendly-ukrainization

[![CI](https://github.com/yurii-bondar/friendly-ukrainization/actions/workflows/ci.yml/badge.svg)](https://github.com/yurii-bondar/friendly-ukrainization/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/friendly-ukrainization.svg)](https://www.npmjs.com/package/friendly-ukrainization)

Decline Ukrainian words — common nouns, full names, and numeral agreement — across all 7 grammatical cases (називний, родовий, давальний, знахідний, орудний, місцевий, кличний).

Written in TypeScript, zero runtime dependencies, ships as dual ESM/CJS with full type definitions.

## Install

```bash
npm install friendly-ukrainization
```

## Usage

### Common nouns

```ts
import { decline, declineAll, Case } from 'friendly-ukrainization';

decline('Ольга', Case.GENITIVE); // "Ольги"
decline('студент', Case.GENITIVE, { animacy: 'animate' }); // "студента"
decline('вікно', Case.GENITIVE, { number: 'plural' }); // "вікон"

declineAll('рука');
// { nominative: 'рука', genitive: 'руки', dative: 'руці', accusative: 'руку',
//   instrumental: 'рукою', locative: 'руці', vocative: 'руко' }
```

`decline` resolves gender and declension class automatically from the word's ending where possible. Pass `gender`/`animacy`/`declensionClass` explicitly whenever the word is ambiguous (see [Limitations](#limitations)) or you already know it.

### Full names (ФІО)

```ts
import { declineName, declineNameAll, Case } from 'friendly-ukrainization';

const name = { firstName: 'Дмитро', patronymic: 'Олександрович', lastName: 'Ковальчук' };

declineName(name, Case.GENITIVE).full; // "Дмитра Олександровича Ковальчука"

declineNameAll({ firstName: 'Ольга', lastName: 'Ковальська' })[Case.DATIVE].full;
// "Ользі Ковальській"
```

Gender is inferred from the patronymic suffix, then the given name, then an adjectival surname ending — pass `gender` explicitly (3rd argument) if none of those resolve it, or `declineName`/`declineNameAll` throw `AmbiguousGenderError`.

Handled name patterns:
- Masculine given names in `-о` (Дмитро, Петро, Марко) decline as a stem, not a neuter noun (Дмитра, not Дмитро's common-noun equivalent).
- Patronymics (`-ович`/`-ич`, `-івна`/`-ївна`) decline as regular nouns once gender is known.
- Adjectival surnames (`-ський`/`-цький`/`-зький`) decline like adjectives.
- `-ко`/`-енко` surnames (Шевченко, Бондаренко) are indeclinable.
- Consonant-final surnames decline for a male bearer but are indeclinable for a female bearer (Ковальчук → Ковальчука for him, Ковальчук unchanged for her).
- Hyphenated surnames decline each part independently (Дзюба-Ковальська → Дзюби-Ковальської).

### Numeral agreement

```ts
import { declineWithNumber, declineNumeralWord, pluralize, getNumeralForm, Case } from 'friendly-ukrainization';

declineWithNumber('товар', 1, Case.NOMINATIVE);  // "товар"
declineWithNumber('товар', 2, Case.NOMINATIVE);  // "товари"
declineWithNumber('товар', 5, Case.NOMINATIVE);  // "товарів"

pluralize(21, ['товар', 'товари', 'товарів']); // "товар"
getNumeralForm(5); // "many"

declineNumeralWord(125, Case.GENITIVE); // "ста двадцяти п'яти"
declineNumeralWord(21_000, Case.NOMINATIVE); // "двадцять одна тисяча"
declineNumeralWord(2_000_000, Case.NOMINATIVE); // "два мільйони"
```

`declineWithNumber` only forces a genitive-plural form when the governing case is nominative (or inanimate accusative) — every other case just picks singular vs. plural of that same case (`declineWithNumber('товар', 5, Case.DATIVE)` → `"товарам"`, not a genitive override).

`declineNumeralWord` declines the numeral word itself and supports whole numbers **0 up to 999 trillion**, composing тисяча/мільйон/мільярд/трильйон as scale nouns per group of 3 digits (each scale noun's own group agrees in case and number with that group's count — see [Limitations](#limitations)).

## API

- `decline(word, case, options?)`, `declension(word, case, options?)` (alias) → `string`
- `declineAll(word, options?)` → `Record<Case, string>`
- `detectGender(word)` → `Gender` (best-effort heuristic)
- `isIndeclinable(word)` → `boolean`
- `declineName(name, case, gender?)` → `DeclinedPersonName`
- `declineNameAll(name, gender?)` → `Record<Case, DeclinedPersonName>`
- `detectNameGender(name)` → `Gender | undefined`
- `getNumeralForm(count)` → `NumeralForm` (`'one' | 'few' | 'many'`)
- `pluralize(count, [one, few, many])` → `string`
- `declineWithNumber(word, count, case, options?)` → `string`
- `declineNumeralWord(count, case, gender?, animacy?)` → `string` (0–999,999,999,999,999)

`options: DeclensionOptions` — `{ gender?, animacy?, number?, declensionClass? }`, all optional.

`Case`, `Gender`, `Animacy`, `GrammaticalNumber`, `DeclensionClass`, `NumeralForm` are exported as const-object "enums" (`Case.GENITIVE`), each with a matching string-union type.

## Limitations

This library targets **rule-based coverage for the 4 Ukrainian noun declensions plus a bundled exceptions dictionary for common irregulars** — not a complete morphological dictionary. Known gaps, all by design:

- **Ambiguous bare endings.** A bare `-а/-я` word defaults to feminine; a bare consonant/`-ь` ending defaults to masculine. Pass `gender` explicitly for exceptions (feminine consonant-final nouns like `ніч`/`любов` are pre-populated in the built-in exceptions list, but not every word is).
- **Genitive singular а/у for hard-group masculine nouns** (e.g. `студента` vs `класу`) is lexically variable in Ukrainian; this defaults to the `-а` form and only switches to `-у` when you pass `{ animacy: 'inanimate' }` explicitly.
- **Occupational `-ар`/`-яр` nouns** (лікар, кобзар) take soft-group endings unlike most other р-final masculine nouns — a small set is bundled as exceptions, but not exhaustive.
- **The і/о,е stem alternation** (`ніч → ночі`, `сіль → солі`, `гість → гостя`) is only implemented for a bundled list of common words, not as a general rule (it's stress- and lexeme-dependent).
- **Genitive-plural epenthetic vowel insertion** (`сестра → сестер`, `вікно → вікон`) uses a best-effort 2-consonant-cluster heuristic; words that don't fit (`дошка → дощок`) need an exceptions-dictionary entry.
- **Fleeting о/е** (`садок → садка`) is detected from the productive `-ок`/`-ець`/`-ень` endings; a handful of words that merely end in those letters without a fleeting vowel (`крок → кроку`) are excluded via the exceptions dictionary.
- **Numeral word declension caps at 999 trillion** — no scale noun beyond трильйон is bundled, so anything requiring квадрильйон and up is out of scope.
- Not every Ukrainian noun, name, or numeral is covered — this is a rule engine plus a growing exceptions list, not an exhaustive dictionary. Contributions adding exceptions-dictionary entries are welcome.

## Development

```bash
npm ci
npm run build          # tsup — dual ESM/CJS + .d.ts
npm run lint
npm run typecheck
npm test                # vitest
npm run test:coverage
npm run test:types      # tsd + are-the-types-wrong
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint via a husky `commit-msg` hook); releases are automated with [semantic-release](https://semantic-release.gitbook.io/) on merge to `main`.

## License

MIT
