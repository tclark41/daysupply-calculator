/* =============================================================================
 * calc.js — Pure day-supply math (NO DOM). Shared by index.html and test.js.
 * =============================================================================
 * Every function takes a plain args object and returns:
 *   { daySupply, exact, prn, note, work:[...], reverse:{targetDays,text} }
 * or { error: "message" } when inputs are incomplete/invalid.
 *
 * Rounding rules:
 *   - day supply: floor by default, ceil when prn === true (round PRN up)
 *   - packaging / device / bottle counts: always ceil (no partial dispensing)
 * ========================================================================== */
(function (root, factory) {
  var mod = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = mod;
  else root.DayCalc = mod;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var EPS = 1e-9;

  function num(v) { var n = parseFloat(v); return isFinite(n) ? n : NaN; }
  function trimNum(n) { return Math.round(n * 1000) / 1000; }
  function roundSupply(exact, prn) {
    return prn ? Math.ceil(exact - EPS) : Math.floor(exact + EPS);
  }

  var DEFAULT_TARGET = 90;
  function target(a) { var t = num(a.target); return t > 0 ? t : DEFAULT_TARGET; }

  // ---------------------------------------------------------------- insulin
  function insulin(a) {
    var unitsPerPackage = num(a.unitsPerPackage);
    var dispenseUnit = a.dispenseUnit || "package";
    var name = a.name || "Insulin";
    var unitsPerDay = num(a.unitsPerDay);
    var inj = num(a.injPerDay); if (!(inj >= 0)) inj = 1;
    var prime = num(a.primePerInj); if (!isFinite(prime)) prime = 0;
    var packages = num(a.packages);

    if (!(unitsPerPackage > 0)) return { error: "Enter units per package." };
    if (!(unitsPerDay > 0)) return { error: "Enter units per day." };
    var effDaily = unitsPerDay + prime * inj;
    if (!(effDaily > 0)) return { error: "Effective daily units must be > 0." };
    if (!(packages > 0)) return { error: "Enter quantity dispensed (packages) to calculate day supply." };

    var totalUnits = packages * unitsPerPackage;
    var exact = totalUnits / effDaily;
    var daySupply = roundSupply(exact, a.prn);
    var primeTxt = prime > 0 ? " +" + trimNum(prime * inj) + "u prime" : "";
    var t = target(a);
    var pkgNeeded = Math.ceil((t * effDaily) / unitsPerPackage - EPS);

    return {
      daySupply: daySupply, exact: exact, prn: !!a.prn,
      note: name + ": " + trimNum(packages) + " × " + dispenseUnit + " (" + trimNum(totalUnits) +
            "u) ÷ " + trimNum(effDaily) + "u/day" + primeTxt + " = " + daySupply + " days",
      work: [
        trimNum(packages) + " pkg × " + trimNum(unitsPerPackage) + " u = " + trimNum(totalUnits) + " total units",
        "daily use " + trimNum(unitsPerDay) + (prime > 0 ? " + " + trimNum(prime * inj) + " priming" : "") +
          " = " + trimNum(effDaily) + " u/day",
      ],
      reverse: { targetDays: t, text: pkgNeeded + " × " + dispenseUnit + " (" + trimNum(pkgNeeded * unitsPerPackage) + "u)" },
    };
  }

  // --------------------------------------------------------------- warfarin
  // a.doses = array of 7 numbers (mg per day, Sun..Sat); blanks => 0
  function warfarin(a) {
    var strength = num(a.strength);
    if (!(strength > 0)) return { error: "Enter a valid tablet strength." };
    var labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var doses = a.doses || [];
    var tabsPerWeek = 0, anyDose = false, work = [];
    for (var d = 0; d < 7; d++) {
      var mg = num(doses[d]);
      if (isFinite(mg) && mg > 0) {
        anyDose = true;
        var t = mg / strength;
        tabsPerWeek += t;
        work.push(labels[d] + ": " + mg + " mg = " + trimNum(t) + " tab");
      }
    }
    if (!anyDose) return { error: "Enter the mg dose for at least one day." };
    work.push("weekly total = " + trimNum(tabsPerWeek) + " tablets");

    var qty = num(a.qty);
    if (!(qty > 0)) return { error: "Enter quantity dispensed (tablets)." };
    var exact = (qty * 7) / tabsPerWeek;
    var daySupply = roundSupply(exact, a.prn);
    var tg = target(a);
    var tabsNeeded = Math.ceil((tg * tabsPerWeek) / 7 - EPS);

    return {
      daySupply: daySupply, exact: exact, prn: !!a.prn,
      note: "Warfarin " + trimNum(strength) + "mg: " + trimNum(tabsPerWeek) + " tab/wk → " +
            trimNum(qty) + " tab ×7÷" + trimNum(tabsPerWeek) + " = " + daySupply + " days",
      work: work,
      reverse: { targetDays: tg, text: tabsNeeded + " tablets" },
    };
  }

  // ---------------------------------------------------------------- topical
  // FTU mode: a.regions = [{label, ftu}], a.gramsPerFtu (default 0.5)
  // grams mode: a.gPerApp
  function topical(a) {
    var work = [], gPerApp, regionTxt = "";
    if (a.mode === "grams") {
      gPerApp = num(a.gPerApp);
      if (!(gPerApp > 0)) return { error: "Enter grams per application." };
    } else {
      var regions = a.regions || [];
      if (!regions.length) return { error: "Select at least one area of application." };
      var gramsPerFtu = num(a.gramsPerFtu); if (!(gramsPerFtu > 0)) gramsPerFtu = 0.5;
      var sumFtu = 0, names = [];
      regions.forEach(function (r) { sumFtu += num(r.ftu); names.push(r.label); });
      gPerApp = sumFtu * gramsPerFtu;
      regionTxt = names.join("+") + " = " + trimNum(sumFtu) + " FTU";
      work.push(regionTxt + " × " + gramsPerFtu + " g = " + trimNum(gPerApp) + " g/application");
    }
    var appsPerDay = num(a.appsPerDay);
    if (!(appsPerDay > 0)) return { error: "Enter applications per day." };
    var dailyG = gPerApp * appsPerDay;
    work.push(trimNum(gPerApp) + " g/app × " + trimNum(appsPerDay) + "/day = " + trimNum(dailyG) + " g/day");

    var totalG = num(a.totalG);
    if (!(totalG > 0)) return { error: "Enter total grams dispensed." };
    var exact = totalG / dailyG;
    var daySupply = roundSupply(exact, a.prn);
    var head = a.mode === "grams" ? "Topical" : "Topical (" + regionTxt + ")";
    var tg = target(a);
    var gNeeded = Math.ceil(tg * dailyG - EPS);

    return {
      daySupply: daySupply, exact: exact, prn: !!a.prn,
      note: head + ": " + trimNum(gPerApp) + "g/app ×" + trimNum(appsPerDay) + "/day = " +
            trimNum(dailyG) + "g/day; " + trimNum(totalG) + "g ÷ " + trimNum(dailyG) + " = " + daySupply + " days",
      work: work,
      reverse: { targetDays: tg, text: gNeeded + " g" },
    };
  }

  // ------------------------------------------------------------------- eye
  function eye(a) {
    var ml = num(a.ml), dropsPerMl = num(a.dropsPerMl), dropsPerDose = num(a.dropsPerDose),
        dosesPerDay = num(a.dosesPerDay), both = a.bothEyes ? 2 : 1;
    if (!(dropsPerMl > 0)) return { error: "Enter drops per mL." };
    if (!(dropsPerDose > 0)) return { error: "Enter drops per dose." };
    if (!(dosesPerDay > 0)) return { error: "Enter doses per day." };
    var dropsPerDay = dropsPerDose * dosesPerDay * both;
    var work = [trimNum(dropsPerDose) + " drop × " + trimNum(dosesPerDay) + "/day × " + both +
                " eye(s) = " + trimNum(dropsPerDay) + " drops/day"];
    if (!(ml > 0)) return { error: "Enter bottle volume (mL)." };
    var totalDrops = ml * dropsPerMl;
    work.push(trimNum(ml) + " mL × " + trimNum(dropsPerMl) + " drops/mL = " + trimNum(totalDrops) + " drops");
    var exact = totalDrops / dropsPerDay;
    var daySupply = roundSupply(exact, a.prn);
    var tg = target(a);
    var bottles = Math.ceil((tg * dropsPerDay) / totalDrops - EPS);

    return {
      daySupply: daySupply, exact: exact, prn: !!a.prn,
      note: "Eye drops: " + trimNum(ml) + "mL ×" + trimNum(dropsPerMl) + " = " + trimNum(totalDrops) +
            " drops ÷ " + trimNum(dropsPerDay) + "/day" + (both === 2 ? " (OU)" : "") + " = " + daySupply + " days",
      work: work,
      reverse: { targetDays: tg, text: bottles + " bottle(s)" },
    };
  }

  // ----------------------------------------------------- inhaler / nasal
  function device(a) {
    var dosesPerDevice = num(a.dosesPerDevice);
    var name = a.name || "Device";
    var unitWord = a.unitWord || "dose", deviceWord = a.deviceWord || "device";
    if (!(dosesPerDevice > 0)) return { error: "Enter " + unitWord + "s per " + deviceWord + "." };
    var puffsPerDose = num(a.puffsPerDose), dosesPerDay = num(a.dosesPerDay), devices = num(a.devices);
    if (!(puffsPerDose > 0)) return { error: "Enter " + unitWord + "s per dose." };
    if (!(dosesPerDay > 0)) return { error: "Enter doses per day." };
    if (!(devices > 0)) devices = 1;
    var perDay = puffsPerDose * dosesPerDay;
    var totalDoses = devices * dosesPerDevice;
    var exact = totalDoses / perDay;
    var daySupply = roundSupply(exact, a.prn);
    var tg = target(a);
    var devNeeded = Math.ceil((tg * perDay) / dosesPerDevice - EPS);

    return {
      daySupply: daySupply, exact: exact, prn: !!a.prn,
      note: name + ": " + trimNum(totalDoses) + " " + unitWord + "s ÷ " + trimNum(perDay) +
            "/day = " + daySupply + " days",
      work: [
        trimNum(puffsPerDose) + " " + unitWord + "/dose × " + trimNum(dosesPerDay) + "/day = " + trimNum(perDay) + " " + unitWord + "s/day",
        trimNum(devices) + " " + deviceWord + " × " + trimNum(dosesPerDevice) + " = " + trimNum(totalDoses) + " total " + unitWord + "s",
      ],
      reverse: { targetDays: tg, text: devNeeded + " " + deviceWord + "(s)" },
    };
  }

  // ----------------------------------------------------------------- other
  function other(a) {
    var totalQty = num(a.totalQty), perDose = num(a.perDose), dosesPerDay = num(a.dosesPerDay);
    var unit = a.unit || "unit";
    if (!(perDose > 0)) return { error: "Enter amount per dose." };
    if (!(dosesPerDay > 0)) return { error: "Enter doses per day." };
    var perDay = perDose * dosesPerDay;
    var work = [trimNum(perDose) + " " + unit + " × " + trimNum(dosesPerDay) + "/day = " + trimNum(perDay) + " " + unit + "/day"];
    if (!(totalQty > 0)) return { error: "Enter total quantity dispensed." };
    var exact = totalQty / perDay;
    var daySupply = roundSupply(exact, a.prn);
    var tg = target(a);
    var qtyNeeded = Math.ceil(tg * perDay - EPS);

    return {
      daySupply: daySupply, exact: exact, prn: !!a.prn,
      note: trimNum(totalQty) + " " + unit + " ÷ " + trimNum(perDay) + " " + unit + "/day = " + daySupply + " days",
      work: work,
      reverse: { targetDays: tg, text: trimNum(qtyNeeded) + " " + unit },
    };
  }

  return {
    EPS: EPS, num: num, trimNum: trimNum, roundSupply: roundSupply, DEFAULT_TARGET: DEFAULT_TARGET,
    insulin: insulin, warfarin: warfarin, topical: topical, eye: eye, device: device, other: other,
  };
});
