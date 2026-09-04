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

test('evalueaza: casa adauga valoarea terenului', () => {
  const r = Ev.evalueaza({
    tip: 'casa',
    suprafata: 100,
    pretPerMetruPatrat: 1000,
    stare: 'decent',
    anConstructie: 2022,
    anCurent: 2026,
    nivel: 'P',
    numarNiveluri: 1,
    suprafataTeren: 500,
    pretTerenPerMetruPatrat: 100,
  });
  // Constructie: 100 m² * 1000 * 1.1 (tip casa) * 1.0 (decent) = 110.000 EUR
  // Teren: 500 m² * 100 EUR = 50.000 EUR
  // Total: 160.000 EUR
  assert.strictEqual(r.factori.valoareConstructie, 110000);
  assert.strictEqual(r.factori.valoareTeren, 50000);
  assert.strictEqual(r.valoare, 160000);
});

test('evalueaza: apartament ignora terenul', () => {
  const r = Ev.evalueaza({
    tip: 'apartament',
    suprafata: 50,
    pretPerMetruPatrat: 1000,
    stare: 'decent',
    anConstructie: 2022,
    anCurent: 2026,
    nivel: 1,
    numarNiveluri: 4,
    suprafataTeren: 500,
    pretTerenPerMetruPatrat: 100,
  });
  // Constructie: 50 * 1000 * 1.0 = 50.000 EUR; Teren: 0 EUR
  assert.strictEqual(r.factori.valoareTeren, 0);
  assert.strictEqual(r.valoare, 50000 * 1.04);
});

test('evalueaza: cort include terenul si nu aplica corectie de bloc', () => {
  const r = Ev.evalueaza({
    tip: 'cort',
    suprafata: 20,
    pretPerMetruPatrat: 1000,
    stare: 'decent',
    anConstructie: 2022,
    anCurent: 2026,
    nivel: 5,
    numarNiveluri: 10,
    suprafataTeren: 200,
    pretTerenPerMetruPatrat: 50,
  });
  // Constructie: 20 m² * 1000 * 0.3 (cort) * 1.0 (decent) = 6000 EUR
  // Teren: 200 m² * 50 EUR = 10000 EUR
  // Total: 16000 EUR (corectie inaltime nu se aplica la cort)
  assert.strictEqual(r.factori.valoareConstructie, 6000);
  assert.strictEqual(r.factori.valoareTeren, 10000);
  assert.strictEqual(r.valoare, 16000);
});

test('genereazaDescriere: apartament standard cu etaj si bloc', () => {
  const descriere = Ev.genereazaDescriere({
    tip: 'apartament',
    camere: 2,
    suprafata: 60,
    stare: 'decent',
    anConstructie: 1980,
    anCurent: 2026,
    nivel: 1,
    numarNiveluri: 10,
    garaj: true,
  }, { zona: 'București (Piața Romană)' });

  assert.ok(descriere.includes('Imobil de tip Apartament'));
  assert.ok(descriere.includes('cu o suprafață utilă de 60 m²'));
  assert.ok(descriere.includes('compus din 2 camere'));
  assert.ok(descriere.includes('în zona București (Piața Romană)'));
  assert.ok(descriere.includes('etajul 1'));
  assert.ok(descriere.includes('regim de înălțime P+9'));
  assert.ok(descriere.includes('1980'));
  assert.ok(descriere.includes('vechime 46 ani'));
  assert.ok(descriere.includes('Include garaj'));
  // Asigurare că NU include prețul pe metru pătrat
  assert.ok(!descriere.includes('/m²'));
  assert.ok(!descriere.includes('EUR'));
});

test('genereazaDescriere: casa cu teren', () => {
  const descriere = Ev.genereazaDescriere({
    tip: 'casa',
    camere: 4,
    suprafata: 150,
    stare: 'renovat',
    anConstructie: 2015,
    anCurent: 2026,
    suprafataTeren: 500,
    garaj: false,
  }, { zona: 'Cluj-Napoca (Mărăști)' });

  assert.ok(descriere.includes('Imobil de tip Casă'));
  assert.ok(descriere.includes('compus din 4 camere'));
  assert.ok(descriere.includes('teren aferent cu suprafața de 500 m²'));
  assert.ok(descriere.includes('recent renovat'));
  assert.ok(!descriere.includes('etajul'));
  assert.ok(!descriere.includes('regim de înălțime'));
  assert.ok(!descriere.includes('garaj'));
  assert.ok(!descriere.includes('/m²'));
});

test('genereazaDescriere: apartament la mansarda', () => {
  const descriere = Ev.genereazaDescriere({
    tip: 'apartament',
    camere: 3,
    suprafata: 80,
    stare: 'sublim',
    anConstructie: 2020,
    anCurent: 2026,
    mansarda: true,
    numarNiveluri: 5,
  }, { zona: 'Sinaia (Prahova)' });

  assert.ok(descriere.includes('la mansardă'));
  assert.ok(descriere.includes('P+4'));
  assert.ok(descriere.includes('finisaje de lux'));
});

test('genereazaDescriere: casa cu numar niveluri (P+1)', () => {
  const descriere = Ev.genereazaDescriere({
    tip: 'casa',
    camere: 5,
    suprafata: 160,
    numarNiveluri: 2,
    stare: 'decent',
    anConstructie: 2018,
    anCurent: 2026,
    suprafataTeren: 300,
  });

  assert.ok(descriere.includes('Imobil de tip Casă'));
  assert.ok(descriere.includes('regim de înălțime P+1'));
  assert.ok(descriere.includes('300 m²'));
  assert.ok(!descriere.includes('etajul'));
});




