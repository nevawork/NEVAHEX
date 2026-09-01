import { readFileSync } from "fs";
import { lex } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/lexer/Lexer.js";
import { parse } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/parser/Parser.js";
import { obfuscate } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/obfuscator/index.js";
import { regCompile } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/vm/RegCompiler.js";
import { generateRegVM } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/vm/reg-vm-gen.js";
import * as lua from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lua.js";
import * as lauxlib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lauxlib.js";
import * as lualib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lualib.js";
import { to_luastring } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/fengari.js";

const SHIM = `
if type(bit32)~="table" then
  local _B={}
  function _B.bxor(a,b) local r=0;for i=0,31 do local x,y=((a//(2^i))%2),((b//(2^i))%2);if (x+y)%2==1 then r=r+(2^i) end end;return r end
  function _B.band(a,b) local r=0;for i=0,31 do if ((a//(2^i))%2==1) and ((b//(2^i))%2==1) then r=r+(2^i) end end;return r end
  function _B.bor(a,b) local r=0;for i=0,31 do if ((a//(2^i))%2==1) or ((b//(2^i))%2==1) then r=r+(2^i) end end;return r end
  function _B.lrotate(a,d) d=d%32;if d<0 then d=d+32 end;return ((a<<d)|(a>>(32-d)))&0xFFFFFFFF end
  function _B.lshift(a,d) return (a<<d)&0xFFFFFFFF end
  function _B.rshift(a,d) return a>>d end
  bit32=_B
end
if type(table.create)~="function" then table.create=function(n,v) local t={};for _i=1,n do t[_i]=v end;return t end end
if type(table.pack)~="function" then table.pack=function(...) return {n=select("#",...),...} end end
`;

const source = readFileSync("/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/example/original-no-types.lua", "utf-8");
const { tokens } = lex(source);
const ast = parse(tokens);
const obf = obfuscate(ast, { target: "luau", renameLocals: true, preserveGlobals: true });
const chunk = regCompile(obf);
const vmOutput = generateRegVM(chunk, { level: "debug", polymorphicSeed: 1, target: "luau" });

const L = lauxlib.luaL_newstate();
lualib.luaL_openlibs(L);
lauxlib.luaL_dostring(L, to_luastring(SHIM));

const output = [];
const printFn = (L) => {
  const top = lua.lua_gettop(L);
  const parts = [];
  for (let i = 1; i <= top; i++) {
    parts.push(String(lua.lua_tojsstring(L, i)));
  }
  output.push(parts.join("\t"));
  return 0;
};
lua.lua_pushcfunction(L, printFn);
lua.lua_setglobal(L, to_luastring("print"));

const rc = lauxlib.luaL_dostring(L, to_luastring(vmOutput));
console.log("rc:", rc);
if (rc !== 0) console.log("err:", lua.lua_tojsstring(L, -1));
console.log("output:", output);