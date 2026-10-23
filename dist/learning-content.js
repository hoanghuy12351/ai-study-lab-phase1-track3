// Một tình huống thực hành cho từng chủ đề. Hướng dẫn là khung tự học, không phải AI chấm bài.
(() => {
  const cases={
    1:[
      ['AI taxonomy','Đội muốn dùng chatbot sinh văn bản để phân loại spam có nhãn cố định.', ['Xác định đầu ra là nhãn phân loại','So sánh classifier hoặc rule baseline với LLM','Chọn theo chất lượng, latency và cost'],'Đo precision/recall trên tập spam đại diện.'],
      ['Agent','Trợ lý phải tra đơn hàng rồi quyết định hoàn tiền, nhưng prototype chỉ trả lời bằng text.', ['Tách bước tra cứu và hành động ghi','Thiết kế vòng gọi tool và observation','Giới hạn quyền và duyệt giao dịch rủi ro'],'Chạy case tool lỗi và hoàn tiền bị từ chối.'],
      ['Transformer','Stakeholder cho rằng attention tự tra Internet để biết tin mới.', ['Giải thích attention phối hợp token trong context','Chỉ rõ tri thức model khác nguồn bên ngoài','Thêm retrieval hoặc tool khi cần tin mới'],'Thử cùng câu hỏi trước và sau khi cấp nguồn mới.'],
      ['Token & context','Chat dài khiến tài liệu đầu cuộc trò chuyện bị bỏ qua.', ['Đo token và xem phần bị cắt','Giữ instruction quan trọng và chọn context liên quan','Tóm tắt hoặc truy xuất lại lịch sử cần thiết'],'Kiểm tra câu hỏi cần thông tin đầu phiên.'],
      ['Training & giới hạn','Model trả lời rất tự tin về chính sách vừa đổi hôm qua.', ['Đối chiếu phiên bản và ngày hiệu lực nguồn','Cấp tài liệu mới bằng retrieval','Yêu cầu dẫn nguồn hoặc từ chối khi thiếu bằng chứng'],'So đáp án với chính sách có hiệu lực.'],
      ['API & chi phí','Chi phí chatbot tăng trong khi số người dùng không đổi.', ['Phân rã request, input/output token và retry','Tìm phiên dài hoặc context lặp','Thử giảm context hoặc cache có điều kiện'],'Đo cost mỗi tác vụ thành công cùng chất lượng.'],
      ['Vibe coding','AI sửa lỗi bằng một patch lớn và nói tất cả test đã pass.', ['Đọc diff theo yêu cầu gốc','Tự chạy test quan trọng và review dữ liệu nhạy cảm','Thu hẹp patch nếu thay đổi không liên quan'],'Ghi lệnh và kết quả test thực chạy.'],
    ],
    2:[
      ['Discovery','Sếp yêu cầu làm chatbot nhưng chưa mô tả việc nào đang mất thời gian.', ['Hỏi lần gần nhất workflow gặp khó','Xác định actor, bottleneck và tần suất','Viết problem statement trước khi chọn giải pháp'],'Đối chiếu với một workflow thực và người dùng thật.'],
      ['AI fit','Form có mười trường và quy tắc phê duyệt hoàn toàn xác định.', ['Liệt kê rule và ngoại lệ','Dựng baseline xác định','Chỉ thêm AI cho phần đầu vào khó biểu diễn bằng rule'],'So lỗi, chi phí và khả năng audit với baseline.'],
      ['Mức giải pháp','Đội muốn agent tự gửi email cho khách dù AI có thể hiểu sai yêu cầu.', ['Đánh giá tác động và khả năng hoàn tác','Bắt đầu bằng bản nháp có người duyệt','Tăng quyền sau khi có bằng chứng chất lượng'],'Đo tỷ lệ sửa bản nháp và hành động sai.'],
      ['Workflow patterns','Một yêu cầu luôn đi qua dịch, tóm tắt rồi kiểm tra định dạng.', ['Dùng pipeline theo thứ tự phụ thuộc','Đặt gate đầu ra ở mỗi bước','Xử lý lỗi và dừng nếu bước trước không hợp lệ'],'Chạy case bản dịch lỗi và thiếu nội dung.'],
      ['Problem statement','PRD chỉ ghi “xây agent giúp tăng năng suất”.', ['Nêu actor và workflow hiện tại','Chỉ bottleneck cùng metric cụ thể','Đặt boundary hành động và tiêu chí thành công'],'Suy ra được test case từ problem statement.'],
      ['Metric & gate','Demo được khen nhưng đội không biết có nên đầu tư tiếp.', ['Chọn baseline và metric giá trị','Đặt ngưỡng cùng thời hạn trước khi đo','Ra Go, Not Yet hoặc No-Go theo dữ liệu'],'Lưu kết quả, giả định và quyết định có owner.'],
    ],
    3:[
      ['Ba kiểu hệ thống','Khách cần tra số dư và chuyển tiền, nhưng chatbot chỉ viết hướng dẫn.', ['Tách sinh text khỏi function calling','Cho runtime validate và thực thi tool','Chỉ dùng agent loop nếu cần quyết định nhiều bước'],'Xác nhận trạng thái giao dịch trong hệ thống thật.'],
      ['Agentic fit','Đội đề xuất agent cho việc đổi chuỗi ngày sang ISO.', ['Đánh giá độ xác định của tác vụ','Thử parser hoặc rule đơn giản','So với LLM trước khi thêm vòng lặp'],'Kiểm tra ngày không hợp lệ và định dạng lạ.'],
      ['Kiến trúc agent','Agent gọi được tool nhưng thường quên kết quả tool vừa trả.', ['Kiểm tra messages và observation','Đưa kết quả có cấu trúc vào state','Tách lỗi dữ liệu tool khỏi lỗi quyết định'],'Trace phải thấy tool result đi vào lượt model kế tiếp.'],
      ['ReAct','Agent liên tục tìm kiếm lại cùng một từ khóa dù đã có kết quả.', ['Đọc chuỗi action và observation','Kiểm tra model có nhận observation đầy đủ','Đặt điều kiện kết thúc và chống lặp'],'Chạy case có kết quả tốt ngay lần tìm đầu.'],
      ['Agent loop','Tool bị timeout làm agent chạy suốt nhiều phút.', ['Đặt timeout và max steps','Phân loại lỗi để retry có giới hạn','Fallback hoặc escalate khi hết budget'],'Đo số call và tổng thời gian trong fault injection.'],
      ['Debug & so sánh','Agent demo trả lời hay hơn chatbot nhưng tốn gấp mười lần.', ['Dùng cùng tập tác vụ cho hai hệ','Đo task success, tool errors, latency và cost','Phân tích lợi ích trên từng nhóm tác vụ'],'So cost mỗi tác vụ thành công thay vì chỉ văn phong.'],
    ],
    4:[
      ['Prompt structure','Model lẫn hướng dẫn với nội dung khách gửi trong cùng prompt.', ['Tách instruction và dữ liệu có delimiter','Nêu nhiệm vụ cùng output contract','Kiểm tra input cố tình giả làm chỉ thị'],'Chạy case nội dung chứa “bỏ qua yêu cầu trước”.'],
      ['Prompt techniques','Model xuất JSON đúng lúc có lúc không.', ['Đặt schema và ví dụ đại diện','Validate bằng code ngoài model','Retry sửa format có giới hạn'],'Test trường thiếu, enum sai và text ngoài JSON.'],
      ['System & context','Một đoạn web truy xuất yêu cầu model tiết lộ system prompt.', ['Xem web là dữ liệu không đáng tin','Giữ thứ bậc chỉ thị và giới hạn quyền','Lọc hành động ở runtime'],'Đảm bảo không có secret hoặc tool call trái quyền.'],
      ['Tool contract','Tool đặt vé thường nhận nhầm ngày và số hành khách.', ['Định nghĩa schema, required fields và đơn vị','Nêu ý nghĩa tham số trong description','Validate rồi hỏi lại khi thiếu thông tin'],'Test ngày mơ hồ, số âm và trường không biết.'],
      ['Tool execution','Agent chạy song song hai tool cùng cập nhật tồn kho.', ['Xác định phụ thuộc và side effect','Tuần tự hóa hoặc dùng transaction thích hợp','Dùng idempotency cho retry'],'Kiểm tra không bán quá tồn khi request cạnh tranh.'],
      ['Reliability & security','Tool báo lỗi tạm thời nhưng retry gây gửi email trùng.', ['Phân biệt lỗi đọc với hành động ghi','Dùng idempotency key và retry có giới hạn','Ghi audit và trả trạng thái rõ'],'Mô phỏng timeout sau khi server đã gửi email.'],
      ['LangGraph','Graph quay lại node gọi model mãi sau khi tool bị từ chối.', ['Kiểm tra state và conditional edge','Thêm nhánh lỗi, approval và final','Đặt giới hạn vòng lặp'],'Chạy case permission denied và xác nhận graph dừng.'],
    ],
    5:[
      ['Product value','User thử chatbot một lần rồi quay lại Excel.', ['Phỏng vấn workflow và lý do bỏ dùng','Đo task completion và thời gian thực','Điều chỉnh tích hợp vào công việc hiện tại'],'Theo dõi sử dụng lặp và kết quả tác vụ.'],
      ['Responsible AI','Tính năng đề xuất nhân sự có kết quả chênh giữa các nhóm.', ['Phân tích chất lượng theo nhóm phù hợp','Review dữ liệu, tiêu chí và tác động','Đặt quyền khiếu nại cùng human review'],'So tỷ lệ lỗi theo nhóm và xử lý case bất lợi.'],
      ['User research','Người dùng nói thích AI nhưng không cho nó tự gửi câu trả lời.', ['Hỏi mức tự chủ và cơ sở tin tưởng','Quan sát một lần dùng thật','Thiết kế draft, sửa và xác nhận'],'Đo tỷ lệ chấp nhận bản nháp thay vì lời khen.'],
      ['Requirements','Requirement ghi “trả lời chính xác và nhanh”.', ['Định nghĩa trigger và hành vi mong đợi','Đặt ngưỡng chất lượng, latency và phạm vi','Mô tả fallback khi không biết'],'Viết acceptance test có thể pass hoặc fail.'],
      ['PRD & metrics','AI đạt điểm benchmark cao nhưng CSAT giảm.', ['Nối AI metric với product và business KPI','Đọc feedback cùng trace tác vụ thất bại','Sửa UX hoặc workflow theo nguyên nhân'],'Đo lại task completion và CSAT theo cohort.'],
      ['Risk','Đội chỉ bàn rủi ro ngay trước ngày launch.', ['Lập risk matrix likelihood và impact','Gắn mitigation và owner cho từng rủi ro','Đặt gate rollout theo rủi ro chưa xử lý'],'Review top risks và minh chứng giảm thiểu.'],
    ],
    6:[
      ['Agile & DoD','Sprint đóng hết ticket nhưng agent vẫn thất bại trên case thật.', ['Thêm eval vào Definition of Done','Gắn task với hành vi cần đạt','Review failure cases trong sprint'],'Đo regression suite thay vì số ticket đóng.'],
      ['MVE, MVP, PoC','Đội muốn dựng cả nền tảng trước khi biết khách cần tính năng.', ['Chọn giả định rủi ro nhất','Dùng MVE hoặc PoC nhỏ để kiểm giả định','Chỉ mở rộng MVP khi có bằng chứng giá trị'],'Ghi câu hỏi thí nghiệm và quyết định sau kết quả.'],
      ['Experiment','Đổi cả model, prompt và chunk size rồi thấy điểm tăng.', ['Tách biến hoặc lập thiết kế thử nghiệm rõ','Giữ eval set và baseline cố định','Ghi phiên bản từng cấu hình'],'Chạy so sánh xác định tác động từng thay đổi.'],
      ['ROI','Sponsor tính ROI bằng toàn bộ thời gian AI tạo câu trả lời.', ['Đo thời gian người dùng thực tiết kiệm','Trừ review, lỗi và vận hành','Tính theo adoption và volume thật'],'Đối chiếu pilot với workflow trước khi có AI.'],
      ['Stakeholder','Business muốn launch ngay nhưng security chưa chấp nhận.', ['Làm rõ lợi ích và rủi ro của mỗi bên','Đề xuất pilot có scope và quyền hạn hẹp','Ghi decision gate, owner và thời hạn'],'Có quyết định và tiêu chí thoát pilot được thống nhất.'],
    ],
    7:[
      ['Data strategy','RAG trả đúng tài liệu nhưng user không được phép xem tài liệu đó.', ['Kiểm kê nguồn, owner và ACL','Gắn quyền vào metadata','Lọc quyền tại retrieval và trước trả output'],'Test hai user có quyền khác nhau cùng một câu hỏi.'],
      ['Parsing','Bảng giá sau khi extract bị lẫn tên sản phẩm và mức giá.', ['Đối chiếu PDF gốc với text đã parse','Giữ hàng, cột, tiêu đề và đơn vị','Tạo case kiểm tra quan hệ dữ liệu'],'Hỏi giá từng sản phẩm và kiểm citation đúng hàng.'],
      ['Chunking','Điều kiện ngoại lệ bị tách khỏi chính sách chính.', ['Giữ ranh giới ngữ nghĩa và heading','Thử overlap hoặc parent-child chunk','Đo retrieval trên câu cần ngoại lệ'],'Kiểm đáp án gồm cả quy tắc và ngoại lệ.'],
      ['Embedding','Model embedding mới có dimension khác vector đang lưu.', ['Kiểm contract dimension và preprocessing','Tạo index mới và re-embed corpus','Đánh giá trước khi chuyển traffic'],'Không trộn vector hai model trong cùng index.'],
      ['Search & ANN','Search rất nhanh nhưng thường bỏ tài liệu liên quan.', ['Đo recall đối chiếu exact search','Điều chỉnh tham số ANN','So trade-off latency, memory và recall'],'Chạy query đại diện trên cùng corpus.'],
      ['Hybrid & rerank','Search vector bỏ sót mã sản phẩm chính xác.', ['Kết hợp lexical với vector search','Fusion và rerank tập candidate','Giữ metadata filter và ACL'],'Đo riêng query mã sản phẩm và query ngữ nghĩa.'],
      ['Evaluation & security','Đội chỉ đo độ gần vector để khẳng định RAG an toàn.', ['Đo retrieval bằng case có nguồn chuẩn','Test ACL, PII và nguồn độc hại','Tách quality metric với security gate'],'Có test rò dữ liệu fail thì chặn rollout.'],
    ],
    8:[
      ['RAG architecture','RAG trả sai dù endpoint không có lỗi.', ['Tách ingestion, retrieval và generation','Xem document, chunk và context thực tế','Đo từng tầng thay vì sửa prompt ngay'],'Trace chỉ ra tầng làm mất thông tin.'],
      ['Ingestion & chunking','Chính sách mới đã upload nhưng câu trả lời vẫn dùng bản cũ.', ['Kiểm version, watermark và lịch index','Xóa hoặc đánh dấu bản hết hiệu lực','Re-index và xác minh retrieval'],'Query phải trả nguồn đúng ngày hiệu lực.'],
      ['Query transform','Câu hỏi có hai ý nhưng retriever chỉ lấy nguồn cho ý đầu.', ['Tách thành subquery bảo toàn điều kiện','Retrieve cho từng ý','Gộp và kiểm đủ nguồn trước trả lời'],'Đáp án phải trả đủ hai ý với nguồn tương ứng.'],
      ['Retrieval & rerank','Top-k chứa nhiều đoạn gần giống và thiếu đoạn quan trọng.', ['Xem relevance cùng trùng lặp candidate','Thử hybrid, rerank hoặc diversification','Đo lại recall/precision theo query'],'Kiểm chất lượng thay vì chỉ tăng top-k.'],
      ['Grounding & UX','Không tìm thấy nguồn nhưng model vẫn đoán câu trả lời.', ['Đặt tiêu chí đủ bằng chứng','Hỏi lại hoặc nói chưa có dữ liệu','Hiển thị citation có thể kiểm tra'],'Test câu ngoài corpus và nguồn mâu thuẫn.'],
      ['RAG evaluation','Faithfulness cao nhưng câu trả lời thiếu chính sách quan trọng.', ['Kiểm context recall và độ đầy đủ đáp án','Xác định nguồn bị bỏ sót','Sửa retrieval rồi chạy lại generation'],'So cả coverage và groundedness với reference.'],
    ],
    9:[
      ['Agent fit & patterns','Ba agent cùng làm một việc và phản biện vô hạn.', ['Tách trách nhiệm theo nhu cầu thật','Chọn supervisor hoặc workflow đơn giản','Đặt điều kiện hội tụ và budget'],'So với một agent trên cùng eval set.'],
      ['Coordination','Worker không biết task đã hoàn thành nên xử lý lại.', ['Đặt task ID và trạng thái rõ','Handoff kết quả có cấu trúc','Dùng idempotency và xác nhận nhận việc'],'Mô phỏng message giao lặp hoặc giao muộn.'],
      ['MCP','Agent nhìn thấy tool MCP không có nghĩa user được phép gọi nó.', ['Xác thực user và scope','Validate tham số ở tool server','Chặn tool vượt quyền và ghi audit'],'Test user thiếu quyền dù model chọn đúng tool.'],
      ['A2A','Một agent giao việc sang agent khác nhưng không nhận kết quả.', ['Theo dõi task ID và trạng thái','Đặt deadline, cancel và error contract','Gắn trace qua ranh giới agent'],'Test timeout, retry và task đã hoàn tất.'],
      ['LangGraph','Agent cần xin duyệt rồi tiếp tục sau vài giờ.', ['Checkpoint state bền vững','Dùng interrupt cùng approval state','Resume có kiểm quyền và chống side effect lặp'],'Khởi động lại process rồi tiếp tục đúng checkpoint.'],
      ['Observability & safety','Chỉ có output cuối nên không biết worker nào làm lộ dữ liệu.', ['Trace từng agent và tool call','Che dữ liệu nhạy cảm trong log','Giới hạn quyền và quan sát handoff'],'Truy ngược một request xuyên các worker.'],
      ['Harness & long tasks','Tác vụ dài mất toàn bộ tiến độ khi process crash.', ['Chia mốc có thể kiểm chứng','Lưu checkpoint và artifact','Resume với budget và idempotency'],'Kill process giữa tác vụ rồi chạy lại an toàn.'],
    ],
    10:[
      ['ETL/ELT & ingestion','CDC gửi lại một batch khiến record xuất hiện hai lần.', ['Xác định khóa và watermark nguồn','Upsert hoặc dedupe idempotent','Lưu checkpoint sau commit thành công'],'Replay batch không làm tăng số record logic.'],
      ['Transform & storage','Pipeline chuẩn hóa text làm mất đơn vị tiền tệ.', ['So raw với transformed data','Giữ field, đơn vị và metadata nguồn','Version transformation trước backfill'],'Đối chiếu mẫu số liệu sau transform.'],
      ['Quality & contracts','Schema nguồn đổi tên field nhưng job vẫn báo thành công.', ['Kiểm schema và required fields','Chặn dữ liệu vi phạm contract','Cảnh báo owner và bảo toàn dữ liệu gốc'],'Test schema drift phải tạo failure rõ.'],
      ['Data observability','Không có exception nhưng hôm nay index ít tài liệu hơn bình thường.', ['Kiểm volume, freshness và missing data','So phân bố với baseline','Khoanh vùng nguồn hoặc batch thiếu'],'Alert dựa trên chất lượng dữ liệu, không chỉ uptime.'],
      ['Lineage & incident','Một bản đáp án sai có thể do hàng nghìn chunk từ cùng nguồn.', ['Dùng lineage truy ngược nguồn và phiên bản','Khoanh blast radius rồi quarantine','Sửa nguồn, replay và verify'],'Liệt kê được artifact ảnh hưởng và case phục hồi.'],
      ['Orchestration & cost','Backfill toàn bộ lịch sử làm hết quota embedding.', ['Ước tính volume và cost trước chạy','Batch với rate limit và checkpoint','Ưu tiên dữ liệu thay đổi và retry có giới hạn'],'Theo dõi tiến độ, cost và khả năng resume.'],
    ],
    11:[
      ['Risk & alignment','Agent tối ưu số ticket đóng bằng cách đóng cả ticket chưa giải quyết.', ['Xem lại mục tiêu và proxy metric','Đo chất lượng giải quyết thực','Ràng buộc hành động cùng audit'],'Test case đóng nhanh nhưng khách chưa được hỗ trợ.'],
      ['Attack vectors','Email có đoạn yêu cầu agent gửi danh sách khách hàng ra URL lạ.', ['Xem email là nội dung không đáng tin','Chặn hành động vượt quyền ở runtime','Ghi nhận injection và xử lý email an toàn'],'Không có dữ liệu rời hệ thống trong test tấn công.'],
      ['Guardrail layers','Input filter chặn từ khóa nhưng tool vẫn bị lạm dụng bằng cách diễn đạt khác.', ['Thêm policy tại tool execution','Kiểm output và quyền truy cập','Red team nhiều cách diễn đạt'],'Đo cả bypass và false positive.'],
      ['Tool safety','Agent đặt nhầm lệnh xóa toàn bộ workspace.', ['Giới hạn path và quyền tool','Yêu cầu duyệt hành động phá hủy','Có audit và cơ chế phục hồi'],'Test path ngoài phạm vi phải bị chặn.'],
      ['Red teaming','Đội thử đúng một jailbreak rồi kết luận an toàn.', ['Lập danh mục tấn công theo tài sản','Thử biến thể cùng người kiểm','Đưa lỗi vào regression suite'],'Theo dõi coverage và tỷ lệ bypass theo nhóm.'],
      ['HITL & escalation','AI không chắc về một giao dịch giá trị cao.', ['Đánh giá rủi ro và quyền hành động','Chuyển cho người có thẩm quyền kèm bằng chứng','Tạm dừng hành động cho tới quyết định'],'Test timeout và người duyệt từ chối.'],
      ['Responsible AI','Người dùng không biết cách yêu cầu sửa quyết định AI ảnh hưởng tới họ.', ['Minh bạch vai trò và giới hạn AI','Có kênh khiếu nại và human review','Lưu bằng chứng phù hợp quyền riêng tư'],'Người dùng thực hiện được quy trình sửa quyết định.'],
    ],
    12:[
      ['Production gap','Notebook chạy tốt nhưng service mất kết nối provider thì treo.', ['Thêm timeout và phân loại lỗi','Quản lý config, secret và health check','Có monitoring cùng fallback'],'Fault injection phải tạo phản hồi có kiểm soát.'],
      ['Docker & config','Image build trên máy bạn chạy được nhưng máy đồng đội lỗi dependency.', ['Pin dependency và version runtime','Build image tái lập','Đưa config theo môi trường và secret ngoài image'],'Chạy image sạch với cấu hình tối thiểu.'],
      ['Stateful agent','Load balancer chuyển request tiếp theo sang instance khác nên mất lịch sử.', ['Lưu state ở store phù hợp','Gắn session ID và kiểm quyền','Xử lý concurrency và idempotency'],'Hai instance vẫn đọc đúng phiên và không rò chéo user.'],
      ['Hosting & MCP','Tool server chạy local qua stdio nhưng app cloud không kết nối được.', ['Kiểm transport và topology triển khai','Đặt endpoint cùng authentication phù hợp','Kiểm timeout, network và health'],'Thử từ chính runtime cloud, không chỉ máy dev.'],
      ['Security & scale','Traffic tăng làm hết quota provider và request dồn lại.', ['Đặt rate limit và concurrency cap','Queue hoặc shed load có thông báo','Retry có backoff và budget'],'Load test theo quota thực và đo p95.'],
      ['CI/CD & model serving','Bản prompt mới build thành công nhưng giảm chất lượng.', ['Chạy regression eval trước deploy','Canary với metric chất lượng và cost','Rollback theo ngưỡng định trước'],'So cùng eval set với phiên bản đang chạy.'],
    ],
    13:[
      ['Pillars','Dashboard báo lỗi tăng nhưng không biết request nào và bước nào.', ['Dùng metrics để xác định mức độ','Dùng log theo request ID','Dùng trace để tìm span gây lỗi'],'Truy được từ alert tới một trace cụ thể.'],
      ['AI metrics','Latency trung bình ổn nhưng nhiều khách chờ rất lâu.', ['Đo p95/p99 và từng bước','Phân nhóm theo model, tool và token','Kiểm cost cùng task success'],'Xác định nhóm request nằm ở đuôi latency.'],
      ['Structured logs','Log text rời rạc vừa khó tìm vừa chứa email khách hàng.', ['Chuẩn hóa JSON và trường truy vấn','Gắn request/trace ID','Redact PII và giới hạn retention'],'Tìm được lỗi theo ID mà không lộ PII.'],
      ['Tracing','Agent chậm sau khi thêm reranker nhưng chỉ có tổng latency.', ['Tạo span cho retrieval, rerank và generation','Giữ quan hệ parent-child','Ghi duration và mã lỗi an toàn'],'So trace trước và sau thay đổi.'],
      ['Dashboard & alerts','Đội nhận hàng trăm alert INFO mỗi ngày và bỏ qua lỗi thật.', ['Gắn alert với SLO và tác động','Đặt window, severity và owner','Thêm runbook để hành động'],'Thử sự cố thật và đo alert hữu ích.'],
      ['Feedback & privacy','Nút dislike không gắn trace nên không tái hiện được lỗi.', ['Gắn feedback với request và phiên bản','Xin dữ liệu cần thiết và giảm PII','Đưa case đã review vào eval set'],'Tái hiện được case từ feedback được phép lưu.'],
    ],
    14:[
      ['Eval fundamentals','Đội so hai model bằng hai demo khác nhau.', ['Dùng cùng tập case và rubric','Chạy baseline và phiên bản mới','Báo chất lượng cùng cost/latency'],'Kết quả có thể lặp lại trên cùng cấu hình.'],
      ['Metrics','Agent trả lời đúng nhưng không hoàn thành hành động đặt lịch.', ['Tách answer quality khỏi task completion','Kiểm trạng thái hệ thống cuối','Đo partial progress để chẩn đoán'],'Xác minh lịch đã tồn tại và đúng tham số.'],
      ['Dataset design','Eval set toàn câu dễ và điểm gần tuyệt đối.', ['Lấy mẫu từ workflow thật','Thêm edge, no-answer và adversarial cases','Giữ test set riêng cùng expert review'],'Báo score theo từng nhóm case.'],
      ['LLM-as-judge','Judge luôn cho đáp án dài điểm cao hơn dù thêm thông tin sai.', ['Đặt rubric theo failure mode','Hiệu chuẩn với người chấm','Randomize hoặc swap thứ tự khi so cặp'],'Đo bias và TPR/TNR trên case có nhãn.'],
      ['RAG eval','Answer bám sát context nhưng context lại là tài liệu sai.', ['Tách groundedness khỏi factual correctness','Kiểm nguồn, relevance và recall','Sửa retrieval hoặc dữ liệu trước prompt'],'So context với reference đáng tin.'],
      ['Statistical rigor','Phiên bản mới hơn hai điểm phần trăm trên hai mươi case.', ['So paired theo item','Lặp run và báo độ bất định','Tăng số case đại diện trước kết luận mạnh'],'Báo n, cấu hình, khoảng tin cậy và effect size.'],
      ['Agent & safety eval','Agent vượt benchmark bằng cách đọc file đáp án trong sandbox.', ['Cô lập môi trường và giấu ground truth','Đọc trajectory cùng side effect','Thêm test reward hacking và quyền tool'],'Không cho grader data lọt vào context agent.'],
      ['Failure analysis','Tăng top-k và đổi model không sửa được lỗi chính sách.', ['Đọc trace lỗi thật','Phân nhóm và truy nguyên root cause','Sửa tầng gây lỗi rồi thêm regression case'],'Kiểm lại cụm lỗi và các case chưa từng thấy.'],
    ],
    15:[
      ['Enterprise readiness','Pilot sắp mở cho toàn công ty nhưng chưa có người nhận incident.', ['Gán owner, escalation và runbook','Kiểm quyền dữ liệu cùng rollback','Đặt go/no-go theo quality, SLO và cost'],'Diễn tập incident trước rollout rộng.'],
      ['Cost anatomy','Đội chỉ tính giá output token trong ngân sách.', ['Tính input, output, tool và retry','Cộng retrieval, storage và review','Báo cost trên tác vụ thành công'],'Đối chiếu usage thực với hóa đơn và volume.'],
      ['Optimization','Đổi model nhỏ giúp giảm cost nhưng tăng lỗi tác vụ khó.', ['Phân tích lỗi theo độ khó','Thử routing và fallback có điều kiện','Đo quality cùng cost mỗi nhóm'],'Chỉ giữ tối ưu nếu guardrail chất lượng đạt.'],
      ['Scaling & reliability','Tăng worker gấp đôi nhưng throughput không tăng vì provider quota.', ['Xác định bottleneck và giới hạn ngoài hệ','Kiểm concurrency, queue và backpressure','Đặt fallback hoặc capacity plan'],'Load test theo quota và ngân sách thực.'],
      ['Skills & roadmap','Bạn học nhiều framework nhưng chưa hoàn thành dự án nào.', ['Chọn một use case có phạm vi nhỏ','Build, eval, debug rồi deploy','Lưu bằng chứng chất lượng và vận hành'],'Có demo chạy được cùng eval, trace và runbook.'],
    ],
  };
  for(const lesson of window.PHASE1_LESSONS){
    const rows=cases[lesson.day];
    if(!rows||rows.length!==lesson.topics.length)throw new Error(`Thiếu tình huống bài ${lesson.day}`);
    rows.forEach(([topic,situation,steps,verify],index)=>{
      if(!lesson.topics.includes(topic))throw new Error(`Topic không hợp lệ: ${topic}`);
      lesson.questions.push({id:`d${lesson.day}-s${index+1}`,type:'essay',scenario:true,topic,source:lesson.deck,
        prompt:`Tình huống: ${situation} Bạn sẽ xử lý thế nào? Nêu thứ tự hành động và cách xác nhận đã giải quyết đúng.`,
        rubric:[...steps,verify],sample:`${steps.map((step,i)=>`${i+1}. ${step}.`).join(' ')} Kiểm chứng: ${verify}`,
        guide:{situation,steps,verify}});
    });
    for(const q of lesson.questions.filter(q=>q.type==='essay')){
      q.guide=q.guide||{situation:q.prompt,steps:q.rubric.slice(0,-1),verify:q.rubric.at(-1)};
    }
  }
  window.PHASE1_FLASHCARDS=window.PHASE1_LESSONS.flatMap(lesson=>lesson.questions.map(q=>({
    id:`card-${q.id}`,questionId:q.id,day:lesson.day,topic:q.topic,front:q.prompt,source:q.source,
    answer:q.type==='essay'?q.sample:(q.type==='multi'?q.answers:[q.answer]).map(i=>q.options[i]).join(' • '),
    explanation:q.type==='essay'?'Tập nói hoặc viết phương án của bạn trước khi mở thẻ.':q.why,
    scenario:Boolean(q.scenario),
  })));
})();
