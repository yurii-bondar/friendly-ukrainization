import { describe, expect, it } from 'vitest';
import { Case, declineName, declineNameAll } from '../../src/index.js';

describe('names smoke', () => {
  it('declines a masculine full name (-о given name, regular surname, patronymic)', () => {
    const name = { firstName: 'Дмитро', patronymic: 'Олександрович', lastName: 'Ковальчук' };
    expect(declineName(name, Case.GENITIVE).full).toBe('Дмитра Олександровича Ковальчука');
    expect(declineName(name, Case.DATIVE).full).toBe('Дмитрові Олександровичеві Ковальчукові');
  });

  it('declines a feminine full name (adjectival surname)', () => {
    const name = { firstName: 'Ольга', patronymic: 'Олександрівна', lastName: 'Ковальська' };
    expect(declineName(name, Case.GENITIVE).full).toBe('Ольги Олександрівни Ковальської');
    expect(declineName(name, Case.DATIVE).full).toBe('Ользі Олександрівні Ковальській');
  });

  it('declines a full name with a -й given name and patronymic (Юрій Анатолійович Бондар)', () => {
    const name = { firstName: 'Юрій', patronymic: 'Анатолійович', lastName: 'Бондар' };
    const all = declineNameAll(name);
    expect(all[Case.NOMINATIVE].full).toBe('Юрій Анатолійович Бондар');
    expect(all[Case.GENITIVE].full).toBe('Юрія Анатолійовича Бондаря');
    expect(all[Case.DATIVE].full).toBe('Юрієві Анатолійовичеві Бондареві');
    expect(all[Case.ACCUSATIVE].full).toBe('Юрія Анатолійовича Бондаря');
    expect(all[Case.INSTRUMENTAL].full).toBe('Юрієм Анатолійовичем Бондарем');
    expect(all[Case.LOCATIVE].full).toBe('Юрії Анатолійовичі Бондарі');
    expect(all[Case.VOCATIVE].full).toBe('Юрію Анатолійовичу Бондарю');
  });

  it('declines a masculine adjectival surname (accusative = genitive)', () => {
    const name = { firstName: 'Іван', lastName: 'Ковальський' };
    expect(declineName(name, Case.GENITIVE).full).toBe('Івана Ковальського');
    expect(declineName(name, Case.ACCUSATIVE).full).toBe('Івана Ковальського');
    expect(declineName(name, Case.INSTRUMENTAL).full).toBe('Іваном Ковальським');
  });

  it('keeps a consonant-final surname indeclinable for a female bearer', () => {
    const name = { firstName: 'Ольга', lastName: 'Ковальчук' };
    expect(declineName(name, Case.GENITIVE).full).toBe('Ольги Ковальчук');
  });

  it('declines the same consonant-final surname for a male bearer', () => {
    const name = { firstName: 'Олександр', lastName: 'Ковальчук' };
    expect(declineName(name, Case.GENITIVE).full).toBe('Олександра Ковальчука');
  });

  it('leaves -ко/-енко surnames indeclinable', () => {
    const name = { firstName: 'Тарас', lastName: 'Шевченко' };
    expect(declineName(name, Case.GENITIVE).full).toBe('Тараса Шевченко');
  });

  it('declines hyphenated surnames part by part', () => {
    const name = { firstName: 'Ольга', lastName: 'Дзюба-Ковальська' };
    expect(declineName(name, Case.GENITIVE).full).toBe('Ольги Дзюби-Ковальської');
  });

  it('omits a missing firstName from the full string', () => {
    const name = { patronymic: 'Олександрівна', lastName: 'Ковальська' };
    expect(declineName(name, Case.GENITIVE).full).toBe('Олександрівни Ковальської');
    expect(declineName(name, Case.GENITIVE).firstName).toBeUndefined();
  });

  it('produces all 7 cases via declineNameAll', () => {
    const all = declineNameAll({ firstName: 'Марія' });
    expect(all[Case.NOMINATIVE].full).toBe('Марія');
    expect(all[Case.GENITIVE].full).toBe('Марії');
    expect(all[Case.VOCATIVE].full).toBe('Маріє');
  });
});
