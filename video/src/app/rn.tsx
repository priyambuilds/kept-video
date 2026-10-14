// A tiny React Native → DOM layer, so the app's components (frontend/src/components) can be ported with
// their style objects intact: View is a flex column with RN's defaults, Text resolves a type token, and
// RN style quirks (transform arrays, paddingHorizontal, fontVariant, numeric font names) become CSS.
import React from "react";
import type { CSSProperties, ReactNode } from "react";

export type RNStyle = Record<string, unknown>;
export type StyleProp = RNStyle | null | undefined | false | StyleProp[];

const UNITLESS = new Set(["flex", "flexGrow", "flexShrink", "opacity", "zIndex", "fontWeight", "aspectRatio", "scale"]);

export function flatten(s: StyleProp): RNStyle {
  if (!s) return {};
  if (Array.isArray(s)) return Object.assign({}, ...s.map(flatten));
  return s as RNStyle;
}

function transformCss(t: unknown): string | undefined {
  if (typeof t === "string") return t;
  if (!Array.isArray(t)) return undefined;
  return t.map((o: Record<string, unknown>) => {
    const [k, v] = Object.entries(o)[0];
    if (k === "translateX" || k === "translateY") return `${k}(${typeof v === "number" ? `${v}px` : v})`;
    if (k === "matrix") return `matrix(${(v as number[]).join(",")})`;
    return `${k}(${v})`;
  }).join(" ");
}

/** RN style → CSS. */
export function css(style: StyleProp): CSSProperties {
  const s = flatten(style);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(s)) {
    if (v === undefined || v === null) continue;
    switch (k) {
      case "paddingHorizontal": out.paddingLeft = v; out.paddingRight = v; break;
      case "paddingVertical": out.paddingTop = v; out.paddingBottom = v; break;
      case "marginHorizontal": out.marginLeft = v; out.marginRight = v; break;
      case "marginVertical": out.marginTop = v; out.marginBottom = v; break;
      case "transform": out.transform = transformCss(v); break;
      case "fontVariant": out.fontVariantNumeric = (v as string[]).join(" "); break;
      case "includeFontPadding": case "textAlignVertical": case "elevation": case "shadowColor": case "shadowOpacity": case "shadowRadius": case "shadowOffset": break;
      case "textShadowColor": out.textShadow = `0 0 ${s.textShadowRadius ?? 0}px ${v}`; break;
      case "textShadowRadius": break;
      case "flex":
        if (typeof v === "number" && v <= 0) { out.flexGrow = 0; out.flexShrink = v < 0 ? 1 : 0; out.flexBasis = "auto"; }
        else if (typeof v === "number") {
          out.flexGrow = v; out.flexShrink = 1; out.flexBasis = "0%";
          // RN (yoga) keeps an explicit size on a flex item whose parent has no size; CSS would collapse it.
          if (typeof s.height === "number" && s.minHeight === undefined) out.minHeight = `${s.height}px`;
          if (typeof s.width === "number" && s.minWidth === undefined) out.minWidth = `${s.width}px`;
        } else out.flex = v;
        break;
      case "fontFamily": {
        const m = String(v).match(/^(Geist(?:Mono)?)_(\d)00/);
        if (m) { out.fontFamily = m[1] === "GeistMono" ? "Geist Mono" : "Geist"; out.fontWeight = Number(m[2]) * 100; } else out.fontFamily = v;
        break;
      }
      case "filter": out.filter = Array.isArray(v) ? v.map((f: Record<string, number>) => `blur(${f.blur}px)`).join(" ") : v; break;
      default:
        out[k] = typeof v === "number" && !UNITLESS.has(k) ? `${v}px` : v;
    }
  }
  return out as CSSProperties;
}

const VIEW_BASE: CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "stretch", flexShrink: 0, position: "relative",
  boxSizing: "border-box", minWidth: 0, minHeight: 0, borderStyle: "solid", borderWidth: 0,
};

export function View({ style, children, pointerEvents }: { style?: StyleProp; children?: ReactNode; pointerEvents?: string; [k: string]: unknown }) {
  return <div style={{ ...VIEW_BASE, ...css(style), ...(pointerEvents === "none" ? { pointerEvents: "none" } : {}) }}>{children}</div>;
}

const InText = React.createContext(false);
export function RNText({ style, children, numberOfLines }: { style?: StyleProp; children?: ReactNode; numberOfLines?: number; [k: string]: unknown }) {
  const nested = React.useContext(InText);
  const c = css(style);
  const clamp: CSSProperties = numberOfLines === 1 ? { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
    : numberOfLines ? { display: "-webkit-box", WebkitLineClamp: numberOfLines, WebkitBoxOrient: "vertical", overflow: "hidden" } : {};
  return (
    <InText.Provider value>
      <span style={{ display: nested ? "inline" : "block", position: nested ? undefined : "relative", whiteSpace: "pre-wrap", flexShrink: 0, margin: 0, ...c, ...clamp }}>{children}</span>
    </InText.Provider>
  );
}

export const StyleSheet = { absoluteFill: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 } as RNStyle };
