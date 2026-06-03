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
  leadPrimary: "When anyone can build, knowing what to build is everything.",
  leadSecondary:
    "A cohort program for exceptional talent at the beginning of their founding journey.",
  circle: "This could be you",
  cta: "Apply Now",
};

export const EDGE = {
  title: "Listen is your edge",
  body: "You already know how to code. The hard part is knowing what to build. Listen’s Founder Program gives you that: daily, firsthand exposure to the problems customers are desperate to solve, across every industry.",
};

/** Listening-device photos for the Program section (cursor trail / scroll scrub). */
export const LISTENING_DEVICES = Array.from({ length: 13 }, (_, i) =>
  asset(`/images/listening_device_${String(i + 1).padStart(2, "0")}.webp`),
);

export type Detail = { n: string; title: string; body: string };

export const DETAILS: Detail[] = [
  {
    n: "01.",
    title: "Hands-On Workshops",
    body: "Four immersive workshops per year led by investors and operators covering financing, product-market fit, scaling, and how to find the best startup ideas.",
  },
  {
    n: "02.",
    title: "Formal Mentorship with Our Founders",
    body: "Structured mentorship sessions with Alfred and Florian. You’ll get inside visibility on how fundraising, hiring, and product roadmap decisions actually get made at a high-growth company.",
  },
  {
    n: "03.",
    title: "Deep Customer Immersion",
    body: "Talk directly with real customers. You’ll see exactly where they struggle, what they love, and what they’d pay anything to fix.",
  },
  {
    n: "04.",
    title: "Exceptional Network",
    body: "A tight-knit group of builders per cohort, where you’ll meet your future co-founders, advisors, and lifelong collaborators.",
  },
  {
    n: "05.",
    title: "Listen Credits",
    body: "Free Listen credits to run your own customer studies, test ideas, and explore founder-specific workflows, using the product to find your own product-market fit.",
  },
  {
    n: "06.",
    title: "End-to-End Ownership",
    body: "Cohort members own real products and launches, not just tasks. You’ll make meaningful decisions about product direction, customer strategy, and go-to-market.",
  },
];

export const MENTORS_INTRO = {
  title: "Dedicated workshops led by our founders and investors",
  body: "You’ll learn from the team at Listen. Over 30% of us are former founders.",
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
    bio: "Runs immersive sessions on how decisions around fundraising, hiring, and product roadmap actually get made inside one of the fastest moving startups",
    image: asset("/images/mentor-alfred.png"),
  },
  {
    name: "Florian Juengermann",
    role: "CTO & Co-Founder, Listen Labs",
    bio: "Brings deep perspective as a technical founder on building a product that customers love and how to develop the instincts to get you there faster",
    image: asset("/images/mentor-florian.png"),
  },
  {
    name: "Mar Hershenson",
    role: "Partner, Pear VC, Professor at Stanford Business School",
    bio: "One of the sharpest minds on idea generation and early-stage company building",
    image: asset("/images/mentor-mar.png"),
  },
  {
    name: "Mike Vernal",
    role: "Partner, Conviction",
    bio: "Previously reported directly to Mark Zuckerberg at Facebook, where he ran core product",
    image: asset("/images/mentor-mike.png"),
  },
  {
    name: "Konstantine Buhler",
    role: "Partner, Sequoia",
    bio: "Deep experience in early-stage company building, fundraising strategy, and what separates fundable from fundable-and-great",
    image: asset("/images/mentor-konstantine.png"),
  },
  {
    name: "Nick Shalek",
    role: "Partner, Ribbit Capital",
    bio: "Has seen firsthand what it takes to move from initial traction to a machine that scales and what kills companies in between",
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
  heading: "Apply now to the founding cohort.",
  body: "We encourage applications from technical builders across a wide range of backgrounds, disciplines, and experience levels. Strong candidates have experience building software systems and are excited to speak with customers.",
  cta: "Apply Now",
};

/** Marquee cells, alternating label and year (standardized to include 2026). */
export const MARQUEE_ITEMS = ["ACCEPTING APPLICATIONS", "2026"];
