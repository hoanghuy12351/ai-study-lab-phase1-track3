// Báo cáo truy nguồn; số trang có tham chiếu không phải thước đo bao phủ mọi dữ kiện.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
global.window={};require('../dist/track3-sources.js');require('../dist/track3-data.js');
const root=path.join(__dirname,'../..'),site=path.join(__dirname,'..');
const sources=JSON.parse(fs.readFileSync(path.join(site,'docs/track3-sources.json'),'utf8'));
const lessons=window.TRACK3_LESSONS,questions=lessons.flatMap(l=>l.questions),units=window.TRACK3_COVERAGE;
const bySource=new Map(sources.map(s=>[s.id,s]));
const compact=pages=>{
  const sorted=[...new Set(pages)].sort((a,b)=>a-b),out=[];
  for(let i=0;i<sorted.length;i++){const start=sorted[i];let end=start;while(sorted[i+1]===end+1)end=sorted[++i];out.push(start===end?String(start):`${start}–${end}`);}
  return out.join(', ');
};
const digest=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
for(const s of sources){
  assert.equal(digest(s.pdf),s.pdf_sha256,`PDF đã đổi: ${s.pdf}`);
  // Hash text được lập sau chuẩn hóa newline của Python universal-newline reader.
  const text=fs.readFileSync(path.join(root,s.path),'utf8').replace(/\r\n?/g,'\n');
  assert.equal(crypto.createHash('sha256').update(text).digest('hex'),s.text_sha256,`Text đã đổi: ${s.path}`);
  for(const alias of s.aliases)assert.equal(digest(alias),s.pdf_sha256,`Alias khác nội dung: ${alias}`);
}
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mapped=new Map(sources.map(s=>[s.id,new Set(questions.flatMap(q=>q.references.filter(r=>r.sourceId===s.id).flatMap(r=>r.pages)))]));
const graphPages=[9,12,16,21,22,23,24,25,26,28,32,33,34,35,36,38,39,41,42];
const summary=`${lessons.length} bài (16–28), ${units.length} chủ đề, ${questions.length} câu và ${window.STUDY_COURSE.flashcards.length} flashcard. ${sources.length} deck, ${sources.reduce((n,s)=>n+s.pages,0)} trang PDF; ${sources.reduce((n,s)=>n+s.aliases.length,0)} file trong slides/k04-l34-p2-t3 trùng byte với các deck này.`;
const limits='Phạm vi được đối chiếu ở mức chủ đề và trang nguồn. Mỗi chủ đề có câu chọn nhiều đáp án và tình huống có hướng dẫn; các câu một đáp án kiểm thêm điểm cần phân biệt. Việc gắn nguồn không chứng minh mọi câu chữ, hình, ví dụ và dữ kiện đã thành câu hỏi. Các trang chưa được gắn riêng được liệt kê để tiếp tục kiểm toán. Không dùng tỷ lệ trang làm điểm chất lượng câu hỏi.';
const notes='Số bài theo buổi giảng thực tế, không theo Dxx của thư mục (ví dụ D04 là Memory ngày 17). Số trang là thứ tự trang PDF từ 1, có thể khác footer trên slide. Tình huống và gợi ý được biên soạn từ kiến thức nguồn, có giả định và nhiều cách giải hợp lệ. Số liệu benchmark, tỷ lệ budget và ngưỡng slide là ví dụ có điều kiện. Tự luận dùng checklist tự đánh giá, không tự chấm bằng AI.';
let md=`# Track 3 — bảng đối chiếu kiến thức và nguồn\n\n${summary}\n\n## Cách đọc\n\n${limits}\n\n${notes}\n\nĐã rà ảnh các trang GraphRAG ${compact(graphPages)} để bổ sung phần graph/traversal nhiều sơ đồ; trang 12 có lỗi extraction timeout trong bản text. Các nguồn còn lại được rà bằng bản trích text và mục lục trang; chưa rà hình từng trang của toàn bộ corpus.\n\n## Theo bài\n\n| Bài | Nội dung | Chủ đề | Một đáp án | Nhiều đáp án | Tình huống tự luận | Tổng |\n|---|---|---:|---:|---:|---:|---:|\n`;
for(const l of lessons)md+=`| ${l.day} | ${l.title} | ${l.topics.length} | ${l.questions.filter(q=>q.type==='mc').length} | ${l.questions.filter(q=>q.type==='multi').length} | ${l.questions.filter(q=>q.type==='essay').length} | ${l.questions.length} |\n`;
md+='\n## Danh mục nguồn\n';
for(const s of sources){
  const missing=Array.from({length:s.pages},(_,i)=>i+1).filter(p=>!mapped.get(s.id).has(p));
  md+=`\n### ${s.id}\n\n- Tên: ${s.title}\n- PDF: \`${s.pdf}\`\n- Text: \`${s.path}\`\n- SHA-256 PDF: \`${s.pdf_sha256}\`\n- Trang: ${s.pages}; trang có câu tham chiếu: ${mapped.get(s.id).size}.\n- Trang chưa gắn riêng: ${compact(missing)||'Không có'}.\n- Trang ít text (<50 ký tự): ${compact(s.low_text_pages)||'Không có'}.\n- Bản file trùng byte: ${s.aliases.map(a=>'`'+a+'`').join('; ')||'Không có'}.\n`;
}
md+='\n## Chủ đề → câu hỏi → trang nguồn\n';
for(const l of lessons){
  md+=`\n### Bài ${l.day} — ${l.title}\n\n| Chủ đề | Câu hỏi | Nguồn và trang PDF |\n|---|---|---|\n`;
  for(const topic of l.topics){
    const qs=l.questions.filter(q=>q.topic===topic),refs=new Map();
    for(const q of qs)for(const r of q.references)refs.set(r.sourceId,[...(refs.get(r.sourceId)||[]),...r.pages]);
    md+=`| ${topic} | ${qs.map(q=>q.id).join(', ')} | ${[...refs].map(([id,pp])=>`${id}: ${compact(pp)}`).join('; ')} |\n`;
  }
}
fs.writeFileSync(path.join(site,'docs/track3-coverage.md'),md.split('\n').map(line=>line.trimEnd()).join('\n'));
const inventoryHTML=sources.map(s=>{
  const missing=Array.from({length:s.pages},(_,i)=>i+1).filter(p=>!mapped.get(s.id).has(p));
  return `<details><summary>${escape(s.title)} · ${s.pages} trang · ${mapped.get(s.id).size} trang có tham chiếu</summary><p><code>${escape(s.id)}</code></p><p>Nguồn: ${escape(s.pdf)}</p><p>Trang chưa gắn riêng: ${compact(missing)||'Không có'}.</p><p>Trang ít text: ${compact(s.low_text_pages)||'Không có'}.</p><p>File trùng byte: ${s.aliases.length}.</p></details>`;
}).join('');
const topicHTML=lessons.map(l=>`<section id="day-${l.day}"><h2>Bài ${l.day} · ${escape(l.title)}</h2><p>${l.topics.length} chủ đề · ${l.questions.length} câu</p><div class="table-scroll"><table><thead><tr><th>Chủ đề</th><th>Câu hỏi</th><th>Nguồn và trang PDF</th></tr></thead><tbody>${l.topics.map(topic=>{
  const qs=l.questions.filter(q=>q.topic===topic),refs=new Map();
  for(const q of qs)for(const r of q.references)refs.set(r.sourceId,[...(refs.get(r.sourceId)||[]),...r.pages]);
  return `<tr><td>${escape(topic)}</td><td>${qs.map(q=>escape(q.id)).join('<br>')}</td><td>${[...refs].map(([id,pp])=>`${escape(bySource.get(id).title)} · tr. ${compact(pp)}`).join('<br>')}</td></tr>`;
}).join('')}</tbody></table></div></section>`).join('');
fs.writeFileSync(path.join(site,'dist/track3-coverage.html'),`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Track 3 — Nguồn và phạm vi</title><link rel="stylesheet" href="styles.css"><style>main{max-width:1200px;margin:auto;padding:24px}h1,h2{line-height:1.3}section{margin-top:42px}.table-scroll{overflow-x:auto}table{border-collapse:collapse;width:100%;background:white;font-size:13px}th,td{border:1px solid var(--line);padding:12px;text-align:left;vertical-align:top;min-width:160px}td:nth-child(2){font-size:11px}details{padding:12px;background:#fff;border:1px solid var(--line);overflow-wrap:anywhere}summary{cursor:pointer}nav{display:flex;gap:12px;flex-wrap:wrap}code{font-size:11px}</style></head><body><main><a href="track3.html">← Về Track 3 Study Lab</a><h1>Nguồn và phạm vi kiến thức</h1><p>${escape(summary)}</p><p class="notice">${escape(limits)}</p><p>${escape(notes)}</p><p>Đã rà ảnh các trang GraphRAG ${compact(graphPages)}. Trang 12 có lỗi extraction trong bản text. Chưa rà hình từng trang của toàn bộ corpus.</p><nav aria-label="Đi tới bài">${lessons.map(l=>`<a href="#day-${l.day}">Bài ${l.day}</a>`).join('')}</nav><section><h2>22 bộ tài liệu đầu vào</h2>${inventoryHTML}</section>${topicHTML}</main></body></html>`);
console.log(`OK: nguồn và SHA-256 khớp; đã tạo docs/track3-coverage.md và dist/track3-coverage.html (${units.length} chủ đề).`);
