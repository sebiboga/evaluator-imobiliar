---
type: Reference
title: POC — formularul de evaluare (Default.html)
description: Structura proof-of-concept a evaluatorului: campurile de intrare și interfața utilizator.
tags: [poc, interfata, formular, ui]
status: stable
generated: { by: human:sebi, at: 2026-08-04T00:00:00Z }
sources:
  - id: default-html
    resource: /originale/eValuator/Default.html
    title: Default.html — POC (proof of concept)
    author: human:sebi
    last_modified: 2014-04-11
---

# Descriere

`Default.html` este **proof-of-concept**-ul evaluatorului imobiliar: un formular cu opțiuni de selecție, după care se afișează valoarea estimată (buton „Arata valoarea").

# Câmpurile formularului[^default-html]

| Câmp | Opțiuni |
|------|---------|
| Tip imobil | Cort, Studio, Apartament, Casa, Palat |
| Numar camere | 1, 2, 3, 4, Nenumarate |
| Garaj | Da, Nu (opțiune „Ce-i ala ?") |
| Conditii | Vai si amar, Student, Decent, Recent renovat, Sublim |
| Vechime | Nou nout, Mai nou de zece ani, Intre 10 si 50 de ani, De pe cand era bunica |

# Observații pentru implementare

* Opțiunile sunt în limba română, colocviale — pentru o aplicație finală se recomandă termeni tehnici standardizați (ex. stare: degradată / medie / bună / foarte bună / excelentă).
* Tipul imobilului trebuie corelat cu prețul de bază per m² (cort ≠ casă ≠ apartament).
* Opțiunile de vechime din POC se pot mapea pe intervalele de [coeficient de uzură](../coeficienti/uzura.md).

[^default-html]: Default.html
