# AI DevFest Vibe-Coding Contest Agent Guide

<!-- ACTIVE-CONTEST-HANDOFF:START -->
## ACTIVE CONTEST: TenderReady execution handoff

**Read [the full implementation plan](plan.md), then implement it immediately. Do not restart broad planning.**

This is the active instruction block for the released **Tender Document Package Builder** challenge. The original rulebook-derived guide below is preserved. Live organizer instructions, the released challenge, and the rulebook remain higher authority than this handoff or `plan.md`.

### Clock and scope

- Participant reports that coding has started; do not remain in preparation/setup mode.
- Working final freeze: **approximately 19:05, 6 October 2026, Asia/Dhaka**. This is a conservative estimate from the participant's remaining-time statement, **not independently organizer-confirmed**.
- Participant-updated development/feature freeze: **18:50**, final freeze **19:05** on 6 October 2026 Asia/Dhaka. This update supersedes older 18:35 development targets in the preserved plan. Earlier organizer deadlines still override it.
- Check the actual clock at the start of each milestone. Planning time has already consumed part of development; never reset the timer on an agent handoff.
- An earlier organizer-confirmed deadline overrides this working estimate. The printed 15:30–17:30 event window is not sufficient to infer the updated live deadline.
- Stop all source, docs, Git, DNS, and deployment changes after submission or the applicable final freeze, whichever comes first. After freeze, review/report only.
- The request includes **all M1–M9 requirements and all B1–B8 bonuses**, with the mandatory workflow first. Do not silently drop features or falsely check them off.

### Immediate next actions

1. Read the complete `plan.md` and inspect the current tree to preserve concurrent work.
2. Create the fresh React/TypeScript/Vite implementation under `app/`; preserve the organizer PDF, rulebook, and sample pack unchanged.
3. Implement the main browser-only upload/match/status/duplicate/PDF journey before bonuses. Use the exact status and PDF rules in the plan.
4. Run focused checks continuously. Commit and push at safe intervals with prompt-bearing messages; establish an early public Vercel deployment.
5. Update this active block at each milestone with actual results, timestamps, next steps, and remaining defects. Keep the original safeguards below intact.

### Architecture and non-negotiable safeguards

- Stack: React, TypeScript, Vite, `pdf-lib@1.17.1`, `pdfjs-dist@5.4.624`, local Noto Sans Bengali, Lucide, plain CSS, native Web Crypto/IndexedDB.
- Bundle the worker from the same PDF.js version. Do not upgrade the machine's Node just to use a newer PDF.js.
- No backend, serverless functions, participant-controlled cloud database/storage, login requirement, or AI dependency for the main flow.
- All document processing remains in the browser. Never send document bytes to an AI or other external service.
- Optional AI keys are user-entered and memory-only: never persist, log, commit, screenshot, or deploy them.
- One file/content hash can serve at most one requirement. Optional supplied expired/missing-expiry documents still block generation.
- English cover is mandatory; show correctly shaped Bangla on the index. Reserve a separate footer band rather than covering source content.
- No hardcoded sample-only status logic, inferred expiry dates, fake buttons, invented output, or unverified PASS claims.
- Keep `.remember/`, secrets, `.env*`, dependencies, caches, and local provider-account configuration out of commits.
- No force-push, history rewriting, or after-freeze edits, even to this guide.

### Verified sample oracle

- Tender: `T-2026-0417`; deadline: `2026-10-20`.
- Use `trade_license_2026.pdf`, expiry **2027-06-30**; exclude the older license, which expires **2025-06-30**.
- Bank solvency expiry: **2026-12-31**.
- Use only one of the byte-identical experience certificates.
- `scan_0042.pdf` is the signed declaration, not a missing/invalid document merely because text extraction is empty.
- `company_logo.png` must be rejected by the document uploader; a separate PNG stamp control is permitted.
- Leave optional R06 and R07 unmatched.
- Ready-state oracle: **8 OK, 2 Not provided, 0 blockers**.
- Selected source content: **15 pages**. Cover + single index + documents = **17 pages**. No index = **16 pages**.
- Indexed document starts: R01=3, R02=4, R03=5, R04=6, R05=7, R08=9, R09=15, R10=17.
- These are test expectations only; unseen packs must work without filename/ID hardcoding.

### Execution status — update after each milestone

| Field | Current value |
|---|---|
| Last updated | 2026-10-06 18:46 Dhaka |
| Current phase | All M1–M9 and B1–B8 implemented with scoped local evidence; final Git release; manual deployment outstanding |
| Implementation owner | Codex implementation agent |
| Review owner | Read-only reviewer attempted but provider rate-limited; independent retest NOT complete |
| Next action | Participant deploys latest main; provide live URL/SHA, independent reviewer retests; stop all changes on submission or freeze |
| App/build/test status | 9 domain tests pass; browser sample 8 OK / 2 Not provided; PDF 17 pages. Production build PASS (3.67s); production-preview sample flow and storage PASS. |
| Local Git / latest commit | e85a9b7 pushed 18:38; three compliant commits present; PDF blank-page repair pending next push |
| Repository target | `kawsher-hridoy/devfest-kawsherhridoy` — participant confirmed accepted identifier |
| Deployment | Participant will deploy manually to public Vercel; agent deployment/login stopped per 18:28 user instruction. Live not verified. |
| Custom domain | Not supplied; Vercel URL first, never guess or modify another domain |
| External blockers | Await participant live URL/source SHA for public verification; no custom domain requested |
| Source evidence | Full statement/rulebook/sample inspected; sample hashes/page counts and scanned declaration verified |

### Requirement completion checklist

Only mark an item checked when it is implemented **and** tested; add its evidence below. A claimed feature without evidence remains unchecked.

- [x] M1 — Validated requirements import, tender details, numeric ordering.
- [x] M2 — Multiple PDFs, names/page counts, safe rejection/removal, size/count limits.
- [x] M3 — Reversible one-file-to-one-requirement matching.
- [x] M4 — Expiry entry for matched expiry-bearing requirements.
- [x] M5 — Exact five statuses, immediate updates, deadline equality accepted.
- [x] M6 — Content-hash duplicates detected and cross-requirement reuse prevented.
- [x] M7 — Generation blocked with visible reasons until valid.
- [x] M8 — Correct English cover, ordered complete pages, non-overlapping footers, required download filename.
- [x] M9 — Complete Bangla/English interface, responsive and keyboard usable.
- [x] B1 — Index and correct starting-page numbers, including pagination offsets.
- [x] B2 — PNG stamp on chosen pages with preview and position/size controls.
- [x] B3 — Correctly escaped UTF-8 CSV checklist download.
- [x] B4 — IndexedDB save/reopen including original PDF bytes and project state.
- [x] B5 — Visually correct Bangla PDF index text.
- [x] B6 — Reviewable filename auto-match suggestions with collision safety.
- [x] B7 — Damaged/password-protected files fail safely and clearly.
- [x] B8 — Optional runtime-key AI help; real-provider result separately verified or explicitly not verified.
- [x] A1 — Actual resolved sample saved to `output/T-2026-0417_Package.pdf` and visually checked.
- [x] A2 — Required status screenshots saved under `screenshots/`.
- [x] A3 — README, MIT LICENSE, third-party notices, source, lockfile complete.
- [x] A4 — At least three compliant commits, timely pushes, no secrets/history rewriting.
- [ ] A5 — Public HTTPS deployment checked in fresh browser and source SHA matches.
- [ ] A6 — Independent retest complete; defects fixed or honestly recorded before freeze.

### Evidence ledger

Append concise rows at each milestone. Distinguish source inspection, automated checks, local browser checks, deployed checks, and external-provider checks.

| Time | Requirement IDs / milestone | Check or command | Observed result | Remaining action |
|---|---|---|---|---|
| 2026-10-06 18:08:45 +06 (+0600) | Planning/source inspection | Full PDF text + rendered source pages; sample `pdfinfo`, SHA-256, visual scan review | Sample oracle established; not an application PASS | Implement and test the full plan |
| 18:18–18:27 Dhaka | M1–M9; B1/B3/B4/B5/B7; A1/A2 | `npm test`; actual Chrome sample flow; PDF download, pdfinfo/pdftotext/render; save/reload/reopen; bilingual 1440/768/390 | 8 tests pass; sample 8 OK, 2 Not provided; 17 pages and expected starts; shaped Bangla index visually checked; 10 files restored; no viewport overflow; expired blocks/equality OK; duplicates disabled; damaged/encrypted rejected; invalid import preserves workspace | Build not yet complete; stamp/AI and independent review pending |
| 18:27 Dhaka | Organizer preservation / Git | SHA-256 manifest; public repo API; first compliant commit push | All original organizer hashes unchanged; public repo created and aed527d pushed | At least two more commits and matching Vercel production deployment |
| 18:30–18:37 Dhaka | B2/B8 / production build / docs | actual stamp PDF and visual page3; composition change; npm run build; fresh Chrome production preview; mocked AI403 and IndexedDB readback | stamp only selected pages; stale pages cleared; bundled production build 10.97s; sample PDF 17pages; storage10files; AI error leaves counts unchanged; key absent from save; README/MIT/notices present | Gemini real-provider not verified; participant deployment required |
| 18:38 Dhaka | Independent review | read-only reviewer spawned per handoff | Reviewer inspecting current code and running own tests, not yet complete | Review findings and exceptional PDF fixtures |
| 18:39–18:41 Dhaka | M8 regression / exceptional pages | Production-preview derivative: portrait,90/180/270 rotation,CropBox,blank; annotation derivative; actual downloads and rendered pages | Blank page initially failed; repaired by preserving truly blank page without embedding missing content; 8-page derivative now generates; visible annotation retained; footer bands separate | Independent reviewer errored due provider rate limit; participant/manual reviewer still needed |
| 18:42–18:46 Dhaka | B6 / final regression / artifacts | actual suggestion acceptance, CSV download, no-index PDF, bilingual viewports; npm test/build; final PDF download/render | 2 license candidates require acceptance; date remains needed; CSV BOM10rows/8OK2NotProvided; no-index16pages; 6 viewport/language combos no overflow or unnamed buttons; __proto__ assignment defect reproduced and fixed; 9tests PASS; build3.67s; final sample17pages and visually shaped index | Public Vercel/source SHA and independent review not verified; participant deployment/submission required |

### Release and independent-review handoff

- Follow `plan.md`'s absolute milestones, acceptance matrix, PDF oracle, and repair-prompt template.
- Use the confirmed public repository name; every commit includes a change summary plus the actual AI prompt/accurate summary, or `Manual edit` for a genuinely manual change.
- Vercel: static Vite, root `app`, build `npm run build`, output `dist`; never create Functions/SSR.
- Submit the actual sample-generated PDF and status screenshots, not handcrafted replacements for app output.
- Preserve at least the 30-minute final verification/release window and notify the participant promptly about authentication or deadline risks.
- Handoff must include commands/results, M/B checklist, current SHA, live URL, known failures, remaining time, and whether submission actually occurred.
- Do not claim future independent retesting has already happened. After implementation, the reviewer re-inspects and reproduces failures before issuing a scoped repair prompt.

<!-- ACTIVE-CONTEST-HANDOFF:END -->

## Purpose

This file tells the coding agent how to assist during the **AI DevFest 2026 AI Vibe-Coding Contest (Solo)** on **6 October 2026**.

The objective is not to build the largest app. The objective is to deliver, within the official contest window, a reliable bilingual frontend application that:

1. completes every main requirement;
2. uses only permitted technology and data;
3. is committed and pushed with a valid Git history;
4. is deployed to a public HTTPS URL;
5. matches the submitted final eligible commit; and
6. can be clearly explained by the participant.

## Important Pre-Contest Warning

This is a preparation and operating guide, not reusable project code.

- Do **not** copy old application code, components, templates, styles, configuration, or project files into the official contest repository.
- During the 30-minute setup period, the rulebook explicitly permits adding a `README.md` and MIT `LICENSE`, but not project code.
- Unless an organizer explicitly confirms otherwise, keep this prewritten `AGENT.md` outside the official contest repository before T+0.
- Create all submitted project code from zero after the organizers announce T+0.

## Rule Source and Precedence

When instructions conflict, follow this order:

1. live instructions announced by the organizers;
2. the challenge statement and sample data released at T+0;
3. written clarifications given by organizers during T+0 to T+15;
4. `AI_DevFest_Vibe_Coding_Rulebook.md`;
5. this guide;
6. agent assumptions.

Never silently resolve an important ambiguity. During the first 15 minutes, prepare a short question for the organizer when an ambiguity affects eligibility, required output, data interpretation, deployment, or scoring.

## Timing Authority

The event information covers **3:30 PM to 5:30 PM on 6 October 2026**, while the actual build/deploy period is defined as **T+0 through T+90** after a separate 30-minute setup period. Do not guess the exact clock time of T+0.

At the venue, record these organizer-confirmed times:

- Setup begins: `[confirm at venue]`
- T+0 / coding begins: `[confirm at venue]`
- T+90 / absolute code, push, and deployment freeze: `[confirm at venue]`
- T+95 / late submission closes: `[confirm at venue]`

The organizer-announced T+0 controls every deadline.

## Contest State Machine

The agent must always know the current state.

### State A: Before setup

Allowed work is preparation only.

- Review rules and tool logins.
- Verify GitHub, AI tool, and static hosting access.
- Prepare authentication devices and backup internet.
- Do not prepare reusable project code or a project template.
- Do not predict or pre-build the unknown challenge.

### State B: 30-minute setup period

- Create a **new public GitHub repository** named `devfest-kawsherhridoy`.
- Confirm that Git push works.
- A `README.md` and MIT `LICENSE` may be added.
- Do not create, generate, or commit project code before T+0.
- Log in to the chosen static hosting provider, but do not deploy challenge code.
- Confirm the official T+0 and T+90 clock times.

### State C: T+0 to T+15

- Read the complete challenge and every supplied file before coding deeply.
- Separate **main tasks** from **bonus tasks**.
- Identify required inputs, outputs, user journeys, sample-data rules, and judging evidence.
- List ambiguities and ask organizers only the questions that can materially change implementation.
- Select the smallest architecture capable of completing the main tasks.
- Start implementation from zero.

### State D: T+15 to T+75

- Implement one complete main-task journey first.
- Keep Bangla/English support, deployment constraints, and sample data in the architecture from the start.
- Test continuously in the latest Chrome-compatible browser.
- Commit and push at safe intervals; never wait until the deadline.
- Deploy an early working version, then improve it.

### State E: T+75 to T+87

- Stop adding broad features.
- Finish incomplete main requirements.
- Verify bilingual coverage, responsive layout, accessibility basics, empty/error states, and sample-data behavior.
- Complete the required README.
- Confirm the public HTTPS deployment from a fresh browser session.
- Create and push the intended final eligible commit.
- Confirm the deployment matches that commit.

### State F: T+87 to T+90

- Freeze scope.
- Run only fast, essential checks.
- Record the final commit SHA and live URL.
- Submit before T+90 whenever possible.
- At T+90, stop all coding, commits, pushes, and deployment changes.

### State G: After T+90

- Do not edit code, Git history, repository content, or deployment.
- T+90 to T+95 is a submission-only late window and carries a 10-mark penalty.
- After T+95, submission is not accepted.

## Non-Negotiable Technical Constraints

### Frontend only

The complete app must execute in the browser.

Allowed:

- plain HTML, CSS, and JavaScript;
- React, Vue, Angular, Svelte, or another frontend framework;
- open-source npm/CDN libraries;
- official starter tools created during the contest;
- browser features and browser storage such as `localStorage`, `sessionStorage`, and IndexedDB;
- static HTTPS hosting;
- external HTTPS APIs that support browser CORS and satisfy the fallback rule.

Not allowed:

- participant-controlled backend or server code;
- serverless functions;
- participant-controlled persistent databases or online storage;
- Firebase, Supabase, Appwrite, or similar services used as the app's persistent backend;
- hidden backend dependencies presented as frontend-only behavior.

### External API fallback

An external API must not be essential to the app's main journey. If it fails, the core app must still work using supplied/local sample data or a clearly labeled fallback.

### Optional AI inside the app

The app's main features must work without embedded AI.

If an optional AI feature is included:

- the user enters their own API key at runtime;
- never store the key persistently unless the challenge explicitly requires a safe allowed method;
- never commit, log, print, expose, or deploy a key;
- failure of the AI feature must not break the main tasks;
- clearly label AI-generated output and errors.

### Two-language requirement

Every main user-facing element must work in **Bangla and English**, including:

- navigation;
- headings and field labels;
- buttons;
- instructions;
- validation messages;
- empty, loading, success, and error states;
- important table headings and chart labels;
- user-visible sample-data descriptions.

Implement a centralized translation dictionary rather than duplicating entire pages. Use stable translation keys. The language switch must update the whole interface consistently. Remembering the selected language in browser storage is allowed.

### Data and privacy

- Use only organizer-provided sample data or clearly fabricated test data.
- Do not use or upload real personal data or private company data.
- Do not invent facts that are absent from the provided data.
- Validate imported data and handle missing or malformed values visibly.
- Do not send supplied data to an external service unless the challenge and rules clearly permit it.

### Lab and communication rules

- The contest is solo. Do not communicate with other participants or outside people.
- Ask contest questions only to organizers, and ask challenge-clarification questions during T+0 to T+15.
- Internet use is permitted for AI tools, documentation, open-source libraries, allowed APIs, and static hosting.
- A phone may be used only for authentication and, when necessary, as a backup hotspot—not for coding, AI, calls, messaging, email, or other contest work.
- Do not use remote-access tools, unauthorized external storage, or another person's files.
- Do not disable security controls or interfere with lab computers or networks.
- Immediately report organizer-provided computer or internet failures to an organizer; do not assume extra time will be granted.
- At the end, log out of GitHub, AI tools, email, and hosting accounts and close the browser.

### Secrets

No passwords, tokens, API keys, credentials, or private configuration may appear in:

- source files;
- `.env` files committed to Git;
- Git history, including old commits;
- console logs or screenshots;
- the live deployment.

If a secret is accidentally committed, immediately notify the participant. Do not rewrite Git history without organizer guidance because force-push/history rewriting is prohibited.

## Implementation Strategy

### First principle: main tasks before bonuses

Use this priority order:

1. correct interpretation of the challenge;
2. complete main-task user journey;
3. correct handling of supplied sample data;
4. Bangla and English coverage;
5. reliable public deployment;
6. clear README and explainable code;
7. usability and visual polish;
8. bonus tasks.

Do not sacrifice a main task, deployment, or documentation for a bonus feature.

### Choose the simplest suitable stack

- Prefer plain HTML/CSS/JavaScript when the app is small and mostly static.
- Prefer a lightweight frontend framework only when components, state, forms, filtering, or views make it clearly faster and safer.
- Avoid unfamiliar tools and unnecessary dependencies.
- Before adding a package, ask whether native browser functionality is enough.
- Keep installation and build time low.

### Build a vertical slice

Complete one real flow early:

`load sample data -> user action -> visible result -> bilingual labels -> error handling -> deployed page`

A narrow working flow is more valuable than many disconnected screens.

### Architecture expectations

Keep the code easy to explain:

- separate supplied/static data from rendering logic;
- separate business rules from presentation;
- centralize translations;
- use small components/functions with clear names;
- avoid premature abstraction;
- avoid dead code and fake buttons;
- show honest empty/error states rather than fabricated results;
- use deterministic code for calculations and required rules.

### User experience baseline

Unless the challenge says otherwise, the finished app should have:

- a clear organization-focused title and purpose;
- an obvious primary action;
- readable Bangla and English text;
- responsive behavior for laptop and mobile widths;
- keyboard-usable controls;
- associated labels for form inputs;
- adequate color contrast and visible focus states;
- useful validation and recovery messages;
- no console-breaking errors;
- no required login.

Do not spend excessive time creating decorative animations while required behavior is incomplete.

## Agent Working Style

### At T+0

After inspecting the challenge and repository, give the participant a concise execution brief containing:

1. the app's required purpose;
2. the main tasks;
3. the optional bonuses;
4. the proposed stack;
5. the minimum complete user journey;
6. important ambiguities for the organizer;
7. the first deployment target;
8. the next commit deadline.

Then begin implementation. Do not produce a long essay while the contest clock is running.

### While implementing

- Make concrete file changes instead of repeatedly proposing plans.
- Explain important decisions in short, simple language.
- Do not hide errors or claim success without command/browser evidence.
- Run focused checks after each meaningful change.
- Keep a visible checklist of main requirements.
- Warn the participant when a requested change risks a rule violation or the deadline.
- If time is short, reduce scope instead of lowering correctness.
- Ensure the participant can explain the data flow and major code sections.

### Never do these actions

- Do not use pre-contest project code or old templates.
- Do not copy another participant's work.
- Do not contact, message, or collaborate with anyone other than organizers.
- Do not access other participants' files or devices.
- Do not add a prohibited backend, serverless function, or persistent cloud database.
- Do not place secrets in the app or repository.
- Do not force-push, rebase pushed commits, delete the repository, or otherwise rewrite history.
- Do not make code, commit, push, repository, or deployment changes after T+90.
- Do not say a requirement is complete unless it has been checked.

## Git Protocol

### Repository

- Visibility: public.
- Name: `devfest-kawsherhridoy`.
- License: MIT.
- Repository must contain all source code, required output files, `README.md`, and `LICENSE`.

### Commit frequency

The rulebook requires:

- at least one commit every 30 minutes during the contest;
- at least three commits total;
- all eligible commits pushed by T+90.

Target more safely:

- Commit 1 by approximately T+20 to T+25.
- Commit 2 by approximately T+45 to T+50.
- Commit 3 by approximately T+65 to T+70.
- Final commit by approximately T+82 to T+87.

Push each commit immediately when practical. Do not rely on one final push.

### Required commit-message format

Every commit message must contain both:

1. a short note describing what changed; and
2. the AI prompt used, or the exact words `Manual edit` when no AI prompt was used.

Recommended format:

```text
Add bilingual data filtering

Prompt: "Implement the required filter using the supplied sample data and update all related labels in Bangla and English."
```

For a manual change:

```text
Fix README live URL

Manual edit
```

When several prompts contributed to one commit, include a concise summary of the most relevant prompts without exposing credentials or unrelated private information.

### Before every commit

- inspect `git status`;
- review the diff;
- confirm no secrets or unrelated files are staged;
- run the fastest relevant test/build check;
- stage explicit files;
- use a compliant commit message;
- push without rewriting history.

## Deployment Protocol

Deployment is compulsory and gives no bonus; without it, the submission is incomplete.

The live site must:

- use public HTTPS;
- open without login, permission requests, or installation;
- work in the latest Google Chrome;
- run the main features;
- contain no secrets;
- match the final eligible Git commit;
- remain available through judging and results publication.

Use static hosting only, such as GitHub Pages, Netlify, Vercel, or Cloudflare Pages, configured without prohibited server code.

Deploy early enough to discover routing, asset-path, or build problems. For single-page apps, verify direct navigation and refresh behavior. Test the final URL in a private/incognito window.

Before freeze, record:

- final commit SHA;
- public repository URL;
- public HTTPS deployment URL;
- successful build output;
- time of the final push;
- time the final deployment became accessible.

Never claim that the live deployment matches the final commit without checking both.

## README Requirements

Before the final commit, ensure `README.md` includes every rulebook item:

- participant's full name;
- registration number;
- public HTTPS live link;
- how to install/run the app, including exact commands if applicable;
- main features completed;
- bonus features completed;
- known problems or limitations;
- AI tools used;
- most useful prompt.

A separate `LICENSE` file containing the MIT License is mandatory.

Recommended additional README sections, only if time permits:

- note that the project is released under the MIT License;
- problem summary;
- sample-data source;
- technology stack;
- browser-storage or external-API behavior;
- screenshots;
- final commit SHA.

Do not claim incomplete features as completed. Be honest about limitations.

## Final Verification Gate

Before creating the final eligible commit, verify all applicable items.

### Rules

- [ ] All submitted project code was created after T+0.
- [ ] App is frontend only.
- [ ] No prohibited backend or persistent online storage exists.
- [ ] Only supplied or fabricated non-private data is used.
- [ ] No secrets exist in the working tree or Git history.
- [ ] Third-party libraries/assets have compatible licenses.

### Functionality

- [ ] Every main requirement works end to end.
- [ ] Required sample data produces correct, explainable output.
- [ ] Main functionality survives external API/AI failure.
- [ ] Invalid, empty, and missing data are handled.
- [ ] No important button or control is fake or broken.

### Language and UI

- [ ] Language switch works.
- [ ] Main labels, buttons, messages, and instructions exist in Bangla and English.
- [ ] Layout works at common desktop and mobile widths.
- [ ] Forms have labels and useful validation.
- [ ] No uncaught browser-console errors remain in the main journey.

### Build and deployment

- [ ] Production build succeeds, if a build step exists.
- [ ] Public HTTPS URL opens without login.
- [ ] Main flow works on the deployed site in a fresh browser session.
- [ ] Deployment matches the intended final commit.
- [ ] Repository and deployment will remain available through judging.

### Git and submission

- [ ] Public repository name is correct.
- [ ] At least three compliant commits exist.
- [ ] Commit frequency satisfies the 30-minute rule.
- [ ] Every commit message includes a change note and prompt or `Manual edit`.
- [ ] `README.md` contains every required item.
- [ ] MIT `LICENSE` exists.
- [ ] Final eligible commit is pushed before T+90.
- [ ] Final SHA, repository URL, and live URL are copied accurately into the form.

## Submission Handoff Format

At the end, report only verified facts in this compact format:

```text
MAIN TASKS: complete / incomplete — short details
BONUS TASKS: complete / not attempted — short details
BUILD: pass / fail — command used
LIVE CHECK: pass / fail — what was tested
BILINGUAL CHECK: pass / fail — coverage checked
GIT: final SHA — pushed at time
REPOSITORY: public URL
DEPLOYMENT: public HTTPS URL
KNOWN LIMITATIONS: honest short list
SUBMISSION STATUS: submitted / not yet submitted
FREEZE STATUS: no further changes after T+90
```

If something was not tested, write `not verified`; never label it as passed.

## Rulebook-Derived Risk Summary

The most likely causes of an otherwise good project becoming ineligible or losing marks are:

1. beginning project code before T+0;
2. using an old template or old code;
3. building a backend or persistent cloud database;
4. leaving major labels/messages in only one language;
5. missing the commit-frequency or prompt-in-commit-message rules;
6. leaking an API key;
7. delaying deployment until the final minutes;
8. submitting a live deployment that does not match the final commit;
9. making any code/Git/deployment change after T+90;
10. spending time on bonuses before main tasks work;
11. failing to include all required README information;
12. using real personal/private data;
13. being unable to explain AI-generated code.

The agent must actively prevent these failures, not merely mention them afterward.
