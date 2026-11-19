---
target: CV site (main)
total_score: 21
max_score: 36
na_heuristics: 9
p0_count: 0
p1_count: 3
target_identity: "file:/Users/edderleonardo/Documents/Dev/edderleonardo/src/pages/index.astro"
target_fingerprint: "sha256:92ed8757883e13724025f88af8987f80227bcf32c43f3aabf6651ef47b028943"
target_path: /Users/edderleonardo/Documents/Dev/edderleonardo/src/pages/index.astro
timestamp: 2026-11-08T04-37-37Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review · B: detector). Target: src/pages/index.astro (+ /es/), branch main @ d4a5074.

## Design Health Score — 21/36 (58%, Acceptable). n/a: 9 (no forms/errors)
1 Visibility 2 — no nav/progress; flickering project dots without legend
2 Real world 2 — printer icon = download CV; "Currently working" vs "2024-2026"
3 Control 3 — no section jump / back to top on ~6000px page
4 Consistency 2 — Spanish title attrs on EN page; "Skil|ls" split; two pill systems
5 Error prevention 3 — mailto with target=_blank
6 Recognition 2 — 4 icon-only contact links, names only in tooltips
7 Flexibility 1 — KeyboardManager imported but never mounted (Cmd+K dead)
8 Minimalist 2 — 8 roles at equal weight, 27 certs, Skills duplicates per-job skills
9 n/a
10 Help 2 — advertised palette does not render

## Specificity
Close to the midudev minimalist-portfolio template; own marks: amber highlighter, Plex Mono. Detector: src regex scan clean; rendered dark: 25 line-length (Section.astro:45 800px max, Experience bullets), 4 straggler (es); mobile: stragglers, unbalanced headings (Certificates). Light: green active dot 2.55:1 (Projects.astro:113). No contrast/tiny-text in dark after prior fixes.

## Priority issues
- [P1] Strongest proof buried, everything equal weight (Docwise/AI at ~85% depth below 27 certs) → distill, layout
- [P1] No primary contact CTA; icon-only links, Spanish titles on EN, printer icon for PDF → clarify
- [P1] Cmd+K palette dead + a11y gaps: headings read "Aboutme" (Section.astro:24), no skip link/nav, emoji buttons, summary outline:none, infinite flicker w/o reduced-motion → harden
- [P2] Flat type hierarchy, ~90ch mono body lines, 12px project descriptions → typeset
- [P2] Dark mode leftovers: #f2f2f2/#eee borders and chips (Projects.astro:86, Skills.astro:93, Strengths.astro:33, Hero.astro:156) → polish

## Personas
Jordan: no seniority/availability signal, PDF hidden behind printer, contradictory dates, projects at the bottom. Casey: amber name underline collapses to 0px, emoji over photo, 24x36/32x32 tap targets, ~6200px Experience. Sam: run-together headings, "Skil ls", Spanish accessible names, no skip link/landmarks, removed focus outline, perpetual animation.

## Minor
Long tab title; OG 400x400 summary; viewport missing initial-scale; 16 font files; "Github/GitHub", "Postgres/PostgreSQL"; untranslated project title; "Destrezas" vs "Habilidades".
