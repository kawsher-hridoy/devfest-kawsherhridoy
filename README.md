# TenderReady / টেন্ডাররেডি

A private, bilingual tender document package builder for AI DevFest 2026.

**Participant:** Kawsher Hridoy
**Accepted registration identifier:** `kawsherhridoy`
**Repository:** https://github.com/kawsher-hridoy/devfest-kawsherhridoy
**Live HTTPS URL:** Pending participant's manual Vercel deployment. No live PASS is claimed.

## Run and build

Requires Node 20.16+ (verified locally with Node 20.20.2).

```sh
cd app
npm ci
npm run dev       # http://localhost:5173
npm test         # domain regression tests
npm run build    # TypeScript + static Vite production output
npm run preview  # http://localhost:4173
```

## Manual Vercel deployment

Import the public repository, branch `main`:

- Framework: **Vite**
- Root directory: **app**
- Build command: **npm run build**
- Output directory: **dist**
- No environment variables, Functions, backend, database, or custom domain required.
- Disable deployment protection for the public production site if Vercel enables it.
- Confirm the displayed source commit matches the pushed release SHA.
- Complete deployment and submission before the applicable organizer deadline; provisional final freeze is **19:05 on 6 October 2026, Asia/Dhaka**. No changes after submission.

## Workflow

1. Load `requirements.json` or the supplied fictional sample.
2. Upload PDFs. Review filename suggestions and accept matches individually, or match manually.
3. Enter expiry dates explicitly; filenames never determine dates.
4. Resolve Missing, Expiry date needed, and Expired items. Deadline equality is valid; optional supplied documents can block.
5. Download the ordered PDF, optionally with a bilingual index and PNG stamp, or export the checklist CSV.

**Main features M1–M9:** requirements validation and numeric order; multi-PDF ingestion/removal and limits; reversible one-to-one matches; expiry entry; five deterministic statuses; SHA-256 duplicate detection; blocker explanations; English cover/all source pages/non-overlapping footers/exact filename; responsive Bangla/English interface.

**Bonuses B1–B8:** paginated index with calculated starts; PNG stamp with selected pages/ranges and placement controls/package preview; safe UTF-8 CSV; IndexedDB save/reopen with original bytes; shaped Bangla index; reviewable filename suggestions; damaged/encrypted PDF errors; consented optional runtime-key Gemini help.

## Verified evidence

- Nine domain test groups pass: status branches, strict dates/imports, assignments and duplicate groups, count/decimal-byte boundaries, sample and multi-index offsets, CSV escaping, stamp ranges, restored-state validation, and prototype-like requirement IDs.
- Actual Chrome sample workflow: **8 OK, 2 Not provided, no blockers**.
- Final production build completed in **3.67 seconds** with bundled matching PDF.js worker. Rollup tree-shaking is disabled to avoid pathological build analysis; direct Lucide icon imports limit unnecessary icon code.
- Production-preview sample generation, save/reload/reopen: 10 uploaded PDFs restored.
- Actual downloaded `output/T-2026-0417_Package.pdf`: **17 pages**, correct indexed starts 3,4,5,6,7,9,15,17. Cover, Bangla index and scanned final page visually checked.
- Both languages at 1440/768/390px: no horizontal overflow. Screenshots are in `screenshots/`.
- Old-license Expired status blocks; deadline equality is OK; identical sibling assignment is disabled; damaged/password-protected PDFs are rejected individually; invalid JSON preserves current work.
- Portrait, 90/180/270-degree rotations, non-zero CropBox, blank page and visible annotation sample derivatives generated and visually checked. A discovered blank-page embedding defect was fixed.
- Stamp on pages 3 and 17 generated successfully; page 3 visually checked. Changing matches clears stale target pages.
- Mocked AI authentication failure leaves statuses unchanged; saved workspace contains no test API key. **Real-provider success has not been verified.**

Detailed timestamped evidence and remaining release gates: `AGENT.md`.

## Sample retest

Match R01 to `trade_license_2026.pdf`, expiry **2027-06-30**; R04 to `bank_solvency.pdf`, expiry **2026-12-31**. Match R02 TIN, R03 VAT, R05 one experience certificate, R08 technical proposal, R09 financial proposal, R10 `scan_0042.pdf`. Leave optional R06/R07 unmatched. Reject the PNG in the document uploader. Include only one identical experience copy.

Expect 15 source pages, 17 with cover/index, 16 without index. No filename or requirement-ID special cases are used in application status or generation rules.

## Privacy and limitations

All PDF processing and persistent workspaces remain on this browser/device. No document bytes, names, tender details or personal data go to AI. Optional Gemini sends only explicitly consented anonymous counts and language; keys are held in React memory only, not saved/logged. Offline/local main functionality does not need Gemini.

- Public Vercel access, deployed revision matching, portal submission and truly independent review remain **not verified** (reviewer attempt hit provider rate limit) until performed by the participant/reviewer.
- No real API key supplied, so live Gemini success is **not verified**.
- Not a PDF-signature verification system; composition does not retain cryptographic signature validity. Visible annotations/forms are rendered when needed; source content remains in display order.
- Bangla PDF text is rendered as shaped images and is not selectable/searchable. Screen-reader PDF tagging is not implemented.
- Local storage is browser-specific. Clearing site storage deletes saved work. Save is explicit, not automatic.
- Large bundled PDF libraries produce a build-size warning, not a build failure.
- Use only organizer fictional samples; never real/private company data in contest testing.

## Architecture and ownership

React + TypeScript + Vite, PDF-LIB 1.17.1, PDF.js 5.4.624 and matching bundled worker, local Noto Sans Bengali, Lucide, ordinary CSS, Web Crypto and IndexedDB. Pure business rules are in `app/src/domain.ts`; ingestion/render/composition in `pdf.ts`; translations in `i18n.ts`; local storage in `storage.ts`; opt-in help in `ai.ts`.

Original organizer files are preserved. All project source was freshly created during this active implementation.

**AI tools:** Codex via Airouter, DeepSeek V4 Flash.
**Useful prompt:** “Read AGENT.md and plan.md completely; implement M1–M9 mandatory first, then B1–B8; verify 8 OK, 2 Not provided and the actual 17-page browser-generated sample; preserve organizer files and never claim PASS without evidence.”

MIT license for application code. See `THIRD_PARTY_NOTICES.md` for dependency/font licenses. Organizer samples retain their supplied contest-use notice.
