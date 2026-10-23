const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

global.window = {};
require('../dist/questions.js');
require('../dist/extra-questions.js');
require('../dist/learning-content.js');
const lessons = window.PHASE1_LESSONS;
assert.equal(lessons.length, 15, 'Phase 1 phải có 15 bài');
assert.deepEqual(lessons.map(x => x.day), Array.from({length:15},(_,i)=>i+1));
const ids = new Set();
for (const lesson of lessons) {
  assert.ok(fs.existsSync(path.join(__dirname,'../../slides/k4p1',lesson.deck)), `Thiếu nguồn bài ${lesson.day}`);
  assert.ok(lesson.questions.length >= 10, `Bài ${lesson.day} có quá ít câu`);
  assert.ok(['mc','multi','essay'].every(type=>lesson.questions.some(q=>q.type===type)), `Bài ${lesson.day} thiếu dạng câu hỏi`);
  for (const topic of lesson.topics) assert.ok(lesson.questions.filter(q=>q.topic===topic).length>=2, `Bài ${lesson.day} chưa đủ câu cho ${topic}`);
  for (const topic of lesson.topics) assert.ok(lesson.questions.some(q=>q.topic===topic&&q.scenario), `Bài ${lesson.day} thiếu tình huống cho ${topic}`);
  for (const q of lesson.questions) {
    assert.ok(!ids.has(q.id), `Trùng ID ${q.id}`); ids.add(q.id);
    assert.ok(q.prompt && lesson.topics.includes(q.topic), `Topic/prompt sai ở ${q.id}`);
    assert.ok(q.source && fs.existsSync(path.join(__dirname,'../../slides/k4p1',q.source)), `Thiếu nguồn ở ${q.id}: ${q.source}`);
    if (q.type==='mc') {
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options).size,4, `Lựa chọn trùng ở ${q.id}`);
      assert.ok(Number.isInteger(q.answer) && q.answer>=0 && q.answer<4);
      assert.ok(q.why);
    } else if (q.type==='multi') {
      assert.equal(q.options.length,4, `Số lựa chọn sai ở ${q.id}`);
      assert.equal(new Set(q.options).size,4, `Lựa chọn trùng ở ${q.id}`);
      assert.ok(q.answers.length>=2 && q.answers.length<4, `Số đáp án đúng sai ở ${q.id}`);
      assert.equal(new Set(q.answers).size,q.answers.length, `Đáp án đúng trùng ở ${q.id}`);
      assert.ok(q.answers.every(n=>Number.isInteger(n)&&n>=0&&n<4), `Chỉ số đáp án sai ở ${q.id}`);
      assert.ok(q.why, `Thiếu giải thích ở ${q.id}`);
    } else {
      assert.equal(q.type,'essay', `Dạng câu sai ở ${q.id}`);
      assert.ok(q.rubric.length>=3 && q.sample);
      assert.ok(q.guide?.steps.length>=2 && q.guide.verify, `Thiếu hướng dẫn tự luận ở ${q.id}`);
    }
  }
}
assert.ok(ids.size>=434, `Số câu chưa đủ: ${ids.size}`);
assert.equal(window.PHASE1_FLASHCARDS.length,ids.size,'Mỗi câu cần có một flashcard');
assert.ok(new Set(lessons.map(l=>l.questions.length)).size>5,'Số câu mỗi bài cần theo lượng kiến thức');
const counts=Object.fromEntries(['mc','multi','essay'].map(type=>[type,lessons.reduce((n,l)=>n+l.questions.filter(q=>q.type===type).length,0)]));
const multi=lessons.flatMap(l=>l.questions).filter(q=>q.type==='multi');
assert.ok(multi.filter(q=>q.answers.length===2).length>=25 && multi.filter(q=>q.answers.length===3).length>=50, 'Câu chọn nhiều có mẫu số đáp án đúng quá đều');
console.log(`OK: ${lessons.length} bài, ${ids.size} câu (${counts.mc} một đáp án, ${counts.multi} nhiều đáp án, ${counts.essay} tự luận), ${lessons.reduce((n,l)=>n+l.topics.length,0)} chủ đề đều có câu hỏi.`);
console.log(lessons.map(l=>`Bài ${String(l.day).padStart(2,'0')}: ${l.questions.length}`).join(' · '));
