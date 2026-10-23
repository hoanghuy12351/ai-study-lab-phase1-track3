// Bảo vệ answer key, nguồn, chữ cái sau đảo phương án và điều kiện mở lời giải.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const load=(ctx,file)=>vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'),ctx,{filename:file});
const strip=s=>s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const cases=[{name:'Phase 1',files:['questions.js','extra-questions.js','learning-content.js','question-revisions.js'],expected:434},{name:'Track 3',files:['track3-sources.js','track3-data.js','question-revisions.js'],expected:498}];
for(const test of cases){
  const ctx={window:{}};vm.createContext(ctx);for(const file of test.files)load(ctx,file);
  const lessons=ctx.window.STUDY_COURSE?.lessons||ctx.window.PHASE1_LESSONS;
  const original=JSON.stringify({lessons,archive:ctx.window.QUESTION_ARCHIVE});
  load(ctx,'lesson-overviews.js');load(ctx,'learning-core.js');load(ctx,'answer-explanations.js');
  const E=ctx.window.P1Explanations,L=ctx.window.P1Learning;
  const qs=lessons.flatMap(l=>l.questions.map(q=>({...q,day:l.day})));
  assert.equal(qs.length,test.expected);
  for(const q of [...qs,...ctx.window.QUESTION_ARCHIVE]){
    assert.equal(E.render(q,{runId:'hidden'}),null,'Không render lời giải khi chưa được phép');
    const model=E.describe(q);assert.ok(model.core,q.id+' thiếu bản chất');assert.ok(model.remember,q.id+' thiếu ghi nhớ');
    assert.equal(model.source,q.source,'Không tạo nguồn mới');
    assert.ok(model.example||model.scenario,q.id+' thiếu ví dụ gắn chủ đề');
    for(const seed of ['stable-run','second-run']){
      const answer=q.type==='mc'?{choice:q.answer}:q.type==='multi'?{choices:[...q.answers]}:{text:'Bài tự luận đã nộp'};
      const rendered=E.render(q,{runId:seed,answer,revealed:true});
      assert.match(rendered.body,/1\. Bản chất kiến thức/);assert.match(rendered.body,/2\. (Ví dụ thực tế|Công thức và ví dụ thực tế)/);
      assert.match(rendered.remember,/Ghi nhớ:/);assert.ok(!/undefined|NaN/.test(rendered.body),q.id);
      if(q.type==='essay'){assert.match(rendered.heading,/Hướng trả lời tham khảo/);assert.ok(!rendered.heading.includes('Đáp án đúng:'));}
      else{
        const right=q.type==='mc'?[q.answer]:q.answers;
        const order=Array.from(L.shuffle(q.options.map((_,i)=>i),`${seed}:${q.id}`));
        const expected=right.slice().sort((a,b)=>order.indexOf(a)-order.indexOf(b)).map(i=>String.fromCharCode(65+order.indexOf(i)));
        assert.ok(strip(rendered.heading).startsWith(`Đáp án đúng: ${expected.join(', ')} —`),q.id+' sai chữ cái sau đảo');
        assert.equal(L.correct(q,answer),true);
        assert.equal(JSON.stringify(E.order(q,seed)),JSON.stringify(order));
      }
    }
  }
  assert.equal(JSON.stringify({lessons,archive:ctx.window.QUESTION_ARCHIVE}),original,'Module lời giải không được thay đổi câu, answer key hay archive');
  if(test.name==='Track 3'){
    const lora=qs.find(q=>q.id==='t3-d21-q1-r2'),prob=qs.find(q=>q.id==='t3-d28-q1-r2'),voice=qs.find(q=>q.id==='t3-d28-q2-r2');
    assert.equal(8*(768+3072),30720);assert.equal(8*(1024+2048),24576);assert.equal(1024*2048,2097152);
    assert.ok(Math.abs(0.7**2-0.49)<1e-12);assert.equal(4*90,360);
    for(const [q,result] of [[lora,'30.720'],[prob,'0,49'],[voice,'360']]){
      const rendered=E.render(q,{runId:'calc',revealed:true});assert.ok(strip(rendered.body).includes(result));assert.match(rendered.body,/Thay số:/);assert.match(rendered.body,/Kết quả:|= 49%/);
    }
    const warning=E.render({...lora,referenceIssue:'Nhận xét từ tài liệu cần được kiểm tra lại.'},{runId:'warning',revealed:true});assert.match(warning.body,/Cần đối chiếu tài liệu/);assert.match(warning.body,/Đáp án tham chiếu được giữ nguyên/);
    const invalid=E.render({...lora,answer:99},{runId:'invalid',revealed:true});assert.match(invalid.heading,/Chưa thể xác nhận/);
    const injected=E.render({...lora,options:lora.options.map((s,i)=>i===lora.answer?'<script>alert(1)</script>':s)},{runId:'escaping',revealed:true});assert.ok(!injected.heading.includes('<script>'));assert.ok(injected.heading.includes('&lt;script&gt;'));
    const annotated=E.render({...lora,why:'LoRA dùng LoRA.',id:'test-glossary',prompt:'LoRA',options:['LoRA','khác'],answer:0},{runId:'terms',revealed:true});
    assert.equal((strip(annotated.heading+annotated.body+annotated.remember).match(/tinh chỉnh bằng các ma trận cập nhật hạng thấp/g)||[]).length,1,'Chú giải thuật ngữ một lần trong mỗi lời giải');
  }
  console.log(`OK ${test.name}: ${qs.length} lời giải và archive có cấu trúc, ví dụ/nguồn, ẩn trước nộp; answer key giữ nguyên và chữ cái khớp thứ tự hiển thị.`);
}
