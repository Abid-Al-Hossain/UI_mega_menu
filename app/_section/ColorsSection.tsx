"use client";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import ColorControl from "@/components/shared/color/ColorControl";
import type { MegaMenuState } from "../types";

type Props = { state: MegaMenuState; update: <K extends keyof MegaMenuState>(key: K, value: MegaMenuState[K]) => void };

export default function ColorsSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Shell" subtitle="Base container colors.">
      <div className="space-y-4">
        <ColorControl label="Background" value={state.background} onChange={(v) => update("background", v)} />
        <ColorControl label="Foreground" value={state.foreground} onChange={(v) => update("foreground", v)} />
        <ColorControl label="Accent" value={state.accent} onChange={(v) => update("accent", v)} />
        <ColorControl label="Muted" value={state.muted} onChange={(v) => update("muted", v)} />
        <ColorControl label="Border" value={state.border} onChange={(v) => update("border", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Action & trigger" subtitle="Trigger button colors.">
      <div className="space-y-4">
        <ColorControl label="Action text" value={state.actionText} onChange={(v) => update("actionText", v)} />
        <ColorControl label="Trigger hover bg" value={state.triggerHoverBg} onChange={(v) => update("triggerHoverBg", v)} />
        <ColorControl label="Trigger active color" value={state.triggerActiveColor} onChange={(v) => update("triggerActiveColor", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Panel & links" subtitle="Mega panel surface, dividers, and links.">
      <div className="space-y-4">
        <ColorControl label="Panel background" value={state.panelBg} onChange={(v) => update("panelBg", v)} />
        <ColorControl label="Panel border" value={state.panelBorder} onChange={(v) => update("panelBorder", v)} />
        <ColorControl label="Column divider" value={state.columnDividerColor} onChange={(v) => update("columnDividerColor", v)} />
        <ColorControl label="Link color" value={state.linkColor} onChange={(v) => update("linkColor", v)} />
        <ColorControl label="Link hover color" value={state.linkHoverColor} onChange={(v) => update("linkHoverColor", v)} />
        <ColorControl label="Link hover bg" value={state.linkHoverBg} onChange={(v) => update("linkHoverBg", v)} />
        <ColorControl label="Category header" value={state.categoryHeaderColor} onChange={(v) => update("categoryHeaderColor", v)} />
        <ColorControl label="Icon" value={state.iconColor} onChange={(v) => update("iconColor", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Featured, badge & footer" subtitle="Featured panel, badge, and footer bar.">
      <div className="space-y-4">
        <ColorControl label="Featured background" value={state.featuredBg} onChange={(v) => update("featuredBg", v)} />
        <ColorControl label="Featured text" value={state.featuredText} onChange={(v) => update("featuredText", v)} />
        <ColorControl label="Featured border" value={state.featuredBorder} onChange={(v) => update("featuredBorder", v)} />
        <ColorControl label="Badge background" value={state.badgeBg} onChange={(v) => update("badgeBg", v)} />
        <ColorControl label="Badge text" value={state.badgeText} onChange={(v) => update("badgeText", v)} />
        <ColorControl label="Footer background" value={state.footerBg} onChange={(v) => update("footerBg", v)} />
        <ColorControl label="Footer border" value={state.footerBorder} onChange={(v) => update("footerBorder", v)} />
        <ColorControl label="Footer text" value={state.footerText} onChange={(v) => update("footerText", v)} />
      </div>
    </SectionCard>
    </div>
  );
}
