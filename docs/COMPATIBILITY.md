# NEVAHEX Compatibility Matrix

## Target Support

| Feature | lua51 | lua52 | lua53 | lua54 | luau |
|---------|-------|-------|-------|-------|------|
| **Lexer/Parser** | | | | | |
| `goto` / `::label::` | ❌ | ✅ | ✅ | ✅ | ❌ |
| Bitwise operators (`&`, `\|`, `~`, `<<`, `>>`) | ❌ | ❌ | ✅ | ✅ | ❌* |
| Floor division (`//`) | ❌ | ❌ | ✅ | ✅ | ✅ |
| Integer literals | ❌ | ❌ | ✅ | ✅ | ❌ |
| `<const>` attribute | ❌ | ❌ | ❌ | ✅ | ❌* |
| `<close>` attribute | ❌ | ❌ | ❌ | ✅ | ❌ |
| `continue` | ❌ | ❌ | ❌ | ❌ | ✅ |
| Compound assignment (`+=`, `-=`, etc.) | ❌ | ❌ | ❌ | ❌ | ✅ |
| String interpolation (`\`...\${}\``) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Type annotations (`: type`, `type X = ...`) | ❌ | ❌ | ❌ | ❌ | ✅ |
| If-else expressions | ❌ | ❌ | ❌ | ❌ | ✅ |
| Generalized iteration (`__iter`) | ❌ | ❌ | ❌ | ❌ | ✅ |
| `const` declaration | ❌ | ❌ | ❌ | ❌ | ✅ |
| `buffer` type | ❌ | ❌ | ❌ | ❌ | ✅ |
| `task` library | ❌ | ❌ | ❌ | ❌ | ✅ |

*Luau has bitwise operators via `bit32` library, not native operators. `<const>` uses `const` keyword instead.

### VM Support

| Feature | lua51 | lua52 | lua53 | lua54 | luau |
|---------|-------|-------|-------|-------|------|
| Stack VM | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register VM | ✅ | ✅ | ✅ | ✅ | ✅ |
| Closures/Upvalues | ✅ | ✅ | ✅ | ✅ | ✅ |
| Varargs | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tables/Metatables | ✅ | ✅ | ✅ | ✅ | ✅ |
| Coroutines | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vararg results | ✅ | ✅ | ✅ | ✅ | ✅ |

### Runtime Compatibility

| Feature | lua51 | lua52 | lua53 | lua54 | luau |
|---------|-------|-------|-------|-------|------|
| `bit32` library | Polyfilled | Native | Native | Native | Native |
| `loadstring` | Native | Native | Native | `load` alias | Native |
| `getfenv`/`setfenv` | Native | ❌* | ❌* | ❌* | Native |
| `table.create`/`pack`/`unpack` | Polyfilled | Polyfilled | Polyfilled | Polyfilled | Native |
| Integers | N/A | N/A | Native | Native | N/A** |

*Lua 5.2+ uses `_ENV` instead of `getfenv`/`setfenv`
**Luau uses double-precision floats for all numbers

## Known Limitations

### Lua 5.1
- No native bitwise operators (polyfilled via `bit32`)
- No integers (all numbers are doubles)
- No `goto` (syntax error if used)
- No `//` operator
- No `<const>`/`<close>` attributes
- No `continue`

### Lua 5.2
- No native bitwise operators
- No integers
- `getfenv`/`setfenv` removed (use `_ENV`)
- `module()` deprecated
- New: `goto`, `::label::`, `__pairs`/`__ipairs` metamethods

### Lua 5.3
- Native integers (64-bit)
- Native bitwise operators (`&`, `|`, `~`, `<<`, `>>`, `~`)
- `//` floor division
- `utf8` library
- No `<const>`/`<close>`
- No `continue`

### Lua 5.4
- `<const>` attribute for locals
- `<close>` attribute for to-be-closed variables
- New `warn` function
- No `continue`
- No native bitwise operators (use `&`, `|` etc.)
- `loadstring` removed (use `load`)

### Roblox Luau
- Based on Lua 5.1 syntax
- Luau-specific: `continue`, compound assignment, string interpolation, if-else expressions
- Type system (annotations, generics, type aliases)
- No `goto`/`::label::`
- No integers (all doubles)
- No `<const>`/`<close>` (use `const` keyword)
- No `loadstring` (use `load`)
- Extended libraries: `task`, `buffer`, `debug` extensions
- Roblox API globals (`game`, `workspace`, etc.)
- Executor-specific globals available at runtime

## Obfuscation Feature Support

| Feature | lua51 | lua52 | lua53 | lua54 | luau |
|---------|-------|-------|-------|-------|------|
| Identifier Renaming | ✅ | ✅ | ✅ | ✅ | ✅ |
| String Encoding | ✅ | ✅ | ✅ | ✅ | ✅ |
| Control Flow Flattening | ✅ | ✅ | ✅ | ✅ | ✅ |
| VM Protection (Stack) | ✅ | ✅ | ✅ | ✅ | ✅ |
| VM Protection (Register) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Executor Compat Shim | N/A | N/A | N/A | N/A | ✅ |

## Testing Matrix

| Test Category | lua51 | lua52 | lua53 | lua54 | luau |
|---------------|-------|-------|-------|-------|------|
| Lexer | ✅ | ✅ | ✅ | ✅ | ✅ |
| Parser | ✅ | ✅ | ✅ | ✅ | ✅ |
| Stack VM | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register VM | ✅ | ✅ | ✅ | ✅ | ✅ |
| Closures | ✅ | ✅ | ✅ | ✅ | ✅ |
| Varargs | ✅ | ✅ | ✅ | ✅ | ✅ |
| Metamethods | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tables | ✅ | ✅ | ✅ | ✅ | ✅ |
| Loops | ✅ | ✅ | ✅ | ✅ | ✅ |
| Control Flow | ✅ | ✅ | ✅ | ✅ | ✅ |
| Roblox Env | N/A | N/A | N/A | N/A | ✅ |

## Migration Notes

### From Lua 5.1 to Luau
1. Add `const` for immutable locals
2. Use compound assignment (`+=`, `-=`, etc.)
3. Use string interpolation
4. Add type annotations
5. Replace `loadstring` with `load`
6. Use `task` library instead of `spawn`/`wait`

### From Lua 5.4 to Luau
1. Replace `<const>` with `const`
2. Remove `<close>` (use explicit cleanup)
3. Use Luau type system
4. Use `continue` instead of `goto` workarounds

## Version Detection

The runtime detects the host environment:
```lua
-- Automatic detection
if type(game) == "userdata" then
  -- Roblox/Luau
elseif _VERSION == "Lua 5.1" then
  -- PUC Lua 5.1
elseif _VERSION == "Lua 5.4" then
  -- PUC Lua 5.4
end
```