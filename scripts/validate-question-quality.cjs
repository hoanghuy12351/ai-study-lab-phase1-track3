// Cấu trúc, coverage, phân bố đáp án và chấm nhiều lựa chọn; không đo độ khó thực nghiệm.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let revised=0,multiCount=0,topics=0;
for(const [name,files,expected] of [
  ['Phase 1',['questions','extra-questions','learning-content'],120],
  ['Track 3',['track3-sources','track3-data'],270],
]){
  const ctx={window:{}};vm.createContext(ctx);
  for(const file of [...files,'question-revisions','learning-core'])vm.runInContext(fs.readFileSync(path.join(__dirname,`../dist/${file}.js`),'utf8'),ctx);
  const lessons=ctx.window.STUDY_COURSE?.lessons||ctx.window.PHASE1_LESSONS;
  const archive=new Map(ctx.window.QUESTION_ARCHIVE.map(q=>[q.id,q]));
  const current=lessons.flatMap(l=>l.questions.map(q=>({...q,day:l.day}))),L=ctx.window.P1Learning;
  assert.equal(current.filter(q=>q.revision===2).length,expected);
  const counts={},singlePositions=new Set();
  for(const l of lessons)for(const topic of l.topics){
    assert.ok(l.questions.some(q=>q.topic===topic&&q.level==='apply'&&q.type!=='essay'),`Thiếu trắc nghiệm vận dụng: ${l.day}/${topic}`);topics++;
  }
  for(const q of current){
    assert.ok(['apply','concept'].includes(q.level));
    const scope={day:'all',topic:'all',type:'objective',level:'apply'};
    assert.equal(L.matches(q,scope),q.type!=='essay'&&q.level==='apply');
    if(q.revision!==2)continue;revised++;
    assert.equal(q.id,`${q.previousId}-r2`);assert.ok(archive.has(q.previousId));
    assert.ok(q.prompt&&q.why&&q.source);assert.ok(q.options.length>=4&&q.options.length<=5);
    assert.equal(new Set(q.options).size,q.options.length);
    assert.ok(!q.options.some(s=>/đổi màu giao diện|tăng.*vô hạn|luôn miễn phí/.test(s)),`Nhiễu lạc đề: ${q.id}`);
    if(q.type==='mc'){singlePositions.add(q.answer);assert.equal(L.correct(q,{choice:q.answer}),true);continue;}
    assert.equal(q.type,'multi');multiCount++;
    assert.ok(q.answers.length>=2&&q.answers.length<q.options.length);
    assert.equal(new Set(q.answers).size,q.answers.length);
    assert.ok(q.answers.every(i=>Number.isInteger(i)&&i>=0&&i<q.options.length));
    const key=`${q.options.length} lựa chọn/${q.answers.length} đúng`;counts[key]=(counts[key]||0)+1;
    // Duyệt mọi tập con để bảo vệ chấm đúng/thiếu/thừa khi câu có 4–5 lựa chọn.
    for(let mask=0;mask<2**q.options.length;mask++){
      const choices=q.options.flatMap((_,i)=>mask&(1<<i)?[i]:[]);
      const expected=choices.length===q.answers.length&&q.answers.every(i=>choices.includes(i));
      assert.equal(L.correct(q,{choices}),expected,`${q.id} mask ${mask}`);
    }
  }
  assert.equal(singlePositions.size,4,'Câu một đáp án mới cần phân bố key ở cả 4 vị trí gốc');
  assert.ok(Object.keys(counts).some(k=>k.startsWith('5 lựa chọn/2')));
  assert.ok(Object.keys(counts).some(k=>k.startsWith('5 lựa chọn/4')));
  console.log(`${name}: ${expected} câu nâng cấp; ${JSON.stringify(counts)}`);
}
assert.equal(revised,390);assert.equal(multiCount,332);assert.equal(topics,323);
console.log(`OK: ${revised} câu nâng cấp, ${multiCount} multi, ${topics} chủ đề có trắc nghiệm vận dụng; giữ archive theo ID cũ.`);
