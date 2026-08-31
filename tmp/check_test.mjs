import { runLua, makeRobloxEnv } from "/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_68cfb9c6-1366-4288-9876-356e5e8f6705/nevahex/tests/lua-runner.ts";
console.log("runLua:", typeof runLua);
console.log("env:", typeof makeRobloxEnv);
const r = runLua("print('hi')", makeRobloxEnv(), { debugMode: true });
console.log("r:", r);
