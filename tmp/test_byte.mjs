import * as lua from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lua.js";
import * as lauxlib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lauxlib.js";
import * as lualib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lualib.js";
import { to_luastring } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/fengari.js";
const L = lauxlib.luaL_newstate();
lualib.luaL_openlibs(L);
const code = `local s = "ABCD"
local d,e,f,g,h = string.byte(s,1,5)
print(type(d), d, type(e), e)
`;
const rc = lauxlib.luaL_dostring(L, to_luastring(code));
console.log("rc:", rc);
if (rc !== 0) console.log("err:", lua.lua_tojsstring(L, -1));
