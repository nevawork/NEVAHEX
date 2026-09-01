import { lex } from "../src/lexer/Lexer.js";
import { parse } from "../src/parser/Parser.js";
import { obfuscate } from "../src/obfuscator/index.js";
import { regCompile } from "../src/vm/RegCompiler.js";
import { generateRegVM } from "../src/vm/reg-vm-gen.js";
import { runLua, makeRobloxEnv } from "./lua-runner.js";

function runObfuscated(src: string, withEnv = false): { rc: number; out: string[]; err: string } {
  const { tokens } = lex(src);
  const ast = parse(tokens);
  const obfAst = obfuscate(ast, { target: "luau", renameLocals: true, preserveGlobals: true });
  const chunk = regCompile(obfAst);
  const vmOutput = generateRegVM(chunk, { level: "debug", polymorphicSeed: 1, target: "luau" });
  const r = runLua(vmOutput, withEnv ? makeRobloxEnv() : {}, { debugMode: true });
  return { rc: r.rc, out: r.output, err: r.err };
}

describe("Roblox Luau target", () => {
  test("preserves Roblox globals (game, workspace)", () => {
    const r = runObfuscated(`
local g = game
local w = workspace
print(type(g), type(w))
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("userdata") || l.includes("table"))).toBe(true);
  });

  test("handles string interpolation", () => {
    const r = runObfuscated(`
local name = "Roblox"
print(\`Hello, {name}!\`)
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("Hello, Roblox!"))).toBe(true);
  });

  test("handles compound assignment", () => {
    const r = runObfuscated(`
local x = 10
x += 5
x -= 3
print(x)
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "12")).toBe(true);
  });

  test("handles if-else expression", () => {
    const r = runObfuscated(`
local x = 5
local y = if x > 3 then "big" else "small"
print(y)
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "big")).toBe(true);
  });

  test("handles type annotations", () => {
    const r = runObfuscated(`
local x: number = 42
local y: string = "hello"
print(x, y)
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("42") && l.includes("hello"))).toBe(true);
  });

  test("handles type alias", () => {
    const r = runObfuscated(`
type Number = number
local x: Number = 100
print(x)
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "100")).toBe(true);
  });

  test("handles continue in loop", () => {
    const r = runObfuscated(`
local sum = 0
for i=1,6 do
  if i % 2 == 0 then continue end
  sum = sum + i
end
print(sum)
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "9")).toBe(true);
  });

  test("handles const declaration", () => {
    const r = runObfuscated(`
const PI = 3.14159
print(PI)
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("3.14"))).toBe(true);
  });

  test("executor globals: hookfunction fallback", () => {
    const r = runObfuscated(`
local g = hookfunction
print("hookfunction type:", type(g))
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("function"))).toBe(true);
  });

  test("executor globals: getrawmetatable fallback", () => {
    const r = runObfuscated(`
local mt = getrawmetatable({})
print(mt)
`, true);
    expect(r.rc).toBe(0);
  });

  test("executor globals: Drawing fallback", () => {
    const r = runObfuscated(`
local d = Drawing and Drawing.new("Square")
print(type(d))
`, true);
    expect(r.rc).toBe(0);
  });

  test("executor globals: checkcaller fallback", () => {
    const r = runObfuscated(`
print(checkcaller())
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "true")).toBe(true);
  });

  test("executor globals: readfile fallback", () => {
    const r = runObfuscated(`
print(readfile("nonexistent.txt"))
`, true);
    expect(r.rc).toBe(0);
  });

  test("executor globals: rconsole fallback", () => {
    const r = runObfuscated(`
rconsole.print("test")
rconsole.clear()
rconsole.create()
print("ok")
`, true);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "ok")).toBe(true);
  });

  test("executor globals: task.wait fallback", () => {
    const r = runObfuscated(`
local t = task.wait(0)
print(type(t))
`, true);
    expect(r.rc).toBe(0);
  });
});
