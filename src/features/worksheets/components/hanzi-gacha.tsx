"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/core/i18n/navigation";
import { cardsToEntries, drawCards, GACHA_COLLECTION_KEY, GACHA_HANDOFF_KEY, GACHA_LIMIT, GACHA_SELECTION_KEY, gachaCards, getRarity, parseCollection, type Collection, type GachaCard, type GachaRarity } from "../gacha";
import { trackGachaEvent } from "../analytics";
import characterData from "../gacha-character-data.json";

type Phase = "idle" | "machine" | "capsule" | "teaser" | "reveal" | "anticipate" | "spotlight" | "result";
type Draw = { card: GachaCard; isNew: boolean };
const topics: Record<string, string> = {
  Nature: "山水日月天地火木雨雪花草石风云海河星春夏秋冬",
  "People & Family": "人父母爸妈子女儿口手目耳心友家我你他她",
  "School & Learning": "学书文语字老师生中写读教校",
  "Everyday Life": "门车家吃喝食饭茶衣买走来去大小多少年月时间看见好工作",
};
const grades: GachaRarity[] = ["C", "R", "SR", "SSR"];

export function HanziGacha() {
  const router = useRouter();
  const zh = useLocale() === "zh";
  const t = (en: string, cn: string) => zh ? cn : en;
  const [pool, setPool] = useState("common");
  const [topic, setTopic] = useState("All topics");
  const [selection, setSelection] = useState<string[]>([]);
  const [collection, setCollection] = useState<Collection>({});
  const [draw, setDraw] = useState<Draw[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0);
  const [spotlight, setSpotlight] = useState<Draw | null>(null);
  const [detail, setDetail] = useState<GachaCard | null>(null);
  const [album, setAlbum] = useState(false);
  const [albumFilter, setAlbumFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [favourites, setFavourites] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [sound, setSound] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => gachaCards.filter((card) => (pool === "common" || card.hsk) && (topic === "All topics" || topics[topic]?.includes(card.character))), [pool, topic]);
  const collectedCount = Object.keys(collection).length;
  const busy = phase !== "idle" && phase !== "result";

  function playTone(frequency: number) {
    if (!sound || !audioRef.current) return;
    try {
      const context = audioRef.current;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.23);
      oscillator.connect(gain); gain.connect(context.destination);
      oscillator.start(); oscillator.stop(context.currentTime + 0.23);
    } catch { /* Sound is optional. */ }
  }
  useEffect(() => () => { void audioRef.current?.close(); }, []);

  useEffect(() => {
    try {
      const selectionRaw = localStorage.getItem(GACHA_SELECTION_KEY);
      const collectionRaw = localStorage.getItem(GACHA_COLLECTION_KEY);
      const favouritesRaw = localStorage.getItem("gridhanzi:gacha:favourites:v1");
      let saved: unknown = [];
      let fav: unknown = [];
      try { saved = JSON.parse(selectionRaw || "[]") as unknown; } catch { /* A damaged list must not discard the collection. */ }
      try { fav = JSON.parse(favouritesRaw || "[]") as unknown; } catch { /* A damaged favourites list is independent of the collection. */ }
      if (Array.isArray(saved) && saved.length <= GACHA_LIMIT && (saved.length === 0 || cardsToEntries(saved).length === saved.length)) setSelection(saved as string[]);
      setCollection(parseCollection(collectionRaw));
      if (Array.isArray(fav)) setFavourites(fav.filter((item): item is string => typeof item === "string" && gachaCards.some((card) => card.character === item)));
    } catch { setStorageAvailable(false); }
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(GACHA_SELECTION_KEY, JSON.stringify(selection));
      localStorage.setItem(GACHA_COLLECTION_KEY, JSON.stringify(collection));
      localStorage.setItem("gridhanzi:gacha:favourites:v1", JSON.stringify(favourites));
    } catch { setStorageAvailable(false); }
  }, [ready, selection, collection, favourites]);
  useEffect(() => {
    if (phase !== "machine" && phase !== "capsule" && phase !== "teaser" && phase !== "reveal" && phase !== "anticipate") return;
    const timer = window.setTimeout(() => {
      if (phase === "machine") setPhase("capsule");
      else if (phase === "capsule") setPhase("teaser");
      else if (phase === "teaser") setPhase("reveal");
      else if (phase === "anticipate") { playTone(880); setShown(shown + 1); setPhase("spotlight"); }
      else if (shown >= draw.length) setPhase("result");
      else {
        const next = draw[shown];
        if (["SR", "SSR"].includes(getRarity(next.card.character))) { playTone(660); setSpotlight(next); setPhase("anticipate"); }
        else { playTone(520); setShown(shown + 1); }
      }
    }, phase === "machine" ? 1200 : phase === "capsule" ? 1150 : phase === "teaser" ? 1050 : phase === "anticipate" ? 1050 : 520);
    return () => window.clearTimeout(timer);
  }, [phase, shown, draw]);
  useEffect(() => {
    if (!album && !detail) return;
    overlayRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { if (detail) setDetail(null); else setAlbum(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [album, detail]);

  function pull(count: number) {
    if (busy) return;
    if (sound && !audioRef.current) {
      try { audioRef.current = new AudioContext(); } catch { /* The game works without audio. */ }
    }
    if (sound && audioRef.current?.state === "suspended") void audioRef.current.resume().catch(() => {});
    playTone(380);
    const next = drawCards(filtered, count);
    if (!next.length) { setMessage(t("No characters in this pool.", "此卡池没有可抽取的汉字。")); return; }
    const snapshot = { ...collection };
    const round = next.map((card) => { const isNew = !snapshot[card.character]; snapshot[card.character] = (snapshot[card.character] || 0) + 1; return { card, isNew }; });
    setCollection(snapshot);
    setDraw(round); setShown(reduce ? round.length : 0); setSpotlight(null); setDetail(null);
    setPhase(reduce ? "result" : "machine");
    setMessage("");
    trackGachaEvent("gacha_pull", next.length);
  }
  function skip() { setShown(draw.length); setSpotlight(null); setPhase("result"); }
  function toggle(character: string) {
    if (selection.includes(character)) { setSelection(selection.filter((item) => item !== character)); return; }
    if (selection.length >= GACHA_LIMIT) { setMessage(t("You can add up to 30 characters.", "最多选择 30 个汉字。")); return; }
    setSelection([...selection, character]); trackGachaEvent("gacha_select", selection.length + 1);
  }
  function selectAll() {
    const combined = [...new Set([...selection, ...draw.map(({ card }) => card.character)])];
    setSelection(combined.slice(0, GACHA_LIMIT));
    if (combined.length > GACHA_LIMIT) setMessage(t("You can add up to 30 characters.", "最多选择 30 个汉字。"));
  }
  function createWorksheet() {
    try {
      sessionStorage.setItem(GACHA_HANDOFF_KEY, JSON.stringify(selection));
      if (sessionStorage.getItem(GACHA_HANDOFF_KEY) !== JSON.stringify(selection)) throw new Error("storage");
      trackGachaEvent("gacha_worksheet_open", selection.length); router.push("/generator#gacha");
    } catch { setMessage(t("Could not transfer your selection. Allow browser storage and try again; your cards are still here.", "无法传递选字，请允许浏览器存储后重试；选中的卡片仍在这里。")); }
  }
  function cardView(card: GachaCard, isNew = false, large = false) {
    const rarity = getRarity(card.character);
    return <div className={`gacha-card gacha-${rarity.toLowerCase()} ${large ? "gacha-card-large" : ""}`}>
      <div className="gacha-card-top"><strong>{rarity}</strong><span>{isNew ? "✦ NEW" : collection[card.character] ? `×${collection[card.character]}` : "HANZI"}</span></div>
      <div className="gacha-character">{card.character}</div><p className="gacha-pinyin">{card.pinyin}</p><p className="gacha-meaning">{card.meaning}</p><div className="gacha-card-bottom">{card.hsk ? "HSK 3.0 · WRITING" : "HANZI COLLECTION"}</div>
    </div>;
  }
  const albumCards = gachaCards.filter((card) => {
    if (albumFilter === "owned" && !collection[card.character]) return false;
    if (albumFilter === "favourites" && !favourites.includes(card.character)) return false;
    if (grades.includes(albumFilter as GachaRarity) && getRarity(card.character) !== albumFilter) return false;
    const q = query.trim().toLowerCase();
    return !q || `${card.character} ${card.pinyin} ${card.meaning}`.toLowerCase().includes(q);
  });
  const detailFacts = detail ? (characterData as Record<string, { strokes: number; radical: string; traditional: string }>)[detail.character] : undefined;
  const bestRarity = draw.some(({ card }) => getRarity(card.character) === "SSR") ? "SSR" : draw.some(({ card }) => getRarity(card.character) === "SR") ? "SR" : "normal";
  return <main className="gacha-page"><div className="gacha-wrap">
    <header className="gacha-header"><p className="gacha-eyebrow">GRIDHANZI · PLAY & PRACTISE</p><h1>HANZI <span>GACHA</span><small className="mt-3 block font-sans text-base font-bold tracking-normal text-[#182333] sm:text-lg">{t("Chinese Character Collection Game", "汉字收集游戏")}</small></h1><p>{t("A little surprise in every character.", "每一个汉字，都藏着惊喜。")}</p></header>
    <div className="gacha-toolbar"><button onClick={() => setAlbum(true)}>▦ {t("Collection", "汉字图鉴")} <b>{collectedCount}/{gachaCards.length}</b></button><label><input type="checkbox" checked={reduce} onChange={(e) => setReduce(e.target.checked)} /> {t("Reduce motion", "减弱动效")}</label><label><input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> {t("Sound effects", "音效")}</label></div>
    <section className="gacha-arena" aria-label={t("Hanzi gacha machine", "汉字扭蛋机")}>
      <div className="gacha-arena-label"><span>✦</span> {t("READY TO DISCOVER?", "准备发现新汉字？")} <span>✦</span></div>
      <div className="gacha-controls"><label>{t("Character pool", "汉字卡池")} <select value={pool} disabled={busy} onChange={(e) => setPool(e.target.value)}><option value="common">{t("Common Hanzi", "常用汉字")} · {gachaCards.length}</option><option value="hsk">HSK 3.0 · {gachaCards.filter((card) => card.hsk).length}</option></select></label><label>{t("Topic", "主题")} <select value={topic} disabled={busy} onChange={(e) => setTopic(e.target.value)}><option>All topics</option>{Object.keys(topics).map((name) => <option key={name}>{name}</option>)}</select></label><span>{filtered.length} {t("characters", "个汉字")}</span></div>
      <div className="gacha-stage"><div className={`gacha-machine ${phase === "machine" ? "is-spinning" : ""}`} aria-hidden="true"><div className="gacha-machine-cap"/><div className="gacha-top"><span>学</span><span>字</span><span>山</span><span>水</span><span>爱</span><span>月</span><span>人</span><span>文</span></div><div className="gacha-body"><div className="gacha-sign">汉字扭蛋</div><div className="gacha-dial">✦</div><div className="gacha-slot" /></div></div>{phase === "capsule" && <div className="gacha-capsule" aria-hidden="true"><span>字</span></div>}</div>
      <div className="gacha-actions"><button type="button" onClick={() => pull(1)} disabled={!ready || busy || !filtered.length}>{t("PULL 1", "抽一张")}</button><button type="button" className="gacha-main-button" onClick={() => pull(10)} disabled={!ready || busy || !filtered.length}>{t("PULL ×10", "十连抽")} <span>✦</span></button></div>
      {busy ? <button className="gacha-skip" onClick={skip}>{t("Skip animation →", "跳过动画 →")}</button> : <p className="gacha-hint">{t("FREE TO PLAY · NO ACCOUNT · NO REPEATS IN ONE PULL", "免费游玩 · 无需登录 · 每轮不重复")}</p>}
      <p className="gacha-status" role="status" aria-live="polite">{message || (!storageAvailable ? t("Collection cannot be saved in this browser; you can still play.", "浏览器存储不可用，图鉴无法保存，但仍可继续游戏。") : "")}</p>
    </section>
    {draw.length > 0 && phase === "result" ? <section className="gacha-results" aria-label={t("Pull results", "抽卡结果")}><div className="gacha-section-head"><div><p className="gacha-eyebrow">{phase === "result" ? "YOUR LATEST PULL" : "REVEALING YOUR CARDS"}</p><h2>{phase === "result" ? t("Your discoveries.", "本轮收获") : t("What will you discover?", "会抽到什么呢？")}</h2></div>{phase === "result" && <button onClick={selectAll}>{t("Select all", "全选本轮")}</button>}</div><div className="gacha-grid">{draw.map(({ card, isNew }, i) => <div className="gacha-result-slot" key={card.character}>{i < shown ? <><button className="gacha-card-button" onClick={() => setDetail(card)} aria-label={`${t("View", "查看")} ${card.character}`}>{cardView(card, isNew)}</button><button className={`gacha-add ${selection.includes(card.character) ? "chosen" : ""}`} onClick={() => toggle(card.character)} aria-pressed={selection.includes(card.character)}>{selection.includes(card.character) ? t("✓ Added", "✓ 已选择") : t("+ Add to practice", "+ 加入练习")}</button></> : <div className="gacha-card-back"><span>字</span></div>}</div>)}</div>{phase === "result" && <p className="gacha-round-summary">✦ {draw.filter((item) => item.isNew).length} {t("new characters", "个新字")} · {draw.filter((item) => !item.isNew).length} {t("duplicates", "个重复字")} · {t("Tap a card to learn more", "点击卡片查看详情")}</p>}</section> : null}
    {busy && phase !== "spotlight" && <div className={`gacha-ceremony phase-${phase} ceremony-${bestRarity.toLowerCase()}`} role="region" aria-label={t("Opening cards", "开卡演出")}>
      <div className="ceremony-sky" aria-hidden="true"><i>学</i><i>字</i><i>水</i><i>山</i><i>爱</i><i>文</i></div>
      <div className="ceremony-top"><span className="ceremony-brand">GRIDHANZI <b>GACHA</b></span><span className="ceremony-progress">{t("YOUR PULL", "本轮抽卡")} · {shown} / {draw.length}</span><button onClick={skip}>{t("Skip all →", "跳过全部 →")}</button></div>
      {(phase === "machine" || phase === "capsule" || phase === "teaser") && <div className="ceremony-machine-area"><p className="ceremony-kicker">✦ {t("A LITTLE SURPRISE IS WAITING", "惊喜正在靠近")} ✦</p><div className={`gacha-machine ceremony-machine-object ${phase === "machine" ? "is-spinning" : ""}`} aria-hidden="true"><div className="gacha-machine-cap"/><div className="gacha-top"><span>学</span><span>字</span><span>山</span><span>水</span><span>爱</span><span>月</span><span>人</span><span>文</span></div><div className="gacha-body"><div className="gacha-sign">汉字扭蛋</div><div className="gacha-dial">✦</div><div className="gacha-slot" /></div></div>{phase !== "machine" && <div className="ceremony-ball" aria-hidden="true"><span>字</span></div>}<p className="ceremony-message">{phase === "machine" ? t("TURNING...", "扭蛋转动中…") : phase === "capsule" ? t("WHAT'S INSIDE?", "里面会是什么？") : bestRarity === "normal" ? t("READY TO REVEAL!", "准备开卡！") : t("A SPECIAL GLOW!", "好像有惊喜！")}</p><div className="ceremony-meter"><span/><span/><span/><span/><span/></div></div>}
      {(phase === "reveal" || phase === "anticipate") && <div className="ceremony-reveal"><p className="ceremony-kicker">✦ {t("YOUR HANZI DISCOVERIES", "揭晓你的汉字")} ✦</p><h2>{phase === "anticipate" ? t("Wait for it...", "等等，有惊喜…") : t("What did you find?", "抽到了什么？")}</h2><div className="ceremony-grid">{draw.map(({ card, isNew }, i) => <div key={card.character} className={`ceremony-slot ${phase === "anticipate" && i === shown ? "ceremony-next" : ""}`}>{i < shown ? cardView(card, isNew) : <div className="gacha-card-back"><span>字</span></div>}</div>)}</div><p className="ceremony-caption">{phase === "anticipate" ? t("A rare card is about to appear!", "一张稀有卡即将登场！") : t("Opening your cards one by one…", "正在逐张揭晓…")}</p></div>}
    </div>}
    {spotlight && phase === "spotlight" && <div className={`gacha-spotlight gacha-spotlight-${getRarity(spotlight.card.character).toLowerCase()}`} role="status"><div className="gacha-rays"/><div className="gacha-spotlight-inner"><p className="gacha-rare-title">{getRarity(spotlight.card.character)}!</p><button className="gacha-spotlight-card" onClick={() => setDetail(spotlight.card)} aria-label={`${t("View details for", "查看详情")} ${spotlight.card.character}`}>{cardView(spotlight.card, spotlight.isNew, true)}</button><p className="spotlight-detail-hint">{t("Tap the card to explore", "点击卡片查看详情")}</p><p>✦ {spotlight.isNew ? t("A NEW DISCOVERY!", "发现新汉字！") : t("A RARE FIND!", "稀有卡出现！")} ✦</p><button onClick={() => { setSpotlight(null); setPhase(shown >= draw.length ? "result" : "reveal"); }}>{t("Continue →", "继续 →")}</button></div><button className="gacha-spotlight-skip" onClick={skip}>{t("Skip all", "跳过全部")}</button></div>}
    <section className="gacha-selection"><div><p className="gacha-eyebrow">YOUR PRACTICE LIST</p><h2>{t("Ready to write?", "准备好练字了吗？")}</h2><p>{selection.length} / {GACHA_LIMIT} {t("selected · Add cards from your pulls or collection.", "已选择 · 可从抽卡结果或图鉴中添加。")}</p></div><div className="gacha-chips">{selection.map((char) => <button key={char} onClick={() => toggle(char)} aria-label={`${t("Remove", "移除")} ${char}`}>{char} ×</button>)}</div><button className="gacha-main-button" disabled={!selection.length} onClick={createWorksheet}>{t("CREATE WORKSHEET", "生成练习纸")} · {selection.length} →</button><p className="gacha-note">{t("Your collection is stored in this browser when available. Clearing browser data or changing devices may remove it.", "图鉴保存在当前浏览器中；清除浏览器数据或更换设备可能会丢失。")}</p></section>
    <section className="gacha-about"><h2>{t("How to play", "玩法说明")}</h2><p>{t("Every character has a fixed game rarity: C, R, SR or SSR. These are editorial game tiers, not character frequency, learning difficulty or official HSK levels. Each remaining card has weight C 8, R 4, SR 2 or SSR 1. The chance of a card equals its weight divided by the total weight of the remaining cards in the selected pool; cards are not repeated within one pull, so odds change as cards are revealed.", "每个汉字有固定的游戏稀有度：C、R、SR 或 SSR。这是游戏分级，不代表汉字使用频率、学习难度或官方 HSK 等级。每张剩余卡的权重分别为 C 8、R 4、SR 2、SSR 1；单张概率等于该卡权重除以当前卡池剩余卡片的总权重。一轮抽取不重复，因此概率会随抽取变化。")}</p><p>{t("HSK 3.0 contains a selection from the combined Levels 1–2 and Level 3 writing groups, not the complete HSK character or vocabulary list.", "HSK 3.0 卡池仅选自一至二级合并及三级书写字分组，并非完整字表或词表。")}</p><a href="/hsk/3-0-writing-characters">{t("Explore HSK sources →", "查看 HSK 来源 →")}</a></section>
    {album && <div className="gacha-dialog-backdrop" onClick={() => setAlbum(false)}><div ref={overlayRef} tabIndex={-1} className="gacha-dialog gacha-album" role="dialog" aria-modal="true" aria-label={t("Character collection", "汉字图鉴")} onClick={(e) => e.stopPropagation()}><div className="gacha-modal-head"><div><p className="gacha-eyebrow">YOUR HANZI COLLECTION</p><h2>{t("Your collection", "我的汉字图鉴")}</h2><p>{collectedCount} / {gachaCards.length} {t("characters discovered", "个汉字已收集")}</p></div><button onClick={() => setAlbum(false)} aria-label={t("Close collection", "关闭图鉴")}>×</button></div><div className="gacha-album-tools"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search character, pinyin or meaning", "搜索汉字、拼音或释义")} aria-label={t("Search collection", "搜索图鉴")} /><div className="gacha-filter-row">{[["all",t("All", "全部")],["owned",t("Owned", "已收集")],["favourites",t("★ Favourites", "★ 收藏")],...grades.map((grade) => [grade, grade])].map(([value,label]) => <button key={value} className={albumFilter === value ? "active" : ""} aria-pressed={albumFilter === value} onClick={() => setAlbumFilter(value)}>{label}</button>)}</div></div><div className="gacha-album-grid">{albumCards.map((card) => <button key={card.character} className={`gacha-album-item gacha-${getRarity(card.character).toLowerCase()} ${collection[card.character] ? "" : "locked"}`} onClick={() => collection[card.character] && setDetail(card)} disabled={!collection[card.character]} aria-label={collection[card.character] ? `${card.character} ×${collection[card.character]}` : t("Not yet discovered", "尚未收集")}><small>{collection[card.character] ? getRarity(card.character) : "?"}</small><span>{collection[card.character] ? card.character : "?"}</span><small>{collection[card.character] ? `×${collection[card.character]}` : "LOCKED"}</small></button>)}</div>{!albumCards.length && <p>{t("No matching cards.", "没有找到匹配的卡片。")}</p>}</div></div>}
    {detail && <div className="gacha-dialog-backdrop detail-layer" onClick={() => setDetail(null)}><div ref={overlayRef} tabIndex={-1} className="gacha-dialog gacha-detail-dialog" role="dialog" aria-modal="true" aria-label={`${detail.character} ${t("card details", "汉字卡详情")}`} onClick={(e) => e.stopPropagation()}><div className="gacha-modal-head"><h2>{t("Character card", "汉字卡片")}</h2><button onClick={() => setDetail(null)} aria-label={t("Close card details", "关闭卡片详情")}>×</button></div><div className="gacha-detail-layout">{cardView(detail, false, true)}<div className="gacha-detail-copy"><p className="gacha-eyebrow">{t("MEANING", "释义")}</p><p className="gacha-detail-meaning">{detail.meaning}</p><p className="gacha-eyebrow">{t("EXAMPLE", "例词")}</p><p><strong>{detail.example.hanzi}</strong> · {detail.example.pinyin}<br />{detail.example.meaning}</p><div className="gacha-facts"><div><span>{t("Strokes", "笔画")}</span><strong>{detailFacts?.strokes ?? t("Not available", "暂无")}</strong></div><div><span>{t("Radical", "部首")}</span><strong>{detailFacts?.radical ?? t("Not available", "暂无")}</strong></div><div><span>{t("Traditional", "繁体")}</span><strong>{detailFacts?.traditional ?? t("Not available", "暂无")}</strong></div><div><span>{t("HSK writing group", "HSK 书写分组")}</span><strong>{detail.hsk ? t("Levels 1–3 selection", "一至三级精选") : t("Not in this selection", "不在本精选中")}</strong></div></div><p className="gacha-note">{t("This card shows one reading. Some characters have other readings. Character details come from GridHanzi’s published guides where available.", "卡片展示一种读音，部分汉字还有其他读音；汉字属性来自本站已有指南，缺失时显示暂无。")}</p><div className="gacha-detail-buttons"><button onClick={() => toggle(detail.character)}>{selection.includes(detail.character) ? t("✓ Added to practice", "✓ 已加入练习") : t("+ Add to practice", "+ 加入练习")}</button><button onClick={() => setFavourites((old) => old.includes(detail.character) ? old.filter((x) => x !== detail.character) : [...old, detail.character])}>{favourites.includes(detail.character) ? t("★ Favourited", "★ 已收藏") : t("☆ Favourite", "☆ 收藏")}</button><a onClick={() => trackGachaEvent("gacha_stroke_open", 1)} href={`/stroke-order?character=${encodeURIComponent(detail.character)}`} target="_blank" rel="noreferrer">{t("Stroke order ↗", "查看笔顺 ↗")}</a></div></div></div></div></div>}
  </div></main>;
}
