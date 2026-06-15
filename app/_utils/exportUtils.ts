import type { MegaMenuState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: MegaMenuState, fileName = "mega-menu"): ExportPayload {
  return { fileName: `${fileName || "mega-menu"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: MegaMenuState) {
  return `import * as React from "react";

const state = ${JSON.stringify(state, null, 2)};
function resolveFont(s) { return s.fontBucket === "google" ? '"' + s.googleFontFamily + '", sans-serif' : "inherit"; }
function buildShadow(s) { if (!s.shadowEnabled) return "none"; var hex = Math.round(s.shadowOpacity * 255).toString(16).padStart(2, "0"); return s.shadowX + "px " + s.shadowY + "px " + s.shadowBlur + "px " + s.shadowSpread + "px " + s.shadowColor + hex; }


function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function MegaMenuComponent() {
  const [expanded, setExpanded] = React.useState(state.previewState !== "closed");
  const [triggerHover, setTriggerHover] = React.useState(false);
  const [linkHover, setLinkHover] = React.useState("");
  const rootRef = React.useRef(null);
  const panelId = state.id + "-panel";
  const columns = Array.from({ length: clamp(state.columnCount, 1, 6) }, (_, index) => index);
  const groups = Array.from({ length: clamp(state.groupCount, 1, 12) }, (_, index) => index);
  const groupsPerColumn = Math.max(1, Math.ceil(groups.length / columns.length));
  const triggerHandlers = state.triggerMode === "hover"
    ? { onMouseEnter: () => setExpanded(true), onMouseLeave: () => setExpanded(false) }
    : state.triggerMode === "focus"
      ? {
          onFocus: () => setExpanded(true),
          onBlur: (event) => {
            const nextTarget = event.relatedTarget;
            if (!nextTarget || !event.currentTarget.contains(nextTarget)) setExpanded(false);
          },
        }
      : {};

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") setExpanded(false);
    }

    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setExpanded(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <nav
      ref={rootRef}
      {...triggerHandlers}
      id={state.id}
      aria-label={state.ariaLabel}
      style={{
        width: state.width,
        minHeight: state.height,
        padding: state.padding,
        borderRadius: state.radius,
        border: state.borderWidth + "px " + state.borderStyle + " " + (state.disabled && state.disabledUseCustomColors ? state.disabledBorder : state.border),
        boxShadow: buildShadow(state),
        background: state.background,
        color: state.foreground,
        fontFamily: resolveFont(state),
        opacity: state.disabled ? (state.disabledOpacity ?? 0.5) : 1,
cursor: state.disabled ? state.disabledCursor : undefined,
        transition: state.transitionDuration > 0 ? "all " + state.transitionDuration + "ms " + state.transitionEasing : "none",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <a href="#top" style={{ color: state.foreground, fontWeight: 900, textDecoration: "none" }}>{state.title}</a>
        <button
          type="button"
          disabled={state.disabled}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((value) => !value)}
          onMouseEnter={() => setTriggerHover(true)}
          onMouseLeave={() => setTriggerHover(false)}
          style={{ border: 0, borderRadius: 999, padding: "10px 16px", background: triggerHover ? state.triggerHoverBg : state.accent, color: expanded ? state.triggerActiveColor : state.actionText, fontWeight: 800, transition: state.transitionDuration > 0 ? "all " + state.transitionDuration + "ms " + state.transitionEasing : "none" }}
        >
          {state.label}
        </button>
      </div>

      {expanded && (
        <div id={panelId} style={{ display: "grid", gap: 16, marginTop: 20, padding: 16, border: "1px solid " + state.panelBorder, borderRadius: state.panelRadius, background: state.panelBg, boxShadow: state.panelShadow }}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(" + columns.length + ", minmax(0, 1fr))" }}>
            {columns.map((column) => {
              const columnGroups = groups.slice(column * groupsPerColumn, column * groupsPerColumn + groupsPerColumn);
              return (
                <div key={column} style={{ display: "grid", alignContent: "start", gap: 16, borderRight: column < columns.length - 1 ? "1px solid " + state.columnDividerColor : undefined, paddingRight: column < columns.length - 1 ? 16 : 0 }}>
                  {columnGroups.map((group) => {
                    const headingId = panelId + "-group-" + (group + 1);
                    return (
                      <section key={group} aria-labelledby={headingId}>
                        <h3 id={headingId} style={{ color: state.categoryHeaderColor, fontSize: state.categoryHeaderSize, fontWeight: state.categoryHeaderWeight, letterSpacing: ".18em", textTransform: "uppercase" }}>Group {group + 1}</h3>
                        <ul style={{ display: "grid", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
                          {[1, 2, 3].map((item) => {
                            const linkKey = group + "-" + item;
                            const hovered = linkHover === linkKey;
                            return (
                              <li key={item}>
                                <a href={"#mega-link-" + (group + 1) + "-" + item} onMouseEnter={() => setLinkHover(linkKey)} onMouseLeave={() => setLinkHover("")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", border: "1px solid " + state.panelBorder, borderRadius: 12, color: hovered ? state.linkHoverColor : state.linkColor, background: hovered ? state.linkHoverBg : "transparent", textDecoration: "none" }}>
                                  <svg aria-hidden="true" width={state.iconSize} height={state.iconSize} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><circle cx="7" cy="7" r="5" stroke={state.iconColor} strokeWidth="1.6" /></svg>
                                  <span style={{ flex: 1 }}>{state.label} {group + 1}.{item}</span>
                                  {item === 1 ? <span style={{ borderRadius: 999, padding: "0 6px", fontSize: 10, fontWeight: 700, background: state.badgeBg, color: state.badgeText }}>New</span> : null}
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
            <aside style={{ padding: 16, border: "1px solid " + state.featuredBorder, borderRadius: state.featuredRadius, background: state.featuredBg, color: state.featuredText }}>
              <p style={{ margin: 0, fontWeight: 800 }}>{state.description}</p>
              <a href="#featured" style={{ display: "inline-flex", marginTop: 12, padding: "10px 16px", borderRadius: 999, background: state.accent, color: state.actionText, fontWeight: 800, textDecoration: "none" }}>Featured link</a>
            </aside>
          )}
        </div>
      )}

      <p style={{ marginTop: 20, padding: "8px 12px", background: state.footerBg, borderTop: "1px solid " + state.footerBorder, color: state.footerText, fontSize: 12 }}>Trigger mode: {state.triggerMode}.</p>
    </nav>
  );
}
`;
}
