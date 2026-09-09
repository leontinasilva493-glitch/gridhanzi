import assert from 'node:assert/strict';
import test from 'node:test';
import { fillLastPracticePage, type CharacterPracticeUnit } from './layout';
const units = ['家','庭'].map((character,i)=>({id:String(i),character,showContext:i===0})) as CharacterPracticeUnit[];
test('fills only remaining capacity without mutating original units or adding pages',()=>{
 const pages=[units,units]; const result=fillLastPracticePage(pages,7,()=>2);
 assert.equal(result.length,2); assert.equal(result[0].length,2); assert.deepEqual(result[1].map(u=>u.character),['家','庭','家']); assert.equal(pages[1].length,2); assert.equal(new Set(result[1].map(u=>u.id)).size,3);
});
test('empty and already full pages stay unchanged',()=>{assert.deepEqual(fillLastPracticePage([],4,()=>1),[]);assert.equal(fillLastPracticePage([units],4,()=>2)[0].length,2)});
