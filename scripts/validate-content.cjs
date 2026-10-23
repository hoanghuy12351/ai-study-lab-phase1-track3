const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

global.window = {};
require('../dist/questions.js');
const lessons = window.PHASE1_LESSONS;
assert.equal(lessons.length, 15, 'Phase 1 phải có 15 bài');
assert.deepEqual(lessons.map(x => x.day), Array.from({length:15},(_,i)=>i+1));
const ids = new Set();
for (const lesson of lessons) {
  assert.ok(fs.existsSync(path.join(__dirname,'../../slides/k4p1',lesson.deck)), `Thiếu nguồn bài ${lesson.day}`);
  assert.ok(lesson.questions.length >= 10, `Bài ${lesson.day} có quá ít câu`);
  assert.ok(lesson.questions.some(q=>q.type==='mc') && lesson.questions.some(q=>q.type==='essay'));
  for (const topic of lesson.topics) assert.ok(lesson.questions.some(q=>q.topic===topic), `Bài ${lesson.day} thiếu ${topic}`);
  for (const q of lesson.questions) {
    assert.ok(!ids.has(q.id), `Trùng ID ${q.id}`); ids.add(q.id);
    assert.ok(q.prompt && lesson.topics.includes(q.topic), `Topic/prompt sai ở ${q.id}`);
    if (q.type==='mc') {
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options).size,4, `Lựa chọn trùng ở ${q.id}`);
      assert.ok(Number.isInteger(q.answer) && q.answer>=0 && q.answer<4);
      assert.ok(q.why);
    } else {
      assert.ok(q.rubric.length>=3 && q.sample);
    }
  }
}
assert.equal(ids.size,235);
assert.ok(new Set(lessons.map(l=>l.questions.length)).size>5,'Số câu mỗi bài cần theo lượng kiến thức');
console.log(`OK: ${lessons.length} bài, ${ids.size} câu, ${lessons.reduce((n,l)=>n+l.topics.length,0)} chủ đề đều có câu hỏi.`);
console.log(lessons.map(l=>`Bài ${String(l.day).padStart(2,'0')}: ${l.questions.length}`).join(' · '));
