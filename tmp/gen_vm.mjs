import { writeFileSync } from "fs";
import { lex } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/lexer/Lexer.js";
import { parse } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/parser/Parser.js";
import { obfuscate } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/obfuscator/Obfuscator.js";
import { regCompile } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/vm/RegCompiler.js";
import { generateRegVM } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/vm/reg-vm-gen.js";

const code = `print("hi")`;
const { tokens } = lex(code);
const ast = parse(tokens);
const obfAst = obfuscate(ast, { renameLocals: true, preserveGlobals: true });
const chunk = regCompile(obfAst);
const vmOutput = generateRegVM(chunk, { level: "normal", polymorphicSeed: 1, disableFeatures: [] });
writeFileSync("/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/tmp/fact_lua.txt", vmOutput);
console.log("written, length:", vmOutput.length);
