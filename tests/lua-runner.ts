/// <reference path="./fengari.d.ts" />
import fengari from "fengari";
const { lua, lauxlib, lualib, to_luastring } = fengari as any;

export interface RunResult {
  rc: number;
  output: string[];
  err: string;
}

export interface EnvGlobals {
  [name: string]: unknown;
}

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
if type(string.pack)~="function" or not pcall(string.pack,">I4",0) then
  string.pack=function(fmt,...) local args={...};local out={};local ai=1;local fi=1
    while fi<=#fmt do local c=string.sub(fmt,fi,fi);fi=fi+1
      if c==">" or c=="<" or c=="!" then
      elseif c=="I" then
        if string.sub(fmt,fi,fi)=="4" then fi=fi+1 end
        local v=args[ai] or 0;ai=ai+1;v=math.floor(v)
        local a,b,c2,d
        if c==">" or c=="!" then a=math.floor(v/16777216)%256;b=math.floor(v/65536)%256;c2=math.floor(v/256)%256;d=v%256
        else d=math.floor(v/16777216)%256;c2=math.floor(v/65536)%256;b=math.floor(v/256)%256;a=v%256 end
        out[#out+1]=string.char(a,b,c2,d)
      elseif c=="B" then local v=args[ai] or 0;ai=ai+1;out[#out+1]=string.char(v%256)
      elseif c=="b" then local v=args[ai] or 0;ai=ai+1;out[#out+1]=string.char((v%256+256)%256)
      end
    end
    return table.concat(out)
  end
  string.packsize=string.packsize or function(fmt) local n=0;for i=1,#fmt do local c=string.sub(fmt,i,i);if c=="I" or c=="i" then n=n+4 end end;return n end
end
`;

export function runLua(code: string, env: EnvGlobals = {}, opts: { debugMode?: boolean } = {}): RunResult {
  const L = lauxlib.luaL_newstate();
  lualib.luaL_openlibs(L);
  lauxlib.luaL_dostring(L, to_luastring(SHIM));

  for (const [k, v] of Object.entries(env)) {
    pushValue(L, v);
    lua.lua_setglobal(L, to_luastring(k));
  }

  const output: string[] = [];
  const printFn = (L: any) => {
    const top = lua.lua_gettop(L);
    const parts: string[] = [];
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

  if (opts.debugMode) {
    lauxlib.luaL_dostring(L, to_luastring(`local _orig_print = print; print = function(...) local args = {...}; local s = ""; for i,v in ipairs(args) do s = s .. tostring(v) .. (i < #args and "\\t" or "") end; if not s:match("%[VM%]") then _orig_print(s) end end`));
  }

  const rc = lauxlib.luaL_dostring(L, to_luastring(code));
  let err = "";
  if (rc !== 0) err = String(lua.lua_tojsstring(L, -1));
  return { rc, output, err };
}

function pushValue(L: any, v: unknown): void {
  if (v === null || v === undefined) {
    lua.lua_pushnil(L);
  } else if (typeof v === "boolean") {
    lua.lua_pushboolean(L, v);
  } else if (typeof v === "number") {
    lua.lua_pushnumber(L, v);
  } else if (typeof v === "string") {
    lua.lua_pushstring(L, to_luastring(v));
  } else if (typeof v === "function") {
    const fn = v as (...args: any[]) => any;
    const wrapped = (L: any) => {
      const n = lua.lua_gettop(L);
      const args: any[] = [];
      for (let i = 1; i <= n; i++) {
        args.push(lua.lua_tojsstring(L, i));
      }
      const result = fn(...args);
      if (result === undefined || result === null) {
        lua.lua_pushnil(L);
      } else if (typeof result === "boolean") {
        lua.lua_pushboolean(L, result);
      } else if (typeof result === "number") {
        lua.lua_pushnumber(L, result);
      } else if (typeof result === "string") {
        lua.lua_pushstring(L, to_luastring(result));
      } else {
        lua.lua_pushnil(L);
      }
      return 1;
    };
    lua.lua_pushcfunction(L, wrapped);
  } else if (Array.isArray(v)) {
    lua.lua_createtable(L, v.length, 0);
    for (let i = 0; i < v.length; i++) {
      pushValue(L, v[i]);
      lua.lua_rawseti(L, -2, i + 1);
    }
  } else if (typeof v === "object") {
    const obj = v as Record<string, unknown>;
    lua.lua_createtable(L, 0, Object.keys(obj).length);
    for (const [k, vv] of Object.entries(obj)) {
      pushValue(L, vv);
      lua.lua_setfield(L, -2, to_luastring(k));
    }
  } else {
    lua.lua_pushnil(L);
  }
}

export function makeRobloxEnv(): EnvGlobals {
  return {
    game: { GetService: () => ({}) },
    workspace: {},
    script: { Parent: null, Name: "Script" },
    task: { wait: (n: number) => n, defer: (f: any) => f(), spawn: (f: any) => f() },
    hookfunction: (f: any, r: any) => r,
    hookmetamethod: (t: any, k: any, f: any) => f,
    newcclosure: (f: any) => f,
    Drawing: { new: () => ({ Visible: false }) },
    getrawmetatable: (t: any) => undefined,
    setreadonly: () => {},
    make_writeable: () => {},
    isreadonly: () => false,
    checkcaller: () => true,
    cloneref: (r: any) => r,
    getconnections: () => [],
    getgc: () => [],
    getinstances: () => [],
    getscripts: () => [],
    readfile: () => "",
    writefile: () => true,
    listfiles: () => [],
    isfile: () => false,
    makefolder: () => true,
    queue_on_teleport: () => {},
    rconsole: { create: () => {}, clear: () => {}, print: () => {}, info: () => {}, warn: () => {}, error: () => {} },
    rprint: () => {},
    fireclickdetector: () => {},
    firetouchinterest: () => {},
    firesignal: () => {},
    gethui: () => ({}),
  };
}
