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

## Images — action needed

The Figma image assets could not be pulled into this environment automatically
(the network policy blocks `figma.com`). The site renders today with on-brand
placeholders (initials for people) that **automatically swap to the real photo
the moment the file exists** — no code change required.

Export these from Figma and drop them in `public/images/` with these exact
names (PNG):

| File | Used for |
|------|----------|
| `hero-portrait.png` | Hero photo (behind the "This could be you" disc) |
| `edge-1.png` | "Listen is your edge" — main image |
| `edge-2.png` | "Listen is your edge" — small offset image |
| `mentor-alfred.png` | Alfred Wahlforss |
| `mentor-mar.png` | Mar Hershenson |
| `mentor-florian.png` | Florian Juengermann |
| `mentor-mike.png` | Mike Vernal |
| `mentor-konstantine.png` | Konstantine Buhler |
| `mentor-nick.png` | Nick Shalek |
| `testimonial-krish.png` | Krish Mehta |
| `testimonial-ollie.png` | Ollie Elmgren |
| `apply-bg.png` | Apply section background |

The mentor/testimonial images get the design's brand-blue + `mix-blend-screen`
duotone treatment automatically.

Alternatively, push the exports to a GitHub location and I can wire them in.

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
