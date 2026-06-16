# Pharmacy Day-Supply Calculator

A standalone, **offline** calculator for retail day-supply math: insulin, warfarin
(variable dose by weekday), topicals (fingertip units), eye drops, inhalers, nasal
sprays, and a generic fallback. Each result includes a **short, copy-paste reference
line** for the Rx image note.

> ⚠️ **Estimates only.** The pharmacist is responsible for verifying every result and
> all product data against the current package insert before clinical or billing use.
> Seed entries are marked `verify` until confirmed.

## How to open

Just double-click **`index.html`** (or drag it into Chrome/Firefox). No server, no
internet, nothing to install. It works the same on a counter PC or tablet.

## Install on iPhone (counter app)

Hosted as a PWA at **https://tclark41.github.io/daysupply-calculator/**

1. Open that URL in **Safari** on the iPhone.
2. Tap the **Share** button → **Add to Home Screen** → **Add**.
3. Launch it from the new **DaySupply** icon — it opens full-screen like an app.

After the first load it is cached by a service worker, so it keeps working
**offline** (e.g. Airplane mode) at the counter. When the product data changes,
bump `CACHE` in `sw.js` (e.g. `daysupply-v1` → `-v2`) so phones pick up the update
on their next online load.

```
~/experiments/daysupply_calculator/
├── index.html    # the app (UI + DOM wiring)
├── calc.js       # pure day-supply math (shared by the app and the tests)
├── products.js   # editable product reference data — EDIT THIS to add products
├── test.js       # Node acceptance tests (node test.js)
└── README.md
```

## How it works

Pick a tab, fill in the fields, and the day supply updates live. Two behaviors apply
everywhere:

- **PRN / as-needed toggle** — when checked, the day supply rounds **up** (ceil) for
  any non-whole result. Otherwise it rounds **down** (floor). The exact value is always
  shown too.
- **Packaging is never split** — insulin pen *boxes*, inhalers, and bottles always
  round **up** in the "to reach N days, dispense…" reverse line, because you can't
  dispense a partial package.

### Formulas

| Calculator | Day supply |
|---|---|
| **Insulin** | `total units ÷ (units/day + priming/inj × injections/day)` |
| **Warfarin** | `qty × 7 ÷ Σ(daily mg ÷ tablet strength)` (weekly tablet count) |
| **Topical (grams)** | `total g ÷ (g/application × applications/day)` |
| **Topical (FTU)** | `g/app = Σ region FTU × 0.5 g`, then as above |
| **Eye drops** | `(mL × drops/mL) ÷ (drops/dose × doses/day × eyes)` |
| **Inhaler / Nasal** | `(devices × doses/device) ÷ (per dose × doses/day)` |
| **Other** | `total qty ÷ (per dose × doses/day)` |

### Clinical assumptions (all editable in the UI)

- **Insulin priming** — auto-filled per product (most pens ≈ 2 u/injection, vials 0).
  The tool multiplies priming by *injections per day*. Override either field as needed.
- **Eye drops** — default **20 drops/mL**; selecting a listed product (e.g. a
  suspension or gel) sets a different value. Always editable.
- **Topical FTU** — 1 FTU ≈ 0.5 g (adult). Per-region FTU values come from the
  Long & Finlay table and change with the patient **age band**. These are estimates.

## Editing / adding products

All product data lives in **`products.js`** as plain JavaScript arrays. To add or
correct a product, edit the relevant array and save — then refresh the page. Example
(insulin):

```js
{ ndc: "00000-0000-00", name: "New Insulin Pen (U-100)", form: "pen",
  concentration: 100, unitsPerUnit: 300, pensPerBox: 5, unitsPerPackage: 1500,
  packageVolumeMl: 15, dispenseUnit: "box (5 pens)", primingUnitsPerPrime: 2,
  verify: true },
```

Set `verify: false` once you've confirmed an entry against the package insert. The
`verify` badge in the UI is a reminder that the seed value is unconfirmed. NDC codes,
package sizes, doses-per-device, priming, and drops/mL **must** be verified before use.

The data is a `<script src>` (not a CSV) on purpose: a double-clicked `file://` page
can load a sibling `.js` file offline, but the browser blocks `fetch()` of a local
`.csv`. Keeping it as JS preserves the no-server, works-offline design.

## Tests

```
node test.js
```

Runs the same `calc.js` the browser uses against hand-computed acceptance cases
(insulin ± priming, warfarin weekly tablets, topical FTU, eye drops OU, inhaler +
reverse, PRN round-up, and input guards). Expected: `18 passed, 0 failed`.

## License

[MIT](LICENSE) © 2026 Thomas Clarkin. The "AS IS, no warranty" terms cover the
software; they do not replace the clinical disclaimer above — the pharmacist
remains responsible for verifying every result.
