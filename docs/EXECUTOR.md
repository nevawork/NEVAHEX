# NEVAHEX Executor Compatibility

## Overview

NEVAHEX's Roblox Luau target includes a comprehensive **executor compatibility layer** that allows obfuscated scripts to run safely in:
- Stock Roblox (no executor)
- Popular script executors (Synapse X, Fluxus, Script-Ware, etc.)
- Plain Luau interpreters
- Any Lua 5.1+ environment

The compatibility layer is automatically injected into every NEVAHEX-generated script when targeting `luau`.

## How It Works

### 1. Environment Detection

The runtime probes the environment at startup:

```lua
local target = "luau"
local executor = "unknown"

if type(game) == "userdata" and typeof and typeof(game) ~= "nil" then
  executor = "roblox"
end

if type(syn) == "table" then executor = "synapse" end
if type(fluxus) == "table" then executor = "fluxus" end
if type(identifyexecutor) == "function" then
  local name = identifyexecutor()
  if type(name) == "string" then executor = name end
end
```

### 2. Global Polyfills

#### Roblox Services
```lua
-- Safe access to Roblox services
if not game then
  _G.game = {
    GetService = function(name)
      return setmetatable({}, {
        __index = function() return function() end end
      })
    end
  }
end

-- workspace, script, Players, Lighting, etc.
```

#### Executor APIs
```lua
-- Safe fallbacks for executor-specific functions
if not hookfunction then
  _G.hookfunction = function(original, replacement) return replacement end
end

if not hookmetamethod then
  _G.hookmetamethod = function(t, k, f) return f end
end

if not getrawmetatable then
  _G.getrawmetatable = function(t)
    local mt = getmetatable(t)
    if mt and mt.__metatable then return nil end
    return mt
  end
end

if not isreadonly then _G.isreadonly = function() return false end end
if not makewriteable then _G.makewriteable = function(t) return t end end
if not checkcaller then _G.checkcaller = function() return false end end
```

#### File System
```lua
-- Safe no-ops for file operations
if not readfile then _G.readfile = function() return "" end end
if not writefile then _G.writefile = function() return true end end
if not isfile then _G.isfile = function() return false end end
if not listfiles then _G.listfiles = function() return {} end end
if not makefolder then _G.makefolder = function() return true end end
```

#### Drawing Library
```lua
if not Drawing then
  _G.Drawing = {
    new = function(type)
      return {
        Visible = false,
        Color = Color3.new(1,1,1),
        Transparency = 1,
        Position = Vector2.new(0,0),
        Size = Vector2.new(0,0),
        Remove = function() end,
      }
    end
  }
end
```

### 3. Lua Version Compatibility

#### Bit32 Library (Lua 5.1)
```lua
if type(bit32) ~= "table" then
  bit32 = {
    bxor = function(a,b) ... end,
    band = function(a,b) ... end,
    bor = function(a,b) ... end,
    lshift = function(a,b) ... end,
    rshift = function(a,b) ... end,
    lrotate = function(a,b) ... end,
  }
end
```

#### Loadstring/Load (Lua 5.4+)
```lua
if type(loadstring) ~= "function" then
  _G.loadstring = load
end
```

### 4. Executor Detection

The runtime detects common executors:

| Executor | Detection |
|----------|-----------|
| Synapse X | `type(syn) == "table"` |
| Fluxus | `type(fluxus) == "table"` |
| Script-Ware | `type(scriptware) == "table"` |
| Krnl | `type(krnl) == "table"` |
| Electron | `type(electron) == "table"` |
| Generic | `identifyexecutor()` function |

### 5. Console API

```lua
if not rconsole then
  _G.rconsole = {
    create = function() end,
    clear = function() end,
    print = function() end,
    info = function() end,
    warn = function() end,
    error = function() end,
    settitle = function() end,
    input = function() return "" end,
  }
end
```

## Probed Globals

The compatibility layer provides safe fallbacks for these globals:

### Roblox Services
- `game`, `workspace`, `script`, `shared`
- `Players`, `Lighting`, `ReplicatedStorage`, `ServerScriptService`, `ServerStorage`
- `StarterGui`, `StarterPack`, `StarterPlayer`, `StarterPlayerScripts`
- `SoundService`, `RunService`, `TweenService`, `UserInputService`, `HttpService`
- `Teams`, `Chat`, `Debris`, `InsertService`, `PathfindingService`
- And 30+ more...

### Data Types
- `Instance`, `Vector3`, `Vector2`, `CFrame`, `Color3`, `UDim2`, `UDim`
- `Ray`, `Region3`, `Rect`, `TweenInfo`, `NumberRange`, `NumberSequence`
- `ColorSequence`, `BrickColor`, `Enum`, `PhysicalProperties`, `Faces`, `Axes`
- `PathWaypoint`, `Font`, `CatalogSearchParams`, `DockWidgetPluginGuiInfo`

### Executor APIs
- `hookfunction`, `hookmetamethod`, `newcclosure`, `getrawmetatable`
- `setrawmetatable`, `getnamecallmethod`, `setnamecallmethod`
- `isreadonly`, `makewriteable`, `make_writable`, `checkcaller`
- `getconnections`, `getgc`, `getinstances`, `getnilinstances`
- `getscripts`, `getrunningscripts`, `getloadedmodules`
- `readfile`, `writefile`, `appendfile`, `loadfile`, `listfiles`
- `isfile`, `isfolder`, `makefolder`, `delfolder`, `delfile`
- `queue_on_teleport`, `setthreadidentity`, `getthreadidentity`
- `cloneref`, `compareinstances`, `fireclickdetector`, `firetouchinterest`
- `Drawing`, `isrbxfunc`, `syn`, `fluxus`, `protect_gui`

### Console
- `rconsole`, `rprint`, `rcapture`, `rconsolecreate`, `rconsoledestroy`
- `rconsoleclear`, `rconsolesettitle`, `rconsoleinput`

## Usage

### CLI
```bash
# Default (luau target with executor compat)
nevahex --target luau script.lua -o output.lua

# Without executor compatibility
nevahex --target luau --no-executor-compat script.lua -o output.lua
```

### API
```typescript
import { obfuscate, generateRegVM } from "nevahex";

const ast = parse(tokens);
const obf = obfuscate(ast, { target: "luau", preserveGlobals: true });
const chunk = regCompile(obf);
const output = generateRegVM(chunk, {
  level: "normal",
  target: "luau",
  executorGlobals: true  // default: true
});
```

### Disable Compatibility Layer
```typescript
// Via options
generateRegVM(chunk, {
  target: "luau",
  executorGlobals: false  // disables shims
});

// Or CLI
nevahex --target luau --no-executor-compat script.lua
```

## Testing

The compatibility layer is tested against a simulated executor environment that provides:
- Roblox service mocks
- Executor API mocks
- Console API mocks

Run tests:
```bash
npm test -- --testPathPatterns=roblox
```

## Limitations

1. **No actual executor features**: The fallbacks are no-ops or minimal implementations. Real executor features (e.g., actual `hookfunction` that replaces functions in the VM) are not replicated.

2. **Environment-specific behavior**: Some executor behaviors (e.g., `hookfunction` actually replacing a function in the VM) cannot be simulated in stock Lua.

3. **Global pollution**: The compatibility layer adds globals to `_G`. Use `--no-preserve` if you need clean globals.

4. **Executor detection is heuristic**: Not all executors expose detectable globals.

## Security Considerations

The compatibility layer is designed to be **safe**:
- No code execution in fallbacks
- No access to sensitive APIs
- No network/file system access
- No modification of existing globals unless nil
- Safe defaults that don't break legitimate scripts

## Extending Compatibility

To add support for a new executor:

1. Add detection logic in `generateCompatPolyfill()`
2. Add required globals to the shim table
3. Add tests in `tests/roblox-luau.test.ts`
4. Update this documentation

The compatibility layer is designed to be extensible and maintainable.