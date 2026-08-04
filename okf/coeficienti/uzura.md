---
type: Attested Computation
title: Coeficient de uzură în funcție de vechimea imobilului
description: Coeficientul de corecție aplicat prețului în funcție de câți ani are construcția, conform Anexa 1, art. 11, Tabelul nr. 2 din Decret-Lege 61/1990.
tags: [coeficient, uzura, vechime, constructie]
status: stable
runtime: python
parameters:
  - { name: an_constructie, type: integer, required: true }
  - { name: an_curent, type: integer, required: true }
generated: { by: human:sebi, at: 2026-08-04T00:00:00Z }
verified: { by: human:sebi, at: 2026-08-04T00:00:00Z }
sources:
  - id: uzura-doc
    resource: /originale/eValuator/detalii tehnice/uzura in functie de data constructiei imobilului.docx
    title: uzura in functie de data constructiei imobilului.docx
    author: human:echipa-eValuator
    last_modified: 2014-04-12
  - id: dl61-tab2
    resource: http://www.expertasig.ro/legi/legi-utile-ro/DecretLege-61-1990.php
    title: DecretLege 61/1990, Anexa 1, art. 11, Tabelul nr. 2
---

# Descriere

Un imobil se uzează în timp. Prețul se înmulțește cu un coeficient de corecție în funcție de **vechimea construcției**.[^dl61-tab2]

# Tabelul coeficienților[^uzura-doc]

| Vechimea în ani | Coeficient de corecție |
|-----------------|------------------------|
| 0 – 5           | 1,00                   |
| 5 – 7           | 0,97                   |
| 7 – 10          | 0,93                   |
| 10 – 15         | 0,89                   |
| 15 – 20         | 0,85                   |
| 20 – 25         | 0,81                   |
| 25 – 30         | 0,77                   |
| 30 – 35         | 0,73                   |
| 35 – 40         | 0,69                   |
| 40 – 45         | 0,65                   |
| 45 – 50         | 0,61                   |

# Exemple de calcul[^uzura-doc]

1. Imobil construit în urmă cu **4 ani** → se înmulțește cu **1,00** (rezultatul e același).
2. Imobil construit în urmă cu **6 ani** → se înmulțește cu **0,97** (97%).
3. Imobil construit în urmă cu **21 de ani** → se înmulțește cu **0,81** (81%).

# Computation

    vechime = an_curent - an_constructie
    intervale = [
      (5, 1.00), (7, 0.97), (10, 0.93), (15, 0.89), (20, 0.85),
      (25, 0.81), (30, 0.77), (35, 0.73), (40, 0.69), (45, 0.65),
      (50, 0.61),
    ]
    coeficient = 1.00
    for limita, c in intervale:
        if vechime < limita:
            coeficient = c
            break
        coeficient = c  # ultimul interval (45-50)

# Mod de implementare

* **Date de intrare**: anul construcției imobilului.
* Se ia **anul curent** (ideal de la server, nu de la client, pentru a reduce erorile de calcul) și se scade anul construcției.
* Odată calculată vechimea, se determină coeficientul aferent intervalului.
* Prețul final se corectează cu acest coeficient de uzură.

[^uzura-doc]: uzura in functie de data constructiei imobilului.docx
[^dl61-tab2]: DecretLege 61/1990, Anexa 1, art. 11, Tabelul nr. 2
