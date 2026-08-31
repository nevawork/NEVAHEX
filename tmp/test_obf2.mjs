import { lex } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/lexer/Lexer.js";
import { parse } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/parser/Parser.js";
import { printChunk } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/dist/obfuscator/Printer.js";

const src = "game.Players.LocalPlayer.Character";
const { tokens, errors } = lex(src);
console.log("tokens:", tokens.map(t => ({ type: t.type, value: t.value })));
console.log("lex errs:", errors);
const ast = parse(tokens);
console.log("printChunk:", printChunk(ast));
