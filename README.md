# TenderReady / টেন্ডাররেডি

**A private, bilingual tender document package builder.**

TenderReady helps office staff turn a tender checklist and separate PDFs into one checked, correctly ordered submission package. The application runs entirely in the browser, without an application backend or cloud database.

## Participant and live demo

- **Participant:** Kawsher Hridoy
- **Participant-confirmed repository/registration identifier:** `kawsherhridoy`
- **Live demo:** https://tenderready.hridoy.xyz/
- **Backup demo:** https://tenderready-one.vercel.app/
- **Public repository:** https://github.com/kawsher-hridoy/devfest-kawsherhridoy

Use the exact organizer-issued registration number in the submission portal; the repository identifier above is not a guessed numeric registration number.

## How to use

1. Click **Import requirements** and select one `requirements.json` file. This button does not accept PDFs.
2. When the checklist appears, click **Upload PDFs**. Select multiple PDFs using Ctrl+click or Shift+click.
3. Match each file to its requirement, manually or by reviewing and accepting filename suggestions.
4. Enter expiry dates where requested. Dates are checked against the tender submission deadline; equality is valid.
5. Resolve blocking statuses, then click **Generate & download PDF**.

Alternatively, **Load supplied sample** loads the organizer's fictional files for demonstration. It does not automatically choose matches or infer expiry dates.

## Features

### Mandatory requirements — M1–M9

- Validated requirements import, tender details, and numeric document ordering.
- Multiple PDF uploads, page counts, removal, and limits of 30 files / 50,000,000 bytes.
- Editable, reversible, one-file-to-one-requirement matching.
- Expiry entry and immediate calculation of the five statuses: Missing, Expiry date needed, Expired, Not provided, and OK.
- SHA-256 duplicate detection and prevention of identical-content reuse across requirements.
- Disabled generation with visible reasons when required documents are missing or supplied documents are invalid/expired, including supplied optional documents.
- English cover, all included source pages in order, separate readable footer bands, and `<tender_id>_Package.pdf` download.
- Responsive Bangla/English interface, labeled controls, and keyboard focus indicators.

### Bonus features — B1–B8

- Paginated bilingual index with calculated document starting pages.
- PNG stamp/signature on selected pages or ranges, with size/position controls and package preview.
- UTF-8 CSV checklist export with quoting and spreadsheet-formula protection.
- Explicit local save/reopen through browser IndexedDB, including original PDF bytes and project state.
- Correctly shaped Bangla index text.
- Reviewable filename-based match suggestions; dates are never inferred.
- Clear individual errors for damaged, unsupported, and password-protected PDFs.
- Optional, consented Gemini guidance using a memory-only user-entered API key. Real-provider success remains unverified.

## Run locally

Node 20.16+ is required; development was verified with Node 20.20.2.

```sh
cd app
npm ci
npm run dev       # http://localhost:5173
npm test         # regression tests
npm run build    # static production build
npm run preview  # http://localhost:4173
```

### Static Vercel deployment

Use framework **Vite**, root directory **app**, build command **npm run build**, and output directory **dist**. No environment variables, server functions, database, or SSR are required. The participant deployed the site manually.

## Verification and sample retest

- **Local evidence:** nine automated domain test groups passed; the recorded production build passed in 3.67 seconds. Logs are in `evidence/`.
- **Live evidence, 6 October 2026:** both public HTTPS URLs opened without login. Deployed JavaScript/CSS matched the verified application build. The live custom-domain test completed requirements import, multi-PDF upload, matching, expiry checks, duplicate prevention, PDF download, save/reload/reopen, and Bangla mobile layout without uncaught application errors.
- **Expected sample result:** 8 OK, 2 Not provided, no blockers; 15 source pages, 17 pages with cover/index, or 16 without index.
- **Required artifact:** `output/T-2026-0417_Package.pdf`. Status and responsive screenshots are in `screenshots/`.

For the supplied sample, match:

| Requirement | File | Expiry | Indexed start |
|---|---|---|---|
| R01 | `trade_license_2026.pdf` | 2027-06-30 | 3 |
| R02 | `03_tin_certificate.pdf` | — | 4 |
| R03 | `04_vat_certificate.pdf` | — | 5 |
| R04 | `bank_solvency.pdf` | 2026-12-31 | 6 |
| R05 | `experience_cert.pdf` | — | 7 |
| R08 | `02_technical_proposal.pdf` | — | 9 |
| R09 | `01_financial_proposal.pdf` | — | 15 |
| R10 | `scan_0042.pdf` | — | 17 |

Leave optional R06/R07 unmatched. Do not include the old license or a second identical experience certificate. `company_logo.png` is rejected by the PDF uploader but may be used in the separate PNG stamp control. Sample mappings are test instructions, not hardcoded application rules.

## Privacy and limitations

- Organizer sample files are static website assets in `app/public/sample/`, not database records. User PDFs are read and processed locally, not uploaded to Vercel.
- Saved work stays in this browser's IndexedDB. Clearing site data deletes it; saves are explicit and browser-specific.
- Optional AI sends only consented anonymous status counts and language, never document bytes, filenames, tender details, or personal data. Keys are not persisted or logged. Core functionality works without AI.
- Real Gemini-provider success and a full independent review remain unverified; the attempted independent reviewer hit a provider rate limit.
- PDF composition does not preserve cryptographic signature validity. Visible annotations/forms are rendered where needed.
- Bangla PDF text uses shaped images, so it is not searchable/selectable. Accessible PDF tagging is not implemented.
- Large PDF-library bundles produce a build-size warning, not a build failure.
- Submission acceptance and organizer deadline eligibility are not asserted by this README. Stop repository and deployment changes after submission or the applicable organizer deadline.

## Technology and license

React, TypeScript, Vite, PDF-LIB 1.17.1, PDF.js 5.4.624 with its matching bundled worker, local Noto Sans Bengali, Lucide, plain CSS, Web Crypto, and IndexedDB. Original organizer files were preserved.

**AI assistance:** Codex.

**Prompt summary:** Build a bilingual, browser-only tender package builder with document validation and ordered PDF export.

Application code is licensed under MIT; see `LICENSE`. Dependency/font licenses are in `THIRD_PARTY_NOTICES.md`. Organizer fictional sample files retain their supplied contest-use notice.
