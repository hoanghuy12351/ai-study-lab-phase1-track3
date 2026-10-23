const assert=require('node:assert/strict');
global.window={};
for(const f of ['questions','extra-questions','learning-content','track3-sources','track3-data','lesson-overviews'])require(`../dist/${f}.js`);
const lessons=[...window.PHASE1_LESSONS,...window.TRACK3_LESSONS],overviews=window.LESSON_OVERVIEWS;
assert.equal(lessons.length,28);assert.equal(Object.keys(overviews).length,28);
for(const l of lessons){
  const o=overviews[l.day];assert.ok(o,`Thiếu tổng quan bài ${l.day}`);
  assert.ok(o.why&&o.outcome&&o.flow.length>=4&&o.must.length>=4);
  assert.equal(new Set(o.flow.map(s=>s.title)).size,o.flow.length);
  for(const s of o.flow)assert.ok(s.title&&s.body&&s.output,`Bước thiếu giải thích/đầu ra: ${l.day}`);
  const topics=new Set();
  for(const m of o.must){
    assert.ok(m.title&&m.body);
    assert.ok(l.topics.includes(m.topic),`Bài ${l.day}: chủ đề liên kết không tồn tại: ${m.topic}`);
    assert.ok(l.questions.some(q=>q.topic===m.topic),`Bài ${l.day}: chủ đề không có câu luyện`);
    assert.ok(!topics.has(m.topic));topics.add(m.topic);
  }
  assert.ok(o.should.length&&o.later.length&&o.traps.length>=2);
  assert.ok(o.example.situation&&o.example.steps.length>=3&&o.example.verify);
  assert.ok(o.checks.length>=3&&o.checks.every(c=>c.question&&c.answer));
}
console.log(`OK: ${lessons.length} tổng quan, ${lessons.reduce((n,l)=>n+overviews[l.day].flow.length,0)} bước có giải thích/đầu ra; tất cả ý chính liên kết đúng chủ đề luyện tập.`);
