(() => {
  'use strict';
  const course=window.STUDY_COURSE||{label:'Phase 1',lessons:window.PHASE1_LESSONS,flashcards:window.PHASE1_FLASHCARDS,store:'phase1-study-v2',legacyStore:'phase1-ai-quiz-v1'};
  const lessons=course.lessons,L=window.P1Learning;
  const questions=lessons.flatMap(l=>l.questions.map(q=>({...q,day:l.day,lessonTitle:l.title})));
  const historical=window.QUESTION_ARCHIVE||[],replacements=window.QUESTION_REPLACEMENTS||{};
  const byId=new Map([...historical,...questions].map(q=>[q.id,q])),cards=course.flashcards;
  const reviewKey=id=>replacements[id]||id;
  const STORE=course.store,OLD_STORE=course.legacyStore;
  const app=document.getElementById('app'),nav=document.getElementById('lesson-nav'),breadcrumb=document.getElementById('breadcrumb');
  const read=key=>{try{const v=JSON.parse(localStorage.getItem(key)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}catch{return {};}};
  const saved=read(STORE),data={...saved,runs:saved.runs||{},reviews:saved.reviews||{},cards:saved.cards||{}};
  const state={screen:'home',day:lessons[0].day,lessonTab:'overview',flowIndex:0,scope:{day:'all',topic:'all',type:'all',level:'all'},activity:'practice',runId:null,index:0,search:'',cardIndex:0,revealed:false,cardOrder:[],dueOnly:false,reviewFilter:'all',message:''};
  let timer=null;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lesson=day=>lessons.find(l=>l.day===Number(day));
  const run=()=>data.runs[state.runId];
  const runQuestions=s=>(s?.questionIds||[]).map(id=>byId.get(id)).filter(Boolean);
  const pool=()=>questions.filter(q=>L.matches(q,state.scope));
  const reviewIds=()=>questions.filter(q=>L.needsReview(data.reviews[reviewKey(q.id)]));
  const persist=()=>{try{localStorage.setItem(STORE,JSON.stringify(data));}catch{const indicator=document.querySelector('.save-indicator');if(indicator)indicator.textContent='Bộ nhớ đầy · chưa lưu được';}};
  const date=value=>new Date(value).toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  const labelType=q=>q.scenario?'TÌNH HUỐNG · TỰ LUẬN':q.type==='essay'?'TỰ LUẬN':q.type==='multi'?'NHIỀU ĐÁP ÁN':'MỘT ĐÁP ÁN';
  const empty=text=>`<div class="empty">${text}</div>`;
  const button=(action,text,extra='',cls='secondary')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
  const source=q=>`<p class="question-source">Nguồn: ${esc(q.source)}</p>`;
  const reviewButton=q=>button('bookmark',data.reviews[reviewKey(q.id)]?.manual?'★ Đã lưu cần ôn':'☆ Lưu cần ôn',`data-qid="${q.id}" aria-pressed="${Boolean(data.reviews[reviewKey(q.id)]?.manual)}"`,'ghost bookmark');
  const versionNotice=s=>runQuestions(s).some(q=>replacements[q.id])?'<div class="notice version-notice">Lượt này dùng câu hỏi trước lần nâng cấp. Nội dung và đáp án cũ được giữ để xem lại; lượt luyện lại sẽ dùng phiên bản mới.</div>':'';

  // Giữ lượt làm cũ nguyên trạng và đưa lỗi đã làm vào hàng đợi ôn tập một lần.
  if(!data.migrated){
    for(const [key,old] of Object.entries(OLD_STORE?read(OLD_STORE):{})){
      if(!old||typeof old!=='object'||!old.answers)continue;
      const [day,type]=key.split(':'),l=lesson(day);if(!l)continue;
      const qs=(historical.length?historical:questions).filter(q=>q.day===l.day&&!q.scenario&&(type==='all'||q.type===type||type==='mc'&&q.type==='multi'));
      const id=`legacy-${key}`;
      data.runs[id]={id,label:`Bài ${day} · Lượt cũ`,style:'test',day:l.day,questionIds:qs.map(q=>q.id),answers:old.answers,submitted:Boolean(old.submitted),createdAt:0};
      if(old.submitted)for(const q of qs)data.reviews[reviewKey(q.id)]=L.updateReview(data.reviews[reviewKey(q.id)],q,old.answers[q.id]);
    }
    data.migrated=true;persist();
  }
  // Chuyển cờ cần ôn, giữ nguyên câu/đáp án của lịch sử và không chép điểm sang câu mới.
  if(window.QUESTION_REVISION&&data.questionRevision!==window.QUESTION_REVISION){
    for(const [oldId,newId] of Object.entries(replacements))if(data.reviews[oldId])data.reviews[newId]={...data.reviews[oldId],...data.reviews[newId],fromPreviousRevision:true};
    data.questionRevision=window.QUESTION_REVISION;persist();
  }
  function go(screen){state.screen=screen;state.message='';render();window.scrollTo({top:0,behavior:'instant'});}
  function startRun(qs,style,label,minutes){
    if(!qs.length){state.message='Không có câu phù hợp với bộ lọc này.';render();return;}
    const now=Date.now(),id=`${now}-${Math.random().toString(36).slice(2,8)}`;
    data.runs[id]={id,label,style,day:state.scope.day,bankRevision:window.QUESTION_REVISION||null,questionIds:qs.map(q=>q.id),answers:{},submitted:false,createdAt:now,deadline:style==='exam'?now+minutes*60000:null,minutes:minutes||null};
    data.activeRun=id;state.runId=id;state.index=0;persist();go('quiz');
  }
  function resume(id){
    const s=data.runs[id];if(!s)return;
    state.runId=id;data.activeRun=id;const qs=runQuestions(s);
    const index=qs.findIndex(q=>!L.answered(q,s.answers[q.id])||s.style==='practice'&&!s.answers[q.id]?.checked);
    state.index=index<0?0:index;persist();go(s.submitted?'result':'quiz');
  }
  function finalize(s,auto=false){
    if(!s||s.submitted)return;
    s.submitted=true;s.finishedAt=Date.now();s.timedOut=auto;
    for(const q of runQuestions(s)){
      data.reviews[reviewKey(q.id)]=L.updateReview(data.reviews[reviewKey(q.id)],q,s.answers[q.id]);
      if(s.style!=='practice'&&!L.answered(q,s.answers[q.id]))data.reviews[reviewKey(q.id)].unanswered=true;
    }
    persist();
  }
  function finish(auto=false){finalize(run(),auto);go('result');}
  function startClock(){
    if(timer){clearInterval(timer);timer=null;}
    if(!Object.values(data.runs).some(s=>s.style==='exam'&&!s.submitted))return;
    const tick=()=>{
      const expired=Object.values(data.runs).filter(s=>s.style==='exam'&&!s.submitted&&s.deadline<=Date.now());
      if(expired.length){
        for(const s of expired)finalize(s,true);
        if(state.screen==='quiz'&&run()?.submitted)state.screen='result';
        render();return;
      }
      const s=run();if(state.screen!=='quiz'||!s||s.style!=='exam'||s.submitted)return;
      const remaining=Math.max(0,Math.ceil((s.deadline-Date.now())/1000));
      const node=document.getElementById('exam-clock');if(node){node.textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;node.classList.toggle('urgent',remaining<=300);}
    };
    // Xử lý deadline ngay khi mở lại trang, rồi duy trì một đồng hồ chung.
    const expired=Object.values(data.runs).filter(s=>s.style==='exam'&&!s.submitted&&s.deadline<=Date.now());
    if(expired.length){for(const s of expired)finalize(s,true);if(state.screen==='quiz'&&run()?.submitted)state.screen='result';render();return;}
    tick();timer=setInterval(tick,1000);
  }
  function renderNav(){
    const items=[['home','Tổng quan'],['practice-hub','Luyện theo chủ đề'],['flash-hub','Flashcard ôn tập'],['exam-hub','Thi thử'],['review','Câu cần ôn']];
    const activeAction=state.screen==='study'?(state.activity==='flashcards'?'flash-hub':'practice-hub'):state.screen==='flashcards'?'flash-hub':state.screen==='exam-setup'?'exam-hub':state.screen;
    const html=items.map(([action,title])=>`<button type="button" class="hub-link ${activeAction===action?'active':''}" data-action="${action}">${title}${action==='review'?` <span>${reviewIds().length}</span>`:''}</button>`).join('');
    document.getElementById('study-nav').innerHTML=html;
    document.getElementById('mobile-study-nav').innerHTML=html;
    nav.innerHTML=lessons.map(l=>`<button class="nav-item ${state.screen==='intro'&&state.day===l.day?'active':''}" data-action="intro" data-day="${l.day}" type="button"><span class="nav-number">${String(l.day).padStart(2,'0')}</span><span class="nav-title">${esc(l.title)}</span></button>`).join('');
  }
  function renderHome(){
    breadcrumb.innerHTML=`${esc(course.label)} <span>/</span> Tổng quan`;
    const active=data.runs[data.activeRun],recent=Object.values(data.runs).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,5);
    app.innerHTML=`<div class="page"><div class="intro-grid"><div class="intro-copy"><div class="eyebrow">AI IN ACTION · HỌC VÀ THỰC HÀNH</div><h1 class="h1">Nhớ bản chất.<br><em>Xử lý được tình huống.</em></h1><p class="lead">Ôn từng chủ đề, thử cách giải quyết và học từ câu sai. Tự luận có khung viết, gợi ý từng bước và bài mẫu để bạn tự đối chiếu.</p><div class="stats"><div class="stat"><strong>${lessons.length}</strong> bài học</div><div class="stat"><strong>${questions.length}</strong> câu hỏi</div><div class="stat"><strong>${questions.filter(q=>q.scenario).length}</strong> tình huống mới</div></div></div><div class="hero-card"><div class="small">HÔM NAY BẠN CÓ THỂ</div><div class="big">${reviewIds().length}<span> câu cần ôn</span></div><p>Ôn câu sai và thẻ chưa nhớ trước khi thử một đề mới.</p>${button('review','Mở danh sách cần ôn →','','secondary')}${active&&!active.submitted?button('resume','Tiếp tục lượt đang làm',`data-id="${active.id}"`,'ghost light'):''}</div></div>
      <div class="activity-grid">${[['practice-hub','01','Luyện theo chủ đề','Kiểm tra từng câu và đọc giải thích ngay.'],['flash-hub','02','Flashcard','Tự nhớ trước, mở đáp án sau.'],['exam-hub','03','Thi thử','Đề ngẫu nhiên, đồng hồ và kết quả cuối bài.']].map(([action,n,title,desc])=>`<button class="activity-card" data-action="${action}" type="button"><span>${n}</span><strong>${title} ↗</strong><small>${desc}</small></button>`).join('')}</div>
      <div class="toolbar"><h2 class="section-title">Học theo bài</h2><input id="search" class="search" type="search" placeholder="Tìm bài hoặc chủ đề..." value="${esc(state.search)}" aria-label="Tìm bài hoặc chủ đề"></div><div id="lesson-grid" class="lesson-grid"></div>
      ${recent.length?`<section class="history-panel"><h2 class="section-title">Lượt làm gần đây</h2>${recent.map(s=>`<button data-action="resume" data-id="${s.id}" class="history-row" type="button"><span>${esc(s.label)}<small>${s.createdAt?date(s.createdAt):'Tiến độ giữ từ phiên bản trước'} · ${s.questionIds.length} câu</small></span><strong>${s.submitted?'Xem kết quả →':'Tiếp tục →'}</strong></button>`).join('')}</section>`:''}
      <div class="notice">${questions.filter(q=>q.revision===2).length} câu trắc nghiệm đã nâng cấp theo tình huống. Chọn mức “Vận dụng” khi luyện hoặc thi thử để tập trung câu cần phân tích. Tiến độ lưu trong trình duyệt; tự luận dùng checklist tự đánh giá.</div></div>`;
    renderCards();
  }
  function renderCards(){
    const query=state.search.trim().toLocaleLowerCase('vi');
    const matches=lessons.filter(l=>`${l.title} ${l.summary} ${l.topics.join(' ')}`.toLocaleLowerCase('vi').includes(query));
    document.getElementById('lesson-grid').innerHTML=matches.length?matches.map(l=>`<article class="lesson-card"><div class="card-top"><span class="day-pill">BÀI ${String(l.day).padStart(2,'0')}</span><span class="card-count">${l.questions.length} CÂU · ${l.topics.length} CHỦ ĐỀ</span></div><h3>${esc(l.title)}</h3><p>${esc(l.summary)}</p><div class="card-bottom">${button('intro','Tổng quan bài →',`data-day="${l.day}"`,'card-link')}<span class="card-progress">${l.questions.filter(q=>L.needsReview(data.reviews[reviewKey(q.id)])).length} cần ôn</span></div></article>`).join(''):empty('Không tìm thấy bài phù hợp.');
  }
  function renderOverview(l){
    const o=window.LESSON_OVERVIEWS[l.day],step=o.flow[Math.min(state.flowIndex,o.flow.length-1)];
    const index=lessons.indexOf(l),before=lessons[index-1],after=lessons[index+1];
    const linkedTopics=new Set(o.must.map(item=>item.topic));
    const sources=[...new Set(l.questions.filter(q=>linkedTopics.has(q.topic)).map(q=>q.source))];
    return `<div class="lesson-overview"><section class="overview-intuition" aria-labelledby="overview-essence"><div><div class="eyebrow">BẢN CHẤT CỦA BÀI</div><h2 id="overview-essence">Hiểu điều gì trước?</h2><p>${esc(o.why)}</p></div><div class="overview-outcome"><strong>Học xong, bạn cần làm được</strong><p>${esc(o.outcome)}</p></div></section>
      <section class="overview-section" aria-labelledby="flow-heading"><div class="eyebrow">01 · NHÌN TOÀN LUỒNG</div><h2 id="flow-heading">Các bước nối với nhau thế nào?</h2><p class="section-help">Bấm từng bước để xem vai trò và đầu ra. Đây là bản đồ tư duy của bài; khi có lỗi hoặc thiếu bằng chứng, có thể quay lại bước trước.</p><ol class="overview-flow" aria-label="Luồng kiến thức">${o.flow.map((f,i)=>`<li>${button('overview-step',`<span class="flow-number">${i+1}</span><span>${esc(f.title)}</span>`,`id="flow-step-${i}" data-index="${i}" aria-pressed="${state.flowIndex===i}" aria-controls="flow-explanation"`,state.flowIndex===i?'flow-step active':'flow-step')}</li>`).join('')}</ol><div class="flow-explanation" id="flow-explanation" aria-live="polite"><span class="eyebrow">BƯỚC ${state.flowIndex+1} / ${o.flow.length}</span><h3>${esc(step.title)}</h3><p>${esc(step.body)}</p><div class="flow-output"><strong>Đầu ra cần có</strong><span>${esc(step.output)}</span></div></div></section>
      <section class="overview-section" aria-labelledby="must-heading"><div class="eyebrow">02 · MUST KNOW — BẮT BUỘC HIỂU</div><h2 id="must-heading">Kiến thức chính cần nắm</h2><p class="section-help">Hiểu bản chất và giải thích được bằng ví dụ. Dùng “Luyện ý này” để thử áp dụng ngay.</p><div class="knowledge-grid">${o.must.map((item,i)=>`<article class="knowledge-card"><span class="knowledge-number">${String(i+1).padStart(2,'0')}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p>${button('topic-practice','Luyện ý này →',`data-topic-index="${l.topics.indexOf(item.topic)}"`,'ghost small-button')}</article>`).join('')}</div><div class="knowledge-priorities"><section><h3>Should know · Nên biết</h3><ul>${o.should.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></section><section><h3>Nice to know · Có thể học sau</h3><ul>${o.later.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></section></div></section>
      <section class="overview-section overview-example" aria-labelledby="example-heading"><div class="eyebrow">03 · NỐI VỚI THỰC TẾ</div><h2 id="example-heading">Một tình huống xuyên suốt</h2><p class="example-situation">${esc(o.example.situation)}</p><ol>${o.example.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="example-verify"><strong>Kiểm chứng:</strong> ${esc(o.example.verify)}</p></section>
      <section class="overview-section overview-pitfalls"><h2>Điểm dễ hiểu sai</h2><ul>${o.traps.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section>
      <section class="overview-section" aria-labelledby="self-check-heading"><div class="eyebrow">04 · TỰ GIẢI THÍCH TRƯỚC KHI LUYỆN</div><h2 id="self-check-heading">Bạn đã hiểu bài chưa?</h2><p class="section-help">Thử trả lời bằng lời của bạn, rồi mở gợi ý. Phần này không chấm điểm.</p><div class="overview-checks">${o.checks.map(c=>`<details><summary>${esc(c.question)}</summary><p>${esc(c.answer)}</p></details>`).join('')}</div><div class="action-row overview-cta">${button('overview-topics',`Xem ${l.topics.length} chủ đề để luyện →`,'','primary')}${button('lesson-flash','Ôn bằng flashcard',`data-day="${l.day}"`)}</div></section>
      <details class="overview-sources"><summary>Nguồn và phạm vi phần tổng quan</summary><p>Bản tổng hợp giúp nối các kiến thức chính, không thay thế toàn bộ bài giảng. Ví dụ và thứ tự xử lý được biên soạn để học; cách triển khai cụ thể cần kiểm theo phiên bản và use case.</p><ul>${sources.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>${course.label==='Track 3'?'<a href="track3-coverage.html">Xem bảng đối chiếu đầy đủ theo chủ đề và trang →</a>':''}</details>
      <nav class="overview-neighbors" aria-label="Bài học liên quan">${before?button('intro',`← Bài ${before.day} · ${esc(before.title)}`,`data-day="${before.day}"`,'ghost'):''}${after?button('intro',`Bài ${after.day} · ${esc(after.title)} →`,`data-day="${after.day}"`,'ghost'):''}</nav></div>`;
  }
  function renderTopics(l){
    return `<h2 class="section-title spaced">Chọn một chủ đề</h2><div class="topic-grid">${l.topics.map((topic,i)=>{const qs=l.questions.filter(q=>q.topic===topic),n=qs.filter(q=>L.needsReview(data.reviews[reviewKey(q.id)])).length;return `<article class="topic-card"><span class="eyebrow">${qs.length} CÂU · ${qs.filter(q=>q.scenario).length} TÌNH HUỐNG</span><h3>${esc(topic)}</h3><p>${n?n+' câu cần ôn':'Bắt đầu bằng flashcard hoặc luyện tình huống.'}</p><div class="action-row">${button('topic-practice','Luyện tập',`data-topic-index="${i}"`,'primary small-button')}${button('topic-flash','Flashcard',`data-topic-index="${i}"`,'secondary small-button')}</div></article>`;}).join('')}</div>`;
  }
  function renderIntro(){
    const l=lesson(state.day);breadcrumb.innerHTML=`${esc(course.label)} <span>/</span> Bài ${l.day}`;
    app.innerHTML=`<div class="page">${button('home','← Tổng quan','','back-link')}<div class="lesson-hero"><div><div class="eyebrow">BÀI ${String(l.day).padStart(2,'0')} · ${l.topics.length} CHỦ ĐỀ</div><h1 class="h1">${esc(l.title)}</h1><p class="lead">${esc(l.summary)}</p></div></div>
      <div class="action-row">${button('lesson-practice','Luyện cả bài →',`data-day="${l.day}"`,'primary')}${button('lesson-flash','Ôn flashcard',`data-day="${l.day}"`)}${button('lesson-exam','Thi thử bài này',`data-day="${l.day}"`)}</div>
      <nav class="lesson-tabs" aria-label="Nội dung bài học">${button('overview-tab','Tổng quan kiến thức',`data-view="overview" aria-pressed="${state.lessonTab==='overview'}"`,'lesson-tab')}${button('overview-tab',`Chủ đề luyện tập (${l.topics.length})`,`data-view="topics" aria-pressed="${state.lessonTab==='topics'}"`,'lesson-tab')}</nav><div id="lesson-panel">${state.lessonTab==='topics'?renderTopics(l):renderOverview(l)}</div></div>`;
  }
  function scopeControls(withType=true){
    const topics=[...new Set(questions.filter(q=>state.scope.day==='all'||q.day===Number(state.scope.day)).map(q=>q.topic))];
    const options=(rows,selected)=>rows.map(([value,label])=>`<option value="${esc(value)}" ${String(value)===String(selected)?'selected':''}>${esc(label)}</option>`).join('');
    return `<div class="filter-grid ${withType?'with-level':''}"><label>Bài học<select id="scope-day">${options([['all',`Tất cả ${lessons.length} bài`],...lessons.map(l=>[l.day,`Bài ${l.day} · ${l.title}`])],state.scope.day)}</select></label><label>Chủ đề<select id="scope-topic">${options([['all','Tất cả chủ đề'],...topics.map(t=>[t,t])],state.scope.topic)}</select></label>${withType?`<label>Dạng câu<select id="scope-type">${options([['all','Tất cả dạng câu'],['objective','Trắc nghiệm'],['multi','Chọn nhiều đáp án'],['essay','Tự luận'],['scenario','Tình huống xử lý']],state.scope.type)}</select></label>`:''}<label>Mức tư duy<select id="scope-level">${options([['all','Tất cả mức'],['concept','Hiểu khái niệm'],['apply','Vận dụng · phân tích tình huống']],state.scope.level||'all')}</select></label></div>`;
  }
  function renderStudy(){
    const flash=state.activity==='flashcards',qs=pool();breadcrumb.innerHTML=`${esc(course.label)} <span>/</span> ${flash?'Flashcard':'Luyện theo chủ đề'}`;
    app.innerHTML=`<div class="page"><div class="eyebrow">${flash?'NHỚ CHỦ ĐỘNG':'HIỂU → THỬ → ĐỐI CHIẾU'}</div><h1 class="h1">${flash?'Flashcard ôn tập':'Luyện tập theo chủ đề'}</h1><p class="lead">${flash?'Đọc câu hỏi, tự trả lời rồi mới mở thẻ. “Chưa nhớ” sẽ đưa câu vào danh sách cần ôn.':'Chọn phạm vi nhỏ để học kỹ. Sau khi kiểm tra mỗi câu, bạn được xem giải thích ngắn; câu sai tự vào “Cần ôn”.'}</p>${scopeControls()}<div class="selection-summary"><strong>${qs.length}</strong> ${flash?'thẻ':'câu'} phù hợp · ${qs.filter(q=>q.scenario).length} tình huống tự luận · ${qs.filter(q=>q.type==='essay').length} tự luận</div>${state.message?`<p class="inline-message" role="status">${esc(state.message)}</p>`:''}<div class="action-row">${button(flash?'open-cards':'begin-practice',flash?'Bắt đầu ôn thẻ →':'Bắt đầu luyện →','','primary')}${flash?'<label class="inline-check"><input id="due-only" type="checkbox" '+(state.dueOnly?'checked':'')+'> Chỉ thẻ chưa nhớ hoặc đến hạn</label>':''}</div><div class="notice">${flash?'Thẻ nhớ được hẹn lại sau 1, 3, 7, 14 và 30 ngày. Lịch này chỉ là gợi ý ôn tập.':'Với câu tự luận, hãy mở hướng dẫn và viết theo khung nếu chưa biết bắt đầu. Bài mẫu chỉ mở khi bạn chọn đối chiếu.'}</div></div>`;
  }
  function selectedCards(){const ids=new Set(pool().map(q=>q.id));return cards.filter(c=>ids.has(c.questionId)&&(!state.dueOnly||!data.cards[c.id]?.known||data.cards[c.id].due<=Date.now()));}
  function openCards(){state.cardOrder=selectedCards().map(c=>c.id);state.cardIndex=0;state.revealed=false;go('flashcards');}
  function renderFlashcards(){
    breadcrumb.innerHTML=`${esc(course.label)} <span>/</span> Flashcard`;
    const deck=state.cardOrder.map(id=>cards.find(c=>c.id===id)).filter(Boolean),card=deck[state.cardIndex];
    if(deck.length&&state.cardIndex>=deck.length){app.innerHTML=`<div class="page narrow-page"><div class="eyebrow">ĐÃ XEM HẾT BỘ THẺ</div><h1 class="h1">Xong một lượt ôn.</h1><p class="lead">${deck.filter(c=>data.cards[c.id]?.known).length}/${deck.length} thẻ được đánh dấu đã nhớ. Những thẻ chưa nhớ vẫn nằm trong danh sách cần ôn.</p><div class="action-row">${button('repeat-cards','Ôn lại bộ thẻ','','primary')}${button('review','Mở câu cần ôn')}${button('flash-hub','Chọn bộ khác','','ghost')}</div></div>`;return;}
    if(!card){app.innerHTML=`<div class="page"><h1 class="h1">Chưa có thẻ cần ôn</h1>${empty('Bạn đã xem hết thẻ đến hạn hoặc bộ lọc chưa có thẻ. Bỏ lọc đến hạn để ôn lại tất cả.')}${button('flash-hub','Chọn lại bộ thẻ')}</div>`;return;}
    const learned=deck.filter(c=>data.cards[c.id]?.known).length;
    app.innerHTML=`<div class="page narrow-page">${button('back-study','← Chọn chủ đề','','back-link')}<div class="flash-toolbar"><span>THẺ ${state.cardIndex+1} / ${deck.length}</span><span>${learned} thẻ đã nhớ</span>${button('shuffle-cards','Trộn thẻ','','ghost')}</div><article class="flashcard ${state.revealed?'is-revealed':''}"><div class="eyebrow">BÀI ${card.day} · ${esc(card.topic)}${card.scenario?' · TÌNH HUỐNG':''}</div><h2>${esc(card.front)}</h2>${state.revealed?`<div class="flash-answer"><strong>Gợi ý trả lời</strong><p>${esc(card.answer)}</p><p>${esc(card.explanation)}</p>${source(card)}</div>`:`<p class="flash-prompt">Hãy nói hoặc viết câu trả lời của bạn trước khi mở.</p>${button('reveal-card','Mở đáp án','','primary')}`}</article><div class="flash-rating">${state.revealed?`${button('rate-card','Chưa nhớ', 'data-known="false"','secondary')}${button('rate-card','Đã nhớ ✓','data-known="true"','primary')}`:'<span>Đáp án đang ẩn để bạn tự nhớ.</span>'}</div><div class="action-row spread">${button('card-prev','← Thẻ trước',state.cardIndex===0?'disabled':'','ghost')}${button('card-next','Thẻ tiếp →',state.cardIndex===deck.length-1?'disabled':'','ghost')}</div></div>`;
  }
  function renderExamSetup(){
    breadcrumb.innerHTML=`${esc(course.label)} <span>/</span> Thi thử`;
    const qs=questions.filter(q=>L.matches(q,{...state.scope,type:'all'}));
    const preferred=data.examConfig||{count:30,essays:2,minutes:45};
    const cfg={...preferred,count:Math.min(preferred.count,qs.filter(q=>q.type!=='essay').length),essays:Math.min(preferred.essays,qs.filter(q=>q.type==='essay').length)};
    app.innerHTML=`<div class="page"><div class="eyebrow">THI THỬ · GIỮ ĐÁP ÁN ĐẾN KHI NỘP</div><h1 class="h1">Thử sức trong một đề mới.</h1><p class="lead">Đề rút ngẫu nhiên, ưu tiên phân bổ qua các chủ đề trong phạm vi đã chọn. Có thể chuyển câu và đánh dấu để xem lại. Hết giờ sẽ tự nộp.</p>${scopeControls(false)}<div class="filter-grid exam-config"><label>Số câu trắc nghiệm<input id="exam-count" type="number" min="1" max="150" value="${cfg.count}"></label><label>Số câu tự luận<input id="exam-essays" type="number" min="0" max="10" value="${cfg.essays}"></label><label>Thời gian (phút)<input id="exam-minutes" type="number" min="1" max="180" value="${cfg.minutes}"></label></div><div class="selection-summary">Ngân hàng trong phạm vi: <strong>${qs.filter(q=>q.type!=='essay').length}</strong> trắc nghiệm và <strong>${qs.filter(q=>q.type==='essay').length}</strong> tự luận.</div>${state.message?`<p role="alert" class="inline-message">${esc(state.message)}</p>`:''}${button('begin-exam','Tạo đề và bắt đầu →','','primary')}<div class="notice">Đề lấy mẫu nên một lượt thi không kiểm tra hết mọi chủ đề. Trắc nghiệm chấm tự động; tự luận đối chiếu checklist sau khi nộp và không cộng vào điểm trắc nghiệm. Đồng hồ tiếp tục chạy khi đóng hoặc tải lại trang.</div></div>`;
  }
  function guide(q){
    const g=q.guide;
    return `<section class="essay-coach"><h3>Hướng dẫn viết · mở khi cần</h3><details><summary>1. Hiểu câu hỏi đang yêu cầu gì</summary><p>${esc(g.situation)}</p><p>Tách dữ kiện đã biết, điều chưa chắc và kết quả cần đạt. Nếu thiếu dữ liệu, viết rõ giả định.</p></details><details><summary>2. Gợi ý các ý cần triển khai</summary><ol>${g.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><p><strong>Kiểm chứng:</strong> ${esc(g.verify)}</p></details><details><summary>3. Dùng khung để bắt đầu viết</summary><p>Thay từng dấu [...] bằng lập luận của bạn. Mỗi bước nên nói làm gì và vì sao.</p>${button('insert-template','Chèn khung vào bài','','secondary small-button')}</details></section>`;
  }
  function renderQuiz(){
    const s=run(),qs=runQuestions(s);if(!s||!qs.length){go('home');return;}if(s.submitted){go('result');return;}
    state.index=Math.min(Math.max(state.index,0),qs.length-1);
    const q=qs[state.index],a=s.answers[q.id]||{},practice=s.style==='practice',checked=Boolean(a.checked),locked=practice&&checked;
    const promptParts=q.prompt.split('\n\n');
    const questionHeading=promptParts.length>1?`<div class="question-context"><strong>BỐI CẢNH</strong><p>${esc(promptParts[0])}</p></div><h2 class="question-title">${esc(promptParts.slice(1).join('\n\n'))}</h2>`:`<h2 class="question-title">${esc(q.prompt)}</h2>`;
    const count=qs.filter(item=>L.answered(item,s.answers[item.id])).length;
    breadcrumb.innerHTML=`${esc(course.label)} <span>/</span> ${practice?'Luyện tập':s.style==='exam'?'Thi thử':'Bài làm cũ'}`;
    const options=q.type==='essay'?`${practice?guide(q):''}<label class="field-label" for="essay-answer">Bài làm của bạn</label><textarea id="essay-answer" class="essay-input" ${locked?'readonly':''} placeholder="Viết cách xử lý và cách kiểm chứng...">${esc(a.text||'')}</textarea>${practice?'':'<p class="essay-hint">Gợi ý và bài mẫu sẽ mở sau khi nộp.</p>'}`:`${q.type==='multi'?'<div class="multi-hint">Chọn tất cả đáp án đúng, sau đó kiểm tra. Chọn thiếu hoặc thừa được tính sai.</div>':''}<div class="options" role="group" aria-label="Các phương án trả lời">${L.shuffle(q.options.map((_,i)=>i),`${s.id}:${q.id}`).map((original,pos)=>{const selected=q.type==='multi'?(a.choices||[]).includes(original):a.choice===original;return `<button type="button" class="option ${selected?'selected':''}" data-action="choose" data-choice="${original}" aria-pressed="${selected}" ${locked?'disabled':''}><span class="letter">${q.type==='multi'?(selected?'✓':'□'):String.fromCharCode(65+pos)}</span><span>${esc(q.options[original])}</span></button>`;}).join('')}</div>`;
    app.innerHTML=`<div class="page"><div class="run-header"><div><div class="eyebrow">${practice?'LUYỆN TẬP · GIẢI THÍCH SAU MỖI CÂU':'THI THỬ · ĐÁP ÁN ĐANG ẨN'}</div><h1>${esc(s.label)}</h1></div>${s.style==='exam'?'<div class="clock-box">Còn lại <strong id="exam-clock" aria-label="Thời gian còn lại">--:--</strong></div>':button('home','Lưu và về tổng quan','','ghost')}</div>${versionNotice(s)}<div class="quiz-layout"><section class="quiz-card"><div class="question-meta"><span class="type-pill ${q.type==='essay'?'essay':q.type==='multi'?'multi':''}">${labelType(q)}</span><span class="level-pill">${q.level==='apply'?'VẬN DỤNG':'HIỂU KHÁI NIỆM'}</span><span class="q-index">CÂU ${state.index+1} / ${qs.length} · BÀI ${q.day} · ${esc(q.topic)}</span></div>${questionHeading}${reviewButton(q)}${options}${state.message?`<p class="inline-message" role="alert">${esc(state.message)}</p>`:''}${practice&&checked?`<div class="immediate-feedback" role="status">${renderAnswer(q,state.index,a,true)}</div>`:''}<div class="question-actions">${button('prev','← Câu trước',state.index===0?'disabled':'','ghost')}${practice&&!checked?button('check-answer',q.type==='essay'?'Đối chiếu bài tự luận':'Kiểm tra đáp án','','primary'):state.index===qs.length-1?button('submit','Nộp bài →','','primary'):button('next','Câu tiếp →','','primary')}</div>${practice&&!checked?button('next','Bỏ qua, quay lại sau →',state.index===qs.length-1?'disabled':'','ghost skip-link'):''}</section>
      <aside class="rail-card"><h3>Tiến độ bài làm</h3><p id="answer-count">${count} / ${qs.length} câu đã nhập</p><div class="progress-track"><div id="answer-progress" style="width:${Math.round(count/qs.length*100)}%"></div></div><div class="question-map">${qs.map((item,i)=>`<button class="map-btn ${i===state.index?'current':''} ${L.answered(item,s.answers[item.id])?'answered':''} ${data.reviews[reviewKey(item.id)]?.manual?'flagged':''}" type="button" data-action="goto" data-index="${i}" aria-label="Câu ${i+1}${data.reviews[reviewKey(item.id)]?.manual?', đã lưu cần ôn':''}">${i+1}</button>`).join('')}</div><p class="rail-note">${practice?'Kiểm tra đáp án để xem giải thích và học từ lỗi.':'Đồng hồ vẫn chạy khi rời trang. Chỉ mở đáp án sau khi nộp.'}</p>${button('submit',practice?'Kết thúc lượt luyện':'Nộp bài thi','','secondary full-width')}${s.style==='exam'?button('home','Lưu và rời bài','','ghost full-width'):''}</aside></div></div>`;
  }
  function renderAnswer(q,index,a,inline=false){
    if(q.type!=='essay'){
      const ok=L.correct(q,a),chosen=q.type==='multi'?(a.choices||[]):Number.isInteger(a.choice)?[a.choice]:[],right=q.type==='multi'?q.answers:[q.answer];
      return `<article class="result-card ${ok?'good':'bad'}"><div class="result-tag ${ok?'':'wrong'}">${inline?'':`CÂU ${index+1} · `}${ok?'ĐÚNG':'CẦN ÔN'} · ${esc(q.topic)}</div>${inline?'':`<h3>${esc(q.prompt)}</h3>${reviewButton(q)}`}<p class="answer-line"><strong>Bạn chọn:</strong> ${chosen.length?esc(chosen.map(i=>q.options[i]).join(' • ')):'Chưa trả lời'}</p>${ok?'':`<p class="answer-line"><strong>Đáp án đầy đủ:</strong> ${esc(right.map(i=>q.options[i]).join(' • '))}</p>`}<p><strong>Vì sao:</strong> ${esc(q.why)}</p>${source(q)}</article>`;
    }
    const pass=L.essayDone(q,a);
    return `<article class="result-card" id="result-${q.id}"><div class="result-tag">${inline?'':`CÂU ${index+1} · `}TỰ LUẬN · ${esc(q.topic)}</div>${inline?'':`<h3>${esc(q.prompt)}</h3>${reviewButton(q)}<p class="answer-line"><strong>Bài của bạn:</strong> ${esc(a.text||'Chưa trả lời').replace(/\n/g,'<br>')}</p>`}<div class="sample"><strong>Gợi ý trả lời:</strong><p>${esc(q.sample)}</p></div><p><strong>Tự đối chiếu: bài của bạn đã có các ý này chưa?</strong></p><div class="rubric-list">${q.rubric.map((line,i)=>`<label class="rubric-item"><input type="checkbox" data-rubric="${i}" data-qid="${q.id}" ${(a.rubric||[]).includes(i)?'checked':''} ${!a.text?.trim()?'disabled':''}><span>${esc(line)}</span></label>`).join('')}</div><span class="self-badge ${pass?'':'pending'}" data-badge="${q.id}">${pass?'✓ Tự xác nhận đủ ý':'Chưa tự xác nhận đủ ý'}</span><p class="essay-hint">Checklist không xác nhận độc lập nội dung đúng. Đọc lại lập luận của bạn trước khi tích.</p>${inline?button('revise-essay','Sửa lại bài sau khi đối chiếu',`data-qid="${q.id}"`,'ghost'):''}${source(q)}</article>`;
  }
  function renderResult(){
    const s=run();if(!s){go('home');return;}
    const qs=runQuestions(s),objective=qs.filter(q=>q.type!=='essay'),essays=qs.filter(q=>q.type==='essay');
    const right=objective.filter(q=>L.correct(q,s.answers[q.id])).length,done=essays.filter(q=>L.essayDone(q,s.answers[q.id])).length;
    breadcrumb.innerHTML=`${esc(course.label)} <span>/</span> Kết quả`;
    const topics=[...new Set(qs.map(q=>`${q.day}|${q.topic}`))];
    app.innerHTML=`<div class="page"><div class="result-head"><div><div class="eyebrow">${s.timedOut?'HẾT GIỜ · ĐÃ TỰ NỘP':'ĐÃ HOÀN THÀNH LƯỢT LÀM'}</div><h1 class="h1">Kết quả và điều cần ôn</h1><p class="lead">${esc(s.label)}</p></div>${button('retry-run','Luyện lại bộ câu này','','primary')}</div>${versionNotice(s)}<div class="score-grid"><div class="score-box"><strong>${right}/${objective.length}</strong><span>Trắc nghiệm đúng${objective.length?` · ${Math.round(right/objective.length*100)}%`:''}</span></div><div class="score-box"><strong id="essay-score">${done}/${essays.length}</strong><span>Tự luận tự xác nhận đủ ý</span></div><div class="score-box"><strong>${topics.length}</strong><span>Chủ đề xuất hiện trong lượt này</span></div></div><div class="action-row">${button('review','Mở câu cần ôn →')}${button('home','Về tổng quan','','ghost')}</div><div class="coverage-card"><h2>Theo chủ đề</h2><div class="topic-list">${topics.map(key=>{const [day,topic]=key.split('|'),items=qs.filter(q=>q.day===Number(day)&&q.topic===topic),ok=items.every(q=>q.type==='essay'?L.essayDone(q,s.answers[q.id]):L.correct(q,s.answers[q.id]));return `<span class="topic ${ok?'done':'warn'}"><span class="dot"></span>B${day} · ${esc(topic)}</span>`;}).join('')}</div></div><h2 class="section-title spaced">Giải thích từng câu</h2><div class="result-list">${qs.map((q,i)=>renderAnswer(q,i,s.answers[q.id]||{})).join('')}</div></div>`;
  }
  function renderReview(){
    breadcrumb.innerHTML=`${esc(course.label)} <span>/</span> Câu cần ôn`;
    const items=reviewIds().filter(q=>L.matches(q,{...state.scope,type:'all'})).filter(q=>state.reviewFilter==='all'||data.reviews[reviewKey(q.id)]?.[state.reviewFilter]);
    app.innerHTML=`<div class="page"><div class="eyebrow">HỌC TỪ LỖI VÀ ĐIỀU CHƯA CHẮC</div><h1 class="h1">Câu cần ôn</h1><p class="lead">Câu trắc nghiệm sai, tự luận chưa tự xác nhận đủ ý và thẻ chưa nhớ sẽ xuất hiện ở đây. Bạn cũng có thể chủ động lưu câu bất kỳ.</p>${scopeControls(false)}<label class="review-filter">Lý do cần ôn<select id="review-filter">${[['all','Tất cả'],['wrong','Trả lời sai'],['unanswered','Chưa trả lời trong đề'],['manual','Chủ động lưu'],['essayPending','Tự luận chưa đủ ý'],['card','Flashcard chưa nhớ']].map(([value,title])=>`<option value="${value}" ${state.reviewFilter===value?'selected':''}>${title}</option>`).join('')}</select></label><div class="action-row spaced"><strong>${items.length} câu trong bộ lọc</strong>${button('practice-review','Luyện các câu này →',items.length?'':'disabled','primary')}</div>${items.length?`<div class="review-list">${items.map(q=>{const r=data.reviews[reviewKey(q.id)],reasons=[r.wrong?'Trả lời sai':'',r.unanswered?'Chưa trả lời trong đề':'',r.manual?'Đã lưu':'',r.essayPending?'Tự luận chưa đủ ý':'',r.card?'Thẻ chưa nhớ':''].filter(Boolean);return `<article class="topic-card"><div class="eyebrow">BÀI ${q.day} · ${esc(q.topic)}</div><h3>${esc(q.prompt)}</h3><p>${reasons.join(' · ')}</p><div class="action-row">${button('practice-one','Luyện câu này',`data-qid="${q.id}"`,'secondary small-button')}${button('clear-review','Đã ôn · bỏ khỏi danh sách',`data-qid="${q.id}"`,'ghost small-button')}</div></article>`;}).join('')}</div>`:empty('Không còn câu cần ôn trong phạm vi này. Bạn có thể chọn một chủ đề khác hoặc thi thử.')}</div>`;
  }
  function render(){
    renderNav();
    if(state.screen==='home')renderHome();else if(state.screen==='intro')renderIntro();else if(state.screen==='study')renderStudy();else if(state.screen==='flashcards')renderFlashcards();else if(state.screen==='exam-setup')renderExamSetup();else if(state.screen==='quiz')renderQuiz();else if(state.screen==='result')renderResult();else if(state.screen==='review')renderReview();
    startClock();
  }
  function scopeLabel(){return `${state.scope.day==='all'?`Toàn ${course.label}`:`Bài ${state.scope.day}`}${state.scope.topic==='all'?'':` · ${state.scope.topic}`}${state.scope.level==='apply'?' · Vận dụng':state.scope.level==='concept'?' · Hiểu khái niệm':''}`;}
  function hub(activity){state.activity=activity;state.scope.type='all';go(activity==='exam'?'exam-setup':'study');}
  document.addEventListener('click',event=>{
    const b=event.target.closest('button[data-action]');if(!b||b.disabled)return;
    const action=b.dataset.action;state.message='';
    if(action==='home')return go('home');
    if(action==='intro'){state.day=Number(b.dataset.day);state.lessonTab='overview';state.flowIndex=0;return go('intro');}
    if(action==='overview-tab'||action==='overview-topics'){state.lessonTab=action==='overview-topics'?'topics':b.dataset.view==='topics'?'topics':'overview';return go('intro');}
    if(action==='overview-step'){const i=Number(b.dataset.index),o=window.LESSON_OVERVIEWS[state.day];if(!Number.isInteger(i)||i<0||i>=o.flow.length)return;state.flowIndex=i;renderIntro();document.getElementById(`flow-step-${i}`)?.focus?.({preventScroll:true});return;}
    if(action==='practice-hub')return hub('practice');
    if(action==='flash-hub')return hub('flashcards');
    if(action==='exam-hub')return hub('exam');
    if(action==='review')return go('review');
    if(action==='resume')return resume(b.dataset.id);
    if(action==='back-study')return go('study');
    if(action.startsWith('lesson-')){state.scope={day:b.dataset.day,topic:'all',type:'all',level:'all'};return hub(action==='lesson-flash'?'flashcards':action==='lesson-exam'?'exam':'practice');}
    if(action==='topic-practice'||action==='topic-flash'){state.scope={day:String(state.day),topic:lesson(state.day).topics[Number(b.dataset.topicIndex)],type:'all',level:'all'};return hub(action==='topic-flash'?'flashcards':'practice');}
    if(action==='begin-practice')return startRun(pool(),'practice',scopeLabel());
    if(action==='open-cards')return openCards();
    if(action==='reveal-card'){state.revealed=true;return render();}
    if(action==='card-prev'||action==='card-next'){state.cardIndex+=action==='card-next'?1:-1;state.revealed=false;return render();}
    if(action==='shuffle-cards'){state.cardOrder=L.shuffle(state.cardOrder,Date.now());state.cardIndex=0;state.revealed=false;return render();}
    if(action==='rate-card'){
      if(!state.revealed)return;const card=cards.find(c=>c.id===state.cardOrder[state.cardIndex]),known=b.dataset.known==='true';
      data.cards[card.id]=L.cardRating(data.cards[card.id],known);data.reviews[card.questionId]={...data.reviews[card.questionId],card:!known};persist();
      state.cardIndex++;state.revealed=false;return render();
    }
    if(action==='repeat-cards'){state.cardIndex=0;state.revealed=false;return render();}
    if(action==='begin-exam'){
      const count=Number(document.getElementById('exam-count').value),essays=Number(document.getElementById('exam-essays').value),minutes=Number(document.getElementById('exam-minutes').value);
      if(!Number.isInteger(count)||count<1||count>150||!Number.isInteger(essays)||essays<0||essays>10||!Number.isInteger(minutes)||minutes<1||minutes>180){state.message='Nhập 1–150 câu trắc nghiệm, 0–10 tự luận và 1–180 phút.';return render();}
      const available=questions.filter(q=>L.matches(q,{...state.scope,type:'all'}));
      if(available.filter(q=>q.type!=='essay').length<count||available.filter(q=>q.type==='essay').length<essays){state.message='Phạm vi này chưa đủ số câu bạn chọn. Giảm số câu hoặc mở rộng phạm vi.';return render();}
      data.examConfig={count,essays,minutes};return startRun(L.exam(available,count,essays,Date.now()),'exam',`Thi thử · ${scopeLabel()}`,minutes);
    }
    if(action==='bookmark'){
      const q=byId.get(b.dataset.qid);if(!q)return;
      data.reviews[reviewKey(q.id)]={...data.reviews[reviewKey(q.id)],manual:!data.reviews[reviewKey(q.id)]?.manual};persist();return render();
    }
    if(action==='clear-review'){data.reviews[b.dataset.qid]={};persist();return render();}
    if(action==='practice-one'){const q=byId.get(b.dataset.qid);if(q)return startRun([q],'practice',`Ôn lại · ${q.topic}`);return;}
    if(action==='practice-review'){
      const qs=reviewIds().filter(q=>L.matches(q,{...state.scope,type:'all'})).filter(q=>state.reviewFilter==='all'||data.reviews[reviewKey(q.id)]?.[state.reviewFilter]);
      return startRun(qs,'practice','Ôn các câu cần củng cố');
    }
    const s=run();if(!s)return;
    if(action==='retry-run')return startRun(runQuestions(s).map(q=>byId.get(reviewKey(q.id))),'practice',`Luyện lại · ${s.label}`);
    if(s.submitted)return;
    if(s.style==='exam'&&Date.now()>=s.deadline)return finish(true);
    const qs=runQuestions(s),q=qs[state.index],a=s.answers[q.id]||(s.answers[q.id]={});
    if(action==='choose'){
      if(s.style==='practice'&&a.checked)return;const choice=Number(b.dataset.choice);if(!Number.isInteger(choice)||choice<0||choice>=q.options.length)return;
      if(q.type==='multi'){const set=new Set(a.choices||[]);set.has(choice)?set.delete(choice):set.add(choice);a.choices=[...set];}else a.choice=choice;
      persist();return render();
    }
    if(action==='insert-template'){
      if(a.checked)return;if(a.text?.trim()&&!window.confirm('Thay nội dung hiện tại bằng khung hướng dẫn?'))return;
      a.text=L.template(q);persist();return render();
    }
    if(action==='check-answer'){
      if(!L.answered(q,a)||q.type==='essay'&&a.text.trim()===L.template(q)){state.message='Hãy viết hoặc chọn câu trả lời của bạn trước khi đối chiếu.';return render();}
      a.checked=true;data.reviews[reviewKey(q.id)]=L.updateReview(data.reviews[reviewKey(q.id)],q,a);persist();return render();
    }
    if(action==='revise-essay'){a.checked=false;a.rubric=[];data.reviews[reviewKey(q.id)]=L.updateReview(data.reviews[reviewKey(q.id)],q,a);persist();return render();}
    if(action==='prev'||action==='next'||action==='goto'){state.index=action==='goto'?Number(b.dataset.index):state.index+(action==='next'?1:-1);render();window.scrollTo({top:0,behavior:'instant'});return;}
    if(action==='submit'){
      const missing=qs.filter(item=>!L.answered(item,s.answers[item.id])).length;
      if(!window.confirm(missing?`Còn ${missing} câu chưa trả lời. Nộp lượt làm này?`:'Nộp lượt làm này và mở kết quả?'))return;
      return finish();
    }
  });
  document.addEventListener('input',event=>{
    const el=event.target;
    if(el.id==='search'){state.search=el.value;return renderCards();}
    if(el.id==='essay-answer'){
      const s=run();if(!s||s.submitted)return;if(s.style==='exam'&&Date.now()>=s.deadline)return finish(true);const q=runQuestions(s)[state.index],a=s.answers[q.id]||(s.answers[q.id]={});if(s.style==='practice'&&a.checked)return;
      a.text=el.value;persist();const qs=runQuestions(s),count=qs.filter(item=>L.answered(item,s.answers[item.id])).length;
      document.getElementById('answer-count').textContent=`${count} / ${qs.length} câu đã nhập`;document.getElementById('answer-progress').style.width=`${Math.round(count/qs.length*100)}%`;
      document.querySelector(`.map-btn[data-index="${state.index}"]`)?.classList.toggle('answered',Boolean(el.value.trim()));
    }
  });
  document.addEventListener('change',event=>{
    const el=event.target;
    if(el.id==='scope-day'){state.scope.day=el.value;state.scope.topic='all';return render();}
    if(el.id==='scope-topic'){state.scope.topic=el.value;return render();}
    if(el.id==='scope-type'){state.scope.type=el.value;return render();}
    if(el.id==='scope-level'){state.scope.level=el.value;return render();}
    if(el.id==='due-only'){state.dueOnly=el.checked;return;}
    if(el.id==='review-filter'){state.reviewFilter=el.value;return render();}
    if(el.matches('input[data-rubric]')){
      const s=run(),q=byId.get(el.dataset.qid);if(!s||!q||!s.submitted&&!(s.style==='practice'&&s.answers[q.id]?.checked))return;
      const a=s.answers[q.id]||(s.answers[q.id]={});if(!a.text?.trim())return;
      const set=new Set(a.rubric||[]),i=Number(el.dataset.rubric);el.checked?set.add(i):set.delete(i);a.rubric=[...set];data.reviews[reviewKey(q.id)]=L.updateReview(data.reviews[reviewKey(q.id)],q,a);persist();
      const pass=L.essayDone(q,a),badge=document.querySelector(`[data-badge="${q.id}"]`);if(badge){badge.textContent=pass?'✓ Tự xác nhận đủ ý':'Chưa tự xác nhận đủ ý';badge.classList.toggle('pending',!pass);}
      const score=document.getElementById('essay-score');if(score&&state.screen==='result'){const essays=runQuestions(s).filter(x=>x.type==='essay');score.textContent=`${essays.filter(x=>L.essayDone(x,s.answers[x.id])).length}/${essays.length}`;}
      if(state.screen==='result')renderResult();renderNav();
    }
  });
  document.getElementById('brand').addEventListener('click',()=>go('home'));
  document.getElementById('mobile-brand').addEventListener('click',()=>go('home'));
  document.getElementById('reset-button').addEventListener('click',()=>{if(!window.confirm('Xóa mọi lượt làm, flashcard và câu cần ôn trên trình duyệt này?'))return;data.runs={};data.reviews={};data.cards={};delete data.activeRun;if(OLD_STORE)localStorage.removeItem(OLD_STORE);persist();go('home');});
  render();
})();
