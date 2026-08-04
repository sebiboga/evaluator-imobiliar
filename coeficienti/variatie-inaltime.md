---
type: Attested Computation
title: Variația pe înălțime (corecții pe nivelul locuinței)
description: Corecții procentuale aplicate prețului în funcție de nivelul (etajul) la care este situată locuința și de numărul de niveluri al blocului, conform Anexa 2, art. 9, alin. 11, Tabelele 2 și 3 din Decret-Lege 61/1990.
tags: [coeficient, etaj, nivel, inaltime, corectie]
status: stable
runtime: python
parameters:
  - { name: nivel_locuinta, type: integer, required: true }
  - { name: numar_niveluri_bloc, type: integer, required: true }
generated: { by: human:sebi, at: 2026-08-04T00:00:00Z }
verified: { by: human:sebi, at: 2026-08-04T00:00:00Z }
sources:
  - id: variatie-doc
    resource: /originale/eValuator/detalii tehnice/variatia pe inaltime.docx
    title: variatia pe inaltime.docx
    author: human:echipa-eValuator
    last_modified: 2014-04-12
  - id: variatie-xlsx
    resource: /originale/eValuator/detalii tehnice/variatia pe inaltime - tabel.xlsx
    title: variatia pe inaltime - tabel.xlsx
    author: human:echipa-eValuator
    last_modified: 2014-04-12
  - id: dl61-anexa2
    resource: http://www.expertasig.ro/legi/legi-utile-ro/DecretLege-61-1990.php
    title: DecretLege 61/1990, Anexa 2, art. 9, alin. 11, Tabelele 2 și 3
---

# Descriere

În funcție de **etajul** la care este locuința și de **nivelul de înălțime al imobilului**, prețul locuinței este ajustat procentual.[^variatie-doc]

Tabelele dau **corecții în procente** (pozitive = majorare, negative = reducere) aplicate prețurilor de vânzare determinate potrivit legii.[^dl61-anexa2]

# Tabelul nr. 2 — Clădiri cu parter și parter + (1–11) etaje[^variatie-xlsx]

Valoarea din tabel = corecția procentuală pentru locuința situată la *nivelul* din coloana 1, într-un bloc cu *numărul de niveluri* de pe prima linie.

| Nivelul locuinței | P | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|-------------------|---|---|---|---|---|---|---|---|---|---|----|----|
| **11** |   |   |   |   |   |   |   |   |   |   |    | −9 |
| **10** |   |   |   |   |   |   |   |   |   |   | −9 | −3 |
| **9**  |   |   |   |   |   |   |   |   |   | −8 | −3 | −2 |
| **8**  |   |   |   |   |   |   |   |   | −8 | −2 | −2 | −1 |
| **7**  |   |   |   |   |   |   |   | −6 | −2 | −2 | −1 | 0 |
| **6**  |   |   |   |   |   |   | −6 | −2 | −1 | 0 | 0 | 0 |
| **5**  |   |   |   |   |   | −5 | −2 | −1 | −1 | 0 | 1 | 1 |
| **4**  |   |   |   |   | −5 | −1 | 0 | 0 | 2 | 2 | 3 | 3 |
| **3**  |   |   |   | −4 | 0 | 0 | 2 | 2 | 3 | 3 | 4 | 4 |
| **2**  |   |   | −3 | 1 | 3 | 4 | 4 | 5 | 5 | 5 | 5 | 5 |
| **1**  |   | 0 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 5 |
| **P**  | 0 | 0 | −1 | −1 | −2 | −2 | −3 | −3 | −3 | −3 | −3 | −3 |

# Tabelul nr. 3 — Clădiri cu parter și parter + (12–17) etaje[^variatie-xlsx]

| Nivelul locuinței | 12 | 13 | 14 | 15 | 16 | 17 |
|-------------------|---|---|---|---|---|----|
| **17** |   |   |   |   |   | −12 |
| **16** |   |   |   |   | −12 | −6 |
| **15** |   |   |   | −11 | −6 | −5 |
| **14** |   |   | −11 | −5 | −5 | −4 |
| **13** |   | −10 | −4 | −4 | −4 | −3 |
| **12** | −10 | −4 | −3 | −3 | −2 | −2 |
| **11** | −4 | −3 | −2 | −1 | −1 | 0 |
| **10** | −3 | −2 | −1 | 0 | 0 | 0 |
| **9**  | −2 | −1 | 0 | 0 | 0 | 0 |
| **8**  | −1 | 0 | 0 | 0 | 0 | 1 |
| **7**  | 0 | 0 | 0 | 1 | 1 | 2 |
| **6**  | 1 | 1 | 1 | 2 | 3 | 3 |
| **5**  | 3 | 3 | 3 | 3 | 4 | 4 |
| **4**  | 4 | 4 | 4 | 4 | 5 | 5 |
| **3**  | 5 | 5 | 5 | 5 | 6 | 6 |
| **2**  | 5 | 5 | 5 | 6 | 7 | 7 |
| **1**  | 5 | 5 | 6 | 6 | 7 | 7 |
| **P**  | −3 | −3 | −3 | −3 | −3 | −3 |

# Reguli de interpretare

* **Tabelul 2** se folosește pentru blocuri cu parter și parter + (1–11) etaje (total 1–12 niveluri).
* **Tabelul 3** se folosește pentru blocuri cu parter și parter + (12–17) etaje (total 13–18 niveluri).
* Valorile goale din tabel înseamnă că acea combinație nivel/număr de niveluri nu există (ex. nivel 11 într-un bloc cu 10 niveluri).
* Corecțiile se aplică **procentual** și se adună la preț (ex. −9% înseamnă preț × 0,91; +5% înseamnă preț × 1,05), împreună cu ceilalți coeficienți multiplicativi.

# Computation

    tabel2 = {
      11: {11: -9},
      10: {10: -9, 11: -3},
      9:  {9: -8, 10: -3, 11: -2},
      8:  {8: -8, 9: -2, 10: -2, 11: -1},
      7:  {7: -6, 8: -2, 9: -2, 10: -1, 11: 0},
      6:  {6: -6, 7: -2, 8: -1, 9: 0, 10: 0, 11: 0},
      5:  {5: -5, 6: -2, 7: -1, 8: -1, 9: 0, 10: 1, 11: 1},
      4:  {4: -5, 5: -1, 6: 0, 7: 0, 8: 2, 9: 2, 10: 3, 11: 3},
      3:  {3: -4, 4: 0, 5: 0, 6: 2, 7: 2, 8: 3, 9: 3, 10: 4, 11: 4},
      2:  {2: -3, 3: 1, 4: 3, 5: 4, 6: 4, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5},
      1:  {1: 0, 2: 4, 3: 4, 4: 4, 5: 4, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5},
      "P": {niveluri: -3},
    }
    # parter: P:0 pt 1 nivel, P:0, apoi -1,-1,-2,-2,-3...

# Mod de implementare

* **Date de intrare**: nivelul (etajul) la care este situată locuința și numărul de niveluri al blocului.
* Se alege tabelul potrivit după numărul de niveluri (Tabel 2 sau Tabel 3).
* Se citește corecția procentuală pentru combinația (nivel, număr de niveluri).
* Se transformă corecția în factor: `factor = 1 + corectie/100` și se înmulțește prețul.

[^variatie-doc]: variatia pe inaltime.docx
[^variatie-xlsx]: variatia pe inaltime - tabel.xlsx
[^dl61-anexa2]: DecretLege 61/1990, Anexa 2, art. 9, alin. 11, Tabelele 2 și 3
