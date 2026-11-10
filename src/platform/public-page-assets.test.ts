import assert from "node:assert/strict";
import test from "node:test";
import { eligiblePublicRequest, publicPageAssetPath, readPublicPage, type PublicPageManifest } from "./public-page-assets";

const manifest: PublicPageManifest = { build: "test-build", compatibilityId: "test-rsc", routes: ["/", "/radicals", "/zh/radicals", "/stroke-order/三", "/generator"], params: { "/radicals": '{"locale":"en"}' } };
test("public prerender accepts only GET/HEAD with presentation-neutral parameters", () => {
  const request=(path:string,init?:RequestInit)=>new Request("https://gridhanzi.org"+path,init);
  for(const path of ["/radicals","/radicals?utm_source=test","/radicals.rsc?_rsc=abc"])assert.equal(eligiblePublicRequest(request(path)),true);
  for(const path of ["/generator?learning=pinyin:ma","/generator?words=私密","/generator?template=family","/stroke-order?character=水","/radicals?unknown=1"])assert.equal(eligiblePublicRequest(request(path)),false);
  assert.equal(eligiblePublicRequest(request("/radicals",{method:"POST"})),false);
  for(const header of ["authorization","next-action","next-router-segment-prefetch","x-vinext-mounted-slots"]) assert.equal(eligiblePublicRequest(request("/radicals",{headers:{[header]:"x"}})),false);
  assert.equal(eligiblePublicRequest(request("/radicals.rsc",{headers:{"x-vinext-interception-context":"/"}})),true);
});

test("public assets separate locale and RSC, preserve build metadata and never return cookies", async () => {
  const seen:string[]=[];
  const assets={fetch:async(request:Request)=>{seen.push(new URL(request.url).pathname);return new Response("fixture",{headers:{"set-cookie":"not-public=1","x-robots-tag":"noindex"}})}};
  const get=(path:string,init?:RequestInit)=>readPublicPage(new Request("https://gridhanzi.org"+path,init),assets,manifest);
  const html=(await get("/radicals"))!;assert.equal(html.headers.get("x-gridhanzi-render"),"prerendered");assert.equal(html.headers.get("set-cookie"),null);assert.equal(html.headers.get("x-robots-tag"),null);
  const rsc=(await get("/radicals.rsc?_rsc=test"))!;assert.match(rsc.headers.get("content-type")!,/text\/x-component/);assert.equal(rsc.headers.get("x-vinext-rsc-compatibility-id"),"test-rsc");
  assert.equal(rsc.headers.get("x-vinext-params"), '{"locale":"en"}');
  assert.equal(html.headers.get("x-vinext-params"), null);
  await get("/zh/radicals");await get("/stroke-order/%E4%B8%89");
  assert.deepEqual(seen,[publicPageAssetPath("/radicals",false),publicPageAssetPath("/radicals",true),publicPageAssetPath("/zh/radicals",false),publicPageAssetPath("/stroke-order/三",false)]);
  assert.equal(await (await get("/radicals",{method:"HEAD"}))!.text(),"");
  for(const path of ["/radicals/","/RADICALS","/radicals.html","/not-found","/generator?learning=pinyin:ma","/%2Fradicals"])assert.equal(await get(path),undefined,path);
  assert.equal(await readPublicPage(new Request("https://gridhanzi.org/radicals"),{fetch:async()=>new Response("missing",{status:404})},manifest),undefined);
});
