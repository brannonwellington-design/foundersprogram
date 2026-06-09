"use client";

import { createContext, useContext } from "react";

/** When true, MaskText only renders markup; MaskGroup owns the animation. */
export const MaskGroupContext = createContext(false);

export function useInMaskGroup(): boolean {
  return useContext(MaskGroupContext);
}
