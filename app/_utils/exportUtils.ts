import type { MegaMenuState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: MegaMenuState, fileName = "mega-menu"): ExportPayload {
  return { fileName: `${fileName || "mega-menu"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: MegaMenuState) {
  return `import * as React from "react";

const state = ${JSON.stringify(state, null, 2)};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function MegaMenuComponent() {
  const [expanded, setExpanded] = React.useState(state.previewState !== "closed");
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
        border: state.borderWidth + "px solid " + state.border,
        boxShadow: "0 " + Math.round(state.shadow / 3) + "px " + state.shadow + "px rgba(0,0,0,.28)",
        background: state.background,
        color: state.foreground,
        fontFamily: state.fontFamily,
        opacity: state.disabled ? 0.55 : 1,
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
          style={{ border: 0, borderRadius: 999, padding: "10px 16px", background: state.accent, color: "#020617", fontWeight: 800 }}
        >
          {state.label}
        </button>
      </div>

      {expanded && (
        <div id={panelId} style={{ display: "grid", gap: 16, marginTop: 20, padding: 16, border: "1px solid " + state.border, borderRadius: 24, background: "rgba(255,255,255,.05)" }}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(" + columns.length + ", minmax(0, 1fr))" }}>
            {columns.map((column) => {
              const columnGroups = groups.slice(column * groupsPerColumn, column * groupsPerColumn + groupsPerColumn);
              return (
                <div key={column} style={{ display: "grid", alignContent: "start", gap: 16 }}>
                  {columnGroups.map((group) => {
                    const headingId = panelId + "-group-" + (group + 1);
                    return (
                      <section key={group} aria-labelledby={headingId}>
                        <h3 id={headingId} style={{ color: state.accent, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase" }}>Group {group + 1}</h3>
                        <ul style={{ display: "grid", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
                          {[1, 2, 3].map((item) => (
                            <li key={item}>
                              <a href={"#mega-link-" + (group + 1) + "-" + item} style={{ display: "block", padding: "10px 12px", border: "1px solid " + state.border, borderRadius: 12, color: state.foreground, textDecoration: "none" }}>
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
            <aside style={{ padding: 16, border: "1px solid " + state.border, borderRadius: 16, background: "rgba(255,255,255,.07)" }}>
              <p style={{ margin: 0, fontWeight: 800 }}>{state.description}</p>
              <a href="#featured" style={{ display: "inline-flex", marginTop: 12, padding: "10px 16px", borderRadius: 999, background: state.accent, color: "#020617", fontWeight: 800, textDecoration: "none" }}>Featured link</a>
            </aside>
          )}
        </div>
      )}
    </nav>
  );
}
`;
}
