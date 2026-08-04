# Directory Update Log

## 2026-08-04
* **Creation**: Am stabilit bundle-ul de knowledge OKF pentru proiectul evaluator imobiliar, pornind de la documentele originale (eValuator 2014): Cercetare.docx, Master DOC.docx, roadMAP.docx, Default.html și folderul „detalii tehnice".
* **Creation**: Concepte: proiect, POC, cadru legal (Decret-Lege 61/1990), coeficienți (uzură, demisol/mansardă, variație pe înălțime), surse de cercetare.
* **Restructure**: Bundle-ul OKF a fost mutat într-un folder dedicat `okf/` pentru a putea lucra la proiect în același repo, alături de `src/` (codul evaluatorului) și `docs/` (varianta web).
* **Creation**: `src/evaluator.js` — modul UMD care implementează coeficienții din bundle (uzură, demisol/mansardă, variație pe înălțime, garaj, stare). Tabelele 2 și 3 au fost transpuse în cod pe baza `okf/coeficienti/variatie-inaltime.md`.
* **Creation**: `src/test/evaluator.test.js` — 14 teste (node:test) care verifică coeficienții și valoarea finală; toate trec.
* **Creation**: `docs/index.html` — varianta web de evaluare a unui apartament/imobil; folosește aceeași logică ca `src/evaluator.js`.
* **Deploy**: GitHub Pages activat din folderul `docs/` (https://sebiboga.github.io/evaluator-imobiliar/). Pentru că Pages servește doar `docs/`, se menține `docs/evaluator.js` — copie a `src/evaluator.js`, sincronizată cu `npm run build:docs`.
