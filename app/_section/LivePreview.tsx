"use client";

import { useState, type CSSProperties } from "react";
import type { MegaMenuState } from "../types";
import { SYSTEM_FONTS } from "@/components/shared/typography/fontConstants";

function resolveFont(state: { fontBucket: "system" | "google"; googleFontFamily: string; systemFontIdx: number }): string {
  return state.fontBucket === "google"
    ? `"${state.googleFontFamily}", sans-serif`
    : (SYSTEM_FONTS[state.systemFontIdx]?.css ?? "inherit");
}

function buildShadow(state: { shadowEnabled: boolean; shadowX: number; shadowY: number; shadowBlur: number; shadowSpread: number; shadowColor: string; shadowOpacity: number }): string {
  if (!state.shadowEnabled) return "none";
  const hex = Math.round(state.shadowOpacity * 255).toString(16).padStart(2, "0");
  return `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}${hex}`;
}

function buildRadius(state: { radiusLinked: boolean; radius: number; radiusTL: number; radiusTR: number; radiusBR: number; radiusBL: number }): string {
  return state.radiusLinked
    ? `${state.radius}px`
    : `${state.radiusTL}px ${state.radiusTR}px ${state.radiusBR}px ${state.radiusBL}px`;
}

function shell(state: MegaMenuState): CSSProperties {
  return {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    borderRadius: buildRadius(state),
    border: `${state.borderWidth}px ${state.borderStyle} ${state.disabled && state.disabledUseCustomColors ? state.disabledBorder : state.border}`,
    boxShadow: buildShadow(state),
    background: state.disabled && state.disabledUseCustomColors ? state.disabledBg : state.background,
    color: state.foreground,
    fontFamily: resolveFont(state),
    fontStyle: state.fontStyle,
    textTransform: state.textTransform,
    textDecoration: state.textDecoration,
    letterSpacing: `${state.letterSpacing}${state.letterSpacingUnit}`,
    lineHeight: state.lineHeight,
    opacity: state.disabled ? state.disabledOpacity : 1,
    cursor: state.disabled ? state.disabledCursor : undefined,
    transition: state.transitionDuration > 0 ? "opacity 0.2s ease" : undefined,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function LivePreview({ state }: { state: MegaMenuState }) {
  const columns = Array.from({ length: clamp(state.columnCount, 1, 6) }, (_, index) => index);
  const groups = Array.from({ length: clamp(state.groupCount, 1, 12) }, (_, index) => index);
  const panelId = `${state.id}-panel`;
  const isExpanded = state.previewState !== "closed";
  const groupsPerColumn = Math.max(1, Math.ceil(groups.length / columns.length));
  const [triggerHover, setTriggerHover] = useState(false);
  const [linkHover, setLinkHover] = useState("");

  return (
    <nav id={state.id} aria-label={state.ariaLabel} style={shell(state)} className="grid content-start gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a href="#top" className="rounded-xl text-sm font-black tracking-tight" style={{ color: state.foreground }}>
          {state.title}
        </a>
        <button
          type="button"
          disabled={state.disabled}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onMouseEnter={() => setTriggerHover(true)}
          onMouseLeave={() => setTriggerHover(false)}
          className="rounded-full px-4 py-2 text-sm font-bold"
          style={{ background: triggerHover ? state.triggerHoverBg : state.accent, color: isExpanded ? state.triggerActiveColor : state.actionText, transition: state.transitionDuration > 0 ? "opacity 0.15s ease, transform 0.15s ease" : undefined }}
        >
          {state.label}
        </button>
      </div>

      {isExpanded && (
        <div id={panelId} className="grid gap-4 border p-4" style={{ borderColor: state.panelBorder, borderRadius: state.panelRadius, background: state.panelBg, boxShadow: state.panelShadow }}>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
            {columns.map((column) => {
              const columnGroups = groups.slice(column * groupsPerColumn, column * groupsPerColumn + groupsPerColumn);
              return (
                <div key={column} className="grid content-start gap-4" style={{ borderRight: column < columns.length - 1 ? `1px solid ${state.columnDividerColor}` : undefined, paddingRight: column < columns.length - 1 ? 16 : 0 }}>
                  {columnGroups.map((group) => {
                    const headingId = `${panelId}-group-${group + 1}`;
                    return (
                      <section key={group} aria-labelledby={headingId} className="grid gap-2">
                        <h3 id={headingId} className="uppercase tracking-[0.18em]" style={{ color: state.categoryHeaderColor, fontSize: state.categoryHeaderSize, fontWeight: state.categoryHeaderWeight }}>
                          Group {group + 1}
                        </h3>
                        <ul className="grid gap-2">
                          {[1, 2, 3].map((item) => {
                            const linkKey = `${group}-${item}`;
                            const hovered = linkHover === linkKey;
                            return (
                              <li key={item}>
                                <a
                                  href={`#mega-link-${group + 1}-${item}`}
                                  onMouseEnter={() => setLinkHover(linkKey)}
                                  onMouseLeave={() => setLinkHover("")}
                                  className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"
                                  style={{ borderColor: state.panelBorder, color: hovered ? state.linkHoverColor : state.linkColor, background: hovered ? state.linkHoverBg : "transparent" }}
                                >
                                  <svg aria-hidden="true" width={state.iconSize} height={state.iconSize} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><circle cx="7" cy="7" r="5" stroke={state.iconColor} strokeWidth="1.6" /></svg>
                                  <span className="flex-1">{state.label} {group + 1}.{item}</span>
                                  {item === 1 ? <span className="rounded-full px-1.5 text-[10px] font-bold" style={{ background: state.badgeBg, color: state.badgeText }}>New</span> : null}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {state.featuredPanel && (
            <aside className="border p-4" style={{ borderColor: state.featuredBorder, borderRadius: state.featuredRadius, background: state.featuredBg, color: state.featuredText }}>
              <p className="text-sm font-bold">{state.description}</p>
              <a href="#featured" className="mt-3 inline-flex rounded-full px-4 py-2 text-sm font-bold" style={{ background: state.accent, color: state.actionText }}>
                Featured link
              </a>
            </aside>
          )}
        </div>
      )}

      <p className="text-xs" style={{ padding: "8px 12px", background: state.footerBg, borderTop: `1px solid ${state.footerBorder}`, color: state.footerText }}>
        Trigger mode: {state.triggerMode}. Export implements native button Enter/Space toggling, Escape dismissal, and outside-click dismissal.
      </p>
    </nav>
  );
}
