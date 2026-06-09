import { WORD_STAGGER } from "@/lib/gsap/constants";

/** First-load choreography: logo + nav links + marquee → hero. */
const NAV_STEP = 0.08;
const NAV_START = 0.5;
const HERO_START = 1;
const LISTEN_N_INDEX = 5;

export const LOAD = {
  logo: 0,
  navStart: NAV_START,
  navStep: NAV_STEP,
  navDelay: (index: number) => NAV_START + index * NAV_STEP,
  marquee: NAV_START,
  /** Mobile menu grip — cascades as the N in Listen begins its wipe. */
  menuGrip: {
    start: LISTEN_N_INDEX * WORD_STAGGER,
    dotStagger: 0.04,
  },
  hero: {
    image: HERO_START,
    pill: HERO_START + 0.12,
    title: HERO_START + 0.22,
    titleStep: 0.08,
    lead: HERO_START + 0.52,
    button: HERO_START + 0.64,
  },
} as const;
