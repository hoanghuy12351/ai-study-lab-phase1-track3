// Chạy UI handlers trong VM; không thay thế kiểm tra bố cục trên trình duyệt.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const clock={now:1800000000000},phase1='{"runs":{"existing":{"submitted":true}},"reviews":{"d1-q1":{"manual":true}}}';
const legacy='{"1:all":{"submitted":true,"answers":{"d1-q1":{"choice":0}}}}';
const storage=new Map([['phase1-study-v2',phase1],['phase1-ai-quiz-v1',legacy]]);
const html=fs.readFileSync(path.join(__dirname,'../dist/track3.html'),'utf8');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(scripts,['track3-sources.js','track3-data.js','question-revisions.js','lesson-overviews.js','learning-core.js','answer-explanations.js','app.js']);
assert.match(html,/href="index.html"/);assert.match(html,/href="track3-coverage.html"/);
for(const id of ['app','brand','mobile-brand','lesson-nav','breadcrumb','study-nav','mobile-study-nav','reset-button'])assert.ok(html.includes(`id="${id}"`));
function boot(){
  const elements=new Map(),listeners={},intervals=new Map();let sequence=0;
  const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',style:{},classList:{toggle(){}},handlers:{},addEventListener(type,fn){this.handlers[type]=fn;}});return elements.get(id);};
  class FakeDate extends Date{constructor(...args){super(...(args.length?args:[clock.now]));}static now(){return clock.now;}}
  const ctx={window:{scrollTo(){},confirm(){return true}},Date:FakeDate,document:{getElementById:element,querySelector:element,addEventListener:(type,fn)=>listeners[type]=fn},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},setInterval:fn=>{intervals.set(++sequence,fn);return sequence;},clearInterval:id=>intervals.delete(id)};
  vm.createContext(ctx);
  for(const file of scripts)vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'),ctx,{filename:file});
  return {ctx,element,listeners,intervals,click:(action,extra={})=>listeners.click({target:{closest:()=>({dataset:{action,...extra}})}}),change:(id,value)=>listeners.change({target:{id,value,matches(){return false;}}}),saved:()=>JSON.parse(storage.get('track3-study-v1')),html:()=>element('app').innerHTML};
}
let ui=boot();
const lessons=ui.ctx.window.TRACK3_LESSONS,all=lessons.flatMap(l=>l.questions.map(q=>({...q,day:l.day}))),L=ui.ctx.window.P1Learning;
assert.equal(all.length,498);assert.equal(lessons.length,13);
assert.match(ui.html(),/<strong>13<\/strong> bài học/);assert.match(ui.html(),/<strong>498<\/strong> câu hỏi/);
assert.match(ui.element('breadcrumb').innerHTML,/Track 3/);
assert.equal(Object.keys(ui.saved().runs).length,0,'Không nhập nhầm lịch sử Phase 1');
assert.equal(Object.keys(ui.saved().reviews).length,0);
assert.equal(storage.get('phase1-study-v2'),phase1);
assert.equal(storage.get('phase1-ai-quiz-v1'),legacy);
// Tất cả chủ đề phải mở được và mỗi tình huống có hướng dẫn riêng.
for(const l of lessons){
  ui.click('intro',{day:String(l.day)});
  assert.ok(ui.html().includes(l.title.replace(/&/g,'&amp;')));
  const overview=ui.ctx.window.LESSON_OVERVIEWS[l.day];
  assert.match(ui.html(),/BẢN CHẤT CỦA BÀI/);assert.ok(ui.html().includes(overview.flow[0].body));
  ui.click('overview-step',{index:String(overview.flow.length-1)});
  assert.ok(ui.html().includes(overview.flow.at(-1).body));
  ui.click('overview-tab',{view:'topics'});assert.match(ui.html(),/Chọn một chủ đề/);
  assert.ok(!ui.html().includes('BẢN CHẤT CỦA BÀI'));
  ui.click('overview-tab',{view:'overview'});assert.match(ui.html(),/BẢN CHẤT CỦA BÀI/);
  const topic=overview.must[0].topic;
  ui.click('topic-practice',{topicIndex:String(l.topics.indexOf(topic))});assert.ok(ui.html().includes(topic.replace(/&/g,'&amp;')));
  for(let i=0;i<l.topics.length;i++){
    ui.click('intro',{day:String(l.day)});ui.click('topic-practice',{topicIndex:String(i)});
    assert.match(ui.html(),/Luyện tập theo chủ đề/);
  }
}
ui.click('intro',{day:'16'});ui.click('topic-practice',{topicIndex:'0'});ui.click('begin-practice');
let state=ui.saved(),s=state.runs[state.activeRun],multi=all.find(q=>q.id===s.questionIds[0]),essay=all.find(q=>q.id===s.questionIds[1]);
assert.equal(s.questionIds.length,2);assert.equal(multi.type,'multi');assert.ok(essay.scenario);
assert.ok(!ui.html().includes(multi.why));assert.ok(!ui.html().includes('Đáp án đúng:'));
ui.click('choose',{choice:String(multi.answers[0])});ui.click('check-answer');
assert.match(ui.html(),/CẦN ÔN/);assert.match(ui.html(),/Đáp án đúng:/);assert.match(ui.html(),/1\. Bản chất kiến thức/);assert.match(ui.html(),/Ghi nhớ:/);assert.equal(ui.saved().reviews[multi.id].wrong,true);
ui.click('bookmark',{qid:multi.id});assert.equal(ui.saved().reviews[multi.id].manual,true);
ui.click('goto',{index:'1'});assert.match(ui.html(),/Hướng dẫn viết/);assert.ok(!ui.html().includes(essay.sample));
assert.ok(ui.html().includes(essay.guide.situation));ui.click('insert-template');ui.click('check-answer');assert.match(ui.html(),/Hãy viết hoặc chọn/);
assert.ok(!ui.html().includes(essay.guide.verify));assert.ok(!ui.html().includes('Hướng trả lời tham khảo'));
ui.listeners.input({target:{id:'essay-answer',value:'Tôi kiểm trace để tìm bước sai, sửa routing và đo lại trên bộ case có nhãn.'}});
ui.click('check-answer');assert.match(ui.html(),/Hướng trả lời tham khảo/);assert.match(ui.html(),/2\. Ví dụ thực tế/);assert.equal(ui.saved().reviews[essay.id].essayPending,true);
for(let i=0;i<essay.rubric.length;i++)ui.listeners.change({target:{dataset:{qid:essay.id,rubric:String(i)},checked:true,matches(){return true;}}});
assert.equal(ui.saved().reviews[essay.id].essayPending,false);ui.click('submit');
ui.click('practice-one',{qid:multi.id});for(const choice of multi.answers)ui.click('choose',{choice:String(choice)});ui.click('check-answer');
assert.match(ui.html(),/>ĐÚNG ·/);assert.equal(ui.saved().reviews[multi.id].wrong,false);assert.equal(ui.saved().reviews[multi.id].manual,true);ui.click('submit');
const single=all.find(q=>q.type==='mc');ui.click('practice-one',{qid:single.id});
ui.click('choose',{choice:String(single.answer)});ui.click('check-answer');assert.match(ui.html(),/>ĐÚNG ·/);ui.click('submit');
const multi3=all.find(q=>q.type==='multi'&&q.answers.length===3);
assert.equal(L.correct(multi3,{choices:[...multi3.answers]}),true);
assert.equal(L.correct(multi3,{choices:[0,1,2,3]}),false);
// Các vị trí đúng hiển thị được trộn theo câu, không cố định ở đầu.
assert.ok(new Set(all.filter(q=>q.type==='mc').map(q=>L.shuffle([0,1,2,3],q.id).indexOf(q.answer))).size>=3);
ui.click('intro',{day:'16'});ui.click('topic-flash',{topicIndex:'0'});ui.change('scope-type','scenario');ui.click('open-cards');
assert.ok(!ui.html().includes(essay.sample));ui.click('reveal-card');assert.ok(ui.html().includes(essay.sample));
ui.click('rate-card',{known:'false'});assert.equal(ui.saved().reviews[essay.id].card,true);assert.match(ui.html(),/Xong một lượt ôn/);
ui.click('repeat-cards');ui.click('reveal-card');ui.click('rate-card',{known:'true'});
assert.equal(ui.saved().reviews[essay.id].card,false);assert.equal(ui.saved().cards[`card-${essay.id}`].due,clock.now+86400000);
assert.equal(new Set(L.balanced(all.filter(q=>q.type!=='essay'),228,'topics').map(q=>`${q.day}:${q.topic}`)).size,228);
ui.click('exam-hub');ui.change('scope-day','all');ui.change('scope-topic','all');
ui.element('exam-count').value='26';ui.element('exam-essays').value='2';ui.element('exam-minutes').value='1';ui.click('begin-exam');
state=ui.saved();s=state.runs[state.activeRun];assert.equal(s.questionIds.length,28);
assert.equal(s.questionIds.filter(id=>all.find(q=>q.id===id).type==='essay').length,2);
assert.ok(!ui.html().includes('Hướng dẫn viết'));assert.ok(!ui.html().includes('Đáp án đúng:'));assert.ok(!ui.html().includes('Bản chất kiến thức'));
const deadline=s.deadline;ui=boot();ui.click('resume',{id:s.id});assert.equal(ui.saved().runs[s.id].deadline,deadline);assert.equal(ui.intervals.size,1);
clock.now=deadline+1;for(const tick of [...ui.intervals.values()])tick();assert.equal(ui.saved().runs[s.id].timedOut,true);
ui.click('resume',{id:s.id});assert.match(ui.html(),/HẾT GIỜ/);ui.click('review');assert.match(ui.html(),/Câu cần ôn/);
// Reset Track 3 cũng chỉ xóa dữ liệu khóa này.
ui.element('reset-button').handlers.click();
assert.equal(Object.keys(ui.saved().runs).length,0);assert.equal(Object.keys(ui.saved().reviews).length,0);assert.equal(Object.keys(ui.saved().cards).length,0);
assert.equal(storage.get('phase1-study-v2'),phase1);assert.equal(storage.get('phase1-ai-quiz-v1'),legacy);
ui.click('practice-hub');ui.change('scope-day','all');ui.change('scope-topic','all');ui.change('scope-type','objective');ui.change('scope-level','apply');ui.click('begin-practice');
state=ui.saved();s=state.runs[state.activeRun];assert.equal(s.questionIds.length,270);assert.ok(s.questionIds.every(id=>all.find(q=>q.id===id).revision===2));
ui.click('exam-hub');ui.element('exam-count').value='20';ui.element('exam-essays').value='0';ui.element('exam-minutes').value='2';ui.click('begin-exam');
state=ui.saved();s=state.runs[state.activeRun];assert.equal(s.questionIds.length,20);assert.ok(s.questionIds.every(id=>all.find(q=>q.id===id).level==='apply'));
console.log('OK Track 3: 228 chủ đề mở được; chọn một/nhiều, giải thích, tự luận có hướng dẫn, flashcard, câu cần ôn, đề thi và deadline; tiến độ Phase 1 giữ nguyên.');
