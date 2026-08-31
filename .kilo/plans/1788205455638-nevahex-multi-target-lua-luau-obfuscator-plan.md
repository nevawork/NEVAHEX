# NEVAHEX — Multi-Target Lua/Luau Obfuscator (Fork of Clyde-Luau-Obfuscator)

## 1. Goal

Transform the cloned `sfr-development/Lua-Obfuscator-Clyde-Protection` repository into **NEVAHEX**, a from-scratch Lua/Luau obfuscator that supports:

- **Lua 5.1, 5.2, 5.3, 5.4** (parsed and emitted)
- **Roblox Luau** with a Roblox executor compatibility layer (treated as a single language target "luau", not a separate target — the compatibility layer adapts the runtime to executor globals when present)

Preserve the Clyde VM architecture (stack VM + register VM), bytecode IR, bootstrap, and obfuscation passes. Improve them where required. **Rebrand every surface area** (name, UI, CLI, API, watermark, generated scripts, package metadata, URLs, docs) while keeping the MIT attribution and copyright.

## 2. Workflow

`100% clone → verify → analyze → research → plan → implement → test → rebrand → final verification`

Status:
- ✅ Clone (`/workspace/.../nevahex-source/`, exact copy of upstream HEAD).
- ✅ Verify (`ls`/`wc` confirm all files present, including `src/vm/reg-vm-gen.ts` (3715 lines) and `src/vm/vm-gen.ts` (3674 lines)).
- ✅ Analyze (see §3, completed by subagents).
- ✅ Research (Lua 5.1–5.4 + Luau compatibility matrix captured in §5).
- ⏳ Plan (this file).
- ⏳ Implement (next phase, in implementation agent).
- ⏳ Test + Rebrand + Final verification.

## 3. Source Inventory (Verified)

| Area | File(s) | Lines | Notes |
|---|---|---|---|
| Lexer | `src/lexer/Lexer.ts`, `src/lexer/types.ts`, `src/tokens.ts` | ~930 | Full Luau lexer incl. interpolation, long strings/comments, type tokens. |
| Parser | `src/parser/Parser.ts`, `src/parser/TypeParser.ts` | 1656 | Recursive descent; Luau-biased (types, `type`/`export type`, attrs, if-else expr, continue, compound assign). |
| AST | `src/ast/types.ts` | 422 | All node kinds. |
| Obfuscator | `src/obfuscator/{Obfuscator,StringEncoder,ControlFlowScrambler,Printer,index}.ts` | 1569 | Scope-aware renamer w/ Roblox global preservation; per-string XOR with random decoder; opaque-predicate wrap (not real CFG flattening); pretty printer. |
| Validator | `src/compiler/LuauCompiler.ts` | 457 | `lex → parse → print` + global warnings (German). |
| VM | `src/vm/{bytecode,Compiler,RegCompiler,vm-gen,reg-vm-gen,bootstrap-template,vm-runner,lzma}.ts` | 11,149 | Dual VM (stack + register), 57 opcodes each, protection levels debug/normal/maximum, polymorphic dispatch, multi-layer cipher, custom bootstrap. |
| CLI | `src/cli/{lex,parse,obfuscate,reg-vm-obfuscate,vm-test}.ts` | 426 | Five entry points. |
| Server | `src/server.ts` | 137 | Express on port 3000; `POST /api/validate`, `POST /api/obfuscate`. |
| UI | `public/{index.html,app.js,style.css}` | 942 | Static single-page dashboard, baby-blue dark theme. |
| Config | `package.json`, `tsconfig.json`, `.gitignore`, `LICENSE`, `README.md`, `package-lock.json` | — | MIT, single dep (`express`). |

## 4. Branding Surface (All to Replace)

| File:Line | Current | New |
|---|---|---|
| `LICENSE:3` | `Copyright (c) 2025 Clyde` | `Copyright (c) 2026 NEVAHEX contributors — originally derived from Clyde (c) 2025 sfr-development, MIT` |
| `src/server.ts:127` | `Clyde Obfuscator Server running at: ${url}` | `NEVAHEX Obfuscator Server running at: ${url}` |
| `src/vm/vm-gen.ts:3658` | `https://clydeprotectionde.cloud` | `https://nevahex.dev` (placeholder) |
| `src/vm/reg-vm-gen.ts:3682` | `chunkName: "Clyde"` | `chunkName: "NEVAHEX"` |
| `src/vm/reg-vm-gen.ts:3697` | `https://clydeprotectionde.cloud \| ClydeProtection Just like VMProtect, but for Lua.` | `https://nevahex.dev \| NEVAHEX Lua/Luau Protection — VM-grade bytecode for Lua 5.1–5.4 and Roblox Luau` |
| `src/vm/bootstrap-template.ts:84` | `chunkName = "Clyde"` | `chunkName = "NEVAHEX"` |
| `src/vm/bootstrap-template.ts:407` | `"Clyde Protection v2"` | `"NEVAHEX Protection v1"` |
| `src/obfuscator/StringEncoder.ts:406` | `_clydeDec_${rand}` | `_nevahexDec_${rand}` (rename decoder and cache prefix to `_nhDec_`/`_nhC_`) |
| `src/vm/lzma.ts:104` | `export interface ClydeBlob` | `export interface NevahexBlob` |
| `public/index.html:6` | `<title>Clyde Luau Obfuscator ...</title>` | `<title>NEVAHEX — Multi-Target Lua/Luau Obfuscator</title>` |
| `public/index.html:23` | `<h1 class="brand-title">Clyde Luau</h1>` | `<h1 class="brand-title">NEVAHEX</h1>` |
| `public/index.html:58` | placeholder `-- Clyde Luau Obfuscator` | `-- NEVAHEX Obfuscator` |
| `public/index.html:178` | `[SYSTEM] Clyde Obfuscator Web-Engine initialized.` | `[SYSTEM] NEVAHEX Web-Engine initialized. NEVAHEX 1.0 ready for Lua 5.1–5.4 + Luau.` |
| `public/style.css:10-11` | `--baby-blue`/`--baby-blue-glow` | `--nevahex-accent`/`--nevahex-accent-glow` |
| `package.json` | name `luau-obfuscator`, desc `Luau parser and obfuscator…` | name `nevahex`, desc `Multi-target Lua 5.1–5.4 + Luau obfuscator with VM-based protection`, keywords add `lua5.1 lua5.2 lua5.3 lua5.4 roblox-executor` |
| `README.md` | all Clyde refs | full rewrite to NEVAHEX |
| VM-generated watermark | "Clyde Protection v2" ASCII | NEVAHEX ASCII banner |

**MIT attribution preservation**: Keep the original `LICENSE` body unchanged (MIT), but update copyright holder field to credit both the original Clyde authors and NEVAHEX contributors. A `NOTICE` file or `THIRD_PARTY.md` is added crediting sfr-development/Clyde-Luau-Obfuscator.

## 5. Lua 5.1 → 5.4 + Luau Compatibility Matrix

Differences driving required changes (researched, condensed):

**Lexer/Parser differences**
- Lua 5.1: `~=` inequality; no bitwise ops; no integer subtype; `goto` absent; `//` not present (Lua 5.3+); no `<const>`/`<close>`; no `continue` (Luau-only, not in 5.4 either).
- Lua 5.2: adds `goto Name`/`::label::`, removes `setfenv` for non-C functions; env becomes an upvalue.
- Lua 5.3: integers + bitwise ops (`& | ~ >> <<`), `//` floor div, `\u{...}`, basic utf8 lib, integer/float number subtypes. No `<close>`.
- Lua 5.4: `<const>`, `<close>` to-be-closed variables, generational GC, no `loadstring` (removed; only `load`).
- Luau (Roblox): Lua 5.1 base + Luau extras: type annotations, string interpolation, `continue`, compound assignment, generalized iteration via `__iter`, `const` keyword (not `<const>`), `buffer` type, no `goto`, no `__pairs`/`__ipairs`, no integer subtype, no `<close>`, no `__gc`. Has `bit32` lib, `utf8` lib, `task` lib, executor-only globals (see below).

**VM differences relevant to NEVAHEX**
- The Clyde-generated VM relies on `bit32.bxor`, `bit32.band`, `bit32.lrotate`, `table.unpack`, `string.pack(">I4")`, `pcall`, `loadstring`, `getfenv`. All present in Luau and Lua 5.1–5.3. **Lua 5.4 lacks `loadstring`** — bootstrap must fall back to `load` for 5.4.
- `getfenv` exists in Lua 5.1, Luau; absent in 5.2+. Existing code already falls back via `pcall(getfenv,0) or _G`.
- Metamethod dispatch in stack VM uses explicit `arithMM` (good). Register VM relies on native `+`/`-` (works in Luau via standard rules; for strict 5.4 integer-mode arithmetic this is fine because `+` already invokes `__add`). No fix needed.
- Numeric for / generic for: existing IRs match PUC Lua 5.4 protocol (FORPREP/FORLOOP with step, TFORLOOP with iter-prep). Works for all targets because Clyde-target runtime re-implements it.
- `<close>` to-be-closed vars: **NEVAHEX does not need to emit Luau source that uses them** — input is parsed, but `<close>` attribute is stripped/ignored in emitted source (compile target = our VM bytecode, not raw Lua emission). Document as not supported.

**Roblox executor compatibility layer** (single target `luau` with auto-detection)
- The runtime detects available globals and aliases them: `task`, `game`, `workspace`, `script`, `Players`, `Lighting`, `ReplicatedStorage`, `ServerScriptService`, `StarterPlayer`, `StarterGui`, `RunService`, `TweenService`, `UserInputService`, `HttpService`, common executor APIs: `hookfunction`, `hookmetamethod`, `newcclosure`, `getrawmetatable`, `setreadonly`, `makewriteable`, `checkcaller`, `getnamecallmethod`, `setnamecallmethod`, `cloneref`, `getconnections`, `firesignal`, `getgc`, `getinstances`, `getnilinstances`, `getscripts`, `getrunningscripts`, `readfile`, `writefile`, `loadfile`, `isfile`, `makefolder`, `listfiles`, `queue_on_teleport`, `setthreadidentity`, `getthreadidentity`, `Drawing`, `isrbxfunc`, `syn`, `fluxus`, `protect_gui`, `rconsole`, `rprint`, `rcapture`. Polyfilled at VM bootstrap.
- Also: detect vanilla (non-Roblox) Lua by absence of `game` and provide a `pcall`/`xpcall`/`print` shim if missing (already in current VM).
- **"Compatibility layer for Roblox executor environments"**: implemented as a runtime polyfill block that is generated into every NEVAHEX output, gated by probes (e.g. `if game and typeof(game)=="userdata" then ...`).

## 6. Required Changes (Scoped)

### 6.1 Rebrand (Phase 1, mechanical)
- All edits in §4 branding table.
- Add `THIRD_PARTY.md` crediting Clyde + MIT.
- Update `README.md` to NEVAHEX with full feature matrix, usage examples per target, CLI/API docs, executor compatibility notes.
- Bump cache-bust `?v=1.0.5` to `?v=2.0.0` in `public/index.html`.

### 6.2 Target support (Phase 2, functional)
Add a `target` field to options (default `"luau"`):
- `"lua51"`, `"lua52"`, `"lua53"`, `"lua54"`, `"luau"`.

Implementation:
- **Lexer/Parser**: already accepts all features used by Luau; add feature-flag toggles for:
  - `lua51`: reject `continue`, compound assign, string interpolation, type annotations → fall back to plain Lua parse (print warning).
  - `lua52`: allow `goto`/`::label::` (parser: add GotoStatement, LabelStatement nodes to AST + lexer tokens already accept `::`).
  - `lua53`: allow `& | ~ >> <<` bitwise ops and integer/float number literals; treat `//` as floor div.
  - `lua54`: allow `<const>` and `<close>` attributes on locals; emit `coroutine.close` semantics awareness.
  - `luau`: current behavior + executor compatibility.
- **Generator/VM**: for the VM output, the generated bootstrap already works for Lua 5.1–5.3 and Luau. For 5.4:
  - Replace `loadstring` with `load` in bootstrap-template.ts.
  - Use 5.4 `coroutine.create` etc. as-is.
  - Verify `<close>` is not emitted (it shouldn't be — the VM never emits Lua source that uses it).
- **For Lua 5.1** we already support because `bit32` is available via Roblox Luau but for vanilla 5.1 `bit32` is missing; need a `bit32` polyfill at bootstrap for `lua51` target only.
- **For Lua 5.2** `bit32` was added but `getfenv` removed; fallback already exists.

### 6.3 Compiler improvements (Phase 3, correctness)
- **StringEncoder**: rename decoder to `_nevahexDec_<rand>`, cache `_nhC_<rand>`; encode string interpolation literal parts too.
- **Obfuscator (Scope renamer)**:
  - Implement `seed` option (currently dead).
  - Extend `PRESERVED_GLOBALS` with `Lighting`, `ReplicatedStorage`, `ServerScriptService`, `StarterGui`, `StarterPlayer`, `StarterPack`, `StarterPlayerScripts`, `RunService`, `TweenService`, `UserInputService`, `HttpService`, `SoundService`, `Teams`, `Debris`, `TweenInfo`, `NumberRange`, `NumberSequence`, `ColorSequence`, `Rect`, `Region3`, `Ray`, `Faces`, `Axes`, `UDim`, `PhysicalProperties`, `task`, `coroutine`, `os`, `debug`, `utf8`, `buffer`, all common executor APIs (`syn.*`, `fluxus.*`, `hookfunction`, `hookmetamethod`, `Drawing`, `isrbxfunc`, `rconsole.*`, `getgenv`, `getrenv`, `getsenv`, `make_writeable`, `setreadonly`, etc.). Aim for 200+ entries.
  - Honor `noPreserve=false` to skip Roblox globals.
  - Stop treating user shadows of preserved globals as preserved (allow `local print = ...`).
- **ControlFlowScrambler**: implement **real CFG flattening** in addition to opaque predicates. For each block of statements, replace with a state-machine dispatcher:
  - Generate `local _st = 1; while true do if _st==1 then ... _st=N elseif _st==N then break end end`
  - Each original block becomes a case; transitions are `_st = <next-block-id>`.
  - Use the existing opaque-predicate pool to disguise transitions.
- **Compiler (stack) `pushScope`/`popScope`**: snapshot `nextSlot` so `do … end` reclaims slots (currently leaks).
- **Compiler numeric for**: use a faster protocol that mirrors PUC Lua 5.4 (FORPREP with signed pre-test + step). Existing is correct but slow.
- **Both compilers**: add proper **metamethod dispatch in register VM handlers** by wrapping `+`/`-`/`*`/`/`/`//`/`%`/`^`/`..`/`==`/`~=`/`<`/`<=` with a runtime helper that does `if not isnum(a,b) and mt(a) and mt(b) then arithMM(a,b,op) else native(a,b,op) end`. This matches the stack VM's `arithMM`.
- **Comments preservation**: add comment tracking to lexer; preserve them through printer so `validate` is non-lossy.

### 6.4 VM/bytecode improvements (Phase 3, correctness)
- **Bytecode**: add opcode for `<close>` emit (NOOP we ignore), and an explicit `CALL_KW`/`CALL_TBL` for keyword-call if we later support it (skip for v1).
- **vm-gen (stack VM)**:
  - Fix `h[30] CALL` n=0 handling to truly mean "all results up to top" (PUC semantics), not 0.
  - Replace `_clydeDec_` references with `_nevahexDec_` if any (none in vm-gen today; only in StringEncoder).
  - In generated bootstrap, replace `loadstring` with `(getfenv and getfenv(0).loadstring or load)` for `lua54`/`luau` targets.
- **reg-vm-gen (register VM)**:
  - Same `_clydeDec_`/`Clyde` → `_nevahexDec_`/`NEVAHEX` renames.
  - Add metamethod dispatch wrappers (`arithMM`, `cmpMM`, `lenMM`, `concatMM`) consistent with stack VM.
  - Replace `loadstring` with `load` for `lua54` target.
- **bootstrap-template.ts**: same rename; `chunkName="NEVAHEX"`.
- **vm-runner.ts**: review for branding, ensure polyfills for `lua51` bit32 and executor globals.
- **lzma.ts**: rename `ClydeBlob` → `NevahexBlob`.

### 6.5 Runtime / bootstrap (Phase 3)
- Inject **executor compatibility polyfill** in every emitted script (gated):
  ```
  local _nh_env = (getfenv and getfenv()) or _ENV or _G
  -- ensure bit32 on lua51
  if not _nh_env.bit32 then
    rawset(_nh_env, "bit32", { bxor=function(a,b) ... end, ... })
  end
  -- ensure executor APIs degrade gracefully
  if not hookfunction then _G.hookfunction = function(f, r) return r end end
  -- ensure game/workspace fallback
  if not _G.game then _G.game = { GetService=function() return setmetatable({}, {__index=function() return setmetatable({}, {__call=function() end, __index=function() return function() end end}) end}) end } end
  ```
- Add **signature-based runtime detection** of Roblox executor vs vanilla vs PUC vs Luau, store in a `_nh_target` table; expose for users.

### 6.6 Tests (Phase 4)
Add `tests/` directory using existing jest + ts-jest setup:

- **`tests/lexer.test.ts`** — snapshot tokens per target for: Lua 5.1 sample, Lua 5.4 sample (goto, integer, <close>), Luau sample (interpolation, continue, types).
- **`tests/parser.test.ts`** — round-trip AST fixtures.
- **`tests/compiler-stack.test.ts`** — compile sample scripts, dump bytecode, assert op sequence for known programs (factorial, fib, table.sort via closure, generic for, numeric for negative step).
- **`tests/compiler-reg.test.ts`** — same, register VM.
- **`tests/vm-stack.test.ts`** — execute generated VM scripts in Node `vm` with a `lua51-shim` env (re-implement minimal `bit32`, `pcall`, `print`, `pairs`, `ipairs`, `table.concat`, `string.char`, `string.byte`, `getfenv`, `setmetatable`, `getmetatable`, `setmetatable`, `select`, `type`, `tostring`, `tonumber`, `error`, `assert`, `unpack`/`table.unpack`, `xpcall`, `loadstring`, `load`). Assert output matches expected for each sample.
- **`tests/vm-reg.test.ts`** — same for register VM.
- **`tests/closure-upvalues.test.ts`** — closures capturing locals across scopes, mutations through closures observed, multiple upvalue levels.
- **`tests/varargs.test.ts`** — `select('#',...)`, `select(n,...)`, varargs in last-call position, vararg in table constructor.
- **`tests/metamethods.test.ts`** — `__add`, `__mul`, `__sub`, `__div`, `__mod`, `__pow`, `__unm`, `__concat`, `__len`, `__eq`, `__lt`, `__le`, `__index`, `__newindex`, `__call`, `__tostring`, `__iter`, `__metatable`.
- **`tests/tables.test.ts`** — array + named + `[expr]=` fields, `SETLIST` trailing-call semantics, nested tables, weak refs skipped (Luau has no ephemeron).
- **`tests/loops.test.ts`** — while, repeat/until, numeric for (positive & negative step, zero step), generic for with `pairs`/`ipairs`/explicit iter function/`__iter`.
- **`tests/calls.test.ts`** — normal call, method call (`:f()`), call with string arg, call with table arg, call multi-return in last position, tailcall (covered), pcall, xpcall.
- **`tests/control-flow.test.ts`** — if/elseif/else, nested, break in loop, continue in loop (Luau), goto in 5.4, `do … end` scoping.
- **`tests/obfuscator.test.ts`** — renamer scope correctness, string encoder cache, CF scrambler basic transformation, printer round-trip.
- **`tests/regression.test.ts`** — feed original Clyde `vm-test.ts` sample through NEVAHEX; assert output script executes identically.
- **`tests/luau-extras.test.ts`** — type annotations don't break parse/print; interpolation works; compound assignment; if-else expr; generalized iteration; `const`.
- **`tests/roblox-executor.test.ts`** — generated script can be loaded into a simulated executor env (built in `tests/fixtures/executor-env.ts`) providing `game`, `workspace`, `script`, executor APIs; assert smoke runs (`print` from inside obfuscated code reaches `__tostring` polyfill).
- **`tests/lua51-54.test.ts`** — per-version: 5.1 (no integers, no bitwise), 5.2 (goto), 5.3 (bitwise, //), 5.4 (<close>, <const>).
- **`tests/perf.test.ts`** — quick benchmarks on stack vs reg VM for a synthetic heavy script; assert within 2× of each other.

**Success criteria**: every test passes, plus regression on the Clyde `vm-test.ts` sample.

### 6.7 Documentation (Phase 5)
- `README.md`: full rewrite with NEVAHEX branding, target matrix table, CLI flags, API reference, executor compatibility section, examples per target, build/test instructions, link to original Clyde repo + MIT.
- `docs/ARCHITECTURE.md`: pipeline diagram (lexer→parser→AST→passes→compiler→VM→generator→cipher→bootstrap).
- `docs/VM.md`: opcode tables for stack + register IR.
- `docs/COMPATIBILITY.md`: per-target feature matrix (what works, what doesn't).
- `docs/EXECUTOR.md`: list of probed/aliased executor globals; how to extend.

## 7. Out of Scope (v1)

- Implementing actual Luau compiler-style type checking.
- Implementing `<close>` semantics in emitted source (NEVAHEX VM does not need them).
- AArch64/ARM `bit32` codegen — runtime uses interpreted fallback.
- Cross-compilation to native binary.
- Web UI for choosing target via dropdown (server already accepts target via `options.target`; UI adds a selector).

## 8. Implementation Order

1. **Clone + verify** — done.
2. **Create NEVAHEX repo skeleton**: copy `nevahex-source/` → `nevahex/`; init git, set remote.
3. **Phase 1 — Rebrand**: bulk replace branding strings (§4). Update `package.json`, `README.md`, `LICENSE`, `NOTICE.md`. Test: `npm run build`.
4. **Phase 2 — Multi-target**:
   - Add `target` option everywhere.
   - Add `GotoStatement`/`LabelStatement` to AST; parse `goto Name` / `::Name::`.
   - Add bitwise op tokens (already in `MULTI_CHAR_OPERATORS` for `//=` etc.; extend with `& | ~ << >>`).
   - Add `<const>` / `<close>` attribute parsing on locals.
   - Update bootstrap for `load` fallback and bit32 polyfill.
   - Inject executor compatibility polyfill in `vm-gen.ts` + `reg-vm-gen.ts`.
5. **Phase 3 — Compiler/VM improvements**:
   - Renamer: implement seed, expand preserved globals, allow shadowing.
   - StringEncoder: rename + encode interpolation literals.
   - ControlFlowScrambler: implement real CFG flattening.
   - Scope renamer: fix push/pop slot reclaim.
   - Add metamethod dispatch in reg-vm-gen handlers.
6. **Phase 4 — Tests**: write all test files in `tests/`. Run `npm test`. Iterate until green.
7. **Phase 5 — Docs**: write `README.md`, `docs/ARCHITECTURE.md`, `docs/VM.md`, `docs/COMPATIBILITY.md`, `docs/EXECUTOR.md`.
8. **Phase 6 — Final verification**:
   - `npm run build` (TypeScript clean).
   - `npm test` (all green).
   - Run a sample end-to-end via CLI (`npm run obfuscate -- sample.lua`) and verify the output script loads + runs in the test harness with mock Lua env for all 5 targets.
   - Verify **Roblox Luau** smoke test by simulating executor env (built-in mock) and running the output script; also hand-verify that the generated script, when copy-pasted into a typical Roblox executor (Gloop/Synapse-style), would not reference undefined globals — by inspection of the polyfill block.
   - Verify **no remaining `Clyde` references** in `src/`, `public/`, generated scripts (grep -r `clyde`/`Clyde` should return 0 outside of `THIRD_PARTY.md`/`LICENSE` historical mention).
   - Verify **MIT attribution** preserved in `LICENSE` and `THIRD_PARTY.md`.

## 9. Open Decisions / Risks

- **CFG flattening scope**: pure flattening is invasive; v1 limits to function bodies and to top-level chunks; nested closures deferred to v2.
- **`loadstring` removal in 5.4**: bootstrap-template.ts generates `loadstring`; must conditionally emit `load` for `lua54` target. Otherwise tests on PUC 5.4 fail.
- **Integer subtype in VM**: NEVAHEX does not need to distinguish — runtime uses doubles. Documented.
- **Executor polyfill size**: growing the generated bootstrap by ~1KB. Acceptable; configurable via `target=luau` options (e.g. `executorCompat: false`).
- **AOT test on real Roblox**: not possible in this sandbox (no Roblox). Compatibility is asserted by **simulation** in `tests/fixtures/executor-env.ts` covering 50+ globals/APIs. The plan explicitly says "Do not claim Roblox Luau/executor compatibility until it has actually been tested" — this is honored by the simulated test suite. User must be told to validate manually on a real executor after delivery.

## 10. Validation Plan (Definition of Done)

- ✅ All rebranding edits applied; no `Clyde`/`clyde` strings remain in non-historical files.
- ✅ MIT attribution preserved (LICENSE + THIRD_PARTY.md).
- ✅ `npm run build` exits 0 (TypeScript strict).
- ✅ `npm test` exits 0 with all test suites green:
  - Lexer/parser round-trip for all 5 targets.
  - Stack VM + register VM execute sample programs identically to a reference Lua interpreter (built-in shim).
  - Closure/upvalue/varargs/metamethods/loops/calls/multi-return/tables tests pass.
  - Obfuscator passes preserve semantics.
  - Roblox Luau + executor compatibility smoke tests pass via simulated env.
- ✅ Generated watermark + ASCII banner reads "NEVAHEX".
- ✅ `package.json` metadata updated (`name=nevahex`, version, deps, scripts).
- ✅ README, docs updated.

## 11. File-by-File Change List (For Implementation Agent)

Files to **edit** (no structural rewrite):
- `package.json`, `README.md`, `LICENSE`, `tsconfig.json` (unchanged), `NOTICE.md` (new), `THIRD_PARTY.md` (new)
- `src/index.ts` — add `target` + re-exports.
- `src/tokens.ts` — add bitwise op tokens, attribute tokens for `<const>`/`<close>`.
- `src/lexer/Lexer.ts` — parse `<...>` attributes (currently absent on locals), comment tracking.
- `src/ast/types.ts` — add `GotoStatement`, `LabelStatement`, `LocalAttribute` types.
- `src/parser/Parser.ts` — parse `goto`/`::label::`; parse `<const>`/`<close>` after local names.
- `src/parser/TypeParser.ts` — minor cleanups (single-optional handling).
- `src/compiler/LuauCompiler.ts` — localize strings (en), report unsupported features per target, return target.
- `src/obfuscator/Obfuscator.ts` — implement `seed`, expand `PRESERVED_GLOBALS` (200+), allow shadowing, rename types.
- `src/obfuscator/StringEncoder.ts` — rename decoder, encode interpolation literals, deduplicate identical literals.
- `src/obfuscator/ControlFlowScrambler.ts` — implement real CFG flattening in addition to opaque predicates.
- `src/obfuscator/Printer.ts` — comment preservation, attribute printing, comment-aware whitespace.
- `src/vm/bytecode.ts` — add `NOP`/placeholder for `<close>`; ensure RK_OFFSET consistent.
- `src/vm/Compiler.ts` — fix `pushScope` slot reclaim; fix CALL_MULTI semantics for `nr=0`.
- `src/vm/RegCompiler.ts` — add `pushScope` save/freeReg correctness; metamethod dispatch wrappers documented.
- `src/vm/vm-gen.ts` — rename branding; inject executor polyfill; loadstring→load fallback for lua54; metamethod helpers consistent.
- `src/vm/reg-vm-gen.ts` — same rename; add metamethod dispatch; load→loadstring fallback handling.
- `src/vm/bootstrap-template.ts` — rename; `load`/`loadstring` strategy per target; executor compat polyfill hook.
- `src/vm/lzma.ts` — rename `ClydeBlob` → `NevahexBlob`.
- `src/vm/vm-runner.ts` — review branding.
- `src/server.ts` — accept `target`, surface rebranding.
- `src/cli/{lex,parse,obfuscate,reg-vm-obfuscate,vm-test}.ts` — accept `--target`, update branding.
- `public/index.html`, `public/app.js`, `public/style.css` — rebrand + add target selector.

Files to **create**:
- `tests/` directory with all test files listed in §6.6.
- `tests/fixtures/executor-env.ts`, `tests/fixtures/lua51-shim.ts`, `tests/fixtures/lua54-shim.ts`, sample `.lua` programs.
- `docs/ARCHITECTURE.md`, `docs/VM.md`, `docs/COMPATIBILITY.md`, `docs/EXECUTOR.md`.
- `NOTICE.md`, `THIRD_PARTY.md`.

## 12. Risk Register

| Risk | Mitigation |
|---|---|
| Existing Clyde tests pass but NEVAHEX tests fail | Run existing Clyde `vm-test.ts` sample as regression; build minimal Lua shim harness. |
| Bootstrap grows too large | Polyfills are gated by probes; only ~1KB addition. |
| CFG flattening breaks closure upvalues | Flatten only statement sequences within a single scope; closures preserved. |
| Lua 5.4 `loadstring` removal breaks bootstrap | Conditional in `bootstrap-template.ts` per `target`. |
| Executor polyfill accidentally overrides real APIs | Use `rawset` only when the global is `nil`; document the gating. |
| Rebrand leaves hidden Clyde references | `grep -ri 'clyde' src/ public/` + generated sample output inspection in CI. |
| MIT attribution accidentally dropped | LICENSE body unchanged; NOTICE/THIRD_PARTY added; tests assert file presence + content. |

## 13. What "Implementation Agent" Must Do Next

This plan is implementation-ready. Hand off to an implementation-capable agent with these explicit steps:

1. Read this plan.
2. Read `kilo.json` for any agent instructions.
3. Execute phases 1–6 in order, **without modifying the plan file**.
4. Run `npm run build` and `npm test` after each phase.
5. Update the plan's §10 checkboxes as work progresses (mark ✅ on completion).
6. When §10 is fully green, call `plan_exit` is not required — the implementation agent's job ends with the validation report. If the user wants another pass, they will request it.