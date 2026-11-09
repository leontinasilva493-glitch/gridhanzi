import assert from "node:assert/strict";
import test from "node:test";
import { dailyStrokeOrderCharacters } from "./stroke-order-character-daily";
import { getRelatedStrokeOrderCharacters, getStrokeOrderCharacter, indexableStrokeOrderCharacters } from "./stroke-order-characters";
import { hskCatalog } from "./hsk";

test("daily guides have source-matched readings, individual content, and published neighbours", () => {
  assert.deepEqual(dailyStrokeOrderCharacters.map((entry) => entry.character), Array.from("今明昨时分点前后里外左右开关回出进走坐站买卖钱本"));
  for (const entry of dailyStrokeOrderCharacters) {
    assert.equal(getStrokeOrderCharacter(entry.character), entry);
    assert.equal(entry.useNotes, undefined);
    assert.equal(entry.commonMistake, undefined);
    assert.equal(entry.examples.length, 4);
    assert.equal(entry.exampleSentences.length, 3);
    const paragraphs = [entry.importance, entry.readingNotes, entry.usage, entry.writingTip,
      entry.confusableCharacter.guidance, ...entry.components.map((part) => part.explanation)];
    assert.equal(new Set(paragraphs).size, paragraphs.length);
    assert.equal(entry.seo.title, `${entry.character} (${entry.pinyin}) Stroke Order, Meaning & Examples`);
    assert.equal(entry.seo.h1, `How to Write ${entry.character} (${entry.pinyin}): Stroke Order, Meaning & Examples`);
    for (const card of entry.hsk) {
      assert.ok(hskCatalog.some((record) =>
        card.system === `HSK ${record.system}` && card.level === `Level ${record.level}` &&
        (card.evidenceKind === "standalone"
          ? record.hanzi === entry.character && record.pinyin === entry.pinyin
          : record.hanzi.includes(entry.character) && card.note.includes(record.hanzi))
      ), entry.character);
    }
    for (const character of entry.relatedCharacters) assert.ok(getStrokeOrderCharacter(character));
    // Every new guide has a contextual incoming link from a previously published guide.
    assert.ok(indexableStrokeOrderCharacters.filter((other) => !dailyStrokeOrderCharacters.includes(other))
      .some((other) => getRelatedStrokeOrderCharacters(other).some((related) => related.character === entry.character)), entry.character);
  }
});

test("daily guide contrasts retain contextual tones and traditional-form boundaries", () => {
  assert.equal(getStrokeOrderCharacter("分")!.pinyin, "fēn");
  assert.match(getStrokeOrderCharacter("分")!.readingNotes, /fèn/);
  assert.match(getStrokeOrderCharacter("后")!.readingNotes, /后 remains 后 in 皇后/);
  assert.match(getStrokeOrderCharacter("里")!.readingNotes, /distance unit stays 里/);
  assert.equal(getStrokeOrderCharacter("买")!.pinyin, "mǎi");
  assert.equal(getStrokeOrderCharacter("卖")!.pinyin, "mài");
  for (const entry of indexableStrokeOrderCharacters) {
    const related = getRelatedStrokeOrderCharacters(entry);
    assert.equal(new Set(related).size, related.length);
    assert.ok(!related.includes(entry));
  }
});
