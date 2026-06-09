"use client";

import { Fragment } from "react";
import { HERO } from "@/lib/content";
import { grid12, gridHeroLeft, gridRight } from "@/lib/grid";
import { cn } from "@/lib/cn";
import { LOAD } from "@/lib/loadSequence";
import { ApplyButton } from "@/components/ui/ApplyButton";
import { HeroImage } from "@/components/sections/HeroImage";
import { HeroLeadWords } from "@/components/sections/HeroLeadWords";
import { MaskMedia } from "@/components/motion/MaskMedia";
import { MaskText } from "@/components/motion/MaskText";

const T = LOAD.hero;

const TITLE_WORDS = ["Listen", "Future", "Founder\u00a0Program"];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-90px)] flex-col overflow-hidden bg-surface-primary"
    >
      <div className="relative flex flex-1 flex-col px-4 pb-6 md:px-6">
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-4 md:grid-rows-[1fr_1fr] md:gap-y-0",
            grid12,
          )}
        >
          <div
            className={cn(
              "flex flex-col items-start gap-4 pt-6 md:relative md:row-start-1 md:min-h-0 md:pt-0",
              gridHeroLeft,
            )}
          >
            <div className="flex flex-col items-start justify-start gap-4 md:absolute md:bottom-0 md:left-0 md:w-full">
              <MaskMedia
                reveal="load"
                revealDelay={T.pill}
                className="hidden md:inline-block"
                innerClassName="inline-flex items-center rounded-[40px] border border-content-brand px-[10px] py-1 text-[14px] text-content-brand tracking-tight-2"
              >
                <span style={{ lineHeight: "20px" }}>{HERO.pill}</span>
              </MaskMedia>

              <h1
                className="max-w-none text-content-brand tracking-tight-2"
                style={{ fontSize: "clamp(2.5rem, 5.6vw, 5.5rem)", lineHeight: 1.05 }}
              >
                {TITLE_WORDS.map((word, i) => (
                  <Fragment key={word}>
                    {i === 2 && (
                      <br className="hidden md:block" aria-hidden />
                    )}
                    <MaskText
                      as="span"
                      mode="unit"
                      reveal="load"
                      revealDelay={T.title + i * T.titleStep}
                      clipClassName="align-bottom"
                      style={{
                        marginRight: i < TITLE_WORDS.length - 1 ? "0.25em" : 0,
                      }}
                    >
                      {word}
                    </MaskText>
                  </Fragment>
                ))}
              </h1>
            </div>
          </div>

          <div
            className={cn(
              "relative h-[52vh] w-full overflow-hidden md:row-span-2 md:row-start-1 md:h-auto md:self-stretch",
              gridRight,
            )}
          >
            <MaskMedia
              reveal="load"
              revealDelay={T.image}
              className="absolute inset-0"
              innerClassName="absolute inset-0 h-full w-full"
            >
              <HeroImage className="absolute inset-0 h-full w-full" />
            </MaskMedia>
          </div>

          <div
            className={cn(
              "flex flex-col justify-start gap-6 pb-2 md:row-start-2 md:self-end md:pb-0",
              gridHeroLeft,
            )}
          >
            <MaskMedia
              reveal="load"
              revealDelay={T.lead}
              releaseClip
              className="block"
              innerClassName="block"
            >
              <p
                className="text-[20px] tracking-tight-2"
                style={{ lineHeight: 1.4 }}
              >
                <span className="text-content-brand">{HERO.leadPrimary}</span>{" "}
                <HeroLeadWords text={HERO.leadSecondary} />
              </p>
            </MaskMedia>

            <MaskMedia
              reveal="load"
              revealDelay={T.button}
              releaseClip
              className="hidden md:inline-block"
              innerClassName="inline-block"
            >
              <ApplyButton variant="hero" />
            </MaskMedia>
          </div>
        </div>
      </div>
    </section>
  );
}
