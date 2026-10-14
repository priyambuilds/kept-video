// Which Keeper script the film plays (v4 = the original transcript, v5 = the rewrite). Launch4 provides it from its
// `script` prop; every act asks for the lines its Keeper speaks, so the mouth, the subtitles and the music ducking
// all follow the same script.
import { createContext, useContext } from "react";
import type { PlacedLine } from "../data/vo";
import { SCRIPTS } from "./timeline";
import type { Role, Script } from "./timeline";

const Ctx = createContext<Script>("v4");
export const ScriptProvider = Ctx.Provider;

export function useScript() {
  const s = SCRIPTS[useContext(Ctx)];
  const say = (role: Role): PlacedLine[] => s.cast[role].map((id) => s.lines.find((l) => l.id === id)!);
  return { lines: s.lines, noSubs: s.noSubs, say };
}
