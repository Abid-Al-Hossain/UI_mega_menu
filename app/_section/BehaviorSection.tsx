"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Select from "@/components/shared/input/Select";
import Switch from "@/components/shared/input/Switch";
import type { MegaMenuState } from "../types";

type Props = { state: MegaMenuState; update: <K extends keyof MegaMenuState>(key: K, value: MegaMenuState[K]) => void };

export default function BehaviorSection({ state, update }: Props) {
  return <SectionCard title="Behavior" subtitle="Behavior controls for native mega generation."><Select label="Trigger" value={state.triggerMode} options={[
  "hover",
  "click",
  "focus"
]} onChange={(value) => update("triggerMode", value)} />
<Switch label="Disabled" checked={state.disabled} onChange={(value) => update("disabled", value)} /></SectionCard>;
}
