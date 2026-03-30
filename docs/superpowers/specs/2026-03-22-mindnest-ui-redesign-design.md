# MindNest UI Redesign -- Full Design Specification

**Date:** 2026-03-22
**Status:** Approved for Implementation
**Vibe:** Modern & Calm -- Mindfulness-Inspired
**Inspiration:** Calm, Headspace, Craft
**Stack:** React 19 + TypeScript + Vite + shadcn/ui + Tailwind CSS v4

---

## Table of Contents

1. [Design System Foundation](#1-design-system-foundation)
   - [Color Palette](#11-color-palette)
   - [Typography Scale](#12-typography-scale)
   - [Spacing & Layout](#13-spacing--layout)
   - [Border Radius](#14-border-radius)
   - [Shadows](#15-shadows)
   - [Transitions](#16-transitions)
2. [Component Redesign](#2-component-redesign)
3. [Page-by-Page Redesign](#3-page-by-page-redesign)
4. [Micro-interactions & Animations](#4-micro-interactions--animations)
5. [Empty States & Onboarding](#5-empty-states--onboarding)
6. [Responsive Design Notes](#6-responsive-design-notes)
7. [Accessibility](#7-accessibility)

---

## 1. Design System Foundation

### 1.1 Color Palette

The current app uses pure black/white (`oklch(0 0 0)` / `oklch(1 0 0)`) with no color personality. The redesign introduces a warm, nature-inspired sage green palette with cream-tinted neutrals.

#### Primary -- Sage Green

| Token                 | Hex       | Usage                                       |
|-----------------------|-----------|---------------------------------------------|
| `--sage-50`           | `#F0F5F1` | Lightest tint, subtle backgrounds            |
| `--sage-100`          | `#D9E5DC` | Hover backgrounds, muted fills               |
| `--sage-200`          | `#B5CCBA` | Active sidebar items bg, chip backgrounds     |
| `--sage-300`          | `#93B59B` | Focus rings, secondary borders                |
| `--sage-400`          | `#7C9885` | **Primary accent** -- buttons, links, icons  |
| `--sage-500`          | `#6A8572` | Hover state for primary buttons               |
| `--sage-600`          | `#587260` | Active/pressed state for primary buttons      |
| `--sage-700`          | `#465C4D` | Dark accent text on light backgrounds         |
| `--sage-800`          | `#354839` | Dark mode primary text accent                 |
| `--sage-900`          | `#243326` | Deepest accent, dark mode heading accent      |

#### Light Mode -- Warm Neutrals

No pure whites or pure blacks. Everything has a subtle warm undertone.

| Token              | Hex       | Usage                                         |
|--------------------|-----------|-----------------------------------------------|
| `--cream-50`       | `#FDFCFA` | Page background (replaces `#FFFFFF`)           |
| `--cream-100`      | `#F8F6F1` | Card backgrounds, sidebar background           |
| `--cream-200`      | `#F0EDE5` | Input backgrounds, hover surfaces              |
| `--cream-300`      | `#E4DFD5` | Borders, dividers                              |
| `--cream-400`      | `#C9C2B4` | Muted borders, placeholder text (light)        |
| `--charcoal-50`    | `#8A8479` | Muted/secondary text                           |
| `--charcoal-100`   | `#6B665D` | Caption text, metadata                         |
| `--charcoal-200`   | `#4A463F` | Body text                                      |
| `--charcoal-300`   | `#2D2A25` | Heading text                                   |
| `--charcoal-400`   | `#1C1A17` | Primary text (replaces `#000000`)              |

#### Dark Mode -- Deep Forest

Dark mode backgrounds carry a green tint rather than being neutral gray or pure black.

| Token                    | Hex       | Usage                                      |
|--------------------------|-----------|---------------------------------------------|
| `--forest-950`           | `#0A120D` | Deepest background (page bg)                |
| `--forest-900`           | `#0F1A14` | Primary background                          |
| `--forest-800`           | `#1A2520` | Card backgrounds, sidebar                   |
| `--forest-700`           | `#243530` | Elevated surfaces, input backgrounds        |
| `--forest-600`           | `#2E4038` | Hover surfaces, borders                     |
| `--forest-500`           | `#3A5048` | Active surfaces, muted accent               |
| `--forest-400`           | `#4D665C` | Muted text                                  |
| `--forest-300`           | `#7C9885` | Sage accent in dark mode (glows softly)     |
| `--forest-200`           | `#A8C4AE` | Secondary text, links                       |
| `--forest-100`           | `#D4E2D7` | Primary text                                |
| `--forest-50`            | `#ECF2ED` | Heading text, high-emphasis text            |

#### Semantic Colors

| Purpose     | Light Mode  | Dark Mode   |
|-------------|-------------|-------------|
| Success     | `#4A9B6E`   | `#5BAF7E`   |
| Warning     | `#D4A843`   | `#E0B850`   |
| Error       | `#C75450`   | `#E06B67`   |
| Info        | `#5B8FB9`   | `#6FA3CC`   |

#### Category Colors

Each journal category gets a subtle accent for visual coding (used as left-border accent on cards, chip backgrounds):

| Category   | Light Accent  | Dark Accent   |
|------------|---------------|---------------|
| Personal   | `#B8A9D4`     | `#8B7AB3`     |
| Work       | `#A9C4D4`     | `#7AA3B8`     |
| Study      | `#D4C9A9`     | `#B8AD7A`     |
| Travel     | `#A9D4B8`     | `#7AB88B`     |

#### CSS Variable Mapping (shadcn conventions)

These replace the current `index.css` `:root` and `.dark` blocks. The current file uses `oklch()` values -- the redesign switches to hex for readability, but the implementer can convert to oklch if preferred.

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
  --muted-foreground: #8A8479;

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
}

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
}
```

---

### 1.2 Typography Scale

**Current problem:** System fonts, `font-extrabold` everywhere, no typographic hierarchy or warmth.

**Solution:** Lora (serif) for headings and entry titles to feel literary/journalistic. Inter (sans-serif) for body/UI to stay clean and readable.

#### Font Loading

Add to `index.html` or import in CSS:
```
Lora: weights 400, 500, 600, 700 (regular + italic)
Inter: weights 300, 400, 500, 600, 700
```

#### Type Scale

| Token          | Font    | Size (rem) | Size (px) | Weight    | Line Height | Letter Spacing | Usage                              |
|----------------|---------|------------|-----------|-----------|-------------|----------------|------------------------------------|
| `hero`         | Lora    | 3.5rem     | 56px      | 700 bold  | 1.1         | -0.02em        | Landing page headline              |
| `h1`           | Lora    | 2.25rem    | 36px      | 600 semi  | 1.2         | -0.015em       | Page titles (Entries, Home)         |
| `h2`           | Lora    | 1.75rem    | 28px      | 600 semi  | 1.25        | -0.01em        | Section headings                   |
| `h3`           | Lora    | 1.375rem   | 22px      | 500 med   | 1.3         | -0.005em       | Card titles, dialog titles         |
| `h4`           | Inter   | 1.125rem   | 18px      | 600 semi  | 1.35        | 0              | Sub-section headings               |
| `body-lg`      | Inter   | 1.0625rem  | 17px      | 400 reg   | 1.7         | 0              | Journal entry reading view         |
| `body`         | Inter   | 0.9375rem  | 15px      | 400 reg   | 1.65        | 0              | Default body text                  |
| `body-sm`      | Inter   | 0.875rem   | 14px      | 400 reg   | 1.6         | 0.005em        | Secondary text, metadata           |
| `caption`      | Inter   | 0.75rem    | 12px      | 500 med   | 1.5         | 0.01em         | Timestamps, labels, badges         |
| `overline`     | Inter   | 0.6875rem  | 11px      | 600 semi  | 1.4         | 0.06em         | Category labels, uppercase accents |

#### Weight Usage Guide

| Weight           | When to Use                                                |
|------------------|------------------------------------------------------------|
| 300 (Light)      | Large display text only (hero subtitle), never for body    |
| 400 (Regular)    | Body text, input values, descriptions                      |
| 500 (Medium)     | Card titles, nav items, labels, emphasis within body       |
| 600 (Semibold)   | Page headings, button text, section headers                |
| 700 (Bold)       | Hero headline only, sparingly for maximum emphasis         |

#### Implementation Notes

- All headings: `font-family: 'Lora', Georgia, serif`
- All body/UI: `font-family: 'Inter', system-ui, -apple-system, sans-serif`
- Remove all instances of `font-extrabold` throughout the app (currently used excessively)
- Journal entry content in the reading view (EntryView modal) should use `body-lg` for comfortable reading
- The text editor writing area should use `body-lg` as well

---

### 1.3 Spacing & Layout

**Base unit:** `4px` (0.25rem). All spacing should be multiples of this unit.

#### Spacing Scale

| Token   | Value   | Usage                                     |
|---------|---------|-------------------------------------------|
| `xs`    | 4px     | Tight gaps (icon to label)                |
| `sm`    | 8px     | Input padding-y, small gaps               |
| `md`    | 12px    | Button padding-x, card internal gaps      |
| `base`  | 16px    | Standard gap, card padding-y              |
| `lg`    | 24px    | Section gaps, card padding-x              |
| `xl`    | 32px    | Between major sections                    |
| `2xl`   | 48px    | Page-level vertical spacing               |
| `3xl`   | 64px    | Hero section padding                      |
| `4xl`   | 96px    | Landing page vertical rhythm              |

#### Content Widths

| Context                    | Max Width  | Tailwind Class     |
|----------------------------|------------|--------------------|
| Reading content (entries)  | 680px      | `max-w-[680px]`    |
| Form content (new/edit)    | 760px      | `max-w-3xl`        |
| Dashboard content area     | 1080px     | `max-w-5xl`        |
| Full-width (entries grid)  | 1200px     | `max-w-6xl`        |
| Auth cards (login/signup)  | 440px      | `max-w-[440px]`    |

#### Page Padding

- **Desktop:** `px-8 py-10` (32px horizontal, 40px vertical)
- **Tablet:** `px-6 py-8` (24px horizontal, 32px vertical)
- **Mobile:** `px-4 py-6` (16px horizontal, 24px vertical)

#### Card Padding

- **Standard cards** (entry cards): `p-5` (20px)
- **Large cards** (editor, profile): `px-8 py-6` (32px x 24px)
- **Auth cards**: `px-8 py-8` (32px all around)

---

### 1.4 Border Radius

**Philosophy:** Generous, soft, friendly. Nothing sharp. Everything feels approachable.

| Element               | Radius           | Tailwind          |
|-----------------------|------------------|-------------------|
| Buttons               | 10px             | `rounded-[10px]`  |
| Cards                 | 16px             | `rounded-2xl`     |
| Inputs / Selects      | 10px             | `rounded-[10px]`  |
| Modals / Dialogs      | 20px             | `rounded-[20px]`  |
| Avatars               | Full circle      | `rounded-full`    |
| Chips / Badges        | Full pill        | `rounded-full`    |
| Sidebar               | 0 (flush left)   | `rounded-none`    |
| Tooltip                | 8px              | `rounded-lg`      |
| Images in cards       | 12px             | `rounded-xl`      |

**Update `--radius` in CSS:** Change from `0.625rem` to `0.75rem` (12px base).

---

### 1.5 Shadows

**Current problem:** `shadow-lg` and `shadow-xl` used with default Tailwind gray. Looks harsh.

**Solution:** Warm-toned, layered shadows using the cream/sage tones. Never use stark gray drop shadows.

#### Shadow Scale

```css
/* Light Mode */
--shadow-sm: 0 1px 3px rgba(44, 42, 37, 0.04), 0 1px 2px rgba(44, 42, 37, 0.06);
--shadow-md: 0 4px 12px rgba(44, 42, 37, 0.06), 0 2px 4px rgba(44, 42, 37, 0.04);
--shadow-lg: 0 12px 32px rgba(44, 42, 37, 0.08), 0 4px 8px rgba(44, 42, 37, 0.04);
--shadow-xl: 0 24px 48px rgba(44, 42, 37, 0.10), 0 8px 16px rgba(44, 42, 37, 0.05);

/* Sage glow (for focus rings and accents) */
--shadow-sage-glow: 0 0 0 3px rgba(124, 152, 133, 0.25);
--shadow-sage-glow-lg: 0 0 20px rgba(124, 152, 133, 0.15);

/* Dark Mode */
--shadow-sm-dark: 0 1px 3px rgba(0, 0, 0, 0.20), 0 1px 2px rgba(0, 0, 0, 0.12);
--shadow-md-dark: 0 4px 12px rgba(0, 0, 0, 0.24), 0 2px 4px rgba(0, 0, 0, 0.12);
--shadow-lg-dark: 0 12px 32px rgba(0, 0, 0, 0.30), 0 4px 8px rgba(0, 0, 0, 0.15);

/* Sage glow in dark mode -- slightly brighter */
--shadow-sage-glow-dark: 0 0 0 3px rgba(124, 152, 133, 0.35);
--shadow-sage-glow-lg-dark: 0 0 24px rgba(124, 152, 133, 0.20);
```

#### Usage Guide

| Element            | Shadow    |
|--------------------|-----------|
| Cards at rest      | `sm`      |
| Cards on hover     | `md`      |
| Header (sticky)    | `sm`      |
| Modals / Dialogs   | `xl`      |
| Dropdown menus     | `lg`      |
| Focus rings        | `sage-glow` |
| Floating sidebar   | `lg`      |

---

### 1.6 Transitions

**Standard easing:** `cubic-bezier(0.25, 0.1, 0.25, 1)` (equivalent to Tailwind `ease-out`)

| Type                   | Duration  | Easing                         | Tailwind                                    |
|------------------------|-----------|--------------------------------|---------------------------------------------|
| Hover (color, bg)      | 200ms     | ease-out                       | `transition-colors duration-200`            |
| Hover (shadow, scale)  | 250ms     | ease-out                       | `transition-all duration-250 ease-out`      |
| Focus ring appear      | 150ms     | ease-out                       | `transition duration-150`                   |
| Sidebar slide          | 300ms     | `cubic-bezier(0.16, 1, 0.3, 1)` | Custom spring-like ease                   |
| Modal overlay fade     | 200ms     | ease-out                       | `duration-200`                              |
| Modal scale in         | 300ms     | `cubic-bezier(0.16, 1, 0.3, 1)` | Spring-like for dialog entrance           |
| Page content fade      | 300ms     | ease-in-out                    | `duration-300 ease-in-out`                  |
| Theme toggle (icon)    | 500ms     | ease-in-out                    | Rotate + cross-fade                         |
| Skeleton shimmer       | 1.5s      | ease-in-out, infinite          | Keyframe animation                          |
| Card hover lift        | 250ms     | ease-out                       | `transition-all duration-250`               |

---

## 2. Component Redesign

### 2.1 Buttons

**Current problem:** Using default shadcn black/white buttons with inline `bg-black text-white dark:bg-white dark:text-black`. No brand personality.

#### Primary Button (Sage Filled)

- **Background:** `#7C9885` (--primary)
- **Text:** `#FFFFFF`
- **Border:** none
- **Border radius:** 10px
- **Padding:** `10px 20px` (`py-2.5 px-5`)
- **Font:** Inter, 15px (body), weight 600
- **Hover:** Background darkens to `#6A8572`, shadow transitions to `shadow-md`
- **Active/Pressed:** Background to `#587260`, scale `0.98`
- **Focus:** `shadow-sage-glow` ring (3px sage at 25% opacity)
- **Disabled:** Opacity 0.5, cursor not-allowed
- **Dark mode:** Same sage fill, text `#ECF2ED`

#### Secondary Button (Sage Outlined)

- **Background:** transparent
- **Border:** 1.5px solid `#B5CCBA` (sage-200)
- **Text:** `#6A8572` (sage-500)
- **Hover:** Background `#F0F5F1` (sage-50), border `#7C9885`
- **Active:** Background `#D9E5DC` (sage-100)
- **Dark mode border:** `#3A5048`, text `#A8C4AE`, hover bg `#243530`

#### Ghost Button

- **Background:** transparent
- **Text:** `#4A463F` (charcoal-200)
- **Hover:** Background `#F0EDE5` (cream-200)
- **Dark mode:** Text `#D4E2D7`, hover bg `#243530`

#### Destructive Button

- **Background:** `#C75450`
- **Text:** `#FFFFFF`
- **Hover:** `#B34440`
- **Dark mode:** `#E06B67`, text `#1A2520`

#### Link Button

- **Background:** transparent, no border
- **Text:** `#7C9885` (sage primary)
- **Hover:** Underline + darken to `#587260`
- **Transition:** Color 200ms

### 2.2 Cards

**Current problem:** `bg-zinc-800 dark:bg-white` with `border-neutral-800`. Inverted color scheme, no warmth, no personality.

#### Redesigned Cards

- **Background:** `#F8F6F1` (cream-100) | Dark: `#1A2520` (forest-800)
- **Border:** 1px solid `#E4DFD5` (cream-300) | Dark: 1px solid `#2E4038`
- **Border radius:** 16px (`rounded-2xl`)
- **Shadow at rest:** `shadow-sm` (warm-toned)
- **Shadow on hover:** `shadow-md` (lifts gently)
- **Padding:** 20px (`p-5`)
- **Hover transform:** `translateY(-2px)` over 250ms ease-out. No `scale` transform (the current `hover:scale-102` creates a jumpy feel).
- **Transition:** `transition-all duration-250 ease-out` for shadow + transform

#### Entry Cards (on Entries Page) -- Additional Treatments

- **Left border accent:** 4px solid, colored by category (see Category Colors above)
- **Title:** Lora, h3 size (22px), weight 500, color `--charcoal-300` / `--forest-50`
- **Category label:** Overline style (11px, uppercase, semibold, Inter), color matches category
- **Date:** Caption style (12px), muted foreground
- **Favorite star:** When active, filled with `#D4A843` (warm gold). When inactive, stroke only in muted color
- **Pin icon:** When active, filled with sage primary `#7C9885`. When inactive, stroke only in muted color
- **Action buttons (View/Delete):** Placed in card footer. View = ghost style with sage accent text. Delete = ghost style with error color text. Both show on hover or always visible on mobile.

### 2.3 Inputs

**Current problem:** Default styling with inline `bg-white dark:bg-zinc-700`. Error states use bare `border-red-500`.

#### Redesigned Inputs

- **Background:** `#F0EDE5` (cream-200) | Dark: `#243530` (forest-700)
- **Border:** 1.5px solid `#E4DFD5` (cream-300) | Dark: `#2E4038`
- **Border radius:** 10px
- **Padding:** `10px 14px` (`py-2.5 px-3.5`)
- **Text:** `--foreground` (charcoal-400 / forest-100)
- **Placeholder:** `#C9C2B4` (cream-400) | Dark: `#4D665C` (forest-400)
- **Focus:** Border changes to `#7C9885` (sage-400) + `shadow-sage-glow` ring. Background lightens slightly to `#F8F6F1` / Dark: `#2E4038`
- **Error state:** Border `#C75450` + faint red glow `0 0 0 3px rgba(199, 84, 80, 0.15)`. Use `text-[#C75450]` for error messages below. Do NOT change input background on error.
- **Disabled:** Opacity 0.5, background `#F0EDE5` with no interaction

#### Select / Dropdown Trigger

Same styling as inputs. The dropdown chevron icon uses `--muted-foreground`. On open, the trigger gets the same sage focus ring as inputs.

### 2.4 Sidebar

**Current problem:** `bg-white dark:bg-gray-900` with no personality. Icons are oversized (up to `h-12 w-12`). Active state uses default accent.

#### Redesigned Sidebar

- **Background:** `#F8F6F1` (cream-100) | Dark: `#1A2520` (forest-800)
- **Border right:** 1px solid `#E4DFD5` | Dark: `#2E4038`
- **Width:** 256px (keep `w-64`)
- **Shadow:** `shadow-lg` when floating on mobile overlay
- **Top padding:** 24px (`pt-6`)

#### Navigation Items

- **Height:** 44px (accessible touch target)
- **Padding:** `py-2.5 px-4`
- **Border radius:** 10px (with 8px horizontal margin from sidebar edges, so items are inset)
- **Icon size:** 20px (`h-5 w-5`) -- significantly smaller than current 32-48px
- **Text:** Inter, 15px, weight 500
- **Gap (icon to text):** 12px

##### States

| State     | Background           | Text Color        | Icon Color        |
|-----------|----------------------|-------------------|-------------------|
| Default   | transparent          | `--charcoal-200`  | `--charcoal-50`   |
| Hover     | `#F0F5F1` (sage-50)  | `--charcoal-300`  | `--sage-400`      |
| Active    | `#D9E5DC` (sage-100) | `--sage-700`      | `--sage-400`      |

Dark mode active: bg `#2E4038`, text `#D4E2D7`, icon `#7C9885`

### 2.5 Header

**Current problem:** `bg-white dark:bg-gray-900` with `border-gray-200`. Generic top bar with no visual interest.

#### Redesigned Header

- **Height:** 64px (`h-16`)
- **Background:** `rgba(253, 252, 250, 0.85)` with `backdrop-blur-lg` (frosted glass on scroll) | Dark: `rgba(15, 26, 20, 0.85)` with `backdrop-blur-lg`
- **Border bottom:** 1px solid `#E4DFD5` at 60% opacity | Dark: `#2E4038` at 60%
- **Position:** `sticky top-0 z-50`
- **Padding:** `px-6` desktop, `px-4` mobile

#### Header Logo

- Replace the `font-extrabold` text "MindNest" with the app logo image (already available as `MindNestLogoDark.png` / `MindNestLogoLight.png`), sized to `h-8`. Alternatively, keep as text but use Lora, 20px, weight 600, color sage-700 / forest-200.

#### Search Bar

- **Width:** Flexible, `max-w-md` centered in header
- **Background:** `#F0EDE5` | Dark: `#243530`
- **Border:** 1px solid transparent (shows border on focus only)
- **Border radius:** full pill (`rounded-full`)
- **Padding:** `py-2 pl-10 pr-10` (space for search icon left, clear button right)
- **Search icon:** `#C9C2B4` muted | Dark: `#4D665C`
- **Focus:** Border `#B5CCBA`, subtle sage glow

#### Theme Toggle

- Use a smooth icon cross-fade: Sun icon rotates out 180deg as Moon rotates in (or vice versa)
- Button: ghost style, 40x40px, `rounded-full`
- Icon color: `--charcoal-100` | Dark: `--forest-200`

#### User Dropdown Trigger

- Avatar (32px, `rounded-full`) + name text (Inter, 14px, medium) + chevron
- Hover: Subtle `bg-cream-200` / Dark: `bg-forest-700`
- Keep existing dropdown content, restyle with sage accent for items

### 2.6 Dialogs / Modals

**Current problem:** Default shadcn dialog with `bg-white dark:bg-zinc-800`. The EntryView dialog uses `sm:max-w-5xl` which is very wide.

#### Redesigned Dialogs

- **Overlay:** `rgba(28, 26, 23, 0.5)` with `backdrop-blur-sm` (4px) | Dark: `rgba(10, 18, 13, 0.6)` with `backdrop-blur-sm`
- **Card background:** `#FDFCFA` | Dark: `#1A2520`
- **Border:** 1px solid `#E4DFD5` | Dark: `#2E4038`
- **Border radius:** 20px
- **Shadow:** `shadow-xl`
- **Max width (entry view):** `max-w-3xl` (down from 5xl -- content should be optimally readable, not wide)
- **Max width (confirmations):** `max-w-md`
- **Padding:** `px-8 py-8` for reading dialogs, `px-6 py-6` for small dialogs
- **Animation:** Scale from 0.95 to 1.0 + fade in, with the spring-like easing over 300ms

### 2.7 Skeleton Loaders

**Current problem:** Default gray shimmer with no brand connection.

#### Redesigned Skeletons

- **Base color:** `#F0EDE5` (cream-200) | Dark: `#243530` (forest-700)
- **Shimmer highlight:** `#F8F6F1` (cream-100) | Dark: `#2E4038` (forest-600)
- **Animation:** Shimmer sweep from left to right, 1.5s duration, ease-in-out, infinite
- **Border radius:** Match the element they represent (cards get card radius, text gets 6px, avatar gets full)
- **Subtle sage tint:** Add a very faint `rgba(124, 152, 133, 0.05)` overlay to the shimmer for brand warmth

---

## 3. Page-by-Page Redesign

### 3.1 Landing Page

**File:** `LandingPage.tsx`

**Current state:** Dark gradient bg (`radial-gradient(ellipse_at_top, #374151, #0f172a, #000000)`), centered `text-7xl font-extrabold`, single button. No sections, no personality, no information.

#### Redesigned Layout

**Full-viewport hero section** -- no scrolling needed (single-section landing).

##### Background

- **Light mode:** Soft gradient from `#FDFCFA` at top to `#F0F5F1` (sage-50) at bottom. Layer a very subtle, large-scale radial gradient of sage (`rgba(124, 152, 133, 0.08)`) emanating from center-top.
- **Dark mode:** Gradient from `#0F1A14` to `#0A120D`. Subtle radial glow of sage (`rgba(124, 152, 133, 0.06)`) from center.
- **Optional ambient element:** A single, very subtle CSS animated blob or gradient orb (sage-tinted, very low opacity ~5%) that slowly drifts, creating a living background. Keep it minimal -- this is not a psychedelic experience, just a hint of life.

##### Content (centered, vertically and horizontally)

1. **MindNest logo** -- the image asset, sized `h-16` to `h-20`, centered above the heading. Use the appropriate dark/light version.

2. **Heading:** Lora, hero size (56px / 3.5rem), weight 700, color `--charcoal-400` / `--forest-50`.
   Text: **"Your thoughts deserve a beautiful home."**
   Use `text-balance` for wrapping.

3. **Subtitle:** Inter, body-lg (17px), weight 400, color `--charcoal-50` / `--forest-200`, max-width 480px, centered.
   Text: "A calm, private space to journal your days, reflect on your journey, and grow."

4. **CTA Button:** Primary sage button, slightly larger than standard (`py-3 px-8`, text 16px).
   Text: "Start Journaling"
   Below the button, a subtle link: "Already have an account? Log in" (link style, sage color)

5. **Spacing:** 24px between logo and heading, 16px between heading and subtitle, 32px between subtitle and CTA, 12px between CTA and login link.

##### What Makes It Feel Welcoming and Premium

- The warm off-white/cream background immediately signals this is not a cold SaaS tool
- The serif heading gives it a literary, journal-like quality
- The generous whitespace and centered single-column layout creates calm focus
- No clutter, no feature grids, no screenshots -- just a warm invitation
- The subtle ambient background movement adds life without distraction

---

### 3.2 Login Page

**File:** `AuthPages/LoginPage.tsx`

**Current state:** Centered card with `scale-150` (CSS zoom hack), basic inputs, `bg-gray-200` divider for "or".

#### Redesigned Layout

**Centered card approach** (not split layout -- keep it simple for a journaling app).

##### Page Background

Same as landing page: cream-to-sage gradient (light) or forest gradient (dark). This creates visual continuity from landing to auth.

##### Auth Card

- **Max width:** 440px
- **Background:** `#FDFCFA` / Dark: `#1A2520`
- **Border:** 1px solid `#E4DFD5` / Dark: `#2E4038`
- **Border radius:** 20px
- **Shadow:** `shadow-lg`
- **Padding:** `px-8 py-8`
- **Remove the `scale-150`** -- it causes layout issues. Size the card properly instead.

##### Card Content (top to bottom)

1. **Logo:** MindNest logo, `h-12`, centered. 16px margin below.

2. **Heading:** Lora, h2 (28px), weight 600, centered.
   Text: "Welcome back"

3. **Description:** Inter, body-sm (14px), muted foreground, centered. 24px margin below.
   Text: "Sign in to continue your journal"

4. **Form fields** (24px gap between fields):
   - **Label:** Inter, caption (12px), weight 600, uppercase, letter-spacing 0.06em, color `--charcoal-50` / `--forest-400`. Position above input with 6px gap.
   - **Email/Username input:** Full redesigned input style (see Section 2.3)
   - **Password input:** Same style, with show/hide toggle icon inside (eye icon, right-aligned)

5. **Error messages:** Below each input, Inter 13px, color `#C75450` / `#E06B67`, with a small warning icon inline. General error (wrong credentials) appears as a subtle banner above the submit button: `bg-[#C75450]/10` with `border-l-4 border-[#C75450]` and error text.

6. **Submit button:** Full-width primary sage button.
   Text: "Sign In" (loading state: "Signing in..." with a small spinner icon)

7. **Divider:** Horizontal rule with "or" text centered. Line color `#E4DFD5` / `#2E4038`. Text: Inter, 12px, muted foreground.

8. **Google OAuth button:** Full width. Keep Google's rendered button but ensure it visually aligns with the card width.

9. **Switch link:** Below everything, centered.
   Text: "Don't have an account?" + "Sign up" (sage link). Inter, 14px.

##### Warm Touches

- The card has a very subtle inner glow (inset shadow) of `rgba(124, 152, 133, 0.04)` to give it a warm feel
- Inputs have generous padding so the form feels spacious, not cramped
- Field-level validation appears gently (fade in 200ms), not jarring

---

### 3.3 Signup Page

**File:** `AuthPages/SignupPage.tsx`

**Current state:** Same card style as login, `scale-125`, 8 fields crammed into a small card.

#### Redesigned Layout

Follows the same centered-card approach as login, but the card is taller due to more fields.

##### Differences from Login

- **Max width:** 480px (slightly wider to accommodate 2-column name/date rows)
- **Heading:** "Create your journal"
- **Description:** "Sign up to start capturing your thoughts"

##### Form Field Layout

- **Row 1:** First Name + Last Name (2 columns, equal width)
- **Row 2:** Gender (select) + Date of Birth (date input) (2 columns)
- **Row 3:** Email (full width)
- **Row 4:** Username (full width)
- **Row 5:** Password (full width)
- **Row 6:** Confirm Password (full width)

Gap between rows: 16px. Gap within 2-column rows: 12px.

##### Password Strength Indicator (Enhancement)

Below the password field, add a simple strength bar:
- 4 small horizontal segments
- Colors: 1 segment = red, 2 = orange, 3 = yellow-sage, 4 = full sage green
- Text below: "Weak", "Fair", "Good", "Strong" in the corresponding color
- Requirements text in muted caption style: "8+ characters, one number, one special character"

##### Transition Between Login/Signup

When navigating between `/login` and `/signup`, the card content should cross-fade (opacity 0 to 1 over 250ms). The card shell itself stays in place. This creates a smooth feel rather than a full page reload.

---

### 3.4 Home Dashboard

**File:** `Home.tsx`

**Current state:** Logo + "Hello {username}, Welcome to MindNest." in `text-7xl font-extrabold` + 3 static feature cards (Read Entries, Write New, Track Progress) with `bg-zinc-800 dark:bg-white`. No actual functionality, just static marketing-style cards.

#### Redesigned Layout

The home page becomes a **true dashboard** -- functional, personalized, and encouraging.

##### Layout Structure

Content max-width: `max-w-5xl`, centered. Vertical stack with generous spacing (48px between sections).

##### Section 1: Personalized Greeting

- **Time-aware greeting:** Display based on current hour:
  - 5am-11am: "Good morning, {firstName}"
  - 12pm-4pm: "Good afternoon, {firstName}"
  - 5pm-8pm: "Good evening, {firstName}"
  - 9pm-4am: "Good night, {firstName}"
- **Typography:** Lora, h1 (36px), weight 600, color `--charcoal-300` / `--forest-50`
- **Subtitle:** Inter, body (15px), muted foreground. Contextual messages:
  - If 0 entries: "Ready to start your journaling journey?"
  - If entries exist: "You have {count} journal entries. Keep writing!"
- **Date display:** Below greeting, Inter, body-sm (14px), muted.
  Format: "Saturday, March 22, 2026"

##### Section 2: Quick Actions (replaces the 3 static cards)

A horizontal row of 2 cards (not 3 -- "Track Progress" has no functionality, so remove it).

**Card A: "Write Today's Entry"** (Primary CTA)
- **Background:** Sage gradient (`#7C9885` to `#6A8572`)
- **Text:** White
- **Icon:** Feather/pen icon (Lucide `Feather`), 28px, top-left of card
- **Title:** Lora, h3, "Start Writing"
- **Description:** Inter, body-sm, "Capture what's on your mind"
- **Entire card is clickable** -- links to `/newentry`
- **Hover:** Slight lift + shadow-md
- **Size:** Equal width with Card B, min-height 140px

**Card B: "View All Entries"**
- **Background:** `--card` (cream-100 / forest-800)
- **Border:** 1px solid `--border`
- **Icon:** BookOpen, 28px, sage color
- **Title:** Lora, h3, "Your Entries"
- **Description:** Inter, body-sm, muted. "{count} entries" dynamically
- **Entire card is clickable** -- links to `/entries`
- **Hover:** Same lift treatment

##### Section 3: Writing Prompt of the Day (New Feature)

A simple card that displays an inspirational/reflective prompt to encourage writing.

- **Background:** `#F0F5F1` (sage-50) | Dark: `#243530`
- **Border:** none (or 1px `#D9E5DC`)
- **Border radius:** 16px
- **Icon:** Lightbulb or Sparkles (Lucide), sage-400, 20px
- **Label:** Overline style, "TODAY'S PROMPT"
- **Prompt text:** Lora, body-lg (17px), italic, weight 400, sage-700 / forest-200.
  Example: "What is one thing that brought you unexpected joy this week?"
- **Implementation note:** Rotate from a static list of 30+ prompts based on day-of-year. No backend needed.

##### Section 4: Recent Entries Preview

Show the 2-3 most recent journal entries as compact cards.

- **Section heading:** Inter, h4, "Recent Entries", with a "View All" link (sage link) aligned right
- **Cards:** Compact version of entry cards:
  - Category color dot (8px circle) + category label
  - Title: Lora, h3 size but at 18px (slightly smaller)
  - Date: Caption style
  - First ~80 characters of content as preview text, truncated with ellipsis
  - No action buttons on these cards -- just click to open EntryView
- **Layout:** Vertical stack (1 column) for a clean reading flow, or 2 columns on wide screens

##### Profile Completion Dialog

Keep existing behavior (shows once per session if profile incomplete), but restyle:
- Use the redesigned dialog styles
- Add a friendly illustration or icon (user-circle with a progress ring)
- Warmer language: "Let's make this space yours" instead of "Complete Your Profile"

---

### 3.5 Entries Page

**File:** `EntriesPage.tsx`

**Current state:** `text-6xl font-bold` title, black category dropdown, `bg-zinc-800 dark:bg-white` cards in 3-column grid, thick separator line.

#### Redesigned Layout

##### Page Header Area

- **Title:** Lora, h1 (36px), weight 600.
  Text: "Journal Entries" (drop the possessive "{username}'s" -- the user knows whose entries these are)
- **Below title (8px gap):** Muted body-sm text showing entry count: "{count} entries"
- **Remove the thick `Separator`** -- it is heavy and unnecessary. The filter bar below creates enough visual separation.

##### Filter & Search Bar

A cohesive horizontal bar below the title, containing the category filter and view options.

- **Layout:** Horizontal flex, `gap-3`, items vertically centered
- **Category filter:** Redesigned select trigger:
  - Pill-shaped (`rounded-full`)
  - Background: `--muted` (cream-200 / forest-700)
  - Text: body-sm, weight 500
  - Prefix with a filter icon (Lucide `Filter`)
  - Active category shown as a pill/chip with category color dot
- **Favorites filter:** A separate toggle button (star icon + "Favorites"). When active, fills with gold. Pill-shaped.
- **View toggle (Enhancement):** Grid icon / List icon toggle. Default: grid. List view shows entries as single-column rows (title, category, date, excerpt on one line each).
- **Total vertical space from page title to first card:** ~80px

##### Entry Cards Grid

- **Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`
- **Card structure** (top to bottom within each card):
  1. **Category accent:** 4px left border in the category's assigned color (see Category Colors). This adds visual variety to the grid.
  2. **Pin indicator:** If pinned, show a small pin icon in the top-right corner of the card, rotated 45deg, sage color
  3. **Title:** Lora, h3 (22px), weight 500, max 2 lines with ellipsis truncation
  4. **Category chip:** Pill-shaped badge, background = category color at 15% opacity, text = category color. Overline style (11px, uppercase, semibold).
  5. **Date:** Caption style (12px), muted foreground. Format: "Mar 22, 2026"
  6. **Card footer:** Horizontal flex, space-between.
     - **Left:** Favorite button (star icon, toggles gold fill) + Pin button (pin icon, toggles sage fill). Both 36x36px touch targets.
     - **Right:** "View" ghost button (sage text) + "Delete" ghost button (destructive text, muted until hover).

##### Hover State

- Card lifts `translateY(-2px)`, shadow transitions from `shadow-sm` to `shadow-md`
- Action buttons (View/Delete) can increase opacity from 70% to 100% on card hover (always visible on mobile)

##### Pagination UI

Since the backend now supports pagination, add pagination controls below the grid:

- **Style:** A row of page number buttons, centered
- **Active page:** Sage-filled pill (primary button style, small size)
- **Other pages:** Ghost buttons
- **Previous/Next:** Arrow buttons on either side
- **Info text:** "Page 1 of 5" in caption style, muted foreground
- **Spacing:** 32px above pagination from the last card row

##### Empty State (Zero Entries)

See Section 5.1 for detailed empty state design.

##### No Search Results State

See Section 5.3 for detailed design.

---

### 3.6 New Entry Page

**File:** `NewEntryPage.tsx`

**Current state:** `w-7xl` card with `bg-zinc-100 dark:bg-zinc-800`, cramped 3-column grid for title/category/blank, `font-extrabold` heading.

#### Redesigned Layout -- The Zen Writing Experience

The new entry page should feel like opening a fresh page in a beautiful journal. Minimize chrome, maximize writing space.

##### Page Structure

No outer card wrapper. The page itself IS the writing surface.

- **Background:** `--background` (cream / forest) -- the full page
- **Content max-width:** 760px (`max-w-3xl`), centered
- **Padding:** `px-8 py-10` desktop, `px-4 py-6` mobile

##### Top Area (Title & Metadata)

1. **Title input:** This is the star of the page.
   - **No visible border or background** -- just a large text field
   - **Font:** Lora, 32px (between h1 and h2), weight 600
   - **Placeholder:** "Give your entry a title..." in muted foreground, same Lora font
   - **Bottom border only:** A subtle 1px line in `--border` color beneath the input, like a ruled journal line
   - **Focus:** The bottom border transitions to sage color

2. **Category selector** (below title, 12px gap):
   - **Redesigned as pill-shaped chips** instead of a dropdown:
     - Display all 4 categories as selectable pills in a horizontal row
     - Each pill: `rounded-full`, padding `py-1.5 px-4`, border 1.5px solid `--border`
     - **Unselected:** Background transparent, border color `--border`, text muted
     - **Selected:** Background = category color at 15% opacity, border = category color, text = category color (stronger shade)
     - **Hover (unselected):** Background `--muted`
   - Include a clear option: an "x" icon appears inside the selected pill to deselect

3. **Date display** (read-only, right-aligned or below category):
   - Auto-populated with today's date
   - Caption style, muted foreground: "March 22, 2026"

##### Writing Area

4. **Text editor:**
   - **Remove the outer Card wrapper** from the TextEditor component. The editor should blend into the page.
   - **Writing area background:** Very slightly lighter/different from page bg: `#FDFCFA` / Dark: `#1A2520` (or even transparent)
   - **Minimum height:** 400px (taller than current 300px)
   - **Padding inside editor:** `p-6` for generous breathing room
   - **Font:** Inter, body-lg (17px), weight 400, line-height 1.7 -- comfortable writing
   - **Placeholder:** "Start writing..." in muted italic
   - **Border:** 1px solid `--border`, `rounded-xl` (12px)
   - **Focus:** Border transitions to sage, very subtle sage glow

5. **Toolbar (formatting):**
   - Position it above the writing area (keep current position)
   - **Style:** Use ghost-style toggle buttons. Active state: sage-filled (not black/white)
   - **Active toggle:** `bg-sage-100` with sage text, not `bg-black text-white`
   - Icons: 18px
   - Group the bold/italic/underline together, undo/redo together, clear separately
   - Add subtle separator bars between groups (1px vertical line, `--border` color)

##### Footer

6. **Submit area:**
   - **Primary button:** Full width (at the content max-width), sage filled.
     Text: "Save Entry" (more natural than "Submit")
   - **Below button:** Ghost link "Discard and go back" in muted text
   - **Spacing:** 32px above the button from the editor

---

### 3.7 Edit Journal Page

**File:** `EditJournal.tsx`

**Current state:** Identical to new entry page with prefilled data.

#### Redesigned Layout

Identical layout to the New Entry page (Section 3.6), with these differences:

- **Page heading (optional):** A small, muted overline above the title: "EDITING ENTRY"
- **Title input:** Pre-filled, same style
- **Category pills:** Pre-selected
- **Editor:** Pre-filled with content
- **Footer buttons:** Two buttons side by side:
  - **Primary:** "Save Changes" (sage filled)
  - **Secondary:** "Cancel" (sage outlined)
  - Both equal width in a 2-column grid with 12px gap
- **Delete option:** A small destructive link below the buttons: "Delete this entry" with a trash icon. Triggers the existing AlertDialog confirmation.

---

### 3.8 Entry View (Modal)

**File:** `EntryView.tsx`

**Current state:** `sm:max-w-5xl` dialog (too wide), `px-15 py-10`, metadata in flex row, basic prose rendering.

#### Redesigned Entry View -- A Reading Experience

The goal is to make reading an entry feel like reading an article on Medium or a page in a beautiful book.

##### Dialog Shell

- **Max width:** `max-w-3xl` (720px) -- optimal reading width
- **Background:** `#FDFCFA` / Dark: `#1A2520`
- **Border radius:** 20px
- **Padding:** `px-10 py-8` desktop, `px-6 py-6` mobile
- **Max height:** 85vh with `overflow-y-auto`
- **Scrollbar:** Styled thin with sage accent thumb (use `scrollbar-thin scrollbar-thumb-sage-300`)

##### Header

- **Title:** Lora, h2 (28px), weight 600, `--foreground`. No flex row with the Edit button -- title gets its own line.
- **Edit button:** Positioned in the top-right corner of the dialog as an icon button (Lucide `Pencil`, ghost style, sage color). Not a text button.
- **Metadata row:** Below title, 8px gap. Horizontal flex, items center, gap 16px.
  - Category pill (same style as entry cards)
  - Date created: "Mar 22, 2026" in body-sm, muted
  - Date updated (if different from created): "Edited Mar 23, 2026" in body-sm, muted
- **Separator:** 1px line, `--border` color, `my-6`

##### Content Area

- **Typography:** Inter, body-lg (17px), weight 400, line-height 1.7
- **Max width:** None needed (dialog already constrains to 720px)
- **Paragraph spacing:** 1.25em between paragraphs
- **Color:** `--foreground` (charcoal-400 / forest-100)
- **Bold/italic rendering:** Ensure the HTML content from the editor renders with proper styling
- **Empty content:** Italic text "This entry has no content." in muted foreground. No parentheses.

##### Footer (below content)

- A subtle divider, then a horizontal row:
  - **Left:** Favorite toggle (star icon + "Favorite" text)
  - **Right:** "Edit Entry" sage link button, "Delete" destructive ghost button

---

### 3.9 Profile Page

**File:** `ProfilePage.tsx`

**Current state:** Centered `max-w-md` card with small avatar, inline edit buttons per field using native `<input>` and `<select>` elements.

#### Redesigned Layout

##### Page Structure

- **Content max-width:** 600px, centered
- **No outer card** -- the page itself is the surface (consistent with the writing pages)
- **Padding:** `px-8 py-10`

##### Avatar Section (Top)

- **Avatar size:** 96px (keep current `h-24 w-24`) but add a sage-colored ring: `ring-4 ring-sage-200` / Dark: `ring-forest-600`
- **Centered** with the "Change Avatar" button directly below (12px gap)
- **Change Avatar button:** Ghost pill button with camera icon
- **Below avatar:** Username displayed in Lora, h2 (28px), centered. Email in body-sm, muted, centered.
- **Spacing:** 40px below this section to the fields

##### Profile Fields

Each field follows a consistent pattern:

- **Field group:** Vertical stack, `gap-1`
- **Label:** Overline style (11px, uppercase, semibold, `--muted-foreground`)
- **Value:** Body (15px), `--foreground`, weight 500
- **Edit trigger:** A small pencil icon button (Lucide `Pencil`, 16px) next to the label. Color `--muted-foreground`, hover `--sage-400`.
- **Gap between field groups:** 24px
- **Separator lines:** Subtle 1px `--border` line between each field group

##### Edit Mode (per field)

When edit is triggered:
- The value text transforms into the redesigned input (with sage focus ring)
- Two small buttons appear below: "Save" (primary, small) and "Cancel" (ghost, small)
- Use the shadcn `Input` and `Select` components (not native `<input>` and `<select>`)
- Transition: The input fades in over 200ms, replacing the static text

##### Field Order

1. **Name** (First + Last in a 2-column row when editing)
2. **Username**
3. **Email** (non-editable for now -- show a lock icon instead of edit icon)
4. **Gender**
5. **Date of Birth**

##### Enhancement: Journal Stats Summary

Below the profile fields, add a simple stats section (40px top margin):

- **Section heading:** Inter, h4, "Your Journal"
- **Stats grid:** 3 compact stat items in a horizontal row:
  - **Total Entries:** Number in Lora h2 + "entries" label in caption
  - **First Entry:** Date in body-sm
  - **Most Active Category:** Category name with color dot
- **Background:** Subtle sage-50 / forest-700 card, rounded-2xl, padding `p-5`

---

## 4. Micro-interactions & Animations

### 4.1 Page Transitions

- **On route change:** Content area fades in from opacity 0 to 1 over 300ms, with a subtle upward slide of 8px. Use React `framer-motion` or CSS animations.
- **Keep it subtle.** No dramatic slides or flips. The feeling should be "content is gently revealed."

### 4.2 Card Hover Effects

- **Transform:** `translateY(-2px)` (NOT `scale` -- the current `hover:scale-102` feels jumpy)
- **Shadow:** Transition from `shadow-sm` to `shadow-md`
- **Duration:** 250ms ease-out
- **On mouse leave:** Return to original position/shadow at the same duration

### 4.3 Button Press Feedback

- **Active state:** `scale(0.98)` transform on press, 100ms duration
- **Ripple:** No ripple effect (keeps things calm)
- **Color shift:** Background darkens one shade on press (see button specs)

### 4.4 Loading States

- **Button loading:** Replace text with a small spinner (16px, sage-colored) + "Loading..." text. Button becomes disabled.
- **Page loading (skeleton):** Use the sage-tinted skeleton loaders (Section 2.7)
- **Inline loading:** For actions like favorite/pin toggle, show a brief pulse animation on the icon (scale 1 to 1.2 to 1 over 300ms)

### 4.5 Toast Notification Styling (Sonner)

The app already uses Sonner with `richColors`. Customize the theme:

- **Success toast:** Background `#4A9B6E` at 10% opacity, left border 4px `#4A9B6E`, icon in `#4A9B6E`
- **Error toast:** Background `#C75450` at 10% opacity, left border 4px `#C75450`, icon in `#C75450`
- **Info toast:** Background `#5B8FB9` at 10% opacity, left border 4px `#5B8FB9`
- **Font:** Inter, body-sm (14px)
- **Border radius:** 12px
- **Position:** Keep `top-center`
- **Animation:** Slide down from top + fade in

### 4.6 Sidebar Open/Close Animation

- **Slide:** `translateX(-100%)` to `translateX(0)`, 300ms, spring-like easing `cubic-bezier(0.16, 1, 0.3, 1)`
- **Overlay fade:** Overlay background fades from 0 to 50% opacity, 200ms
- **Content push:** On desktop, the main content area does NOT push/shift. The sidebar overlays (current behavior is correct).

### 4.7 Theme Toggle Animation

- **Icon swap:** The Sun/Moon icons should cross-fade with a 180-degree rotation:
  - Current icon rotates out (opacity 1 to 0, rotate 0 to 180deg)
  - New icon rotates in (opacity 0 to 1, rotate -180deg to 0)
  - Duration: 500ms total
- **Page colors:** All CSS variable changes should transition smoothly. Add to `body`:
  ```css
  body {
    transition: background-color 300ms ease, color 300ms ease;
  }
  ```
  Cards and surfaces will inherit this through CSS variables.

### 4.8 Favorite/Pin Toggle Animation

- **Favorite (star):** On toggle to active, the star does a brief scale pop (1 -> 1.3 -> 1 over 300ms) with a gold color fill animation. On toggle off, simple fade to outline.
- **Pin:** On toggle to active, the pin does a slight tilt rotation (0 -> -15deg -> 0 over 300ms). Color fills to sage.

---

## 5. Empty States & Onboarding

### 5.1 Zero-Entries State (Entries Page)

**Current state:** Icon in muted circle + "No entries yet" + description + CTA button. Functional but bland.

#### Redesigned Empty State

- **Container:** Centered, max-width 400px, padding-top 80px from where cards would start
- **Illustration concept:** A simple line-art illustration of an open notebook with a pen resting on it, drawn in sage-green strokes on a faint sage-50 circular background (120px diameter). Style: minimalist, single-weight line art -- not a complex scene.
  - Implementation: SVG inline or imported. 2-3 sage shades only.
- **Heading:** Lora, h2 (28px), weight 600, `--foreground`.
  Text: "Your journal awaits"
- **Description:** Inter, body (15px), muted foreground, max-width 320px, centered.
  Text: "This is where your thoughts and reflections will live. Start your first entry to begin your journaling journey."
- **CTA button:** Primary sage, slightly larger.
  Icon: Lucide `PenLine` (16px, left of text)
  Text: "Write your first entry"
- **Spacing:** 24px between illustration and heading, 12px between heading and description, 28px between description and CTA

### 5.2 Profile Incomplete State

- Uses the profile completion dialog (already exists)
- Restyle per Section 3.4 notes
- Warmer heading: "Let's personalize your space"
- Description: "Add your details and pick an avatar to make MindNest feel like yours."
- Buttons: "Set Up Now" (primary) and "Maybe Later" (ghost)

### 5.3 Search With No Results

**Current state:** Plain `text-gray-400` text "No journal entries found."

#### Redesigned No-Results State

- **Container:** Centered within the grid area, padding-top 60px
- **Icon:** Lucide `SearchX` or `FileQuestion`, 48px, sage-300 color, centered
- **Heading:** Inter, h3 (22px), weight 500.
  Text: "No entries found"
- **Description:** Inter, body-sm (14px), muted foreground.
  Text: "No entries match '{searchQuery}'. Try a different search term or check your filters."
- **Action:** Ghost sage button: "Clear Search" that resets the search query
- **Spacing:** 16px between icon and heading, 8px between heading and description, 20px between description and button

### 5.4 First-Time User Experience

When a user signs up and lands on the Home dashboard for the first time (0 entries):

1. The **greeting** says "Welcome to MindNest, {firstName}!" (one-time welcome variant)
2. The **writing prompt** section is especially prominent, perhaps with a gentle pulsing sage border to draw attention
3. The **quick action cards** lead with "Write Your First Entry" as the primary CTA card
4. The **recent entries section** is replaced with a brief onboarding message:
   - "Your recent entries will appear here once you start writing."
   - Small illustration or icon of a seedling (MindNest = growing your thoughts)

---

## 6. Responsive Design Notes

### 6.1 Breakpoints

Follow Tailwind's default breakpoints:

| Breakpoint | Width   | Typical Device          |
|------------|---------|-------------------------|
| `sm`       | 640px   | Large phones landscape   |
| `md`       | 768px   | Tablets                  |
| `lg`       | 1024px  | Small laptops            |
| `xl`       | 1280px  | Desktops                 |

### 6.2 Mobile Sidebar Behavior

- **Trigger:** Hamburger menu button in header (keep existing)
- **Behavior:** Full-screen overlay drawer sliding in from left (keep current behavior)
- **Width:** Full screen width on mobile (`w-full`), 256px on tablet+
- **Overlay:** Semi-transparent dark backdrop, tap to close
- **Close on navigation:** Sidebar closes automatically when a nav item is clicked

### 6.3 Card Grid Collapse

| Screen       | Columns | Gap   |
|--------------|---------|-------|
| `lg` (1024+) | 3       | 20px  |
| `md` (768+)  | 2       | 16px  |
| `< md`       | 1       | 16px  |

### 6.4 Header Adaptation

- **Desktop:** Logo + search bar + theme toggle + user dropdown (name + avatar)
- **Tablet:** Logo + search bar + theme toggle + avatar-only dropdown
- **Mobile:** Hamburger + search bar (truncated) + avatar-only button

The search bar should collapse to an icon button on very small screens (< 480px), expanding into an overlay input on tap.

### 6.5 Touch-Friendly Sizing

- **All interactive elements:** Minimum 44x44px touch target (already partially implemented)
- **Buttons:** Padding ensures 44px height minimum
- **Card action buttons:** Always visible on mobile (no hover-reveal)
- **Form inputs:** 44px minimum height
- **Sidebar nav items:** 48px height on mobile

### 6.6 Mobile Writing Experience

- **Title input:** Full width, 28px font (slightly smaller than desktop 32px)
- **Category pills:** Horizontally scrollable on small screens (overflow-x-auto with hidden scrollbar)
- **Text editor:** Minimum height 300px (smaller than desktop's 400px to show submit button above fold)
- **Toolbar:** Scrollable horizontal row if all icons don't fit
- **Submit button:** Sticky at bottom of viewport on mobile? Consider this for long entries. Alternative: just ensure it's always reachable via scroll.

### 6.7 Auth Pages (Mobile)

- Remove the subtle background gradients on mobile (performance)
- Auth card: no border-radius on mobile (full-width card, flush to edges)
- Card padding: `px-5 py-6` on mobile

---

## 7. Accessibility

### 7.1 Color Contrast Ratios

All text/background combinations must meet **WCAG AA** (4.5:1 for body text, 3:1 for large text/UI elements).

| Combination                                    | Ratio | Passes AA? |
|------------------------------------------------|-------|------------|
| Charcoal-400 (`#1C1A17`) on Cream-50 (`#FDFCFA`) | 16.5:1 | Yes       |
| Charcoal-200 (`#4A463F`) on Cream-50 (`#FDFCFA`) | 9.2:1  | Yes       |
| Charcoal-50 (`#8A8479`) on Cream-50 (`#FDFCFA`)  | 3.8:1  | Large only |
| Muted foreground: use `#6B665D` instead of `#8A8479` for body-sm text to reach 4.5:1 | 5.3:1 | Yes |
| Sage-400 (`#7C9885`) on white (`#FFFFFF`)         | 3.2:1  | UI only   |
| Sage-700 (`#465C4D`) on Cream-50 (`#FDFCFA`)     | 7.0:1  | Yes       |
| Forest-50 (`#ECF2ED`) on Forest-900 (`#0F1A14`)  | 12.8:1 | Yes       |
| Forest-200 (`#A8C4AE`) on Forest-900 (`#0F1A14`) | 7.5:1  | Yes       |
| Forest-400 (`#4D665C`) on Forest-900 (`#0F1A14`) | 2.3:1  | No -- avoid for text |
| Primary button text (white on sage `#7C9885`)     | 3.4:1  | Large text + UI only |

**Action items:**
- Use `#465C4D` (sage-700) for sage-colored body text on light backgrounds, not `#7C9885`
- Ensure muted text uses `#6B665D` (charcoal-100) minimum, not `#8A8479`
- For dark mode muted text, use `#7C9885` (forest-300) minimum on forest-900 backgrounds (4.1:1)
- Primary buttons with white text on `#7C9885` pass for large text and UI components (3.4:1 > 3:1), which is acceptable since buttons have 15px semibold text

### 7.2 Focus Indicators

- **Focus-visible ring:** `0 0 0 3px rgba(124, 152, 133, 0.4)` -- sage glow at 40% opacity
- **All interactive elements** must show a visible focus ring when navigated via keyboard
- **Focus ring color contrast:** The sage focus ring on cream background provides sufficient visibility (the ring is darker than the background)
- **Skip nav link:** Add a "Skip to main content" link that appears on Tab focus, positioned absolutely at the top of the page. Style: sage-filled pill, centered.

### 7.3 Reduced Motion

Add the following to `index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This disables:
- Card hover lift animations
- Page transition animations
- Skeleton shimmer
- Theme toggle rotation
- Sidebar slide animation (instant show/hide instead)
- All other transitions

### 7.4 Screen Reader Considerations

- **Sidebar nav items:** Already have `(current page)` sr-only text for active items (keep this)
- **Favorite/pin buttons:** Ensure `aria-label` updates dynamically: "Add to favorites" vs "Remove from favorites"
- **Entry cards:** Each card should be an article or have `role="article"` with an accessible name from the title
- **Dialog (EntryView):** Already has `DialogDescription` with sr-only class (keep this)
- **Search:** Ensure the search input has `role="search"` on its form and proper `aria-label`
- **Loading states:** Use `aria-live="polite"` regions for loading/loaded transitions
- **Category filter:** Announce the active filter with `aria-live` when changed
- **Toast notifications:** Sonner already handles ARIA live regions, but verify they announce correctly

### 7.5 Keyboard Navigation

- **Tab order:** Logical flow -- sidebar items, then header actions, then main content
- **Escape key:** Closes modals, dialogs, sidebar overlay (already partially implemented)
- **Enter key:** Submits forms, activates buttons
- **Arrow keys:** Navigate within dropdown menus and select components (shadcn handles this)
- **Sidebar:** When opened, trap focus within sidebar. When closed, return focus to the toggle button.

---

## Implementation Priority

For the implementation team, here is the recommended order:

1. **Design System Foundation** (CSS variables, typography, fonts) -- this unlocks everything else
2. **Layout Components** (Header, Sidebar, MainLayout) -- affects all pages
3. **Component Library Updates** (Buttons, Cards, Inputs, Dialogs, Skeletons)
4. **Landing Page + Auth Pages** (first impression)
5. **Home Dashboard** (daily experience)
6. **Entries Page** (core functionality)
7. **New Entry + Edit Pages** (writing experience)
8. **Entry View Modal** (reading experience)
9. **Profile Page** (secondary)
10. **Micro-interactions + Animations** (polish pass)
11. **Accessibility audit** (final pass)

---

## Reference: File Mapping

| Design Section         | File(s) to Modify                                    |
|------------------------|------------------------------------------------------|
| CSS Variables / Theme  | `src/index.css`                                      |
| Landing Page           | `src/pages/LandingPage.tsx`                          |
| Login Page             | `src/pages/AuthPages/LoginPage.tsx`                  |
| Signup Page            | `src/pages/AuthPages/SignupPage.tsx`                  |
| Home Dashboard         | `src/pages/Home.tsx`                                 |
| Entries Page           | `src/pages/EntriesPage.tsx`                          |
| New Entry Page         | `src/pages/NewEntryPage.tsx`                         |
| Edit Journal Page      | `src/pages/EditJournal.tsx`                          |
| Profile Page           | `src/pages/ProfilePage.tsx`                          |
| Main Layout            | `src/components/layouts/main-layout.tsx`             |
| Sidebar                | `src/components/layouts/app-sidebar.tsx`             |
| Header                 | `src/components/layouts/header.tsx`                  |
| Entry View Modal       | `src/components/Viewer/EntryView.tsx`                |
| Text Editor            | `src/components/TextEditor/TextEditor.tsx`           |
| Profile Dialog         | `src/components/dialog.tsx`                          |
| Avatar Picker          | `src/components/AvatarPickerDrawer.tsx`              |
| Google Sign-In Button  | `src/components/Auth/GoogleSignInButton.tsx`         |
| Theme Context          | `src/context/themeContext.tsx` (no visual changes)   |
