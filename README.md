# Listen Future Founder Program

A high-end, single-page marketing site for the Listen Labs Future Founder
Program, built from the Figma designs (desktop + mobile artboards).

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** — brand tokens wired as CSS custom properties
- **Motion** (Framer Motion) — spring-physics animation
- **Lenis** — smooth scroll
- **GSAP** — available for scroll-driven work
- **lucide-react** — icons (per brand icon guidelines)

## Design system

Colors, typography, spacing, and iconography follow the **Listen Labs brand
plugin** (Paper theme). Tokens live as CSS variables in
`src/app/globals.css`; light is the default and `[data-theme="dark"]` overrides
the same token names, so the whole site re-themes without touching components.
A light/dark toggle is in the header.

- Type: **Inter 400 only** (brand rule — never bold/light)
- Spacing: 4px base, even numbers only
- Motion: spring physics (stiffness 300 / damping 30 / mass 1), reduced-motion
  respected throughout

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Images

All imagery lives in `public/images/`. The mentor/testimonial portraits and the
hero (rendered from the Figma artboards) are PNGs; the larger photographic art
(`edge-1`, `edge-2`, `apply-bg`, `hero-portrait`) is stored as optimized WebP.
The mentor and testimonial portraits carry the design's brand-blue duotone
treatment; the hero includes the "This could be you" mark.

`Figure` (`src/components/ui/Figure.tsx`) still falls back to an on-brand
placeholder (initials for people) if any file is missing, so swapping in a
higher-resolution export later is a drop-in replacement using the same name.

`scripts/extract-images.cjs` documents how the images were decoded from the
Figma renders (one-off; not part of the build).

## Structure

```
src/
  app/            layout, globals (tokens), page
  components/
    layout/       Header, Marquee, Footer, MobileApplyBar
    sections/     Hero, Edge, Details, Mentors, Testimonials, Apply
    motion/       SmoothScroll, Reveal, Magnetic, ThemeToggle
    ui/           ApplyButton, SectionLabel, Figure, Logo
  lib/            content (all copy/data), motion presets, cn
```
