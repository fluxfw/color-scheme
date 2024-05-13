# Changelog

## latest

Changes:

\-

## v2024-05-13-1

Changes:

- Replace static passed color schemes/variables with adder
- Add missed functionality for own select ui (Getter and setter)
- Multiple default color schemes can be set
  - If system, this is used as default selected color scheme and an other non-system is used as fallback
  - If non-system only, this is used for both as default selected color scheme and as fallback
  - Remove default set to system
- Label can be static (String or object)
- Only render after add color scheme (Need to add system color scheme as last)
- Improved get color scheme
- Sort color schemes by label
- Optional Localization/SettingsStorage
- Remove default color schemes
- Remove select ui

## v2024-05-09-1

Changes:

- Fix generated `color-scheme` position

## v2024-05-08-2

Changes:

- Fix move

## v2024-05-08-1

Changes:

- Deflux
- Rename `accent-color-foreground-color` to `accent-foreground-color`
- Split `color-scheme` variables to `color-schemes` and `render-color-scheme`, use `color-scheme` for self

## v2024-05-03-2

Changes:

- Remove init change event

## v2024-05-03-1

Changes:

- `change` event

## v2024-04-26-1

Changes:

- Use `Object.freeze` direct without `map`

## v2024-04-15-1

Changes:

- Remove direct used bundled localizations
- Rename `getLabel` to `label`

## v2024-04-03-1

Changes:

- Add `!` to error logs

## v2024-01-15-1

Changes:

- Load css using import attributes

## v2023-12-12-2

Changes:

- Fix

## v2023-12-12-1

Changes:

- Fix

## v2023-12-04-1

Changes:

- Fix minfiy

## v2023-11-02-1

Changes:

- Fix

## v2023-09-25-2

Changes:

- Fix

## v2023-09-25-1

Changes:

- Make selection works in shadows

## v2023-09-11-1

Changes:

- Fix Firefox based browsers crash with open dev console

## v2023-08-07-1

Changes:

- `flux-localization-api`

## v2023-07-31-1

Changes:

- Style sheet manager

## v2023-07-27-1

Changes:

- Style sheet manager

## v2023-07-21-1

Changes:

- General localizations

## v2023-07-18-1

Changes:

- `init_system_color_scheme_detectors`

## v2023-07-17-1

Changes:

- General `SettingsStorage` and `Localization`

## v2023-07-10-1

Changes:

- Multiple usage

## v2023-06-30-2

Changes:

- Fix

## v2023-06-30-1

Changes:

- Any system color schemes
- Set color scheme per system color scheme
- Show color scheme's accent color

## v2023-06-05-1

Changes:

- Fix Chromium based browsers crash (SIGSEGV)

## v2023-06-02-1

Changes:

- Set variables to `CSSStyleRule`

## v2023-05-30-1

Changes:

- Natvie `adoptedStyleSheets`

## v2023-04-24-1

Changes:

- Optional `flux-localization-api`

## v2023-03-27-1

Changes:

- cursor

## v2023-03-23-1

Changes:

- Css variables

## v2023-03-22-1

Changes:

- `flux-css-api`

## v2023-03-21-2

Changes:

- `flux-css-api`

## v2023-03-21-1

Changes:

- Fix

## v2023-03-20-2

Changes:

- Fix

## v2023-03-20-1

Changes:

- Simplify

## v2023-03-17-1

Changes:

- Simplify
- Renamed to `flux-color-scheme`

## v2023-02-09-1

Changes:

- build / publish

## v2022-12-20-1

Changes:

- fallback languages

## v2022-12-08-1

Changes:

- `metadata.json`

## v2022-12-05-1

Changes:

- button

## v2022-11-21-1

Changes:

- `Array.from`

## v2022-11-11-1

Changes:

- Fix

## v2022-11-09-1

Changes:

- New `flux-localization-api`

## v2022-11-03-1

Changes:

- init

## v2022-11-02-3

Changes:

- Selection css

## v2022-11-02-2

Changes:

- Fix css

## v2022-11-02-1

Changes:

- Rgb colors

## v2022-10-28-1

Changes:

- init

## v2022-10-17-1

Changes:

- Dynamic imports

## v2022-10-13-1

Changes:

- Accent color
- Specific get variable function

## v2022-10-12-1

Changes:

- Fix

## v2022-10-11-1

Changes:

- First release
