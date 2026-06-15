"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Select from "@/components/shared/input/Select";
import Switch from "@/components/shared/input/Switch";
import type { MegaMenuState } from "../types";

type Props = { state: MegaMenuState; update: <K extends keyof MegaMenuState>(key: K, value: MegaMenuState[K]) => void };

export default function BehaviorSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Trigger" subtitle="How the mega menu opens.">
        <Select label="Trigger mode" value={state.triggerMode} options={["hover", "click", "focus"]} onChange={(value) => update("triggerMode", value)} />
      </SectionCard>
      <SectionCard title="Content" subtitle="Mega menu panel content options.">
        <Switch label="Featured panel" checked={state.featuredPanel} onChange={(value) => update("featuredPanel", value)} />
      </SectionCard>
    </div>
  );
}
