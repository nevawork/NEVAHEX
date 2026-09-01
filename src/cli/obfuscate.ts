#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { lex } from "../lexer/Lexer.js";
import { parse } from "../parser/Parser.js";
import { obfuscate } from "../obfuscator/Obfuscator.js";
import { encodeStrings } from "../obfuscator/StringEncoder.js";
import { scrambleControlFlow } from "../obfuscator/ControlFlowScrambler.js";
import { printChunk, printChunkOneLine } from "../obfuscator/Printer.js";
import { compile } from "../vm/Compiler.js";
import { regCompile } from "../vm/RegCompiler.js";
import { generateVM } from "../vm/vm-gen.js";
import { generateRegVM } from "../vm/reg-vm-gen.js";
import type { VMGenLevel } from "../vm/vm-gen.js";
import { DEFAULT_TARGET, isValidTarget, TARGETS, TARGET_LABELS, type Target } from "../targets.js";

function printHelp() {
  console.log(`NEVAHEX Obfuscator CLI

Usage: nevahex [options] <input.lua> [-o <output>]

Options:
  --target <name>     Output target: ${TARGETS.join(", ")} (default: ${DEFAULT_TARGET})
  --no-rename         Skip identifier renaming
  --no-preserve       Do not preserve Roblox/Lua globals
  --encode-strings    XOR-encode string literals (default: ON if --vm used)
  --no-encode         Disable string encoding
  --scramble          Enable control-flow flattening + opaque predicates
  --vm <stack|register>  Generate VM-protected output (default: register)
  --junk              Inject junk code (max level)
  --one-line          Minify output to a single line
  --production / --advanced / --max   Max protection level
  --compress / --no-compress          LZMA compression
  --vm-debug / --no-vm-encode         Debug mode
  -o, --output <file> Output file path
  --help              Show this help
`);
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.length === 0) {
  printHelp();
  process.exit(args.length === 0 ? 1 : 0);
}

const targetIdx = args.findIndex((a) => a === "--target");
const target: Target = targetIdx >= 0 && isValidTarget(args[targetIdx + 1] || "")
  ? (args[targetIdx + 1] as Target)
  : DEFAULT_TARGET;

const noRename = args.includes("--no-rename");
const noPreserve = args.includes("--no-preserve");
const encodeStringsOpt = args.includes("--encode-strings");
const noEncode = args.includes("--no-encode");
const scrambleOpt = args.includes("--scramble");
const vmOpt = args.includes("--vm");
const junkOpt = args.includes("--junk");
const oneLineOpt = args.includes("--one-line");
const productionOpt = args.includes("--production");
const advancedOpt = args.includes("--advanced");
const maxOpt = args.includes("--max");
const compressOpt = args.includes("--compress");
const noCompressOpt = args.includes("--no-compress");
const outIndex = args.findIndex((a) => a === "-o" || a === "--output");
const outFile = outIndex >= 0 ? args[outIndex + 1] : null;

const fileArgs = args.filter((a, i) =>
  !a.startsWith("-") && (outIndex < 0 || i < outIndex || i > outIndex + 1)
);
const file = fileArgs[0];

const source = file
  ? readFileSync(file, "utf-8")
  : `local x = 42
local name = "World"
print("Hello " .. name)
function foo(a, b)
  return a + b
end
`;

console.error(`[NEVAHEX] target=${target} (${TARGET_LABELS[target]})`);

const { tokens, errors } = lex(source);
if (errors.length > 0) {
  console.error("Lexer errors:", errors);
  process.exit(1);
}

let ast = parse(tokens);
if (encodeStringsOpt && !noEncode) {
  ast = encodeStrings(ast, { enabled: true });
}
if (scrambleOpt) {
  ast = scrambleControlFlow(ast, { enabled: true });
}
let output: string;
if (vmOpt) {
  const vmTypeIdx = args.findIndex((a) => a === "--vm");
  const vmType = (args[vmTypeIdx + 1] || "register") as "stack" | "register";

  const obfuscated = obfuscate(ast, {
    renameLocals: !noRename,
    preserveGlobals: !noPreserve,
    target,
  });
  const vmDebug = args.includes("--vm-debug");

  let level: VMGenLevel = "normal";
  if (vmDebug || args.includes("--no-vm-encode")) level = "debug";
  if (maxOpt || advancedOpt || productionOpt) level = "max";

  if (vmType === "stack") {
    const chunk = compile(obfuscated);
    output = generateVM(chunk, {
      level,
      executorGlobals: level !== "debug",
      noCompression: noCompressOpt,
      target,
    });
  } else {
    const chunk = regCompile(obfuscated);
    const disableFeatures: string[] = [];
    if (vmDebug || level === "debug") disableFeatures.push("controlFlowFlattening");
    output = generateRegVM(chunk, {
      level,
      executorGlobals: level !== "debug",
      polymorphicSeed: Date.now(),
      disableFeatures: disableFeatures as any[],
      target,
    });
  }
} else {
  const obfuscated = obfuscate(ast, {
    renameLocals: !noRename,
    preserveGlobals: !noPreserve,
    target,
  });
  output = oneLineOpt ? printChunkOneLine(obfuscated) : printChunk(obfuscated);
}

if (outFile) {
  writeFileSync(outFile, output, "utf-8");
  console.error(`[NEVAHEX] obfuscated -> ${outFile}`);
} else {
  console.log(output);
}
