const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

global.window = {};
require('../dist/questions.js');
require('../dist/extra-questions.js');
require('../dist/learning-content.js');

const root = path.resolve(__dirname, '../..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'slides/k4p1/.slides.json'), 'utf8'));
const slides = Object.values(manifest.slides);
const bySource = new Map();
for (const lesson of window.PHASE1_LESSONS) {
  for (const question of lesson.questions) {
    const ids = bySource.get(question.source) || [];
    ids.push(question.id);
    bySource.set(question.source, ids);
  }
}

// Các nhóm dưới đây có chuỗi text trích xuất giống hệt nhau, đã đối chiếu với PyMuPDF.
const duplicates = new Map([
  ['D04__Day03_ Từ chatbot đến agentic agent react (Mr. Dang Duc Huy)__5b6137ac5a80.pdf', 'D04__Day03_ from-chatbot-to-agentic-agent-react (Mr Dang Duc Huy)__883388449cda.pdf'],
  ['D08__huydd-day04-prompt-engineering-tool-calling.pptx (1)__f33d60b2d34d.pdf', 'D08__Day04_(Mr.Dang Duc Huy)_Prompt-Engineering-Tool-Calling__50e3ec21466e.pdf'],
  ['D08__huydd-day04-prompt-engineering-tool-calling.pptx (1) (2)__dceb0890f696.pdf', 'D08__Day04_(Mr.Dang Duc Huy)_Prompt-Engineering-Tool-Calling__50e3ec21466e.pdf'],
  ['D18__Day14 (Hoa)__3bbb863765ff.pdf', 'D18__day14-ai-evaluation-benchmarking__71e2ad0871b5.pdf'],
]);
const imageHeavy = new Set([
  'D03__b2__9c5477cbd3fe.pdf',
  'D18__Lec14-AI-Evaluation (Mr Tu)__ad510521a347.pdf',
]);
const names = new Set(slides.map(s => s.filename));
assert.equal(slides.length, 54, 'Số PDF trong manifest đã thay đổi; cần kiểm kê lại');
assert.ok([...imageHeavy].every(name=>names.has(name)), 'Danh sách PDF ít text đã lỗi thời');
for (const slide of slides) {
  assert.ok(fs.existsSync(path.join(root, 'slides/k4p1', slide.filename)), `Thiếu PDF: ${slide.filename}`);
  const source = duplicates.get(slide.filename) || slide.filename;
  assert.ok(names.has(source), `Nguồn trùng không tồn tại: ${source}`);
  assert.ok(bySource.has(source), `PDF chưa có câu hỏi đối chiếu: ${slide.filename}`);
}
assert.ok([...bySource.keys()].every(name => names.has(name)), 'Có câu hỏi trỏ tới nguồn ngoài manifest');

const md = [
  '# Đối chiếu nguồn Phase 1',
  '',
  `Kiểm kê ${slides.length} PDF trong \`slides/k4p1/.slides.json\`; ${slides.length - duplicates.size} bộ text khác nhau sau khi loại ${duplicates.size} bản lặp text. ${window.PHASE1_LESSONS.reduce((n, l) => n + l.questions.length, 0)} câu hỏi được gắn tên PDF nguồn.`,
  '',
  'Mỗi nguồn có ít nhất một câu hỏi đối chiếu trực tiếp, hoặc trùng text với nguồn đã có câu hỏi. Đây là đối chiếu theo tài liệu và chủ đề; không chứng minh mọi câu chữ, hình minh họa hoặc ví dụ trong PDF đều thành câu hỏi.',
  '',
  'Hai file có lớp text trích xuất rất ít đã được rà nhanh hình ảnh của toàn bộ trang bằng contact sheet. Việc này giúp kiểm kê chủ đề, nhưng không thay thế OCR hoặc đối chiếu từng chi tiết:',
  ...[...imageHeavy].map(name => `- \`${name}\``),
  '',
  '| Ngày | PDF | Câu đối chiếu | Trạng thái |',
  '|---|---|---:|---|',
];
for (const slide of slides) {
  const target = duplicates.get(slide.filename);
  const ids = bySource.get(slide.filename) || bySource.get(target);
  const status = target ? `Trùng text với \`${target}\`` : imageHeavy.has(slide.filename) ? 'Lớp text ít; đã rà ảnh các trang' : 'Có câu trực tiếp';
  md.push(`| ${slide.day} | \`${slide.filename.replaceAll('|', '\\|')}\` | ${ids.length} | ${status.replaceAll('|', '\\|')} |`);
}
md.push('', 'Chạy lại: `node scripts/validate-content.cjs` và `node scripts/audit-sources.cjs`.', '');
const report = path.join(root, 'phase1-quiz-site/docs/source-coverage.md');
fs.mkdirSync(path.dirname(report), {recursive:true});
fs.writeFileSync(report, md.join('\n'), 'utf8');
console.log(`OK: ${slides.length}/${slides.length} PDF có câu đối chiếu hoặc bản trùng; báo cáo ${report}`);
