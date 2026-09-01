# NEVAHEX

**Multi-Target Lua / Luau Obfuscator with VM-Based Protection**

NEVAHEX is a from-scratch Lua and Luau obfuscator supporting **Lua 5.1, 5.2, 5.3, 5.4, and Roblox Luau** (with an executor compatibility layer). It implements a complete **Lexer → Parser → AST → Obfuscation Passes → VM → Custom Cipher → Bootstrap** pipeline with no external parsing dependencies.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)
[![Targets](https://img.shields.io/badge/Targets-Lua%205.1--5.4%20%7C%20Luau-7c3aed?style=flat-square)](#supported-targets)

---

## Supported Targets

| Target | Status | Notes |
|--------|--------|-------|
| Lua 5.1 | ✅ | `bit32` polyfilled at runtime; full grammar |
| Lua 5.2 | ✅ | `goto` / `::label::` supported |
| Lua 5.3 | ✅ | integers, bitwise (`& \| ~ << >>`), `//` floor div |
| Lua 5.4 | ✅ | `<const>` / `<close>` attributes, `load` instead of `loadstring` |
| Roblox Luau | ✅ | types, interpolation, `continue`, `const`, executor compatibility layer |

The Roblox Luau target ships a **runtime polyfill layer** that probes for common Roblox services (`game`, `workspace`, `script`, `Lighting`, `Players`, …) and executor APIs (`hookfunction`, `hookmetamethod`, `Drawing`, `getrawmetatable`, `syn`, `fluxus`, …) and provides safe fallbacks when they are missing. This means the same obfuscated script works in stock Roblox, popular executors, and a plain Luau interpreter without source changes.

---

## Features

- **Multi-target lexer + parser** for Lua 5.1–5.4 and Roblox Luau, including type annotations, generics, if-else expressions, string interpolation, compound assignment, `continue`, `goto` (5.2+), bitwise ops (5.3+), `<const>`/`<close>` (5.4+).
- **Multi-pass obfuscation** — scope-aware identifier renaming (with seed control), XOR string encoding (interpolation-aware), and **real control-flow flattening** plus opaque-predicate condition wrapping.
- **Dual VM architecture** — both a stack-based and a register-based virtual machine with closure, upvalue, vararg, multi-return, and metamethod support.
- **Three protection levels** — `debug`, `normal`, `maximum` — with opcode shuffling, polymorphic dispatch, anti-tamper hashing, LZMA compression, multi-layer cipher (SBox + XOR-stream + base85), watermark, and self-zeroing bytecode.
- **Web UI + CLI + API** — built-in Express server, browser dashboard with target selector, scriptable CLI, programmatic TypeScript API.
- **Validation** — pre-obfuscation syntax validation with per-target feature detection and unknown-global warnings.
- **Tests** — lexer, parser, compiler, both VMs, closures, upvalues, varargs, tables, metamethods, loops, calls, control flow, obfuscator passes, multi-target, and a Roblox executor simulator.

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher

### Install

```bash
git clone https://github.com/nevahex/nevahex.git
cd nevahex
npm install
npm run build
```

### Web UI

```bash
npm run serve
```

Open <http://localhost:3000> to access the NEVAHEX dashboard. Pick a target from the dropdown, paste Luau/Lua source, choose options, click **Obfuscate**.

### CLI

```bash
# Lex tokens
npm run lex -- path/to/script.lua

# Parse to AST
npm run parse -- path/to/script.lua

# Obfuscate (Lua 5.4 example, register VM, max protection)
npm run obfuscate -- --target lua54 --vm register --max --output out.lua path/to/script.lua
```

Flags:

| Flag | Description |
|------|-------------|
| `--target lua51\|lua52\|lua53\|lua54\|luau` | Output target (default: `luau`) |
| `--no-rename` | Skip identifier renaming |
| `--no-preserve` | Do not preserve Roblox/Lua globals |
| `--encode-strings` / `--no-encode` | XOR string encoding |
| `--scramble` | Enable control-flow flattening + opaque predicates |
| `--vm stack\|register` | Generate VM-protected output |
| `--junk` | Inject junk code |
| `--one-line` | Minify output to a single line |
| `--production` / `--advanced` / `--max` | Protection level |
| `--compress` / `--no-compress` | LZMA compression of bytecode |
| `--vm-debug` / `--no-vm-encode` | VM debug mode / skip VM string encoding |
| `-o`, `--output <file>` | Output file path |

---

## API

The Express server exposes two endpoints:

### `POST /api/validate`

```json
{ "code": "local x = 1 + 2", "target": "luau" }
```

Returns `{ valid, errors, warnings, stats, features, output }`.

### `POST /api/obfuscate`

```json
{
  "code": "local function greet(name) print('Hello ' .. name) end\ngreet('World')",
  "options": {
    "target": "luau",
    "noRename": false,
    "noPreserve": false,
    "encodeStrings": true,
    "scramble": true,
    "oneLine": false,
    "vmType": "register",
    "vmLevel": "maximum"
  }
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target` | string | `"luau"` | Output target |
| `noRename` | boolean | `false` | Skip identifier renaming |
| `noPreserve` | boolean | `false` | Don't preserve Roblox/Lua globals |
| `encodeStrings` | boolean | `false` | XOR-encode string literals |
| `scramble` | boolean | `false` | Control-flow flattening + opaque predicates |
| `oneLine` | boolean | `false` | Minify output |
| `vmType` | string | `"none"` | `"none"` / `"stack"` / `"register"` |
| `vmLevel` | string | `"normal"` | `"debug"` / `"normal"` / `"maximum"` |

---

## Programmatic Usage

```typescript
import { lex, parse, obfuscate, printChunk } from "nevahex";
import { compile as compileStack } from "nevahex/vm/Compiler";
import { generateVM } from "nevahex/vm/vm-gen";

// Direct obfuscation
const { tokens } = lex("local x = 'hello world'");
const ast = parse(tokens);
const obf = obfuscate(ast, { renameLocals: true, preserveGlobals: true, target: "luau" });
console.log(printChunk(obf));

// VM-protected obfuscation
const bytecode = compileStack(obf, { target: "luau" });
const output = generateVM(bytecode, { level: "maximum", target: "luau" });
```

---

## Architecture

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the full pipeline, [docs/VM.md](./docs/VM.md) for opcode reference, and [docs/COMPATIBILITY.md](./docs/COMPATIBILITY.md) for the per-target feature matrix.

```
Source ─▶ Lexer ─▶ Parser ─▶ AST ─▶ Obfuscation Passes ─▶ Compiler ─▶ Bytecode
                                                                 │
                                                  ┌──────────────┴──────────────┐
                                                  ▼                              ▼
                                            Stack VM IR                  Register VM IR
                                                  │                              │
                                                  └──────────────┬───────────────┘
                                                                 ▼
                                                  Code Generator (handlers + dispatch)
                                                                 ▼
                                                  Multi-Layer Cipher (SBox + XOR + base85)
                                                                 ▼
                                                  Custom Bootstrap (anti-tamper + watermark)
                                                                 ▼
                                                  Self-Contained Luau/Lua Script
```

---

## Roblox Luau & Executor Compatibility

NEVAHEX emits a runtime polyfill block that:

- detects the host environment (vanilla Lua, PUC-Rio, Luau, Roblox, executor),
- provides `bit32` shims for Lua 5.1 (where the library is absent),
- polyfills common Roblox services when missing (using a defensive `__index` chain),
- provides safe no-op fallbacks for executor-only APIs (`hookfunction`, `Drawing`, `syn.*`, …) so obfuscated code does not throw when those APIs are unavailable,
- normalises `loadstring` vs `load` (Lua 5.4 removed `loadstring`),
- prints a one-line `[NEVAHEX v1.0] target=<...> executor=<...>` banner at startup (disable with `--no-banner`).

See [docs/EXECUTOR.md](./docs/EXECUTOR.md) for the full list of probed globals and how to extend.

---

## Testing

```bash
npm test
```

The test suite covers the lexer, parser, both VMs, closure/upvalue semantics, varargs, tables, metamethods, loops, calls, control flow, all obfuscation passes, all five target grammars, and a simulated Roblox executor environment.

---

## License

MIT. See [LICENSE](./LICENSE).
