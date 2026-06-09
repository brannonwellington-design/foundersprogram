"use client";

import { useState, type CSSProperties } from "react";
import { Play } from "lucide-react";
import { EDGE, PROGRAM_VIDEO } from "@/lib/content";
import { grid12, gridLeftWide, gridRightMid, gridWide } from "@/lib/grid";
import { WORD_STAGGER } from "@/lib/gsap/constants";
import { splitWords } from "@/lib/gsap/splitText";
import { cn } from "@/lib/cn";
import { MaskGroup } from "@/components/motion/MaskGroup";
import { MaskMedia } from "@/components/motion/MaskMedia";
import { MaskText } from "@/components/motion/MaskText";
import { SectionLabel, sectionLabelTop } from "@/components/ui/SectionLabel";
import { ListenMark } from "@/components/ui/ListenMark";

const EDGE_TITLE_LINE1_WORDS = splitWords(EDGE.titleLine1).length;

/**
 * Container-relative scale so line 1 fills cols 2–11 without bleeding into col 12.
 * Divisor accounts for MaskText’s 0.25em inter-word gaps (5 × 0.25em on line 1).
 */
const EDGE_TITLE_STYLE: CSSProperties = {
  lineHeight: 1.2,
  letterSpacing: "-0.04em",
  fontSize: "clamp(1.05rem, 5.4cqi, 6.25rem)",
  containerType: "inline-size",
};

function EdgeTitleHeadline({
  line1ClassName,
  line2Delay = EDGE_TITLE_LINE1_WORDS * WORD_STAGGER,
}: {
  line1ClassName?: string;
  line2Delay?: number;
}) {
  return (
    <>
      <MaskText
        as="span"
        mode="words"
        className={cn("block w-full max-w-full", line1ClassName)}
      >
        {EDGE.titleLine1}
      </MaskText>
      <MaskText
        as="span"
        mode="words"
        className="block w-full max-w-full"
        revealDelay={line2Delay}
      >
        {EDGE.titleLine2}
      </MaskText>
    </>
  );
}

export function Edge() {
  return (
    <section
      className={cn(
        "bg-surface-primary px-4 pb-24 md:px-6 md:pb-32",
        sectionLabelTop,
      )}
    >
      <SectionLabel id="program" label="The Program" />

      <div className={cn("mt-16 flex w-full flex-col gap-6 md:mt-[100px]", grid12, "md:gap-y-12")}>
        <h2
          className={cn(
            "hidden w-full min-w-0 max-w-full overflow-x-clip text-left text-content-brand tracking-tight-2 md:block",
            gridWide,
          )}
          style={EDGE_TITLE_STYLE}
        >
          <EdgeTitleHeadline line1ClassName="whitespace-nowrap" />
        </h2>

        <MaskMedia className={cn("w-full min-w-0", gridLeftWide)}>
          <VideoEmbed id={PROGRAM_VIDEO.id} caption={PROGRAM_VIDEO.caption} />
        </MaskMedia>

        <MaskGroup
          className={cn(
            "flex w-full flex-col gap-4 md:justify-between md:gap-0 md:self-stretch",
            gridRightMid,
          )}
        >
          <h2
            className="w-full min-w-0 max-w-full overflow-x-clip text-left text-content-brand tracking-tight-2 md:hidden"
            style={EDGE_TITLE_STYLE}
          >
            <EdgeTitleHeadline line1ClassName="whitespace-nowrap" />
          </h2>

          <MaskText
            as="p"
            mode="lines"
            className="text-[16px] leading-[22px] text-content-brand tracking-tight-2 md:text-[18px] md:leading-6"
          >
            {EDGE.body}
          </MaskText>

          <ListenMark />
        </MaskGroup>
      </div>
    </section>
  );
}

function VideoEmbed({ id, caption }: { id: string; caption: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-surface-brand-primary">
      {playing && id ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title="Listen Future Founder Program"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => id && setPlaying(true)}
          aria-label={id ? "Play video" : "Video coming soon"}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {id ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="absolute inset-x-0 bottom-0 p-6 text-left text-content-brand-contrast text-[clamp(1rem,2vw,1.5rem)] tracking-tight-2">
              {caption}
            </span>
          )}

          <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface-primary/90 transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-0.5 h-6 w-6 fill-content-brand text-content-brand" />
          </span>
        </button>
      )}
    </div>
  );
}
