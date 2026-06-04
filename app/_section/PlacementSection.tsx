"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Select from "@/components/shared/input/Select";
import type { MegaMenuState } from "../types";

type Props = { state: MegaMenuState; update: <K extends keyof MegaMenuState>(key: K, value: MegaMenuState[K]) => void };

export default function PlacementSection({ state, update }: Props) {
  return <SectionCard title="Placement" subtitle="Placement controls for native mega generation."><Select label="Side" value={state.side} options={[
  "top",
  "right",
  "bottom",
  "left"
]} onChange={(value) => update("side", value)} /></SectionCard>;
}
