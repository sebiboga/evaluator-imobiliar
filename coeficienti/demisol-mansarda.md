---
type: Attested Computation
title: Coeficient demisol & mansardă
description: Reducere de 25% pentru locuințele situate la demisol sau mansardă (coeficient 0.75), conform Anexa 1, art. 12 din Decret-Lege 61/1990.
tags: [coeficient, demisol, mansarda, reducere]
status: stable
runtime: python
parameters:
  - { name: etaj, type: string, required: true }
generated: { by: human:sebi, at: 2026-08-04T00:00:00Z }
verified: { by: human:sebi, at: 2026-08-04T00:00:00Z }
sources:
  - id: demisol-doc
    resource: /originale/eValuator/detalii tehnice/demisol si mansarda.docx
    title: demisol si mansarda.docx
    author: human:echipa-eValuator
    last_modified: 2014-04-12
  - id: dl61-art12
    resource: http://www.expertasig.ro/legi/legi-utile-ro/DecretLege-61-1990.php
    title: DecretLege 61/1990, Anexa 1, art. 12
---

# Descriere

Imobilul aflat la **mansardă** sau **demisol** este mai ieftin. Conform legii, prețul se reduce cu **25%**.[^dl61-art12]

> **12.** Pentru locuințele situate la demisol sau mansardă prețurile se reduc cu 25%.

# Reguli

* Acest coeficient **se aplică împreună cu toți ceilalți coeficienți** (multiplicativ).[^demisol-doc]

# Exemple de calcul[^demisol-doc]

1. Imobil la **mansardă** → se scade 25% → se poate înmulți cu **75%** (0,75).
2. Imobil la **demisol** → se scade 25% → se poate înmulți cu **75%** (0,75).

# Computation

    coeficient = 0.75 if etaj in ("demisol", "mansarda") else 1.00

# Mod de implementare

* **Date de intrare**: etajul la care este situat imobilul.
* Se calculează un coeficient de **0,75** cu care va fi înmulțit prețul final, dacă etajul este mansardă sau demisol.
* Prețul final va fi corectat cu acest coeficient mansardă–demisol.

[^demisol-doc]: demisol si mansarda.docx
[^dl61-art12]: DecretLege 61/1990, Anexa 1, art. 12
