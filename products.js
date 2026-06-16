/* =============================================================================
 * products.js — Local product reference data for the Day-Supply Calculator
 * =============================================================================
 *
 *  HOW TO USE / MAINTAIN
 *  ---------------------
 *  - This file is loaded by index.html via <script src="products.js"></script>.
 *    It works offline from a file:// page (a fetch() of a .csv would not).
 *  - To add or correct a product, edit the relevant array below and save.
 *    No build step, no server. Refresh the page to load changes.
 *
 *  ⚠️  VERIFY BEFORE CLINICAL USE
 *  -----------------------------
 *  Every clinical record is marked `verify: true`. NDC codes, units/package,
 *  doses-per-device, priming amounts, and drops/mL are seeded from common
 *  package facts but MUST be confirmed against the current manufacturer
 *  package insert / NDC label before being relied on for billing. Package
 *  sizes and NDCs change. When you confirm an entry, set `verify: false`.
 *
 *  FIELD NOTES
 *  -----------
 *  insulin[]   form: "pen" | "vial"
 *              concentration: units/mL (100, 200, 300, 500)
 *              unitsPerUnit: units in one pen OR one vial
 *              unitsPerInPerPackage: total units in the smallest DISPENSABLE
 *                 package (a pen BOX cannot be broken; a vial is dispensable
 *                 singly). dispenseUnit names that package.
 *              primingUnitsPerPrime: units wasted priming the device each
 *                 injection (pens ~2, vials 0). The calculator multiplies this
 *                 by injections/day.
 *  inhaler[] / nasal[]   dosesPerDevice = total actuations/sprays per device.
 *  ophthalmic            default 20 drops/mL; products[] lists known deviations.
 * ========================================================================== */

window.PHARMACY_PRODUCTS = {
  meta: {
    version: "0.2",
    seeded: "2026-06-15",
    dosesConfirmed: "2026-06-15",
    disclaimer:
      "Confirm every value against the current package insert before billing. The 'verify' flag " +
      "refers to the UNIT/DOSE COUNT used in the math (units per package, doses per device, drops/mL). " +
      "Entries without a verify badge had that count confirmed against a reputable source on the " +
      "dosesConfirmed date. NDC codes throughout are REPRESENTATIVE only and may not match the exact " +
      "package on your shelf — always check the NDC if you rely on it for lookup.",
  },

  /* ---------------------------------------------------------------------------
   * INSULIN
   * unitsPerPackage = the smallest package you can actually hand out.
   *   pens  -> a full box (cannot be split)
   *   vials -> one vial
   * ------------------------------------------------------------------------- */
  insulin: [
    // ---- Long-acting (basal) ----
    { ndc: "00088-2220-33", name: "Lantus SoloStar (insulin glargine U-100)", form: "pen", concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },
    { ndc: "00088-2220-00", name: "Lantus vial (insulin glargine U-100)", form: "vial", concentration: 100, unitsPerUnit: 1000, pensPerBox: 1, unitsPerPackage: 1000, packageVolumeMl: 10, dispenseUnit: "vial (10 mL)", primingUnitsPerPrime: 0, verify: false },
    { ndc: "00002-7715-59", name: "Basaglar KwikPen (glargine U-100)", form: "pen", concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },
    { ndc: "00169-6438-10", name: "Levemir FlexTouch (detemir U-100)", form: "pen", concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },
    { ndc: "00169-2660-15", name: "Tresiba FlexTouch U-100 (degludec)", form: "pen", concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },
    { ndc: "00169-2550-13", name: "Tresiba FlexTouch U-200 (degludec)", form: "pen", concentration: 200, unitsPerUnit: 600, pensPerBox: 3, unitsPerPackage: 1800, packageVolumeMl: 9, dispenseUnit: "box (3 pens)", primingUnitsPerPrime: 2, verify: false },
    { ndc: "00024-5867-03", name: "Toujeo SoloStar U-300 (glargine)", form: "pen", concentration: 300, unitsPerUnit: 450, pensPerBox: 3, unitsPerPackage: 1350, packageVolumeMl: 4.5, dispenseUnit: "box (3 pens)", primingUnitsPerPrime: 3, verify: false },
    { ndc: "00024-5869-02", name: "Toujeo Max SoloStar U-300 (glargine)", form: "pen", concentration: 300, unitsPerUnit: 900, pensPerBox: 2, unitsPerPackage: 1800, packageVolumeMl: 6, dispenseUnit: "box (2 pens)", primingUnitsPerPrime: 3, verify: false },

    // ---- Rapid-acting (mealtime) ----
    { ndc: "00002-8799-59", name: "Humalog KwikPen U-100 (lispro)", form: "pen", concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },
    { ndc: "00002-7716-59", name: "Humalog KwikPen U-200 (lispro)", form: "pen", concentration: 200, unitsPerUnit: 600, pensPerBox: 5, unitsPerPackage: 3000, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },
    { ndc: "00002-7510-01", name: "Humalog vial U-100 (lispro)", form: "vial", concentration: 100, unitsPerUnit: 1000, pensPerBox: 1, unitsPerPackage: 1000, packageVolumeMl: 10, dispenseUnit: "vial (10 mL)", primingUnitsPerPrime: 0, verify: false },
    { ndc: "00169-6339-10", name: "NovoLog FlexPen U-100 (aspart)", form: "pen", concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },
    { ndc: "00169-7501-11", name: "NovoLog vial U-100 (aspart)", form: "vial", concentration: 100, unitsPerUnit: 1000, pensPerBox: 1, unitsPerPackage: 1000, packageVolumeMl: 10, dispenseUnit: "vial (10 mL)", primingUnitsPerPrime: 0, verify: false },
    { ndc: "00024-5915-05", name: "Admelog SoloStar U-100 (lispro)", form: "pen", concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },
    { ndc: "00169-3204-15", name: "Fiasp FlexTouch U-100 (aspart)", form: "pen", concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },
    { ndc: "00002-3225-59", name: "Lyumjev KwikPen U-100 (lispro-aabc)", form: "pen", concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },

    // ---- Premixed ----
    { ndc: "00002-8798-59", name: "Humalog Mix 75/25 KwikPen", form: "pen", concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },
    { ndc: "00169-3685-19", name: "NovoLog Mix 70/30 FlexPen", form: "pen", concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500, packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2, verify: false },

    // ---- Human insulin (OTC / ReliOn) ----
    { ndc: "00002-8501-01", name: "Humulin R U-100 vial", form: "vial", concentration: 100, unitsPerUnit: 1000, pensPerBox: 1, unitsPerPackage: 1000, packageVolumeMl: 10, dispenseUnit: "vial (10 mL)", primingUnitsPerPrime: 0, verify: false },
    { ndc: "00002-8315-01", name: "Humulin N U-100 vial", form: "vial", concentration: 100, unitsPerUnit: 1000, pensPerBox: 1, unitsPerPackage: 1000, packageVolumeMl: 10, dispenseUnit: "vial (10 mL)", primingUnitsPerPrime: 0, verify: false },
    { ndc: "00002-8717-01", name: "Humulin 70/30 U-100 vial", form: "vial", concentration: 100, unitsPerUnit: 1000, pensPerBox: 1, unitsPerPackage: 1000, packageVolumeMl: 10, dispenseUnit: "vial (10 mL)", primingUnitsPerPrime: 0, verify: false },
    { ndc: "00169-1833-11", name: "Novolin R U-100 vial (ReliOn)", form: "vial", concentration: 100, unitsPerUnit: 1000, pensPerBox: 1, unitsPerPackage: 1000, packageVolumeMl: 10, dispenseUnit: "vial (10 mL)", primingUnitsPerPrime: 0, verify: false },
    { ndc: "00169-1834-11", name: "Novolin N U-100 vial (ReliOn)", form: "vial", concentration: 100, unitsPerUnit: 1000, pensPerBox: 1, unitsPerPackage: 1000, packageVolumeMl: 10, dispenseUnit: "vial (10 mL)", primingUnitsPerPrime: 0, verify: false },
    { ndc: "00169-1837-11", name: "Novolin 70/30 U-100 vial (ReliOn)", form: "vial", concentration: 100, unitsPerUnit: 1000, pensPerBox: 1, unitsPerPackage: 1000, packageVolumeMl: 10, dispenseUnit: "vial (10 mL)", primingUnitsPerPrime: 0, verify: false },

    // ---- Concentrated U-500 ----
    { ndc: "00002-8501-27", name: "Humulin R U-500 vial", form: "vial", concentration: 500, unitsPerUnit: 10000, pensPerBox: 1, unitsPerPackage: 10000, packageVolumeMl: 20, dispenseUnit: "vial (20 mL)", primingUnitsPerPrime: 0, verify: false },
    { ndc: "00002-1500-15", name: "Humulin R U-500 KwikPen", form: "pen", concentration: 500, unitsPerUnit: 1500, pensPerBox: 2, unitsPerPackage: 3000, packageVolumeMl: 6, dispenseUnit: "box (2 pens)", primingUnitsPerPrime: 7, verify: false },
  ],

  /* ---------------------------------------------------------------------------
   * INHALERS  (dosesPerDevice = total metered actuations)
   * Includes RESCUE and MAINTENANCE inhalers. Counts vary widely.
   * ------------------------------------------------------------------------- */
  inhaler: [
    // ---- Rescue / short-acting (SABA / SAMA) ----
    { ndc: "00173-0682-20", name: "Ventolin HFA (albuterol) 18 g", category: "rescue", packageDesc: "18 g", dosesPerDevice: 200, verify: false },
    { ndc: "00085-1132-01", name: "Proventil HFA (albuterol) 6.7 g", category: "rescue", packageDesc: "6.7 g", dosesPerDevice: 200, verify: false },
    { ndc: "59310-0579-22", name: "ProAir HFA (albuterol) 8.5 g", category: "rescue", packageDesc: "8.5 g", dosesPerDevice: 200, verify: false },
    { ndc: "59310-0117-90", name: "ProAir RespiClick (albuterol)", category: "rescue", packageDesc: "DPI · 200", dosesPerDevice: 200, verify: false },
    { ndc: "00054-0319-99", name: "Albuterol HFA generic 18 g", category: "rescue", packageDesc: "18 g", dosesPerDevice: 200, verify: false },
    { ndc: "00591-3797-79", name: "Xopenex HFA (levalbuterol) 15 g", category: "rescue", packageDesc: "15 g · 200", dosesPerDevice: 200, verify: false },
    { ndc: "00597-0085-17", name: "Atrovent HFA (ipratropium) 12.9 g", category: "rescue", packageDesc: "12.9 g · 200", dosesPerDevice: 200, verify: false },
    { ndc: "00597-0090-61", name: "Combivent Respimat (ipratropium/albuterol)", category: "rescue", packageDesc: "Respimat · 120 (sample 60)", dosesPerDevice: 120, verify: false },

    // ---- Maintenance: ICS ----
    { ndc: "00173-0719-20", name: "Flovent HFA (fluticasone) 44/110/220 mcg", category: "maintenance", packageDesc: "120 act", dosesPerDevice: 120, verify: false },
    { ndc: "00173-0601-00", name: "Flovent Diskus (fluticasone)", category: "maintenance", packageDesc: "60 blisters", dosesPerDevice: 60, verify: false },
    { ndc: "00456-0734-99", name: "QVAR RediHaler (beclomethasone) 40/80 mcg", category: "maintenance", packageDesc: "120 act", dosesPerDevice: 120, verify: false },
    { ndc: "00781-7176-20", name: "Pulmicort Flexhaler (budesonide) 180 mcg", category: "maintenance", packageDesc: "120 act (90 mcg = 60)", dosesPerDevice: 120, verify: false },
    { ndc: "00310-0610-39", name: "Arnuity Ellipta (fluticasone furoate)", category: "maintenance", packageDesc: "Ellipta · 30 (inst. 14)", dosesPerDevice: 30, verify: false },

    // ---- Maintenance: ICS/LABA combos ----
    { ndc: "00186-0372-20", name: "Symbicort (budesonide/formoterol) 160/4.5", category: "maintenance", packageDesc: "10.2 g", dosesPerDevice: 120, verify: false },
    { ndc: "00173-0696-00", name: "Advair Diskus (fluticasone/salmeterol) 100/250/500", category: "maintenance", packageDesc: "DPI", dosesPerDevice: 60, verify: false },
    { ndc: "00173-0795-00", name: "Advair HFA (fluticasone/salmeterol)", category: "maintenance", packageDesc: "12 g", dosesPerDevice: 120, verify: false },
    { ndc: "00310-0730-30", name: "Breo Ellipta (fluticasone/vilanterol) 100/25 or 200/25", category: "maintenance", packageDesc: "Ellipta", dosesPerDevice: 30, verify: false },
    { ndc: "00085-4341-01", name: "Dulera (mometasone/formoterol)", category: "maintenance", packageDesc: "120 act (also 60)", dosesPerDevice: 120, verify: false },

    // ---- Maintenance: LAMA / LAMA-LABA ----
    { ndc: "00597-0075-41", name: "Spiriva HandiHaler (tiotropium) capsules", category: "maintenance", packageDesc: "30 caps (1 cap/day)", dosesPerDevice: 30, verify: false },
    { ndc: "00597-0192-30", name: "Spiriva Respimat (tiotropium)", category: "maintenance", packageDesc: "Respimat · 60 puffs (2/day = 30 days)", dosesPerDevice: 60, verify: false },
    { ndc: "00310-0830-30", name: "Anoro Ellipta (umeclidinium/vilanterol)", category: "maintenance", packageDesc: "Ellipta · 30 (inst. 7)", dosesPerDevice: 30, verify: false },
    { ndc: "00597-0152-30", name: "Stiolto Respimat (tiotropium/olodaterol)", category: "maintenance", packageDesc: "Respimat · 60 (inst. 10)", dosesPerDevice: 60, verify: false },
    { ndc: "00310-0840-30", name: "Trelegy Ellipta (flut/umec/vilanterol)", category: "maintenance", packageDesc: "Ellipta · 30 doses", dosesPerDevice: 30, verify: false },
    { ndc: "00310-1850-30", name: "Trelegy Ellipta (14-dose starter)", category: "maintenance", packageDesc: "Ellipta · sample", dosesPerDevice: 14, verify: true },
    { ndc: "00310-6900-30", name: "Bevespi Aerosphere (glyco/formoterol)", category: "maintenance", packageDesc: "120 act", dosesPerDevice: 120, verify: false },
  ],

  /* ---------------------------------------------------------------------------
   * NASAL SPRAYS  (dosesPerDevice = sprays per bottle)
   * ------------------------------------------------------------------------- */
  nasal: [
    { ndc: "00054-3270-99", name: "Fluticasone propionate (Flonase) 50 mcg — Rx 120 (OTC 72)", dosesPerDevice: 120, verify: false },
    { ndc: "00078-0418-79", name: "Mometasone (Nasonex) 50 mcg", dosesPerDevice: 120, verify: false },
    { ndc: "00186-1070-08", name: "Budesonide (Rhinocort) 32 mcg", dosesPerDevice: 120, verify: false },
    { ndc: "00067-8127-01", name: "Triamcinolone (Nasacort) 55 mcg", dosesPerDevice: 120, verify: false },
    { ndc: "00173-0878-00", name: "Fluticasone furoate (Flonase Sensimist) 27.5 mcg", dosesPerDevice: 120, verify: false },
    { ndc: "00054-0184-44", name: "Azelastine (Astepro/Astelin) adult 200 (child 60)", dosesPerDevice: 200, verify: false },
    { ndc: "00065-0048-30", name: "Olopatadine (Patanase) 0.6%", dosesPerDevice: 240, verify: false },
    { ndc: "00078-0697-50", name: "Azelastine/fluticasone (Dymista)", dosesPerDevice: 120, verify: false },
    { ndc: "00574-7172-30", name: "Ipratropium nasal 0.03% (30 mL)", dosesPerDevice: 345, verify: false },
    { ndc: "00574-7173-15", name: "Ipratropium nasal 0.06% (15 mL)", dosesPerDevice: 165, verify: false },
    { ndc: "00078-0890-50", name: "Cromolyn sodium (NasalCrom) 26 mL", dosesPerDevice: 200, verify: false },
  ],

  /* ---------------------------------------------------------------------------
   * OPHTHALMIC DROPS
   * Default drops/mL = 20. products[] lists vehicles that commonly differ
   * (suspensions, gels, oils give larger/fewer drops). VERIFY against the
   * insert — drops/mL is technique-dependent and varies by source.
   * ------------------------------------------------------------------------- */
  ophthalmic: {
    defaultDropsPerMl: 20,
    products: [
      { name: "Suspension (e.g., prednisolone acetate, brimonidine, Durezol)", dropsPerMl: 15, note: "Suspensions form larger drops", verify: true },
      { name: "Gel-forming / viscous (e.g., timolol GFS, Timoptic-XE)", dropsPerMl: 15, note: "Viscous vehicle", verify: true },
      { name: "Prostaglandin analog (e.g., latanoprost, travoprost)", dropsPerMl: 20, note: "Confirm bottle fill vs. insert", verify: true },
      { name: "Standard aqueous solution", dropsPerMl: 20, note: "Common assumption", verify: true },
    ],
  },

  /* ---------------------------------------------------------------------------
   * TOPICAL FINGERTIP UNITS (FTU)  — 1 FTU ≈ 0.5 g (adult, 5 mm nozzle)
   * Values = FTU needed to cover one application of a body region, by patient
   * age band (Long & Finlay). Pediatric data groups arm+hand and leg+foot.
   * ------------------------------------------------------------------------- */
  topicalFTU: {
    gramsPerFtu: 0.5,
    ageBands: [
      { id: "3-6mo", label: "3–6 months" },
      { id: "1-2y", label: "1–2 years" },
      { id: "3-5y", label: "3–5 years" },
      { id: "6-10y", label: "6–10 years" },
      { id: "adult", label: "Adult / >10 years" },
    ],
    // region -> FTU per application, indexed by age band id
    regions: [
      { id: "faceNeck",     label: "Face & neck",            ftu: { "3-6mo": 1,   "1-2y": 1.5, "3-5y": 1.5, "6-10y": 2,   "adult": 2.5 } },
      { id: "armHand",      label: "One arm & hand",         ftu: { "3-6mo": 1,   "1-2y": 1.5, "3-5y": 2,   "6-10y": 2.5, "adult": 4   } },
      { id: "legFoot",      label: "One leg & foot",         ftu: { "3-6mo": 1.5, "1-2y": 2,   "3-5y": 3,   "6-10y": 4.5, "adult": 8   } },
      { id: "trunkFront",   label: "Trunk (front / chest+abdomen)", ftu: { "3-6mo": 1, "1-2y": 2, "3-5y": 3, "6-10y": 3.5, "adult": 7 } },
      { id: "backButtocks", label: "Back & buttocks",        ftu: { "3-6mo": 1.5, "1-2y": 3,   "3-5y": 3.5, "6-10y": 5,   "adult": 7   } },
      { id: "hand",         label: "One hand only (adult)",  ftu: { "adult": 1   } },
      { id: "genitalia",    label: "Genitalia / groin (adult)", ftu: { "adult": 1 } },
    ],
  },
};
