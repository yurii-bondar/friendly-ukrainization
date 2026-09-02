import { describe, expect, it } from 'vitest';
import { CliUsageError, runCli, USAGE } from '../../src/cli-runner.js';

describe('runCli — decline', () => {
  it('declines a word for a single case', () => {
    expect(runCli(['decline', 'студент', '--case', 'genitive', '--animacy', 'animate'])).toBe('студента');
  });

  it('prints all cases as JSON when --case is omitted', () => {
    expect(JSON.parse(runCli(['decline', 'вікно']))).toEqual({
      nominative: 'вікно',
      genitive: 'вікна',
      dative: 'вікну',
      accusative: 'вікно',
      instrumental: 'вікном',
      locative: 'вікні',
      vocative: 'вікно',
    });
  });

  it('rejects a missing word', () => {
    expect(() => runCli(['decline'])).toThrow(CliUsageError);
  });

  it('rejects an unknown case', () => {
    expect(() => runCli(['decline', 'студент', '--case', 'nope'])).toThrow(CliUsageError);
  });
});

describe('runCli — numeral', () => {
  it('declines a numeral word for a single case', () => {
    expect(runCli(['numeral', '21000', '--case', 'genitive'])).toBe("двадцяти однієї тисячі");
  });

  it('prints all cases as JSON when --case is omitted', () => {
    const all = JSON.parse(runCli(['numeral', '5'])) as Record<string, string>;
    expect(all.genitive).toBe("п'яти");
  });

  it('rejects a non-numeric count', () => {
    expect(() => runCli(['numeral', 'abc'])).toThrow(CliUsageError);
  });
});

describe('runCli — adjective', () => {
  it('declines an adjective for a gender and case', () => {
    expect(runCli(['adjective', 'молодий', '--gender', 'feminine', '--case', 'dative'])).toBe('молодій');
  });

  it('declines the plural via --number plural', () => {
    expect(runCli(['adjective', 'молодий', '--case', 'nominative', '--number', 'plural'])).toBe('молоді');
  });

  it('rejects a missing word', () => {
    expect(() => runCli(['adjective'])).toThrow(CliUsageError);
  });
});

describe('runCli — name', () => {
  it('declines a first+patronymic+last name', () => {
    expect(runCli(['name', 'Дмитро', 'Олександрович', 'Ковальчук', '--case', 'genitive'])).toBe(
      'Дмитра Олександровича Ковальчука',
    );
  });

  it('declines a first+last name (no patronymic)', () => {
    expect(runCli(['name', 'Ольга', 'Ковальська', '--case', 'dative', '--gender', 'feminine'])).toBe(
      'Ользі Ковальській',
    );
  });

  it('rejects fewer than 2 positional arguments', () => {
    expect(() => runCli(['name', 'Дмитро'])).toThrow(CliUsageError);
  });
});

describe('runCli — transliterate', () => {
  it('transliterates the joined positional arguments', () => {
    expect(runCli(['transliterate', 'Дмитро', 'Ковальчук'])).toBe('Dmytro Kovalchuk');
  });

  it('rejects missing text', () => {
    expect(() => runCli(['transliterate'])).toThrow(CliUsageError);
  });
});

describe('runCli — help and unknown commands', () => {
  it('prints usage for no command, --help, -h, or help', () => {
    expect(runCli([])).toBe(USAGE);
    expect(runCli(['--help'])).toBe(USAGE);
    expect(runCli(['-h'])).toBe(USAGE);
    expect(runCli(['help'])).toBe(USAGE);
  });

  it('rejects an unknown command', () => {
    expect(() => runCli(['bogus'])).toThrow(CliUsageError);
  });

  it('rejects a flag with a missing value', () => {
    expect(() => runCli(['decline', 'студент', '--case'])).toThrow(CliUsageError);
  });
});
