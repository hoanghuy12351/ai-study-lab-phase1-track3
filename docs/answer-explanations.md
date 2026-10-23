# Lời giải sau khi nộp câu trả lời

Áp dụng cho toàn bộ 932 câu hiện tại của Phase 1 và Track 3, cùng định nghĩa câu cũ dùng trong lịch sử.

## Trình bày

- Trắc nghiệm mở đầu bằng **Đáp án đúng: chữ cái — nội dung**. Câu chọn nhiều ghi đủ chữ cái và nội dung từng đáp án đúng.
- Chữ cái lấy từ đúng thứ tự đang hiển thị trong lượt làm; không dùng vị trí gốc trong dữ liệu. Chọn nhiều cũng có nhãn A–E, tách khỏi dấu chọn.
- Phần sau gồm bản chất kiến thức, ví dụ ứng dụng, phân biệt lựa chọn sai khi nội dung hiện có cung cấp lý do, rồi kết thúc bằng một câu ghi nhớ.
- Thuật ngữ có trong bảng chú giải được bổ sung nghĩa tiếng Việt ở lần đầu trong lời giải. Giữ định nghĩa vốn có trong nội dung bài.
- Tự luận dùng **Hướng trả lời tham khảo**, có checklist tự đối chiếu; không gán chữ cái hoặc tạo một điểm chấm AI.
- Các bài tính đang có về chi phí token, LoRA, xác suất hai lần thành công và số cuộc gọi đồng thời có công thức, thay số, kết quả, đơn vị/giả định và ý nghĩa thực tế.

Độ dài ưu tiên giải thích đủ ý, không chèn đoạn chung chỉ để đạt số từ. Không bắt buộc bốn mục cho mọi câu; câu không có phân tích nhiễu riêng có thể gộp điểm phân biệt vào bản chất. Nội dung ngắn hiện có tiếp tục được dùng khi đã đủ để giải thích ý chính.

## Nội dung và nguồn

`dist/answer-explanations.js` trình bày kiến thức từ `why`, tổng quan cùng chủ đề, tình huống/steps/verify, rubric và sample đã biên soạn trong ngân hàng. Các minh họa ứng dụng là tình huống học tập, không phải số liệu vận hành hoặc kết quả kiểm thử thực nghiệm. Không gọi dịch vụ AI, không lấy thêm dữ liệu ngoài và không tạo nguồn trích dẫn mới.

Một số lời giải định nghĩa cơ bản và bài tính được viết riêng để chỉ ra rõ chỗ sai của từng nhiễu. Các câu khác dùng lý do đã có trong ngân hàng; không tự suy diễn một lý do cho mỗi phương án nếu dữ liệu hiện có không nói rõ điều đó.

Module không sửa câu hỏi, đáp án, nguồn hoặc archive. Nếu có trường `referenceIssue` do người biên soạn ghi nhận, web hiển thị mâu thuẫn cần đối chiếu và giữ đáp án tham chiếu. Đây không phải bộ kiểm chứng tự động tính đúng chuyên môn. Answer key không hợp lệ về cấu trúc sẽ hiện thông báo chưa thể xác nhận thay vì tự chọn đáp án khác.

## Thời điểm mở

- Luyện tập: chỉ mở sau khi có câu trả lời và bấm **Kiểm tra đáp án / Đối chiếu bài tự luận**. Chọn một phương án hoặc chỉ nhập bài chưa mở lời giải.
- Thi thử: giữ lời giải đến khi nộp toàn bài hoặc hết thời gian. Xem lại kết quả tiếp tục dùng cùng thứ tự đáp án của lượt đó.
- Tự luận trước khi nộp chỉ có tình huống và khung lập luận chung. Steps, lời giải, cách kiểm chứng và checklist theo đáp án không còn mở sẵn qua gợi ý.
- Flashcard giữ cơ chế tự nhớ rồi chủ động mở mặt sau; không áp dụng bước nộp bài của quiz vào flashcard.

## Kiểm tra

```powershell
node scripts/validate-explanations.cjs
node scripts/smoke-ui.cjs
node scripts/smoke-track3.cjs
```

Validator duyệt toàn bộ câu hiện tại và archive, kiểm ví dụ/nguồn/cấu trúc, nhãn sau đảo phương án qua hai seed, không thay answer key, các phép tính minh họa, escape HTML, cảnh báo tham chiếu và không render khi chưa được phép. Smoke tests kiểm luồng thực tế qua handlers: chọn đáp án chưa mở, kiểm tra mới mở; tự luận và thi thử giữ các giới hạn tương ứng; lịch sử và dữ liệu hai khóa được bảo toàn. Các kiểm tra này không thay review chuyên môn từng lời giải.
