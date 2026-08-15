import assert from "node:assert/strict";
import test from "node:test";

test("Taiwan Traditional conversion uses regional phrase choices", async () => {
  const { convertChineseText } = await import("./traditional");
  const fixtures = new Map([
    ["软件", "軟體"],
    ["鼠标", "滑鼠"],
    ["自行车", "腳踏車"],
    ["出租车", "計程車"],
    ["程序", "程式"],
    ["头发", "頭髮"],
    ["面条", "麵條"],
    ["里面", "裡面"],
    ["干杯", "乾杯"],
  ]);

  for (const [simplified, traditional] of fixtures) {
    assert.equal(
      convertChineseText(simplified, "simplified", "traditional-tw"),
      traditional,
      simplified,
    );
  }
});

test("worksheet conversion preserves row identity and learning metadata", async () => {
  const { convertWorksheetEntries } = await import("./traditional");
  const entries = convertWorksheetEntries(
    [{ id: "stable-id", hanzi: "老师", pinyin: "lǎoshī", english: "teacher", status: "complete" as const }],
    "simplified",
    "traditional-tw",
  );

  assert.deepEqual(entries, [
    { id: "stable-id", hanzi: "老師", pinyin: "lǎoshī", english: "teacher", status: "complete" },
  ]);
});
