import test from "node:test";
import assert from "node:assert/strict";
import writing from "./hsk-writing-characters.json";
import beginner from "./hsk-2025-beginner-source.json";
import { cardsToEntries, drawCards, gachaCards, getRarity, parseCollection, rarityWeights } from "./gacha";

test("gacha cards are unique, complete, and honestly labeled against the HSK writing groups", () => {
  const writingCharacters = new Set(writing.groups.slice(0, 2).flatMap((group) => group.characters));
  assert.equal(new Set(gachaCards.map((card) => card.character)).size, gachaCards.length);
  assert.ok(gachaCards.length >= 120 && gachaCards.length <= 180);
  for (const card of gachaCards) {
    assert.ok(card.character && card.pinyin && card.meaning && card.example.hanzi && card.example.pinyin && card.example.meaning);
    assert.match(card.character, /^\p{Script=Han}$/u);
    assert.ok(card.example.hanzi.includes(card.character), `${card.character}: example must include the target character`);
    assert.doesNotMatch(card.pinyin, /[/\d]/, `${card.character}: choose one contextual reading`);
    assert.equal(card.hsk, writingCharacters.has(card.character));
  }
});

test("rarity is stable for a character and weighted draws respect the selected pool", () => {
  assert.equal(getRarity("学"), "SSR");
  assert.equal(getRarity("猫"), "SR");
  assert.equal(getRarity("爸"), "R");
  assert.equal(getRarity("一"), "C");
  assert.deepEqual(rarityWeights, { C: 8, R: 4, SR: 2, SSR: 1 });
  const pool = gachaCards.filter((card) => ["学", "猫", "爸", "一"].includes(card.character));
  assert.equal(new Set(drawCards(pool, 10, () => 0).map((card) => card.character)).size, 4);
  assert.deepEqual(drawCards(pool, 10, () => 0).map((card) => card.character), drawCards(pool, 10, () => 0).map((card) => card.character));
});

test("collection restores only known characters with valid positive counts", () => {
  assert.deepEqual(parseCollection(JSON.stringify({ 学: 2, 猫: 1, 龙: 4, 爸: -1, 一: 1.5 })), { 学: 2, 猫: 1 });
  assert.deepEqual(parseCollection("not json"), {});
});

test("examples in the 2025 official vocabulary source keep its pinyin", () => {
  const normalize = (value: string) => value.normalize("NFC").toLowerCase().replace(/[^\p{L}\p{M}]/gu, "");
  let checked = 0;
  for (const card of gachaCards) {
    const source = beginner.entries.filter((entry) => entry.hanzi === card.example.hanzi);
    if (source.length) {
      checked += 1;
      assert.ok(source.some((entry) => normalize(entry.pinyin) === normalize(card.example.pinyin)), `${card.character}: ${card.example.hanzi}`);
    }
  }
  assert.ok(checked >= 60);
});

test("reviewed examples keep a relevant sense and do not introduce a different reading", () => {
  const expected = { 经: ["jīng", "经过"], 议: ["yì", "议论"], 子: ["zǐ", "子女"], 目: ["mù", "目光"], 玉: ["yù", "玉石"], 马: ["mǎ", "骑马"], 快: ["kuài", "快车"], 地: ["de", "慢慢地"], 得: ["dé", "得到"] };
  for (const [character, [pinyin, example]] of Object.entries(expected)) {
    const card = gachaCards.find((item) => item.character === character);
    assert.ok(card);
    assert.equal(card.pinyin, pinyin);
    assert.equal(card.example.hanzi, example);
  }
});

test("draws have no duplicates and worksheet handoff preserves selected data and order", () => {
  const drawn = drawCards(gachaCards, 10, () => 0);
  assert.equal(new Set(drawn.map((card) => card.character)).size, 10);
  const entries = cardsToEntries(drawn.map((card) => card.character));
  assert.deepEqual(entries.map(({ hanzi, pinyin, english }) => ({ hanzi, pinyin, english })), drawn.map((card) => ({ hanzi: card.character, pinyin: card.pinyin, english: card.meaning })));
  assert.deepEqual(cardsToEntries([drawn[0].character, drawn[0].character]), []);
  assert.deepEqual(cardsToEntries(["not a card"]), []);
  for (const card of gachaCards) {
    const [entry] = cardsToEntries([card.character]);
    assert.deepEqual([entry.hanzi, entry.pinyin, entry.english], [card.character, card.pinyin, card.meaning]);
  }
});
