import assert from "node:assert/strict";
import test from "node:test";
import { classroomStrokeOrderCharacters } from "./stroke-order-character-classroom";
import { getStrokeOrderCharacter } from "./stroke-order-characters";
import { hskCatalog } from "./hsk";

const expected = Array.from("生老师同朋友名叫什么吗呢很都要会能想看听读写谢语");

test("classroom batch contains 24 distinct source-grounded, publication-ready guides", () => {
  assert.deepEqual(classroomStrokeOrderCharacters.map((entry) => entry.character), expected);
  for (const entry of classroomStrokeOrderCharacters) {
    assert.equal(getStrokeOrderCharacter(entry.character), entry);
    assert.equal(entry.useNotes, undefined);
    assert.equal(entry.commonMistake, undefined);
    const paragraphs = [entry.importance, entry.readingNotes, entry.usage,
      entry.writingTip, entry.confusableCharacter.guidance,
      ...entry.components.map((part) => part.explanation)];
    assert.equal(new Set(paragraphs).size, paragraphs.length, entry.character);
    assert.equal(entry.relatedCharacters.length, 3);
    assert.equal(new Set(entry.relatedCharacters).size, 3);
    assert.ok(!entry.relatedCharacters.includes(entry.character));
    for (const related of entry.relatedCharacters) assert.ok(getStrokeOrderCharacter(related), related);
    for (const card of entry.hsk) {
      assert.ok(hskCatalog.some((record) =>
        card.system === `HSK ${record.system}` && card.level === `Level ${record.level}` &&
        (card.evidenceKind === "standalone"
          ? record.hanzi === entry.character && record.pinyin === entry.pinyin
          : record.hanzi.includes(entry.character) && card.note.includes(record.hanzi))
      ), entry.character);
    }
  }
});

test("classroom defaults preserve question particles and explain alternate readings", () => {
  for (const [character, reading] of [["吗", "ma"], ["呢", "ne"], ["么", "me"], ["什", "shén"], ["都", "dōu"], ["会", "huì"], ["要", "yào"]]) {
    assert.equal(getStrokeOrderCharacter(character)?.pinyin, reading);
  }
  for (const [character, alternate] of [["都", "dū"], ["会", "kuài"], ["要", "yāo"], ["看", "kān"], ["呢", "ní"]]) {
    assert.ok(getStrokeOrderCharacter(character)?.readingNotes.includes(alternate), character);
  }
  assert.match(getStrokeOrderCharacter("吗")!.usage, /not normally added/);
  assert.match(getStrokeOrderCharacter("都")!.usage, /not all.*none/);
});
