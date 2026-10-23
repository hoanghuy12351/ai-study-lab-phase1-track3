# AI Engineering Study Lab — Phase 1 và Track 3

## Web trên GitHub Pages

Repository: [hoanghuy12351/ai-study-lab-phase1-track3](https://github.com/hoanghuy12351/ai-study-lab-phase1-track3).

- [Phase 1](https://hoanghuy12351.github.io/ai-study-lab-phase1-track3/)
- [Track 3](https://hoanghuy12351.github.io/ai-study-lab-phase1-track3/track3.html)

Workflow `.github/workflows/pages.yml` kiểm syntax, tổng quan và luồng học trước khi xuất bản **chỉ thư mục `dist/`**. GitHub Pages dùng nguồn **GitHub Actions**; push lên `main` sẽ tự chạy lại. Không cần backend hoặc bước cài npm dependencies. Các script audit PDF yêu cầu corpus lớp học ở workspace local, nên không chạy trong CI công khai.

Mỗi trình duyệt/thiết bị lưu tiến độ riêng. Tiến độ ở địa chỉ local không tự chuyển sang địa chỉ GitHub Pages.

Web học và luyện tập cho 15 buổi Phase 1 trong `../slides/k4p1/`: **434 câu hỏi và 434 flashcard**, gồm 199 câu chọn một đáp án, 104 câu chọn nhiều đáp án và 131 câu tự luận. Trong đó có **95 tình huống xử lý mới, mỗi chủ đề một tình huống**. Số câu mỗi bài thay đổi theo lượng kiến thức.

## Track 3 — bài 16–28

Mở [Track 3 local](http://127.0.0.1:4173/track3.html), hoặc dùng thanh chuyển khóa học trên web. Ngân hàng có **498 câu và 498 flashcard cho 228 chủ đề**: 42 câu một đáp án, 228 câu nhiều đáp án và 228 tình huống tự luận có hướng dẫn. Mỗi bài có 27–58 câu, tùy nội dung. Các chế độ học bên dưới dùng được cho cả hai khóa.

Nguồn: 22 bộ tài liệu trong `../track3/`, tổng 1.388 trang; 7 PDF trong `../slides/k04-l34-p2-t3/` trùng byte với các bộ đã lập chỉ mục. Dxx trong thư mục không luôn trùng ngày giảng; web xếp theo bài thực tế 16–28. Bộ đầy đủ và bản gọn được đối chiếu cùng nhau để giữ nội dung riêng của từng bản.

[Bảng đối chiếu Track 3](docs/track3-coverage.md) và trang **Nguồn và phạm vi** trên web ghi chủ đề → câu hỏi → trang PDF. Chỉ số trang tham chiếu không chứng minh từng chi tiết/hình đã thành câu hỏi. Đã rà ảnh các trang GraphRAG nhiều sơ đồ, gồm trang 12 bị lỗi trích text; chưa rà ảnh toàn bộ 1.388 trang. Các giá trị benchmark/ngưỡng trong tài liệu được dùng theo điều kiện, không coi là quy tắc phổ quát.

`dist/track3-sources.js` chứa danh mục nguồn; `dist/track3-data.js` chứa câu, hướng dẫn, flashcard và cấu hình khóa. Track 3 dùng `track3-study-v1`; Phase 1 giữ `phase1-study-v2` và cơ chế nhập lịch sử cũ. Chuyển khóa hoặc xóa tiến độ trong một khóa không xóa tiến độ khóa kia.

Kiểm tra riêng Track 3 (từ thư mục này):

```powershell
python -X utf8 scripts/index-track3.py
node scripts/validate-track3.cjs
node scripts/audit-track3.cjs
node scripts/smoke-track3.cjs
```

Index tạo danh mục trang và checksum; validator kiểm cấu trúc, đáp án, nguồn/trang và đủ dạng câu mỗi chủ đề. Audit so checksum nguồn và tạo báo cáo truy nguồn. Smoke test chạy luồng học, lịch ôn, đề thi, deadline và cách ly dữ liệu trong VM; không thay thế review nội dung chuyên môn hoặc kiểm tra bố cục trên trình duyệt.

## Các chế độ học

- **Ngân hàng reasoning v2:** đã viết lại 390 trắc nghiệm (120 Phase 1, 270 Track 3), gồm toàn bộ 332 câu chọn nhiều, với bối cảnh và nhiễu cùng miền. Chọn nhiều có 4–5 lựa chọn, 2–4 đáp án đúng. Cả 323 chủ đề có trắc nghiệm vận dụng. Lọc **Mức tư duy → Vận dụng** để tập trung câu cần phân tích. [Phạm vi, nguyên tắc và kiểm tra](docs/question-quality-v2.md).
- **Lịch sử trước nâng cấp:** ID và định nghĩa cũ được giữ để chấm đúng lượt cũ; luyện lại dùng câu mới. Không chuyển đáp án hoặc trạng thái đã nhớ của câu cũ thành điểm cho câu mới.
- **Tổng quan kiến thức từng bài (đủ 28 bài):** từ trang chủ bấm “Tổng quan bài” hoặc chọn bài ở sidebar. Phần này gồm bản chất, mục tiêu học, luồng 5 bước bấm được kèm giải thích/đầu ra, Must know / Should know / Nice to know, ví dụ xuyên suốt, điểm dễ nhầm và câu hỏi tự giải thích có gợi ý. “Luyện ý này” mở đúng chủ đề; thẻ “Chủ đề luyện tập” giữ toàn bộ danh sách chủ đề của bài. Nội dung nằm trong `dist/lesson-overviews.js`; không tự đánh dấu đã hiểu hay cộng điểm.
- **Luyện theo chủ đề:** lọc bài, chủ đề và dạng câu. Trắc nghiệm mở giải thích ngay sau khi bấm kiểm tra; đáp án đã kiểm tra được khóa trong lượt đó.
- **Lời giải sau khi nộp:** mở đầu bằng đáp án và chữ cái khớp thứ tự đang hiển thị, sau đó là bản chất, ví dụ, điểm dễ nhầm khi có và câu ghi nhớ. Có chú giải thuật ngữ và công thức/thay số cho bài tính. [Phạm vi và nguyên tắc](docs/answer-explanations.md).
- **Hướng dẫn tự luận:** hiểu yêu cầu → khung lập luận chung → chèn khung để tự viết. Sau khi nộp câu trả lời, mở hướng trả lời tham khảo và checklist; có thể sửa lại bài khi luyện tập.
- **Flashcard:** đáp án ẩn trước khi mở. “Chưa nhớ” đưa câu vào hàng đợi; “Đã nhớ” hẹn ôn sau 1, 3, 7, 14 và 30 ngày. Có bộ lọc thẻ đến hạn.
- **Thi thử:** chọn phạm vi, số câu trắc nghiệm/tự luận và thời lượng. Rút ngẫu nhiên luân phiên chủ đề; giữ đáp án và hướng dẫn đến lúc nộp. Hết giờ tự nộp, kể cả khi vừa mở lại trang sau deadline. Đề là một mẫu của ngân hàng, không kiểm hết mọi chủ đề trong một lượt.
- **Câu cần ôn:** tổng hợp câu sai, câu bỏ trống trong đề, tự luận chưa tự xác nhận đủ ý, thẻ chưa nhớ và câu chủ động lưu. Có thể luyện lại từng câu hoặc toàn bộ danh sách đang lọc.

Chọn nhiều chỉ đúng khi chọn đủ và không chọn thừa. Tự luận **không có AI tự chấm**; checklist là tự đánh giá và không cộng vào điểm trắc nghiệm. Lượt làm cũ được giữ trong lịch sử, không tự gộp câu tình huống mới vào đề đã nộp.

## Chạy local và kiểm tra

Từ thư mục `phase1-quiz-site`:

```powershell
node --check dist/app.js
node --check dist/learning-content.js
node --check dist/learning-core.js
node scripts/validate-explanations.cjs
node scripts/validate-content.cjs
node scripts/audit-sources.cjs
node scripts/smoke-ui.cjs
node scripts/validate-overviews.cjs
node scripts/validate-question-quality.cjs
python -m http.server 4173 --directory dist --bind 127.0.0.1
```

Mở `http://127.0.0.1:4173/`. Tiến độ lưu trong `localStorage` của trình duyệt hiện tại; không đồng bộ giữa thiết bị. Đồng hồ thi dựa trên thời hạn tuyệt đối và tiếp tục tính khi tải lại trang. Đây là công cụ tự học, không phải nền tảng thi có giám sát hoặc chống gian lận.

Smoke test chạy event handlers và kiểm tra trạng thái lưu, chấm nhiều đáp án, hướng dẫn tự luận, flashcard, hàng đợi, tạo đề và hết giờ qua reload. Nó không xác nhận bố cục đã render trong trình duyệt.

## Dữ liệu và phạm vi

`dist/questions.js` và `dist/extra-questions.js` giữ ngân hàng gốc. `dist/learning-content.js` bổ sung tình huống, khung tự luận và thẻ ôn tập. `dist/learning-core.js` chứa logic chọn đề, chấm và lịch ôn; `dist/app.js` quản lý giao diện cùng trạng thái.

[Bảng đối chiếu nguồn](docs/source-coverage.md) ghi đủ 54 PDF đầu vào. Ngân hàng phủ 95 chủ đề, nhưng việc gắn câu với một PDF không chứng minh từng hình, ví dụ hoặc dữ kiện đều thành câu hỏi. Hai PDF ít text đã được rà ảnh toàn bộ trang ở mức chủ đề. Các tình huống là bài áp dụng biên soạn từ kiến thức trong slide; cách giải là gợi ý có điều kiện, không phải đáp án duy nhất cho mọi hệ thống thực tế.
