import { lex } from "../src/lexer/Lexer.js";
import { parse } from "../src/parser/Parser.js";
import { obfuscate } from "../src/obfuscator/index.js";
import { regCompile } from "../src/vm/RegCompiler.js";
import { generateRegVM } from "../src/vm/reg-vm-gen.js";
import { runLua } from "./lua-runner.js";
import { DEFAULT_TARGET, isValidTarget, featuresFor } from "../src/targets.js";

function runObfuscated(src: string, target: any): { rc: number; out: string[]; err: string } {
  const { tokens } = lex(src);
  const ast = parse(tokens);
  const obfAst = obfuscate(ast, { target, renameLocals: true, preserveGlobals: true });
  const chunk = regCompile(obfAst);
  const vmOutput = generateRegVM(chunk, { level: "debug", polymorphicSeed: 1, target });
  const r = runLua(vmOutput, {}, { debugMode: true });
  return { rc: r.rc, out: r.output, err: r.err };
}

describe("Multi-target support", () => {
  test("DEFAULT_TARGET is luau", () => {
    expect(DEFAULT_TARGET).toBe("luau");
  });

  test("isValidTarget accepts all 5 targets", () => {
    expect(isValidTarget("lua51")).toBe(true);
    expect(isValidTarget("lua52")).toBe(true);
    expect(isValidTarget("lua53")).toBe(true);
    expect(isValidTarget("lua54")).toBe(true);
    expect(isValidTarget("luau")).toBe(true);
  });

  test("isValidTarget rejects invalid targets", () => {
    expect(isValidTarget("foo")).toBe(false);
    expect(isValidTarget("")).toBe(false);
  });

  test("featuresFor has correct flags per target", () => {
    expect(featuresFor("lua51").goto).toBe(false);
    expect(featuresFor("lua52").goto).toBe(true);
    expect(featuresFor("lua51").bitwiseOps).toBe(false);
    expect(featuresFor("lua53").bitwiseOps).toBe(true);
    expect(featuresFor("lua53").floorDiv).toBe(true);
    expect(featuresFor("luau").hasContinue).toBe(true);
    expect(featuresFor("lua54").constAttribute).toBe(true);
    expect(featuresFor("luau").stringInterpolation).toBe(true);
  });

  test("lua51 target runs basic Lua 5.1 program", () => {
    const r = runObfuscated(`
local function f(n)
  if n <= 1 then return 1 end
  return n * f(n-1)
end
print(f(5))
`, "lua51");
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "120")).toBe(true);
  });

  test("lua54 target runs basic Lua 5.4 program", () => {
    const r = runObfuscated(`
local function f(n)
  if n <= 1 then return 1 end
  return n * f(n-1)
end
print(f(5))
`, "lua54");
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "120")).toBe(true);
  });

  test("luau target runs Luau program with interpolation", () => {
    const r = runObfuscated(`
local name = "Lua"
print(\`Hello {name}\`)
`, "luau");
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("Hello Lua"))).toBe(true);
  });
});
