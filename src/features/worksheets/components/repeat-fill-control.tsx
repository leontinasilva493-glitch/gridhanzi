"use client";
export function RepeatFillControl({ enabled, disabled, chinese, onChange }: {
 enabled: boolean; disabled: boolean; chinese: boolean; onChange: (enabled: boolean) => void;
}) {
 return <div className="my-3 text-sm"><button type="button" aria-pressed={enabled} disabled={disabled}
 className="hs-secondary-button min-h-11 disabled:opacity-50" onClick={() => onChange(!enabled)}>
 {enabled ? "✓ " : ""}{chinese ? "重复铺满本页" : "Repeat to fill page"}</button>
 <p className="mt-2 text-xs text-[#657083]">{chinese ? "按当前字词顺序重复，补满最后一页；再次点击恢复。" : "Repeat your words to fill the last page. Click again to restore."}</p></div>;
}
