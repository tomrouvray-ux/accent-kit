# Accent Kit

An installable web app for learning and practising accents, live at https://tomrouvray-ux.github.io/accent-kit/

This repository is the master copy. Phone and laptop both use the link above. The older copies (the claude.ai artifact and the "Accent Kit offline.html" file in Drive) are no longer updated.

## Using it

- Open the link, then install it: Add to Home Screen on a phone, or the install icon at the right of the address bar in Chrome or Edge on a laptop.
- Click Add recordings and pick the IDEA mp3s (select them all at once). They are stored in that browser on that device only, so each device needs them added once.
- After that it works with no internet. Any update pushed here shows the next time the app is opened online. The version line at the bottom of the page shows which version you have.

The recordings are never stored in this repository. IDEA's terms allow personal use only, so keep it that way.

## Files

- `index.html`: the whole app (layout, styles, accent data and code in one file).
- `sw.js`: the service worker that keeps the app on the device for offline use.
- `manifest.webmanifest` and `icon-*.png`: what makes it installable.

GitHub Pages serves the `main` branch from the root. A push to `main` goes live within a minute or two.

## Where the accent data lives

All in `index.html`, inside the `<script>`:

- `const ACCENTS = [...]`: one object per kit, in the order shown in the app. Fields:
  - `id`, `name`, `short` (tab label), `group` (England, Wales, Scotland, Northern Ireland, United States...), `where`, `tags`, `intro`
  - `samples`: the Listen tab. Each entry is `[IDEA slug, label, "M" or "F", age, who/where]`, for example `["england-16","IDEA England 16","M","40s","Liverpool"]`. The slug is the IDEA page path (https://www.dialectsarchive.com/england-16). The Male/Female filter reads the third field.
  - `hesitation`, `setting` (lips, jaw, tongue, palate...), `zone` (`key`/`second` are mouth zones, plus `text`), `tone` (`text`, `tune` points, label)
  - `cons`: consonant cards, `{k, ipa, d, ref}`. `ref` keys point into `REF`.
  - `vowels`: `[lexical set, description]` pairs.
  - `ways`: image, phrase, Laban effort and the rest of the Ways in tab.
- `const REF = {...}`: reference sound links (Wikipedia IPA pages, Seeing Speech) used by `ref`.
- `const MP3 = {...}`: IDEA slug to mp3 path under https://www.dialectsarchive.com/wp-content/uploads/. The app uses the file name at the end (for example `england16.mp3`) to match a recording the user adds. If a slug is missing here, the app expects `<slug without dashes>.mp3`.

My notes are kept in the browser's local storage, not in the file.

## Adding an accent or a speaker

1. Add or edit the object in `ACCENTS`, copying the shape of an existing kit. Write in British English, plain and practical, no em dashes.
2. For each new speaker, add the sample entry and an `MP3` entry with the real path of the mp3 on IDEA (open the speaker's IDEA page and take the mp3 link from the audio player).
3. Download the new mp3s and give them to Tom privately (never commit them). He adds them with Add recordings on each device.
4. Change the version line (`<p id="version">`) to today's date.
5. Open the page locally and check the new kit on every tab, then push to `main`.

You don't need to touch `sw.js` for normal updates. Only change `CACHE` in it if saved copies on devices must be thrown away.
