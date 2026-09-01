export type Target = "lua51" | "lua52" | "lua53" | "lua54" | "luau";

export const TARGETS: Target[] = ["lua51", "lua52", "lua53", "lua54", "luau"];

export function isValidTarget(t: string): t is Target {
  return (TARGETS as string[]).includes(t);
}

export interface TargetFeatures {
  bitwiseOps: boolean;
  integers: boolean;
  floorDiv: boolean;
  goto: boolean;
  toBeClosed: boolean;
  constAttribute: boolean;
  integerDivision: boolean;
  hexFloats: boolean;
  utf8Lib: boolean;
  bit32Lib: boolean;
  loadstring: boolean;
  getfenv: boolean;
  hasContinue: boolean;
  compoundAssign: boolean;
  stringInterpolation: boolean;
  typeAnnotations: boolean;
  ifElseExpression: boolean;
  generalizedIteration: boolean;
  bufferType: boolean;
  taskLib: boolean;
  coroutineClose: boolean;
  userdata: boolean;
}

export function featuresFor(target: Target): TargetFeatures {
  switch (target) {
    case "lua51":
      return {
        bitwiseOps: false, integers: false, floorDiv: false, goto: false,
        toBeClosed: false, constAttribute: false, integerDivision: false,
        hexFloats: false, utf8Lib: false, bit32Lib: false,
        loadstring: true, getfenv: true, hasContinue: false, compoundAssign: false,
        stringInterpolation: false, typeAnnotations: false, ifElseExpression: false,
        generalizedIteration: false, bufferType: false, taskLib: false,
        coroutineClose: false, userdata: false,
      };
    case "lua52":
      return {
        bitwiseOps: false, integers: false, floorDiv: false, goto: true,
        toBeClosed: false, constAttribute: false, integerDivision: false,
        hexFloats: false, utf8Lib: false, bit32Lib: true,
        loadstring: true, getfenv: false, hasContinue: false, compoundAssign: false,
        stringInterpolation: false, typeAnnotations: false, ifElseExpression: false,
        generalizedIteration: false, bufferType: false, taskLib: false,
        coroutineClose: false, userdata: false,
      };
    case "lua53":
      return {
        bitwiseOps: true, integers: true, floorDiv: true, goto: true,
        toBeClosed: false, constAttribute: false, integerDivision: true,
        hexFloats: true, utf8Lib: true, bit32Lib: true,
        loadstring: true, getfenv: false, hasContinue: false, compoundAssign: false,
        stringInterpolation: false, typeAnnotations: false, ifElseExpression: false,
        generalizedIteration: false, bufferType: false, taskLib: false,
        coroutineClose: false, userdata: false,
      };
    case "lua54":
      return {
        bitwiseOps: true, integers: true, floorDiv: true, goto: true,
        toBeClosed: true, constAttribute: true, integerDivision: true,
        hexFloats: true, utf8Lib: true, bit32Lib: true,
        loadstring: false, getfenv: false, hasContinue: false, compoundAssign: false,
        stringInterpolation: false, typeAnnotations: false, ifElseExpression: false,
        generalizedIteration: false, bufferType: false, taskLib: false,
        coroutineClose: true, userdata: false,
      };
    case "luau":
      return {
        bitwiseOps: false, integers: false, floorDiv: true, goto: false,
        toBeClosed: false, constAttribute: false, integerDivision: true,
        hexFloats: false, utf8Lib: true, bit32Lib: true,
        loadstring: true, getfenv: true, hasContinue: true, compoundAssign: true,
        stringInterpolation: true, typeAnnotations: true, ifElseExpression: true,
        generalizedIteration: true, bufferType: true, taskLib: true,
        coroutineClose: true, userdata: true,
      };
  }
}

export interface TargetOption {
  default: Target;
}

export const DEFAULT_TARGET: Target = "luau";

export const TARGET_LABELS: Record<Target, string> = {
  lua51: "Lua 5.1",
  lua52: "Lua 5.2",
  lua53: "Lua 5.3",
  lua54: "Lua 5.4",
  luau: "Roblox Luau",
};
