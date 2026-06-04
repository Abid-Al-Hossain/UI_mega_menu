"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import type { MegaMenuState } from "../types";

type Props = { state: MegaMenuState; update: <K extends keyof MegaMenuState>(key: K, value: MegaMenuState[K]) => void };

export default function LayoutSection({ state, update }: Props) {
  return <SectionCard title="Layout" subtitle="Layout controls for native mega generation."><div className="rounded-2xl border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>No separate native controls are needed for this section in this component.</div></SectionCard>;
}
