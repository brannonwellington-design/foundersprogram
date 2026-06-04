/**
 * Single source of truth for all page copy and data.
 * Text is transcribed verbatim from the Figma artboards, with the two
 * agreed fixes folded in: standardized "2026" marquee and the
 * "early-stage company building" typo corrected.
 */

import { asset } from "@/lib/asset";

export const APPLY_URL =
  "https://jobs.ashbyhq.com/listenlabs/ab4889ec-0e06-42f2-8613-57072a445a96";

export const NAV_LINKS = [
  { label: "The Program", href: "#program" },
  { label: "Details", href: "#details" },
  { label: "Mentors", href: "#mentors" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Apply", href: "#apply" },
] as const;

/**
 * Hero images cycled by cursor position (left→right maps to 1→9).
 * Drop the nine exports in public/images/hero/. Any slot that isn't present
 * yet falls back to the default portrait, so the hero never breaks.
 */
export const HERO_IMAGES = Array.from({ length: 10 }, (_, i) =>
  asset(`/images/hero/hero-${i + 1}.webp`),
);
export const HERO_IMAGE_FALLBACK = asset("/images/hero-portrait.webp");

export const HERO = {
  title: "Listen Future Founder Program",
  pill: "Accepting Applications",
  leadPrimary:
    "The Future Founder Program is for engineers who want to start a company but haven’t yet.",
  leadSecondary:
    "You join Listen as an engineer and ship real products, but get far more founder-level learning than a normal eng job: you work closely with customers to see what’s worth building, get workshops on PMF, fundraising, and ideas, and build relationships with the investors behind Listen.",
  circle: "This could be you",
  cta: "Apply Now",
};

export const EDGE = {
  title: "You’re an engineer with the dream of becoming a founder",
  body: "Many of the best founders started exactly this way: joining a company with strong PMF and learning how it gets built up close. We designed the program we wish we’d had, solving hard technical problems while staying close to customers, with far more ownership than normal engineering. That’s what you do here, before you go start your own.",
};

/**
 * Program-section YouTube embed. Drop the video ID in (the part after
 * `watch?v=` / `youtu.be/`) to go live; the poster comes from YouTube.
 * While `id` is empty the section shows a branded placeholder with the caption.
 */
export const PROGRAM_VIDEO = {
  id: "A3j9jXznhrU",
  caption: "The most important AI companies haven’t been founded yet.",
};

/** Listening-device photos for the Program section (cursor trail / scroll scrub). */
export const LISTENING_DEVICES = Array.from({ length: 13 }, (_, i) =>
  asset(`/images/listening_device_${String(i + 1).padStart(2, "0")}.webp`),
);

export const DETAILS_HEADLINE = "From Engineer to Founder";

export type Detail = { n: string; title: string; body: string };

export const DETAILS: Detail[] = [
  {
    n: "01.",
    title: "Learn from experts and build relationships with investors",
    body: "Immersive workshops led by investors and operators covering how to find the best startup ideas, product market fit, financing, and scaling.",
  },
  {
    n: "02.",
    title: "Formal Mentorship",
    body: "Mentorship sessions with our founders Alfred and Florian. You’ll get inside visibility on how fundraising, hiring, and product roadmap decisions actually get made at a high-growth company.",
  },
  {
    n: "03.",
    title: "Customer Immersion",
    body: "This role goes beyond just building. Talk directly with real customers as you create products and features. You’ll see exactly where they struggle, what they love, and develop a strong sense for problems they would pay anything to fix.",
  },
  {
    n: "04.",
    title: "Exceptional Cohort",
    body: "This is a highly selective program designed for top talent. Join a small tight-knit group of standout engineers where you’ll meet your future co-founders, advisors, and lifelong collaborators.",
  },
  {
    n: "05.",
    title: "Validate ideas using Listen",
    body: "Take advantage of free Listen credits to run your own customer studies, test ideas, and explore founder-specific workflows.",
  },
  {
    n: "06.",
    title: "Outsized Influence",
    body: "Own real products customers rely on, not just tasks. You’ll have meaningful ownership of product direction, customer strategy, and go-to-market.",
  },
];

export const MENTORS_INTRO = {
  title: "Dedicated workshops led by our founders and investors",
  body: "Learn directly from top experts and from your teammates. Over 30% of Listen employees are former founders.",
};

export type Mentor = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

export const MENTORS: Mentor[] = [
  {
    name: "Alfred Wahlforss",
    role: "CEO & Co-Founder, Listen Labs",
    bio: "How to make decisions around company vision, hiring, and fundraising. Get a peek behind how one of the fastest moving startups today wins",
    image: asset("/images/mentor-alfred.png"),
  },
  {
    name: "Florian Juengermann",
    role: "CTO & Co-Founder, Listen Labs",
    bio: "How to build a product that customers love. Perspective as a technical founder leading well beyond engineering",
    image: asset("/images/mentor-florian.png"),
  },
  {
    name: "Mar Hershenson",
    role: "Partner, Pear VC, Lecturer at Science and Engineering at Stanford",
    bio: "How to find the best ideas. One of the sharpest minds on idea generation and early-stage company building",
    image: asset("/images/mentor-mar.png"),
  },
  {
    name: "Mike Vernal",
    role: "Partner, Conviction",
    bio: "How to find product market fit. Previously reported directly to Mark Zuckerberg at Facebook, where he ran core product",
    image: asset("/images/mentor-mike.png"),
  },
  {
    name: "Konstantine Buhler",
    role: "Partner, Sequoia",
    bio: "How to finance a company. Deep experience in early-stage company building, fundraising strategy, and what separates fundable from fundable-and-great",
    image: asset("/images/mentor-konstantine.png"),
  },
  {
    name: "Nick Shalek",
    role: "Partner, Ribbit Capital",
    bio: "Scaling from 1 to 100. Has seen firsthand what it takes to move from initial traction to a machine that scales and what kills companies in between",
    image: asset("/images/mentor-nick.png"),
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "“Working at Listen has been pretty remarkable. My favorite part is how transparent Alfred and Florian are. I get to see firsthand how decisions around fundraising, hiring, and product roadmap actually get made.”",
    name: "Krish Mehta",
    role: "Founding Engineer, Listen Labs",
    image: asset("/images/testimonial-krish.png"),
  },
  {
    quote:
      "“Since I talk to so many different customers, I’m constantly seeing new business problems and coming up with new ideas. We’ve gone zero to one, and I’ve learned what it means to not just to build, but how to sell, think about product, and solve deep technical problems.”",
    name: "Ollie Elmgren",
    role: "Engineer, Listen Labs",
    image: asset("/images/testimonial-ollie.png"),
  },
  {
    quote:
      "“Every Listen study is connected to a real business problem, so you’re exposed to the questions companies are trying to answer. You get to see the gaps and opportunities across different industries to inspire new ideas.”",
    name: "Diana Lim",
    role: "Growth Engineer, Listen Labs",
    image: asset("/images/diana.png"),
  },
];

export const APPLY = {
  heading: "Apply Now",
  body: "We encourage applications from ambitious engineers across a wide range of backgrounds and disciplines.",
  cta: "Apply Now",
};

/** Marquee cells, alternating label and year (standardized to include 2026). */
export const MARQUEE_ITEMS = ["ACCEPTING APPLICATIONS", "2026"];
