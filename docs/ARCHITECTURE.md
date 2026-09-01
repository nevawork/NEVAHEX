# NEVAHEX Architecture

## Overview

NEVAHEX is a multi-target Lua/Luau obfuscator with VM-based protection. It implements a complete compilation pipeline:

```
Source → Lexer → Parser → AST → Obfuscation Passes → Compiler → Bytecode → VM Generator → Cipher → Bootstrap → Protected Script
```

## Pipeline Stages

### 1. Lexer (`src/lexer/Lexer.ts`)
- Converts source code into tokens
- Supports Lua 5.1-5.4 and Roblox Luau syntax
- Handles string interpolation, long strings, numbers (hex/bin/decimal), operators

### 2. Parser (`src/parser/Parser.ts`)
- Recursive descent parser
- Produces AST with full type information
- Supports all targets: Lua 5.1, 5.2, 5.3, 5.4, Luau
- Handles type annotations, generics, if-else expressions, string interpolation, compound assignment, `continue`, `goto`, `<const>`/`<close>` attributes

### 3. AST (`src/ast/types.ts`)
- Complete node type definitions
- Statement and expression nodes
- Type system nodes for Luau

### 4. Obfuscation Passes (`src/obfuscator/`)
- **Renamer** (`Obfuscator.ts`): Scope-aware identifier renaming with seed control, preserves Roblox/Lua globals
- **String Encoder** (`StringEncoder.ts`): XOR encoding with per-string keys, deduplication
- **Control Flow Scrambler** (`ControlFlowScrambler.ts`): Opaque predicates + CFG flattening
- **Printer** (`Printer.ts`): AST to source code with formatting

### 5. Compiler (`src/vm/Compiler.ts`, `src/vm/RegCompiler.ts`)
- **Stack VM Compiler**: Stack-based bytecode generation
- **Register VM Compiler**: Register-based bytecode generation
- Both support closures, upvalues, varargs, multi-return, tables, metamethods

### 6. VM Generator (`src/vm/vm-gen.ts`, `src/vm/reg-vm-gen.ts`)
- Generates self-contained VM runtime
- Three protection levels: `debug`, `normal`, `maximum`
- Features: polymorphic dispatch, opaque predicates, handler mutation, anti-tamper, anti-debug, LZMA compression, multi-layer cipher

### 7. Cipher & Bootstrap (`src/vm/bootstrap-template.ts`, `src/vm/lzma.ts`)
- Custom multi-layer cipher (SBox + XOR stream + Base85)
- LZMA compression
- Custom bootstrap with anti-tamper, watermark, self-zeroing bytecode

### 8. Targets (`src/targets.ts`)
- Five targets: `lua51`, `lua52`, `lua53`, `lua54`, `luau`
- Per-target feature flags
- Runtime compatibility shims

### 9. Interfaces
- **CLI** (`src/cli/`): Command-line interface
- **Web Server** (`src/server.ts`): Express API + Web UI
- **Programmatic API** (`src/index.ts`): TypeScript module exports

## Key Design Decisions

### Dual VM Architecture
Two VM implementations provide flexibility:
- **Stack VM**: Traditional stack-based, simpler implementation
- **Register VM**: Register-based, better performance, more complex

### Multi-Target Support
Single codebase handles 5 targets via feature flags:
- Parser accepts all syntax, compiler validates per-target
- Runtime shims provide compatibility (bit32, loadstring, executor globals)

### Protection Levels
- **Debug**: No cipher, minimal obfuscation, readable output
- **Normal**: Standard protection, cipher enabled
- **Maximum**: All features, nested VM, maximum compression

### Executor Compatibility
Roblox Luau target includes runtime shims that:
- Probe for Roblox services (`game`, `workspace`, etc.)
- Provide safe fallbacks for executor APIs (`hookfunction`, `Drawing`, etc.)
- Normalize `loadstring`/`load` across Lua versions
- Polyfill `bit32` for Lua 5.1

## Security Features

1. **Multi-layer Cipher**: SBox substitution + XOR stream + Base85 encoding
2. **Polymorphic Dispatch**: Randomized opcode mapping, handler ordering
3. **Anti-Tamper**: Bytecode checksum verification
4. **Anti-Debug**: Timing checks, environment detection
5. **Control Flow Flattening**: State machine dispatch + opaque predicates
6. **Handler Mutation**: Runtime handler code modification
7. **Nested VM**: VM-within-VM at maximum level
8. **LZMA Compression**: Bytecode compression
9. **Watermark**: NEVAHEX branding in generated output
10. **Self-Zeroing**: Bytecode erased after execution

## Files of Interest

| File | Purpose |
|------|---------|
| `src/index.ts` | Main exports |
| `src/targets.ts` | Target definitions |
| `src/lexer/Lexer.ts` | Lexical analysis |
| `src/parser/Parser.ts` | Parsing |
| `src/ast/types.ts` | AST node types |
| `src/obfuscator/Obfuscator.ts` | Renamer |
| `src/obfuscator/StringEncoder.ts` | String encoding |
| `src/obfuscator/ControlFlowScrambler.ts` | CFG flattening |
| `src/vm/Compiler.ts` | Stack VM compiler |
| `src/vm/RegCompiler.ts` | Register VM compiler |
| `src/vm/vm-gen.ts` | Stack VM generator |
| `src/vm/reg-vm-gen.ts` | Register VM generator |
| `src/vm/bootstrap-template.ts` | Bootstrap template |
| `src/vm/lzma.ts` | LZMA compression |
| `src/vm/lzma.ts` | LZMA compression |
| `src/server.ts` | Web API server |
| `src/cli/obfuscate.ts` | CLI entry point |
| `public/` | Web UI assets |