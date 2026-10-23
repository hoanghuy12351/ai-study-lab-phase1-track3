const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
global.window={};
require('../dist/track3-sources.js');
require('../dist/track3-data.js');
require('../dist/question-revisions.js');
const {TRACK3_LESSONS:lessons,TRACK3_COVERAGE:units,STUDY_COURSE:course}=window;
const inventory=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/track3-sources.json'),'utf8'));
const sources=new Map(inventory.map(s=>[s.id,s]));
assert.deepEqual(lessons.map(l=>l.day),Array.from({length:13},(_,i)=>i+16));
assert.equal(course.store,'track3-study-v1');assert.equal(course.legacyStore,null);
assert.deepEqual(window.TRACK3_SOURCES.map(s=>s.id),inventory.map(s=>s.id));
const ids=new Set(),used=new Set(),counts={mc:0,multi:0,essay:0};
const references=refs=>{
  assert.ok(refs.length);
  for(const r of refs){
    const s=sources.get(r.sourceId);assert.ok(s,`Nguồn không tồn tại: ${r.sourceId}`);
    assert.ok(r.pages.length && new Set(r.pages).size===r.pages.length);
    assert.ok(r.pages.every(p=>Number.isInteger(p)&&p>=1&&p<=s.pages),`Trang vượt phạm vi: ${r.sourceId} ${r.pages}`);
    used.add(s.id);
  }
};
for(const s of inventory){
  for(const file of [s.path,s.pdf,...s.aliases])assert.ok(fs.existsSync(path.join(__dirname,'../..',file)),`Thiếu file: ${file}`);
  assert.equal(s.headings.length,s.pages);
}
for(const l of lessons){
  assert.equal(new Set(l.topics).size,l.topics.length);
  assert.ok(['mc','multi','essay'].every(type=>l.questions.some(q=>q.type===type)));
  for(const topic of l.topics){
    const qs=l.questions.filter(q=>q.topic===topic);
    assert.ok(qs.some(q=>q.type==='multi')&&qs.some(q=>q.scenario),`Thiếu nhiều đáp án/tình huống: ${l.day} ${topic}`);
    assert.equal(units.filter(u=>u.day===l.day&&u.topic===topic).length,1);
  }
  const prompts=new Set();
  for(const q of l.questions){
    assert.ok(!ids.has(q.id),`Trùng ID ${q.id}`);ids.add(q.id);
    assert.ok(q.id.startsWith(`t3-d${l.day}-`));
    assert.ok(q.prompt && !prompts.has(q.prompt),`Trùng/thiếu prompt ${q.id}`);prompts.add(q.prompt);
    assert.ok(l.topics.includes(q.topic));assert.ok(q.source);references(q.references);
    assert.ok(q.type in counts);counts[q.type]++;
    if(q.type==='essay'){
      assert.ok(q.scenario && q.sample && q.rubric.length>=4);
      assert.ok(q.guide?.situation && q.guide.steps.length>=3 && q.guide.verify);
    }else{
      assert.ok(q.options.length>=4&&q.options.length<=5);assert.equal(new Set(q.options).size,q.options.length);
      assert.ok(q.why);
      const answers=q.type==='multi'?q.answers:[q.answer];
      assert.ok(answers.every(i=>Number.isInteger(i)&&i>=0&&i<q.options.length));
      assert.equal(new Set(answers).size,answers.length);
      if(q.type==='multi')assert.ok(answers.length>=2&&answers.length<q.options.length);
    }
  }
}
assert.equal(used.size,sources.size,'Mỗi deck phải được đối chiếu trong ngân hàng');
assert.equal(units.length,lessons.reduce((n,l)=>n+l.topics.length,0));
for(const u of units){
  references(u.references);
  assert.ok(u.questionIds.every(id=>ids.has(id)));
}
assert.equal(course.flashcards.length,ids.size);
assert.equal(new Set(course.flashcards.map(c=>c.id)).size,ids.size);
for(const c of course.flashcards){assert.ok(ids.has(c.questionId));assert.equal(c.id,`card-${c.questionId}`);assert.ok(c.answer&&c.front&&c.explanation);}
assert.ok(new Set(lessons.map(l=>l.questions.length)).size>5);
const multi=lessons.flatMap(l=>l.questions).filter(q=>q.type==='multi');
assert.ok(multi.some(q=>q.answers.length===2)&&multi.some(q=>q.answers.length===3));
console.log(`OK Track 3: ${lessons.length} bài, ${units.length} chủ đề, ${ids.size} câu (${counts.mc} một đáp án, ${counts.multi} nhiều đáp án, ${counts.essay} tình huống tự luận), ${course.flashcards.length} flashcard; ${used.size}/${sources.size} deck có tham chiếu trang hợp lệ.`);
console.log(lessons.map(l=>`Bài ${l.day}: ${l.questions.length}`).join(' · '));
