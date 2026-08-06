import assert from "node:assert/strict";
import test from "node:test";

import { localize, switchLocalePath } from "./i18n";

test("localize selects Chinese copy only for Chinese locales", () => {
  assert.equal(localize("en", "Print", "打印"), "Print");
  assert.equal(localize("zh", "Print", "打印"), "打印");
  assert.equal(localize("zh-CN", "Print", "打印"), "打印");
});

test("switchLocalePath adds and removes the optional Chinese prefix", () => {
  assert.equal(switchLocalePath("/generator", "zh"), "/zh/generator");
  assert.equal(switchLocalePath("/zh/generator", "en"), "/generator");
  assert.equal(switchLocalePath("/zh", "en"), "/");
  assert.equal(switchLocalePath("/", "zh"), "/zh");
});

test("switchLocalePath removes internal default-locale prefixes", () => {
  assert.equal(switchLocalePath("/en", "en"), "/");
  assert.equal(switchLocalePath("/en", "zh"), "/zh");
  assert.equal(switchLocalePath("/en/generator", "en"), "/generator");
  assert.equal(switchLocalePath("/en/generator", "zh"), "/zh/generator");
});
