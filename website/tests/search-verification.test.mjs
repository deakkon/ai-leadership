import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(
  new URL("../lib/search-verification.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { searchVerification } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

test("unconfigured verification never emits placeholder ownership tokens", () => {
  assert.deepEqual(searchVerification(), {});
  assert.deepEqual(searchVerification("  ", ""), {});
});
test("Google and Bing can be configured independently using public token values", () => {
  assert.deepEqual(searchVerification(" google-token "), {
    google: "google-token",
  });
  assert.deepEqual(searchVerification(undefined, " bing-token "), {
    other: { "msvalidate.01": "bing-token" },
  });
  assert.deepEqual(searchVerification("g", "b"), {
    google: "g",
    other: { "msvalidate.01": "b" },
  });
});
