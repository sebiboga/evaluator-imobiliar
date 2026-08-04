const test = require('node:test');
const assert = require('node:assert');
const Ev = require('../evaluator.js');

test('coefUzura: imobil nou (<=5 ani) are coeficient 1.00', () => {
  assert.strictEqual(Ev.coefUzura(2022, 2026), 1.0);
});

test('coefUzura: vechime de 30 ani -> 0.77', () => {
  assert.strictEqual(Ev.coefUzura(1996, 2026), 0.77);
});

test('coefUzura: vechime peste 50 ani -> ultimul coeficient 0.61', () => {
  assert.strictEqual(Ev.coefUzura(1900, 2026), 0.61);
});

test('coefDemisolMansarda: doar demisol -> 0.75', () => {
  assert.strictEqual(Ev.coefDemisolMansarda(true, false), 0.75);
});

test('coefDemisolMansarda: nimic -> 1.00', () => {
  assert.strictEqual(Ev.coefDemisolMansarda(false, false), 1.0);
});

test('corectieInaltime: parter in bloc P+9 (10 niveluri) -> -3%', () => {
  assert.strictEqual(Ev.corectieInaltime('P', 10), -3);
});

test('corectieInaltime: nivel 5 in bloc cu 11 niveluri -> +1%', () => {
  assert.strictEqual(Ev.corectieInaltime(5, 11), 1);
});

test('corectieInaltime: nivel 10 in bloc cu 13 niveluri (Tabel 3) -> -2%', () => {
  assert.strictEqual(Ev.corectieInaltime(10, 13), -2);
});

test('corectieInaltime: nivel 5 in bloc cu 17 niveluri (Tabel 3) -> +4%', () => {
  assert.strictEqual(Ev.corectieInaltime(5, 17), 4);
});

test('corectieInaltime: nivel 12 in bloc cu 17 niveluri (Tabel 3) -> -2%', () => {
  assert.strictEqual(Ev.corectieInaltime(12, 17), -2);
});

test('evalueaza: nivel 5 intr-un bloc cu 10 niveluri = +1%', () => {
  const r = Ev.evalueaza({
    tip: 'apartament',
    suprafata: 60,
    pretPerMetruPatrat: 1600,
    stare: 'decent',
    anConstructie: 2022,
    anCurent: 2026,
    nivel: 5,
    numarNiveluri: 10,
  });
  // 60 m² * 1600 EUR = 96000; stare decent x1; uzura <=5 ani x1;
  // nivel 5 intr-un bloc de 10 niveluri -> +1% (TABEL2[5][10] = 1); fara garaj/demisol.
  assert.ok(Math.abs(r.valoare - 96960) < 1e-6);
});

test('evalueaza: demisol + uzura + inaltime se inmultesc corect', () => {
  const r = Ev.evalueaza({
    tip: 'apartament',
    suprafata: 60,
    pretPerMetruPatrat: 1600,
    stare: 'decent',
    anConstructie: 1996,
    anCurent: 2026,
    nivel: 'P',
    numarNiveluri: 10,
    demisol: true,
  });
  // 96000 * 0.77 (uzura) * 0.75 (demisol) * 0.97 (P in bloc de 10 niveluri = -3%) = 53776.8
  assert.ok(Math.abs(r.valoare - 53776.8) < 1e-6);
});

test('evalueaza: garaj adauga +5%', () => {
  const r = Ev.evalueaza({
    tip: 'apartament',
    suprafata: 60,
    pretPerMetruPatrat: 1600,
    stare: 'decent',
    anConstructie: 2022,
    anCurent: 2026,
    nivel: 5,
    numarNiveluri: 10,
    garaj: true,
  });
  // 96000 * 1.01 (inaltime) * 1.05 (garaj) = 101808
  assert.ok(Math.abs(r.valoare - 101808) < 1e-6);
});

test('evalueaza: stare "sublim" aplica x1.4', () => {
  const r = Ev.evalueaza({
    tip: 'apartament',
    suprafata: 60,
    pretPerMetruPatrat: 1600,
    stare: 'sublim',
    anConstructie: 2022,
    anCurent: 2026,
    nivel: 5,
    numarNiveluri: 10,
  });
  // 96000 * 1.4 * 1.01 = 135744
  assert.ok(Math.abs(r.valoare - 135744) < 1e-6);
});
