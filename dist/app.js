(() => {
  'use strict';
  const lessons = window.PHASE1_LESSONS;
  const STORE = 'phase1-ai-quiz-v1';
  const app = document.getElementById('app');
  const nav = document.getElementById('lesson-nav');
  const breadcrumb = document.getElementById('breadcrumb');
  const state = {screen:'home', day:1, mode:'all', index:0, search:''};
  let sessions = {};
  try { sessions = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch { sessions = {}; }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lesson = () => lessons.find(x => x.day === state.day);
  const key = () => `${state.day}:${state.mode}`;
  const session = () => sessions[key()] || (sessions[key()] = {answers:{},submitted:false});
  const filtered = () => lesson().questions.filter(q => state.mode === 'all' || q.type === state.mode);
  const persist = () => {
    try { localStorage.setItem(STORE, JSON.stringify(sessions)); }
    catch { document.querySelector('.save-indicator').textContent = 'Không lưu được tiến độ'; }
  };
  const hash = text => { let h=2166136261; for(const c of text){h^=c.charCodeAt(0);h=Math.imul(h,16777619);} return h>>>0; };
  const order = q => [0,1,2,3].sort((a,b)=>hash(`${q.id}:${a}`)-hash(`${q.id}:${b}`));
  const countFor = (l,type) => l.questions.filter(q=>q.type===type).length;
  const total = lessons.reduce((n,l)=>n+l.questions.length,0);
  const setScreen = (screen,day=state.day) => { state.screen=screen; state.day=day; state.index=0; render(); window.scrollTo({top:0,behavior:'instant'}); };
  const topicStats = l => l.topics.map(topic => ({topic, n:l.questions.filter(q=>q.topic===topic).length}));

  function renderNav(){
    nav.innerHTML = lessons.map(l => {
      const done = Object.entries(sessions).some(([k,v])=>k.startsWith(`${l.day}:`) && v.submitted);
      return `<button class="nav-item ${state.screen!=='home'&&state.day===l.day?'active':''}" data-action="intro" data-day="${l.day}" type="button"><span class="nav-number">${String(l.day).padStart(2,'0')}</span><span class="nav-title">${esc(l.title)}</span>${done?'<span class="nav-check" aria-label="Đã làm">✓</span>':''}</button>`;
    }).join('');
  }
  function renderHome(){
    breadcrumb.innerHTML='Phase 1 <span>/</span> Tổng quan';
    const done = lessons.filter(l=>Object.entries(sessions).some(([k,v])=>k.startsWith(`${l.day}:`)&&v.submitted)).length;
    app.innerHTML = `<div class="page">
      <div class="intro-grid"><div class="intro-copy"><div class="eyebrow">BỘ CÂU HỎI · AI IN ACTION</div><h1 class="h1">Học sâu hơn.<br><em>Kiểm tra thật.</em></h1><p class="lead">15 bài của Phase 1, từ nền tảng LLM đến triển khai AI trong thực tế. Chọn một bài, trả lời câu hỏi tình huống và tự đối chiếu bài tự luận theo tiêu chí rõ ràng.</p><div class="stats"><div class="stat"><strong>15</strong> bài học</div><div class="stat"><strong>${total}</strong> câu hỏi</div><div class="stat"><strong>${lessons.reduce((n,l)=>n+countFor(l,'essay'),0)}</strong> câu tự luận</div></div></div>
      <div class="hero-card"><div class="small">TIẾN ĐỘ CỦA BẠN</div><div class="big">${done}<span> / 15 bài đã làm</span></div><p>Tiến độ được lưu trong trình duyệt này.</p></div></div>
      <div class="toolbar"><h2 class="section-title">Chọn bài để bắt đầu</h2><input id="search" class="search" type="search" placeholder="Tìm bài hoặc chủ đề..." value="${esc(state.search)}" aria-label="Tìm bài hoặc chủ đề"></div>
      <div id="lesson-grid" class="lesson-grid"></div>
      <div class="notice"><strong>Cách chấm:</strong> Trắc nghiệm được chấm ngay sau khi nộp. Tự luận hiển thị bài mẫu và checklist để bạn tự đánh giá; hệ thống không giả vờ chấm nội dung mở bằng từ khóa. Nội dung chỉ lưu trên thiết bị của bạn.</div>
    </div>`;
    renderCards();
  }
  function renderCards(){
    const query=state.search.trim().toLocaleLowerCase('vi');
    const matches=lessons.filter(l=>`${l.title} ${l.summary} ${l.topics.join(' ')}`.toLocaleLowerCase('vi').includes(query));
    document.getElementById('lesson-grid').innerHTML=matches.length?matches.map(l=>{
      const sessionKeys=Object.keys(sessions).filter(k=>k.startsWith(`${l.day}:`));
      const completed=sessionKeys.some(k=>sessions[k].submitted);
      const started=sessionKeys.some(k=>Object.keys(sessions[k].answers||{}).length);
      return `<article class="lesson-card"><div class="card-top"><span class="day-pill">BÀI ${String(l.day).padStart(2,'0')}</span><span class="card-count">${l.questions.length} CÂU · ${l.topics.length} CHỦ ĐỀ</span></div><h3>${esc(l.title)}</h3><p>${esc(l.summary)}</p><div class="card-bottom"><button class="card-link" type="button" data-action="intro" data-day="${l.day}">${completed?'Xem lại bài':'Khám phá bài'} &nbsp;→</button><span class="card-progress ${completed?'done':''}">${completed?'✓ Đã làm':started?'Đang làm':'Chưa bắt đầu'}</span></div></article>`;
    }).join(''):'<div class="empty">Không tìm thấy bài phù hợp. Thử từ khóa khác.</div>';
  }
  function renderIntro(){
    const l=lesson(); const qs=filtered(); const k=key(); const existing=sessions[k];
    breadcrumb.innerHTML=`Phase 1 <span>/</span> Bài ${String(l.day).padStart(2,'0')}`;
    app.innerHTML=`<div class="page"><button class="back-link" type="button" data-action="home">← Tất cả bài học</button>
      <div class="lesson-hero"><div><div class="eyebrow">BÀI ${String(l.day).padStart(2,'0')} / 15 · AI ENGINEERING PHASE 1</div><h1 class="h1">${esc(l.title)}</h1><p class="lead">${esc(l.summary)}</p><div class="source-note"><strong>Nguồn biên soạn:</strong> slides/k4p1/${esc(l.deck)}</div></div><div class="start-actions"><button class="primary" type="button" data-action="start">${existing?.submitted?'Xem kết quả':existing?'Tiếp tục làm':'Bắt đầu làm bài'} →</button><button class="secondary" type="button" data-action="start-fresh">Làm lại từ đầu</button></div></div>
      <div class="mode-row" role="group" aria-label="Chọn dạng câu hỏi"><button class="mode ${state.mode==='all'?'active':''}" data-action="mode" data-mode="all" type="button">Tất cả · ${l.questions.length}</button><button class="mode ${state.mode==='mc'?'active':''}" data-action="mode" data-mode="mc" type="button">Trắc nghiệm · ${countFor(l,'mc')}</button><button class="mode ${state.mode==='essay'?'active':''}" data-action="mode" data-mode="essay" type="button">Tự luận · ${countFor(l,'essay')}</button></div>
      <div class="coverage-card"><h2>Kiến thức được kiểm tra</h2><div class="topic-list">${topicStats(l).map(t=>`<span class="topic"><span class="dot"></span>${esc(t.topic)} · ${t.n}</span>`).join('')}</div></div>
      <div class="overview-columns"><div class="mini-panel"><div class="num">${qs.length}</div><div class="label">Câu hỏi ở chế độ này</div></div><div class="mini-panel"><div class="num">${existing?Object.keys(existing.answers).length:0}</div><div class="label">Câu đã nhập trong lượt này</div></div></div>
      <div class="notice">Câu hỏi bám theo các chủ đề chính của slide. Một số slide nêu ví dụ, giá, luật hoặc phiên bản công cụ có thể thay đổi; bài kiểm tra tập trung vào nguyên lý và quyết định kỹ thuật cần kiểm chứng.</div>
    </div>`;
  }
  function renderQuiz(){
    const l=lesson(), qs=filtered(), q=qs[state.index], s=session(), a=s.answers[q.id]||{};
    if(s.submitted){setScreen('result');return;}
    breadcrumb.innerHTML=`Phase 1 <span>/</span> Bài ${String(l.day).padStart(2,'0')} <span>/</span> Làm bài`;
    const answered=qs.filter(item=>{const x=s.answers[item.id];return item.type==='mc'?Number.isInteger(x?.choice):Boolean(x?.text?.trim());}).length;
    const main=q.type==='mc'?`<div class="options" role="group" aria-label="Các phương án trả lời">${order(q).map((original,pos)=>`<button type="button" class="option ${a.choice===original?'selected':''}" data-action="choose" data-choice="${original}" aria-pressed="${a.choice===original}"><span class="letter">${String.fromCharCode(65+pos)}</span><span>${esc(q.options[original])}</span></button>`).join('')}</div>`:`<textarea id="essay-answer" class="essay-input" placeholder="Viết câu trả lời của bạn ở đây..." aria-label="Câu trả lời tự luận">${esc(a.text||'')}</textarea><div class="essay-hint">Hãy nêu cách làm và cách kiểm chứng. Sau khi nộp, bạn sẽ tự đối chiếu với checklist.</div>`;
    app.innerHTML=`<div class="page"><button class="back-link" type="button" data-action="intro" data-day="${l.day}">← Quay về bài học</button><div class="lesson-hero"><div><div class="eyebrow">BÀI ${String(l.day).padStart(2,'0')} · ${state.mode==='all'?'TẤT CẢ':state.mode==='mc'?'TRẮC NGHIỆM':'TỰ LUẬN'}</div><h1 class="h1">${esc(l.title)}</h1></div></div>
      <div class="quiz-layout"><section class="quiz-card" aria-live="polite"><div class="question-meta"><span class="type-pill ${q.type==='essay'?'essay':''}">${q.type==='mc'?'TRẮC NGHIỆM':'TỰ LUẬN'}</span><span class="q-index">CÂU ${state.index+1} / ${qs.length} · ${esc(q.topic)}</span></div><h2 class="question-title">${esc(q.prompt)}</h2>${main}<div class="question-actions"><button class="ghost" type="button" data-action="prev" ${state.index===0?'disabled':''}>← Câu trước</button>${state.index===qs.length-1?'<button class="primary" type="button" data-action="submit">Nộp bài →</button>':'<button class="primary" type="button" data-action="next">Câu tiếp →</button>'}</div></section>
      <aside class="rail-card"><h3>Tiến độ bài làm</h3><p>${answered} / ${qs.length} câu đã nhập</p><div class="progress-track" aria-label="${answered} trên ${qs.length} câu đã nhập"><div style="width:${Math.round(answered/qs.length*100)}%"></div></div><div class="question-map">${qs.map((item,i)=>{const x=s.answers[item.id];const has=item.type==='mc'?Number.isInteger(x?.choice):Boolean(x?.text?.trim());return `<button class="map-btn ${i===state.index?'current':''} ${has?'answered':''}" type="button" data-action="goto" data-index="${i}" aria-label="Câu ${i+1}${has?', đã trả lời':''}">${i+1}</button>`;}).join('')}</div><div class="rail-note">Bạn có thể chuyển câu tự do. Đáp án và giải thích chỉ hiện sau khi nộp.</div></aside></div></div>`;
  }
  const essayComplete=(q,a)=>Boolean(a?.text?.trim())&&q.rubric.every((_,i)=>a.rubric?.includes(i));
  function renderResult(){
    const l=lesson(),qs=filtered(),s=session();
    breadcrumb.innerHTML=`Phase 1 <span>/</span> Bài ${String(l.day).padStart(2,'0')} <span>/</span> Kết quả`;
    const mc=qs.filter(q=>q.type==='mc');const essays=qs.filter(q=>q.type==='essay');
    const correct=mc.filter(q=>s.answers[q.id]?.choice===q.answer).length;
    const self=essays.filter(q=>essayComplete(q,s.answers[q.id])).length;
    app.innerHTML=`<div class="page"><button class="back-link" type="button" data-action="intro" data-day="${l.day}">← Về bài học</button><div class="result-head"><div><div class="eyebrow">ĐÃ NỘP BÀI · BÀI ${String(l.day).padStart(2,'0')}</div><h1 class="h1">Kết quả & phần cần ôn</h1><p class="lead">${esc(l.title)} — xem giải thích từng câu. Tự luận chỉ được tính “đạt checklist” khi bạn tự xác nhận đủ các tiêu chí.</p></div><button class="primary" type="button" data-action="start-fresh">Làm lại bài này ↗</button></div>
      <div class="score-grid"><div class="score-box"><strong>${correct}/${mc.length}</strong><span>Trắc nghiệm đúng</span></div><div class="score-box"><strong id="essay-score">${self}/${essays.length}</strong><span>Tự luận đạt checklist</span></div><div class="score-box"><strong>${qs.length}</strong><span>Câu đã được mở đáp án</span></div></div>
      <div class="coverage-card"><h2>Phủ chủ đề</h2><div class="topic-list">${l.topics.map(topic=>{const inMode=qs.filter(q=>q.topic===topic);if(!inMode.length)return '';const ok=inMode.every(q=>q.type==='mc'?s.answers[q.id]?.choice===q.answer:essayComplete(q,s.answers[q.id]));return `<span class="topic ${ok?'done':'warn'}"><span class="dot"></span>${esc(topic)} · ${ok?'Đạt':'Cần ôn'}</span>`;}).join('')}</div></div>
      <h2 class="section-title" style="margin:28px 0 16px">Xem lại từng câu</h2><div class="result-list">${qs.map((q,i)=>renderAnswer(q,i,s.answers[q.id]||{})).join('')}</div>
      <div class="notice"><strong>Lưu ý về điểm tự luận:</strong> Checklist là công cụ tự học, không xác nhận độc lập rằng câu trả lời đã đúng. Nếu câu trả lời liên quan quy định, giá hoặc phiên bản sản phẩm, hãy đối chiếu tài liệu hiện hành trước khi áp dụng.</div></div>`;
  }
  function renderAnswer(q,i,a){
    if(q.type==='mc'){
      const ok=a.choice===q.answer;const chosen=Number.isInteger(a.choice)?q.options[a.choice]:'Chưa trả lời';
      return `<article class="result-card ${ok?'good':'bad'}"><div class="result-tag ${ok?'':'wrong'}">CÂU ${i+1} · ${ok?'ĐÚNG':'CẦN ÔN'} · ${esc(q.topic)}</div><h3>${esc(q.prompt)}</h3><p class="answer-line ${ok?'':'wrong'}"><strong>Bạn chọn:</strong> ${esc(chosen)}</p>${ok?'':`<p class="answer-line"><strong>Đáp án:</strong> ${esc(q.options[q.answer])}</p>`}<p>${esc(q.why)}</p></article>`;
    }
    const checks=a.rubric||[];const pass=essayComplete(q,a);
    return `<article class="result-card" id="result-${q.id}"><div class="result-tag">CÂU ${i+1} · TỰ LUẬN · ${esc(q.topic)}</div><h3>${esc(q.prompt)}</h3><p class="answer-line"><strong>Bài của bạn:</strong> ${a.text?.trim()?esc(a.text).replace(/\n/g,'<br>'):'Chưa trả lời'}</p><div class="sample"><strong>Gợi ý trả lời:</strong><br>${esc(q.sample)}</div><p><strong>Tự đối chiếu từng tiêu chí:</strong></p><div class="rubric-list">${q.rubric.map((line,n)=>`<label class="rubric-item"><input type="checkbox" data-rubric="${n}" data-qid="${q.id}" ${checks.includes(n)?'checked':''}><span>${esc(line)}</span></label>`).join('')}</div><span class="self-badge ${pass?'':'pending'}" data-badge="${q.id}">${pass?'✓ Đạt checklist':'Cần ôn / chưa tự chấm'}</span></article>`;
  }
  function render(){renderNav(); if(state.screen==='home')renderHome();else if(state.screen==='intro')renderIntro();else if(state.screen==='quiz')renderQuiz();else renderResult();}
  document.addEventListener('click',e=>{
    const button=e.target.closest('button[data-action]');if(!button)return;
    const action=button.dataset.action;
    if(action==='home')return setScreen('home');
    if(action==='intro'){state.mode='all';return setScreen('intro',Number(button.dataset.day));}
    if(action==='mode'){state.mode=button.dataset.mode;return renderIntro();}
    if(action==='start'){const s=session();return setScreen(s.submitted?'result':'quiz');}
    if(action==='start-fresh'){
      if(sessions[key()] && !window.confirm('Xóa lượt làm hiện tại của chế độ này và bắt đầu lại?'))return;
      delete sessions[key()];persist();return setScreen('quiz');
    }
    if(action==='choose'){
      const q=filtered()[state.index];session().answers[q.id]={...(session().answers[q.id]||{}),choice:Number(button.dataset.choice)};persist();return renderQuiz();
    }
    if(action==='prev'||action==='next'||action==='goto'){
      state.index=action==='goto'?Number(button.dataset.index):state.index+(action==='next'?1:-1);renderQuiz();window.scrollTo({top:0,behavior:'instant'});return;
    }
    if(action==='submit'){
      const unanswered=filtered().filter(q=>{const a=session().answers[q.id];return q.type==='mc'?!Number.isInteger(a?.choice):!a?.text?.trim();}).length;
      if(unanswered && !window.confirm(`Còn ${unanswered} câu chưa trả lời. Bạn vẫn muốn nộp?`))return;
      session().submitted=true;persist();return setScreen('result');
    }
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='search'){state.search=e.target.value;return renderCards();}
    if(e.target.id==='essay-answer'){
      const q=filtered()[state.index];session().answers[q.id]={...(session().answers[q.id]||{}),text:e.target.value};persist();
      const qs=filtered(),answered=qs.filter(item=>{const a=session().answers[item.id];return item.type==='mc'?Number.isInteger(a?.choice):Boolean(a?.text?.trim());}).length;
      document.querySelector('.rail-card p').textContent=`${answered} / ${qs.length} câu đã nhập`;
      document.querySelector('.progress-track div').style.width=`${Math.round(answered/qs.length*100)}%`;
      const current=document.querySelector(`.map-btn[data-index="${state.index}"]`);current.classList.toggle('answered',Boolean(e.target.value.trim()));
    }
  });
  document.addEventListener('change',e=>{
    if(!e.target.matches('input[data-rubric]'))return;
    const q=filtered().find(x=>x.id===e.target.dataset.qid),a=session().answers[q.id]||(session().answers[q.id]={});
    const chosen=new Set(a.rubric||[]),n=Number(e.target.dataset.rubric);
    e.target.checked?chosen.add(n):chosen.delete(n);a.rubric=[...chosen].sort((x,y)=>x-y);persist();
    const badge=document.querySelector(`[data-badge="${q.id}"]`),pass=essayComplete(q,a);badge.textContent=pass?'✓ Đạt checklist':'Cần ôn / chưa tự chấm';badge.classList.toggle('pending',!pass);
    const essays=filtered().filter(x=>x.type==='essay');document.getElementById('essay-score').textContent=`${essays.filter(x=>essayComplete(x,session().answers[x.id])).length}/${essays.length}`;
  });
  document.getElementById('brand').addEventListener('click',()=>setScreen('home'));
  document.getElementById('mobile-brand').addEventListener('click',()=>setScreen('home'));
  document.getElementById('reset-button').addEventListener('click',()=>{if(!window.confirm('Xóa toàn bộ tiến độ Phase 1 lưu trong trình duyệt này?'))return;sessions={};persist();setScreen('home');});
  render();
})();
