# DentalMind 3D Learn

Interactive app for learning the anatomy of the 32 permanent teeth (FDI notation) in
**Italian, German, English and Albanian** (IT / DE / EN / SQ): 3D tooth models, adaptive quiz,
Socratic tutor, comparison of two teeth, four-language dental vocabulary and progress tracking.

Originally built with Lovable (TanStack Start, React, Tailwind, three.js), now maintained here.

## Development

```sh
npm install
npm run dev     # local dev server
npm test        # anatomy, translation-completeness and quiz tests (vitest)
npm run build
```

## Deploy (Vercel)

`vercel.json` and `vite.config.ts` are set up for Vercel: when `VERCEL` is set during the build,
Nitro emits the Vercel Build Output (`.vercel/output`). Import the repository in Vercel with the
default settings; no environment variables are required.

## Content

- `src/lib/teeth.ts` — anatomy of every tooth (crown, roots, canals, cusps, eruption, landmarks), in 4 languages
- `src/lib/anatomyFacts.ts` — taught root/cusp counts and Class I antagonists (single source for quiz answers)
- `src/lib/lessons.ts` — lessons, tell-apart cues, trick questions
- `src/lib/vocabulary.ts` — IT/DE/EN/SQ glossary
- `src/lib/i18n.*.ts` — interface strings (`i18n.en.ts`, `i18n.sq.ts`; IT/DE in `i18n.base.ts` + `i18n.v2.ts` + `i18n.dict.ts`)

Reference: Wheeler's Dental Anatomy, Physiology and Occlusion. The app distinguishes typical
anatomy from documented variants; 3D models are schematic and not for clinical use.
The English and Albanian translations are new and should be reviewed by native-speaking dentists.
