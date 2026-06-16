/* test.js — Node acceptance tests for the day-supply math.
 * Run:  node test.js
 * Loads the SAME calc.js + products.js the browser uses (no re-implementation).
 */
global.window = {};                 // shim so products.js can set window.PHARMACY_PRODUCTS
require("./products.js");
var DB = global.window.PHARMACY_PRODUCTS;
var DC = require("./calc.js");

var pass = 0, fail = 0;
function check(name, got, want) {
  var ok = String(got) === String(want);
  if (ok) { pass++; console.log("  ✓ " + name + "  → " + got); }
  else { fail++; console.log("  ✗ " + name + "  → got " + got + ", expected " + want); }
}
function find(arr, sub) { return arr.find(function (p) { return p.name.indexOf(sub) >= 0; }); }

console.log("\n=== Day-Supply Calculator — acceptance tests ===\n");

// --- data sanity ---
var lantus = find(DB.insulin, "Lantus SoloStar");
console.log("Data checks:");
check("Lantus SoloStar units/box", lantus.unitsPerPackage, 1500);
check("Lantus SoloStar volume mL", lantus.packageVolumeMl, 15);
var ventolin = find(DB.inhaler, "Ventolin");
check("Ventolin doses/device", ventolin.dosesPerDevice, 200);

// --- 1. Insulin ---
console.log("\n1. Insulin (Lantus):");
var i1 = DC.insulin({ unitsPerPackage: 1500, dispenseUnit: "box (5 pens)", name: "Lantus",
                      unitsPerDay: 30, injPerDay: 1, primePerInj: 0, packages: 2, prn: false });
check("30u/day, 2 boxes, no prime", i1.daySupply, 100);
var i2 = DC.insulin({ unitsPerPackage: 1500, dispenseUnit: "box (5 pens)", name: "Lantus",
                      unitsPerDay: 30, injPerDay: 1, primePerInj: 2, packages: 2, prn: false });
check("with 2u priming/inj", i2.daySupply, 93);
check("reverse to 90 days (boxes)", i1.reverse.text, "2 × box (5 pens) (3000u)");
console.log("    note: " + i1.note);

// --- 2. Warfarin ---
console.log("\n2. Warfarin (5 mg, variable):");
// Sun..Sat:  Sun5 Mon7.5 Tue5 Wed7.5 Thu5 Fri7.5 Sat5  (M/W/F 7.5, rest 5)
var w1 = DC.warfarin({ strength: 5, doses: [5, 7.5, 5, 7.5, 5, 7.5, 5], qty: 30, prn: false });
check("8.5 tab/wk, 30 tab", w1.daySupply, 24);
check("reverse to 90 days (tablets)", w1.reverse.text, "110 tablets");
console.log("    note: " + w1.note);

// --- 3. Topical FTU ---
console.log("\n3. Topical (FTU, adult one arm):");
var t1 = DC.topical({ mode: "ftu", regions: [{ label: "One arm & hand", ftu: 4 }],
                      gramsPerFtu: 0.5, appsPerDay: 2, totalG: 30, prn: false });
check("4 FTU=2g/app BID, 30g", t1.daySupply, 7);
console.log("    note: " + t1.note);

// --- 4. Eye drops ---
console.log("\n4. Eye drops:");
var e1 = DC.eye({ ml: 5, dropsPerMl: 20, dropsPerDose: 1, dosesPerDay: 2, bothEyes: true, prn: false });
check("5mL, 1 drop BID OU", e1.daySupply, 25);
console.log("    note: " + e1.note);

// --- 5. Inhaler ---
console.log("\n5. Inhaler (Ventolin):");
var inh = DC.device({ dosesPerDevice: 200, name: "Ventolin HFA", puffsPerDose: 2, dosesPerDay: 4,
                      devices: 1, prn: false, unitWord: "puff", deviceWord: "inhaler" });
check("200 doses, 2 puffs QID", inh.daySupply, 25);
check("reverse to 90 days (inhalers)", inh.reverse.text, "4 inhaler(s)");
console.log("    note: " + inh.note);

// --- 6. PRN round-up ---
console.log("\n6. PRN rounding (fractional result):");
var prnOff = DC.device({ dosesPerDevice: 200, name: "Albuterol", puffsPerDose: 2, dosesPerDay: 3,
                         devices: 1, prn: false, unitWord: "puff", deviceWord: "inhaler" });
var prnOn = DC.device({ dosesPerDevice: 200, name: "Albuterol", puffsPerDose: 2, dosesPerDay: 3,
                        devices: 1, prn: true, unitWord: "puff", deviceWord: "inhaler" });
check("200/6=33.33 floor (non-PRN)", prnOff.daySupply, 33);
check("200/6=33.33 ceil (PRN)", prnOn.daySupply, 34);

// --- 7. Guards ---
console.log("\n7. Input guards (no NaN/Infinity):");
check("empty insulin → error", !!DC.insulin({}).error, true);
check("empty warfarin → error", !!DC.warfarin({}).error, true);
check("zero per-dose other → error", !!DC.other({ totalQty: 100, perDose: 0, dosesPerDay: 2 }).error, true);
check("blank eye → error", !!DC.eye({}).error, true);

// --- summary ---
console.log("\n=== " + pass + " passed, " + fail + " failed ===\n");
process.exit(fail ? 1 : 0);
