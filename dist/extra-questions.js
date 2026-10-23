// Phần bổ sung sau khi đối chiếu các bản giảng viên, hướng dẫn lab và tài liệu tổng kết.
// Mỗi câu chọn nhiều đáp án được chấm theo tập đáp án chính xác (không cộng điểm chọn một phần).
(() => {
  const M=(topic,prompt,options,answers,why,source)=>({type:'multi',topic,prompt,options,answers,why,source});
  const additions={
    1:[
      M('Agent','Khi nào hệ thống nên dùng agent thay vì một lượt gọi model?',['Nhiệm vụ cần nhiều bước phụ thuộc kết quả trung gian.','Hệ thống cần quyết định tool tiếp theo dựa trên observation.','Luồng có điều kiện và cần kiểm soát quyền/điểm dừng.','Mọi câu hỏi ngắn đều cần agent.'],[0,1,2],'Agent có ích khi phải điều phối các bước động; chi phí và rủi ro cần được kiểm soát.','D01__day01-slide-v2-blue__3f2b431817f9.pdf'),
      M('AI taxonomy','Những phát biểu nào phân biệt đúng các dạng AI?',[
        'Discriminative AI thường dự đoán nhãn hoặc giá trị.','Generative AI tạo nội dung mới theo ngữ cảnh.','Mọi ứng dụng AI đều phải là agent.','LLM chỉ có thể xử lý số, không xử lý text.'
      ],[0,1],'Phân loại và sinh nội dung là hai nhóm nhiệm vụ khác nhau; agent là kiến trúc hệ thống, không phải điều kiện của mọi AI.','D01__day01-slide-v2-blue__3f2b431817f9.pdf'),
      M('Transformer','Những thành phần nào góp phần tạo biểu diễn ngữ cảnh trong Transformer?',[
        'Token embedding.','Thông tin vị trí.','Self-attention.','API gateway.'
      ],[0,1,2],'Ba thành phần đầu thuộc đường xử lý model; API gateway nằm ngoài model.','D01__Day01-C401-Thầy-Đức__3ae34c889051.pdf'),
      M('Token & context','Những phần nào có thể tiêu thụ context window trong một lượt gọi?',[
        'System instruction và lịch sử chat.','Retrieved documents.','Output tokens.','Số user đang online ở hệ thống khác.'
      ],[0,1,2],'Ngữ cảnh cho một lượt gồm cả input và ngân sách output, tùy contract model.','D01__day01-llm-foundation-1__acc86b86e1e1.pdf'),
      M('Training & giới hạn','Khi đánh giá một LLM mới cho ứng dụng, những kiểm tra nào cần thiết?',[
        'Chạy tập case đại diện cho use case.','Đo latency, token và chi phí.','Kiểm tra lỗi hallucination/thiếu dữ liệu.','Chọn theo điểm benchmark công khai duy nhất.'
      ],[0,1,2],'Benchmark công khai chỉ là tín hiệu ban đầu; cần eval nội bộ.','D01__day01-slide-v2-blue__3f2b431817f9.pdf'),
      M('API & chi phí','Một API wrapper production nên xử lý những việc nào?',[
        'Timeout và lỗi provider có phân loại.','Không ghi API key vào log.','Đọc usage để theo dõi chi phí.','Retry vô hạn mọi yêu cầu.'
      ],[0,1,2],'Retry phải có giới hạn và xét tính idempotent.','D01__material_mrxpq9zu_t8e6xs__f7fa87c56848.pdf'),
      M('Vibe coding','Khi dùng AI viết code, người phát triển vẫn phải làm những việc nào?',[
        'Chạy test và kiểm tra hành vi.','Review tác động bảo mật/dữ liệu.','Xác nhận code đáp ứng yêu cầu thật.','Tin kết quả nếu AI nói đã kiểm tra.'
      ],[0,1,2],'Lời tự báo cáo của AI không phải bằng chứng test.','D01__Day01-C401-Thầy-Đức__3ae34c889051.pdf'),
    ],
    2:[
      M('Metric & gate','Một tiêu chí thành công dùng được trong quyết định go/no-go cần có gì?',['Chỉ số đo được.','Ngưỡng và khoảng thời gian đánh giá.','Hành động sẽ làm nếu không đạt.','Lời hứa “AI trả lời hữu ích” không cần định nghĩa.'],[0,1,2],'Gate có nghĩa khi nhóm biết đo gì, khi nào đo và quyết định theo kết quả.','D03__k4-d2-slide-blue (2)__ebc4d40fed08.pdf'),
      M('Problem statement','Bộ hồ sơ scoping trước khi xây AI nên mô tả gì?',['Actor và workflow hiện tại.','Bottleneck cùng baseline.','Stakeholder/owner và thí nghiệm kế tiếp.','Tên framework agent chọn trước khi biết vấn đề.'],[0,1,2],'Scoping nối vấn đề kinh doanh với bằng chứng và người chịu trách nhiệm.','D03__Day 02_C401_Xác Định Bài Toán Kinh Doanh Cho AI__676a781f8dff.pdf'),
      M('Discovery','Discovery theo hướng Double Diamond/HCD cần làm những bước nào?',[
        'Quan sát workflow hiện tại và người dùng.','Tách problem khỏi giải pháp stakeholder gợi ý.','Hội tụ thành problem statement kiểm chứng được.','Khóa model ngay trước khi phỏng vấn.'
      ],[0,1,2],'Đi từ khám phá rộng tới xác định vấn đề trước lựa chọn giải pháp.','D03__Slide - GV Mai Anh__7d6a23b897d0.pdf'),
      M('Discovery','Trong phỏng vấn kiểu Mom Test, câu hỏi nào cho bằng chứng tốt hơn?',[
        '“Lần gần nhất anh/chị xử lý việc đó ra sao?”','“Hiện bước nào mất nhiều thời gian nhất?”','“Anh/chị chắc sẽ mua chatbot của em chứ?”','“Ý tưởng agent của em tuyệt không?”'
      ],[0,1],'Hỏi hành vi và khó khăn đã xảy ra, tránh dẫn dắt lời khen hoặc ý định giả định.','D03__Slide - GV Mai Anh__7d6a23b897d0.pdf'),
      M('Mức giải pháp','Khi chọn automate hay augment, những yếu tố nào quan trọng?',[
        'Khả năng khôi phục nếu AI sai.','Mức độ rủi ro của hành động.','Nhu cầu người dùng giữ quyền kiểm soát.','Số lượt thích của demo.'
      ],[0,1,2],'Mức tự động hóa phải phù hợp tác động sai và kỳ vọng người dùng.','D03__Slide - GV Mai Anh__7d6a23b897d0.pdf'),
      M('Problem statement','Một problem statement đủ tốt cho lab scoping nên làm rõ gì?',[
        'Actor và workflow.','Baseline và outcome mong muốn.','Dữ liệu khả dụng, giới hạn và rủi ro.','Tên framework frontend bắt buộc.'
      ],[0,1,2],'Các phần này cho phép đánh giá feasibility và thiết kế eval.','D03__Day 02_C401_AI Product Lab__0a18284a62ac.pdf'),
      M('Metric & gate','Một quyết định “Not Yet” thay vì Go/No-Go có lý khi nào?',[
        'Chưa có baseline đáng tin.','Chưa có dữ liệu hợp pháp hoặc đủ chất lượng.','Rủi ro cao chưa có owner/mitigation.','Demo có hiệu ứng đẹp.'
      ],[0,1,2],'Not Yet là quyết định chờ điều kiện có thể bổ sung, không phải thất bại.','D03__4-day02-lecture-slides-v2__cfc7322d34ff.pdf'),
      M('AI fit','Đối với yêu cầu “làm chatbot”, những bài toán tiềm ẩn nào cần tách riêng?',[
        'FAQ tự phục vụ.','Định tuyến ticket.','Phân tích sentiment hoặc nhu cầu.','Tự động chuyển tiền không cần quyền.'
      ],[0,1,2],'Một UI chat có thể che nhiều bài toán và mức tự động hóa khác nhau.','D03__b2__9c5477cbd3fe.pdf'),
    ],
    3:[
      M('Agentic fit','Những tín hiệu nào ủng hộ dùng agent thay vì chatbot một lượt?',[
        'Nhiều bước phụ thuộc kết quả trung gian.','Cần chọn tool theo observation mới.','Chỉ cần định dạng JSON từ một câu hỏi.','Mọi bước đều có rule cố định.'
      ],[0,1],'Agent có lợi khi đường đi cần điều chỉnh theo môi trường.','D04__Day03_ from-chatbot-to-agentic-agent-react (Mr Dang Duc Huy)__883388449cda.pdf'),
      M('ReAct','ReAct trace hữu ích để kiểm tra những gì?',[
        'Tool nào được gọi và với tham số nào.','Observation nào dẫn tới bước tiếp theo.','Điểm dừng và kết quả cuối.','Trọng số bí mật bên trong model.'
      ],[0,1,2],'Trace cho biết đường đi quan sát được, không cho truy cập trọng số.','D04__day03-tu-chatbot-den-agentic-agent-react__f1615f64922d.pdf'),
      M('Agent loop','Trong function calling, những việc nào thuộc trách nhiệm của runtime ứng dụng?',[
        'Validate tool name/arguments.','Kiểm tra quyền rồi chạy tool.','Đưa observation có cấu trúc lại cho model.','Cho model tự thực thi side effect mà không qua app.'
      ],[0,1,2],'Model đề xuất tool call; runtime quyết định thực thi.','D04__Day03_ from-chatbot-to-agentic-agent-react (Mr Dang Duc Huy)__883388449cda.pdf'),
      M('Debug & so sánh','Một so sánh chatbot với agent cần đo những chiều nào?',[
        'Task success trên cùng case.','Latency và tổng chi phí.','Tool error hoặc hành động trái quyền.','Chỉ độ dài câu trả lời.'
      ],[0,1,2],'Output dài hơn không đồng nghĩa tác vụ tốt hơn.','D04__Day 03_ Chatbot vs ReAct Agent__ea21932f88ef.pdf'),
      M('Kiến trúc agent','Những trạng thái nào cần quản lý trong vòng lặp agent thực tế?',[
        'Messages và tool observations.','Step/time/cost budget.','Quyền hành động và approval state.','Màu của icon tool.'
      ],[0,1,2],'State phải hỗ trợ quyết định và chặn vòng lặp sai.','D04__Day03_ from-chatbot-to-agentic-agent-react (Mr Dang Duc Huy)__883388449cda.pdf'),
    ],
    4:[
      M('Prompt structure','Một prompt có cấu trúc rõ nên tách những phần nào?',['Nhiệm vụ và ranh giới hành vi.','Dữ liệu ngữ cảnh có đánh dấu nguồn.','Định dạng đầu ra và tiêu chí thành công.','Chỉ ghép mọi đoạn text không phân vai.'],[0,1,2],'Tách chỉ thị, dữ liệu và output contract giúp giảm nhập nhằng.','D08__Day04_(Mr.Vo Tu Duc)_Prompt-Engineering-Tool-Calling__81e07b38c595.pdf'),
      M('Prompt techniques','Những kỹ thuật nào có thể tăng độ nhất quán prompt mà không fine-tune?',[
        'Few-shot examples chọn lọc.','Output format/schema rõ.','Phân tách instruction và context.','Coi retrieved text là lệnh hệ thống.'
      ],[0,1,2],'Ví dụ, format và ranh giới ngữ cảnh giúp model; retrieved text vẫn là dữ liệu.','D08__Day04_(Mr.Nguyen Hai Truong)_Prompt-Engineering-Tool-Calling__9695cb69a518.pdf'),
      M('System & context','Context packet tốt cho một agent nên có đặc điểm nào?',[
        'Chỉ đưa dữ liệu liên quan tới bước hiện tại.','Ghi nguồn và độ mới.','Giữ các ràng buộc quan trọng khỏi bị truncate.','Nhồi toàn bộ lịch sử vào mọi lượt.'
      ],[0,1,2],'Context engineering chọn đúng dữ liệu đúng lúc, có provenance.','D08__day04-context-loop-harness-lecture (2)__d45865a3dc6b.pdf'),
      M('Tool contract','Tool description nên nêu gì?',[
        'Khi nào dùng và khi nào không dùng.','Ý nghĩa từng tham số.','Dạng kết quả và failure modes.','Một tên mơ hồ để model tự đoán.'
      ],[0,1,2],'Mô tả tool là interface cho model chọn hành động.','D08__Day04_(Mr.Vo Tu Duc)_Prompt-Engineering-Tool-Calling__81e07b38c595.pdf'),
      M('Tool execution','Hai tool có thể chạy song song an toàn nếu:',[
        'Không phụ thuộc output của nhau.','Không có xung đột side effect hoặc đã đồng bộ.','Có giới hạn tải và xử lý lỗi từng call.','Cả hai cùng sửa một record mà không transaction.'
      ],[0,1,2],'Parallel giảm latency nhưng tăng rủi ro race và rate limit.','D08__Day04_(Mr.Vo Tu Duc)_Prompt-Engineering-Tool-Calling__81e07b38c595.pdf'),
      M('Reliability & security','Loop engineering cần chốt những control nào?',[
        'Max steps, timeout và budget.','Retry/backoff theo loại lỗi.','Fallback và trace đủ debug.','Vòng lặp không giới hạn để model tự dừng.'
      ],[0,1,2],'Bounded execution và khả năng quan sát là phần của harness.','D08__day04-context-loop-harness-tool-calling__00457aab7ffb.pdf'),
      M('LangGraph','State graph với write tool nên có những nhánh nào?',[
        'Tool read khi được phép.','Pause/approval trước write nhạy cảm.','Final hoặc fallback khi vượt budget.','Write bất kỳ theo lời tool output.'
      ],[0,1,2],'Control flow tường minh giúp test quyền và dừng an toàn.','D08__Day04_(Mr.Dang Duc Huy)_Prompt-Engineering-Tool-Calling__50e3ec21466e.pdf'),
      M('Reliability & security','Một tiny eval cho tool calling cần những case nào?',[
        'Case dùng tool đúng.','Case không cần tool.','Case tham số thiếu/sai hoặc tool lỗi.','Chỉ một câu demo thành công.'
      ],[0,1,2],'Test cả đường đi, ranh giới lỗi và hành động không cần thiết.','D08__Day 04_ C401_ Mini lab_System Prompt Engineering & Tool Calling Engine__832d02f1ea65.pdf'),
    ],
    5:[
      M('Responsible AI','Yêu cầu sản phẩm AI có trách nhiệm nên bao gồm gì từ đầu?',['Quyền riêng tư và quyền truy cập dữ liệu.','Cách báo lỗi và chuyển người xử lý.','Kiểm thử sai lệch và nhóm dễ bị ảnh hưởng.','Đợi đến khi production mới định nghĩa rủi ro.'],[0,1,2],'Rủi ro cần thành acceptance criteria và cơ chế sản phẩm, không chỉ lời hứa.','D09__Day05-(Ms.Hoa)-AI-Product-Thinking-Requirements__4c08dffd18be.pdf'),
      M('Requirements','Acceptance criteria cho tính năng AI nên thể hiện gì?',['Trigger hoặc input rõ.','Hành vi mong đợi và ngưỡng đo.','Cách xử lý khi thiếu dữ liệu hoặc AI sai.','Chỉ yêu cầu dùng model đời mới nhất.'],[0,1,2],'Yêu cầu AI cần kiểm thử được cả đường thành công và thất bại.','D09__Day05-(Ms.Hoa)-AI-Product-Thinking-Requirements__4c08dffd18be.pdf'),
      M('Product value','AI product có những đặc điểm nào khiến PRD khác phần mềm xác định?',[
        'Đầu ra biến thiên và có sai số.','Cần thiết kế trust/control/feedback.','Phải nêu failure modes và ngưỡng chất lượng.','Mọi user story đều không kiểm thử được.'
      ],[0,1,2],'PRD cho AI phải đặc tả cả hành vi khi sai.','D09__Day05 - AI Product Management (Ms. Mai Anh)__86872bdfb690.pdf'),
      M('User research','Human-centered AI design cần tìm hiểu gì từ người dùng?',[
        'Khi nào họ muốn tự quyết.','Họ nhận biết AI sai bằng tín hiệu nào.','Mức độ chấp nhận lỗi theo tác vụ.','Họ thích benchmark nào nhất.'
      ],[0,1,2],'Trust và control là yêu cầu thiết kế, không suy ra từ điểm model.','D09__Day05-(Ms. Mai Anh)-AI Product Thinking & Requirements__df5dc5a6d47c.pdf'),
      M('Requirements','Một failure map cho AI feature nên bao gồm gì?',[
        'Thiếu bằng chứng.','Đầu ra sai định dạng hoặc nội dung.','Tool timeout và fallback.','Chỉ happy path.'
      ],[0,1,2],'Thiết kế UX cho thất bại là một phần của scope sản phẩm.','D09__Day05 - AI Product Management (Ms. Mai Anh)__86872bdfb690.pdf'),
      M('PRD & metrics','Evals flow của AI product nên liên kết những tầng nào?',[
        'User task và business outcome.','Acceptance criteria của feature.','Model/system metrics.','Chỉ điểm leaderboard.'
      ],[0,1,2],'Metric kỹ thuật cần có đường liên hệ tới tác vụ người dùng.','D09__Day05-(Ms. Mai Anh)-AI Product Thinking & Requirements__df5dc5a6d47c.pdf'),
      M('Risk','Prototype rẻ để thử giá trị nên có ranh giới nào?',[
        'Nói rõ phần người làm thủ công.','Chỉ dùng dữ liệu/đối tượng được phép.','Đo giả định trước khi đầu tư.','Tuyên bố nó đã production-ready.'
      ],[0,1,2],'Prototype học nhanh nhưng không tự chứng minh khả năng vận hành.','D09__Day05-AI-Product-Thinking-Requirements__55e6046c95ec.pdf'),
    ],
    6:[
      M('Agile & DoD','Một AI sprint theo phương pháp thí nghiệm cần gì?',[
        'Giả thuyết có thể bác bỏ.','Bộ eval hoặc cách đo kết quả.','Quyết định tiếp tục/dừng sau thời hạn.','Chỉ đo số task đã đóng.'
      ],[0,1,2],'Số ticket đóng không chứng minh chất lượng AI.','D10__day06-ai-product-project-management__284e5621b83f.pdf'),
      M('MVE, MVP, PoC','Những phát biểu nào đúng về MVE, PoC và MVP?',[
        'MVE kiểm giả định giá trị.','PoC kiểm một giả định khả thi.','MVP là bản sản phẩm tối thiểu đủ học từ người dùng thật.','Ba loại đều chứng minh production readiness.'
      ],[0,1,2],'Mỗi loại thử nghiệm trả một câu hỏi khác nhau.','D10__day06-ai-product-project-management__284e5621b83f.pdf'),
      M('Experiment','Một PoC Canvas nên ghi gì?',[
        'Hypothesis và scope.','Success/failure criterion.','Budget và thời hạn.','Chỉ danh sách package.'
      ],[0,1,2],'Canvas giúp thử nghiệm có kỷ luật và quyết định rõ.','D10__day06-ai-product-project-management__284e5621b83f.pdf'),
      M('ROI','Các biến nào ảnh hưởng mạnh tới ROI agent hỗ trợ khách hàng?',[
        'Adoption thực tế.','Thời gian tiết kiệm đã kiểm chứng.','Cost token, review và vận hành.','Tên model nghe cao cấp.'
      ],[0,1,2],'ROI cần dựa trên lượng dùng, giá trị và tổng chi phí.','D10__day06-ai-product-project-management__284e5621b83f.pdf'),
      M('Stakeholder','Pitch với sponsor nên nêu rõ gì?',[
        'Problem và baseline.','Kết quả thử nghiệm và bất định.','Khoản đầu tư cùng rủi ro/decision gate.','Toàn bộ mã nguồn trong slide.'
      ],[0,1,2],'Sponsor cần thông tin để ra quyết định, không cần mọi chi tiết implementation.','D10__day06-ai-product-project-management__284e5621b83f.pdf'),
    ],
    7:[
      M('Data strategy','Data inventory cho agent cần phân biệt những gì?',[
        'Knowledge documents.','Operational records thay đổi nhanh.','Context/user memory có consent và retention.','Mọi dữ liệu đều nên embed giống nhau.'
      ],[0,1,2],'Loại dữ liệu quyết định nơi lưu, độ tươi và quyền truy cập.','D11__Day 7 - Data Foundations__600fddd86dda.pdf'),
      M('Parsing','Những dữ liệu nào dễ mất quan hệ khi bóc tách tài liệu?',[
        'Bảng nhiều cột.','Tiêu đề, chú thích và số trang.','Sheet Excel nhiều bảng trên một sheet.','Một dòng văn bản thuần duy nhất.'
      ],[0,1,2],'Parse cần giữ cấu trúc có ý nghĩa cho retrieval.','D11__day07-data-foundations-embedding-vector-store__b401f95540fc.pdf'),
      M('Embedding','Khi chọn embedding model tiếng Việt, nên kiểm gì?',[
        'Chất lượng trên corpus/query tiếng Việt thực tế.','Giới hạn input và nguy cơ truncation.','Chi phí, latency, deployment và quyền dữ liệu.','Chỉ điểm một leaderboard tiếng Anh.'
      ],[0,1,2],'Model phải phù hợp use case và dữ liệu của bạn.','D11__day07-data-foundations-embedding-vector-store__b401f95540fc.pdf'),
      M('Search & ANN','Khi đánh giá ANN index, cần đo những trục nào?',[
        'Recall so với exact baseline.','Latency ở tải mục tiêu.','Bộ nhớ và chi phí build.','Chỉ số vector càng nhiều càng tốt.'
      ],[0,1,2],'ANN đánh đổi recall với tốc độ và bộ nhớ.','D11__day07-data-foundations-embedding-vector-store__b401f95540fc.pdf'),
      M('Hybrid & rerank','Những tín hiệu nào có thể kết hợp trong retrieval nhiều tầng?',[
        'BM25/keyword cho mã và từ chính xác.','Dense vector cho paraphrase.','Metadata/ACL filter cho phạm vi hợp lệ.','Số lần tài liệu được click bất kể quyền.'
      ],[0,1,2],'Hybrid chỉ hữu ích khi luôn giữ ranh giới quyền truy cập.','D11__day07-data-foundations-embedding-vector-store__b401f95540fc.pdf'),
      M('Evaluation & security','Các lỗi retrieval nào có thể xảy ra mà không throw exception?',[
        'Index cũ.','Chunk mất tiêu đề hoặc bảng.','Filter đặt sai làm giảm recall.','SyntaxError khi import module.'
      ],[0,1,2],'Silent failures cần eval và data observability.','D11__day07-data-foundations-embedding-vector-store__b401f95540fc.pdf'),
      M('Evaluation & security','Khi lưu vector từ dữ liệu nhạy cảm, cần những kiểm soát nào?',[
        'ACL trước retrieval.','PII masking/retention thích hợp.','Xóa/cập nhật vector theo vòng đời nguồn.','Coi vector tự động là dữ liệu đã ẩn danh.'
      ],[0,1,2],'Vector có thể rò hoặc suy ra thông tin nguồn.','D11__day07-data-foundations-embedding-vector-store__b401f95540fc.pdf'),
    ],
    8:[
      M('RAG architecture','Một RAG answer có thể sai ở những lớp nào?',[
        'Indexing nguồn sai/cũ.','Retrieval bỏ sót bằng chứng.','Generation không bám context.','Chỉ CSS trang web.'
      ],[0,1,2],'Debug RAG theo pipeline thay vì luôn sửa model.','D12__1-Day 08 Lecture Slides_Detailed version__255feb74269e.pdf'),
      M('Ingestion & chunking','Pre-retrieval cần cân nhắc những thao tác nào?',[
        'Chuẩn hóa query.','Tách câu hỏi đa ý.','Lọc theo thời gian/phiên bản/quyền.','Bỏ mọi thông tin điều kiện của user.'
      ],[0,1,2],'Biến đổi truy vấn phải giữ intent và boundary.','D12__Day08-rag-pipeline-v4 (Thầy Tú - C401)__324457801cb5.pdf'),
      M('Retrieval & rerank','Một pipeline hybrid hợp lý có thể gồm:',[
        'Dense retrieval.','Sparse/BM25 retrieval.','RRF hoặc fusion có kiểm chứng.','Tin kết quả top-1 đầu tiên trong mọi case.'
      ],[0,1,2],'Kết hợp ứng viên rồi rerank/đo trên bộ case đại diện.','D12__1-Day 08 Lecture Slides_Detailed version__255feb74269e.pdf'),
      M('Grounding & UX','Augmentation trước generation nên làm gì?',[
        'Đóng gói đoạn nguồn có metadata/citation.','Giữ thứ tự và giới hạn context có chủ đích.','Phân biệt nguồn với chỉ dẫn hệ thống.','Bỏ version tài liệu để tiết kiệm token.'
      ],[0,1,2],'Context packet phải đáng tin và truy vết được.','D12__Day08-rag-pipeline-v4 (Thầy Tú - C401)__324457801cb5.pdf'),
      M('RAG evaluation','Một scorecard RAG nên có những metric nào?',[
        'Context recall/precision.','Faithfulness và answer relevance.','Latency và cost.','Chỉ độ trôi chảy do model tự nhận.'
      ],[0,1,2],'Chất lượng RAG gồm retrieval, answer và vận hành.','D12__1-Day 08 Lecture Slides_Detailed version__255feb74269e.pdf'),
      M('RAG architecture','Agentic RAG chỉ có giá trị khi nào?',[
        'Cần chọn nguồn/tool động theo câu hỏi.','Có vòng lặp kiểm chứng truy xuất rõ.','Eval chứng minh hơn workflow RAG cố định.','Mọi câu hỏi đều phải có agent.'
      ],[0,1,2],'Thêm agent tăng cost và đường lỗi nên cần lý do đo được.','D12__Day08-rag-pipeline-v4 (Thầy Tú - C401)__324457801cb5.pdf'),
    ],
    9:[
      M('LangGraph','Khi triển khai agent có state bằng graph, thành phần nào cần định nghĩa rõ?',['State schema.','Node thực thi và điều kiện chuyển cạnh.','Điểm dừng, retry/checkpoint theo use case.','Cho phép graph chạy vô hạn.'],[0,1,2],'Graph giúp luồng điều khiển kiểm soát được, nhưng cần giới hạn và state rõ.','D13__day09-multi-agent-mcp-a2a (2)__c71522c8c470.pdf'),
      M('Agent fit & patterns','Những pattern multi-agent nào xuất hiện trong thiết kế hệ thống?',[
        'Supervisor-worker.','Pipeline/handoff chuyên trách.','Debate hoặc evaluator-worker khi có tiêu chí rõ.','Mỗi agent toàn quyền trên mọi tool.'
      ],[0,1,2],'Pattern là cách chia trách nhiệm, không phải lý do nới quyền.','D13__day09-multi-agent-mcp-a2a (2)__c71522c8c470.pdf'),
      M('Coordination','Một handoff giữa agents cần những thông tin nào?',[
        'Mục tiêu và input.','Output contract và deadline.','Quyền/tool được phép.','Chỉ một lời nhắn “làm tiếp đi”.'
      ],[0,1,2],'Contract rõ giúp phối hợp và truy trách nhiệm.','D13__day09-multi-agent-mcp-a2a (Ms Hoa)__38ba75153afb.pdf'),
      M('MCP','MCP resource và tool khác nhau ở đâu?',[
        'Resource cung cấp ngữ cảnh/dữ liệu đọc được.','Tool có thể thực hiện thao tác.','Cả hai vẫn cần quyền và validation.','Resource luôn được phép ghi dữ liệu.'
      ],[0,1,2],'MCP chuẩn hóa hai bề mặt nhưng không tự cấp quyền.','D13__day09-multi-agent-mcp-a2a__5dbcc3bdce60.pdf'),
      M('A2A','A2A handoff nên được quan sát bằng gì?',[
        'Task ID/trạng thái.','Trace liên kết agent gọi và agent nhận.','Deadline/cancel/error contract.','Chỉ final answer không có dấu vết.'
      ],[0,1,2],'Giao tiếp agent-agent có thể lỗi hoặc chậm như mọi hệ phân tán.','D13__day09-multi-agent-mcp-a2a (2)__c71522c8c470.pdf'),
      M('Observability & safety','Multi-agent làm tăng những rủi ro nào?',[
        'Chi phí nhiều call.','Latency và lỗi handoff.','Lan truyền nội dung không đáng tin qua agents.','Mặc định giảm mọi lỗi.'
      ],[0,1,2],'Cần đo và giới hạn quyền/chi phí theo từng worker.','D13__day09-multi-agent-mcp-a2a (2)__c71522c8c470.pdf'),
      M('Harness & long tasks','Một tác vụ dài cần những cơ chế nào?',[
        'Checkpoint state và tiến độ.','Kế hoạch có thể cập nhật.','Kiểm chứng theo mốc và budget.','Chỉ dựa vào context window vô hạn.'
      ],[0,1,2],'Harness giữ tiến độ và ngăn drift qua nhiều lượt.','D13__day09-multi-agent-mcp-a2a (2)__c71522c8c470.pdf'),
    ],
    10:[
      M('ETL/ELT & ingestion','Nguồn ingestion cho agent có thể gồm gì?',[
        'Tài liệu tĩnh.','Database với CDC.','Event hoặc stream.','Chỉ prompt của model.'
      ],[0,1,2],'Data pipeline cần phân biệt nguồn tĩnh, record động và event.','D14__day10-data-pipeline-observability (2)__24c43a2f3cfc.pdf'),
      M('Transform & storage','Khi transform corpus trước indexing, những bước nào có thể cần?',[
        'Chuẩn hóa Unicode.','Dedupe và version.','PII masking.','Bỏ metadata nguồn.'
      ],[0,1,2],'Metadata nguồn quan trọng cho citation, quyền và freshness.','D14__day10-data-pipeline-observability (2)__24c43a2f3cfc.pdf'),
      M('Quality & contracts','Một data quality gate cho RAG nên kiểm những gì?',[
        'Schema/required fields.','Freshness và version hiệu lực.','ACL và PII.','Chỉ HTTP 200 của pipeline.'
      ],[0,1,2],'Pipeline có thể thành công kỹ thuật nhưng dữ liệu phục vụ sai.','D14__day10-data-pipeline-observability (2)__24c43a2f3cfc.pdf'),
      M('Data observability','Silent failure trong corpus có thể phát hiện bằng tín hiệu nào?',[
        'Freshness lag.','Volume/missing document.','Distribution drift hoặc failed quality checks.','Chỉ số request frontend.'
      ],[0,1,2],'Quan sát dữ liệu khác quan sát uptime ứng dụng.','D14__day10-data-pipeline-observability (2)__24c43a2f3cfc.pdf'),
      M('Lineage & incident','Runbook data incident nên gồm bước nào?',[
        'Detect và xác định blast radius.','Mitigate an toàn trước khi sửa triệt để.','Replay/verify và postmortem.','Xóa log để giảm nhiễu.'
      ],[0,1,2],'Dữ liệu lỗi cần xử lý có bằng chứng và đường phục hồi.','D14__day10-data-pipeline-observability (2)__24c43a2f3cfc.pdf'),
      M('Orchestration & cost','Backfill và retry ingestion an toàn cần gì?',[
        'Idempotency hoặc dedupe.','Giới hạn tải và chi phí.','Watermark/checkpoint.','Retry vô hạn mọi write.'
      ],[0,1,2],'Chạy lại dữ liệu lịch sử có thể nhân bản record và cost.','D14__day10-data-pipeline-observability (2)__24c43a2f3cfc.pdf'),
    ],
    11:[
      M('Risk & alignment','Khi lập risk register cho ứng dụng AI, nên ghi những gì?',['Failure mode và tác động.','Khả năng xảy ra cùng mức nghiêm trọng.','Owner và biện pháp giảm thiểu.','Chỉ tên model đang dùng.'],[0,1,2],'Risk register cần giúp đội ngũ quyết định ưu tiên và xử lý rủi ro.','D15__day11-guardrails-ai-safety__0158467851cd.pdf'),
      M('Attack vectors','Những tình huống nào là prompt injection từ dữ liệu không đáng tin?',['Trang web được retrieval yêu cầu bỏ qua system instruction.','Email được đọc bằng tool yêu cầu gửi dữ liệu sang URL lạ.','Người dùng hỏi thời tiết bình thường.','Tài liệu đính kèm giả làm developer message.'],[0,1,3],'Nội dung truy xuất/đính kèm không được nâng thành chỉ thị có thẩm quyền.','D15__day11-guardrails-ai-safety (Mr Truong)__ed8c18a12341.pdf'),
      M('Guardrail layers','Những lớp nào có thể phối hợp để giảm đầu ra nguy hiểm?',['Kiểm tra input và quyền truy cập.','Ràng buộc tool/action trước khi thực thi.','Kiểm tra output và giám sát sau triển khai.','Một prompt duy nhất bảo đảm an toàn tuyệt đối.'],[0,1,2],'Guardrail cần nhiều lớp vì một lớp có thể bị vượt qua hoặc lỗi.','D15__day11-guardrails-ai-safety__0158467851cd.pdf'),
      M('Tool safety','Agent dùng tool ghi dữ liệu nên có biện pháp nào?',['Allowlist quyền và tham số.','Xác nhận với hành động khó đảo ngược.','Audit log và giới hạn phạm vi.','Cho model tự cấp thêm quyền khi cần.'],[0,1,2],'Tool có tác động thật phải bị giới hạn ở lớp thực thi, không chỉ ở prompt.','D15__day11-guardrails-ai-safety (Mr Truong)__ed8c18a12341.pdf'),
      M('Red teaming','Một đợt red team có ích cần gồm những gì?',['Tập case tấn công đa dạng.','Tiêu chí pass/fail quan sát được.','Ghi lại trace để phân tích lỗi.','Chỉ thử một câu đã biết sẽ thành công.'],[0,1,2],'Cần tìm failure mode mới và tái kiểm sau khi sửa.','D15__day11-guardrails-ai-safety__0158467851cd.pdf'),
      M('HITL & escalation','Khi nào nên chuyển cho con người xử lý?',['Confidence thấp với tác động cao.','Yêu cầu vượt quyền hoặc liên quan dữ liệu nhạy cảm.','Hành động không thể hoàn tác.','Mọi câu trả lời có ít hơn 100 token.'],[0,1,2],'Ngưỡng chuyển xử lý dựa trên rủi ro, không dựa vào độ dài đơn thuần.','D15__day11-guardrails-ai-safety (Mr Truong)__ed8c18a12341.pdf'),
      M('Responsible AI','Triển khai AI có trách nhiệm cần kiểm tra gì?',['Quyền riêng tư và consent.','Sai lệch giữa các nhóm người dùng.','Cách khiếu nại hoặc sửa kết quả.','Chỉ điểm benchmark trung bình.'],[0,1,2],'Hiệu năng trung bình không phản ánh mọi tác động với người dùng.','D15__day11-guardrails-ai-safety__0158467851cd.pdf'),
    ],
    12:[
      M('Production gap','Vì sao một notebook chạy được chưa đủ để deploy agent?',['Thiếu xử lý lỗi và retry có giới hạn.','Thiếu quản lý secret, quyền và cấu hình.','Thiếu quan sát, kiểm thử và rollback.','Vì notebook luôn dùng model khác production.'],[0,1,2],'Production đòi hỏi vận hành có kiểm soát ngoài happy path.','D16__day12-deployment-dua-agent-len-cloud__06033ee93de0.pdf'),
      M('Docker & config','Cách đóng gói và cấu hình nào hợp lý?',['Pin dependency và build reproducible.','Đọc secret từ môi trường hoặc secret manager.','Tách config theo môi trường.','Bake API key vào image để tiện chạy.'],[0,1,2],'Image nên tái lập được và không chứa secret.','D16__batch02-day12-cloud-services-and-deployment 16.31.52__cf46ea5acb84.pdf'),
      M('Stateful agent','Khi nhiều instance xử lý agent có state, cần chú ý gì?',['Lưu state ở store dùng chung khi cần.','Idempotency cho request/side effect lặp.','Kiểm soát phiên và quyền truy cập state.','Dựa hoàn toàn vào biến global trong một process.'],[0,1,2],'Scale ngang làm mất giả định một process giữ mọi state.','D16__Part 3__0a1d03fe54ef.pdf'),
      M('Hosting & MCP','Khi đưa MCP/tool server lên cloud, cần kiểm tra gì?',['Transport và timeout phù hợp.','Authentication và quyền theo tool.','Giới hạn tài nguyên và quan sát lỗi.','Công khai mọi tool cho mọi user để dễ tích hợp.'],[0,1,2],'Tool server là bề mặt thực thi nên cần ranh giới tin cậy rõ.','D16__Part 9__754ffd8400dc.pdf'),
      M('Security & scale','Những biện pháp nào giúp API agent an toàn và ổn định?',['Rate limit và quota.','Timeout/circuit breaker phù hợp.','Input validation và least privilege.','Retry vô hạn khi provider lỗi.'],[0,1,2],'Bảo vệ tài nguyên và quyền cần nằm ở hệ thống chạy thật.','D16__day12-deployment-dua-agent-len-cloud__06033ee93de0.pdf'),
      M('CI/CD & model serving','Một pipeline phát hành agent nên kiểm gì trước khi nhận traffic?',['Test, eval regression và kiểm tra policy.','Health check cùng smoke test.','Kế hoạch rollback/canary.','Chỉ build image thành công.'],[0,1,2],'Build thành công chưa xác nhận chất lượng AI và khả năng vận hành.','D16__batch02-day12-cloud-services-and-deployment 16.31.52__cf46ea5acb84.pdf'),
    ],
    13:[
      M('Pillars','Ba loại tín hiệu observability nào cần kết hợp?',['Logs sự kiện.','Metrics tổng hợp.','Traces xuyên bước xử lý.','Chỉ ảnh chụp màn hình dashboard.'],[0,1,2],'Ba tín hiệu cho biết điều gì xảy ra, mức độ và đường đi của request.','D17__day13-monitoring-logging-observability_v2__b6203bd5417e.pdf'),
      M('AI metrics','Những chỉ số nào phản ánh vận hành ứng dụng LLM?',['Latency theo bước/provider.','Token usage và cost.','Tỷ lệ lỗi, fallback và chất lượng qua eval.','Chỉ số dòng code.'],[0,1,2],'AI observability phải nối hiệu năng hệ thống với chi phí và chất lượng.','D17__day13-monitoring-logging-observability__33a5b00d1d78.pdf'),
      M('Structured logs','Một log record hữu ích và an toàn nên có gì?',['Request/trace ID.','Tên bước, mã lỗi và thời gian.','Thông tin được che hoặc giảm PII.','Toàn bộ API key để debug.'],[0,1,2],'Log cần nối được sự kiện mà không làm lộ bí mật.','D17__day13-monitoring-logging-observability (2)__55b9b8d39adb.pdf'),
      M('Tracing','Trace cho agent nhiều bước nên giúp kiểm tra gì?',['Bước nào gọi tool/model.','Thời gian và lỗi từng span.','Quan hệ parent-child giữa các bước.','Chỉ tổng thời gian ở frontend.'],[0,1,2],'Trace cho biết lỗi hoặc chậm phát sinh tại bước nào.','D17__Part 14__69326e416fb6.pdf'),
      M('Dashboard & alerts','Alert hữu ích cần dựa trên tín hiệu nào?',['SLO/error budget hoặc ngưỡng có ý nghĩa.','Spike lỗi và latency kéo dài.','Chi phí tăng bất thường.','Mỗi log INFO đều gửi pager.'],[0,1,2],'Alert phải dẫn tới hành động, tránh gây mệt mỏi vì nhiễu.','D17__day13-monitoring-logging-observability_v2__b6203bd5417e.pdf'),
      M('Feedback & privacy','Thu feedback từ người dùng cần làm gì?',['Gắn feedback với phiên/trace phù hợp.','Giảm PII và tuân thủ retention.','Phân loại lỗi để đưa vào eval set.','Lưu prompt nhạy cảm mãi mãi vì có ích.'],[0,1,2],'Feedback có ích khi truy ngược được lỗi và bảo vệ dữ liệu.','D17__day13-monitoring-logging-observability (2)__55b9b8d39adb.pdf'),
    ],
    14:[
      M('Dataset design','Khi tạo golden dataset cho eval, những điều nào giúp giảm sai lệch?',['Có expert review và thống nhất rubric.','Giữ test set riêng khỏi vòng chỉnh prompt.','Đưa edge case cùng nhóm người dùng đa dạng.','Chỉ lấy câu mà phiên bản hiện tại trả lời đúng.'],[0,1,2],'Dataset cần đại diện và tránh contamination do tối ưu trực tiếp trên test set.','D18__Lec14-AI-Evaluation (Mr Tu)__ad510521a347.pdf'),
      M('LLM-as-judge','Khi hiệu chuẩn judge nhị phân theo từng failure mode, nên đo gì?',['TPR: phát hiện lỗi thật.','TNR: không báo sai trên case đúng.','Đối chiếu với mẫu do người chấm theo cùng rubric.','Chỉ accuracy chung trên toàn bộ case.'],[0,1,2],'Accuracy chung có thể che việc judge bỏ sót loại lỗi quan trọng.','D18__Lec14-AI-Evaluation (Mr Tu)__ad510521a347.pdf'),
      M('Statistical rigor','So sánh hai phiên bản agent trên cùng eval set nên làm gì?',['Tính chênh lệch theo từng item tương ứng.','Báo cáo khoảng bất định hoặc CI theo item.','Lặp run để thấy variance rồi vẫn giữ đơn vị phân tích theo item.','Coi 5 run trên 20 item là 100 item độc lập.'],[0,1,2],'Lặp run giảm nhiễu sampling nhưng không tạo thêm 100 tình huống độc lập.','D18__Lec14-AI-Evaluation (Mr Tu)__ad510521a347.pdf'),
      M('Agent & safety eval','Với agent không được phép sai khi lặp lại, kiểm tra độ tin cậy nên xét gì?',['Tỷ lệ thành công qua nhiều run.','Khả năng lỗi ít nhất một lần khi cùng tác vụ chạy lại.','Tool trajectory và side effect.','Chỉ nhìn một lần chạy tốt nhất.'],[0,1,2],'Một lần thành công không đủ cho hệ thống cần chạy ổn định qua nhiều lần.','D18__Lec14-AI-Evaluation (Mr Tu)__ad510521a347.pdf'),
      M('Eval fundamentals','Một eval đáng tin cho ứng dụng AI cần gì?',['Mục tiêu và tiêu chí rõ.','Tập dữ liệu đại diện use case.','Baseline để so sánh thay đổi.','Một demo đẹp thay cho test.'],[0,1,2],'Eval đo hành vi mục tiêu qua case lặp được.','D18__day14-ai-evaluation-benchmarking__71e2ad0871b5.pdf'),
      M('Metrics','Những thước đo nào có thể cần cho RAG?',['Retrieval recall/relevance.','Answer faithfulness hoặc groundedness.','Latency và cost.','Chỉ BLEU cho mọi tình huống.'],[0,1,2],'RAG cần đo cả khâu lấy nguồn, câu trả lời và chi phí vận hành.','D18__Slide bài giảng (Mai Anh)__4ca22b7287fc.pdf'),
      M('Dataset design','Khi xây eval set nên bao gồm case nào?',['Case phổ biến.','Edge case và câu không có đáp án.','Tình huống rủi ro hoặc đối kháng.','Chỉ case model hiện tại làm đúng.'],[0,1,2],'Tập chỉ gồm case dễ tạo thiên lệch xác nhận.','D18__Day14 (Hoa)__3bbb863765ff.pdf'),
      M('LLM-as-judge','Khi dùng LLM-as-judge, nên kiểm soát gì?',['Rubric cụ thể.','Mẫu được người kiểm tra đối chiếu.','Tính nhất quán và thiên lệch vị trí/thứ tự.','Coi điểm judge là ground truth tuyệt đối.'],[0,1,2],'Judge cũng là model có thể sai; cần hiệu chuẩn.','D18__Lec14-AI-Evaluation (Mr Tu)__ad510521a347.pdf'),
      M('RAG eval','Nếu answer sai dù retrieved context đúng, nên kiểm gì?',['Prompt/synthesis.','Trích dẫn và grounding.','Giới hạn context và cắt ngắn.','Chỉ tăng top-k rồi kết luận.'],[0,1,2],'Phải tách lỗi retrieval khỏi lỗi sinh đáp án.','D18__day14-ai-evaluation-benchmarking__71e2ad0871b5.pdf'),
      M('Statistical rigor','Khi so sánh phiên bản A/B qua eval, nên làm gì?',['Dùng cùng tập case và rubric.','Báo cáo phân bố/lát cắt lỗi.','Xem độ bất định hoặc số case đủ lớn.','Kết luận từ một case thuận lợi.'],[0,1,2],'Khác biệt nhỏ có thể là nhiễu nếu tập eval hẹp.','D18__Slide bài giảng (Mai Anh)__4ca22b7287fc.pdf'),
      M('Agent & safety eval','Agent có tool cần được đánh giá ở những tầng nào?',['Quyết định chọn tool và tham số.','Kết quả cuối và tác động side effect.','Khả năng từ chối/escalate tình huống nguy hiểm.','Chỉ độ trôi chảy của văn bản.'],[0,1,2],'Đánh giá agent phải nhìn đường thực thi và tác động thật.','D18__Lec14-AI-Evaluation (Mr Tu)__ad510521a347.pdf'),
      M('Failure analysis','Sau khi thấy điểm tổng giảm, bước nào có ích?',['Nhóm lỗi theo failure mode.','Xem trace và case cụ thể.','Tạo regression case cho lỗi đã sửa.','Xóa case sai để điểm tăng.'],[0,1,2],'Phân tích lỗi biến điểm số thành quyết định cải tiến.','D18__Day14 (Hoa)__3bbb863765ff.pdf'),
    ],
    15:[
      M('Enterprise readiness','Để ứng dụng AI có thể đưa vào doanh nghiệp cần gì?',['Owner nghiệp vụ và quy trình vận hành.','Quyền dữ liệu, bảo mật và đánh giá rủi ro.','Chỉ số chất lượng và chi phí.','Demo hoạt động một lần là đủ.'],[0,1,2],'Triển khai thực tế cần cả sở hữu, quản trị và bằng chứng vận hành.','D19__day15-trien-khai-thuc-te-dinh-huong__fc263e4b848f.pdf'),
      M('Cost anatomy','Tổng chi phí AI có thể gồm thành phần nào?',['Input/output token và model calls.','Retrieval, storage và hạ tầng.','Đánh giá, giám sát và xử lý của con người.','Chỉ phí gọi API ban đầu.'],[0,1,2],'TCO lớn hơn giá một lượt inference.','D19__Lecture_Note_day15-trien-khai-thuc-te-dinh-huong__21f85ac9081c.pdf'),
      M('Optimization','Những cách giảm chi phí mà vẫn giữ chất lượng cần kiểm chứng là gì?',['Giảm context thừa.','Cache có chính sách freshness.','Chọn model/route theo độ khó.','Bỏ toàn bộ eval sau khi tối ưu.'],[0,1,2],'Mọi tối ưu cần đánh giá lại chất lượng và rủi ro.','D19__day15-trien-khai-thuc-te-dinh-huong__fc263e4b848f.pdf'),
      M('Scaling & reliability','Khi traffic tăng, hệ thống AI cần xem xét gì?',['Concurrency, rate limit và queue.','Timeout, retry có giới hạn và fallback.','SLO cùng quan sát cost/quality.','Tăng worker vô hạn bất kể quota provider.'],[0,1,2],'Scale bị giới hạn bởi cả hạ tầng, quota, chi phí và độ tin cậy.','D19__Lecture_Note_day15-trien-khai-thuc-te-dinh-huong__21f85ac9081c.pdf'),
      M('Skills & roadmap','Một kế hoạch học AI Engineering thực tế cần sản phẩm đầu ra nào?',['Prototype có use case rõ.','Eval set và báo cáo failure mode.','Bản deploy có monitoring cơ bản.','Chỉ danh sách công cụ đã đọc.'],[0,1,2],'Năng lực thể hiện qua vòng xây dựng, đo, sửa và vận hành.','D19__Discussion_Topic_01-chu-de-sinh-vien__49b9f06e6198.pdf'),
      M('Enterprise readiness','Khi trình bày đề xuất dự án, bằng chứng nào giúp quyết định triển khai?',['Problem statement và stakeholder.','Giả định, KPI, rủi ro cùng kế hoạch đo.','Scope, nguồn lực và người chịu trách nhiệm.','Cam kết model không bao giờ sai.'],[0,1,2],'Đề xuất cần có giả định kiểm chứng được và trách nhiệm rõ.','D19__Student_Activity_02-hoat-dong-chi-tiet-nhom__eeec79012eaf.pdf'),
      M('Skills & roadmap','Báo cáo sau hoạt động nhóm nên cho thấy điều gì?',['Tiêu chí đánh giá và kết quả thực tế.','Giới hạn, lỗi và việc cần làm tiếp.','Nguồn và minh chứng cho kết luận.','Chỉ một ảnh chụp demo.'],[0,1,2],'Báo cáo hữu ích khi người khác tái kiểm được kết luận.','D19__Report_Templates_04-phieu-diem-va-luu-y__d5b169471854.pdf'),
    ],
  };
  for (const [day, questions] of Object.entries(additions)) {
    const lesson=window.PHASE1_LESSONS.find(item=>item.day===Number(day));
    if(!lesson)throw new Error(`Thiếu bài ${day}`);
    questions.forEach((question,index)=>{
      question.id=`d${day}-m${index+1}`;
      lesson.questions.push(question);
    });
  }
  // Tránh mẫu “luôn có ba đáp án đúng”; mỗi biến thể thay một lựa chọn thành nhiễu sát ngữ cảnh.
  const twoAnswerVariants={
    'd1-m1':['Chỉ cần xuất JSON theo schema trong một lần gọi.','Tác vụ một bước có thể dùng model call thông thường; agent phù hợp với quyết định nhiều bước và tool.'],
    'd1-m7':['Chỉ review code sau khi production có lỗi.','Code do AI viết vẫn cần test và review bảo mật trước khi phát hành.'],
    'd2-m1':['Đổi ngưỡng sau khi xem kết quả để bảo đảm pass.','Chỉ số và ngưỡng cần định trước khi đo để gate có ý nghĩa.'],
    'd2-m5':['Tự động hóa hoàn toàn luôn rẻ hơn có người kiểm.','Khả năng khôi phục và rủi ro quyết định mức tự động hóa phù hợp.'],
    'd3-m2':['Suy ra chính xác mọi suy nghĩ ẩn của model từ trace.','Trace chỉ cho thấy bước và observation quan sát được, không phơi bày nội trạng model.'],
    'd3-m5':['Cho model tự cấp thêm quyền bằng text trong observation.','Messages, observations và budget thuộc state; quyền tool phải do ứng dụng kiểm soát.'],
    'd4-m1':['Đặt dữ liệu truy xuất ngang quyền với system instruction.','Prompt cần phân ranh nhiệm vụ với dữ liệu ngữ cảnh; tài liệu truy xuất không phải chỉ thị có thẩm quyền.'],
    'd4-m6':['Tự nâng max steps khi model nói sắp hoàn thành.','Loop phải có budget và retry có giới hạn; model không được tự bỏ ranh giới.'],
    'd5-m2':['Chấm bằng cảm giác “câu trả lời nghe hay”.','Acceptance criteria cần trigger và hành vi có thể đo, thay vì cảm nhận hoặc tên model.'],
    'd5-m7':['Xem số lượt demo là bằng chứng đã đạt ROI.','Prototype phải giới hạn phạm vi và dữ liệu; giá trị cần được đo bằng kết quả thực.'],
    'd6-m1':['Chỉ dựa vào lời khen sau demo để quyết định tiếp tục.','Thí nghiệm cần giả thuyết và phép đo, không lấy phản ứng tích cực làm bằng chứng duy nhất.'],
    'd6-m4':['Ước lượng tiết kiệm thời gian chỉ từ tài liệu marketing của provider.','ROI cần adoption và thời gian tiết kiệm thực đo; giả định quảng cáo chưa đủ.'],
    'd7-m2':['Biến mọi bảng thành đoạn text phẳng, không giữ hàng/cột.','Bảng và tiêu đề mang quan hệ cấu trúc cần giữ khi parse.'],
    'd7-m6':['HTTP 200 chứng minh kết quả retrieval luôn đúng.','Index cũ hoặc chunk mất ngữ cảnh có thể trả kết quả sai dù không có exception.'],
    'd8-m2':['Bắt buộc tạo mười biến thể truy vấn cho mọi câu hỏi.','Query normalization và decomposition chỉ dùng khi có ích, không áp một số biến thể cố định.'],
    'd8-m5':['Chỉ đếm số chunk được lấy, không kiểm relevance.','Scorecard cần đo retrieval và chất lượng đáp án, không chỉ số lượng chunk.'],
    'd9-m1':['Chỉ lưu state trong biến global dù graph chạy nhiều worker.','State schema và cạnh chuyển phải rõ; nhiều worker cần cơ chế state phù hợp.'],
    'd9-m6':['Cho mọi worker dùng chung token quyền cao để đơn giản handoff.','Multi-agent tăng cost và handoff failure; quyền phải giới hạn theo worker.'],
    'd10-m2':['Cắt mọi tài liệu thành chunk đúng 100 ký tự mà không xét cấu trúc.','Chuẩn hóa và dedupe hữu ích; chunking phải theo cấu trúc và mục tiêu retrieval.'],
    'd10-m5':['Retry vô hạn mà không xác định phạm vi dữ liệu lỗi.','Incident cần xác định blast radius và giảm tác động trước khi replay có kiểm soát.'],
    'd11-m1':['Chỉ ghi prompt đã dùng, bỏ qua người chịu trách nhiệm.','Risk register cần failure mode, likelihood và impact để ưu tiên xử lý.'],
    'd11-m6':['Mọi output của agent đều bắt buộc người duyệt.','HITL nên theo tác động và rủi ro; không phải mọi output đều cần duyệt.'],
    'd12-m2':['Hard-code endpoint production trong source cho mọi môi trường.','Build tái lập và secret tách khỏi image là yêu cầu vận hành cơ bản.'],
    'd12-m6':['Deploy tự động ngay cả khi eval regression thất bại.','Pipeline phải kiểm thử cả chất lượng AI và sức khỏe runtime trước khi nhận traffic.'],
    'd13-m2':['Chỉ đo latency trung bình, bỏ phân bố p95.','Cần latency theo bước và chi phí token; trung bình đơn lẻ che đuôi chậm.'],
    'd13-m6':['Thu feedback mà không gắn được với phiên hoặc trace.','Feedback hữu ích khi truy lỗi được và có giới hạn dữ liệu nhạy cảm.'],
    'd14-m2':['Chỉ hiệu chuẩn judge trên case PASS.','TPR và TNR cần cả case lỗi lẫn case đúng theo rubric.'],
    'd14-m7':['Chỉ dùng dữ liệu synthetic từ cùng model mà không review.','Eval set cần case phổ biến và edge case; dữ liệu synthetic chưa review có thể thiên lệch.'],
    'd15-m2':['Chỉ tính request thành công, bỏ retry và lỗi provider.','Token và hạ tầng là chi phí; retry và lỗi cũng tiêu tốn tài nguyên.'],
    'd15-m7':['Dùng điểm tự chấm mà không có tiêu chí hoặc minh chứng.','Báo cáo cần tiêu chí, kết quả và giới hạn để người khác kiểm chứng.'],
  };
  for(const question of window.PHASE1_LESSONS.flatMap(lesson=>lesson.questions)){
    const variant=twoAnswerVariants[question.id];
    if(variant){question.options[2]=variant[0];question.answers=[0,1];question.why=variant[1];}
  }
})();
