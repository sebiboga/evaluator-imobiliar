/**
 * Evaluator imobiliar — nucleul de calcul.
 *
 * Surse: Decret-Lege 61/1990 (Anexa 1, art. 11-12; Anexa 2, art. 9 alin. 11).
 * Detalii și tabele complete: vezi bundle-ul OKF din /okf.
 *
 * Modul UMD: funcționează atât în Node.js (require), cât și în browser
 * (global `EvaluatorImobiliar`).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EvaluatorImobiliar = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /** Multiplicator de preț per tip de imobil (față de prețul de bază / m²). */
  const PRET_BASE_TIP = {
    apartament: 1.0,
    casa: 1.1,
    studio: 0.95,
    cort: 0.3,
    palat: 2.5,
  };

  /** Multiplicator per stare/condiții. */
  const STARE = {
    'vai-si-amar': 0.6,
    student: 0.75,
    decent: 1.0,
    renovat: 1.2,
    sublim: 1.4,
  };

  /** Coeficient de uzură pe vechime (Anexa 1, art. 11, Tabelul nr. 2). */
  const UZURA = [
    { panaLa: 5, coef: 1.0 },
    { panaLa: 7, coef: 0.97 },
    { panaLa: 10, coef: 0.93 },
    { panaLa: 15, coef: 0.89 },
    { panaLa: 20, coef: 0.85 },
    { panaLa: 25, coef: 0.81 },
    { panaLa: 30, coef: 0.77 },
    { panaLa: 35, coef: 0.73 },
    { panaLa: 40, coef: 0.69 },
    { panaLa: 45, coef: 0.65 },
    { panaLa: 50, coef: 0.61 },
  ];

  /**
   * Corecții procentuale pe nivelul locuinței (Anexa 2, art. 9, alin. 11).
   * Tabelul 2 — blocuri cu parter și P+1…P+11 etaje (1–12 niveluri).
   * Cheia = nivelul locuinței; valoarea = { numarNiveluriBloc: corectieProcente }.
   */
  const TABEL2 = {
    11: { 11: -9 },
    10: { 10: -9, 11: -3 },
    9: { 9: -8, 10: -3, 11: -2 },
    8: { 8: -8, 9: -2, 10: -2, 11: -1 },
    7: { 7: -6, 8: -2, 9: -2, 10: -1, 11: 0 },
    6: { 6: -6, 7: -2, 8: -1, 9: 0, 10: 0, 11: 0 },
    5: { 5: -5, 6: -2, 7: -1, 8: -1, 9: 0, 10: 1, 11: 1 },
    4: { 4: -5, 5: -1, 6: 0, 7: 0, 8: 2, 9: 2, 10: 3, 11: 3 },
    3: { 3: -4, 4: 0, 5: 0, 6: 2, 7: 2, 8: 3, 9: 3, 10: 4, 11: 4 },
    2: { 2: -3, 3: 1, 4: 3, 5: 4, 6: 4, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5 },
    1: { 1: 0, 2: 4, 3: 4, 4: 4, 5: 4, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5 },
  };

  /** Tabelul 3 — blocuri cu parter și P+12…P+17 etaje (13–18 niveluri). */
  const TABEL3 = {
    17: { 17: -12 },
    16: { 16: -12, 17: -6 },
    15: { 15: -11, 16: -6, 17: -5 },
    14: { 14: -11, 15: -5, 16: -5, 17: -4 },
    13: { 13: -10, 14: -4, 15: -4, 16: -4, 17: -3 },
    12: { 12: -10, 13: -4, 14: -3, 15: -3, 16: -2, 17: -2 },
    11: { 12: -4, 13: -3, 14: -2, 15: -1, 16: -1, 17: 0 },
    10: { 12: -3, 13: -2, 14: -1, 15: 0, 16: 0, 17: 0 },
    9: { 12: -2, 13: -1, 14: 0, 15: 0, 16: 0, 17: 0 },
    8: { 12: -1, 13: 0, 14: 0, 15: 0, 16: 0, 17: 1 },
    7: { 12: 0, 13: 0, 14: 0, 15: 1, 16: 1, 17: 2 },
    6: { 12: 1, 13: 1, 14: 1, 15: 2, 16: 3, 17: 3 },
    5: { 12: 3, 13: 3, 14: 3, 15: 3, 16: 4, 17: 4 },
    4: { 12: 4, 13: 4, 14: 4, 15: 4, 16: 5, 17: 5 },
    3: { 12: 5, 13: 5, 14: 5, 15: 5, 16: 6, 17: 6 },
    2: { 12: 5, 13: 5, 14: 5, 15: 6, 16: 7, 17: 7 },
    1: { 12: 5, 13: 5, 14: 6, 15: 6, 16: 7, 17: 7 },
  };

  /** Corecție parter în Tabelul 2: 0, 0, -1, -1, -2, -2, -3, -3… */
  const PARTER_TABEL2 = {
    1: 0, 2: 0, 3: -1, 4: -1, 5: -2, 6: -2,
    7: -3, 8: -3, 9: -3, 10: -3, 11: -3, 12: -3,
  };

  /**
   * Coeficient de uzură în funcție de anul construcției.
   * @param {number} anConstructie
   * @param {number} [anCurent] — ideal din server; default anul curent.
   * @returns {number}
   */
  function coefUzura(anConstructie, anCurent) {
    const an = anCurent || new Date().getFullYear();
    const vechime = an - anConstructie;
    if (vechime <= 0) return 1.0;
    for (const u of UZURA) {
      if (vechime <= u.panaLa) return u.coef;
    }
    return UZURA[UZURA.length - 1].coef;
  }

  /**
   * Coeficient demisol/mansardă: reducere 25% (Anexa 1, art. 12).
   * @param {boolean} esteDemisol
   * @param {boolean} esteMansarda
   * @returns {number}
   */
  function coefDemisolMansarda(esteDemisol, esteMansarda) {
    return esteDemisol || esteMansarda ? 0.75 : 1.0;
  }

  /**
   * Corecție procentuală pentru variația pe înălțime (Anexa 2).
   * @param {number|string} nivel — nivelul locuinței (1..17 sau 'P').
   * @param {number} numarNiveluri — numărul total de niveluri ale blocului (1..18).
   * @returns {number} corecție în procente (ex. -9, +5, 0).
   */
  function corectieInaltime(nivel, numarNiveluri) {
    if (numarNiveluri <= 12) {
      if (nivel === 'P' || nivel === 0) return PARTER_TABEL2[numarNiveluri] ?? -3;
      const tabel = TABEL2[nivel];
      return (tabel && tabel[numarNiveluri]) || 0;
    }
    if (nivel === 'P' || nivel === 0) return -3;
    const tabel = TABEL3[nivel];
    return (tabel && tabel[numarNiveluri]) || 0;
  }

  /**
   * Calculează valoarea estimată a imobilului.
   * @param {object} input
   * @param {string} input.tip — apartament | casa | studio | cort | palat
   * @param {number} input.suprafata — suprafața utilă (m²)
   * @param {number} input.pretPerMetruPatrat — prețul de bază (EUR/m²)
   * @param {string} [input.stare] — cheie din STARE (default 'decent')
   * @param {number} [input.anConstructie] — anul construcției
   * @param {number} [input.anCurent] — anul curent (opțional, server-side)
   * @param {boolean} [input.garaj] — imobilul are garaj (+5%)
   * @param {number|string} [input.nivel] — nivelul locuinței ('P' sau 1..17)
   * @param {number} [input.numarNiveluri] — total niveluri bloc (1..18)
   * @param {boolean} [input.demisol]
   * @param {boolean} [input.mansarda]
   * @returns {{ valoare: number, factori: object }}
   */
  function evalueaza(input) {
    const stare = STARE[input.stare] ?? STARE.decent;
    const pretBaza = input.pretPerMetruPatrat * (PRET_BASE_TIP[input.tip] ?? 1) * stare * input.suprafata;

    const kUzura = coefUzura(input.anConstructie, input.anCurent);
    const kDemisolMansarda = coefDemisolMansarda(input.demisol, input.mansarda);
    const corectieProcente = corectieInaltime(input.nivel, input.numarNiveluri);
    const kInaltime = 1 + corectieProcente / 100;
    const kGaraj = input.garaj ? 1.05 : 1.0;

    const valoare = pretBaza * kUzura * kDemisolMansarda * kInaltime * kGaraj;

    return {
      valoare,
      factori: {
        pretBaza,
        kUzura,
        kDemisolMansarda,
        corectieProcente,
        kInaltime,
        kGaraj,
      },
    };
  }

  return {
    PRET_BASE_TIP,
    STARE,
    UZURA,
    TABEL2,
    TABEL3,
    coefUzura,
    coefDemisolMansarda,
    corectieInaltime,
    evalueaza,
  };
});
