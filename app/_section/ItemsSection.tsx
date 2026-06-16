"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { MegaMenuState } from "../types";

type Props = { state: MegaMenuState; update: <K extends keyof MegaMenuState>(key: K, value: MegaMenuState[K]) => void };

export default function ItemsSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Items" subtitle="Items controls for native mega generation.">
      <div className="space-y-4">
        <Slider label="Columns" value={state.columnCount} min={1} max={8} step={1} onChange={(value) => update("columnCount", value)} />
        <Slider label="Groups" value={state.groupCount} min={1} max={8} step={1} onChange={(value) => update("groupCount", value)} />
      </div>
    </SectionCard>
      <SectionCard title="Panel geometry" subtitle="Panel, header, featured, and icon sizing.">
      <div className="space-y-4">
        <Slider label="Panel radius" value={state.panelRadius} min={0} max={32} step={1} onChange={(value) => update("panelRadius", value)} />
        <Slider label="Category header size" value={state.categoryHeaderSize} min={9} max={18} step={1} onChange={(value) => update("categoryHeaderSize", value)} />
        <Slider label="Category header weight" value={state.categoryHeaderWeight} min={400} max={900} step={100} onChange={(value) => update("categoryHeaderWeight", value)} />
        <Slider label="Featured radius" value={state.featuredRadius} min={0} max={28} step={1} onChange={(value) => update("featuredRadius", value)} />
        <Slider label="Icon size" value={state.iconSize} min={8} max={22} step={1} onChange={(value) => update("iconSize", value)} />
      </div>
    </SectionCard>
    </div>
  );
}
