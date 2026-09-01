# NEVAHEX VM Opcodes

## Register VM Opcodes

The register VM uses 57 opcodes (0-56). Each instruction has format: `OP A B C` where A, B, C are register/constant indices.

### Arithmetic & Logic
| Opcode | Name | Description |
|--------|------|-------------|
| 10 | ADD | R[A] = RK[B] + RK[C] |
| 11 | SUB | R[A] = RK[B] - RK[C] |
| 12 | MUL | R[A] = RK[B] * RK[C] |
| 13 | DIV | R[A] = RK[B] / RK[C] |
| 14 | MOD | R[A] = RK[B] % RK[C] |
| 15 | POW | R[A] = RK[B] ^ RK[C] |
| 16 | IDIV | R[A] = RK[B] // RK[C] (floor division) |
| 17 | UNM | R[A] = -R[B] |
| 18 | NOT | R[A] = not R[B] |
| 19 | LEN | R[A] = #R[B] |
| 20 | CONCAT | R[A] = R[B] .. ... .. R[C] |

### Comparison
| Opcode | Name | Description |
|--------|------|-------------|
| 22 | EQ | if (RK[B] == RK[C]) ~= A then pc++ |
| 23 | LT | if (RK[B] < RK[C]) ~= A then pc++ |
| 24 | LE | if (RK[B] <= RK[C]) ~= A then pc++ |

### Control Flow
| Opcode | Name | Description |
|--------|------|-------------|
| 21 | JMP | pc += sBx |
| 25 | TEST | if (R[A] ~= C) then pc++ |
| 26 | TESTSET | if (R[B] ~= C) then R[A]=R[B] else pc++ |
| 30 | FORPREP | R[A] -= R[A+2]; pc += sBx |
| 31 | FORLOOP | R[A] += R[A+2]; if step>0 ? R[A]<=R[A+1] : R[A]>=R[A+1] then { R[A+3]=R[A]; pc+=sBx } |
| 32 | TFORLOOP | R[A+3],... = R[A](R[A+1],R[A+2]); if R[A+3]~=nil then R[A]=R[A+3]; pc+=sBx |

### Function Calls
| Opcode | Name | Description |
|--------|------|-------------|
| 27 | CALL | R[A](R[A+1]...R[A+B-1]) |
| 28 | TAILCALL | return R[A](R[A+1]...R[A+B-1]) |
| 29 | RETURN | return R[A]...R[A+B-1] |
| 36 | SELF | R[A+1]=R[B]; R[A]=R[B][RK[C]] |
| 34 | CLOSURE | R[A] = closure(proto[Bx]) |
| 35 | VARARG | R[A]...R[A+B-1] = vararg |

### Table Operations
| Opcode | Name | Description |
|--------|------|-------------|
| 7 | GETTABLE | R[A] = R[B][RK[C]] |
| 8 | SETTABLE | R[A][RK[B]] = RK[C] |
| 9 | NEWTABLE | R[A] = {} |
| 33 | SETLIST | R[A][B]...R[A+C] = ... |

### Globals & Upvalues
| Opcode | Name | Description |
|--------|------|-------------|
| 5 | GETGLOBAL | R[A] = _G[RK[B]] |
| 6 | SETGLOBAL | _G[RK[B]] = R[A] |
| 37 | GETUPVAL | R[A] = upvalue[B] |
| 38 | SETUPVAL | upvalue[B] = R[A] |
| 39 | CLOSEUPVAL | close upvalues >= R[A] |

### Error Handling
| Opcode | Name | Description |
|--------|------|-------------|
| 40 | PCALL | protected call |
| 41 | XPCALL | protected call with error handler |

### Iteration
| Opcode | Name | Description |
|--------|------|-------------|
| 42 | ITERPREP | prepare for generalized iteration |

### Load/Constants
| Opcode | Name | Description |
|--------|------|-------------|
| 1 | LOADK | R[A] = K[Bx] |
| 2 | LOADNIL | R[A]...R[A+B] = nil |
| 3 | LOADBOOL | R[A] = (B!=0); if C then pc++ |
| 4 | MOVE | R[A] = R[B] |
| 43 | LOADKX | R[A] = K[extra arg] |

### Fused Opcodes (Optimization)
| Opcode | Name | Description |
|--------|------|-------------|
| 45 | F_TEST_JMP | TEST + JMP |
| 46 | F_EQ_JMP | EQ + JMP |
| 47 | F_LT_JMP | LT + JMP |
| 48 | F_LE_JMP | LE + JMP |
| 49 | F_TESTSET_JMP | TESTSET + JMP |
| 50 | F_GGET | GETGLOBAL + ... |
| 51 | F_LOADKK | LOADK + LOADK |
| 52 | F_MOVE_MOVE | MOVE + MOVE |
| 53 | F_SELF_CALL | SELF + CALL |
| 54 | F_GGET_CALL | GETGLOBAL + CALL |
| 55 | F_LOADK_RET | LOADK + RETURN |
| 56 | F_MOVE_RET | MOVE + RETURN |

### Stack VM Opcodes

The stack VM uses a different instruction set with 57 opcodes. Instructions operate on an implicit stack.

| Opcode | Name | Stack Effect |
|--------|------|--------------|
| 0 | NOP | - |
| 1 | LOADK | push K |
| 2 | LOADNIL | push nil... |
| 3 | LOADBOOL | push bool |
| 4 | MOVE | push reg |
| 5 | GETGLOBAL | push _G[key] |
| 6 | SETGLOBAL | _G[key] = pop |
| 7 | GETTABLE | push table[key] |
| 8 | SETTABLE | table[key] = pop |
| 9 | NEWTABLE | push {} |
| 10 | ADD | push pop+pop |
| 11 | SUB | push pop-pop |
| 12 | MUL | push pop*pop |
| 13 | DIV | push pop/pop |
| 14 | MOD | push pop%pop |
| 14 | POW | push pop^pop |
| 16 | IDIV | push pop//pop |
| 17 | UNM | push -pop |
| 18 | NOT | push not pop |
| 19 | LEN | push #pop |
| 20 | CONCAT | push pop..pop |
| 21 | JMP | pc += sBx |
| 22 | EQ | if pop==pop then pc++ |
| 23 | LT | if pop<pop then pc++ |
| 24 | LE | if pop<=pop then pc++ |
| 25 | TEST | if pop then pc++ |
| 26 | TESTSET | if pop then push pop else pc++ |
| 27 | CALL | call |
| 28 | TAILCALL | tailcall |
| 29 | RETURN | return |
| 30 | FORPREP | for prep |
| 31 | FORLOOP | for loop |
| 32 | TFORLOOP | for loop (generic) |
| 33 | SETLIST | table set list |
| 34 | CLOSURE | push closure |
| 35 | VARARG | push varargs |
| 36 | SELF | push self, method |
| 37 | GETUPVAL | push upval |
| 38 | SETUPVAL | upval = pop |
| 39 | CLOSEUPVAL | close upvals |
| 40 | PCALL | pcall |
| 41 | XPCALL | xpcall |
| 42 | ITERPREP | iter prep |
| 43 | LOADKX | push K[extra] |
| 44 | EXTRAARG | extra arg |

### Fused Stack VM Opcodes

| Opcode | Name |
|--------|------|
| 45 | F_TEST_JMP |
| 46 | F_EQ_JMP |
| 47 | F_LT_JMP |
| 48 | F_LE_JMP |
| 49 | F_TESTSET_JMP |
| 50 | F_GGET |
| 51 | F_LOADKK |
| 52 | F_MOVE_MOVE |
| 53 | F_SELF_CALL |
| 54 | F_GGET_CALL |
| 55 | F_LOADK_RET |
| 56 | F_MOVE_RET |

### Register Encoding

Registers are encoded as 8-bit values (0-255). Constants are accessed via RK (Register or Constant) encoding:
- RK(x) where x < 256: register x
- RK(x) where x >= 256: constant (x - 256)

### Jump Encoding

Jumps use signed 18-bit offsets (sBx) with bias of 131071.

## VM Runtime Architecture

### Stack VM
- Implicit operand stack
- Frame-based execution
- Dispatch loop with opcode handlers

### Register VM
- Explicit register array (R[0..255])
- Frame with base pointer
- Direct register access
- More efficient for local-heavy code

## Protection Features

### Polymorphic Dispatch
- Opcode shuffling with XOR key
- Handler table encryption
- Dead handler elimination

### Control Flow Flattening
- State machine dispatch
- Opaque predicate predicates
- Non-linear jump encoding

### Anti-Tamper
- Bytecode checksum (Adler-32)
- Handler integrity checks
- Self-modifying code detection

### Multi-Layer Cipher
1. SBox substitution (256-byte)
2. XOR stream cipher (incrementing key)
3. Base85 encoding
4. LZMA compression (optional)

### Anti-Debug
- Timing checks
- Environment fingerprinting
- Coroutine manipulation detection

## Bytecode Format

```
BytecodeChunk {
  code: Instruction[],
  K: Constant[],
  protos: BytecodeChunk[],
  upvalues: UpvalueRef[],
  numParams: number,
  maxRegs: number,
  hasVarargs: boolean
}
```

### Constant Types
| Type | Tag | Description |
|------|-----|-------------|
| Nil | 0 | null |
| Boolean | 1 | true/false |
| Number | 2 | double |
| String | 3 | string |
| Proto | 4 | nested function |

## Runtime Environment

The VM bootstrap creates a protected environment:
- `__index` metatable with fallback to `_G`
- Polyfilled globals (`bit32`, `table.create`, `table.pack`)
- Executor compatibility shims
- Anti-debug timing checks
- Watermark verification