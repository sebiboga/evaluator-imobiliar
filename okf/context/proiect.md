---
type: Project
title: Proiectul eValuator
description: Proiect din 2014 pentru construirea unui evaluator imobiliar online — scop, istoric (roadmap) și componente.
tags: [evaluator-imobiliar, proiect, roadmap, 2014]
status: stable
generated: { by: human:sebi, at: 2026-08-04T00:00:00Z }
sources:
  - id: road-map
    resource: /originale/eValuator/roadMAP.docx
    title: roadMAP.docx — acțiunile făcute până acum
    author: human:echipa-eValuator
    last_modified: 2014-04-12
  - id: master-doc
    resource: /originale/eValuator/Master DOC.docx
    title: Master DOC.docx — documentul de referință al directorului
    author: human:echipa-eValuator
    last_modified: 2014-04-12
---

# Scop

Construirea unui **evaluator imobiliar online** (calculator de valoare de piață pentru locuințe din România), bazat pe coeficienți legali de corecție (Decret-Lege 61/1990) și pe valori de piață per m² (ANEVAR).

# Structura originală a directorului

Directorul `eValuator/` conținea:[^master-doc]

* **roadMAP.docx** — acțiunile făcute până acum (istoric).
* **Master DOC.docx** — documentul de referință, cu scopul fiecărui fișier.
* **Default.html** — POC (proof of concept): formularul de evaluare.
* **detalii tehnice/** — coeficienții care influențează evaluarea.
* **Cercetare.docx** — surse de informare și informația extrasă.

# Istoric (roadmap)[^road-map]

* Refacută pagina principală de pe www.infopower.ro.
* Creată locația www.infopower.ro/evaluator pentru evaluatorul imobiliar.
* Uploadat POC-ul (creat de Dragos) în `/evaluator`.
* Uploadată harta seismică a României: http://www.infopower.ro/evaluator/zonare_seismica.png
* Creat un folder pe Google Docs cu detalii tehnice, pentru a păstra istoricul coeficienților și parametrilor folosiți în aplicație.

# Ce urmează pentru dezvoltare

* Aplicația trebuie să aplice, pe un preț de bază per m², coeficienți de corecție multiplicativi (vezi [coeficienți](../coeficienti/index.md)) și să afișeze valoarea estimată.
* Prețul de bază per m² provine din valori de piață (ex. expertize ANEVAR) — vezi [cercetare](../cercetare/surse.md).

[^master-doc]: Master DOC.docx
[^road-map]: roadMAP.docx
