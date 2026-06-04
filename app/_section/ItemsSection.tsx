"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { MegaMenuState } from "../types";

type Props = { state: MegaMenuState; update: <K extends keyof MegaMenuState>(key: K, value: MegaMenuState[K]) => void };

export default function ItemsSection({ state, update }: Props) {
  return <SectionCard title="Items" subtitle="Items controls for native mega generation."><Slider label="Columns" value={state.columnCount} min={1} max={8} step={1} onChange={(value) => update("columnCount", value)} />
<Slider label="Groups" value={state.groupCount} min={1} max={8} step={1} onChange={(value) => update("groupCount", value)} /></SectionCard>;
}
