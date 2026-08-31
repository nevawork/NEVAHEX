import * as lua from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lua.js";
import * as lauxlib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lauxlib.js";
import * as lualib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lualib.js";
import { to_luastring } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/fengari.js";

const L = lauxlib.luaL_newstate();
lualib.luaL_openlibs(L);

const code = `
if type(bit32)~="table" then
  local _B={
    bxor=function(a,b) local r=0;for i=0,31 do local x,y=((a//(2^i))%2),((b//(2^i))%2);if (x+y)%2==1 then r=r+(2^i) end end;return r end,
    band=function(a,b) local r=0;for i=0,31 do if ((a//(2^i))%2==1) and ((b//(2^i))%2==1) then r=r+(2^i) end end;return r end,
    lshift=function(a,d) return (a<<d)&0xFFFFFFFF end
  }
  bit32=_B
end
print(type(bit32), bit32.bxor(5,3), bit32.band(5,3), bit32.lshift(1,4))
`;
const rc = lauxlib.luaL_dostring(L, to_luastring(code));
console.log("rc:", rc);
if (rc !== 0) console.log("err:", lua.lua_tojsstring(L, -1));
