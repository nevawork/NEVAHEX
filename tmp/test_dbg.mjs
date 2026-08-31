import * as lua from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lua.js";
import * as lauxlib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lauxlib.js";
import * as lualib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lualib.js";
import { to_luastring } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/fengari.js";

const fs = await import("fs");
const code = fs.readFileSync("/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/tmp/fact_lua.txt", "utf-8");

const bit32lib = `local M={}
function M.band(a,b) return a & b end
function M.bor(a,b) return a | b end
function M.bxor(a,b) return a ~ b end
function M.bnot(a) return ~a end
function M.lshift(a,b) return a << b end
function M.rshift(a,b) return a >> b end
function M.lrotate(a,d) d=d%32; return ((a<<d)|(a>>(32-d)))&0xFFFFFFFF end
return M`;

const L = lauxlib.luaL_newstate();
lualib.luaL_openlibs(L);
lauxlib.luaL_dostring(L, to_luastring("bit32 = (function() " + bit32lib + " end)()"));
lua.lua_pushcfunction(L, function(L) {
  process.stdout.write("PRINT: " + lua.lua_tojsstring(L, 1) + "\n");
  return 0;
});
lua.lua_setglobal(L, to_luastring("print"));

const rc = lauxlib.luaL_dostring(L, to_luastring(code));
console.log("rc:", rc);
if (rc !== 0) console.log("err:", lua.lua_tojsstring(L, -1));
