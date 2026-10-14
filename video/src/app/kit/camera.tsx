// Port of content/Camera.tsx: ProofCamera (corners, object + gesture, scan line, status pill) and Shutter.
// `photo` (optional) is a live "viewfinder" image layer: the film shows a rendered scene in the frame.
import React from "react";
import type { ReactNode } from "react";
import { View } from "../rn";
import { color, metrics, space } from "../theme";
import { Icon, Loop, PressScale, Shake, Text, E, useMs } from "../motion";

export const GESTURES: Record<string, { icon: string; label: string }> = {
  peace: { icon: "hand-peace", label: "victory sign" }, palm: { icon: "hand-back-right", label: "open palm" }, thumb: { icon: "thumb-up", label: "thumbs up" },
};
export type CameraState = "idle" | "check" | "fail" | "review" | "scan" | "off";
const STATE: Record<CameraState, { corner: string; pillBg: string; pillFg: string; icon: string; scan?: boolean; spin?: boolean }> = {
  idle: { corner: color.extra.camCornerIdle, pillBg: color.extra.camPill, pillFg: color.text.primary, icon: "target" },
  check: { corner: color.lime.base, pillBg: color.extra.camPillCheck, pillFg: color.lime.base, icon: "loading", scan: true, spin: true },
  fail: { corner: color.red.base, pillBg: color.red.base, pillFg: color.text.onLime, icon: "close-circle-outline" },
  review: { corner: color.violet.base, pillBg: color.violet.base, pillFg: color.text.onLime, icon: "eye-outline" },
  scan: { corner: color.lime.base, pillBg: color.extra.camPill, pillFg: color.text.primary, icon: "qrcode-scan", scan: true },
  off: { corner: color.line.toggleOff, pillBg: color.surface[4], pillFg: color.text.muted, icon: "camera-off-outline" },
};

export function ProofCamera({ photo, object, gesture, state, label, height = metrics.camera.height, failAt, children }: { photo?: 1 | 2; object: string; gesture?: string; state: CameraState; label: string; height?: number; failAt?: number; children?: ReactNode }) {
  const ms = useMs();
  const c = metrics.camera;
  const s = STATE[state];
  const objSize = height >= c.objectBigFrom ? c.objectBig : c.objectSmall;
  const g = gesture ? GESTURES[gesture] : undefined;
  const corner = (pos: object, widths: object, radii: object) => <View style={{ position: "absolute", width: c.corner, height: c.corner, borderColor: s.corner, ...pos, ...widths, ...radii }} />;
  const scanY = height * 0.14 + height * 0.7 * E.inOut(((ms / 1500) % 2) < 1 ? (ms / 1500) % 1 : 1 - ((ms / 1500) % 1));
  return (
    <View style={{ height, borderRadius: c.radius, backgroundImage: `radial-gradient(75% 75% at 50% 45%, ${color.extra.camGradient[0]}, ${color.extra.camGradient[1]})`, overflow: "hidden" }}>
      <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: c.radius, overflow: "hidden" }}>
        {children ?? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: objSize, height: objSize }}>
              <View style={state === "review" ? { filter: "blur(1.2px)" } : undefined}><Icon name={object} size={objSize} color={state === "off" ? color.line.toggleOff : color.extra.camObject} /></View>
              {g ? (
                <Shake at={failAt} style={{ position: "absolute", right: c.gestureRight, bottom: c.gestureBottom }}>
                  <View style={{ width: c.gesture, height: c.gesture, borderRadius: c.gesture / 2, backgroundColor: color.text.primary, alignItems: "center", justifyContent: "center", transform: [{ rotate: `${c.gestureTilt}deg` }], boxShadow: "0 8px 20px rgba(0,0,0,0.5)" }}>
                    <Icon name={g.icon} size={c.gestureIcon} color={color.text.onLime} />
                  </View>
                </Shake>
              ) : null}
            </View>
          </View>
        )}
      </View>
      {photo ? (
        <View style={{ position: "absolute", left: c.photoPillInset, top: c.photoPillInset, height: c.photoPillH, paddingHorizontal: c.photoPillPad, borderRadius: c.photoPillH / 2, backgroundColor: color.extra.camPhotoPill, flexDirection: "row", alignItems: "center", gap: space[6] }}>
          <Icon name="camera-outline" size={15} />
          <Text variant="chip">{`Photo ${photo} of 2`}</Text>
        </View>
      ) : null}
      {corner({ left: c.cornerInset, top: c.cornerInset }, { borderTopWidth: c.cornerStroke, borderLeftWidth: c.cornerStroke }, { borderTopLeftRadius: c.cornerRadius })}
      {corner({ right: c.cornerInset, top: c.cornerInset }, { borderTopWidth: c.cornerStroke, borderRightWidth: c.cornerStroke }, { borderTopRightRadius: c.cornerRadius })}
      {corner({ left: c.cornerInset, bottom: c.cornerInset }, { borderBottomWidth: c.cornerStroke, borderLeftWidth: c.cornerStroke }, { borderBottomLeftRadius: c.cornerRadius })}
      {corner({ right: c.cornerInset, bottom: c.cornerInset }, { borderBottomWidth: c.cornerStroke, borderRightWidth: c.cornerStroke }, { borderBottomRightRadius: c.cornerRadius })}
      {s.scan ? <View style={{ position: "absolute", top: scanY, left: c.scanInset, right: c.scanInset, height: 2, backgroundColor: color.lime.base, boxShadow: `0 0 16px 4px ${color.lime.ring45}` }} /> : null}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: c.pillBottom, alignItems: "center" }}>
        <View style={{ height: c.pillH, paddingHorizontal: c.pillPadX, borderRadius: c.pillH / 2, backgroundColor: s.pillBg, flexDirection: "row", alignItems: "center", gap: space[6] }}>
          {s.spin ? <Loop kind="spin"><Icon name={s.icon} size={16} color={s.pillFg} /></Loop> : <Icon name={s.icon} size={16} color={s.pillFg} />}
          <Text variant="chipMd" color={s.pillFg} numberOfLines={1}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

export function Shutter({ press }: { press?: number }) {
  const s = metrics.shutter;
  const side = { width: s.side, height: s.side, borderRadius: s.side / 2, backgroundColor: color.surface[2], alignItems: "center", justifyContent: "center" };
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: s.padTop, paddingHorizontal: s.padX }}>
      <View style={side}><Icon name="flash-off" size={22} color={color.text.tertiary} /></View>
      <PressScale press={press} scale={s.pressScale}>
        <View style={{ width: s.outer, height: s.outer, borderRadius: s.outer / 2, boxShadow: `inset 0 0 0 ${s.ring}px ${color.text.primary}`, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: s.inner, height: s.inner, borderRadius: s.inner / 2, backgroundColor: color.text.primary }} />
        </View>
      </PressScale>
      <View style={side}><Icon name="camera-flip-outline" size={22} /></View>
    </View>
  );
}
