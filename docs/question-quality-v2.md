# Nâng chất lượng câu hỏi — reasoning v2

## Tham khảo và giới hạn

Đã đọc ba câu đang mở trong hai quiz cuối Day trên VLearn bằng Chrome: Data Pipeline & Observability và Guardrails & AI Safety. Các ví dụ cho thấy cách dùng bối cảnh, dữ kiện, quyết định/chẩn đoán và lựa chọn cùng miền kiến thức. Chỉ dùng chúng để tham khảo cách ra đề; không sao chép ngân hàng quiz VLearn, không trả lời hoặc nộp bài trên VLearn, và không tuyên bố đã rà toàn bộ quiz chính thức.

Kiến thức của các câu mới tiếp tục gắn nguồn bài giảng đã đối chiếu. Tình huống là nội dung biên soạn cho công cụ tự học.

## Phạm vi thực hiện

| Khóa | Câu được viết lại | Chọn nhiều | Chọn một |
|---|---:|---:|---:|
| Phase 1 | 120 | 104 | 16 |
| Track 3 | 270 | 228 | 42 |
| Tổng | 390 | 332 | 58 |

- Giữ tổng 932 câu, 932 flashcard và phần tự luận có hướng dẫn.
- Cả 323 chủ đề có ít nhất một trắc nghiệm vận dụng.
- Câu chọn nhiều có 4–5 lựa chọn, 2–4 đáp án đúng. Không hiển thị số đáp án cần chọn.
- Có trường hợp chẩn đoán root cause, chọn đúng tầng sửa, suy luận có điều kiện, tính toán và phân biệt loại bằng chứng.
- Phương án nhiễu dựa trên nhầm lẫn cùng miền: đổi thứ tự kiểm quyền, dùng proxy sai, nhầm scope/lifecycle hoặc suy quá mức từ một phép đo.
- Giải thích sau khi làm nêu vì sao kết luận đúng và điểm sai của cách tiếp cận khác; không tăng độ khó bằng câu chữ đánh đố.
- Các câu cơ bản còn lại giữ mức “Hiểu khái niệm”. Bộ lọc “Vận dụng” dùng được trong luyện tập, flashcard, thi thử và câu cần ôn. Đây là nhãn biên soạn theo loại tư duy, không phải độ khó đã hiệu chuẩn từ kết quả người học.

## Bảo toàn tiến độ

Câu sửa có ID mới hậu tố `-r2`. Định nghĩa câu cũ được giữ trong archive để lượt đang làm và kết quả trước nâng cấp vẫn dùng đúng nội dung/đáp án cũ. Chuyển cờ cần ôn sang câu tương ứng, không chuyển đáp án hoặc số lần nhớ sang câu mới. Luyện lại từ kết quả cũ dùng bản mới và bắt đầu câu trả lời rỗng.

Vị trí phương án được trộn theo lượt làm: giữ ổn định khi reload cùng lượt, không cố định theo mã câu qua mọi lượt.

## Kiểm tra

```powershell
node scripts/validate-question-quality.cjs
node scripts/validate-content.cjs
node scripts/validate-track3.cjs
node scripts/smoke-ui.cjs
node scripts/smoke-track3.cjs
```

Validator kiểm đủ chủ đề, ID/archive, cấu trúc, đa dạng số phương án/đáp án, và duyệt mọi tập con của câu chọn nhiều để kiểm chấm đủ/thiếu/thừa. Smoke tests kiểm bộ lọc, lịch sử cũ, luyện lại bản mới và cách ly tiến độ hai khóa.

Các kiểm tra này không chứng minh mọi nhiễu có sức phân biệt tốt với người học thật. Cần thu tỷ lệ trả lời đúng, lựa chọn nhiễu và lỗi theo nhóm sau sử dụng để hiệu chuẩn tiếp.
