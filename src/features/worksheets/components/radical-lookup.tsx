"use client";

import { UiText } from "./ui-text";
import { useRef, useState } from "react";
import { Link } from "@/core/i18n/navigation";
import { findRadical, learningWorksheetHref } from "../learning-directories";

export function RadicalLookup() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ character: string; radical: string } | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const data = useRef<Record<string, string> | null>(null);
  const request = useRef(0);
  async function lookup() {
    const id = ++request.current;
    const characters = Array.from(query.trim());
    setResult(null);
    if (characters.length !== 1 || !/\p{Script=Han}/u.test(characters[0])) {
      setMessage("Enter one Chinese character, for example 海 or 你."); return;
    }
    setBusy(true); setMessage("Looking up the dictionary radical…");
    try {
      if (!data.current) {
        const response = await fetch("/data/character-radicals.json");
        if (!response.ok) throw new Error("lookup unavailable");
        data.current = await response.json() as Record<string, string>;
      }
      if (id !== request.current) return;
      const radical = data.current?.[characters[0]];
      if (radical) { setResult({ character: characters[0], radical }); setMessage(""); }
      else setMessage("This character is not in this lookup dataset. Try another character or browse the full radical list below.");
    } catch { if (id === request.current) setMessage("The lookup data could not load. Please try again; the radical list below remains available."); }
    finally { if (id === request.current) setBusy(false); }
  }
  const family = result ? findRadical(result.radical) : undefined;
  return <section className="hs-card mt-6 p-5" aria-labelledby="radical-lookup-title">
    <h2 id="radical-lookup-title" className="text-xl font-bold"><UiText>{"Find a character’s radical"}</UiText></h2>
    <form className="mt-3 flex flex-wrap gap-3" onSubmit={e => { e.preventDefault(); void lookup(); }}>
      <label className="flex flex-col gap-1 text-sm font-semibold"><UiText>{"One Chinese character"}</UiText> <input value={query} onChange={e => { setQuery(e.target.value); request.current++; setBusy(false); setResult(null); setMessage(""); }} placeholder="海" className="min-h-11 w-56 rounded border border-[#b8afa1] bg-white px-3 text-xl" />
      </label>
      <button disabled={busy} className="hs-primary-button self-end" type="submit"><UiText>{busy ? "Looking up…" : "Find radical"}</UiText></button>
      <Link className="hs-secondary-button self-end" href={learningWorksheetHref("radical", "water")}><UiText>{"Make a water-family worksheet"}</UiText></Link>
    </form>
    <div role="status" className="mt-3 text-sm leading-7">
      <UiText>{message}</UiText>
      {result && <p>{result.character} → {result.radical}{family ? ` · ${family.meaning} · Kangxi ${family.id}` : " · dictionary indexing component"}. {family?.slug ? <Link className="font-bold underline" href={`/radicals/${family.slug}`}><UiText>{"Explore this radical and its examples"}</UiText></Link> : <a className="underline" href={family ? `#radical-${family.id}` : "#all-radicals"}><UiText>{"See the reference list"}</UiText></a>}</p>}
    </div>
    <p className="mt-2 text-xs leading-6 text-[#566276]"><UiText>{"Lookup covers 9,574 characters from Make Me a Hanzi. It runs in your browser after loading the data. Dictionary classifications can differ; a visible component is not always the indexing radical."}</UiText></p>
  </section>;
}
