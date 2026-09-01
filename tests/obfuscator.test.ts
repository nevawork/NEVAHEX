import { lex } from "../src/lexer/Lexer.js";
import { parse } from "../src/parser/Parser.js";
import { obfuscate, printChunk } from "../src/obfuscator/index.js";

function obf(source: string, opts: any = {}) {
  const { tokens } = lex(source);
  const ast = parse(tokens);
  return printChunk(obfuscate(ast, { target: "luau", renameLocals: true, preserveGlobals: true, ...opts }));
}

describe("Obfuscator", () => {
  test("renames local variables", () => {
    const out = obf("local foo = 1\nlocal bar = 2\nprint(foo + bar)");
    expect(out).not.toContain("local foo =");
    expect(out).not.toContain("local bar =");
  });

  test("preserves Roblox globals", () => {
    const out = obf("local x = game.Players.LocalPlayer.Character");
    expect(out).toContain("game");
    expect(out).toContain("Players");
  });

  test("preserves standard library", () => {
    const out = obf("print(string.format(\"%d\", 42))");
    expect(out).toContain("print");
    expect(out).toContain("string");
  });

  test("handles nested scopes", () => {
    const out = obf("local x = 1; do local x = 2; print(x) end; print(x)");
    expect(out).not.toContain("local x = 1;");
  });

  test("preserves for loop variable in scope", () => {
    const out = obf("for i=1,10 do print(i) end");
    expect(out).toMatch(/for /);
  });

  test("seed produces deterministic output", () => {
    const src = "local a = 1; local b = 2; local c = 3";
    const a = obf(src, { seed: 42 });
    const b = obf(src, { seed: 42 });
    const c = obf(src, { seed: 12345 });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  test("different rename length than original", () => {
    const out = obf("local longVariableName123 = 42");
    expect(out.length).toBeLessThan(40);
  });

  test("handles function parameters as locals", () => {
    const out = obf("local function f(a, b, c) return a + b + c end");
    expect(out).toMatch(/function /);
  });

  test("handles method self correctly", () => {
    const out = obf("local obj = {}; function obj:method() return self end");
    expect(out).toContain("self");
  });

  test("does not rename type annotations", () => {
    const out = obf("local x: number = 1");
    expect(out).toContain(": number");
  });
});
