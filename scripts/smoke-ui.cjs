// Kiểm tra event handlers và trạng thái lưu thật; không thay thế kiểm tra layout trong browser.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const clock={now:1800000000000};
const storage=new Map();
function boot(){
  const elements=new Map(),listeners={},intervals=new Map();let seq=0;
  const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',style:{},classList:{toggle(){}},addEventListener(){}});return elements.get(id);};
  class FakeDate extends Date{constructor(...args){super(...(args.length?args:[clock.now]));}static now(){return clock.now;}}
  const ctx={window:{scrollTo(){},confirm(){return true}},Date:FakeDate,document:{getElementById:element,querySelector:element,addEventListener:(type,fn)=>listeners[type]=fn},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},setInterval:fn=>{intervals.set(++seq,fn);return seq;},clearInterval:id=>intervals.delete(id)};
  vm.createContext(ctx);
  for(const file of ['questions.js','extra-questions.js','learning-content.js','question-revisions.js','lesson-overviews.js','learning-core.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'),ctx,{filename:file});
  return {ctx,element,listeners,intervals,click:(action,extra={})=>listeners.click({target:{closest:()=>({dataset:{action,...extra}})}}),change:(id,value)=>listeners.change({target:{id,value,matches(){return false;}}}),saved:()=>JSON.parse(storage.get('phase1-study-v2')),html:()=>element('app').innerHTML};
}
let ui=boot();
const all=ui.ctx.window.PHASE1_LESSONS.flatMap(l=>l.questions.map(q=>({...q,day:l.day}))),L=ui.ctx.window.P1Learning;
assert.equal(all.length,434);
assert.equal(ui.ctx.window.PHASE1_FLASHCARDS.length,434);
assert.equal(all.filter(q=>q.scenario).length,95);
for(const l of ui.ctx.window.PHASE1_LESSONS){
  ui.click('intro',{day:String(l.day)});const o=ui.ctx.window.LESSON_OVERVIEWS[l.day];
  assert.match(ui.html(),/BẢN CHẤT CỦA BÀI/);assert.ok(ui.html().includes(o.flow[0].body));
  ui.click('overview-step',{index:String(o.flow.length-1)});assert.ok(ui.html().includes(o.flow.at(-1).body));
  ui.click('overview-topics');assert.match(ui.html(),/Chọn một chủ đề/);
  ui.click('overview-tab',{view:'overview'});assert.match(ui.html(),/BẢN CHẤT CỦA BÀI/);
}
const sample=L.exam(all,30,2,'seed');
assert.equal(sample.length,32);assert.equal(new Set(sample.map(q=>q.id)).size,32);
assert.equal(sample.filter(q=>q.type==='essay').length,2);
assert.equal(new Set(L.balanced(all.filter(q=>q.type!=='essay'),95,'wide').map(q=>`${q.day}:${q.topic}`)).size,95);
const multiCase=all.find(q=>q.type==='multi');
assert.equal(L.correct(multiCase,{choices:[...multiCase.answers]}),true);
assert.equal(L.correct(multiCase,{choices:multiCase.answers.slice(1)}),false);
assert.equal(L.correct(multiCase,{choices:[...multiCase.answers,...multiCase.options.map((_,i)=>i).filter(i=>!multiCase.answers.includes(i))]}),false);

ui.click('intro',{day:'1'});ui.click('topic-practice',{topicIndex:'1'});
assert.match(ui.html(),/Luyện tập theo chủ đề/);ui.click('begin-practice');
let state=ui.saved(),s=state.runs[state.activeRun],q=all.find(q=>q.id===s.questionIds[0]);
assert.equal(s.questionIds.length,3);
assert.ok(!ui.html().includes(q.why),'Không mở giải thích trước khi kiểm tra');
ui.click('choose',{choice:'1'});ui.click('check-answer');
assert.match(ui.html(),/CẦN ÔN/);assert.ok(ui.html().includes(q.why));
assert.equal(ui.saved().reviews[q.id].wrong,true);
ui.click('choose',{choice:'0'});assert.equal(ui.saved().runs[s.id].answers[q.id].choice,1,'Khóa đáp án đã kiểm tra');
ui.click('bookmark',{qid:q.id});assert.equal(ui.saved().reviews[q.id].manual,true);
ui.click('goto',{index:'1'});
const multi=all.find(q=>q.id===s.questionIds[1]);
for(const i of multi.answers)ui.click('choose',{choice:String(i)});
ui.click('check-answer');assert.match(ui.html(),/>ĐÚNG ·/);
ui.click('goto',{index:'2'});const essay=all.find(q=>q.id===s.questionIds[2]);
assert.match(ui.html(),/Hướng dẫn viết/);assert.ok(!ui.html().includes(essay.sample));
ui.click('insert-template');ui.click('check-answer');assert.match(ui.html(),/Hãy viết hoặc chọn/);
ui.listeners.input({target:{id:'essay-answer',value:'Tôi kiểm dữ kiện, thực thi theo quyền, đo lại và ghi bằng chứng.'}});
ui.click('check-answer');assert.ok(ui.html().includes(essay.sample));
assert.equal(ui.saved().reviews[essay.id].essayPending,true);
for(let i=0;i<essay.rubric.length;i++)ui.listeners.change({target:{dataset:{qid:essay.id,rubric:String(i)},checked:true,matches(){return true;}}});
assert.equal(ui.saved().reviews[essay.id].essayPending,false);
ui.click('submit');assert.match(ui.html(),/Kết quả và điều cần ôn/);
ui.click('practice-one',{qid:q.id});ui.click('choose',{choice:String(q.answer)});ui.click('check-answer');
assert.equal(ui.saved().reviews[q.id].wrong,false,'Luyện đúng xóa cờ sai');
assert.equal(ui.saved().reviews[q.id].manual,true,'Giữ cờ người dùng tự lưu');ui.click('submit');

// Flashcard: đáp án ẩn, tự đánh giá, thêm/bỏ hàng đợi và hẹn ngày ôn.
ui.click('flash-hub');ui.change('scope-type','scenario');ui.click('open-cards');
assert.ok(!ui.html().includes(essay.sample));ui.click('reveal-card');assert.ok(ui.html().includes(essay.sample));
ui.click('rate-card',{known:'false'});assert.equal(ui.saved().reviews[essay.id].card,true);
assert.match(ui.html(),/Xong một lượt ôn/);
ui.click('repeat-cards');ui.click('reveal-card');ui.click('rate-card',{known:'true'});
assert.equal(ui.saved().reviews[essay.id].card,false);
assert.equal(ui.saved().cards[`card-${essay.id}`].due,clock.now+86400000);

// Thi thử không có hướng dẫn/đáp án, deadline giữ nguyên qua reload và tự nộp khi hết giờ.
ui.click('exam-hub');ui.change('scope-day','all');
ui.element('exam-count').value='5';ui.element('exam-essays').value='1';ui.element('exam-minutes').value='1';ui.click('begin-exam');
state=ui.saved();s=state.runs[state.activeRun];assert.equal(s.questionIds.length,6);
assert.ok(!ui.html().includes('Vì sao:</strong>'));assert.ok(!ui.html().includes('Hướng dẫn viết'));
const deadline=s.deadline;ui.click('choose',{choice:'0'});
ui=boot();ui.click('resume',{id:s.id});assert.equal(ui.saved().runs[s.id].deadline,deadline);
assert.equal(ui.intervals.size,1,'Chỉ một đồng hồ hoạt động');
ui.click('home');assert.equal(ui.intervals.size,1,'Rời bài không dừng deadline');
clock.now=deadline+1;for(const tick of [...ui.intervals.values()])tick();
assert.equal(ui.saved().runs[s.id].timedOut,true);ui.click('resume',{id:s.id});assert.match(ui.html(),/HẾT GIỜ/);
assert.ok(Object.values(ui.saved().reviews).some(r=>r.unanswered),'Câu bỏ trống trong đề vào hàng đợi');

ui.click('exam-hub');ui.element('exam-count').value='2';ui.element('exam-essays').value='0';ui.element('exam-minutes').value='1';ui.click('begin-exam');
const closedId=ui.saved().activeRun;clock.now+=61000;ui=boot();
assert.equal(ui.saved().runs[closedId].timedOut,true,'Mở lại trang sau deadline phải tự nộp');

// Kết quả đúng xóa cờ sai nhưng giữ dấu chủ động lưu.
const objective=all.find(q=>q.type==='mc');
assert.equal(L.updateReview({wrong:true,manual:true},objective,{choice:objective.answer}).wrong,false);
assert.equal(L.updateReview({wrong:true,manual:true},objective,{choice:objective.answer}).manual,true);
ui.click('review');assert.match(ui.html(),/Câu cần ôn/);
storage.clear();
storage.set('phase1-ai-quiz-v1',JSON.stringify({'1:all':{submitted:true,answers:{'d1-q1':{choice:0}}}}));
ui=boot();
assert.equal(ui.saved().runs['legacy-1:all'].answers['d1-q1'].choice,0);
assert.equal(ui.saved().runs['legacy-1:all'].questionIds.length,23,'Không thêm tình huống mới vào đề cũ đã nộp');
assert.ok(storage.has('phase1-ai-quiz-v1'),'Không xóa dữ liệu cũ khi chuyển phiên bản');
// Đáp án ở phiên bản cũ không được chấm bằng lựa chọn mới.
const previous=ui.ctx.window.QUESTION_ARCHIVE.find(q=>q.type==='multi'),replacement=ui.ctx.window.QUESTION_REPLACEMENTS[previous.id];
storage.clear();storage.set('phase1-study-v2',JSON.stringify({migrated:true,runs:{old:{id:'old',style:'practice',label:'Lượt trước nâng cấp',questionIds:[previous.id],answers:{[previous.id]:{choices:[...previous.answers],checked:true}},submitted:true,createdAt:1}},reviews:{[previous.id]:{manual:true,wrong:true}},cards:{[`card-${previous.id}`]:{known:true}}}));
ui=boot();ui.click('resume',{id:'old'});assert.match(ui.html(),/<strong>1\/1<\/strong>/);assert.match(ui.html(),/trước lần nâng cấp/);
assert.equal(ui.saved().runs.old.questionIds[0],previous.id);
assert.equal(ui.saved().reviews[replacement].manual,true);assert.ok(!ui.saved().cards[`card-${replacement}`]);
ui.click('retry-run');state=ui.saved();s=state.runs[state.activeRun];
assert.equal(s.questionIds[0],replacement);assert.equal(Object.keys(s.answers).length,0);
ui.click('practice-hub');ui.change('scope-day','all');ui.change('scope-topic','all');ui.change('scope-type','objective');ui.change('scope-level','apply');ui.click('begin-practice');
state=ui.saved();s=state.runs[state.activeRun];assert.equal(s.questionIds.length,120);assert.ok(s.questionIds.every(id=>all.find(q=>q.id===id).revision===2));
console.log('OK: 95 tình huống, 434 flashcard, luyện tập/giải thích, hướng dẫn tự luận, câu cần ôn, thi thử và deadline qua reload.');
