import * as lua from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lua.js";
import * as lauxlib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lauxlib.js";
import * as lualib from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/lualib.js";
import { to_luastring } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/node_modules/fengari/src/fengari.js";

const code = process.argv[2];
const L = lauxlib.luaL_newstate();
lualib.luaL_openlibs(L);
lua.lua_pushcfunction(L, function(L) {
  const top = lua.lua_gettop(L);
  for (let i = 1; i <= top; i++) {
    process.stdout.write(String(lua.lua_tojsstring(L, i)) + "\t");
  }
  process.stdout.write("\n");
  return 0;
});
lua.lua_setglobal(L, to_luastring("print"));
const rc = lauxlib.luaL_dostring(L, to_luastring(code));
console.log("rc:", rc);
if (rc !== 0) {
  const err = lua.lua_tojsstring(L, -1);
  console.log("error:", err);
}
