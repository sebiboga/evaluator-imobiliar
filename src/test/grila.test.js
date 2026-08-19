const test = require("node:test");
const assert = require("node:assert");
const Grila = require("../grila.js");

test("gasestePretGrila: Turda (Jud. Cluj)", () => {
  const res = Grila.gasestePretGrila({
    town: "Turda",
    county: "Județul Cluj",
  });
  assert.strictEqual(res.pretRecomandat, 1250);
  assert.ok(res.zonaIdentificata.includes("Turda"));
});

test("gasestePretGrila: Blaj (Jud. Alba)", () => {
  const res = Grila.gasestePretGrila({
    town: "Blaj",
    county: "Județul Alba",
  });
  assert.strictEqual(res.pretRecomandat, 1100);
  assert.ok(res.zonaIdentificata.includes("Blaj"));
});

test("gasestePretGrila: Cugir (Jud. Alba)", () => {
  const res = Grila.gasestePretGrila({
    town: "Cugir",
    county: "Județul Alba",
  });
  assert.strictEqual(res.pretRecomandat, 950);
  assert.ok(res.zonaIdentificata.includes("Cugir"));
});

test("gasestePretGrila: Teiuș (Jud. Alba)", () => {
  const res = Grila.gasestePretGrila({
    town: "Teiuș",
    county: "Județul Alba",
  });
  assert.strictEqual(res.pretRecomandat, 850);
  assert.ok(
    res.zonaIdentificata.includes("Teius") ||
      res.zonaIdentificata.includes("Teiuș"),
  );
});

test("gasestePretGrila: Sebeș (Jud. Alba)", () => {
  const res = Grila.gasestePretGrila({
    town: "Sebeș",
    county: "Județul Alba",
  });
  assert.strictEqual(res.pretRecomandat, 1250);
});

// 2. Teste pentru alte orașe secundare & zone metropolitane
test("gasestePretGrila: Dej (Jud. Cluj)", () => {
  const res = Grila.gasestePretGrila({
    town: "Dej",
    county: "Județul Cluj",
  });
  assert.strictEqual(res.pretRecomandat, 1150);
});

test("gasestePretGrila: Mediaș (Jud. Sibiu)", () => {
  const res = Grila.gasestePretGrila({
    town: "Mediaș",
    county: "Județul Sibiu",
  });
  assert.strictEqual(res.pretRecomandat, 1100);
});

test("gasestePretGrila: Câmpina (Jud. Prahova)", () => {
  const res = Grila.gasestePretGrila({
    town: "Câmpina",
    county: "Județul Prahova",
  });
  assert.strictEqual(res.pretRecomandat, 1200);
});

test("gasestePretGrila: Sinaia (Stațiune Prahova)", () => {
  const res = Grila.gasestePretGrila({
    town: "Sinaia",
    county: "Județul Prahova",
  });
  assert.strictEqual(res.pretRecomandat, 1800);
});

test("gasestePretGrila: Pașcani (Jud. Iași)", () => {
  const res = Grila.gasestePretGrila({
    town: "Pașcani",
    county: "Județul Iași",
  });
  assert.strictEqual(res.pretRecomandat, 1000);
});

// 3. Teste pentru sate / mediu rural (calcul procentual automat pe județ)
test("gasestePretGrila: Sat oarecare în Jud. Alba (ex: Galda de Jos)", () => {
  const res = Grila.gasestePretGrila({
    village: "Galda de Jos",
    county: "Județul Alba",
  });
  assert.strictEqual(res.pretRecomandat, 600); // 600 EUR/m² rural Alba
  assert.strictEqual(res.nivelIncredere, "rural");
});

test("gasestePretGrila: Sat oarecare în Jud. Cluj (ex: Căpușu Mare)", () => {
  const res = Grila.gasestePretGrila({
    village: "Căpușu Mare",
    county: "Județul Cluj",
  });
  assert.strictEqual(res.pretRecomandat, 800); // 800 EUR/m² rural Cluj
  assert.strictEqual(res.nivelIncredere, "rural");
});

// 4. Teste pentru orașe mari și cartiere
test("gasestePretGrila: București Dorobanți", () => {
  const res = Grila.gasestePretGrila({
    city: "București",
    suburb: "Dorobanți",
  });
  assert.strictEqual(res.pretRecomandat, 3900);
});

test("gasestePretGrila: Cluj-Napoca Mărăști", () => {
  const res = Grila.gasestePretGrila({
    city: "Cluj-Napoca",
    suburb: "Mărăști",
  });
  assert.strictEqual(res.pretRecomandat, 3000);
});

test("gasestePretGrila: Alba Iulia reședință", () => {
  const res = Grila.gasestePretGrila({
    city: "Alba Iulia",
    county: "Județul Alba",
  });
  assert.strictEqual(res.pretRecomandat, 1550);
});
