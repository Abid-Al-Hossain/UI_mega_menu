"use client";

import type { CSSProperties } from "react";
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
    border: `${state.borderWidth}px ${state.borderStyle} ${state.border}`,
    boxShadow: buildShadow(state),
    background: state.background,
    color: state.foreground,
    fontFamily: resolveFont(state),
    fontStyle: state.fontStyle,
    textTransform: state.textTransform,
    textDecoration: state.textDecoration,
    letterSpacing: `${state.letterSpacing}${state.letterSpacingUnit}`,
    lineHeight: state.lineHeight,
    opacity: state.disabled ? 0.55 : 1,
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
          className="rounded-full px-4 py-2 text-sm font-bold"
          style={{ background: state.accent, color: "#020617", transition: state.transitionDuration > 0 ? "opacity 0.15s ease, transform 0.15s ease" : undefined }}
        >
          {state.label}
        </button>
      </div>

      {isExpanded && (
        <div id={panelId} className="grid gap-4 rounded-3xl border p-4" style={{ borderColor: state.border, background: "rgba(255,255,255,.05)" }}>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
            {columns.map((column) => {
              const columnGroups = groups.slice(column * groupsPerColumn, column * groupsPerColumn + groupsPerColumn);
              return (
                <div key={column} className="grid content-start gap-4">
                  {columnGroups.map((group) => {
                    const headingId = `${panelId}-group-${group + 1}`;
                    return (
                      <section key={group} aria-labelledby={headingId} className="grid gap-2">
                        <h3 id={headingId} className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: state.accent }}>
                          Group {group + 1}
                        </h3>
                        <ul className="grid gap-2">
                          {[1, 2, 3].map((item) => (
                            <li key={item}>
                              <a href={`#mega-link-${group + 1}-${item}`} className="block rounded-xl border px-3 py-2 text-sm" style={{ borderColor: state.border, color: state.foreground }}>
                                {state.label} {group + 1}.{item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </section>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {state.featuredPanel && (
            <aside className="rounded-2xl border p-4" style={{ borderColor: state.border, background: "rgba(255,255,255,.07)" }}>
              <p className="text-sm font-bold">{state.description}</p>
              <a href="#featured" className="mt-3 inline-flex rounded-full px-4 py-2 text-sm font-bold" style={{ background: state.accent, color: "#020617" }}>
                Featured link
              </a>
            </aside>
          )}
        </div>
      )}

      <p className="text-xs" style={{ color: state.muted }}>
        Trigger mode: {state.triggerMode}. Export implements native button Enter/Space toggling, Escape dismissal, and outside-click dismissal.
      </p>
    </nav>
  );
}
