# MindNest UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform MindNest's bland grayscale UI into a warm, calm, sage-green-themed journaling experience inspired by mindfulness apps.

**Architecture:** Pure frontend redesign — modify CSS theme, update all page components and layout components to use the new design system. No backend changes. All existing functionality preserved.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Lora + Inter fonts (Google Fonts)

**Spec:** `docs/superpowers/specs/2026-03-22-mindnest-ui-redesign-design.md`

---

## Task 1: Design System Foundation — CSS Variables, Fonts, Shadows

**Files:**
- Modify: `Frontend/JournalFrontend/index.html`
- Modify: `Frontend/JournalFrontend/src/index.css`

This is the foundation that unlocks all other tasks. Every subsequent task depends on these variables existing.

- [ ] **Step 1: Add Google Fonts to index.html**

Add Lora (400,500,600,700 + italic) and Inter (300,400,500,600,700) via Google Fonts link tag in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Replace the entire `:root` CSS variable block in index.css**

Replace the current oklch-based variables with the new sage/cream/forest palette. Full variable set from spec Section 1.1 "CSS Variable Mapping":

```css
:root {
  --radius: 0.75rem;
  --background: #FDFCFA;
  --foreground: #1C1A17;
  --card: #F8F6F1;
  --card-foreground: #2D2A25;
  --popover: #F8F6F1;
  --popover-foreground: #2D2A25;
  --primary: #7C9885;
  --primary-foreground: #FFFFFF;
  --secondary: #F0F5F1;
  --secondary-foreground: #465C4D;
  --muted: #F0EDE5;
  /* NOTE: Spec says #8A8479 but that fails WCAG AA for body text. Using #6B665D per spec Section 7.1 accessibility fix. */
  --muted-foreground: #6B665D;
  --accent: #D9E5DC;
  --accent-foreground: #354839;
  --destructive: #C75450;
  --border: #E4DFD5;
  --input: #F0EDE5;
  --ring: #93B59B;
  --sidebar: #F8F6F1;
  --sidebar-foreground: #2D2A25;
  --sidebar-primary: #7C9885;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #D9E5DC;
  --sidebar-accent-foreground: #354839;
  --sidebar-border: #E4DFD5;
  --sidebar-ring: #93B59B;
  --chart-1: #7C9885;
  --chart-2: #B8A9D4;
  --chart-3: #D4C9A9;
  --chart-4: #A9C4D4;
  --chart-5: #A9D4B8;

  /* Sage scale */
  --sage-50: #F0F5F1;
  --sage-100: #D9E5DC;
  --sage-200: #B5CCBA;
  --sage-300: #93B59B;
  --sage-400: #7C9885;
  --sage-500: #6A8572;
  --sage-600: #587260;
  --sage-700: #465C4D;
  --sage-800: #354839;
  --sage-900: #243326;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(44, 42, 37, 0.04), 0 1px 2px rgba(44, 42, 37, 0.06);
  --shadow-md: 0 4px 12px rgba(44, 42, 37, 0.06), 0 2px 4px rgba(44, 42, 37, 0.04);
  --shadow-lg: 0 12px 32px rgba(44, 42, 37, 0.08), 0 4px 8px rgba(44, 42, 37, 0.04);
  --shadow-xl: 0 24px 48px rgba(44, 42, 37, 0.10), 0 8px 16px rgba(44, 42, 37, 0.05);
  --shadow-sage-glow: 0 0 0 3px rgba(124, 152, 133, 0.25);
  --shadow-sage-glow-lg: 0 0 20px rgba(124, 152, 133, 0.15);

  /* Category colors */
  --category-personal: #B8A9D4;
  --category-work: #A9C4D4;
  --category-study: #D4C9A9;
  --category-travel: #A9D4B8;
}
```

- [ ] **Step 3: Replace the `.dark` CSS variable block**

```css
.dark {
  --background: #0F1A14;
  --foreground: #D4E2D7;
  --card: #1A2520;
  --card-foreground: #ECF2ED;
  --popover: #1A2520;
  --popover-foreground: #ECF2ED;
  --primary: #7C9885;
  --primary-foreground: #ECF2ED;
  --secondary: #243530;
  --secondary-foreground: #A8C4AE;
  --muted: #243530;
  --muted-foreground: #4D665C;
  --accent: #2E4038;
  --accent-foreground: #D4E2D7;
  --destructive: #E06B67;
  --border: #2E4038;
  --input: #243530;
  --ring: #7C9885;
  --sidebar: #1A2520;
  --sidebar-foreground: #D4E2D7;
  --sidebar-primary: #7C9885;
  --sidebar-primary-foreground: #ECF2ED;
  --sidebar-accent: #2E4038;
  --sidebar-accent-foreground: #D4E2D7;
  --sidebar-border: #2E4038;
  --sidebar-ring: #7C9885;
  --chart-1: #7C9885;
  --chart-2: #8B7AB3;
  --chart-3: #B8AD7A;
  --chart-4: #7AA3B8;
  --chart-5: #7AB88B;

  --sage-50: #2E4038;
  --sage-100: #3A5048;
  --sage-200: #4D665C;
  --sage-300: #7C9885;
  --sage-400: #7C9885;
  --sage-500: #A8C4AE;
  --sage-600: #D4E2D7;
  --sage-700: #ECF2ED;
  --sage-800: #D4E2D7;
  --sage-900: #ECF2ED;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.20), 0 1px 2px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.24), 0 2px 4px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.30), 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.35), 0 8px 16px rgba(0, 0, 0, 0.20);
  --shadow-sage-glow: 0 0 0 3px rgba(124, 152, 133, 0.35);
  --shadow-sage-glow-lg: 0 0 24px rgba(124, 152, 133, 0.20);

  --category-personal: #8B7AB3;
  --category-work: #7AA3B8;
  --category-study: #B8AD7A;
  --category-travel: #7AB88B;
}
```

- [ ] **Step 4: Add global typography and utility classes to index.css**

After the theme variables, add:

```css
/* Typography */
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  transition: background-color 300ms ease, color 300ms ease;
}

h1, h2, h3, .font-serif {
  font-family: 'Lora', Georgia, serif;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Skeleton shimmer with sage tint */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

- [ ] **Step 5: Verify the theme loads correctly**

Run: `cd Frontend/JournalFrontend && npm run dev`

Open the app. Confirm:
- Light mode shows warm cream backgrounds (not pure white)
- Dark mode shows deep forest green backgrounds (not pure black)
- Sage green is visible as the primary accent
- Text is readable in both modes
- Lora and Inter fonts are loading (check Network tab)

- [ ] **Step 6: Commit**

```bash
git add Frontend/JournalFrontend/index.html Frontend/JournalFrontend/src/index.css
git commit -m "feat: add sage/forest design system — CSS variables, fonts, shadows"
```

---

## Task 2: Layout Components — Header, Sidebar, MainLayout

**Files:**
- Modify: `Frontend/JournalFrontend/src/components/layouts/header.tsx`
- Modify: `Frontend/JournalFrontend/src/components/layouts/app-sidebar.tsx`
- Modify: `Frontend/JournalFrontend/src/components/layouts/main-layout.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Redesign the Header**

Read `header.tsx` first. Apply these changes:
- Background: `bg-[--background]/85 backdrop-blur-lg` (frosted glass)
- Border bottom: `border-b border-[--border]/60`
- Height: `h-16`
- Position: `sticky top-0 z-50`
- Logo: Use Lora font (`font-serif`), 20px, weight 600, sage-700 color. Or use the logo image at `h-8`.
- Search bar: Pill-shaped (`rounded-full`), background `bg-[--input]`, border transparent (shows on focus only), focus ring sage glow. Search icon in muted color.
- Theme toggle: Ghost button, `rounded-full`, 40x40px. Icon color muted.
- User dropdown trigger: Avatar 32px + chevron. Hover `bg-[--muted]`.
- Remove any `bg-white dark:bg-gray-900` hardcoded classes.

- [ ] **Step 2: Redesign the Sidebar**

Read `app-sidebar.tsx` first. Apply:
- Background: `bg-[--sidebar]`
- Border right: `border-r border-[--sidebar-border]`
- Nav items: Height 44px, padding `py-2.5 px-4`, rounded-[10px] with 8px horizontal margin from edges.
- Icon sizes: Reduce to `h-5 w-5` (20px) from current oversized icons.
- Gap icon-to-text: `gap-3` (12px).
- Text: Inter, 15px, weight 500.
- Default state: transparent bg, muted text.
- Hover state: `bg-[--sage-50]`, text darkens, icon goes sage.
- Active state: `bg-[--sage-100]`, text sage-700, icon sage-400.
- Remove any hardcoded `bg-white`, `dark:bg-gray-900`, or oversized icon classes.

- [ ] **Step 3: Update MainLayout**

Read `main-layout.tsx`. Ensure:
- Sidebar slide animation uses spring easing: `transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`
- Overlay uses proper opacity and blur.
- Main content area uses `bg-[--background]`.
- Remove any hardcoded color classes.

- [ ] **Step 4: Verify layout works in both themes**

Run: `npm run dev`
- Toggle light/dark mode
- Check sidebar opens/closes smoothly
- Check header blur effect works on scroll
- Check all nav items highlight correctly on active route

- [ ] **Step 5: Commit**

```bash
git add Frontend/JournalFrontend/src/components/layouts/
git commit -m "feat: redesign header, sidebar, and main layout with sage theme"
```

---

## Task 3: Landing Page Redesign

**Files:**
- Modify: `Frontend/JournalFrontend/src/pages/LandingPage.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Read the current LandingPage.tsx**

Understand the current structure before modifying.

- [ ] **Step 2: Redesign the landing page**

Full viewport hero, centered content:

- **Background**: Light mode: gradient from `#FDFCFA` to `#F0F5F1` with subtle radial sage glow. Dark mode: `#0F1A14` to `#0A120D` with faint sage glow.
- **Logo**: MindNest logo image (use dark/light variant based on theme), `h-16` to `h-20`, centered.
- **Heading**: Lora, `text-5xl md:text-6xl`, font-bold, `text-[--foreground]`. Text: "Your thoughts deserve a beautiful home." Use `text-balance`.
- **Subtitle**: Inter, `text-lg`, `text-[--muted-foreground]`, max-w-md, centered. Text: "A calm, private space to journal your days, reflect on your journey, and grow."
- **CTA button**: Primary sage button, slightly larger (`py-3 px-8 text-base`). Text: "Start Journaling". Links to `/signup`.
- **Login link**: Below CTA, subtle link: "Already have an account? Log in" in sage color. Links to `/login`.
- **Spacing**: 24px logo→heading, 16px heading→subtitle, 32px subtitle→CTA, 12px CTA→login link.
- **Optional**: Subtle CSS animated gradient orb in background at ~5% opacity sage tint, slowly drifting.
- Remove all old classes: `bg-[radial-gradient(...)]`, `text-7xl font-extrabold`, etc.

- [ ] **Step 3: Verify and commit**

Check both light and dark modes. The page should feel warm, inviting, and premium — not like a cold SaaS tool.

```bash
git add Frontend/JournalFrontend/src/pages/LandingPage.tsx
git commit -m "feat: redesign landing page with sage hero and warm typography"
```

---

## Task 4: Auth Pages — Login and Signup

**Files:**
- Modify: `Frontend/JournalFrontend/src/pages/AuthPages/LoginPage.tsx`
- Modify: `Frontend/JournalFrontend/src/pages/AuthPages/SignupPage.tsx`

**Depends on:** Task 1

- [ ] **Step 1: Read both auth page files**

- [ ] **Step 2: Redesign LoginPage.tsx**

- **Page background**: Same gradient as landing page (cream-to-sage light, forest dark).
- **Card**: Max-width 440px, centered. `bg-[--background]`, border `border-[--border]`, `rounded-[20px]`, `shadow-lg`. Padding `p-8`.
- **REMOVE `scale-150`** — this CSS zoom hack must go. Size the card properly instead.
- **Content (top to bottom)**:
  1. MindNest logo, `h-12`, centered. mb-4.
  2. Heading: Lora, `text-2xl font-semibold`, centered. "Welcome back"
  3. Description: Inter, `text-sm text-[--muted-foreground]`, centered, mb-6. "Sign in to continue your journal"
  4. Form fields with redesigned inputs: `bg-[--input]`, border `border-[--border]`, `rounded-[10px]`, focus ring sage glow. Labels: `text-xs font-semibold uppercase tracking-widest text-[--muted-foreground]`.
  5. Error banner: `bg-destructive/10 border-l-4 border-destructive` with error text.
  6. Submit button: Full-width primary sage. "Sign In"
  7. Divider: hr with "or" text centered, muted colors.
  8. Google OAuth button: Full width.
  9. Switch link: "Don't have an account?" + "Sign up" sage link. Inter, `text-sm`.

- [ ] **Step 3: Redesign SignupPage.tsx**

Same card approach as login with these differences:
- **Card max-width**: 480px (slightly wider).
- **REMOVE `scale-125`**.
- **Heading**: "Create your journal"
- **Description**: "Sign up to start capturing your thoughts"
- **Form layout**: 2-column rows for First Name + Last Name, Gender + DOB. Full-width for Email, Username, Password, Confirm Password.
- **Password strength indicator** (enhancement): 4 segments below password field, colored from red to sage green. Requirements text in caption style.
- Same input styling, error handling, and Google OAuth as login.

- [ ] **Step 4: Verify and commit**

Test both login and signup flows. Check form validation, Google OAuth, theme toggle.

```bash
git add Frontend/JournalFrontend/src/pages/AuthPages/
git commit -m "feat: redesign auth pages — warm cards, sage inputs, remove scale hacks"
```

---

## Task 5: Home Dashboard Redesign

**Files:**
- Modify: `Frontend/JournalFrontend/src/pages/Home.tsx`

**Depends on:** Task 1, Task 2

- [ ] **Step 1: Read Home.tsx**

- [ ] **Step 2: Redesign the Home dashboard**

Replace the current static marketing-style cards with a functional, personalized dashboard.

**Layout**: Content max-width `max-w-5xl`, centered. Vertical stack with `gap-12` (48px) between sections.

**Section 1 — Personalized Greeting:**
- Time-aware greeting based on current hour:
  - 5-11: "Good morning, {firstName}"
  - 12-16: "Good afternoon, {firstName}"
  - 17-20: "Good evening, {firstName}"
  - 21-4: "Good night, {firstName}"
- Lora, `text-3xl md:text-4xl font-semibold`
- Subtitle: entry count or welcome message. Inter, `text-base text-[--muted-foreground]`.
- Date: Inter, `text-sm text-[--muted-foreground]`. Format: "Saturday, March 22, 2026"

**Section 2 — Quick Actions (2 cards, horizontal row):**
- Card A "Start Writing": Sage gradient bg (`bg-gradient-to-br from-[#7C9885] to-[#6A8572]`), white text, Feather icon, links to `/newentry`. Entire card clickable.
- Card B "Your Entries": Standard card bg, sage icon (BookOpen), entry count, links to `/entries`. Entire card clickable.
- Both: `min-h-[140px]`, `rounded-2xl`, hover lift `hover:-translate-y-0.5 hover:shadow-md`, `transition-all duration-250`.

**Section 3 — Writing Prompt of the Day:**
- Card: `bg-[--sage-50]`, `rounded-2xl`, `p-5`.
- Label: Overline style "TODAY'S PROMPT" with Lightbulb icon.
- Prompt text: Lora, `text-lg italic`, sage-700 / forest-200.
- Rotate from a static array of 30+ prompts based on `new Date().getDate()` (day of month).

**Section 4 — Recent Entries Preview:**
- Heading: Inter, `text-lg font-semibold`, "Recent Entries" + "View All" sage link aligned right.
- Show 2-3 most recent entries as compact cards: category color dot + title (Lora) + date + first ~80 chars preview truncated.
- Cards link to entry view.
- If no entries: "Your recent entries will appear here once you start writing." in muted text.

- [ ] **Step 3: Add the writing prompts data**

Create an array of 30+ prompts directly in Home.tsx (or a small constants file). Examples:
- "What is one thing that brought you unexpected joy this week?"
- "Describe a moment today when you felt truly present."
- "What are three things you're grateful for right now?"
- etc.

- [ ] **Step 4: Verify and commit**

Test the greeting changes at different times. Check entry count displays. Toggle themes.

```bash
git add Frontend/JournalFrontend/src/pages/Home.tsx
git commit -m "feat: redesign home dashboard — greeting, quick actions, prompts, recent entries"
```

---

## Task 6: Entries Page Redesign

**Files:**
- Modify: `Frontend/JournalFrontend/src/pages/EntriesPage.tsx`

**Depends on:** Task 1, Task 2

- [ ] **Step 1: Read EntriesPage.tsx**

- [ ] **Step 2: Redesign the page header and filter area**

- **Title**: Lora, `text-3xl md:text-4xl font-semibold`. Text: "Journal Entries"
- **Entry count**: Below title, `text-sm text-[--muted-foreground]`, "{count} entries"
- **Remove the thick `<Separator />`** — unnecessary visual weight.
- **Filter bar**: Horizontal flex, `gap-3`.
  - Category filter: Pill-shaped select trigger (`rounded-full`, `bg-[--muted]`), prefix with Filter icon.
  - Favorites toggle: Star icon + "Favorites" pill button. When active, fills gold.

- [ ] **Step 3: Redesign the entry cards**

Each card:
- `bg-[--card]`, `border border-[--border]`, `rounded-2xl`, `p-5`.
- **Left border accent**: `border-l-4` in category color (use `--category-personal`, `--category-work`, etc.).
- **Pin indicator**: If pinned, small pin icon in top-right corner, sage color.
- **Title**: Lora, `text-lg font-medium`, max 2 lines with `line-clamp-2`.
- **Category chip**: Pill badge with category color at 15% opacity bg, category color text. `text-xs font-semibold uppercase tracking-wider`.
- **Date**: `text-xs text-[--muted-foreground]`. Format: "Mar 22, 2026"
- **Footer**: Flex space-between. Left: favorite (star) + pin buttons, 36x36 touch targets. Right: View (ghost sage) + Delete (ghost destructive, muted until hover).
- **Hover**: `hover:-translate-y-0.5`, shadow `shadow-sm` → `shadow-md`, `transition-all duration-250`.
- Remove ALL `bg-zinc-800`, `dark:bg-white`, `border-neutral-800` hardcoded classes.

- [ ] **Step 4: Redesign the empty state**

- Centered, max-w-sm, `pt-20`.
- SVG illustration: simple line-art notebook in sage strokes (can be an inline SVG or use BookOpen icon at 48px in sage-300).
- Heading: Lora, `text-2xl font-semibold`. "Your journal awaits"
- Description: Inter, `text-base text-[--muted-foreground]`, centered. "This is where your thoughts and reflections will live. Start your first entry to begin your journaling journey."
- CTA: Primary sage button with PenLine icon. "Write your first entry"

- [ ] **Step 5: Redesign the no-results state**

- SearchX icon, 48px, sage-300.
- "No entries found" heading.
- "No entries match '{query}'. Try a different search term." in muted text.
- "Clear Search" ghost sage button.

- [ ] **Step 6: Add pagination UI**

Since the backend now supports pagination, add controls below the grid:
- Row of page number buttons, centered. Active page: sage-filled pill. Others: ghost.
- Previous/Next arrow buttons on either side.
- "Page X of Y" caption text.
- Wire up to the API with `page` and `pageSize` query params.

- [ ] **Step 7: Verify and commit**

Test with entries, without entries, with search, with filters, pagination. Both themes.

```bash
git add Frontend/JournalFrontend/src/pages/EntriesPage.tsx
git commit -m "feat: redesign entries page — card styling, filters, pagination, empty states"
```

---

## Task 7: New Entry and Edit Pages

**Files:**
- Modify: `Frontend/JournalFrontend/src/pages/NewEntryPage.tsx`
- Modify: `Frontend/JournalFrontend/src/pages/EditJournal.tsx`
- Modify: `Frontend/JournalFrontend/src/components/TextEditor/TextEditor.tsx`

**Depends on:** Task 1, Task 2

- [ ] **Step 1: Read all three files**

- [ ] **Step 2: Redesign the TextEditor component**

- Remove outer Card wrapper if present. Editor should blend into the page.
- Writing area: `min-h-[400px]`, padding `p-6`, `bg-[--background]` or slightly different, border `border-[--border]`, `rounded-xl`.
- Font: Inter, 17px (`text-[17px]`), weight 400, `leading-[1.7]`.
- Placeholder: "Start writing..." in muted italic.
- Focus: border transitions to sage, subtle sage glow.
- Toolbar: Ghost-style toggle buttons. Active state: `bg-[--sage-100]` with sage text (not `bg-black text-white`). Icons 18px. Add separator bars between button groups.

- [ ] **Step 3: Redesign NewEntryPage.tsx — the "Zen Writing Surface"**

- Remove outer card wrapper. The page IS the writing surface.
- Content max-width: `max-w-3xl` (760px), centered.
- Padding: `px-8 py-10` desktop, `px-4 py-6` mobile.

**Title input**: The star of the page.
- No visible border or background. Just a large text field.
- Lora, `text-3xl font-semibold`.
- Placeholder: "Give your entry a title..." in muted Lora.
- Bottom border only: subtle 1px `border-b border-[--border]`. Focus: border goes sage.

**Category selector**: Replace dropdown with pill-shaped chips.
- 4 category pills in a horizontal row: Personal, Work, Study, Travel.
- Each: `rounded-full`, `py-1.5 px-4`, border `border-[--border]`.
- Selected: bg = category color at 15% opacity, border = category color, text = category color.
- Unselected: transparent bg, muted border, muted text.

**Date display**: Auto "March 22, 2026" in caption style, muted.

**Submit area**: Primary sage button, full width at content max-width. Text: "Save Entry". Below: "Discard and go back" ghost link.

- [ ] **Step 4: Redesign EditJournal.tsx**

Identical layout to NewEntryPage with:
- Muted overline above title: "EDITING ENTRY"
- Pre-filled title, category, content.
- Footer: Two buttons side by side — "Save Changes" (primary) + "Cancel" (secondary/outlined). Equal width.
- Below buttons: "Delete this entry" destructive link with trash icon.

- [ ] **Step 5: Verify and commit**

Create a new entry, edit it, check both themes, check mobile responsiveness.

```bash
git add Frontend/JournalFrontend/src/pages/NewEntryPage.tsx Frontend/JournalFrontend/src/pages/EditJournal.tsx Frontend/JournalFrontend/src/components/TextEditor/TextEditor.tsx
git commit -m "feat: redesign writing experience — zen surface, pill categories, sage toolbar"
```

---

## Task 8: Entry View Modal and Profile Page

**Files:**
- Modify: `Frontend/JournalFrontend/src/components/Viewer/EntryView.tsx`
- Modify: `Frontend/JournalFrontend/src/pages/ProfilePage.tsx`
- Modify: `Frontend/JournalFrontend/src/components/AvatarPickerDrawer.tsx`
- Modify: `Frontend/JournalFrontend/src/components/dialog.tsx`

**Depends on:** Task 1, Task 2

- [ ] **Step 1: Read all four files**

- [ ] **Step 2: Redesign EntryView.tsx — the reading experience**

- Dialog max-width: `max-w-3xl` (720px), down from `max-w-5xl`.
- Background: `bg-[--background]`.
- Border radius: `rounded-[20px]`.
- Padding: `px-10 py-8` desktop, `px-6 py-6` mobile.
- Overlay: `bg-[--foreground]/50 backdrop-blur-sm`.

**Header:**
- Title: Lora, `text-2xl font-semibold`. Gets its own full line.
- Edit button: Positioned top-right as icon button (Pencil, ghost sage).
- Metadata row: Category pill + date created + date updated (if different). `text-sm text-[--muted-foreground]`.
- Separator: `border-t border-[--border] my-6`.

**Content:**
- Inter, 17px, `leading-[1.7]`. Paragraph spacing `[&>p]:mb-5`.
- Max height: `max-h-[85vh] overflow-y-auto`.

**Footer:**
- Subtle divider, then: Favorite toggle (star + text) on left, Edit + Delete buttons on right.

- [ ] **Step 3: Redesign ProfilePage.tsx**

- Content max-width: 600px, centered. No outer card.
- **Avatar section**: 96px avatar with `ring-4 ring-[--sage-200]`. "Change Avatar" ghost pill button below. Username in Lora `text-2xl` centered. Email in `text-sm text-[--muted-foreground]` centered.
- **Profile fields**: Each field = label (overline style) + value (body, font-medium) + pencil edit icon. 24px gap between fields. Separator lines between each.
- **Edit mode**: Input appears with sage focus ring. Save + Cancel small buttons.
- **Enhancement — Journal Stats**: Below fields, sage-50 card with 3 stat items: Total Entries, First Entry date, Most Active Category.

- [ ] **Step 4: Restyle AvatarPickerDrawer.tsx and dialog.tsx**

- Apply new card backgrounds, borders, border-radius to both.
- ProfileCompletionDialog: Warmer heading "Let's personalize your space". Buttons: "Set Up Now" (primary sage) + "Maybe Later" (ghost).

- [ ] **Step 5: Verify and commit**

Test viewing an entry, editing profile, changing avatar, profile completion dialog.

```bash
git add Frontend/JournalFrontend/src/components/Viewer/EntryView.tsx Frontend/JournalFrontend/src/pages/ProfilePage.tsx Frontend/JournalFrontend/src/components/AvatarPickerDrawer.tsx Frontend/JournalFrontend/src/components/dialog.tsx
git commit -m "feat: redesign entry view modal and profile page with sage theme"
```

---

## Task 9: Micro-interactions, Animations, and Polish

**Files:**
- Modify: `Frontend/JournalFrontend/src/index.css` (add keyframes)
- Modify: `Frontend/JournalFrontend/src/context/themeContext.tsx` (theme toggle animation)
- Modify: `Frontend/JournalFrontend/src/components/layouts/header.tsx` (theme toggle icon animation)
- Touch-ups across all previously modified files

**Depends on:** Tasks 1-8

- [ ] **Step 1: Add skeleton shimmer keyframe to index.css**

Sage-tinted shimmer animation for loading states. Ensure skeleton components use `bg-[--muted]` with the shimmer gradient sweeping `bg-[--card]`.

- [ ] **Step 2: Add theme toggle icon animation**

In the header theme toggle button:
- Current icon rotates out (opacity 1→0, rotate 0→180deg).
- New icon rotates in (opacity 0→1, rotate -180→0deg).
- Duration: 500ms. Use CSS transitions on the icon wrapper.

- [ ] **Step 3: Add favorite/pin toggle animations**

- Favorite star: On toggle active, scale pop `1 → 1.3 → 1` over 300ms with gold fill.
- Pin: On toggle active, tilt rotation `0 → -15deg → 0` over 300ms with sage fill.
- Use CSS transitions or inline style + setTimeout.

- [ ] **Step 4: Ensure card hover effects are consistent**

Across all card components (EntriesPage, Home dashboard):
- Hover: `hover:-translate-y-0.5`, shadow `shadow-sm` → `shadow-md`.
- Duration: 250ms ease-out.
- NO `hover:scale-102` anywhere (remove all instances).

- [ ] **Step 5: Button press feedback**

Primary buttons: `active:scale-[0.98]` transform. 100ms duration.

- [ ] **Step 6: Toast notification theming**

In the Sonner `<Toaster />` component (likely in App.tsx or main-layout), customize:
- Success: sage-tinted.
- Font: Inter.
- Border radius: 12px.
- Ensure `richColors` is still enabled but uses the new palette.

- [ ] **Step 7: Full visual audit**

Go through every page in both light and dark mode:
- Check for any remaining hardcoded colors (`bg-zinc-*`, `bg-gray-*`, `bg-white`, `bg-black`, `dark:bg-*`).
- Verify text readability and contrast.
- Check mobile responsiveness at 375px, 768px, 1024px widths.
- Ensure all interactive elements have visible focus states.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add micro-interactions, animations, and final polish pass"
```

---

## Task 10: Google Sign-In Button and Final Cleanup

**Files:**
- Modify: `Frontend/JournalFrontend/src/components/Auth/GoogleSignInButton.tsx`
- Modify: `Frontend/JournalFrontend/src/App.tsx` (if any route-level changes needed)
- Any remaining files with hardcoded old styles

**Depends on:** Tasks 1-9

- [ ] **Step 1: Style GoogleSignInButton to align with new card width**

Ensure the Google rendered button fits within the auth card width. May need wrapper adjustments.

- [ ] **Step 2: Final grep for old hardcoded classes**

Search for and remove all remaining instances of:
- `bg-zinc-*`, `bg-gray-*`, `bg-neutral-*`
- `dark:bg-white`, `dark:bg-black`, `bg-white`, `bg-black` (that aren't intentional)
- `font-extrabold` (replace with appropriate weights)
- `scale-150`, `scale-125` (the zoom hacks)
- `border-neutral-*`, `border-gray-*`

- [ ] **Step 3: Run type check**

```bash
cd Frontend/JournalFrontend && npx tsc --noEmit
```

Fix any TypeScript errors.

- [ ] **Step 4: Run existing tests**

```bash
cd Frontend/JournalFrontend && npx vitest run
```

Fix any test failures caused by changed component structure (update selectors, text content assertions, etc.).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete MindNest UI redesign — sage green, warm typography, calm aesthetic"
```

---

## Dependency Graph

```
Task 1 (Design System) ─────┬──> Task 2 (Layouts) ──┬──> Task 5 (Home)
                             │                       ├──> Task 6 (Entries)
                             │                       ├──> Task 7 (Write/Edit)
                             │                       └──> Task 8 (View/Profile)
                             │
                             ├──> Task 3 (Landing) ──────────────────────┐
                             │                                           │
                             └──> Task 4 (Auth Pages) ──────────────────>├──> Task 9 (Animations)
                                                                         │
                                                                         └──> Task 10 (Cleanup)
```

**Parallelizable groups:**
- After Task 1: Tasks 3 and 4 can run in parallel
- After Task 2: Tasks 5, 6, 7, and 8 can run in parallel
- Task 9 and 10 are sequential after all others complete
