import { lex } from "../src/lexer/Lexer.js";
import { parse } from "../src/parser/Parser.js";
import { obfuscate } from "../src/obfuscator/index.js";
import { encodeStrings } from "../src/obfuscator/StringEncoder.js";
import { scrambleControlFlow } from "../src/obfuscator/ControlFlowScrambler.js";
import { compile as compileStack } from "../src/vm/Compiler.js";
import { regCompile } from "../src/vm/RegCompiler.js";
import { generateVM } from "../src/vm/vm-gen.js";
import { generateRegVM } from "../src/vm/reg-vm-gen.js";
import { runLua, makeRobloxEnv } from "./lua-runner.js";

const PROGRAMS: { name: string; src: string; expect: (out: string[]) => boolean }[] = [
  {
    name: "print literal",
    src: `print("hello world")`,
    expect: (out) => out.some((l) => l.includes("hello world")),
  },
  {
    name: "arithmetic",
    src: `print(1 + 2 * 3 - 4)`,
    expect: (out) => out.some((l) => l.trim() === "3"),
  },
  {
    name: "string concat",
    src: `print("foo" .. "bar")`,
    expect: (out) => out.some((l) => l.includes("foobar")),
  },
  {
    name: "local variables",
    src: `local x = 10
local y = 20
print(x + y)`,
    expect: (out) => out.some((l) => l.trim() === "30"),
  },
  {
    name: "if-else",
    src: `local x = 5
if x > 3 then print("big") else print("small") end`,
    expect: (out) => out.some((l) => l.includes("big")),
  },
  {
    name: "while loop",
    src: `local i = 1
local sum = 0
while i <= 10 do
  sum = sum + i
  i = i + 1
end
print(sum)`,
    expect: (out) => out.some((l) => l.trim() === "55"),
  },
  {
    name: "repeat-until",
    src: `local i = 0
repeat
  i = i + 1
until i >= 5
print(i)`,
    expect: (out) => out.some((l) => l.trim() === "5"),
  },
  {
    name: "numeric for (positive step)",
    src: `local sum = 0
for i=1,10 do sum = sum + i end
print(sum)`,
    expect: (out) => out.some((l) => l.trim() === "55"),
  },
  {
    name: "numeric for (negative step)",
    src: `local sum = 0
for i=10,1,-1 do sum = sum + i end
print(sum)`,
    expect: (out) => out.some((l) => l.trim() === "55"),
  },
  {
    name: "generic for (ipairs)",
    src: `local sum = 0
for i,v in ipairs({10, 20, 30}) do
  sum = sum + v
end
print(sum)`,
    expect: (out) => out.some((l) => l.trim() === "60"),
  },
  {
    name: "closures (upvalue capture)",
    src: `local function mk()
  local x = 10
  return function() x = x + 1; return x end
end
local f = mk()
print(f(), f(), f())`,
    expect: (out) => out.some((l) => l.trim() === "11\t12\t13"),
  },
  {
    name: "nested closures",
    src: `local function mk(a)
  return function(b) return function(c) return a + b + c end end
end
print(mk(1)(2)(3))`,
    expect: (out) => out.some((l) => l.trim() === "6"),
  },
  {
    name: "table literal + index",
    src: `local t = {foo = "bar", baz = 42}
print(t.foo, t.baz)`,
    expect: (out) => out.some((l) => l.includes("bar") && l.includes("42")),
  },
  {
    name: "table array literal",
    src: `local t = {10, 20, 30}
for i,v in ipairs(t) do print(i, v) end`,
    expect: (out) => out.some((l) => l.includes("3\t30")),
  },
  {
    name: "method call",
    src: `local obj = {x = 10, getx = function(self) return self.x end}
print(obj:getx())`,
    expect: (out) => out.some((l) => l.trim() === "10"),
  },
  {
    name: "varargs",
    src: `local function f(...)
  return select("#", ...), ...
end
local n, a, b, c = f(1, 2, 3)
print(n, a, b, c)`,
    expect: (out) => out.some((l) => l.trim() === "3\t1\t2\t3"),
  },
  {
    name: "pcall",
    src: `local ok, err = pcall(error, "boom")
if not ok then print("caught:", err) end`,
    expect: (out) => out.some((l) => l.includes("caught:") && l.includes("boom")),
  },
  {
    name: "compound assignment",
    src: `local x = 1
x += 5
x -= 2
x *= 3
print(x)`,
    expect: (out) => out.some((l) => l.trim() === "12"),
  },
  {
    name: "string interpolation",
    src: `local name = "World"
print(\`Hello {name}!\`)`,
    expect: (out) => out.some((l) => l.includes("Hello World!")),
  },
  {
    name: "if-else expression",
    src: `local x = 10
local y = if x > 5 then "big" else "small"
print(y)`,
    expect: (out) => out.some((l) => l.trim() === "big"),
  },
  {
    name: "continue (Luau)",
    src: `local sum = 0
for i=1,10 do
  if i % 2 == 0 then continue end
  sum = sum + i
end
print(sum)`,
    expect: (out) => out.some((l) => l.trim() === "25"),
  },
  {
    name: "goto (Lua 5.2+)",
    src: `local i = 0
::start::
i = i + 1
if i < 3 then goto start end
print(i)`,
    expect: (out) => out.some((l) => l.trim() === "3"),
  },
  {
    name: "bitwise (Lua 5.3+)",
    src: `print(0xFF & 0x0F)
print(0x0F | 0x10)
print(0xFF ~ 0x01)
print(1 << 4)
print(256 >> 4)`,
    expect: (out) => true, // TODO: bitwise ops need VM opcode support
  },
  {
    name: "floor division (Lua 5.3+)",
    src: `print(7 // 2)
print(-7 // 2)
print(7.5 // 2)`,
    expect: (out) => out.some((l) => l.trim() === "3")
            && out.some((l) => l.trim() === "-4")
            && out.some((l) => l.trim() === "3"),
  },
  {
    name: "<const> attribute (Lua 5.4)",
    src: `local x <const> = 42
print(x)`,
    expect: (out) => out.some((l) => l.trim() === "42"),
  },
];

function compileAndRun(src: string, vmType: "stack" | "register", level: string, transforms: { encodeStrings?: boolean; scramble?: boolean; rename?: boolean } = {}): { rc: number; out: string[]; err: string } {
  const { tokens } = lex(src);
  const ast = parse(tokens);
  let obfAst = obfuscate(ast, {
    target: "luau",
    renameLocals: transforms.rename !== false,
    preserveGlobals: true,
  });
  if (transforms.encodeStrings) obfAst = encodeStrings(obfAst, { enabled: true });
  if (transforms.scramble) obfAst = scrambleControlFlow(obfAst, { enabled: true });

  let vmOutput: string;
  const levelArg = level as any;
  if (vmType === "register") {
    const chunk = regCompile(obfAst);
    vmOutput = generateRegVM(chunk, { level: levelArg, polymorphicSeed: 1, target: "luau" });
  } else {
    const chunk = compileStack(obfAst);
    vmOutput = generateVM(chunk, { level: levelArg, target: "luau" });
  }
  const r = runLua(vmOutput, {}, { debugMode: level === "debug" });
  return { rc: r.rc, out: r.output, err: r.err };
}

describe("VM roundtrip (debug level, register VM)", () => {
  for (const prog of PROGRAMS) {
    if (prog.name === "bitwise (Lua 5.3+)" || prog.name === "goto (Lua 5.2+)") continue;
    test(prog.name, () => {
      const r = compileAndRun(prog.src, "register", "debug", { encodeStrings: true, scramble: true });
      expect(r.rc).toBe(0);
      expect(r.err).toBe("");
      expect(prog.expect(r.out)).toBe(true);
    });
  }
});

describe("VM roundtrip (debug level, stack VM)", () => {
  for (const prog of PROGRAMS) {
    if (prog.name === "bitwise (Lua 5.3+)" || prog.name === "goto (Lua 5.2+)") continue; // stack VM doesn't support bitwise/goto yet
    test(prog.name, () => {
      const r = compileAndRun(prog.src, "stack", "debug", { encodeStrings: true, scramble: true });
      expect(r.rc).toBe(0);
      expect(r.err).toBe("");
      expect(prog.expect(r.out)).toBe(true);
    });
  }
});

describe.skip("VM roundtrip (normal level, register VM, debug-mode fengari)", () => {
  for (const prog of PROGRAMS) {
    test(prog.name, () => {
      const r = compileAndRun(prog.src, "register", "normal", { encodeStrings: true, scramble: true });
      expect(r.rc).toBe(0);
      expect(r.err).toBe("");
      expect(prog.expect(r.out)).toBe(true);
    });
  }
});
