# Evaluator Imobiliar

Estimare a valorii de piață a unui apartament sau imobil, pe baza coeficienților legali din **Decret-Lege 61/1990** (Anexa 1, art. 11–12; Anexa 2, art. 9, alin. 11) — proiectul „eValuator" (2014).

## Structura repo-ului

```
evaluator-imobiliar/
├── okf/          # knowledge bundle OKF v0.2 (cadru legal, coeficienți, cercetare)
├── src/          # codul sursă al evaluatorului (nucleu de calcul reutilizabil)
│   └── test/     # teste automate (node:test)
├── docs/         # varianta web prin care se evaluează un imobil
└── package.json
```

## Utilizare

### Din Node.js (API / scripturi)

```js
const Ev = require('./src/evaluator.js');

const rezultat = Ev.evalueaza({
  tip: 'apartament',
  suprafata: 60,                 // m²
  pretPerMetruPatrat: 1600,      // EUR
  stare: 'decent',
  anConstructie: 1996,
  nivel: 'P',
  numarNiveluri: 10,
  demisol: true,
});

console.log(rezultat.valoare);        // valoare estimată (EUR)
console.log(rezultat.factori);        // descompunerea pe factori
```

### Web

Deschide `docs/index.html` în browser (sau servește rădăcina repo-ului — pagina încarcă `src/evaluator.js` prin cale relativă, deci funcționează și cu GitHub Pages servit de pe root).

## Teste

```bash
npm test
```

## Surse & documentație

Coeficienții, tabelele și cadrul legal sunt documentate în bundle-ul OKF: [`okf/index.md`](okf/index.md).
