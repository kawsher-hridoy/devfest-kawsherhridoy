# TenderReady — Competition Implementation and Verification Plan

## 1. Objective, deadline, and verified requirements

Build **TenderReady**, a professional Bangla/English, browser-only application that turns uploaded tender documents into a validated, correctly ordered PDF package.

**Working deadline:** approximately **19:05, 6 October 2026, Asia/Dhaka**, derived conservatively from the participant's latest “75 minutes remaining” update. Development ends at **18:35**, preserving 30 minutes for verification and release. Planning and handoff time are already included—not additional time. An organizer-confirmed earlier deadline overrides this schedule. Do not restart a fresh 75- or 90-minute timer when opening this plan.

**Execution documents:** this file is `plan.md`. The existing uppercase `AGENT.md` is the canonical agent guide; do not create a conflicting lowercase copy. Read both before implementation. This handoff authorizes the implementing agent to build the application; it does not mean application development, tests, commits, or deployment have already happened.

**Source evidence:** the complete five-page `AIDevFest-ViveCoding_ProblemStatement.pdf`, current `AI_DevFest_Vibe_Coding_Rulebook.md`, existing agent guide, and supplied `problem-pack/sample-pack/` were inspected. The scanned declaration was also inspected visually. This plan must not override organizer instructions, the problem statement, or the rulebook.

### Mandatory acceptance checklist

| ID | Required behavior |
|---|---|
| M1 | Import `requirements.json`; display tender details and requirements sorted numerically by `order`. |
| M2 | Upload multiple PDFs; show filenames/page counts; reject non-PDFs; support removal. |
| M3 | Support editable, reversible, one-file-to-one-requirement matching. |
| M4 | Request expiry dates for matched requirements with `has_expiry: true`. |
| M5 | Recalculate the exact five document statuses immediately after changes. |
| M6 | Detect byte-identical files regardless of filename; prevent their use for different requirements. |
| M7 | Disable generation for blocking problems and explain those problems visibly. |
| M8 | Generate the exact cover/document/footer structure and download `<tender_id>_Package.pdf`. |
| M9 | Translate all main interface labels, controls, instructions, and messages into Bangla and English. |

All **eight bonuses** are in scope, implemented after the mandatory workflow. Never claim a bonus complete without verification, and never extend the deadline to finish one.

### Verified sample-pack oracle

Tender ID: **T-2026-0417**. Submission deadline: **2026-10-20**.

Tender title: **Supply of IT Equipment**. Procuring entity: **Directorate of Sample Services**. Bidder: **Meghna Tech Solutions Ltd.**

| Requirement | Correct supplied file | Pages | Expiry entered | Start page with index |
|---|---|---:|---|---:|
| R01 Trade License | `trade_license_2026.pdf` | 1 | 2027-06-30 | 3 |
| R02 TIN Certificate | `03_tin_certificate.pdf` | 1 | — | 4 |
| R03 VAT Registration | `04_vat_certificate.pdf` | 1 | — | 5 |
| R04 Bank Solvency | `bank_solvency.pdf` | 1 | 2026-12-31 | 6 |
| R05 Experience Certificate | `experience_cert.pdf` | 2 | — | 7 |
| R06 Audited Financial Statement | Not provided; optional | 0 | — | — |
| R07 Manufacturer's Authorization | Not provided; optional | 0 | — | — |
| R08 Technical Proposal | `02_technical_proposal.pdf` | 6 | — | 9 |
| R09 Financial Proposal | `01_financial_proposal.pdf` | 2 | — | 15 |
| R10 Signed Declaration | `scan_0042.pdf` | 1 | — | 17 |

Expected result: **8 OK, 2 Not provided, 0 blockers**.

Expected output: **15 document pages + 1 cover + 1 index = 17 pages**. Without the index, it is 16 pages.

Important traps:

- The older trade license expires **2025-06-30** and must not be used in the resolved sample.
- The replacement's filename says 2026, but its expiry is **2027-06-30**. Never infer expiry from filenames.
- Both experience-certificate files have identical SHA-256 hashes. Include only one. The verified shared hash is `91cb4ab661a5418ff13a9b2361d14f71d6b63ad47a33f4468aa90a37d066f8cd`.
- Reject `company_logo.png` from document uploads; allow PNGs only through the separate stamp control.
- `scan_0042.pdf` is an image-only signed declaration, verified visually. Do not require extractable text.
- Filename prefixes are deliberately inconsistent with required package order.
- These mappings are test expectations—not hardcoded application behavior. Judges will supply a different pack in the same format.

## 2. Architecture, data rules, and interface

### Stack and structure

Create a fresh **React + TypeScript + Vite** application under `app/`, preserving all organizer files.

Use:

- `pdf-lib@1.17.1` for PDF inspection, composition, images, and footers.
- `pdfjs-dist@5.4.624` for previews and exceptional-page rendering.
- A locally bundled Noto Sans Bengali font.
- Lucide icons and ordinary CSS.
- Native Web Crypto, IndexedDB, and browser downloads.
- Node's test runner through `tsx` for pure TypeScript logic tests.

The PDF.js pin is intentional: its declared engines support the installed Node 20; the newest inspected release requires a newer runtime. Do not spend contest time upgrading Node. See technical reference [1]. Pin resolved dependencies with the lockfile and configure the PDF.js worker from the same installed version, bundled by Vite rather than an unrelated CDN.

No backend, serverless functions, database service, authentication system, analytics, OCR pipeline, or embedded document-upload service.

### State and minimum internal interfaces

Keep business rules separate from React components.

```text
Project
  tender + requirements
  uploaded PDFs: id, name, bytes, byteLength, pageCount, sha256
  assignments: requirementId -> fileId + expiryDate
  export options: index, stamp configuration
  language + dirty/saved state
```

Required operations:

```text
validateRequirements(input)
inspectPdf(file)
getRequirementStatus(requirement, assignment, deadline)
getBlockingIssues(project)
suggestMatches(project)
buildPackage(project)
exportChecklist(project, language)
saveWorkspace(project) / restoreWorkspace()
```

Statuses and totals are derived values, not separately maintained mutable state. Store PDF bytes separately from render-only object URLs; revoke object URLs on replacement/removal and component cleanup.

### Exact status precedence

For every requirement:

1. No matched file:
   - Mandatory → **Missing**, blocking.
   - Optional → **Not provided**, nonblocking.
2. Matched file with `has_expiry: true`:
   - No valid entered date → **Expiry date needed**, blocking.
   - Date before submission deadline → **Expired**, blocking.
   - Date equal to or after deadline → **OK**.
3. Matched file without expiry requirement → **OK**.

Additional rules:

- An **optional but supplied** document can block generation when its expiry is missing or expired.
- Compare validated ISO calendar dates against the **submission deadline**, not today.
- Invalid dates produce a field error and remain “Expiry date needed.”
- Duplicate is an uploaded-file warning, **not a sixth requirement status**.
- Unmatched duplicates do not independently block generation.

### Import and matching behavior

- Validate required JSON fields, dates, unique requirement IDs, numeric order, and booleans. Do not coerce strings such as `"false"` into booleans.
- Sort by numeric `order`; use source order as a deterministic tie-breaker.
- Reject malformed imports without destroying the current workspace.
- Confirm replacement before loading another tender into a nonempty workspace.
- Enforce **30 accepted PDFs and 50,000,000 total PDF bytes**; count duplicate uploads too. Display this limit explicitly; the decimal byte interpretation is the plan's default unless organizers clarify otherwise.
- Validate content and parsing, not merely extension or browser MIME type.
- Process files through a bounded queue; show individual failures without losing successful uploads.
- Hash complete file bytes with SHA-256.
- Prevent assignment when that file—or any identical-content sibling—is already assigned elsewhere.
- Changing/removing a matched file clears its associated expiry date.
- Preserve original bytes; give PDF.js copies where worker transfer could detach buffers.
- Disable generation while ingestion or generation is running.
- Invalidate stale generated downloads after package-affecting changes.
- Render imported names and metadata as text, never executable HTML.

### Professional bilingual design

Brand: **TenderReady / টেন্ডাররেডি**.

Use a restrained office-product aesthetic:

- Off-white background, navy text, deep-teal primary actions.
- White panels, subtle borders, consistent spacing, readable typography.
- Green/amber/red status chips with text and icons—not color alone.
- Compact header with language switch, Save, and Reopen.
- Three clear steps: **Load → Check → Download**.
- Desktop: wide checklist plus uploaded-files/package-summary sidebar.
- Mobile: stacked cards with a prominent generation action.
- PDF preview in an accessible drawer/modal.
- Visible blocker list beside the disabled Generate button.

Centralize translations, including errors, confirmation dialogs, empty states, progress, duplicate warnings, and bonus controls. Requirement names come directly from `title_en` or `title_bn`.

Set the document language, preserve language preference, support keyboard interaction, visible focus, labeled inputs, and polite status announcements. Do not add a marketing landing page, decorative 3D, or complex animation before the working tool is complete.

Provide a **Load supplied sample** action through the same import pipeline. Sample loading must not silently resolve mappings or invent expiry dates. Only the organizer's fictional sample assets may be bundled for this convenience action; user documents must never be uploaded or published.

## 3. PDF generation and all bonus features

### Mandatory PDF pipeline

1. Revalidate the current project.
2. Collect matched requirements in numeric order; exclude unmatched optional requirements.
3. Measure cover/index layout and calculate document starting pages.
4. Create exactly one **English cover page** containing:
   - Tender ID and title.
   - Procuring entity.
   - Bidder.
   - Submission deadline.
   - Actual package-generation date.
   - All included document names in order.
5. Add the optional index.
6. Append every source page in its original internal order.
7. Apply requested image stamps.
8. Add final page-number footers after the total page count is known.
9. Download the exact required filename.

Use wrapped text and measured layout. Do not truncate required cover information. If unusually long content cannot fit, expand the single cover's height rather than silently omitting text. Preserve supplied tender metadata verbatim; do not invent English translations of proper names or tender details. Use the bundled-font/browser-rendering path if supplied metadata contains glyphs unsupported by the PDF's standard font.

### Non-overlapping footer implementation

**Do not simply draw over the bottom of an existing page.**

For document pages:

- Respect the visible CropBox and page rotation.
- Embed the original visible content on a new page with a separate **36-point footer band below it**.
- Preserve content scale and displayed orientation.
- Place the footer inside that additional band.
- For visible annotations/forms that would be lost by embedding, render that affected page through PDF.js before placement; do not rasterize every ordinary page.

Apply the same reserved-footer principle to generated cover/index pages.

Exact footer:

```text
<tender_id> | Page X of Y
```

Use readable, high-contrast text. Verify portrait, landscape, rotated, scanned, and bottom-edge-content pages. The selected PDF library exposes embedding, positioning, rotation, and page-box operations needed for this approach; see technical reference [2].

### Bonus implementation contract

| Bonus | Minimum complete implementation |
|---|---|
| **B1 Index** | Enabled by default; list included documents and their true starting pages. Paginate when necessary and include every index page in offset calculations. |
| **B2 PNG seal/signature** | Separate PNG upload; package preview; selected page numbers/ranges; position presets plus size/position controls. Clamp placement above the footer. Clear stale page selections when package composition changes. |
| **B3 Checklist export** | CSV with document, filename, pages, expiry date, and status. Include all requirements in order. Use UTF-8 BOM, correct quoting, and spreadsheet-formula escaping. |
| **B4 Save/reopen** | Explicit IndexedDB Save and Reopen, including PDF bytes, requirements, assignments, dates, and export options. Revalidate restored data. Handle unavailable storage/quota errors without losing current work. |
| **B5 Bangla PDF text** | Keep the required cover English. Show English and correctly shaped Bangla document names on the index. Render Bangla text using the loaded browser font into high-resolution transparent images, then embed them. Visually verify conjuncts. |
| **B6 Auto-match** | Suggest filename-based matches using normalized tokens, titles, and common abbreviations. Require user acceptance; show competing candidates. Never infer expiry, force ambiguous matches, or bypass duplicate constraints. |
| **B7 Bad files** | Catch damaged, unsupported, and password-protected PDFs individually. Display translated recovery guidance; do not crash or bypass encryption checks. |
| **B8 AI help** | Optional Gemini help using a user-entered key held only in memory. Explain checklist problems and next steps; never determine authoritative statuses or modify assignments automatically. |

Implement the bad-file guard with ingestion, then complete the remaining bonuses in this order after the mandatory flow works: **B1, B3, B6, B4, B5, B2, B8**. All remain requested deliverables, not permission to silently omit later items.

For AI:

- Discover `generateContent`-capable models through the documented Models API instead of hardcoding a “latest” model; see technical reference [3].
- Send only explicitly approved, anonymous status counts and the selected language—not documents, filenames, tender details, or personal data.
- Display a consent explanation before the request.
- Use the API-key header, cancellation/timeout, and translated authentication/network/quota errors.
- Never persist keys in browser storage, project saves, source, logs, or screenshots.
- Core functionality must remain fully usable without AI or internet access to the provider.
- Without a user-entered key, report real-provider verification as **not verified**; mocks are not live evidence.

## 4. Execution schedule and agent handoff

### Fixed-clock milestones

All times below are **6 October 2026, Asia/Dhaka**. They are absolute targets, not a fresh duration granted to each new agent. On handoff, check the current clock and catch up without moving the freeze.

| Time, Dhaka | Deliverable |
|---|---|
| Immediately–18:05 | Save plan/update guide; scaffold app; establish state/types/translations; initialize public repository; first compliant commit/push. |
| 18:05–18:18 | Complete mandatory upload/match/status/duplicate/PDF flow; establish an early public Vercel deployment. |
| 18:18–18:35 | Complete eight bonuses, responsive polish, and focused tests. Commit/push around 18:25 and at feature freeze. |
| 18:35–18:47 | Independent functional/browser/PDF review; fix verified defects; capture required output and screenshots. |
| 18:47–18:55 | Finish README/licenses/artifacts; final eligible commit/push; deploy matching production version. |
| 18:55–19:02 | Fresh-session production checks, source-SHA verification, domain verification if available. |
| 19:02–19:05 | Submission and safety buffer. No new features. |
| At deadline/submission | Stop code, documentation, Git, DNS, and deployment changes. |

If an earlier milestone slips, consume development scope—not the protected submission buffer. Record incomplete bonuses honestly; never hide missing mandatory behavior. An organizer-confirmed deadline and the rulebook's submission freeze take precedence over this provisional clock.

### Required `AGENT.md` update protocol

Preserve rulebook safeguards and keep the active handoff at the top with:

- Current competition state and working deadline, explicitly distinguishing participant-reported timing from organizer-confirmed timing.
- Link to `plan.md` as the implementation specification.
- “Read the plan and implement; do not restart broad planning.”
- Checklist M1–M9 and B1–B8, initially unchecked.
- Current milestone, owner, next action, blockers, and latest commit.
- Explicit sample oracle and package-page expectation.
- Prohibited actions: backend, secrets, fabricated verification, history rewriting, post-freeze edits.

After each milestone, update its status with **command/browser evidence and time**. No checklist item becomes complete solely because code exists. Update before the final commit; after submission or deadline do not edit this guide or any other repository content.

### Git and deployment

Use the participant-confirmed repository name:

```text
kawsher-hridoy/devfest-kawsherhridoy
```

The authenticated GitHub login was read as `kawsher-hridoy`; the profile display name was `Kawsher HRidoy`. The participant confirmed `kawsherhridoy` as the accepted registration identifier for this repository. Do not invent a numeric registration number. Use the participant's confirmed official spelling if they provide a correction.

Create it as a new public repository. If a repository or working tree now exists because another agent started, inspect and preserve it rather than recreating or overwriting it. Keep `.remember/`, credentials, `.env*`, dependencies, caches, and local hosting-account configuration out of Git.

Every commit must include:

```text
Short change summary

Prompt: "The actual implementation prompt or an accurate summary."
```

Use `Manual edit` only for genuinely manual changes. Maintain at least three commits and no interval exceeding 30 minutes. Never force-push or rewrite pushed history. Review explicitly staged files for secrets and unrelated content.

Deploy as a **static Vite project**, root directory `app`, build command `npm run build`, output directory `dist`; do not add Vercel Functions or SSR. See technical reference [4]. Keep the app on one route unless necessary; if client-side routes are introduced, configure static SPA rewrites and test direct navigation/refresh.

**Domain default:** secure the public `vercel.app` URL first. No custom hostname was supplied, so do not guess one or touch an existing portfolio domain. If supplied in time, add only that hostname using Vercel's displayed DNS records and verify HTTPS. DNS/certificate completion must not delay submission. See technical reference [5]. Never purchase a domain or change unrelated DNS records without explicit authorization.

### Required submission artifacts

- `output/T-2026-0417_Package.pdf`: actual browser-generated, resolved sample package.
- `screenshots/`: at least one clear statuses screenshot; preferably English desktop, Bangla mobile, and duplicate-warning evidence.
- README: participant name/accepted registration identifier, live URL, exact run/build commands, mandatory/bonus completion, limitations, AI tools, useful prompt.
- MIT `LICENSE`, plus required third-party license notices.
- All application source and lockfile.

Record the final SHA in the submission handoff, avoiding a self-referential “final SHA” edit inside that same commit. Clearly label submission as submitted or not yet submitted; do not claim a portal submission without evidence.

## 5. Verification, release gates, and repair prompt

### Automated/domain tests

Cover:

- Every status branch, especially optional-but-supplied blocking behavior.
- Expiry before/equal/after deadline; leap-date validation.
- Unsorted requirements and invalid JSON without destructive replacement.
- Assign, replace, unassign, and remove.
- Identical bytes under different names; three-member duplicate groups.
- Same filename with different bytes.
- PDF count/byte boundaries and mixed valid/invalid upload batches.
- Correct included-page counts and multi-page-index offsets.
- CSV commas, quotes, Bangla, and formula-leading values.
- Save/reopen integrity and absence of API keys.
- AI failure without changes to deterministic results.

Use supplied data and temporary derivatives for edge cases; never alter the original pack or introduce real/private data. Temporary bad/large/rotated fixtures are test-only derivatives, not official sample replacements. Record any organizer restrictions affecting such testing.

### Browser verification

Run the complete sample flow in both languages at approximately **1440, 768, and 390 pixels**.

Check:

- Initial missing/optional states.
- Old-license expiry failure and valid replacement.
- Duplicate assignment prevention.
- PNG rejection and scanned-PDF preview.
- Visible disabled-generation explanations.
- Actual package and CSV downloads.
- Save → reload → reopen.
- Stamp placement and page-selection invalidation.
- Keyboard access and narrow-screen layout.
- No uncaught console errors or failed essential assets.
- Main workflow with AI/external requests blocked.

### PDF verification

Inspect the actual downloaded artifact with `pdfinfo`, text extraction, and rendered pages:

- Exactly **17 pages** for the indexed sample.
- Correct English cover fields.
- Correct eight-document order and starting-page oracle.
- All six technical-proposal pages and both financial/experience pages retained.
- No old trade license, duplicate experience copy, or omitted optional document.
- Exact footer on every page: pages 1–17, total 17.
- No footer obscures original content.
- Bangla index text is visually correct.
- Stamps appear only where selected.

Do not treat successful PDF saving or text extraction as proof of visual correctness. Bangla index text rendered as an image needs visual inspection rather than a text-extraction assertion.

### Production gate

Before submission:

- Build and tests have recorded output.
- Required artifacts are committed.
- Repository is public.
- Final SHA is pushed.
- Vercel's deployed source SHA matches.
- Public HTTPS opens without login in a fresh browser session.
- The deployed app completes the sample workflow.
- README accurately distinguishes completed, failed, and unverified features.

### Independent retest and targeted repair

After implementation handoff, the reviewing agent reruns these checks rather than trusting the developer's checklist. Provide the reviewer with the working directory, run commands, final/current SHA, live URL, completed-check evidence, known failures, and remaining time. The reviewer must inspect the actual checkout before proposing repairs.

For each verified failure, issue:

```text
Read AGENT.md and plan.md.

Fix only these verified defects:
- Requirement ID:
- Reproduction steps:
- Expected behavior:
- Observed behavior:
- Evidence:
- Affected implementation area:

Preserve the frontend-only architecture and all passing behavior.
Add or update regression tests, rerun the affected acceptance checks,
and update AGENT.md with actual results.

If still before the contest freeze, make a compliant commit, push,
redeploy, and verify the matching production revision.
If the freeze has passed, report findings only; do not modify anything.
```

**Definition of done:** mandatory requirements, claimed bonuses, sample PDF, screenshots, documentation, Git history, and public deployment are independently verified—not merely implemented.

### Ready-to-paste execution prompt

```text
Work in /home/l0minex/Desktop/Project/devfest_ai_vibecoding.

Read AGENT.md and the FULL plan.md, then implement the plan immediately.
Do not restart broad planning or stop after scaffolding. Preserve organizer
files and any current work. Build TenderReady with all M1–M9 mandatory
requirements and all B1–B8 bonuses, mandatory workflow first, with polished
responsive Bangla/English UI and browser-only processing.

Check the clock now. Target development freeze at 18:35 and working final
freeze around 19:05 on 6 October 2026, Asia/Dhaka. These are existing absolute
deadlines, not a fresh timer; any earlier organizer deadline takes precedence.
Do not change code, Git, documentation, DNS, or deployment after submission
or the freeze. If already frozen, report status only.

Implement, test, and update AGENT.md with requirement IDs and real evidence
after each milestone. Use the sample oracle: 8 OK, 2 Not provided, 17 package
pages with cover and index. Produce the required sample PDF, screenshots,
README, and MIT license. Make compliant commits/pushes and deploy the matching
revision to public Vercel static hosting. Vercel URL first; never guess a
custom domain, expose secrets, add a backend, or rewrite Git history.

If authentication or a missing external detail blocks one step, tell me
exactly what is needed and continue independent local work. Never claim
untested features, successful deployment, or submission without evidence.
Finish with commands/results, requirement checklist, remaining defects,
current SHA, live URL, and a handoff for independent retesting.
```

### Technical references checked during planning

[1] PDF.js package metadata: `npm view pdfjs-dist@5.4.624 version engines`. Installed runtime observed: Node `v20.20.2`, npm `10.8.2`. Compatible candidate declares Node `>=20.16.0 || >=22.3.0`.

[2] Official PDF-LIB `PDFPage` API reference: `https://pdf-lib.js.org/docs/api/classes/pdfpage`.

[3] Google Gemini Models API: `https://ai.google.dev/api/models`; API authentication: `https://ai.google.dev/api`.

[4] Official Vite deployment guide: `https://vercel.com/docs/frameworks/frontend/vite`.

[5] Official domain configuration guide: `https://vercel.com/docs/domains/working-with-domains/add-a-domain`.

## Handoff provenance

- Written at: 2026-10-06 18:08:45 +06 (+0600).
- This save/update operation concerns planning and agent-instruction documents only.
- At the last workspace inspection, no application or local Git repository existed.
- Requirement and sample analysis was performed; application build, functionality, live AI, Git publication, and deployment are **not verified**.
- Re-inspect the checkout when another agent starts; concurrent work can make this snapshot stale.
