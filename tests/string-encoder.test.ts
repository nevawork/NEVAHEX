import { lex } from "../src/lexer/Lexer.js";
import { parse } from "../src/parser/Parser.js";
import { obfuscate } from "../src/obfuscator/index.js";
import { encodeStrings } from "../src/obfuscator/StringEncoder.js";
import { regCompile } from "../src/vm/RegCompiler.js";
import { generateRegVM } from "../src/vm/reg-vm-gen.js";
import { runLua } from "./lua-runner.js";

function runWithEncoder(src: string, withEncode: boolean): { rc: number; out: string[]; err: string } {
  const { tokens } = lex(src);
  const ast = parse(tokens);
  let obfAst = obfuscate(ast, { target: "luau", renameLocals: true, preserveGlobals: true });
  if (withEncode) obfAst = encodeStrings(obfAst, { enabled: true });
  const chunk = regCompile(obfAst);
  const vmOutput = generateRegVM(chunk, { level: "debug", polymorphicSeed: 1, target: "luau" });
  const r = runLua(vmOutput, {}, { debugMode: true });
  return { rc: r.rc, out: r.output, err: r.err };
}

describe("String Encoder", () => {
  test("encodes and decodes simple strings", () => {
    const r = runWithEncoder(`print("hello")`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("hello"))).toBe(true);
  });

  test("encodes multiple strings", () => {
    const r = runWithEncoder(`print("foo", "bar", "baz")`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("foo") && l.includes("bar") && l.includes("baz"))).toBe(true);
  });

  test("encodes strings with special characters", () => {
    const r = runWithEncoder(`print("hello\\nworld\\t!")`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("hello") && l.includes("world"))).toBe(true);
  });

  test("does not break runtime", () => {
    const r = runWithEncoder(`
local s = "test string"
print(s .. " with " .. "concat")
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("test string with concat"))).toBe(true);
  });

  test("obfuscated source does not contain plain string in declaration", async () => {
    const { tokens } = lex(`local s = "secret123"`);
    const ast = parse(tokens);
    const obfAst = obfuscate(ast, { target: "luau" });
    const enc = encodeStrings(obfAst, { enabled: true });
    const { printChunk } = await import("../src/obfuscator/Printer.js");
    const out = printChunk(enc);
    expect(out).not.toMatch(/"secret123"/);
  });
});
