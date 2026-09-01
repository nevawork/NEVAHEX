import { lex } from "../src/lexer/Lexer.js";
import { parse } from "../src/parser/Parser.js";
import { obfuscate } from "../src/obfuscator/index.js";
import { regCompile } from "../src/vm/RegCompiler.js";
import { generateRegVM } from "../src/vm/reg-vm-gen.js";
import { runLua } from "./lua-runner.js";

function runObfuscated(src: string): { rc: number; out: string[]; err: string } {
  const { tokens } = lex(src);
  const ast = parse(tokens);
  const obfAst = obfuscate(ast, { target: "luau", renameLocals: true, preserveGlobals: true });
  const chunk = regCompile(obfAst);
  const vmOutput = generateRegVM(chunk, { level: "debug", polymorphicSeed: 1, target: "luau" });
  const r = runLua(vmOutput, {}, { debugMode: true });
  return { rc: r.rc, out: r.output, err: r.err };
}

describe("Metamethods", () => {
  test("__add", () => {
    const r = runObfuscated(`
local mt = {__add = function(a, b) return {value = a.value + b.value} end}
local x = setmetatable({value = 1}, mt)
local y = setmetatable({value = 2}, mt)
print((x + y).value)
`);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "3")).toBe(true);
  });

  test("__mul", () => {
    const r = runObfuscated(`
local mt = {__mul = function(a, b) return {value = a.value * b.value} end}
local x = setmetatable({value = 3}, mt)
local y = setmetatable({value = 4}, mt)
print((x * y).value)
`);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "12")).toBe(true);
  });

  test("__tostring", () => {
    const r = runObfuscated(`
local mt = {__tostring = function(t) return "obj(" .. t.id .. ")" end}
local x = setmetatable({id = 42}, mt)
print(tostring(x))
`);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("obj(42)"))).toBe(true);
  });

  test("__index on table", () => {
    const r = runObfuscated(`
local proto = {foo = "from proto"}
local t = setmetatable({}, {__index = proto})
print(t.foo)
`);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("from proto"))).toBe(true);
  });

  test("__newindex on table", () => {
    const r = runObfuscated(`
local t = setmetatable({}, {__newindex = function(t, k, v) rawset(t, "_" .. k, v) end})
t.foo = 42
print(t._foo)
`);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "42")).toBe(true);
  });

  test("__concat", () => {
    const r = runObfuscated(`
local mt = {__concat = function(a, b)
  return tostring(a) .. "|" .. tostring(b)
end}
local x = setmetatable({n=1}, mt)
print(x .. "hello")
`);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("|hello"))).toBe(true);
  });

  test("__eq", () => {
    const r = runObfuscated(`
local mt = {__eq = function(a, b) return a.id == b.id end}
local a = setmetatable({id = 1}, mt)
local b = setmetatable({id = 1}, mt)
print(a == b)
`);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "true")).toBe(true);
  });

  test("__lt", () => {
    const r = runObfuscated(`
local mt = {__lt = function(a, b) return a.n < b.n end}
local a = setmetatable({n=1}, mt)
local b = setmetatable({n=2}, mt)
print(a < b)
`);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "true")).toBe(true);
  });

  test("__len", () => {
    const r = runObfuscated(`
local t = setmetatable({}, {__len = function(t) return 99 end})
print(#t)
`);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "99")).toBe(true);
  });

  test("__call", () => {
    const r = runObfuscated(`
local callable = setmetatable({}, {__call = function(self, x) return x * 2 end})
print(callable(21))
`);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.trim() === "42")).toBe(true);
  });

  test("inheritance chain", () => {
    const r = runObfuscated(`
local parent = {hello = function() return "parent" end}
local child = setmetatable({}, {__index = parent})
child.hello2 = function() return "child" end
print(child.hello())
print(child.hello2())
`);
    expect(r.rc).toBe(0);
    expect(r.out.some((l) => l.includes("parent"))).toBe(true);
    expect(r.out.some((l) => l.includes("child"))).toBe(true);
  });
});
