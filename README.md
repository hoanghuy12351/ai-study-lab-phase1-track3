# Phase 1 AI Engineering Quiz

Web luyện tập tĩnh cho 15 buổi Phase 1 trong `../slides/k4p1/`. Có 235 câu hỏi trắc nghiệm và tự luận, số câu mỗi bài khác nhau theo phạm vi slide. `dist/questions.js` là ngân hàng câu hỏi; mỗi câu gắn với một chủ đề và mỗi bài gắn với một PDF nguồn trong workspace.

## Chạy và kiểm tra

```powershell
node --check dist/questions.js
node --check dist/app.js
node scripts/validate-content.cjs
python -m http.server 4173 --directory dist
```

Mở `http://localhost:4173`. Tiến độ chỉ lưu bằng `localStorage` trên trình duyệt hiện tại. Trắc nghiệm chấm theo đáp án đã biên soạn; tự luận hiển thị gợi ý và checklist để người học tự đối chiếu, không có AI chấm tự động. Điểm tự luận không được cộng vào điểm trắc nghiệm.

## Ranh giới nội dung

Ngân hàng câu hỏi phủ các **chủ đề cốt lõi của 15 bài** theo slide; nó không kiểm tra từng ví dụ hay mọi số liệu nhỏ trên khoảng 1.500 trang slide. Các câu về giá, luật hoặc API thay đổi theo thời gian được chuyển thành nguyên lý thiết kế và yêu cầu kiểm chứng. Nội dung không thay thế việc đọc tài liệu gốc, đặc biệt với các bài về compliance và provider/runtime cụ thể.
