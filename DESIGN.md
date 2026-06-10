# Design System: Mitul Srivastava Portfolio
**Project ID:** local-portfolio

## 1. Visual Theme & Atmosphere
The atmosphere is minimalist, technical, and sharply modern, leaning into a refined "developer brutalism." It features high-contrast aesthetics (deep blacks and stark whites) complemented by technical, blueprint-like grid backgrounds. The vibe is sleek, professional, and slightly futuristic, mimicking the precision of IDEs and high-end software tools.

## 2. Color Palette & Roles
* **Pitch Black (#000000) & Deep Zinc (#09090B):** Primary background in dark mode; primary text color and heavy contrast element in light mode.
* **Stark White (#FFFFFF) & Zinc 50 (#FAFAFA):** Primary background in light mode; crisp text color in dark mode.
* **Fiery Orange/Red Accent (#FF4D1A):** The primary interactive and highlight color. Used sparingly for key data points (like the "2K+" stat), glowing hover effects, Lucide icons, and active UI states. A softer variation (**#FF7A4D**) is used for subtle glows and pings.
* **Muted Zinc (#A1A1AA / Zinc-400):** Used for secondary typography, subtle borders, and the structural background grid.

## 3. Typography Rules
* **Primary Sans-Serif (System UI / Inter):** Used for all main headers, body copy, and narrative text. Employs a dense, impactful style for large text.
* **Technical Monospace (SF Mono / Consolas):** Strictly reserved for micro-copy, tags, labels, and specific data points to reinforce the developer aesthetic.
* **Header Hierarchy:** Top-level text uses `font-black` (Weight 900) combined with `tracking-tighter` for maximum visual weight.
* **Micro-Labels:** Technical labels are rendered incredibly small (`text-[9px]`), uppercase, and with wide letter spacing (`tracking-widest`).

## 4. Component Stylings
* **Pills & Badges:** Completely pill-shaped (`rounded-full`). Often utilize background blurring (`backdrop-blur-sm`) overlaid on dark or light translucent backgrounds with delicate solid borders.
* **Cards / Containers:** Favor sharp, squared-off edges or very subtle rounding (`rounded-md`). Cards rely on thin borders (`border-zinc-200/30`) rather than drop shadows for depth, keeping the UI completely flat.
* **Stats Band:** A sleek, single-line horizontal flex strip. Combines minimal icons with high-contrast numbers and uppercase monospaced labels. Divided by ultra-thin vertical strokes.
* **Interactive Elements:** Buttons and links feature micro-interactions, typically scaling up slightly (`hover:scale-105`) with fluid, ease-out transitions (`duration-500`).

## 5. Layout Principles
* **Structure & Alignment:** Relies on rigorous grid systems (`max-w-7xl` container bounds) to maintain perfect horizontal alignment across vastly different content types.
* **Whitespace Strategy:** Highly generous vertical spacing. Major sections are separated by massive vertical padding (`py-24` to `py-32`) to provide a grand, banner-like breathing room and to expose the underlying architectural grid background.
* **Separation:** Foregoes solid color blocking in favor of ultra-thin, low-opacity border strokes (`border-y border-zinc-200/70`) to delineate sections, maintaining a lightweight and airy structure.
