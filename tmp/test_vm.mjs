import { readFileSync, writeFileSync } from "fs";
import { lex } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/lexer/Lexer.js";
import { parse } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/parser/Parser.js";
import { obfuscate } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/obfuscator/Obfuscator.js";
import { encodeStrings } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/obfuscator/StringEncoder.js";
import { regCompile } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/vm/RegCompiler.js";
import { generateRegVM } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/vm/reg-vm-gen.js";
import * as lua from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lua.js";
import * as lauxlib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lauxlib.js";
import * as lualib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lualib.js";
import { to_luastring } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/fengari.js";

const samples = [
  { name: "factorial", code: `local function fact(n) if n <= 1 then return 1 end return n * fact(n-1) end\nprint(fact(6))` },
  { name: "closure", code: `local function mk()
  local x = 10
  return function() x = x + 1; return x end
end
local f = mk()
print(f(), f(), f())` },
  { name: "table", code: `local t = {10, 20, 30, foo = "bar"}
for i,v in ipairs(t) do print(i, v) end
print(t.foo)` },
  { name: "varargs", code: `local function f(...)
  return select("#", ...), ...
end
local n, a, b, c = f(1, 2, 3)
print(n, a, b, c)` },
  { name: "forloop", code: `local sum = 0
for i=1,10 do sum = sum + i end
print(sum)` },
];

const bit32lib = `
local M = {}
function M.band(a,b) return a & b end
function M.bor(a,b) return a | b end
function M.bxor(a,b) return a ~ b end
function M.bnot(a) return ~a end
function M.lshift(a,b) return a << b end
function M.rshift(a,b) return a >> b end
function M.arshift(a,b)
  if a < 0 then
    return ((a + 0x100000000) >> b) - (0x100000000 >> b)
  else
    return a >> b
  end
end
function M.lrotate(a,disp)
  disp = disp % 32
  if disp < 0 then disp = disp + 32 end
  return ((a << disp) | (a >> (32 - disp))) & 0xFFFFFFFF
end
function M.rrotate(a,disp)
  disp = disp % 32
  if disp < 0 then disp = disp + 32 end
  return ((a >> disp) | (a << (32 - disp))) & 0xFFFFFFFF
end
function M.extract(a,f,w) return (a >> f) & ((1 << w) - 1) end
function M.replace(a,v,f,w)
  local mask = ((1 << w) - 1) << f
  return (a & ~mask) | ((v << f) & mask)
end
function M.btest(...) return M.band(...) ~= 0 end
return M
`;

function runLua(code) {
  const L = lauxlib.luaL_newstate();
  lualib.luaL_openlibs(L);
  lauxlib.luaL_dostring(L, to_luastring("bit32 = (function() " + bit32lib + " end)()"));
  const output = [];
  const printFn = function(L) {
    const top = lua.lua_gettop(L);
    const parts = [];
    for (let i = 1; i <= top; i++) {
      const s = String(lua.lua_tojsstring(L, i));
      if (s.startsWith("[VM]")) return 0;
      parts.push(s);
    }
    if (parts.length === 0) return 0;
    output.push(parts.join("\t"));
    return 0;
  };
  lua.lua_pushcfunction(L, printFn);
  lua.lua_setglobal(L, to_luastring("print"));
  const rc = lauxlib.luaL_dostring(L, to_luastring(code));
  let err = "";
  if (rc !== 0) err = String(lua.lua_tojsstring(L, -1));
  return { rc, output: output.join("\n"), err };
}

let pass = 0, fail = 0;
for (const sample of samples) {
  const baseline = runLua(sample.code);

  const { tokens, errors: lexErr } = lex(sample.code);
  const ast = parse(tokens);
  let obfAst = obfuscate(ast, { renameLocals: true, preserveGlobals: true });
  obfAst = encodeStrings(obfAst, { enabled: true });
  const chunk = regCompile(obfAst);
  const vmOutput = generateRegVM(chunk, { level: "normal", polymorphicSeed: 1, disableFeatures: [] });
  const r = runLua(vmOutput);
  const ok = r.output === baseline.output && r.rc === 0;
  console.log(`${ok ? "PASS" : "FAIL"} ${sample.name} | baseline=${baseline.output} | vm=${r.output} | rc=${r.rc} | err=${r.err}`);
  if (ok) pass++; else fail++;
}
console.log(`\n${pass} pass, ${fail} fail`);
