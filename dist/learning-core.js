(() => {
  const answered=(q,a)=>q.type==='mc'?Number.isInteger(a?.choice):q.type==='multi'?Array.isArray(a?.choices)&&a.choices.length>0:Boolean(a?.text?.trim());
  const correct=(q,a)=>q.type==='mc'?a?.choice===q.answer:q.type==='multi'?Array.isArray(a?.choices)&&new Set(a.choices).size===a.choices.length&&a.choices.length===q.answers.length&&q.answers.every(i=>a.choices.includes(i)):false;
  const essayDone=(q,a)=>q.type==='essay'&&Boolean(a?.text?.trim())&&q.rubric.every((_,i)=>a.rubric?.includes(i));
  function hash(text){let n=2166136261;for(const c of String(text)){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0;}
  function shuffle(items,seed){const a=[...items];let n=hash(seed)||1;for(let i=a.length-1;i>0;i--){n^=n<<13;n^=n>>>17;n^=n<<5;const j=(n>>>0)%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
  function matches(q,scope){return (scope.day==='all'||q.day===Number(scope.day))&&(scope.topic==='all'||q.topic===scope.topic)&&(!scope.level||scope.level==='all'||q.level===scope.level)&&(scope.type==='all'||scope.type==='objective'&&q.type!=='essay'||scope.type==='scenario'&&q.scenario||scope.type===q.type);}
  // Rút luân phiên từng chủ đề để tránh đề bị chi phối bởi bài nhiều câu.
  function balanced(questions,count,seed){
    const groups=new Map();for(const q of shuffle(questions,seed)){const key=`${q.day}:${q.topic}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(q);}
    const buckets=shuffle([...groups.values()],`${seed}:topics`),result=[];
    while(result.length<count&&buckets.some(x=>x.length))for(const bucket of buckets){if(bucket.length&&result.length<count)result.push(bucket.shift());}
    return result;
  }
  function exam(questions,objectiveCount,essayCount,seed){
    const objective=balanced(questions.filter(q=>q.type!=='essay'),objectiveCount,`${seed}:objective`);
    const essays=balanced(questions.filter(q=>q.type==='essay'),essayCount,`${seed}:essay`);
    return [...shuffle(objective,`${seed}:order`),...essays];
  }
  function updateReview(previous,q,a){
    const entry={...previous};
    if(answered(q,a))entry.unanswered=false;
    if(q.type==='essay')entry.essayPending=answered(q,a)&&!essayDone(q,a);
    else if(answered(q,a))entry.wrong=!correct(q,a);
    entry.last=Date.now();return entry;
  }
  const needsReview=r=>Boolean(r&&(r.manual||r.wrong||r.essayPending||r.card||r.unanswered));
  function template(q){
    if(q.scenario)return '1. Vấn đề và dữ kiện cần xác minh: [...]\n2. Thứ tự xử lý: [...]\n3. Vì sao chọn cách này, rủi ro cần chặn: [...]\n4. Cách kiểm chứng và điều kiện hoàn tất: [...]';
    if(/công thức|tính chi phí|ước tính/i.test(q.prompt))return '1. Dữ kiện, đơn vị và giả định: [...]\n2. Công thức: [...]\n3. Thay số và kết quả: [...]\n4. Cách kiểm tra và giới hạn: [...]';
    return '1. Ý chính hoặc giả định: [...]\n2. Cách làm / các bước: [...]\n3. Vì sao làm như vậy: [...]\n4. Cách kiểm chứng và giới hạn: [...]';
  }
  function cardRating(previous,known,now=Date.now()){
    const level=known?Math.min((previous?.level||0)+1,5):0;
    const days=known?[0,1,3,7,14,30][level]:0;
    return {level,known,last:now,due:now+days*86400000};
  }
  window.P1Learning={answered,correct,essayDone,shuffle,matches,balanced,exam,updateReview,needsReview,template,cardRating};
})();
