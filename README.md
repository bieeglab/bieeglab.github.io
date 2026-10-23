# Brain Imaging and EEG Laboratory — website mockup

A responsive, buildless first pass for BIEEGL, affiliated with UCSF and the San Francisco VA. This is a **local design preview**, not a published or official site. No content was pushed or deployed.

## Preview

From this repository, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://localhost:4173. Stop the server with Ctrl+C. There is no installation or build step. All design assets are local; the bridge photograph was supplied by the user as free to use, and the signal mark / scientific graphics are original SVG/CSS. No external fonts, analytics, or libraries are required. Internet access is only used if a visitor follows an institutional link.

## Edit

- `index.html`: page sections, draft research themes, selected publications and news placeholders, join/participate and contact copy.
- `content.js`: complete roster, roles, biographies, portrait paths. Replace each `bio: null` with approved plain text and `portrait: null` with a relative local image path (for example `assets/people/judy-ford.jpg`). The shared defaults are in the final `.map()`; add individual fields to the relevant member object. Put the photos in that folder, with permission. Portrait images should be cropped consistently and compressed before adding them.
- `styles.css`: colors, layout, responsive breakpoints, typography, focus and reduced-motion styles.
- `script.js`: mobile navigation, directory search/group filters and profile expansion.
- `assets/brain-bridge.svg`: original decorative scientific / Golden Gate Bridge illustration; `favicon.svg`: original signal mark. Neither represents measured data or official institutional branding.

Search and group filters combine. Use Everyone and clear the search to reset. All 18 entries (17 named members plus the volunteer placeholder) appear initially. Individual biography panels are native keyboard-accessible disclosure controls. No personal biography, current publication, news item, address, phone, email, study eligibility, or recruitment availability is invented. Historical content is identified explicitly. There is no inquiry form.

## Roster supplied for the mockup

| Group | Members |
| --- | --- |
| Directors | Daniel Mathalon (Co-Director); Judith Ford (Co-Director); Susanna Fryer (Associate Director) |
| Principal Investigators | Samantha Abram; Michael Jacob; Jessica Hua; Maria Kryza-Lacombe |
| Postdoctoral Fellows | Jessica Mow; Carlos Carrasco; Maya Wong; Wendy Torrens |
| CRCs / RAs | Juliette Kyner; Zoe Rygg; Olivia Dance |
| Lab Manager | Paul Betancourt |
| Research engineering | Spero Nicholas — Computational Research Engineer (provisional title) |
| Consultant | Brian Roach |
| Volunteers | TBD |

CRCs/RAs, the lab manager, research engineering, and the consultant appear under the **Staff & collaborators** filter; each card retains its supplied role. All portraits remain placeholders. Judith Ford has a clearly labeled historical biography adapted from the supplied screenshot; other biographies and the volunteer entry remain placeholders.

## Content needed before publication

1. Approved portraits, biographies, titles, profile links, and roster order. Confirm Spero Nicholas's provisional title.
2. Current lab introduction, research methods and project descriptions. Schizophrenia and structure/function language is explicitly based on the historical lab page and needs review.
3. Verified bibliography, DOI / publisher links, and any approved research resources.
4. Real news items, dates, and optional lab photography.
5. Confirmed job openings, study recruitment details, eligibility, and approved contact routes.
6. Current contact email, address and visitor directions. Historical phone numbers and addresses were intentionally omitted.
7. Review institutional naming/branding and replace the visible preview labels after approval.

## References

Visual inspiration: [Computational Cognitive Neuroscience Lab](https://rldmlab.github.io/) and the supplied Minnesota, Learning and Decision Making, Knight Lab, and historical BIEEGL screenshots. Text and layout are original. Historical screenshots informed the introduction, research themes, NAPLS and rumination project summaries, Judith Ford’s archive biography, and historical location/participation context. Four selected 2025–2026 papers now link to their DOI records; the COVID paper is explicitly labeled a bioRxiv preprint. No archived telephone numbers, travel instructions, or current recruitment claims were carried forward.

## GitHub Pages compatibility

The root `index.html` and relative asset paths work on GitHub Pages with no build process, including a repository subpath. Publishing is intentionally not configured here. When approved, use the repository owner's preferred Pages workflow. Do not commit personal contact details, recruitment copy, or photos until approved for public use.

## Verification

Use `node --check script.js` and `node --check content.js` for syntax checks. Review at desktop and mobile widths, use the menu and keyboard navigation, combine search/filter controls, and expand biographies and research details. The page uses semantic landmarks, visible focus rings, a skip link, native disclosures, pressed filter states, live result counts, and a reduced-motion preference.

Verified for this first pass: JavaScript syntax and Git whitespace checks passed; localhost returned HTTP 200; browser review at 1280px, 390px and 320px found no horizontal overflow after the narrow headline adjustment. Confirmed all 18 entries, PI filtering (3 entries), Spero Nicholas search, biography expansion, empty search feedback, mobile menu selection/Escape dismissal, loaded illustration, valid internal anchors, and no browser console warnings/errors. This was a focused manual review, not a full accessibility audit.

Branding revision: use BIEEGL with “The Brain Imaging and EEG Laboratory” beneath it, and “Meet the Lab” for the directory. The former nickname has been removed. Historical material must be reviewed before publication; study status is not inferred from the archived site.

## Early psychosis program content

The Research & Care feature introduces the UCSF Path Program and AMP SCZ with official external links. Path care descriptions were checked against https://www.ucsfhealth.org/care/services/early-psychosis-path-program and https://pathprogram.ucsf.edu/. Daniel Mathalon’s role as Path research principal investigator is sourced from https://pathprogram.ucsf.edu/research. AMP SCZ’s general aims and resources are sourced from https://www.ampscz.org/. Research participation links go directly to official program sites so visitors can check study status and eligibility there. The feature does not imply that BIEEGL provides all program services or manages every AMP SCZ site. Supplied lab roles are retained; the Path roster was not substituted for this lab’s roster.

The lab directory now lists Daniel Mathalon first, followed by Judith Ford and Susanna Fryer.

## UCSF color alignment and bridge photography

The site uses the official UCSF palette: Navy `#052049`, Blue A2 `#0F388A`, Teal C2 `#14828C`, light teal C4 `#60D0DA`, CTA Blue `#006BE9`, and white / gray / light blue neutrals. Source: https://identity.ucsf.edu/brand-guide/color. Teal C4 is used on navy for decorative/light accents; body copy uses navy or blue gray on light backgrounds. Typography and lab identity are retained; the signal icon is a lab mark, not the official UCSF logo.

The user supplied `negative-space-golden-gate-bridge-full-1062x708.jpg` in the original repository and identified it as free to use. It is stored as `assets/golden-gate-bridge.jpg` and displayed in the homepage hero with responsive CSS cropping and a descriptive alt attribute. The original upload is preserved. The full-resolution source has since been identified: Matt Bango on NegativeSpace, offered under CC0. See the image source notes below. `assets/brain-bridge.svg` is retained as an unused original illustration.

## High-resolution bridge photograph

The hero uses the exact same photograph by Matt Bango, now derived from the **6000 × 4000** original rather than the 1062 × 708 preview. Source: https://negativespace.co/golden-gate-bridge-landscape/. Original download: https://negativespace.co/wp-content/uploads/2021/02/negative-space-golden-gate-bridge-full.jpg. The photo page lists CC0, and the provider’s license explanation is at https://negativespace.co/license/.

`assets/golden-gate-bridge-1200.jpg` and `assets/golden-gate-bridge-2400.jpg` are JPEG derivatives of that original (resized / recompressed, without AI generation or upscaling). The hero uses `srcset` and `sizes` so the browser can select an appropriate resolution for the viewport and display density. The original 17 MB download stays outside the repository; the smaller user-supplied upload and first-pass asset are preserved. Credit is also recorded in `assets/IMAGE-CREDITS.md`.

## Brain + ERP lab mark

`assets/lab-mark.svg` is an original, transparent SVG combining a stylized lateral brain outline with an event-related-potential-inspired trace beneath it. Navy defines the brain; UCSF teal defines the waveform. The smooth trace has small early deflections followed by a broader positive-going P300-like component (positive-up convention). It is an illustrative identity mark, not measured data or a scientific plot. The supplied stock-logo screenshot was a visual direction only; its exact paths, wording, and branding were not copied.

The header uses the shared SVG; the favicon uses a reversed version on navy. The hero and electrophysiology card now use matching smooth ERP-inspired curves instead of angular pulse symbols. Colors and strokes can be edited directly in the SVG.

## Research section illustrations

Three original SVG illustrations in `assets/research/` replace the abstract first-pass diagrams:

- `fmri.svg`: scanner bore and participant/table, for MRI and fMRI.
- `eeg.svg`: profile with an electrode network and three outgoing smooth ERP-inspired traces.
- `conversation.svg`: two people talking, with overlapping speech bubbles.

These use UCSF navy / teal and match the lab’s vector identity. Supplied reference screenshots informed subject matter only; stock paths, watermarks, and third-party logo text were not copied. Graphics are decorative beside equivalent section text and have empty alt text to avoid repeating the content for screen readers. Neural signal traces are illustrative, not recorded data.

The full laboratory name above the homepage headline is enlarged to 15px on desktop and 13px on phones, per design feedback.

Readability revision: increased body copy, metadata, filters, role labels, research card copy, notes, and navigation text throughout the site. Navigation collapses sooner to preserve readable sizes rather than shrinking link text.

## Navigation and illustration revision

The navigation and page now follow About → Research → People → Publications → Programs → News → Join / Participate → Contact. Earlier research descriptions are kept in an optional disclosure after the research cards so People can be reached sooner. News and joining sections use straightforward headings; postdoctoral inquiry copy invites discussion of future positions and fellowship funding without claiming an existing vacancy.

The research cards now use the built-in image generator’s flat stencil/cartoon outputs in `assets/research/fmri-stencil.png`, `eeg-stencil.png`, and `conversation-stencil.png`. PNG transparency is preserved. Prompts and provenance are in `assets/research/generation-prompts.md`. The realistic first generation was rejected and is not used by the website. The source SVGs remain available but are no longer displayed in those cards. The EEG traces are illustrative raw-like channels, not measured data.

The site displays the four papers specifically selected by the user: Mathalon et al. (2025, Schizophrenia), Rodriguez-Sanchez et al. (2026, Biological Psychiatry), Abram et al. (2026, bioRxiv COVID preprint), and Abram et al. (2026, Schizophrenia Bulletin ketogenic-diet trial). The broader source records and refresh script in the worktree remain preparatory and are not connected to the site. There is no automatic publication feed.

Final copy cleanup removed the archive adaptation note, historical-project disclosure, team tagline, and first-pass directory note.


## Languages
The top-bar language selector offers English, Simplified Chinese (`zh-Hans`), Hindi (`hi`), Spanish, and Arabic (`ar`). The selection is stored locally in the browser; no translation service receives visitor data. `translations.js` holds the site-authored Spanish, Chinese, Hindi, and Arabic translations. The English HTML remains the source and works without JavaScript. The directory, filters, search, accessible labels, placeholders, and page title switch with the content. Names, published paper titles, citations, journal names, and official program names retain their original form for accurate reference. External program websites have their own language availability. Review translated clinical and participation copy with fluent speakers before public launch. Add or update translation keys whenever English copy changes.
Program and join/participate number labels and the top mockup badge have been removed.

Institutional logos: the user-supplied UCSF signature and VA stacked logo appear beside the BIEEGL identity in the top header. Original files are copied without modification into `assets/institutions/`; both logos link to their institutional websites and retain their full aspect ratios. Logo lettering remains in the original artwork; accessible descriptions switch languages.

Language scope was reduced to five choices by the user: English, Chinese, Hindi, Spanish, and Arabic, based on total-speaker ranking. Hindi and Arabic were drafted locally, with no website text sent to an external translation service. Arabic sets the page direction to right-to-left; published titles and citations keep their original direction. Previously drafted Vietnamese text is retained in the source but is not offered in the five-language selector. Fluent-speaker review remains appropriate before publishing.

Program-card headers now use the supplied UCSF Path lockup and supplied Early Intervention emblem. The latter was uploaded as `amp-scz-logo.png` and is paired with a visible AMP SCZ title because the image itself does not contain that program name. Both assets are copied unchanged into `assets/programs/`; their accessible descriptions follow the selected language.
