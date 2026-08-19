/**
 * Grila notarială — identificare preț de referință pe m² pe baza adresei.
 * Datele sunt decuplate în data/grila.json.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    let dateInitiale = null;
    try {
      dateInitiale = require("./data/grila.json");
    } catch (err) {
      console.warn("Nu s-a putut incarca ./data/grila.json:", err.message);
    }
    module.exports = factory(dateInitiale);
  } else {
    root.GrilaNotariala = factory();
  }
})(typeof self !== "undefined" ? self : this, function (dateInitiale) {
  "use strict";

  let DATE_JUDETE = dateInitiale || {};

  /** Setează dicționarul de date. */
  function seteazaDate(date) {
    if (date && typeof date === "object") {
      DATE_JUDETE = date;
    }
  }

  /** Încarcă datele dintr-un fișier JSON. */
  async function incarcaDate(url = "./data/grila.json") {
    try {
      const res = await fetch(url);
      const data = await res.json();
      seteazaDate(data);
      return data;
    } catch (err) {
      console.warn("Eroare la incarcarea grila.json:", err);
      return DATE_JUDETE;
    }
  }

  /** Returnează datele curente. */
  function getDate() {
    return DATE_JUDETE;
  }

  /** Elimină diacriticele și normalizează textul. */
  function normalizeaza(str) {
    if (!str || typeof str !== "string") return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ș/g, "s")
      .replace(/ț/g, "t")
      .replace(/ă/g, "a")
      .replace(/â/g, "a")
      .replace(/î/g, "i")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Identifică județul din componentele de adresă. */
  function identificaJudet(judetRaw, textNorm) {
    const judetNorm = normalizeaza(judetRaw);

    for (const [cheie, date] of Object.entries(DATE_JUDETE)) {
      const numeNorm = normalizeaza(date.nume);
      if (
        judetNorm.includes(numeNorm) ||
        (date.aliases && date.aliases.some((a) => judetNorm.includes(a))) ||
        textNorm.includes(`judetul ${numeNorm}`) ||
        textNorm.includes(`jud ${numeNorm}`) ||
        textNorm.includes(`jud ${cheie}`) ||
        textNorm.includes(`judetul ${cheie}`)
      ) {
        return [cheie, date];
      }
    }

    for (const [cheie, date] of Object.entries(DATE_JUDETE)) {
      const numeNorm = normalizeaza(date.nume);
      if (
        textNorm.includes(numeNorm) ||
        (date.aliases && date.aliases.some((a) => textNorm.includes(a)))
      ) {
        return [cheie, date];
      }
    }

    return null;
  }

  /** Determină prețul orientativ pe m² pe baza adresei. */
  function gasestePretGrila(adresa, overrideData) {
    const dateSursa = overrideData || DATE_JUDETE;
    const textComplet =
      typeof adresa === "string"
        ? adresa
        : adresa.display_name || JSON.stringify(adresa);
    const textNorm = normalizeaza(textComplet);

    const isObject = typeof adresa === "object" && adresa !== null;
    const orasRaw = isObject
      ? adresa.city || adresa.town || adresa.municipality || ""
      : "";
    const satRaw = isObject ? adresa.village || adresa.hamlet || "" : "";
    const cartierRaw = isObject
      ? adresa.suburb ||
        adresa.neighbourhood ||
        adresa.quarter ||
        adresa.city_district ||
        ""
      : "";
    const judetRaw = isObject ? adresa.county || adresa.state || "" : "";

    const localitateRaw = orasRaw || satRaw || cartierRaw;
    const localitateNorm = normalizeaza(localitateRaw);
    const cartierNorm = normalizeaza(cartierRaw);

    // 1. București
    if (
      localitateNorm.includes("bucuresti") ||
      textNorm.includes("bucuresti") ||
      textNorm.includes("bucharest") ||
      localitateNorm.includes("sector") ||
      cartierNorm.includes("sector")
    ) {
      const buc = dateSursa.bucuresti;

      if (buc) {
        if (buc.zone) {
          for (const [k, pret] of Object.entries(buc.zone)) {
            if (cartierNorm.includes(k) || textNorm.includes(k)) {
              const numeCartier = k.charAt(0).toUpperCase() + k.slice(1);
              return {
                pretRecomandat: pret,
                zonaIdentificata: `București (${numeCartier})`,
                nivelIncredere: "cartier",
              };
            }
          }
        }

        if (buc.sectoare) {
          for (const [sec, pret] of Object.entries(buc.sectoare)) {
            if (
              cartierNorm.includes(sec) ||
              textNorm.includes(sec) ||
              localitateNorm.includes(sec)
            ) {
              return {
                pretRecomandat: pret,
                zonaIdentificata: `București (${sec.toUpperCase()})`,
                nivelIncredere: "cartier",
              };
            }
          }
        }

        return {
          pretRecomandat: buc.resedinta
            ? buc.resedinta.pret
            : buc._implicit || 2200,
          zonaIdentificata: "București (Media orașului)",
          nivelIncredere: "oras",
        };
      }
    }

    // 2. Județ identificat
    const judetIdentificat = identificaJudet(judetRaw, textNorm);

    if (judetIdentificat) {
      const [, dateJud] = judetIdentificat;

      if (dateJud.orase) {
        for (const [orasKey, pret] of Object.entries(dateJud.orase)) {
          if (
            localitateNorm.includes(orasKey) ||
            cartierNorm.includes(orasKey) ||
            (isObject &&
              adresa.town &&
              normalizeaza(adresa.town).includes(orasKey)) ||
            (isObject &&
              adresa.village &&
              normalizeaza(adresa.village).includes(orasKey)) ||
            textNorm.includes(` ${orasKey} `) ||
            textNorm.startsWith(`${orasKey} `) ||
            textNorm.includes(`${orasKey},`)
          ) {
            const numeAfisat =
              orasKey.charAt(0).toUpperCase() + orasKey.slice(1);
            return {
              pretRecomandat: pret,
              zonaIdentificata: `${numeAfisat} (Jud. ${dateJud.nume})`,
              nivelIncredere: "oras_judetean",
            };
          }
        }
      }

      if (dateJud.zone) {
        for (const [k, pret] of Object.entries(dateJud.zone)) {
          if (cartierNorm.includes(k) || textNorm.includes(k)) {
            const numeCartier = k.charAt(0).toUpperCase() + k.slice(1);
            return {
              pretRecomandat: pret,
              zonaIdentificata: `${dateJud.resedinta.nume} (${numeCartier})`,
              nivelIncredere: "cartier",
            };
          }
        }
      }

      if (dateJud.resedinta) {
        const numeResNorm = normalizeaza(dateJud.resedinta.nume);
        if (
          localitateNorm.includes(numeResNorm) ||
          (isObject &&
            adresa.city &&
            normalizeaza(adresa.city).includes(numeResNorm))
        ) {
          return {
            pretRecomandat: dateJud.resedinta.pret,
            zonaIdentificata: `${dateJud.resedinta.nume} (Jud. ${dateJud.nume})`,
            nivelIncredere: "oras",
          };
        }
      }

      const esteOras = Boolean(isObject && adresa.town);
      const esteRural = Boolean(
        isObject && (adresa.village || adresa.hamlet || adresa.municipality),
      );
      const bazaPret = dateJud.resedinta ? dateJud.resedinta.pret : 1400;

      if (esteOras) {
        const pret = dateJud.implicitOras || Math.round(bazaPret * 0.65);
        const numeLoc = orasRaw
          ? orasRaw.charAt(0).toUpperCase() + orasRaw.slice(1)
          : "Oraș";
        return {
          pretRecomandat: pret,
          zonaIdentificata: `${numeLoc} (Jud. ${dateJud.nume})`,
          nivelIncredere: "oras_judetean",
        };
      }

      if (esteRural) {
        const pret = dateJud.implicitRural || Math.round(bazaPret * 0.4);
        const numeLoc = satRaw
          ? satRaw.charAt(0).toUpperCase() + satRaw.slice(1)
          : "Mediu rural";
        return {
          pretRecomandat: pret,
          zonaIdentificata: `${numeLoc} (Jud. ${dateJud.nume})`,
          nivelIncredere: "rural",
        };
      }

      const pretMediuJudet = dateJud.implicitOras || Math.round(bazaPret * 0.6);
      return {
        pretRecomandat: pretMediuJudet,
        zonaIdentificata: `Județul ${dateJud.nume}`,
        nivelIncredere: "oras_judetean",
      };
    }

    // 3. Căutare generală
    for (const [cheieJud, dateJud] of Object.entries(dateSursa)) {
      if (cheieJud === "bucuresti") continue;

      if (dateJud.orase) {
        for (const [orasKey, pret] of Object.entries(dateJud.orase)) {
          if (localitateNorm.includes(orasKey) || textNorm.includes(orasKey)) {
            const numeAfisat =
              orasKey.charAt(0).toUpperCase() + orasKey.slice(1);
            return {
              pretRecomandat: pret,
              zonaIdentificata: `${numeAfisat} (Jud. ${dateJud.nume})`,
              nivelIncredere: "oras_judetean",
            };
          }
        }
      }

      if (dateJud.resedinta) {
        const numeResNorm = normalizeaza(dateJud.resedinta.nume);
        if (
          localitateNorm.includes(numeResNorm) ||
          textNorm.includes(numeResNorm)
        ) {
          return {
            pretRecomandat: dateJud.resedinta.pret,
            zonaIdentificata: `${dateJud.resedinta.nume} (Jud. ${dateJud.nume})`,
            nivelIncredere: "oras",
          };
        }
      }
    }

    // 4. Fallback național
    return {
      pretRecomandat: 1600,
      zonaIdentificata: "România (Media generală)",
      nivelIncredere: "national",
    };
  }

  return {
    seteazaDate,
    incarcaDate,
    getDate,
    normalizeaza,
    identificaJudet,
    gasestePretGrila,
    gasestePretReferinta: gasestePretGrila,
  };
});
