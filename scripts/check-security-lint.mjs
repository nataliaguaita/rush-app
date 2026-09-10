// Blocks the build on eslint-plugin-security errors only, leaving other
// pre-existing lint debt (unrelated to this check) as a non-blocking concern.
import { ESLint } from "eslint";

const eslint = new ESLint();
const results = await eslint.lintFiles(["."]);
const securityResults = results
  .map((r) => ({ ...r, messages: r.messages.filter((m) => m.ruleId?.startsWith("security/")) }))
  .filter((r) => r.messages.length > 0);

if (securityResults.length > 0) {
  const formatter = await eslint.loadFormatter("stylish");
  console.error(await formatter.format(securityResults));
  const count = securityResults.reduce((sum, r) => sum + r.messages.length, 0);
  console.error(`\n${count} security lint error(s) found. Build blocked.`);
  process.exit(1);
}

console.log("eslint-plugin-security: no issues found.");
