
## t3-d01-material_mupd8a27_gjug33 · day16-advanced-agent-architectures (77 pages)

001 Advanced Agent Architectures / AICB-P2T3 · Ngày 16 · Chương 4 — / Agent Nâng Cao · Harness & Kiến trúc
002 ? / HÃY SUY NGHĨ... / “Vì sao cùng một model, chỉđổi harness,
003 Nội dung bài học / 1. Khi nào Single Agent thất bại? / 2. Reflexion — Dạy Agent tựphản tỉnh
004 01 / Khi nào Single Agent thất bại? / ReAct — mạnh nhưng không biết sửa lỗi
005 ReAct — Reasoning + Acting / Thought / Action
006 ReAct thất bại khi nào? / Thought: tìm X / Search(X)
007 Đừng nâng cấp agent quá sớm / Nhiều tác vụthực tếchỉcần: / ■Retrieval — tìm thông tin liên quan
008 Case study: Lỗi lan tỏa trong PR review / Một agent ReAct review pull request — điều gì xảy ra khi bước đầu sai? / 1. Agent đọc nhầm module trong diff — hiểu sai file nào thực sựbịđổi
009 Bằng chứng: ReAct struggle với multi-hop reasoning / 35.1% / ReAct EM
010 02 / Reflexion — Dạy Agent tựphản / tỉnh
011 Kiến trúc Reflexion — 4 bước / Ý tưởng cốt lõi — Reflexion (Shinn et al. 2023) — Thêm 2 thành phần vào ReAct: Evaluator (đánh / giá kết quả) và Reflector (rút bài học). Agent thử, đánh giá, suy ngẫm, rồi thửlại — giống cách con
012 Reflexion State — Code-Level / python / class ReflexionState(TypedDict):
013 Reflexion trong LangGraph / act / success?
014 Reflexion cải thiện đáng kể / 91% / HumanEval pass@1
015 Evaluator prompt nên thiết kếthếnào? / Evaluator là mắt xích yếu nhất của Reflexion — nếu nó chấm sai, cảvòng lặp / Reflect–Retry đi sai hướng. Bốn nguyên tắc khi viết evaluator prompt:
016 Reflection memory: ghi gì, bỏgì? / Lưu / Bài học rút ra: câu ngắn gọn dạng
017 Reflexion failure modes trong production / Reflexion không miễn nhiễm lỗi — 4 kiểu thất bại thường gặp khi đưa vào production: / ■Correlated failure: Evaluator và Actor dùng chung model/prompt base →evaluator
018 Reflexion không phải kiến trúc riêng / Reframe / Reflexion không phải một model khác và cũng không phải một “kiến trúc đối thủ” của ReAct.
019 03 / Bức tranh rộng hơn / LATS, Voyager và khi nào nên dùng agent phức tạp
020 LATS — Khi cần tìm đường tối ưu / S0 / A1
021 Process Reward Models — Chấm từng bước / ORM: chỉchấm đáp án cuối / B1
022 Voyager — Agent tích lũy kỹnăng / Auto Curriculum / Code Generator
023 Đường cong chi phí — Cái giá của “search thêm” / compute / accuracy
024 Tài liệu tham khảo — §3 / 1. Language Agent Tree Search Unifies Reasoning, Acting, and Planning in Language Models — arXiv:2310.04406. / LATS mởrộng Reflexion bằng tree expansion + Monte Carlo Tree Search; ToT, ReAct, Reflexion mỗi cái chỉlàm
025 04 / Tích luỹkỹnăng / Voyager sống tiếp năm 2026: skill layer của harness
026 Skill Files — Voyager sống tiếp trong harness 2026 / Skill Library (DB) của Voyager (§3) tái xuất hiện 2026 dưới dạng skill files: mỗi kỹnăng một file, nạp / progressive — chỉkhi agent chạm tới, không nhồi hết vào context từđầu.
027 05 / Self-Evolving Agents / Khi cải tiến sống sót qua ranh giới episode — §4 đã làm điều đó
028 Cái gì còn lại sau khi episode kết thúc? / Cải tiến trong episode — §2, §3 / Task 1
029 Nấc thang tựtiến hoá — cái gì thay đổi được? / Nấc thang / Đã gặp ởđâu trong bài
030 Darwin Gödel Machine — agent tựviết lại code của chính nó / 50.0% / SWE-bench
031 Không đo được thì không được tiến hoá / DGM không tin biến thểnào cả: mọi lần tựsửa code đều phải chạy qua benchmark, không qua thì bịloại / — eval harness là điều kiện tiên quyết đểđược phép tiến hoá. (Nguồn: arXiv:2505.22954.)
032 Tựsửa được code thì cũng tựsửa được guardrail / Agent sửa được mã nguồn của chính nó thì guardrail nằm trong mã nguồn đó cũng nằm trong tầm với / — đó là lý do định luật đầu tiên là Endure, không phải Evolve. (Nguồn: arXiv:2508.07407.)
033 Tài liệu tham khảo — §5 / 1. Darwin Gödel Machine (Sakana AI, 5/2025) — arXiv:2505.22954. Hệtựcải tiến lặp lại việc sửa chính mã nguồn / của mình và kiểm chứng thực nghiệm từng thay đổi trên coding benchmark; giữmột archive agent theo kiểu
034 06 / Plan — Act — Verify / Tách ba pha thay vì một vòng lặp “think then do”
035 Vì sao tách Plan – Act – Verify? / Vòng lặp cũ (undifferentiated) / “think then do”
036 Deep Agents — Kiến trúc cho task dài hơi / Main Thread / Plan file
037 Vì sao plan file thắng plan trong context? / Plan trong context — Một đoạn text trong / prompt, viết lại mỗi turn đểphản ánh tiến độ
038 07 / Harness & Middleware / Sáu hook — nơi mọi lớp ở§2–§6 trởthành code
039 Cùng một model, chỉđổi harness / 52.8% →66.5% / Terminal-Bench 2.0
040 Một harness có ba núm xoay / Model là hằng sốbạn thuê. Harness là phần bạn viết — và nó chỉcó ba núm xoay: / 1.
041 Sáu hook — middleware móc vào đâu trong vòng lặp? / before_agent / before_model
042 wrap_tool_call — cổng gác cho mọi hành động / wrap_tool_call chạy cảtrước lẫn sau lời gọi tool — nên thấy cảđầu vào lẫn đầu ra. / Ba việc chỉhook này làm được:
043 before_model — quyết định model được thấy gì / before_model chạy ngay trước mỗi lượt gọi model, sau khi state đã cập nhật — điểm duy nhất bạn kiểm / soát toàn bộnội dung model sắp đọc.
044 after_model — critic layer của §2, giờlà một hook / Ở§2 đã hứa: critic layer của Reflexion sẽlà một after_model hook. Đây là lúc trảlời. / Ánh xạmột–một với §2:
045 before_agent / after_agent — ngân sách và dấu vết / Bốn hook trước chạy mỗi vòng lặp; hai hook này chạy một lần — mởvà đóng toàn bộphiên chạy. / Budget accounting — cần điểm mởvà
046 Doom loop — đóng lại câu hỏi bỏngỏở§1 / §1 nêu ba failure mode của ReAct. Failure mode thứhai — infinite loop: tool trảnoise, agent lặp mãi — / đến giờvẫn chưa được giải quyết. Reflexion (§2) chấm chất lượng, không chấm sựlặp lại.
047 Tài liệu tham khảo — §7 / 1. LangChain (2026) — Harness engineering trên Terminal-Bench 2.0. Một coding agent đi từ52.8% lên 66.5%, từ / ngoài top 30 lên hạng 5, không đổi model — toàn bộmức tăng đến từharness engineering. Đây là nguồn của
048 08 / Context Engineering cho task / dài hơi
049 Compaction thắng bao nhiêu? / +29% / Context editing
050 Khi nào compact — đừng đợi đến lúc đầy / Sai lầm phổbiến nhất: đợi context đầy rồi mới nén. Lúc đó model đã bắt đầu mất chất lượng vì context quá / dài — nén muộn không cứu được lượt gọi vừa hỏng.
051 Compaction vs Eviction — hai cơ chếbổsung nhau / Compaction / ■Một LLM viết lại toàn bộlịch sửthành
052 Ranh giới §8 — context engineering dừng ởđâu? / Ngày 16 nén context trong MỘT phiên đang chạy — nhưng agent có nhớgì khi phiên đó kết thúc không? / Đó là câu hỏi của một ngày khác.
053 09 / Orchestrator — Worker / Phân rã việc ra nhiều context riêng biệt
054 Orchestrator–Worker — Anatomy / Orchestrator / Worker 1
055 Kinh tếhọc của multi-agent — đừng bán nó quá tay / Khi CHƯA cần multi-agent / ■Một agent đơn với tool tốt vẫn thắng —
056 Ranh giới §9 — orchestrator-worker dừng ởđâu? / Orchestrator đã biết phân việc và cô lập context — nhưng các agent nói chuyện với nhau thếnào? Đó là / câu hỏi của một ngày khác.
057 10 / Guardrails & Capability Control / §7 đã hứa: guardrails gắn vào wrap_tool_call — đến lúc trảlời
058 Bềmặt tấn công mới: injection & tool poisoning / Prompt injection là LLM01 — hạng mục đứng đầu OWASP Top 10 for LLM Applications ởcảbản 2023 lẫn / bản 2025. Agentic AI cộng thêm kết nối tool/MCP mởra bềmặt tấn công mới. (Nguồn: OWASP Top 10 for
059 Defence in Depth — năm lớp phòng thủ / □ / ✓
060 “Prompt rules” không phải controls / Model có thểbịthuyết phục bỏqua một câu instruction trong prompt — nhưng không thểbỏqua một / allowlist chặn cứng ởtầng infrastructure.
061 Ranh giới §10 — guardrails dừng ởđâu? / Ngày 16 xây khái niệm — threat model, năm lớp phòng thủ, ranh giới prompt-vs-infrastructure. Việc triển / khai các lớp đó là câu hỏi của những ngày khác.
062 11 / Grounding, Citation & Hallucina- / tion Attribution
063 Bằng chứng: attribution hallucination rất khó / 41.1% / Step-localisation
064 Ba loại lỗi trích dẫn — defence khác nhau bắt loại khác nhau / Unsupported claim / Câu trảlời không có nguồn
065 Citation-verification loop — và điểm mấu chốt: abstain / 1. Parse claim thành đơn vịkiểm được: tách câu trảlời thành các claim rời rạc, mỗi / claim kiểm được độc lập.
066 12 / Đánh giá kiến trúc agent / Benchmark nào đo gì — và ma trận quyết định của cảbài
067 Benchmark 2026 — đo gì? / Benchmark / Đo gì
068 Đánh giá trajectory — không chỉđáp án cuối / Final-answer accuracy chỉnói agent đúng hay sai ởđích — nó che giấu agent đã đi lệch ởbước nào trên / đường đi.
069 Khi nào dùng layer nào? — ma trận quyết định / Layer / Khi nào dùng
070 13 / Demo & Thực hành / Xem Reflexion hoạt động thực tế
071 ReAct vs Reflexion — Side-by-side trên HotpotQA / LIVE DEMO / 1. Cùng câu hỏi 2-hop, chạy cảhai agent với LangSmith tracing
072 Lab #16 / LAB #16 / Mục tiêu: Implement Reflexion agent từscratch với LangGraph
073 Lab 16 — Các bước thực hành / 1. Build state machine: nodes = [act, evaluate, reflect, terminate], edges có / conditional routing
074 Tổng kết — Key Takeaways / Những ý chính cần nhớtrước khi sang bài tiếp theo / 1
075 Tiếp theo & Bài tập / Bài tiếp theo / Ngày 17:
076 Hỏi & Đáp / Bạn đang định thêm một lớp harness — bằng chứng / nào cho thấy nó đáng chi phí token và latency?
077 Cảm ơn! / AICB-P2T3 · Ngày 16 · Advanced Agent Architectures / github.com/vinuni-aicb

## t3-d01-material_mupd88yw_931iwr · Day16-Track03-Advanced_Agent_Architectures (44 pages)

001 VinUniversity / Advanced Agent / Architectures
002 Hook / Tại sao Reflexion agent giải quyết được bài toán / mà ReAct không làm được?
003 Agenda / 1 Khi nào single-agent thất bại? / 2 Reflexion: thêm self-evaluation vào loop
004 Khi nào Single Agent thất / bại? / ReAct — mạnh nhưng không biết sửa lỗi
005 ReAct — Reasoning + Acting / Thought / Action
006 ReAct thất bại khi nào? / Thought: tìm X / Search(X)
007 Bài học production 2025–2026: đừng nâng cấp agent quá sớm / • Nhiều bài toán thực tếchỉcần retrieval + tools + structured output / • Bắt đầu bằng single-agent hoặc workflow đơn giản, sau đó mới thêm complexity
008 Ví dụthực tiễn: PR review agent bịlỗi lan tỏa thếnào? / 1 Agent đọc sai module trong diff ngay từbước đầu / 2 Gọi checker / search trên file không liên quan
009 Bằng chứng: ReAct struggle với multi-hop reasoning / 35.1% / ReAct EM
010 Reflexion — Dạy Agent tự / phản tỉnh / Thêm self-evaluation vào reasoning loop
011 Ý tưởng cốt lõi / Reflexion (Shinn et al. 2023) / Thêm 2 thành phần vào ReAct: Evaluator (đánh giá kết quả) và Reflector
012 Kiến trúc Reflexion — 4 bước / 1. Generate / Actor
013 Reflexion State — Code-Level / Python schema / class ReflexionState(TypedDict):
014 Reflexion trong LangGraph / act / success?
015 Evaluator prompt nên được thiết kếthếnào? / class JudgeResult(BaseModel): / score: int
016 Reflection memory: ghi gì, bỏgì? / • Nên ghi: failure reason, lesson, next strategy, evidence titles / • Không nên ghi: toàn bộtrace dài dòng nếu không giúp lần thửsau
017 Reflexion failure modes trong production / 1 Evaluator bias: tựchấm quá dễhoặc quá khắt khe / 2 Reflection drift: bài học chung chung, không giúp được attempt sau
018 Reflexion cải thiện đáng kể / 91% / HumanEval
019 Bức tranh rộng hơn / LATS, Voyager và khi nào nên dùng agent phức tạp
020 LATS — Khi cần tìm đường tối ưu / S0 / A1
021 Voyager — Agent tích lũy kỹnăng / Auto Curriculum / Code Generator
022 Khi nào dùng pattern nào? / Pattern / Memory
023 Case study mới: multi-agent research system / • Một planner agent chia câu hỏi thành nhiều sub-questions / • Các worker agents tìm thông tin song song
024 Checklist triển khai an toàn cho agent nâng cao / 1 Có max_attempts / 2 Có structured outputs cho evaluator / tools
025 Kỹthuật nâng cao trước khi / vào lab / Các pattern production giúp agent ổn định, dễdebug và dễđánh
026 Template kiến trúc agent production-ready / User task / + context
027 Evaluator tốt quyết định chất lượng Reflexion / Evaluator nên chấm 4 thứ / 1
028 Reflection memory: lưu bài học, không lưu nguyên chat history / Memory entry nên ngắn và thao tác / được
029 Plan - Act - Verify tách bạch sẽổn định hơn loop “nghĩ rồi làm / luôn” / Plan subgoals
030 Độtin cậy của tool quan trọng không kém độmạnh của model / 5 kỹthuật tăng reliability / 1
031 Observability + eval flywheel: cách agent tiến bộsau mỗi lần / demo / Trace runs
032 Khi chưa cần multi-agent / Thử4 bước này trước / 1
033 Khi multi-agent bắt đầu đáng tiền / Dấu hiệu phù hợp / • Nhiều domain tool rất khác nhau
034 Demo & Thực hành / Xem Reflexion hoạt động thực tế
035 Demo: ReAct vs Reflexion — Side-by-side trên HotpotQA / • Cùng câu hỏi 2-hop, chạy cảhai agent với LangSmith tracing / • ReAct: sai entity ởhop 1, lỗi lan tỏa, trảlời sai
036 Lab 16: Implement Reflexion agent từscratch với LangGraph / Mục tiêu: / Reflexion agent repo + benchmark report (EM comparison,
037 Lab 16 — Các bước thực hành / 1 Build state machine: nodes = [act, evaluate, reflect, terminate], edges có / conditional routing
038 Lab roadmap 120 phút / 1 30 phút: chạy ReAct baseline và hiểu trace / 2 35 phút: thêm Evaluator dạng structured output
039 Bonus tasks đểphân hoá học viên / • adaptive max attempts / • memory compression
040 Deliverable schema đểdễchấm tựđộng / • report.json: metric tổng hợp / • report.md: narrative analysis
041 Tổng kết / Takeaway 1 / Reflexion là nâng cấp hợp lý khi ReAct
042 Ngày 17: Memory Systems for Agents / Agent đã biết reasoning — nhưng tại sao nó quên hết sau mỗi / conversation?
043 Q&A / Reflexion có phải luôn tốt hơn ReAct? Khi nào / nên dùng cách nào?
044 Cảm ơn! / AICB-P2T3 · Ngày 16 · Advanced Agent Architectures / github.com/vinuni-aicb

## t3-d02-material_mupd8d9p_rq5vl6 · 2-day18-production-rag (56 pages)

001 Production RAG / AICB-P2T3 · Ngày 18 · TừDemo 60% Đến Production 85%+ / Trần Quang Thiện
002 ? / HÃY SUY NGHĨ... / “RAG pipeline demo chạy ngon, nhưng
003 Nội Dung Bài Học / ■01 · Map & Compass — vì sao basic RAG hỏng, và bản đồđểbiết sửa ởđâu. / ■02 · Offline — ingest (làm 1 lần · đặt trần) — chuẩn bịdữliệu đểđặt trần chất lượng
004 Mục Tiêu Ngày 18 / ■Chẩn đoán pipeline hỏng — Error Tree, không đoán mò / ■OFFLINE: hierarchical/late chunk, contextual, enrichment
005 Deliverable Cuối Ngày / src/ (5 module hoàn chỉnh) + analysis/ (RAGAS report + failure analysis) / ■m1_chunking.py — hierarchical chunking (parent 2048 / child 256)
006 01 / PHẦN 01 / Map & Compass
007 RAG = OFFLINE + ONLINE, Mỗi Bước Đều Có ThểHỏng / OFFLINE / 1 lần
008 Đọc Lại Bản Đồ: Mỗi Bạn Gọi Tên 1 Bước (1 phút/bạn) / Lần lượt mỗi sinh viên chọn 1 bước trong pipeline và nói trong 1 phút: bước đó làm gì và có / thểhỏng thếnào. Mục tiêu — cảlớp cùng nắm bản đồtrước khi đi sâu Phần 02–03.
009 Đánh Dấu: Mỗi Lỗi Thuộc Bước Nào? (5 phút) / Một AI assistant nội bộtrảlời câu hỏi chính sách. Bạn nhận được 4 case lỗi từlog production. / Nhiệm vụ(5 phút): Với mỗi case đánh dấu bước chịu trách nhiệm (Retrieval / Rerank /
010 02 / PHẦN 02 / OFFLINE — Ingestion
011 BƯỚC HIỆN TẠI / Chunking / Cắt tài liệu sao cho giữngữcảnh
012 Chunking: GiữNgữCảnh Khi Cắt Nhỏ / Chiến lược / Tham sốmặc định
013 Hierarchical: Tìm Bằng Child Nhỏ, TrảLời Bằng Parent Lớn / Mâu thuẫn Day 08: chunk nhỏ= retrieve / chính xác nhưng thiếu ngữcảnh; chunk
014 Late Chunking: Embed CảDocument Trước, Cắt Sau / Cách thông thường: cắt chunk trước rồi / embed từng cái rời →mỗi chunk mù phần
015 RAPTOR: Retrieval Có “ĐộCao” (Cây Tóm Tắt) / Cách thông thường: mọi chunk cùng / một mức chi tiết.
016 BƯỚC HIỆN TẠI / Enrich / Làm chunk giàu thông tin hơn trước khi embed
017 Contextual Embeddings (Anthropic, 2024) / Chunk thô / + LLM thêm
018 Enrichment Pipeline: Làm Chunk DễTìm Hơn Trước Khi Embed / Raw chunk / Summarization
019 Hypothetical Q&A: Nối Vocab User ↔Tài Liệu / Vấn đề: user hỏi bằng câu hỏi, tài liệu / viết bằng câu khẳng định. Embedding của
020 Matryoshka (MRL): SốChiều Là Cái Núm Vặn / Cách thông thường: / embedding =
021 Chọn Chunking Theo Loại DữLiệu — Không Có “One-Size” / Chiến lược / Tốt cho (data)
022 03 / PHẦN 03 / ONLINE — Retrieval
023 BƯỚC HIỆN TẠI / Retrieve / Tìm đúng chunk cho mỗi query
024 Hybrid + RRF: BM25 Bắt Exact, Dense Bắt Synonym (Nhắc Day 08) / Query / BM25
025 Vấn Đề: Hybrid + RRF Vẫn Miss Chunk Đúng / Đoán — Câu trảlời nằm ở1 token hiếm (mã “X7-204”). RRF gộp rank mức document. Tại / sao vẫn miss? Nghĩ 30s trước khi xem bảng — gợi ý: cần so khớp sâu hơn document
026 ColBERT: Thoát “Nút CổChai 1 Vector” (Token-Level) / Cách thông thường: bi-encoder ép cả / đoạn vào 1 vector →chi tiết token (tên
027 SPLADE: BM25 “Học Được” — Sparse Nhưng Biết MởRộng / Cách thông thường: BM25 chỉmatch / đúng từxuất hiện.
028 Tensor / Weighted Fusion: RRF Nhưng Có Học Trọng Số / RRF: cân bằng cứng 0.5 / 0.5 / BM25
029 ColPali: Đừng Parse Tài Liệu — Hãy Nhìn Nó / Cách / thông
030 Chọn Vector DB: Quyết Định Theo Nhu Cầu, Không Theo Hype / Hỏi bạn cần gì, theo thứtự— dừng ởdòng đầu tiên khớp: / Đã có Postgres, dữliệu vừa phải?
031 Chọn Retriever Theo Nhu Cầu — Vượt Hybrid Khi Nào? / Kỹthuật / Tốt cho (data)
032 BƯỚC HIỆN TẠI / Rerank / Sắp xếp lại đểchunk đúng lên top
033 Two-Stage Retrieval: Recall Rộng →Precision Hẹp / Retrieve / top-20
034 Reranker Landscape: Chọn Theo Chất Lượng / Chi Phí / Ngôn Ngữ / Model / Chi phí
035 BƯỚC HIỆN TẠI / Control Flow / Định hình query & làm sạch context theo vấn đề
036 Mỗi Vấn ĐềMột Pattern — Đừng Bật Hết / Vấn đề / Tầng
037 Sửa Query Trước Khi Search — Theo Vấn Đề, Không Mặc Định / HyDE nhắc Day 8 / LLM sinh câu trảlời giảđịnh →embed
038 Corrective RAG (CRAG): TựChấm Điểm Rồi Sửa Trước Khi Generate / Cách thông thường: retrieve được gì / thì nhồi thẳng vào LLM — kểcảkhi
039 Augmentation: Làm Sạch Context Theo Vấn Đề / Tầng giữa Retrieve và Generate — Top-k chunks hiếm khi sạch: dư thừa, mâu thuẫn, / thiếu nguồn. Augment chèn bước làm sạch trước khi đưa vào LLM — bật đúng bước theo
040 04 / PHẦN 04 / Close the Loop & Limits
041 BƯỚC HIỆN TẠI / Close the Loop / Đo bằng RAGAS, tra Error Tree, sửa đúng tầng
042 Đo: RAGAS 4 Metric — 2 Trục, 2 Tầng / RETRIEVAL — lấy đúng chưa? / Context Recall ≥0.75
043 Metric Thấp →Sửa Gì (Error Tree Theo Metric) / Cùng bản đồpipeline ởPhần 01 — giờvào từcột metric thay vì vấn đề. RAGAS chỉra tầng / yếu →tra vềcùng la bàn →sửa →đo lại.
044 Giới Hạn Nền Tảng: 4 Điểm Mù Của Embedding / Negation insensitivity / “được nghỉ” vs “không được nghỉ” →co-
045 Giải Pháp Cho Lỗi Embedding Không Fix Được Bằng Data / ■Metadata filtering (temporal, số, source) — sửa temporal & numerical blindness: lọc theo / ngày / con sốtrước khi search.
046 Ranh Giới: Hôm Nay Dạy Gì, Phần Còn Lại ỞNgày Nào / Chất lượng ingestion (OFFLINE) + retrieval (ONLINE): chunking, contextual, enrichment, / hybrid/rerank, query transform, augmentation — thường là phần “ăn điểm” lớn của RAG.
047 01 / Hands-on 18 / Đủlý thuyết — giờtựtay dựng pipeline trên dữliệu thật, đo
048 Lab 18: 5 Module →Full Pipeline / Cá nhân — 2h implement + 30 phút reflection / Implement tất cả5 module (TODO markers trong code):
049 So Sánh: Naive vs Production vs +Nâng Cao / Pipeline / Cấu hình
050 Mỗi Tầng Có Núm Vặn Riêng — Vặn Đúng Tầng, Đừng Đổi Model / OFFLINE / Chunk
051 02 / Key Takeaways / Production RAG là kỹthuật chẩn đoán + sửa đúng tầng, không
052 Tổng kết — Key Takeaways / 1 / Chẩn đoán trước, sửa sau. RAG = OFFLINE + ONLINE; dùng Error Tree đểbiết tầng nào
053 Tài Liệu Tham Khảo / 1. Anthropic. Introducing Contextual Retrieval (2024). / https://www.anthropic.com/news/contextual-retrieval
054 Tiếp theo & Bài tập / Day 19 — GraphRAG & Knowledge / Graphs
055 Hỏi & Đáp / Production RAG: bạn sẽsửa tầng nào / đầu tiên trong hệthống của mình?
056 Cảm ơn! / Trần Quang Thiện · AICB Phase 2 · Track 3 / Production RAG — Ngày 18

## t3-d02-material_mupd8c4m_wd179v · Day18-Track03-Production_RAG (57 pages)

001 Production RAG / AICB-P2T3 · Ngày 18 · Chương 4 — Agent Nâng Cao / M.Sc Trần Minh Tú
002 ? / HÃY SUY NGHĨ... / “Tại sao RAG pipeline demo chạy tốt
003 Nội dung bài học / 1. Tại sao Basic RAG thất bại? / 2. Fix OFFLINE — Ingestion Pipeline
004 01 / Tại sao Basic RAG thất bại? / Ingestion & Retrieval — failure nằm ởđâu trong pipeline?
005 RAG Pipeline — Tổng quan ONLINE & OFFLINE / Output / Query / Question
006 OFFLINE Pipeline — Failure ởđâu? / Data / Data
007 ONLINE Pipeline — Nguyên nhân output sai ởtừng bước / Storage Layer / Query / Question
008 Error Tree Analysis — Log từng bước, tìm đúng chỗsai / Query / PreRAG
009 Bằng chứng: Gap giữa Naive và Production RAG / 60% / Naive RAG
010 02 / Fix OFFLINE — Ingestion / Pipeline
011 Ingestion Pipeline — Mỗi bước fix 1 failure từSection 1 / Document / PDF/HTML/MD
012 3 Chunking Strategies — So sánh / Fixed-size / Chunk 1
013 Advanced Chunking — Structure-Aware & Late Chunking / Parse markdown headers, HTML / tags, PDF sections rồi chunk theo
014 Embedding Model Selection — Chọn đúng model cho use case / Model / Dims
015 Contextual Embeddings — Anthropic’s Contextual Retrieval / Chunk gốc / “Nhân viên được nghỉ12 ngày/năm.”
016 Multimodal Embeddings — Shared Latent Space / Multimodal Embedding là gì? — / Chuyển data từnhiều modalities
017 03 / Enrichment Pipeline / Làm giàu chunks trước khi embed — Summarize, HyQA, Meta-
018 Enrichment Pipeline — Tại sao cần “làm giàu” chunks? / Raw / Chunk
019 Enrichment Techniques — 4 kỹthuật chính / LLM tạo summary ngắn cho mỗi chunk. / Embed summary thay vì (hoặc cùng với) raw chunk.
020 04 / Fix ONLINE — PreRAG / Query Transform, Corrective RAG — fix trước khi search
021 Query Transform — HyDE & Multi-Query / HyDE / Query
022 Corrective RAG & Adaptive Retrieval / Query / Retrieve
023 05 / Fix ONLINE — Retrieval & Aug- / ment
024 Hybrid Search — BM25 + Dense Vector Fusion / User Query / BM25
025 BM25 vs Dense — Khi nào dùng cái nào? / Tiêu chí / BM25
026 Beyond RRF — Tensor Fusion, Late Interaction & Learned Sparse / Tensor / Fusion
027 Metadata Filtering — Pre-filter trước khi search / Gắn metadata vào mỗi chunk khi in- / dexing.
028 Vector DB cho Production RAG / DB / Hybrid Search
029 Reranking — Highest ROI Optimization / Retrieve top-20 / Cross-Encoder
030 Augmentation — Nâng cao context trước khi đưa vào LLM / NLI model kiểm tra entailment giữa query và chunk. / Filter chunks contradict →giảm hallucination.
031 06 / Fix ONLINE — Generate & Pos- / tRAG
032 Self-RAG, RAG-Fusion & Semantic Caching / Self-RAG — LLM tựquyết khi nào retrieve. Fine- / tune model output special tokens ([Retrieve],
033 07 / Evaluation — Đo lường RAG / Pipeline
034 RAGAS — 4 metrics đánh giá RAG quality / Faithfulness / Answer claims được
035 RAGAS Diagnostic — Score thấp thì fix ởđâu? / Context chứa info đúng nhưng LLM bịa thêm / →Tighten prompt (“Only use provided context”)
036 RAGAS Evaluation — Code Pattern / from ragas import evaluate / from ragas.metrics import (
037 Evaluation Frameworks — RAGAS vs TruLens vs DeepEval / Dimension / RAGAS
038 Chọn Evaluation Framework nào? / Khi nào: / ✓Focus RAG quality
039 Cost Estimation — 1M documents, bao nhiêu tiền? / Embedding 1M chunks × $0.02/1M / tokens ≈$10–50
040 08 / Agentic RAG / Khi agent điều khiển RAG pipeline — từstatic sang autonomous
041 RAG Evolution — TừNaive đến Agentic / Naive RAG / static pipeline
042 Agentic RAG — 3 Kiến trúc chính / Single-Agent / Multi-Agent
043 Agentic RAG — Corrective & Adaptive (đã học) + mới / ✓CRAG = Corrective RAG (slide PreRAG) / ✓Adaptive Retrieval = route by complexity
044 09 / RAG vẫn chưa giải quyết được / mọi thứ
045 Tại sao RAG không thểđạt 100% accuracy? / Nhiều retrieval failures không phải vì thiếu evidence / trong corpus.
046 Fundamental Limitations — Embedding không capture hết / 1. Temporal blindness: Vector không có chiều thời / gian →doc 2022 và 2024 cùng score.
047 10 / Demo & Thực hành / Cá nhân implement modules — Nhóm ghép thành Production
048 Thực hành — Bức tranh lớn / Cá nhân: / Module 1
049 Live Demo — Naive vs Production RAG / 1. Pipeline A (basic): paragraph chunking + dense-only →chạy RAGAS / 2. Pipeline B (production): hierarchical chunks + hybrid search + Cohere Rerank
050 Metadata filter. / Hybrid scores. / M3: Reranking
051 Bài tập nhóm — Ghép thành Production RAG System (30 phút) / Các bước ghép: / 1. Integrate: ghép M1 →M5 →M2 →M3
052 Hệthống chấm điểm — Cá nhân + Nhóm / Điểm cá nhân (60%): / Tiêu chí
053 Starter Code & Setup — Bắt đầu ngay / git clone github.com/vinuni-aicb/lab18 / ├──main.py (entry point)
054 Tổng kết — Key Takeaways / Những ý chính cần nhớtrước khi sang bài tiếp theo / 1
055 Tiếp theo & Bài tập / Ngày 19: GraphRAG & Knowledge / Graphs
056 Hỏi & Đáp
057 Cảm ơn! / AICB-P2T3 · Ngày 18 · Production RAG

## t3-d02-material_muskv2oc_9vrfcw · Day 18 - Production RAG - Thầy Tùng  (79 pages)

001 Production RAG / AICB-P2T3 · Ngày 18 · Từ Demo 60% Đến Production 85%+ / Trần Quang Thiện
002 ? / HÃY SUY NGHĨ... / “RAG pipeline demo chạy ngon, nhưng
003 Nội Dung Bài Học / 1 · Map & Compass / 2 · Offline — ingest
004 Mục Tiêu Ngày 18 / ■Chẩn đoán pipeline hỏng — Error Tree, không đoán mò / ■OFFLINE: hierarchical/late chunk, contextual, enrichment
005 Deliverable Cuối Ngày / src/ (5 module hoàn chỉnh) + analysis/ (RAGAS report + failure analysis) / ■m1_chunking.py— hierarchical chunking (parent 2048 / child 256)
006 1 / PHẦN 01 / Map & Compass
007 RAG = OFFLINE + ONLINE, Mỗi Bước Đều Có Thể Hỏng / OFFLINE / 1 lần
008 Đọc Lại Bản Đồ: Mỗi Bạn Gọi Tên 1 Bước (1 phút/bạn) / Lần lượt mỗi sinh viên chọn 1 bước trong pipeline và nói trong 1 phút: bước đó làm gì và / có thể sai như thế nào. Mục tiêu — cả lớp cùng nắm bản đồ trước khi đi sâu Phần 02–03.
009 Đánh Dấu: Mỗi Lỗi Thuộc Bước Nào? (5 phút) / Một AI assistant nội bộ trả lời câu hỏi chính sách. Bạn nhận được 4 case lỗi từ log production. / Nhiệm vụ (5 phút): Với mỗi case đánh dấu bước chịu trách nhiệm (Retrieval / Rerank /
010 2 / PHẦN 02 / OFFLINE — Ingestion
011 BƯỚC HIỆN TẠI / Chunking / Cắt tài liệu sao cho giữ ngữ cảnh
012 Chunking: Giữ Ngữ Cảnh Khi Cắt Nhỏ / Chiến lược / Tham số mặc định
013 Hierarchical: Tìm Bằng Child Nhỏ, Trả Lời Bằng Parent Lớn / Mâu thuẫn Day 08: chunk nhỏ = retrieve / chính xác nhưng thiếu ngữ cảnh; chunk
014 Late Chunking: Embed Cả Document Trước, Cắt Sau / Cách thông thường: cắt chunk trước rồi / embed từng cái rời → mỗi chunk mù phần
015 RAPTOR: Retrieval Có “Độ Cao” (Cây Tóm Tắt) / Cách thông thường:  mọi chunk cùng / một  mức  chi  tiết.    Câu  hỏi  tổng  hợp
016 BƯỚC HIỆN TẠI / Enrich / Làm chunk giàu thông tin hơn trước khi embed
017 Contextual Embeddings (Anthropic, 2024) / Chunk thô / + LLM thêm
018 Enrichment Pipeline: Làm Chunk Dễ Tìm Hơn Trước Khi Embed / Raw chunk / Summarization
019 Hypothetical Q&A: Nối Vocab User ↔ Tài Liệu / Vấn đề:  user hỏi bằng  câu hỏi,  tài liệu / viết bằng câu khẳng định. Embedding của
020 Chọn Chunking Theo Loại Dữ Liệu — Không Có “One-Size” / Chiến lược / Tốt cho (data)
021 3 / PHẦN 03 / ONLINE — Retrieval
022 BƯỚC HIỆN TẠI / Retrieve / Tìm đúng chunk cho mỗi query
023 Hybrid + RRF: BM25 Bắt Exact, Dense Bắt Synonym (Nhắc Day 08) / Query / BM25
024 Vấn Đề: Hybrid + RRF Vẫn Miss Chunk Đúng / Đoán  —  Câu trả lời nằm ở 1 token hiếm (mã “X7-204”). RRF gộp rank mức document. / Tại sao vẫn miss?  Nghĩ 30s trước khi xem bảng — gợi ý:  cần so khớp sâu hơn
025 ColBERT: Thoát “Nút Cổ Chai 1 Vector” (Token-Level) / Cách thông thường: bi-encoder ép cả / đoạn vào 1 vector → chi tiết token (tên
026 SPLADE: BM25 “Học Được” — Sparse Nhưng Biết Mở Rộng / Cách  thông  thường:   BM25  chỉ  match / đúng  từ  xuất  hiện.    “nghỉ  phép”  không
027 Tensor / Weighted Fusion: RRF Nhưng Có Học Trọng Số / RRF: cân bằng cứng 0.5 / 0.5 / BM25
028 ColPali: Đừng Parse Tài Liệu — Hãy Nhìn Nó / Cách    thông    thường: / PDF    →
029 Chọn Retriever Theo Nhu Cầu — Vượt Hybrid Khi Nào? / Kỹ thuật / Tốt cho (data)
030 BƯỚC HIỆN TẠI / Rerank / Sắp xếp lại để chunk đúng lên top
031 Two-Stage Retrieval: Recall Rộng → Precision Hẹp / Retrieve / top-20
032 Reranker Landscape: Chọn Theo Chất Lượng / Chi Phí / Ngôn Ngữ / Model / Chi phí
033 BƯỚC HIỆN TẠI / Control Flow / Định hình query & làm sạch context theo vấn đề
034 Mỗi Vấn Đề Một Pattern — Đừng Bật Hết / Vấn đề / Tầng
035 Sửa Query Trước Khi Search — Theo Vấn Đề, Không Mặc Định / HyDE nhắc Day 8 / LLM sinh câu trả lời giả định → embed
036 Corrective RAG (CRAG): Tự Chấm Điểm Rồi Sửa Trước Khi Generate / Cách thông thường: retrieve được gì / thì  nhồi  thẳng  vào  LLM  —  kể  cả  khi
037 Augmentation: Làm Sạch Context Theo Vấn Đề / Tầng giữa Retrieve và Generate  —  Top-k chunks hiếm khi sạch:  dư thừa, mâu thuẫn, / thiếu nguồn. Augment chèn bước làm sạch trước khi đưa vào LLM — bật đúng bước
038 4 / PHẦN 04 / Close the Loop & Limits
039 BƯỚC HIỆN TẠI / Close the Loop / Đo bằng RAGAS, tra Error Tree, sửa đúng tầng
040 Đo: RAGAS 4 Metric — 2 Trục, 2 Tầng / RETRIEVAL — lấy đúng chưa? / Context Recall ≥ 0.75
041 Metric Thấp → Sửa Gì (Error Tree Theo Metric) / Cùng bản đồ pipeline ở Phần 01 — giờ vào từ cột metric thay vì vấn đề. RAGAS chỉ ra tầng / yếu → tra về cùng la bàn → sửa → đo lại.
042 Giới Hạn Nền Tảng: 4 Điểm Mù Của Embedding / Negation insensitivity / “được nghỉ” vs “không được nghỉ” →
043 Giải Pháp Cho Lỗi Embedding Không Fix Được Bằng Data / ■Metadata filtering (temporal, số, source) — sửa temporal & numerical blindness: lọc theo / ngày / con số trước khi search.
044 Ranh Giới: Hôm Nay Dạy Gì, Phần Còn Lại Ở Ngày Nào / Chất lượng ingestion (OFFLINE) + retrieval (ONLINE): chunking, contextual, enrichment, / hybrid/rerank, query transform, augmentation — thường là phần “ăn điểm” lớn của RAG.
045 5 / PHẦN 05 / The production reality check
046 The 90% Prototype Fallback: Tại sao Notebooks lại "nói dối"? / Demo thành công ≠ Production ổn định / Mô hình chạy hoàn hảo trên vài chục tài liệu mẫu trong Jupyter Notebook, nhưng lập tức "vỡ trận" khi triển khai vào môi trường enterprise thực tế
047 Four Pillars of Production RAG (Phần 1: Latency & Cost) / Mục tiêu: Đạt chuẩn Enterprise RAG với Hiệu năng Tối ưu & Chi phí Bền vững / Cân bằng giữa cam kết thời gian phản hồi (SLAs) cực thấp và tối ưu hóa ngân sách vận hành khi scale hệ thống.
048 Four Pillars of Production RAG (Phần 2: Security & Freshness) / Mục tiêu: Đảm bảo An toàn dữ liệu tuyệt đối & Đồng bộ hóa tức thì / Kiểm soát truy cập chính xác cấp độ dòng (Row-level) và duy trì tính thời sự của kiến thức doanh nghiệp mà không làm gián đoạn hệ thống.
049 Production Architecture Blueprint: Luồng xử lý Request / Mục tiêu: Tối ưu hóa toàn trình Pipeline RAG từ Tiếp nhận, Truy vấn đến Sinh phản hồi / Đảm bảo độ trễ thấp, tiết kiệm chi phí token và kiểm soát an toàn dữ liệu nghiêm ngặt cấp Enterprise.
050 Architectural Breakdown: Quyết định thiết kế cốt lõi / Mục tiêu: Đảm bảo tính mở rộng, độ tin cậy và an toàn tuyệt đối cho hệ thống Enterprise RAG / Phân tích chi tiết các thành phần hạ tầng quan trọng từ cổng tiếp nhận, lưu trữ vector quy mô lớn đến tầng kiểm soát an toàn.
051 6 / PHẦN 06 / Enterprise-Scale Offline
052 Thoát khỏi Batch Re-indexing: Giới thiệu CDC / Vấn đề / Full Batch Re-indexing
053 Vận hành CDC: Upsert & Delete Triggers / Nguồn dữ liệu tích hợp / • Confluence: Tài liệu quy trình & tri
054 Zero-Downtime Index Swapping & Blue-Green Deployments / ● / Thách thức: Thay đổi embedding model hoặc chunking schema đòi hỏi re-index toàn bộ
055 Quản lý Alias trong Vector DB: Qdrant & Milvus / Khái Niệm Alias / Lớp Trung Gian
056 Tối ưu hóa tài nguyên với Matryoshka Representation Learning (MRL) / Đặt vấn đề & Giải pháp MRL / ●
057 7 / PHẦN 07 / High-performance Online
058 Semantic Caching: Chặn đứng Request Trùng lặp / User Query / Hỏi / Đồng nghĩa
059 Vận hành Cache: Ngưỡng Cosine Similarity / Cơ chế khớp nghĩa / Tính khoảng cách vector (Cosine Similarity) giữa câu hỏi mới và các key trong cache.
060 Distributed Hybrid Search: Cân bằng Sparse & Dense / 1. Bài toán trọng số cố định / • Cấu hình cố định (ví dụ: 50% BM25 + 50% Vector) không mang lại hiệu quả tối ưu cho mọi loại câu hỏi.
061 Tăng tốc Reranking: Vượt qua Nút cổ chai PyTorch / Nút cổ chai PyTorch / • Độ trễ cao: Cross-Encoder cung cấp độ chính xác vượt trội nhưng gặp điểm nghẽn hiệu năng trên nền tảng PyTorch tiêu chuẩn.
062 Benchmark: Độ trễ Rerank dưới 30ms / Mục tiêu Performance SLA / • Đưa thời gian chạy rerank cho top-50 candidates xuống dưới 30ms để đáp ứng điều kiện Production.
063 Vector DB Decision Framework cho Production / Quyết định lựa chọn hạ tầng Vector Database phụ thuộc hoàn toàn vào quy mô dữ liệu, kiến trúc hệ thống hiện tại và / yêu cầu vận hành thực tế của doanh nghiệp.
064 8 / PHẦN 08 / Production Observability,
065 Continuous Monitoring: Telemetry Bất đồng bộ / User Query / User Request
066 Tracking Retrieval Drift: Khi Dữ liệu & Query "Lệch Pha" / 1. Hiện tượng (Concept Drift) / • Ngôn ngữ và xu hướng câu hỏi của người dùng thay đổi liên tục theo thời gian.
067 Automated Regression Testing: Bộ dữ liệu chuẩn (Golden Dataset) / 1. Nguồn gốc Golden Dataset / • Khai thác và tinh chỉnh hơn 200+ câu hỏi chuẩn từ log thực tế của production.
068 CI/CD Quality Gates: Ngưỡng Chấp nhận Production / Tiêu chí Đánh giá (Evaluation Metric) / Ngưỡng Chuẩn
069 Thử nghiệm An toàn: Shadow Deployments & A/B Testing / Shadow Deployment (Chạy ngầm đo đạc) / • Sao chép một phần traffic thực tế sang cấu hình retrieval thử nghiệm ngầm.
070 1 / Hands-on 18 / Đủ lý thuyết — giờ tự tay dựng pipeline trên dữ liệu thật, đo
071 Lab 18: 5 Module → Full Pipeline / Cá nhân — 2h implement + 30 phút reflection / Implement tất cả 5 module (TODO markers trong code):
072 So Sánh: Naive vs Production vs +Nâng Cao / Pipeline / Cấu hình
073 Mỗi Tầng Có Núm Vặn Riêng — Vặn Đúng Tầng, Đừng Đổi Model / OFFLINE / Chunk
074 2 / Key Takeaways / Production RAG là kỹ thuật chẩn đoán + sửa đúng tầng, không
075 Tổng kết — Key Takeaways / 1 / Chẩn đoán trước, sửa sau.  RAG = OFFLINE + ONLINE; dùng Error Tree để biết tầng nào
076 Tài Liệu Tham Khảo / 1.  Anthropic. Introducing Contextual Retrieval (2024). / https://www.anthropic.com/news/contextual-retrieval
077 Tiếp theo & Bài tập / Day 19 — GraphRAG & Knowledge / Graphs
078 Hỏi & Đáp / Production RAG: bạn sẽ sửa tầng nào / đầu tiên trong hệ thống của mình?
079 Cảm ơn! / Trần Quang Thiện · AICB Phase 2 · Track 3 / Production RAG — Ngày 18

## t3-d04-material_murrg37w_txz4m6 · Bài 15 (73 pages)

001 Memory Systems for Agents / AICB-P2T3 · Ngày 17 · Chương 4 — Agent Nâng Cao / Giảng viên
002 ? / HÃY SUY NGHĨ... / “Tại sao agent của bạn quên
003 Nội dung bài học / 1. Tại sao Agent “quên”? / 2. Context Engineering Framework
004 01 / Tại sao Agent “quên”? / Context window có giới hạn — và hầu hết agent không có
005 Agent hiện tại — Stateless by default / Session 1 / LLM
006 Analogy: BộnhớAgent giống não người / Não người / Working Memory
007 Window 1M tokens — vì sao agent vẫn “quên”? / 1M / tokens — win-
008 Checkpoint 1 — Tại sao Agent “quên”? / CÂU 1/3 / Model mới có context window 1M tokens. Phát biểu nào đúng?
009 Checkpoint 1 — Tại sao Agent “quên”? / CÂU 2/3 / Session 1 user nói “tôi chỉcode Python”. Session 2 (process mới) agent lại hỏi “bạn
010 Checkpoint 1 — Tại sao Agent “quên”? / CÂU 3/3 / Thảo luận nhóm — 5 phút
011 02 / Context Engineering Frame- / work
012 7 Context Layers — Kiến trúc thông tin cho Agent / Policy Context — Guardrails, safety rules / Tool Context — Function outputs, API responses
013 Token Budget — Heuristic khởi điểm cho context window / 10% / Short-term
014 Context Engineering 2025–2026 — Từnguyên tắc đến API / 4 kỹthuật cho task dài (Anthropic, / 09/2025)
015 Checkpoint 2 — Context Engineering / CÂU 1/3 / Agent sắp chạm token limit. Theo quy tắc trim của bài, phần nào bịcắt trước tiên?
016 Checkpoint 2 — Context Engineering / CÂU 2/3 / Team đặt memory budget = 20% context window. Đổi sang model window 1M →
017 Checkpoint 2 — Context Engineering / CÂU 3/3 / Coding agent làm việc trên repo 2 triệu dòng. Cách tiếp cận just-in-time (Anthropic,
018 03 / Cognitive Memory Model — 4 / loại Memory
019 4 loại Memory — Cognitive Model cho AI Agents / Short-term (Working) / Context window buffer
020 Short-term Memory — Context Window Management / Buffer / M1
021 Long-term Memory với Redis — Persistent Cross-Session / Conversation / LLM Extract
022 Memory Management Flow — Buffer →Summarize →Store / 1. Buffer / (Context Window)
023 Checkpoint 3 — Cognitive Memory Model / CÂU 1/3 / Phân loại đúng: (i) “User thích câu trảlời ngắn” · (ii) “Tuần trước debug API: thửX fail,
024 Checkpoint 3 — Cognitive Memory Model / CÂU 2/3 / Team lưu mọi fact của user trong 1 Redis Set user:42:facts, đặt EXPIRE 30 ngày lúc
025 Checkpoint 3 — Cognitive Memory Model / CÂU 3/3 / Thảo luận nhóm — 5 phút
026 04 / Implementation Deep-Dive / Code-level: LangGraph nodes cho mỗi memory type
027 LangGraph Memory — Code-Level (LangGraph 1.x) / python / class State(MessagesState):
028 Episodic Memory — Learning từPast Trajectories / Task: debug API / Trajectory: tried X, Y
029 Học từkinh nghiệm — Episodic →Procedural (2025–2026) / Hướng (mốc) / Ý tưởng
030 Semantic Memory — Vector DB cho Knowledge Retrieval / Domain Docs / Embed
031 Memory Architecture — Combining All 4 Types / Agent / retrieve(query)
032 Checkpoint 4 — Implementation Deep-Dive / CÂU 1/3 / Trong LangGraph 1.x, cặp nào đúng?
033 Checkpoint 4 — Implementation Deep-Dive / CÂU 2/3 / Agent chỉlưu episode khi task thành công. Theo ReasoningBank (Google, 09/2025),
034 Checkpoint 4 — Implementation Deep-Dive / CÂU 3/3 / Bug production: user B nhận gợi ý dựa trên sởthích của user A. Nguyên nhân có khả
035 05 / Frameworks chuyên dụng & / Privacy
036 Mem0 & Zep — Managed Memory Layers / Mem0 / ■LLM extract facts →
037 Benchmark Memory — Đọc sốliệu vendor thếnào? / Benchmark / Đo gì
038 Managed Memory 2026 — Bức tranh lựa chọn / Nhóm / Ví dụ(mốc)
039 Quyền riêng tư, Bảo mật & GDPR / Privacy-by-Design — Mặc định / không lưu PII. User phải explicit
040 Khung pháp lý 2026 cho agent có memory / Việt Nam / ■Luật Bảo vệdữliệu cá nhân
041 Checkpoint 5 — Frameworks & Privacy / CÂU 1/3 / Mem0 paper (04/2025) báo cáo “91% lower p95 latency” và “>90% token savings”.
042 Checkpoint 5 — Frameworks & Privacy / CÂU 2/3 / User yêu cầu “xóa mọi thứvềtôi”. Team đã xóa profile trong Redis. Còn thiếu gì?
043 Checkpoint 5 — Frameworks & Privacy / CÂU 3/3 / Thảo luận nhóm — 7 phút
044 06 / Xu hướng 2025–2026 trong / Agent Memory
045 Trend Radar 2025–2026 / 1. Cross-session memory — Từthread / history sang user-scoped profile, open
046 1.A — Vì sao cần cross-session memory? / Vì sao pattern này bùng lên? — / User không còn chấp nhận agent
047 1.B — Kiến trúc cross-session memory / Thread A / Thread B
048 2.A — Vì sao compaction tốt hơn full transcript? / Vấn đềgốc — Conversation dài / làm context window bịlấp bởi
049 2.B — Pipeline compaction / 1. Detect pressure / token budget / latency
050 3.A — Identity files như một control plane / File / Vai trò phù hợp
051 3.B — Stack tốt nhất: files + retrieval memory / Dùng AGENTS.md / SOUL.md đểcốđịnh / persona, workflow, default actions và
052 4.A — Heartbeat loops: use case phù hợp / User sessions / Heartbeat / wake-up
053 4.B — Heartbeat risks và guardrails / Lưu ý: Rủi ro chính / Heartbeat + persistent memory khiến prompt
054 4.C — Memory poisoning: bằng chứng 2024–2026 / Mốc / Sựkiện
055 5.A — Karpathy “LLM Wiki” / compiled KB / Raw sources / papers, docs, transcripts
056 5.B — Khi nào compiled KB tốt hơn plain RAG? / Plain RAG đủtốt khi nào? — / Hỏi đáp 1 lần trên corpus lớn, tài
057 Checkpoint 6 — Xu hướng 2025–2026 / CÂU 1/3 / Vai trò đúng nhất của AGENTS.md / SOUL.md / MEMORY.md trong agent hiện đại là gì?
058 Checkpoint 6 — Xu hướng 2025–2026 / CÂU 2/3 / Heartbeat agent đọc inbox mỗi 30 phút và được phép ghi MEMORY.md. Một email chứa:
059 Checkpoint 6 — Xu hướng 2025–2026 / CÂU 3/3 / Thảo luận nhóm — 7 phút
060 07 / Demo & Thực hành / Xem agent nhớuser preferences qua 3 sessions
061 Agent nhớUser Preferences qua 3 Sessions / LIVE DEMO / 1. Session 1: User nói “tôi thích Python, không thích Java” →agent ghi vào
062 Lab #17 / LAB #17 / Mục tiêu: Build Multi-Memory Agent với LangGraph
063 Lab 17 — Các bước thực hành / 1. Implement 4 memory backends: LangGraph checkpointer (short-term — thay / ConversationBufferMemory đã deprecated), Redis hoặc LangGraph Store (long-term),
064 Tổng kết — Key Takeaways / Những ý chính cần nhớtrước khi sang bài tiếp theo / 1
065 Tiếp theo & Bài tập / Bài tiếp theo / Ngày 18: Production RAG
066 Tài liệu tham khảo (cập nhật 10/2026) / 1. Anthropic (09/2025). Effective context engineering for AI agents. / anthropic.com/engineering/effective-context-engineering-for-ai-agents
067 Hỏi & Đáp / Memory nào là “must-have” cho production agent? / Khi nào thì dùng framework (Mem0, Zep) vs tựbuild?
068 Hỏi & Đáp — Câu hỏi mở(1/2) / THẢO LUẬN / Q1. Memory nào là “must-have” cho production agent?
069 Hỏi & Đáp — Câu hỏi mở(2/2) / THẢO LUẬN / Q5. Agent nên ghi nhớngay trong lượt chat (hot path) hay đểjob nền xửlý?
070 Cảm ơn! / AICB-P2T3 · Ngày 17 · Memory Systems for Agents / github.com/vinuni-aicb
071 Backup 1/3 · Short-term & Long-term: kiểu thiết kế / Short-term (working) / Kiểu thiết kế
072 Backup 2/3 · Episodic & Semantic: kiểu thiết kế / Episodic / Kiểu thiết kế
073 Backup 3/3 · Framework nào phủloại memory nào? / Framework / Short

## t3-d05-material_muulzmqz_nxp578 · Phase 2 Day 4 GraphRAG & Knowledge Graphs (47 pages)

001 GraphRAG & Knowledge Graphs / AICB-P2T3 · Ngày 19 · Chương 4 — GraphRAG / Giảng viên: M.Sc Trần Minh Tú
002 ? / HÃY SUY NGHĨ... / “Khi user hỏi vềmối quan hệ
003 Agenda / 1. Vấn đềcủa Flat-RAG: Khi Vector Search thất bại / 2. Nền tảng vềKnowledge Graph (KG)
004 1 / Khi nào Flat RAG thất bại? / Giới hạn của vector search khi cần suy luận quan
005 Các vấn đềkhi sửdụng Flat RAG / Luật pháp / Tin Tức
006 Các phương pháp cải thiện / Sửdụng Agent / Graph RAG
007 Các phương pháp cải thiện – Sufficient Context Agent / Sufficient_context_agent.py
008 Các phương pháp cải thiện – GraphRAG / Câu hỏi / After
009 GraphRAG có thểlàm gì ?
010 2 / Knowledge Graph / Fundamentals
011 Graph Theory 101 – Các thành phần / Vertex /Node (Đỉnh/Nút): Các thực thểtrong dữliệu / Edges/Relationship (Cạnh/Mối quan hệ): Kết nối giữa
012 [Không thể trích xuất trang 12: trích xuất quá 15 giây]
013 Graph Theory 101 / Sam Altman / OpenAI
014 Knowledge Graph — Nodes, Edges, Triples / Sam / Altman
015 Bộba (The Triple) - Đơn vịcốt lõi / Knowledge Graphs được xây dựng từcác Triples (Bộba). Đây là nguyên tửcơ / bản đểcấu trúc hóa kiến thức nhân loại.
016 Graph Database: Property Graphs vs. RDF
017 Cypher: Ngôn ngữtruy vấn Graph (SQL của Graph) / search / Cách chúng ta truy vấn cơ sởdữliệu đồthị.
018 Graph Data Model / Query Cost sẽtăng theo / cấp sốnếu k tăng
019 Graph Data Model - Example / John / Bob
020 Graph Data Model - Example / Buyer / Shop
021 From Graph Model to Ontology Graph
022 Các loại Graph có thểxây dựng
023 Các loại Graph có thểxây dựng
024 Các loại Graph có thểxây dựng / Graph với Chunk, Entity và Community / Graph với Document Structure
025 Các loại Graph có thểxây dựng / Graph với Chunk Sibling / Graph với FAQ
026 Graph Governance – Ontology
027 3 / Graph Build Pipeine / Nodes, Edges, Triples — nền tảng của graph-based
028 The Extraction Bottleneck
029 Các phương pháp trích xuất / Giảng viên (VinUni) / AICB · Ngày 19
030 Graph Store / ! Cần lựa chọn đúng Graph Store tuỳvào mục đích sửdụng
031 4 / Graph Retrieval Pipeline / Hành trình từCâu hỏi của User đến Câu trả
032 Tổng quan Pipeline
033 Bước 1 & 2: Trích xuất & Khởi tạo Node gốc (Seed)
034 Bước 3: Duyệt Đồthị(Breadth-First Search - BFS)
035 Bước 4: Văn bản hóa Đồthịcon (Textualization)
036 Bước 5: LLM Sinh câu trảlời
037 Hybrid Search (Sựkết hợp hoàn hảo) / Giảng viên (VinUni) / AICB · GraphRAG
038 Các Lỗi thường gặp (Failure Modes)
039 Recommended Practices
040 5 / Chiến lược Doanh / nghiệp & ROI
041 Thực tếvềChi phí: Indexing vs. Querying
042 Decision Framework: Khi nào dùng Flat RAG và Graph RAG
043 6 / Thực hành
044 Lab #19 / Mục tiêu: Build Knowledge Graph + GraphRAG agent, multi-hop accuracy / vượt flat RAG + 20%. Sửdụng lại 2 knowledge base luật pháp và tin tức
045 Lab 19 — Các bước thực hành / 1. Entity extraction: Dùng LLM-based NER trên domain corpus, output triples / (subject, predicate, object)
046 Tiếp theo & Bài tập / Ngày 20: Multi-Agent Systems / “Single
047 Cảm ơn! / AICB-P2T3 · Ngày 19 · GraphRAG & Knowledge Graphs / https://github.com/VinUni-AI20k/K4-Track3-Day19-

## t3-d06-material_muwbdh7w_toum0r · day20-multi-agent-systems (78 pages)

001 Multi-Agent Systems 2026 / AICB-P2T3 · Ngày 20 · Chương 4 — Từhệđa agent / đến harness, tác vụdài hạn và agent tựtiến hoá
002 ? / HÃY SUY NGHĨ... / “16 agent chạy song song, chi phí
003 Mười chương, mỗi chương trảlời một câu hỏi / Ch. / Chủđề
004 Chương 1 — Một agent hay nhiều agent? / Câu hỏi của chương: Khi nào tách thành nhiều agent cho kết quảtốt hơn một agent? / Hệđa agent (multi-agent) chỉđáng dùng khi việc chia được thành các phần độc lập
005 Tách agent khi một cửa sổngữcảnh không đủchứa / Mỗi agent là một mô hình (model) gọi công cụ(tool) trong vòng lặp agent (agent loop); harness (phần / mềm bao quanh mô hình: quyết định mô hình thấy gì, làm được gì, khi nào dừng) cấp cho mỗi agent một
006 Bài phân rã được: +80,8%; bài tuần tự: −70,0% / Nâng cao / Kim et al. (Google Research, v3): 5 kiến trúc × 3 họmô hình × 6 bộđánh giá chuẩn (benchmark).
007 Chất lượng tăng 90,2%, token gấp khoảng 15 lần / +90,2% / so với một agent Opus 4,
008 Năm câu hỏi quyết định có thêm agent hay không / Câu hỏi / Nếu trảlời “không”
009 Chương 2 — Mẫu thiết kếphối hợp / Câu hỏi của chương: Chọn mẫu phối hợp nào cho một bài toán cụthể? / Chọn mẫu phối hợp theo hình dạng phụthuộc giữa các tác vụ: bắt đầu từluồng công
010 Luồng công việc cốđịnh trước, agent tựchủsau / 1. Nối chuỗi / (prompt chaining)
011 Sáu cấu trúc kết nối, mỗi cấu trúc một điểm hỏng / Agent điều phối / Phân cấp
012 Điều phối–thực thi: chỉgiao lại phần còn thiếu / câu hỏi của người dùng / Agent điều phối: lập kếhoạch,
013 Khung mã điều phối có hạn giờvà kết quảdởdang / Nâng cao / sem = asyncio.Semaphore(4)
014 Cùng sốcâu trảlời, tựnhất quán hơn tranh luận / Con sốhay được trích “tranh luận giảm ảo giác (hallucination) 15–25%” không có nguồn. Dữliệu thật: / Một câu trảlời (1)
015 Định tuyến giảm 63% chi phí khi độkhó có hai đỉnh / Phép tính / Mô hình nhỏ= 1, mô hình lớn = 10; 70% câu dễ, 30% câu khó: 0,7 × 1 + 0,3 × 10 = 3,7 thay vì 10, giảm 63%.
016 Chương 3 — Kiểu lỗi của hệđa agent / Câu hỏi của chương: Hệđa agent hỏng ởđâu, và sửa từđâu? / Ba nhóm lỗi của hệđa agent (thiết kếhệthống, phối hợp giữa các agent, xác minh) đều
017 MAST: nhóm lỗi lớn nhất là thiết kếhệthống / Cemri et al. (NeurIPS 2025): 1.642 vết thực thi từ7 hệđa agent mã nguồn mở; tỷlệthất bại 41%–86,7% / tuỳhệ.
018 Lỗi tích luỹ: 99% mỗi bước còn 37% sau 100 bước / n / 100
019 Mỗi kiểu lỗi có một điểm sửa ngoài mô hình / Kiểu lỗi (MAST) / Biểu hiện trong vết thực thi
020 Kiểm tra nhanh: chương 1–3 / 1. Hệ3 agent đạt 78%, một agent đạt 70%. Cần thêm thông tin gì trước khi kết luận hệ3 agent tốt / hơn?
021 Chương 4 — Harness / Câu hỏi của chương: Phần mềm bao quanh mô hình quyết định điều gì? / Một agent là mô hình cộng harness (phần mềm bao quanh mô hình); với cùng một mô
022 Agent là mô hình cộng harness / HARNESS / MÔ HÌNH
023 Cùng một mô hình, đổi harness: 43 →72 lời giải / Thí nghiệm có kiểm soát (08/2026) / Cùng mô hình, 169 tác vụSWE-bench Verified,
024 Vòng lặp agent chỉdừng khi có bằng chứng / Nâng cao / Vòng lặp agent (agent loop): gọi công cụ, nhận kết quả, lặp lại đến khi xác minh xong việc.
025 Chỉcưỡng chếmới ngăn được hành động / Chỉdẫn (guidance) là chữmô hình đọc; cưỡng chế(enforcement) là mã chạy ngoài mô hình. / Lớp
026 Công cụlà giao diện: đầu ra gọn, lỗi nêu cách sửa / Kém / get_logs()
027 Mười hai câu hỏi đểrà soát một harness / Ngữcảnh / □✓
028 Chương 5 — DeepSeek Harness / Câu hỏi của chương: DeepSeek Harness được thiết kếthếnào, hoạt động ra sao, và vì sao được chú ý? / DeepSeek Harness (dsh) là harness mã nguồn mởdựng hoàn toàn từplugin (mô-đun cắm
029 “DeepSeek harness” có ba nghĩa khác nhau / Khi một bài báo nói “X dùng harness của Y”, câu hỏi đầu tiên là: thành phần nào vừa đổi? / Môi trường tổng hợp
030 Được chú ý vì ba lý do, kèm ba hạn chế / Ba lý do cộng đồng chú ý / 1. Mô hình và harness cùng một hãng. Kết quả
031 Mọi thành phần là plugin, Cordis ghép chúng lại / Nâng cao / ctx: kho dịch vụ
032 Một bản dsh là phép ghép ba lớp cấu hình / Profile / web, headless,
033 32 điểm thay thếcho phép đổi từng thành phần / Nâng cao / Điểm thay thế
034 Mô hình chỉthấy những gì đã ghi vào nhật ký / turn/start / agent/pre-step
035 Lời gọi công cụqua năm chặng trước khi có kết quả / 1. Ghi nhật ký / ghi tool/call trước
036 Quyền và sandbox là hai cơ chếđộc lập / Cơ chế1: sandbox / lệnh chạy thì chạm được gì
037 Subagent có thểlà dsh, Codex hoặc Claude Code / Nâng cao / Agent chính
038 dsh ởđầu linh hoạt của phổthiết kế / ít công cụ, ít mơ hồ, dễđọc vết thực thi / nhiều năng lực, nhiều cấu hình, nhiều chỗsai quyền
039 Năm thiết kếđáng mượn từdsh / Năm thiết kếđáng mượn cho harness của riêng mình / 1. Nhật ký chỉghi thêm là nguồn sựthật. Mọi thứmô
040 Chương 6 — Thiết kếngữcảnh giữa các agent / Câu hỏi của chương: Cái gì được chuyển giữa các agent, cái gì bịcắt, cái gì còn lại sau khi đặt lại ngữcảnh? / Giữa các agent, ngữcảnh đi qua hai kênh là brief (bản mô tảviệc giao cho subagent)
041 Brief là toàn bộngữcảnh mà subagent nhận được / Thiếu các quyết định đã có, subagent hiểu sai: brief là ngữcảnh được đóng gói có chủđích. / BRIEF (lead ^> subagent)
042 Subagent đọc 300k token, agent chính chỉnhận 7,5k / ngữcảnh của agent chính / chỉdẫn hệthống + tác vụ
043 Nạp skill theo nhu cầu: 5k token thay vì 150k / skills/ / pdf-report/
044 Chỉtrạng thái ngoài ngữcảnh sống sót khi đặt lại / Lớp trạng thái / Giữcái gì
045 Bộnhớđệm và trần tài nguyên quyết định chi phí / Nâng cao / Phép tính bộnhớđệm (giá 2025)
046 Chương 7 — Agent chạy dài hạn / Câu hỏi của chương: Điều gì giúp agent làm việc hàng giờmà không lạc mục tiêu? / Tác vụcàng dài thì lỗi tích luỹvà trôi mục tiêu càng nặng; agent chạy được hàng giờkhi
047 Độdài tác vụagent làm được gấp đôi sau 7 tháng / Độdài tác vụ50% (METR): thời gian chuyên gia người cần cho việc mà agent làm xong với xác suất 50%. / thời gian chuyên gia cần đểlàm tác vụ(thang log)
048 Bốn nguồn trôi mục tiêu, mỗi nguồn một cơ chếchặn / Nguồn / Dấu hiệu trong vết thực thi
049 Chạy nhiều phiên nhờdanh sách tính năng và git / Agent khởi tạo / (initializer)
050 Nhiều agent cần khoá nhận tác vụhoặc tách vai / Trình biên dịch C (Anthropic) / Trình duyệt (Cursor)
051 Vòng lặp dừng khi qua cổng kiểm soát chất lượng / lập kếhoạch / làm
052 Chỉso sánh sốđo dài hạn khi cùng một hệthống / Nâng cao / Bộđánh giá chuẩn
053 Chương 8 — Agent tựtiến hoá / Câu hỏi của chương: Agent “tựtiến hoá” thực chất thay đổi cái gì, và khi nào thay đổi đó đáng giữ? / Agent tựtiến hoá (self-evolving) thường không sửa trọng sốmà sửa một thành phần bên
054 Năm thành phần có thểtiến hoá, từdễgỡđến khó gỡ / HARNESS — phần bao quanh mô hình / Ngữcảnh và prompt
055 ACE: sửa từng mục của playbook, mô hình đóng băng / Generator / làm tác vụ
056 Bài học dạng mã chạy được đáng tin hơn ghi chú / ReasoningBank / Chưng cất chiến lược từcả
057 Tựsửa mã nâng SWE-bench từ20,0% lên 50,0% / Nâng cao / Bản sửa được nhận trởthành agent sửa ởvòng sau: tựcải tiến đệquy (recursive self-improvement).
058 Cập nhật harness không đồng nghĩa với có lợi / Nâng cao / Nghiên cứu 05/2026 tách hai năng lực: viết bản cập nhật và hưởng lợi từnó.
059 Agent thấy hàm chấm sẽtối ưu hàm chấm / Reward hacking — tăng điểm của hàm đo mà / không đạt mục tiêu mà hàm đo đại diện.
060 Vòng rút bài học an toàn: mỗi dòng chặn một rủi ro / def after_task(playbook, task, trace, verdict): / log_usage(playbook, trace)
061 Chương 9 — Đánh giá, quan sát và bảo mật / Câu hỏi của chương: Làm sao biết một hệđa agent đúng, và giữnó an toàn? / Chấm đáp án cuối là chưa đủ: hệđa agent cần đánh giá cảquỹđạo thực thi (trajectory),
062 Đáp án đúng vẫn có thểdo may: cần chấm cảquỹđạo / 1. Kết quả: đúng hoặc sai, / kiểm tra tựđộng được
063 Chạy song song: 11,2 s; tuần tự: khoảng 22 s / invoke_agent lead / 12.4s 43k tok
064 Ba chân lethal trifecta có thểnằm ởba agent / Agent nghiên cứu / đọc web
065 Người chỉduyệt hành động không đảo ngược được / Hành động / Ai quyết
066 Bốn câu hỏi dẫn tới thiết kế; mặc định một agent / Việc tách được thành / các phần độc lập?
067 Trình diễn: một agent so với nhiều agent / LIVE DEMO / 1. Câu hỏi: “So sánh 5 nhà cung cấp kho vector vềgiá, giới hạn và giấy
068 Lab #20 / LAB #20 / Mục tiêu: Agent tựtiến hoá: dựng harness bằng Deep Agents, rồi so ba điều
069 Ba điều kiện × sáu tác vụ, chấm tựđộng / Điều kiện / Agent
070 Mốc đóng băng chặn việc chọn skill theo điểm / 1 Cài đặt / agent,
071 Bốn file cần cài, mỗi file gắn một chương / Tệp cần hoàn / thành
072 Điểm lab dựa trên phân loại lỗi có bằng chứng / Phân loại lỗi (mỗi dòng cần bằng chứng) / A
073 QUIZ Tuần 4 và MILESTONE 1 nộp sau một tuần / QUIZ Tuần 4 (20 phút) / 10 câu: 7 trắc nghiệm và 3 trảlời ngắn
074 Tổng kết: mỗi chương dạy một luận điểm / Chương 1: / chỉtách nhiều agent khi việc chia được thành phần độc lập hoặc vượt một cửa sổngữcảnh.
075 Tiếp theo & Bài tập / Bài tiếp theo / Ngày 21: tinh chỉnh (fine-tuning)
076 Tài liệu tham khảo / 1. / Kim et al. Towards a Science of Scaling Agent Systems. arXiv:2512.08296 v3.
077 Hỏi & Đáp / Với bài toán ởđơn vịcông tác: dùng một agent hay nhiều / agent, và harness còn thiếu mục nào trong danh sách kiểm tra?
078 Cảm ơn! / AICB-P2T3 · Ngày 20 · Hệđa agent, harness và agent tựtiến hoá / github.com/vinuni-aicb

## t3-d06-material_muvawtzb_vgqhj3 · Multi-Agent Systems 2026 (Day 20 - Track 3) (88 pages)

001 Multi-Agent Systems 2026 / AICB-P2T3 · Ngày 20 · Chương 4 — Từhệmulti-agent / đến harness, long-horizon và self-evolving agents
002 ? / HÃY SUY NGHĨ... / “16 agent song song, 20.000 USD →
003 Hôm nay nằm ởđâu trong Track 3 / Bốn ngày vừa qua bạn đã xây một agent tốt. Hôm nay: ghép nhiều vòng lặp lại với nhau — và biết khi nào / không nên ghép.
004 Lộtrình buổi học / # / Module
005 01 / Single-Agent hay / Multi-Agent?
006 Agent, harness, multi-agent system / Ý tưởng: Một hệmulti-agent là cách chia context và quyền ghi, không phải cách chia / “vai diễn”.
007 Lý do thật đểtách agent: context window / Ẩn dụ“team dựán” đúng một nửa. Lý do kỹthuật là: một context window có giới hạn, và nó bịô nhiễm / khi đọc quá nhiều.
008 Bằng chứng có kiểm soát: 260 cấu hình / Nâng cao / Kim et al. (Google Research, v3): 5 kiến trúc × 3 họLLM × 6 benchmark — cùng tool, prompt, compute.
009 Chất lượng mua bằng token / +90,2% / so với 1 agent Opus 4 —
010 Tranh luận 2025, hội tụ2026 / Hai đội từng được trích như hai phe đối lập. Năm 2026 họmô tảcùng một hình dạng hệthống. / Cognition, 06/2025
011 Năm câu hỏi trước khi thêm agent / Bản cũ của bài này có quy tắc “trên 80% thì đừng thêm agent” — không tìm thấy nguồn. Thay bằng câu / hỏi bạn đo được.
012 Ba bài toán, ba câu trảlời / Nâng cao / Áp năm câu hỏi vào ba yêu cầu thật của một đội sản phẩm.
013 02 / Topology & Pattern / Từworkflow cốđịnh đến swarm — mỗi mũi tên là một lần
014 Workflow trước, agent sau / 1. Prompt chaining / tách bước
015 Atlas topology: sáu hình dạng / Supervisor / Phân cấp
016 Orchestrator–worker: một vòng đầy đủ / câu hỏi người dùng / Lead: lập kếhoạch, lưu plan vào memory, viết 3 brief
017 Orchestrator skeleton: deadline, semaphore, gaps / Nâng cao / sem = asyncio.Semaphore(4)
018 Failure handling: worker treo, crash, trảrác / Nâng cao / Sựcố
019 Debate: so với đối chứng đúng thì sao? / Con sốhay được trích “debate giảm hallucination 15–25%” không có nguồn. Dữliệu thật: / Prompt thường (1)
020 Routing: pattern rẻnhất có lợi thật / Routing — phân loại đầu vào rồi chuyển tới / handler chuyên biệt: câu dễ→model nhỏ, câu
021 Chọn framework 2026: theo việc, không theo hãng / Bạn cần / Lớp công cụ
022 Pattern: ba tầng hiểu / Ý tưởng: Chọn pattern theo hình dạng phụthuộc của việc, không theo framework. / Cơ bản
023 03 / Multi-Agent Failure Modes / MAST: 14 kiểu lỗi, 3 nhóm — và phần lớn không nằm ở
024 MAST: taxonomy 14 failure mode / Cemri et al. (NeurIPS 2025): 1.642 trace từ7 framework mã nguồn mở; tỷlệthất bại 41%–86,7% tuỳhệ. / Lặp lại bước (step repetition)
025 Error compounding: lỗi nhân lên theo sốbước / Ý tưởng: Độtin cậy từng bước nhân với nhau; lỗi không kiểm thì lan sang agent khác. / Cơ bản
026 Từfailure mode đến cách sửa / Kiểu lỗi (MAST) / Trông như thếnào trong trace
027 Kiểm tra nhanh — module 1–3 / 1. Một hệ3 agent đạt 78%, một agent đạt 70%. Bạn cần thêm thông tin gì trước khi kết luận hệ3 / agent tốt hơn?
028 04 / Harness Engineering / Cùng một bộtrọng số, khác phần mềm bao quanh — khác
029 Agent = Model + Harness / HARNESS / MODEL
030 Bằng chứng: cùng trọng số, khác kết quả / Thí nghiệm có kiểm soát (08/2026) / Cùng model, cùng 169 task SWE-bench Verified,
031 Harness: ba tầng hiểu / Ý tưởng: Harness là hệđiều hành nhỏmà mô hình chạy bên trong. / Cơ bản
032 Anatomy của agent loop / Nâng cao / def run(task, model, tools, policy, sandbox):
033 Design spectrum: minimal ↔full-featured / ít tool, ít mơ hồ, dễđọc trace / nhiều năng lực, nhiều cấu hình, nhiều chỗsai quyền
034 “DeepSeek harness” — ba thứkhác nhau / Nâng cao / Bài tập đọc tin tức: khi ai đó nói “X dùng harness của Y”, hỏi ngay thành phần nào vừa đổi.
035 Guidance không phải enforcement / Lớp / Ví dụ
036 Tool design: ACI (agent–computer interface) / Kém / get_logs()
037 Khi agent viết code, kỹsư viết gì? / OpenAI (02/2026) gọi việc này là harness engineering: một sản phẩm nội bộbắt đầu từrepo rỗng, / Codex viết gần như toàn bộcode.
038 Checklist review một harness (mang vềdùng) / Context / □✓
039 05 / Context Engineering cho / Multi-Agent
040 Subagent = context firewall / context của agent chính / hệthống + task
041 Cái gì còn sống sau khi context reset? / Lớp trạng thái / Giữcái gì
042 Bài học context từmột agent production / Nâng cao / Manus (2025): input dài gấp ∼100 lần output, nên chi phí và độtrễdo KV-cache quyết định.
043 Skills: nạp theo nhu cầu (progressive disclosure) / skills/ / pdf-report/
044 Brief template khi giao việc cho subagent / Cognition: worker hiểu sai vì nhận một câu lệnh trơ trọi, thiếu các quyết định đã có. Brief là context / được đóng gói có chủđích.
045 Ba sản phẩm 2026, cùng một hình dạng / Nâng cao / Claude Code: Dynamic
046 Claude Code: bốn cách chạy việc nhiều bước / Subagent / Skill
047 Context engineering: ba tầng hiểu / Ý tưởng: Thứđi qua ranh giới agent là brief và kết quả, không phải toàn bộlịch sử. / Cơ bản
048 06 / Long-Horizon Agents / Từvài phút đến vài tuần: đo thếnào, giữmục tiêu thếnào
049 Time horizon: đo độdài việc agent làm được / METR time horizon 50%: độdài việc (tính bằng thời gian chuyên gia người) agent làm xong với xác suất / 50%.
050 Vì sao việc dài khó hơn việc ngắn / Ý tưởng: Việc dài = nhiều bước hơn + nhiều lần reset context hơn + nhiều cơ hội tựtuyên / bố“xong” sớm.
051 Long-running harness: agent chạy nhiều phiên / Initializer agent / (phiên đầu tiên)
052 Case study: 16 agent viết một trình biên dịch C / 16 / agent song song
053 Case study: hàng trăm agent, một codebase / Lần 1: ngang hàng + khoá / file chung
054 Loop until gate: lặp tới khi qua quality gate / lập kếhoạch / làm
055 Bốn nguồn drift của long-horizon agent / Lực / Dấu hiệu trong trace
056 Đọc benchmark long-horizon / Nâng cao / Benchmark
057 07 / Self-Evolving Agents / Câu hỏi đầu tiên luôn là: cái gì vừa thay đổi?
058 Self-evolving — thứgì thay đổi? / Thứthay đổi / Cơ chế
059 Self-evolution: ba tầng hiểu / Ý tưởng: Vòng lặp chung: làm →được chấm →rút bài học →ghi bài học vào đâu đó / bền →làm lại.
060 Context evolution: playbook thay vì prompt / Generator / làm task
061 Memory & skill evolution / ReasoningBank / Chưng cất chiến lược từcả
062 Self-modifying agent: sửa chính code của mình / 20 / 24
063 Recursive self-improvement (AIDE2) / Nâng cao / AIDE2 (preprint 22/09/2026): mỗi bản viết lại được chấp nhận trởthành agent sửa ởvòng sau.
064 2026: harness updating không phải harness benefit / Nâng cao / Nghiên cứu 05/2026 tách hai năng lực của vòng self-evolution của harness (prompt, skill, memory, tool).
065 Reward hacking: tối ưu con sốthay vì mục tiêu / Objective hacking — ví dụcó thật / Trong một thí nghiệm của DGM vềphát hiện ảo
066 Làm ngay: vòng “bài học” an toàn cho agent của bạn / def after_task(playbook, task, trace, verdict): / log_usage(playbook, trace)
067 08 / Evaluation, Observability & / Security
068 Bốn tầng evaluation cho multi-agent / 1. Kết quả: đúng / sai, / kiểm tựđộng được
069 Trace: thứduy nhất đểdebug multi-agent / invoke_agent lead / 12.4s 43k tok
070 Lethal trifecta, chia cho nhiều agent / Researcher / đọc web
071 Human-in-the-loop: người ởđâu trong đội agent? / Hành động / Ai quyết
072 Evaluation & security: ba tầng hiểu / Ý tưởng: Không đo được thì không cải tiến được; không giới hạn quyền thì không dám / chạy.
073 09 / Thực Hành & Tổng Kết / Một cây quyết định, một lab đo được, năm ý mang về
074 Cây quyết định thiết kế / Việc tách được / thành phần độc lập?
075 Demo: research system — một agent vs nhiều agent / 1. Cùng câu hỏi: “So sánh 5 nhà cung cấp vector DB vềgiá, giới hạn, giấy / phép (nguồn sơ cấp)” — dạng việc đọc rộng, tách được
076 Lab #20 / Mục tiêu: Self-Evolving Agentic: dựng harness bằng Deep Agents, rồi so ba / điều kiện — baseline, subagents, skills-auto (skill do curator tựviết) — trên
077 Lab 20: ba điều kiện × sáu task / Điều kiện / Agent
078 Lab 20: quy trình và mốc freeze / 1 Cài harness / agent,
079 Lab 20: bốn file sinh viên cài, nối với bài giảng / File (TODO) / Việc
080 Lab 20: curator và hàng rào chống rò rỉ / Nâng cao / def curate_skills(results, cond, out, model, k):
081 Lab 20: đọc kết quảvà chấm điểm / Phân loại lỗi (mỗi dòng cần bằng chứng) / A
082 QUIZ Chương 4 + MILESTONE 1 / QUIZ Chương 4 (20 phút) / 10 câu: 7 trắc nghiệm + 3 trảlời ngắn
083 Tổng kết — Key Takeaways / Những ý chính cần nhớtrước khi sang bài tiếp theo / 1
084 Tiếp theo & Bài tập / Ngày 21: / Fine-tuning LLMs —
085 Tài liệu chính (1/2) / 1. Kim et al. Towards a Science of Scaling Agent Systems. arXiv:2512.08296 v3. / 2. Cemri et al. Why Do Multi-Agent LLM Systems Fail? NeurIPS 2025 D&B. arXiv:2503.13657.
086 Tài liệu chính (2/2) / 1. Kwa et al. (METR). Measuring AI Ability to Complete Long Tasks. arXiv:2503.14499; metr.org/time-horizons. / 2. Anthropic. Effective harnesses for long-running agents (26/11/2025); Building a C compiler with a team of parallel
087 Hỏi & Đáp / Bài toán ởcông ty bạn: một agent, hay nhiều agent? Và / harness của bạn đang thiếu dòng nào trong checklist?
088 Cảm ơn! / AICB-P2T3 · Ngày 20 · Multi-Agent Systems 2026 / github.com/vinuni-aicb

## t3-d06-material_muv9u158_ze3stz · Track3_Multi_Agent_System (37 pages)

001 Multi-Agent Systems / AICB-P2T3 · Ngày 20 · Chương 4 — Agent Nâng Cao / VinUniversity
002 ? / HÃY SUY NGHĨ... / “Khi một agent không đủ— Su-
003 Nội dung bài học / 1. Tại sao cần nhiều Agent? / 2. 5 Agentic Workflow Patterns (Anthropic)
004 01 / Tại sao cần nhiều Agent? / Taxonomy, failure modes, và nguyên tắc “Start simplest”
005 Trực giác cốt lõi / Multi-Agent = Team dựán / Multi-agent giống team dựán: có PM (supervisor), specialists (workers),
006 Multi-Agent Taxonomy — Khi nào cần nhiều Agent? / Single Agent / Specialization
007 Ví dụthực tiễn — multi-agent giải quyết vấn đềgì? / Use case / Cấu trúc agent
008 Hoạt động 1 — Single agent hay multi-agent? / Nhiệm vụnhóm (8 phút): / 1. Với mỗi task, chọn: single agent,
009 g / ệ / g,
010 02 / 5 Agentic Workflow Pat- / terns (Anthropic)
011 5 Patterns — Escalation Ladder / 1. Prompt / Chaining
012 Hoạt động 2 — Pattern Card Sorting / Chia nhóm 3 người, mỗi nhóm nhận / 1 case:
013 Routing Pattern — Cost Optimization / Routing — Classify / input
014 03 / Supervisor Pattern — Or- / chestration
015 Supervisor Pattern — Hub-Spoke Architecture / Supervisor / (LLM Router)
016 Supervisor State — LangGraph Implementation / class SupervisorState(TypedDict): / messages: list[BaseMessage]
017 04 / Debate Agents — Adversar- / ial Collaboration
018 Debate Pattern — Adversarial Collaboration / Agent A / (GPT-4o)
019 Society of Mind — Heterogeneous Agents / Agent / Model
020 05 / Parallel Execution & Shared / State
021 Parallel Agent Execution — Map-Reduce / Task / Worker 1
022 Shared State — Coordination Architecture / Shared state (blackboard) — / Agents read/write central state
023 AsyncIO và Agent Pools — Production Concurrency / True concurrent execution cho multiple agents. / asyncio.gather(agent1(), agent2())
024 06 / Multi-Agent Frameworks / LangGraph, AutoGen, CrewAI — chọn đúng công cụ
025 Framework Comparison — Chọn theo use case / Framework / Flexibility
026 07 / Demo & Thực hành / Multi-Agent Research System + 2 giờlab có peer review
027 Predict-before-demo — học viên đoán trace trước / Cho / học
028 Multi-Agent Research System — Live Demo / 1. Pipeline: Supervisor + SearchAgent + AnalysisAgent + WriterAgent / 2. Task: “Research GraphRAG state-of-the-art, write 500-word
029 Lab #20 / Mục tiêu: Build 3-agent research system: Researcher + Analyst + Writer / với LangGraph
030 Lab 20 — 2 giờthực hành theo milestone / 1. 0–15’ Setup: clone starter, set API key, chạy single-agent baseline. / 2. 15–45’ Build supervisor: LangGraph state machine, routing via tool calls.
031 g / , / g
032 QUIZ Chương 4 + MILESTONE 1 / 10 câu trắc nghiệm + short an- / swer:
033 Reference links cho học viên tựđọc thêm / Anthropic: Building effective agents / anthropic.com/engineering/building-effective-agents
034 Tổng kết — Key Takeaways / Những ý chính cần nhớtrước khi sang bài tiếp theo / 1
035 Tiếp theo & Bài tập / Ngày 21: Fine-tuning LLMs — / LoRA/QLoRA
036 Hỏi & Đáp / Supervisor vs Debate vs Parallel — khi nào / dùng pattern nào? Single agent có khi nào đủ?
037 Cảm ơn! / AICB-P2T3 · Ngày 20 · Multi-Agent Systems / github.com/vinuni-aicb

## t3-d07-material_muwuoygw_rh18dc · Day 21 - Fine-tuning LLMs (bản gọn, 72 trang - trình chiếu) (72 pages)

001 Fine-tuning LLMs — TừFull / Fine-tune đến LoRA/QLoRA / AICB-P2T3 · Ngày 21 · Chương 5 — Fine-tuning & An Toàn
002 ? / HÃY SUY NGHĨ... / “Bạn có 5.000 hội thoại chăm sóc khách
003 Nội dung bài học — 5 phần, 25 module / I Quyết định / 1. Có nên fine-tune không?
004 Bối cảnh 2026 — OpenAI thu hẹp fine-tuning self-serve / 07/05/2026 / 02/07/2026
005 Bậc thang baseline — leo từng bậc, đo ởmỗi bậc / 1. Zero-shot / 2. Prompt viết kỹ
006 Cây quyết định 2026 — sáu câu hỏi và một cổng / 1. Cần dữkiện mới, có trích dẫn? / 2. Prompt tốt + few-shot đạt bộeval?
007 Khi nào fine-tuning có lãi? — tính thửmột lần / Bài toán: 1 triệu request. A: Gemini 3.8 Flash + prompt / dài. B: Gemini 3.1 Flash-Lite đã tune, prompt ngắn. Giả
008 Bản đồba giai đoạn — và vịtrí của bạn / PRE-TRAINING / MID-TRAINING
009 Model mở10/2026 — cỡbạn thật sựfine-tune được / Model (ngày) / Tổng / kích hoạt
010 Lab đóng — họkểgì vềcách train, và cho bạn tune gì / Lab / Công bốvềtraining
011 Sáu thứbạn thừa hưởng — và fine-tune không sửa được / Thừa hưởng / Fine-tune sửa được?
012 Định nghĩa & vịtrí — đọc được đường learning rate / token / LR
013 Bộxương chung — và bạn đang làm bước nào / SFT / + reasoning traces
014 Ba công cụ, ba loại ngân sách / Continued Pretraining / SFT
015 Quên thảm hoạ— và liều thuốc rẻtiền / Quên thảm hoạ— Model học tốt / miền mới nhưng đánh mất năng lực
016 Đổi optimizer lúc fine-tune — nay đã có câu trảlời / Optimizer frontier có chạm tới người fine-tune không? Năm 2026 có hai bài báo trảlời thẳng — và chúng nói / ngược nhau, vì trảlời hai câu hỏi khác nhau.
017 Kiến trúc 2026 — thưa hơn, và attention không còn là một thứ / Độthưa đã thành cực đoan / Model
018 Fine-tune model MoE — “ởđâu” giờgồm cả“expert nào” / Định tuyến expert lệch nặng: một nhóm nhỏexpert nhận phần lớn token mỗi lớp. LoRA mặc định lại gắn adapter / vào mọi expert — phần lớn adapter nằm chờởexpert gần như không được gọi.
019 Khối khuếch tán — model không còn sinh từtrái sang phải / DiffusionGemma (Google DeepMind, 10/06/2026, Apache 2.0, 26B MoE / 3,8B kích hoạt) là model ngôn ngữ / block-diffusion có trọng sốmởđầu tiên đủlớn đểfine-tune thật.
020 Kếtoán bộnhớ— 16 byte cho mỗi tham số / Thành phần / Byte/param
021 Khi nào Full FT vẫn là lựa chọn đúng / Chọn Full FT / CPT khi / • Dữliệu quy mô tỷtoken (CPT — §6)
022 “Thuật toán tối ưu” — một cái nhãn, bốn loại việc khác nhau / Danh sách nổi tiếng nhất trong hệsinh thái (LLaMA-Factory) gộp 12 cái tên vào một dòng. Chúng không cùng / loại — và phân loại lại chính là cách nhớđược chúng:
023 Kiến trúc — Trọng sốđóng băng + hai ma trận gầy / x / W0
024 Bốn nút vặn, hai bậc tựdo / Bạn tưởng mình có bốn siêu tham sốđộc / lập:
025 Vùng “không hối tiếc” / Thinking Machines Lab, 2025 / LoRA đạt cùng hiệu suất mẫu và cùng chất lượng cuối cùng như full fine-
026 Lỗi #1 — Chỉgắn LoRA vào attention / Thí nghiệm trên Llama-3.1-8B, sốtham / sốgần bằng nhau:
027 Lỗi #2 — Dùng learning rate của full fine-tune / 1× / Full FT
028 Lỗi #3 — Tăng batch size đểlấp đầy GPU / LoRA nhạy với batch size hơn full FT / Khoảng cách chất lượng LoRA–FullFT nới rộng khi
029 Hoà giải hai kết quảtưởng như mâu thuẫn / Biderman et al., 2024 / “LoRA Learns Less and Forgets Less”
030 Bằng chứng 2026 — và hai bài báo tưởng như đối nghịch / A. Đội PEFT của HuggingFace (06/2026): “LoRA / không nên là mặc định tựđộng”. Llama-3.2-3B,
031 Hai thứthật sựkhác — và một cơ chếgiải thích trần rank / OFT / BOFT — cập nhật nhân, / không phải cộng
032 QLoRA — NF4 4-bit + adapter bf16 / Base Model / 4-bit NF4 (đóng băng)
033 Thang chi phí — Full FT vs LoRA vs QLoRA (2026) / Phương pháp / Model ∼8B
034 Ma trận QLoRA đa-bit — nạp-và-train, không phải train-và-giao / Backend / Bit (train)
035 Bảng siêu tham sốkhởi điểm / Tham số / Khởi điểm
036 Đọc đường loss — ba hình dạng cần nhận ra / step / loss
037 Kernel không phải kiến trúc — hai trục khác nhau / §7.4 nói model là gì (CSA/HCA, Gated DeltaNet, KDA, local:global). Mục này nói phép toán đó được chạy ra / sao. FlashAttention không đổi kết quảattention — nó đổi lượng dữliệu phải đi qua HBM. Nhầm hai trục này là
038 Loss — lớp tốn bộnhớnhất không phải attention / Với từvựng 150K–260K token, tensor logits [batch × seq × vocab] là activation lớn nhất trong đồthị— lớn / hơn cảhidden state. Đây là chỗ“loss” thôi là công thức toán và trởthành hoá đơn VRAM.
039 Đọc ma trận tính năng — ba câu hỏi nó không trảlời / Trích nguyên văn README của LLaMA-Factory (08/2026) — và ba chỗnó im lặng: / Mục
040 Theo dõi thí nghiệm — giá trịnằm ởcấu hình / Bức tranh 2026 / Công cụ
041 Thuê người khác fine-tune — bốn kiểu dịch vụ / Kiểu / Ví dụ(10/2026)
042 Quy mô dữliệu — chất lượng đè bẹp sốlượng / Dữliệu thô / Làm sạch & khửtrùng lặp
043 Che loss — nút vặn quan trọng nhất mà ít ai dạy / from trl import SFTTrainer, SFTConfig / cfg = SFTConfig(
044 Sequence packing — tăng tốc miễn phí, có điều kiện / Không packing / lãng phí
045 Fine-tune model biết suy luận — cái bẫy không báo lỗi / Model mở2026 đều có chếđộsuy luận (§2). Fine-tune bằng dữliệu hỏi →đáp thông thường sẽphá huỷsuy / luận trong khi accuracy vẫn tăng — không chỉsốquen thuộc nào báo động.
046 Dữliệu tổng hợp là một họphương pháp / Bắt đầu từ… / Kỹthuật
047 Đường ống sinh dữliệu — và bao nhiêu mẫu sống sót / Seed / Sinh
048 Model collapse — câu chuyện đúng / thếhệmodel / lỗi trên dữliệu thật
049 Ai cho phép bạn học từoutput của họ? / Nguồn dữliệu (teacher) / Điều khoản vềviệc train model khác — bản kiểm 10/2026
050 Trajectory là gì — một ván chơi được ghi lại từng nước / User / Assistant
051 Ngữcảnh̸ = nhãn — model thấy gì và học gì / SFT toàn chuỗi / nhiệm vụ
052 Trajectory từđâu ra — và đếm đúng đơn vị / Dựán / Con sốcông bố
053 SFT trên trajectory, hay RL trong môi trường? / kết quảkiểm được / trong môi trường
054 Công cụquen thuộc — dữliệu và môi trường tạo khác biệt / “All substantive changes lie instead in the / data pipeline.”
055 Chuỗi giá trịdữliệu huấn luyện 2026 / Đám đông / gán nhãn
056 Rubric cũng bị“lách” — câu chuyện scattergunning / Model trảlời / nhiều đáp án
057 Data engine cho một team nhỏ— không cần mua dữliệu / 1. Định nghĩa task & danh sách lỗi / 2. Bộvàng nhỏdo chuyên gia nội bộviết
058 Vì sao perplexity một mình là chưa đủ / Perplexity đo cái gì / Mức “bất ngờ” của model trước văn bản trong tập
059 Ba baseline phải so — RAG khi bài toán cần / Base model / prompt đơn giản
060 Bảng tra triệu chứng / Triệu chứng / Nguyên nhân hay gặp nhất
061 Ca bệnh điển hình — lệch chat template / Sựcốcó thật / Một cấu hình Qwen3 base đặt eos_token thành
062 Hai đường triển khai — gộp hay giữriêng / Gộp (merge) / W = W0 + α
063 Multi-LoRA — kinh tếhọc của một base, nhiều adapter / 1 GPU / Base model (trong VRAM)
064 License đi theo bản fine-tune của bạn / Họmodel / License
065 Bốn thứhỏng mà loss không hềbáo / LIVE DEMO / 1. Mask sai: giải mã ngược labels — mask lấy từtokenizer giám sát 0
066 Lab #21 / LAB #21 / Mục tiêu: Fine-tune một open-weight model bằng LoRA — và chứng minh nó
067 Lab 21 — năm notebook, và cái mà mỗi cái ép bạn chứng minh / NB / Tên
068 Điểm nằm ởchỗbạn biết, không phải ởchỗbạn thắng / Baseline (b) là một cái bar thật / Bản fine-tune phải thắng base model đã được
069 Tổng kết — Key Takeaways / Những ý chính cần nhớtrước khi sang bài tiếp theo / 1
070 Tiếp theo & Bài tập / Bài tiếp theo / Ngày 22:
071 Hỏi & Đáp / Use case của bạn thật sựcần fine-tune, hay chỉcần một / prompt tửtếhơn? Hãy mang một ví dụcụthểra mổxẻ.
072 Cảm ơn! / AICB-P2T3 · Ngày 21 · Fine-tuning LLMs / — TừFull Fine-tune đến LoRA/QLoRA

## t3-d07-material_muwubnr6_3ci1ah · Day 21 - Fine-tuning LLMs (bản đầy đủ, 140 trang - tài liệu tham khảo) (140 pages)

001 Fine-tuning LLMs — TừFull / Fine-tune đến LoRA/QLoRA / AICB-P2T3 · Ngày 21 · Chương 5 — Fine-tuning & An Toàn
002 ? / HÃY SUY NGHĨ... / “Bạn có 5.000 hội thoại chăm sóc khách
003 Nội dung bài học — 5 phần, 25 module / I Quyết định / 1. Có nên fine-tune không?
004 01 / Khi nào cần Fine-tune? / Prompt engineering đã đủchưa — và ai còn fine-tune hộ
005 Bối cảnh 2026 — OpenAI thu hẹp fine-tuning self-serve / 07/05/2026 / 02/07/2026
006 Fine-tune sửa được gì — và KHÔNG sửa được gì / Sửa tốt — Hành vi / • Định dạng đầu ra cốđịnh
007 Bậc thang baseline — leo từng bậc, đo ởmỗi bậc / 1. Zero-shot / 2. Prompt viết kỹ
008 Cây quyết định 2026 — sáu câu hỏi và một cổng / 1. Cần dữkiện mới, có trích dẫn? / 2. Prompt tốt + few-shot đạt bộeval?
009 Khi nào fine-tuning có lãi? — tính thửmột lần / Bài toán: 1 triệu request. A: Gemini 3.8 Flash + prompt / dài. B: Gemini 3.1 Flash-Lite đã tune, prompt ngắn. Giả
010 Fine-tune thay đổi nhiều hơn thứbạn nhắm tới / Hành vi bên ngoài tác vụ / • Fine-tune trên dữliệu lành tính vẫn có thểlàm
011 Có nên fine-tune không? / Ý tưởng: Fine-tune là bậc thang cuối, không phải nút đầu tiên — và phải chứng minh nó / thắng.
012 02 / Vòng đời một mô hình 2026 / Pretrain →Mid-train →Post-train — và bạn bước vào ở
013 Bản đồba giai đoạn — và vịtrí của bạn / PRE-TRAINING / MID-TRAINING
014 “Model flow” — vì sao Olmo 3 là ví dụdạy học tốt nhất / Hầu hết các lab chỉcông bốtrọng sốcuối. Ai2 công bố / toàn bộmodel flow — định nghĩa của chính họ:
015 Model mở10/2026 — cỡbạn thật sựfine-tune được / Model (ngày) / Tổng / kích hoạt
016 “A3B” không có nghĩa là nhẹ— tổng vs kích hoạt / Nâng cao / tham sốbackbone (log)
017 Lab đóng — họkểgì vềcách train, và cho bạn tune gì / Lab / Công bốvềtraining
018 03 / Pre-training — cái bạn thừa / hưởng
019 Sáu thứbạn thừa hưởng — và fine-tune không sửa được / Thừa hưởng / Fine-tune sửa được?
020 Dữliệu pre-training — từ“lọc bỏ90%” sang “viết lại” / Thếhệ2024 — lọc quyết liệt / FineWeb-Edu,
021 Scaling laws 2026 — vì sao base model đã bão hoà / Chinchilla (2022) hỏi: ngân sách FLOPs cốđịnh, chia bao nhiêu cho tham số, bao nhiêu cho token? Năm 2026 / hàm chi phí đã đổi — và câu trảlời đổi theo.
022 04 / Mid-training — giai đoạn ít ai / gọi tên
023 Định nghĩa & vịtrí — đọc được đường learning rate / token / LR
024 Mid-training mua được ba thứ / 1. Năng lực / Tăng tỷtrọng STEM, code, và
025 Mởrộng ngữcảnh — rẻđểchạy, đắt đểchạy đúng / Cơ chế: RoPE mã hoá vịtrí bằng tần sốquay. Muốn / dài hơn thì nới phổtần sốđó.
026 05 / Post-training — công thức của / các lab
027 Bộxương chung — và bạn đang làm bước nào / SFT / + reasoning traces
028 Bốn công thức thật — đọc ngang đểthấy điểm chung / Model / Công thức post-training đã công bố
029 “SFT mởrộng, RL siết lại” — và bảng tên đểđọc tech report / Hai vai trò khác nhau — / SFT mở
030 06 / CPT vs SFT vs Distillation / SFT không phải công cụhuấn luyện duy nhất bạn có
031 Ba công cụ, ba loại ngân sách / Continued Pretraining / SFT
032 Distillation — và vì sao “on-policy” quan trọng / Off-policy (= SFT trên đầu ra teacher) / Teacher
033 Quên thảm hoạ— và liều thuốc rẻtiền / Quên thảm hoạ— Model học tốt / miền mới nhưng đánh mất năng lực
034 07 / Optimizer & Kiến trúc 2026 / Muon, MoE thưa, attention lai — và điều gì trong đó thực
035 Muon — optimizer đầu tiên soán ngôi Adam ởquy mô frontier / Ý tưởng một câu — / Adam chuẩn hoá từng
036 Kiểm chứng — “nhanh gấp đôi” còn lại bao nhiêu? / Một nghiên cứu đối chứng so 11 optimizer với cùng mức dò siêu tham sốcho từng cái. Kết quảnên đọc trước khi / tin bất kỳcon sốtăng tốc nào:
037 Optimizer có chạm tới bạn không? / Lưu ý: Đừng đổi optimizer vì thấy nó trong / tech report.
038 Đổi optimizer lúc fine-tune — nay đã có câu trảlời / Optimizer frontier có chạm tới người fine-tune không? Năm 2026 có hai bài báo trảlời thẳng — và chúng nói / ngược nhau, vì trảlời hai câu hỏi khác nhau.
039 Kiến trúc 2026 — thưa hơn, và attention không còn là một thứ / Độthưa đã thành cực đoan / Model
040 Fine-tune model MoE — “ởđâu” giờgồm cả“expert nào” / Định tuyến expert lệch nặng: một nhóm nhỏexpert nhận phần lớn token mỗi lớp. LoRA mặc định lại gắn adapter / vào mọi expert — phần lớn adapter nằm chờởexpert gần như không được gọi.
041 Khối khuếch tán — model không còn sinh từtrái sang phải / DiffusionGemma (Google DeepMind, 10/06/2026, Apache 2.0, 26B MoE / 3,8B kích hoạt) là model ngôn ngữ / block-diffusion có trọng sốmởđầu tiên đủlớn đểfine-tune thật.
042 08 / Full Fine-tune — Giải phẫu bộ / nhớ
043 Full Fine-tuning / Cập nhật mọi tham số / Khởi tạo từtrọng sốpre-trained W0, rồi chạy gradient descent trên toàn bộ
044 Kếtoán bộnhớ— 16 byte cho mỗi tham số / Thành phần / Byte/param
045 Activations — thành phần bịquên và cách khống chế / Vì sao activations lớn: / ■Backprop cần giá trịforward của
046 Chia nhỏtrạng thái — ZeRO & FSDP / P / G
047 Khi nào Full FT vẫn là lựa chọn đúng / Chọn Full FT / CPT khi / • Dữliệu quy mô tỷtoken (CPT — §6)
048 Bậc thang giữa — full FT khi full FT không vừa / Giữa “full FT 16 byte/tham số” và “LoRA 0,3% tham số” có một bậc thang ít được dạy: giữmọi trọng sốhuấn / luyện được, nhưng nén trạng thái optimizer.
049 09 / Bản đồhọPEFT / LoRA không phải phương án duy nhất — nhưng có lý do nó
050 Ba nhánh của Parameter-Efficient Fine-Tuning / PEFT / Additive
051 “Thuật toán tối ưu” — một cái nhãn, bốn loại việc khác nhau / Danh sách nổi tiếng nhất trong hệsinh thái (LLaMA-Factory) gộp 12 cái tên vào một dòng. Chúng không cùng / loại — và phân loại lại chính là cách nhớđược chúng:
052 10 / LoRA — Cơ chếhoạt động / Low-Rank Adaptation: giảthuyết “cập nhật hữu ích có
053 Ý tưởng cốt lõi / LoRA (Hu et al., 2021) / Đóng băng toàn bộtrọng sốgốc W0, chỉhọc thêm một cập nhật hạng thấp
054 Kiến trúc — Trọng sốđóng băng + hai ma trận gầy / x / W0
055 Bốn nút vặn, hai bậc tựdo / Bạn tưởng mình có bốn siêu tham sốđộc / lập:
056 11 / LoRA Without Regret — Play- / book 2026
057 Vùng “không hối tiếc” / Thinking Machines Lab, 2025 / LoRA đạt cùng hiệu suất mẫu và cùng chất lượng cuối cùng như full fine-
058 Lỗi #1 — Chỉgắn LoRA vào attention / Thí nghiệm trên Llama-3.1-8B, sốtham / sốgần bằng nhau:
059 Lỗi #2 — Dùng learning rate của full fine-tune / 1× / Full FT
060 Lỗi #3 — Tăng batch size đểlấp đầy GPU / LoRA nhạy với batch size hơn full FT / Khoảng cách chất lượng LoRA–FullFT nới rộng khi
061 Với RL, rank 1 là đủ— và đây là cầu nối sang Ngày 22 / Lập luận thông tin: thuật toán / policy-gradient hấp thụkhoảng 1 bit
062 Hoà giải hai kết quảtưởng như mâu thuẫn / Biderman et al., 2024 / “LoRA Learns Less and Forgets Less”
063 12 / Biến thểLoRA / DoRA, rsLoRA, PiSSA, OFT, GraLoRA — và bằng chứng đo
064 Bản đồbiến thể— mỗi biến thểsửa một chỗ / Biến thể / Sửa điều gì
065 Sựthật khó chịu về“vườn thú biến thể” / Đổi sang DoRA/PiSSA không đảm / bảo cải thiện lớn
066 Bằng chứng 2026 — và hai bài báo tưởng như đối nghịch / A. Đội PEFT của HuggingFace (06/2026): “LoRA / không nên là mặc định tựđộng”. Llama-3.2-3B,
067 Hai thứthật sựkhác — và một cơ chếgiải thích trần rank / OFT / BOFT — cập nhật nhân, / không phải cộng
068 13 / QLoRA & Lượng tửhoá khi / huấn luyện
069 QLoRA — NF4 4-bit + adapter bf16 / Base Model / 4-bit NF4 (đóng băng)
070 Thang chi phí — Full FT vs LoRA vs QLoRA (2026) / Phương pháp / Model ∼8B
071 Biên giới — huấn luyện thẳng ởFP8 và 4-bit / 4-bit đang chuyển từ“mẹo nén đểlưu trữ” thành kiểu dữ / liệu tính toán cho cảhuấn luyện lẫn suy luận.
072 Ma trận QLoRA đa-bit — nạp-và-train, không phải train-và-giao / Backend / Bit (train)
073 14 / Siêu tham số& Vòng lặp huấn / luyện
074 Toàn cảnh pipeline / 1. Dữliệu / sạch + template
075 Bảng siêu tham sốkhởi điểm / Tham số / Khởi điểm
076 Đọc đường loss — ba hình dạng cần nhận ra / step / loss
077 15 / Tăng tốc — Attention, Kernel, / Loss & Backward
078 Kernel không phải kiến trúc — hai trục khác nhau / §7.4 nói model là gì (CSA/HCA, Gated DeltaNet, KDA, local:global). Mục này nói phép toán đó được chạy ra / sao. FlashAttention không đổi kết quảattention — nó đổi lượng dữliệu phải đi qua HBM. Nhầm hai trục này là
079 Loss — lớp tốn bộnhớnhất không phải attention / Với từvựng 150K–260K token, tensor logits [batch × seq × vocab] là activation lớn nhất trong đồthị— lớn / hơn cảhidden state. Đây là chỗ“loss” thôi là công thức toán và trởthành hoá đơn VRAM.
080 Backward — bốn cần gạt, xếp theo cái giá phải trả / Cần gạt / Cơ chế
081 Bốn “toán tửtăng tốc” — và con sốnào kiểm chứng được / Công cụ / Thật sựlàm gì
082 16 / Hệsinh thái công cụ& Theo / dõi thí nghiệm
083 Bốn khung fine-tuning — chọn theo ràng buộc của bạn / Khung / Hình dạng
084 Đọc ma trận tính năng — ba câu hỏi nó không trảlời / Trích nguyên văn README của LLaMA-Factory (08/2026) — và ba chỗnó im lặng: / Mục
085 Theo dõi thí nghiệm — giá trịnằm ởcấu hình / Bức tranh 2026 / Công cụ
086 Thuê người khác fine-tune — bốn kiểu dịch vụ / Kiểu / Ví dụ(10/2026)
087 Phiên bản 10/2026 — và vì sao Lab 21 không chạy theo / Gói / Lab 21 (08/2026)
088 17 / Dataset — Chất lượng, / Template & Masking
089 Quy mô dữliệu — chất lượng đè bẹp sốlượng / Dữliệu thô / Làm sạch & khửtrùng lặp
090 Che loss — nút vặn quan trọng nhất mà ít ai dạy / from trl import SFTTrainer, SFTConfig / cfg = SFTConfig(
091 Sequence packing — tăng tốc miễn phí, có điều kiện / Không packing / lãng phí
092 Nhiễm dữliệu & trôi phân phối / Nhiễm benchmark / Benchmark lọt vào tập train thổi phồng điểm.
093 Fine-tune model biết suy luận — cái bẫy không báo lỗi / Model mở2026 đều có chếđộsuy luận (§2). Fine-tune bằng dữliệu hỏi →đáp thông thường sẽphá huỷsuy / luận trong khi accuracy vẫn tăng — không chỉsốquen thuộc nào báo động.
094 18 / Dữliệu tổng hợp (Synthetic / Data)
095 Dữliệu tổng hợp là một họphương pháp / Bắt đầu từ… / Kỹthuật
096 Đường ống sinh dữliệu — và bao nhiêu mẫu sống sót / Seed / Sinh
097 Ví dụthật — dữliệu của Lab 21 cũng là dữliệu tổng hợp / Cách lab sinh 250 ticket train (make_seed_data.py): / INTENTS = {"doi_tra": [...], "van_chuyen": [...], ...}
098 Ít mà tinh hay nhiều mà phủ? — tuỳmodel đã biết gì / Nâng cao / Ít mà tinh
099 Model collapse — câu chuyện đúng / thếhệmodel / lỗi trên dữliệu thật
100 Ai cho phép bạn học từoutput của họ? / Nguồn dữliệu (teacher) / Điều khoản vềviệc train model khác — bản kiểm 10/2026
101 Dùng model lớn đểsinh dữliệu cho model nhỏ / Ý tưởng: Máy viết rất rẻ; thứđắt là kiểm và chứng minh nó giúp được. / Cơ bản
102 19 / Dữliệu trajectory — fine-tune / agent
103 Trajectory là gì — một ván chơi được ghi lại từng nước / User / Assistant
104 Ngữcảnh̸ = nhãn — model thấy gì và học gì / SFT toàn chuỗi / nhiệm vụ
105 Trajectory từđâu ra — và đếm đúng đơn vị / Dựán / Con sốcông bố
106 Bước sai: giữ, che, hay bỏ? — và cái bẫy giao diện / Nâng cao / gọi refund
107 SFT trên trajectory, hay RL trong môi trường? / kết quảkiểm được / trong môi trường
108 Đánh giá agent — chọn bài thi giống công việc / Benchmark / Đo cái gì
109 Vòng quay dữliệu agent — và người đứng ởđâu / Deploy / Ghi trace
110 Fine-tune một agent từtrajectory / Ý tưởng: Agent học hành động, nên dữliệu phải ghi lại hành động — đúng giao diện nó sẽ / dùng.
111 20 / Data engine & thịtrường dữ / liệu chuyên gia
112 Công cụquen thuộc — dữliệu và môi trường tạo khác biệt / “All substantive changes lie instead in the / data pipeline.”
113 Chuỗi giá trịdữliệu huấn luyện 2026 / Đám đông / gán nhãn
114 Giá dữliệu — mỗi thẻlà một đơn vịkhác nhau / $8–12 / giờ / người tham
115 Rubric cũng bị“lách” — câu chuyện scattergunning / Model trảlời / nhiều đáp án
116 Thịtrường — vì sao “trung lập” cũng là sản phẩm / Nâng cao / 06/2025
117 Data engine cho một team nhỏ— không cần mua dữliệu / 1. Định nghĩa task & danh sách lỗi / 2. Bộvàng nhỏdo chuyên gia nội bộviết
118 Dữliệu là con hào — bạn đào nó thếnào? / Ý tưởng: Thuật toán ai cũng có; dữliệu đúng miền, đúng định nghĩa “tốt”, thì không. / Cơ bản
119 21 / Đánh giá sau Fine-tune / Perplexity giảm không có nghĩa là model tốt hơn
120 Vì sao perplexity một mình là chưa đủ / Perplexity đo cái gì / Mức “bất ngờ” của model trước văn bản trong tập
121 Ba baseline phải so — RAG khi bài toán cần / Base model / prompt đơn giản
122 22 / Thất bại thường gặp & Debug / Triệu chứng →nguyên nhân gốc — những lỗi loss không hề
123 Bảng tra triệu chứng / Triệu chứng / Nguyên nhân hay gặp nhất
124 Ca bệnh điển hình — lệch chat template / Sựcốcó thật / Một cấu hình Qwen3 base đặt eos_token thành
125 23 / Merge, Deploy & Multi-LoRA / Serving
126 Hai đường triển khai — gộp hay giữriêng / Gộp (merge) / W = W0 + α
127 Multi-LoRA — kinh tếhọc của một base, nhiều adapter / 1 GPU / Base model (trong VRAM)
128 Engine nào phục vụadapter — và khi bạn có nhiều adapter / Hai engine, hai điểm mạnh / Engine
129 24 / License, Pháp lý & Dữliệu / Bản fine-tune của bạn thừa kếnhiều thứhơn bạn nghĩ
130 License đi theo bản fine-tune của bạn / Họmodel / License
131 PDPL — và vì sao fine-tuning là ca khó nhất / Luật 91/2025/QH15 — Luật Bảo / vệdữliệu cá nhân — Quốc hội
132 25 / Demo & Thực hành / Fine-tune một model tiếng Việt — và chứng minh nó thật
133 Bốn thứhỏng mà loss không hềbáo / LIVE DEMO / 1. Mask sai: giải mã ngược labels — mask lấy từtokenizer giám sát 0
134 Lab #21 / LAB #21 / Mục tiêu: Fine-tune một open-weight model bằng LoRA — và chứng minh nó
135 Lab 21 — năm notebook, và cái mà mỗi cái ép bạn chứng minh / NB / Tên
136 Điểm nằm ởchỗbạn biết, không phải ởchỗbạn thắng / Baseline (b) là một cái bar thật / Bản fine-tune phải thắng base model đã được
137 Tổng kết — Key Takeaways / Những ý chính cần nhớtrước khi sang bài tiếp theo / 1
138 Tiếp theo & Bài tập / Bài tiếp theo / Ngày 22:
139 Hỏi & Đáp / Use case của bạn thật sựcần fine-tune, hay chỉcần một / prompt tửtếhơn? Hãy mang một ví dụcụthểra mổxẻ.
140 Cảm ơn! / AICB-P2T3 · Ngày 21 · Fine-tuning LLMs / — TừFull Fine-tune đến LoRA/QLoRA

## t3-d08-material_muywktdm_rtk239 · Day22-Track03-DPO_ORPO_Alignment (64 pages)

001 DPO, ORPO & Alignment — Từ / SFT đến Preference Learning / AICB-P2T3 · Ngày 22 · Chương 5 — Fine-tuning & An Toàn
002 ? / HÃY SUY NGHĨ... / “RLHF tốn kém — DPO làm được điều
003 Nội dung bài học / 1. Tại sao SFT chưa đủ? / 2. RLHF — Bức tranh toàn cảnh
004 01 / Tại sao SFT chưa đủ? / SFT dạy “nói gì” — nhưng ai dạy model “nói như thếnào”?
005 SFT dạy format — Alignment dạy hành vi / Pre-trained / (raw knowledge)
006 SFT-only: vấn đềgì xảy ra? / SFT-only output / Over-hedges, verbose
007 Vì sao preference data mạnh hơn demonstration data? / SFT distribution (data observed) / desired
008 02 / RLHF — Bức tranh toàn cảnh / Hiểu RLHF đểthấy tại sao DPO là bước cải tiến
009 RLHF Pipeline — InstructGPT 3-Stage Architecture / Stage 1 / SFT
010 RLHF: Kết quảtốt nhưng chi phí cao / 3 / Models cần
011 03 / DPO — Direct Preference Opti- / mization
012 Ý tưởng cốt lõi / DPO (Rafailov et al. 2023) / Key insight: optimal RLHF policy có closed-form solution. Vì vậy ta có thểtrain
013 DPO derivation — 3 bước từBradley-Terry đến loss / 1. Bradley-Terry / P(yw ≻yl | x) =
014 RLHF vs DPO — So sánh Pipeline / RLHF: / SFT
015 DPO Hyperparameter: β — Kiểm soát mức độalignment / β = 0.05 / Tựdo cao
016 DPO failure modes — khi training “thành công” nhưng model tệhơn / Lưu ý: Likelihood displacement (Razin 2024) — / prob của chosen giảm khi train; khi chosen ≈rejected,
017 04 / ORPO, SimPO & Alternatives / Single-stage alignment — bỏcảbước SFT riêng biệt
018 Alignment timeline 2022 →2026 — từPPO đến RLVR / 2022 / PPO-RLHF
019 Method matrix — chọn alignment method nào? / Method / RM?
020 SimPO vs KTO — hai hướng đi sau DPO / SimPO (Meng et al. 2024) / Reference-free — không cần πref.
021 ORPO — Single-Stage: Base →Aligned / Truyền thống: / Base
022 05 / RL comeback — GRPO & RLVR / Năm 2025: RL trởlại cho reasoning, nhưng không cần reward
023 GRPO — PPO không có value model / Prompt x / y1
024 RLVR & DeepSeek-R1 — reward thay bằng regex / RLVR — Reinforcement Learning from Verifiable / Rewards. Reward = kiểm tra programmatic (math
025 Khi nào reasoning task cần RL chứkhông phải DPO? / Task type / Method khuyến nghị
026 06 / Preference Data & Implementa- / tion
027 Preference Dataset — prompt + chosen + rejected / Prompt: “Giải thích AI...” / Chosen: Rõ ràng, concise
028 TRL DPOTrainer — Implementation / from trl import DPOTrainer, DPOConfig / from transformers import AutoModelForCausalLM
029 Iterative DPO — vì sao one-shot offline không đủ / 1. Train RM / 2. Rejection sampling
030 Reward models 2025 — chưa biến mất, chỉđổi vai trò / Trong DPO world, RM dùng làm gì? / ■Data filter: loại bỏpairs gap quá nhỏ
031 Vietnamese LLMs — ai đã làm DPO, ai chưa? / Model / Base
032 Xây dựng preference data tiếng Việt — 4 bước thực tế / 1. Prompts: VN SFT set / VMLU stems (200 prompts) / 2. Generate 2 responses: Lab21-SFT + stronger model
033 07 / Constitutional AI & Red-teaming / Tạo preference data tựđộng và kiểm tra an toàn
034 Constitutional AI (Anthropic) — Self-Improvement / 1. Generate / model outputs
035 RLAIF, Self-Rewarding LMs & Collective CAI — AI làm judge / RLAIF — Reinforcement / Learning
036 Red-teaming — Kiểm tra an toàn trước deploy / ■Probe model cho harmful outputs / ■Findings feed back vào preference
037 08 / Đánh giá Alignment — LLM / Benchmarks
038 Tại sao đánh giá alignment khó? / Vấn đềcốt lõi / Aligned response là open-ended —
039 Static benchmarks — đo capability của aligned model / Benchmark / Đo gì
040 Judge-based benchmarks — đo response quality / Benchmark / # prompts
041 Reward Models = meta-judge — và vấn đềrecursion / Tại sao cần benchmark cho RM/- / judges?
042 Vietnamese benchmark landscape — gì có, gì thiếu / Benchmark / Đo gì
043 09 / Demo & Thực hành / DPO training thực tế+ đo improvement bằng GPT-4 Judge
044 DPO Training + LLM-as-Judge Comparison / 1. Lấy SFT checkpoint từLab 21, apply DPO với 2k UltraFeedback pairs, 1 epoch / 2. Before DPO: over-hedges, generic, verbose. After DPO: direct, concise,
045 DPO Improvement — Before vs After / 3.2→4.1 / Helpfulness
046 Tulu 3 (AI2 2024) — SFT vs +DPO vs +RLVR thực tế / +1.7 / MATH
047 Lab #22 / Mục tiêu: DPO alignment trên SFT checkpoint + deploy aligned model / Deliverable:
048 Lab 22 — Các bước thực hành / 1. Prepare preference dataset: human-ranked response pairs (hoặc synthetic via / GPT-4 judge), format prompt/chosen/rejected
049 Lab 22 — 2 bonus tracks (optional, +1 giờmỗi track) / Bonus A / DPO vs ORPO head-to-head
050 10 / Bức tranh toàn cảnh — Full / training flow
051 Pre-training →Mid-training →Post-training / Pre-training / Mid-training
052 Domain adaptation — DAPT vs TAPT vs LoRA fine-tune / Method / Data
053 Synthetic data generation — 4 thếhệkỹthuật / 1. Self-Instruct (Wang 2022): seed / prompts, LLM tựsinh thêm. Quality thấp,
054 Distillation lineage — Alpaca →Vicuna →Orca →Phi / Alpaca (2023) / Vicuna/WizardLM
055 Hardware optimization — compute vs memory trade-off / FlashAttention / (v1/v2/v3) —
056 Distributed training — ZeRO Stages & FSDP / Stage / Shard
057 Modern PEFT variants — DoRA, rsLoRA, PiSSA / DoRA — Weight-Decomposed / LoRA
058 Model merging — combine fine-tunes mà không retrain / ■SLERP: spherical linear interpolation, / merge 2 models dọc đường cầu giữ
059 Quantization & serving — training xong, deploy thếnào? / Quantization (training-free): / ■NF4 (QLoRA): 4-bit normal-aware — default FT.
060 Decision tree — chọn training strategy theo constraint / 1. Có preference pairs? / ▷+SFT model →DPO / SimPO
061 Tổng kết — Key Takeaways / Những ý chính cần nhớtrước khi sang bài tiếp theo / 1
062 Tiếp theo & Bài tập / Ngày 23: LangGraph & Agentic Or- / chestration
063 Hỏi & Đáp / DPO hay ORPO — bạn sẽchọn method / nào cho project của mình và tại sao?
064 Cảm ơn! / AICB-P2T3 · Ngày 22 · DPO, ORPO & Align- / ment — TừSFT đến Preference Learning

## t3-d09-material_muzuwq6w_mcxsnq · Day23-Track03-LangGraph_DeepAgents_Orchestration (82 pages)

001 AICB · TRACK 3 · AI APPLICATIONS / Ngày 23 / LangGraph, Deep
002 Bảy phần, một câu hỏi: ai chọn bước tiếp theo? / Nền tảng / 01 Phổ deterministic ↔ agentic
003 Một khiếu nại, hai việc rất khác nhau bên trong / Hệ thống thật cần cả hai: phần trên do kỹ sư viết, phần dưới để model chọn. / Khiếu nại
004 Phần 01 / 07 / 01 / Phổ deterministic
005 01 · PHỔ DETERMINISTIC ↔ AGENTIC / Sáu mức trên phổ: quyền chọn / bước chuyển dần sang model
006 01 · PHỔ DETERMINISTIC ↔ AGENTIC / Năm mẫu workflow giải phần / lớn bài toán, trước khi cần agent
007 01 · PHỔ DETERMINISTIC ↔ AGENTIC / Dự đoán: bài toán này hợp với mẫu nào? / Mỗi tối, hệ thống đọc 300 đánh giá sản phẩm mới. Chưa biết trước sẽ có
008 01 · PHỔ DETERMINISTIC ↔ AGENTIC / Kéo thanh trượt: mỗi bước thêm / vào nhân rủi ro, không cộng
009 01 · PHỔ DETERMINISTIC ↔ AGENTIC / Tính agentic có giá: token và tiền tăng gấp nhiều lần / ≈4×
010 01 · PHỔ DETERMINISTIC ↔ AGENTIC / Mẫu production phổ biến: / deterministic shell, agentic core
011 01 · PHỔ DETERMINISTIC ↔ AGENTIC / Mang về từ phần 01 / Câu hỏi thiết kế: ai chọn bước tiếp theo?
012 Phần 02 / 07 / 02 / LangGraph:
013 02 · LANGGRAPH: STATE GRAPH / Ba tầng của hệ LangChain: / runtime, framework agent, harness
014 02 · LANGGRAPH: STATE GRAPH / Một StateGraph có bốn phần: / state, node, edge, compile
015 02 · LANGGRAPH: STATE GRAPH / Graph chạy theo super-step: node / song song đọc cùng một bản state
016 02 · LANGGRAPH: STATE GRAPH / Bật reducer: hai lần ghi song / song được gộp, hay báo lỗi?
017 02 · LANGGRAPH: STATE GRAPH / Send : số nhánh quyết định lúc chạy, không vẽ trước / Nguồn: docs.langchain.com/oss/python/langgraph/graph-api (Send) · đã chạy với langgraph 1.2.14
018 02 · LANGGRAPH: STATE GRAPH / Command : cập nhật state và / chọn bước tiếp trong một giá trị
019 02 · LANGGRAPH: STATE GRAPH / Guardrails dựng sẵn trong graph: / giới hạn, thử lại, timeout, cache
020 02 · LANGGRAPH: STATE GRAPH / Dự đoán: agent cần 15 lượt gọi / tool, chạy với recursion_limit=25
021 02 · LANGGRAPH: STATE GRAPH / Mang về từ phần 02 / LangGraph là runtime: state có kiểu, node trả cập nhật, cạnh routing, compile gắn
022 Phần 03 / 07 / 03 / Durable execution &
023 03 · DURABLE EXECUTION & HUMAN-IN-THE-LOOP / Thread là chuỗi checkpoint: / mỗi super-step một checkpoint
024 03 · DURABLE EXECUTION & HUMAN-IN-THE-LOOP / Chế độ durability đổi độ trễ lấy khả năng khôi phục / Nguồn: langgraph/types.py Durability · thay cho tham số cũ checkpoint_during
025 03 · DURABLE EXECUTION & HUMAN-IN-THE-LOOP / Node song song lỗi: khôi phục chỉ chạy lại node đó / Nguồn: docs.langchain.com/oss/python/langgraph/checkpointers (pending writes) · LangGraph 1.2: durable error handling qua host crash
026 03 · DURABLE EXECUTION & HUMAN-IN-THE-LOOP / Resume chạy lại node từ đầu, không từ dòng interrupt / Nguồn: docs.langchain.com/oss/python/langgraph/interrupts · đã chạy với langgraph 1.2.14
027 03 · DURABLE EXECUTION & HUMAN-IN-THE-LOOP / Dự đoán: đặt lệnh gọi API hoàn tiền ở đâu? / A
028 03 · DURABLE EXECUTION & HUMAN-IN-THE-LOOP / Reviewer có bốn lựa chọn, đặt theo từng tool / Nguồn: docs.langchain.com/oss/python/langchain/human-in-the-loop · đã chạy với langchain 1.4.3
029 03 · DURABLE EXECUTION & HUMAN-IN-THE-LOOP / Time travel: chạy lại từ checkpoint / cũ, hoặc fork bằng update_state
030 03 · DURABLE EXECUTION & HUMAN-IN-THE-LOOP / Đoán trước: dữ liệu này nằm / trong checkpoint hay Store?
031 03 · DURABLE EXECUTION & HUMAN-IN-THE-LOOP / Ra production: stream cho giao / diện, server cho khách nhắn chồng
032 03 · DURABLE EXECUTION & HUMAN-IN-THE-LOOP / Mang về từ phần 03 / Thread là chuỗi checkpoint; interrupt dừng ở checkpoint, không giữ tiến trình.
033 Phần 04 / 07 / 04 / Từ agent đến
034 04 · AGENT VÀ DEEP AGENTS / create_agent là vòng lặp model / ↔ tool, compile thành một graph
035 04 · AGENT VÀ DEEP AGENTS / Middleware có sáu cửa quanh / vòng lặp: đúng cửa thì đúng quyền
036 04 · AGENT VÀ DEEP AGENTS / Prompt khuyên, middleware ép: / luật hoàn tiền viết thành code
037 04 · AGENT VÀ DEEP AGENTS / Ba cách ghép graph và agent / Nguồn: docs.langchain.com/oss/python/deepagents/subagents · cả ba mẫu đã chạy với langgraph 1.2.14, deepagents 0.7.23
038 04 · AGENT VÀ DEEP AGENTS / Agent "nông" hỏng ở việc dài theo sáu kiểu quen thuộc / Nguồn: docs.langchain.com/oss/python/deepagents/overview
039 04 · AGENT VÀ DEEP AGENTS / create_deep_agent = create_agent + / một chồng middleware xếp sẵn
040 04 · AGENT VÀ DEEP AGENTS / Mười dòng là một deep agent, và nó trả về cả state / Nguồn: docs.langchain.com/oss/python/deepagents/overview · đã chạy với deepagents 0.7.23 (model giả lập)
041 04 · AGENT VÀ DEEP AGENTS / Bật từng cơ chế: write, select, / compress, isolate context
042 04 · AGENT VÀ DEEP AGENTS / Agent thấy đường dẫn; backend / quyết định tệp nằm ở đâu
043 04 · AGENT VÀ DEEP AGENTS / Subagent giữ kết quả lớn ở ngoài; / chỉ thông điệp cuối quay về
044 04 · AGENT VÀ DEEP AGENTS / Memory, skill, tool, subagent: khác nhau ở lúc được nạp / Nguồn: docs.langchain.com/oss/python/deepagents (skills, memory, subagents)
045 04 · AGENT VÀ DEEP AGENTS / Cây quyết định: chỉ thêm phần harness khi bài toán cần / Nguồn: docs.langchain.com/oss/python/deepagents/overview
046 04 · AGENT VÀ DEEP AGENTS / Mang về từ phần 04 / create_agent là graph: core loop model ↔ tools; model quyết khi nào dừng.
047 Phần 05 / 07 / 05 / Bản đồ
048 05 · BẢN ĐỒ FRAMEWORK 2026 / Framework trên phổ: graph / bên trái, vòng lặp mở bên phải
049 05 · BẢN ĐỒ FRAMEWORK 2026 / Google ADK 2.0: graph Workflow / làm trung tâm, agent là một node
050 05 · BẢN ĐỒ FRAMEWORK 2026 / Microsoft Agent Framework thay AutoGen và / Semantic Kernel bằng workflow có checkpoint
051 05 · BẢN ĐỒ FRAMEWORK 2026 / OpenAI Agents SDK đưa primitive; / Claude Agent SDK đưa harness
052 05 · BẢN ĐỒ FRAMEWORK 2026 / Pi: harness tối giản, chính sách để host tự viết / Nguồn: github.com/earendil-works/pi (trước là badlogic/pi-mono; 1.1.0, 07/10/2026) · package @earendil-works/pi-coding-agent
053 05 · BẢN ĐỒ FRAMEWORK 2026 / Hai harness mở mới: DeepSeek và Hermes Agent / Nguồn: github.com/deepseek-ai/deepseek-harness · api-docs.deepseek.com/guides/anthropic_api · github.com/NousResearch/hermes-agent (v0.21.x)
054 05 · BẢN ĐỒ FRAMEWORK 2026 / Các framework còn lại, đọc theo / một cột: orchestration bằng gì
055 05 · BẢN ĐỒ FRAMEWORK 2026 / Ba năm: từ hội thoại đa agent đến graph bền và harness / Nguồn: arXiv 2308.08155 · langchain.com/blog · openai.com/index/new-tools-for-building-agents · developers.googleblog.com · anthropic.com/news · devblogs.microsoft.com ·
056 05 · BẢN ĐỒ FRAMEWORK 2026 / Dự đoán: hỏi agent của hãng / vận chuyển bằng protocol nào?
057 05 · BẢN ĐỒ FRAMEWORK 2026 / Đoán trước: mỗi đội đứng đâu / trên phổ, thử framework nào?
058 05 · BẢN ĐỒ FRAMEWORK 2026 / Mang về từ phần 05 / Ba câu hỏi: ai chọn bước, state ở đâu, ai vận hành.
059 Phần 06 / 07 / 06 / Multi-agent và
060 06 · MULTI-AGENT VÀ FRONTIER / Cùng tháng 6/2025, hai bài viết / kết luận ngược nhau, và cả hai đúng
061 06 · MULTI-AGENT VÀ FRONTIER / Thêm agent: +80,8% hoặc / −70,0%, tuỳ hình dạng bài toán
062 06 · MULTI-AGENT VÀ FRONTIER / Supervisor, handoff, swarm khác / nhau ở chỗ ai giữ quyền điều khiển
063 06 · MULTI-AGENT VÀ FRONTIER / Multi-agent hỏng theo 14 kiểu, / và rất khó tìm ra thủ phạm
064 06 · MULTI-AGENT VÀ FRONTIER / Bắt đầu an toàn: nhiều agent đọc, một agent ghi / Nguồn: Cognition, "Multi-Agents: What's Actually Working" (22/04/2026) · Anthropic, "Patterns and problems in emerging multiagent systems" (13/08/2026)
065 06 · MULTI-AGENT VÀ FRONTIER / Nói trước, lật sau: ba niềm tin sai về multi-agent / Thảo luận với bạn bên cạnh 0:45
066 06 · MULTI-AGENT VÀ FRONTIER / Ba tầng nghiên cứu: thiết kế, lúc chạy, lúc thực thi / Nguồn: Khung ba tầng là tổng hợp của bài giảng · arXiv 2410.10762, 2512.04388, 2608.02680, 2609.20625
067 06 · MULTI-AGENT VÀ FRONTIER / Learned orchestration: máy tìm / cấu trúc, model nhỏ chọn worker
068 06 · MULTI-AGENT VÀ FRONTIER / Đi ngược trên phổ: compile trace agent thành workflow / Nguồn: El Yadouni & Li, "TraceCompiler", arXiv 2608.02680 (03/08/2026) — tiền ấn phẩm, số do tác giả báo cáo
069 06 · MULTI-AGENT VÀ FRONTIER / Dự đoán: chỉ đổi harness, Terminal- / Bench 2.0 từ 52,8% lên 66,5%
070 06 · MULTI-AGENT VÀ FRONTIER / Năm câu hỏi mở để thảo luận / Nguồn: Tổng hợp từ arXiv 2512.08296, 2607.09996, 2512.23738, 2609.20625 và báo cáo METR
071 06 · MULTI-AGENT VÀ FRONTIER / Mang về từ phần 06 / Multi-agent thường giúp việc chia nhánh độc lập, dễ hại việc tuần tự.
072 Phần 07 / 07 / 07 / Hero: dựng hệ thống lai
073 07 · HERO: DỰNG HỆ THỐNG LAI / Cùng khiếu nại #8812, hai cách chạy: / graph LangGraph và deep agent
074 07 · HERO: DỰNG HỆ THỐNG LAI / Trợ lý khiếu nại: LangGraph shell, / deep agent core, approval gate bền
075 07 · HERO: DỰNG HỆ THỐNG LAI / Lab: Deep Research Agent — / khoá ở host, tệp trong sandbox
076 07 · HERO: DỰNG HỆ THỐNG LAI / Lab: bốn tệp theo thứ tự, năm / chủ đề, chấm trên 100 điểm
077 07 · HERO: DỰNG HỆ THỐNG LAI / Bốn cơ chế của buổi học mà lab bắt bạn tự viết / Nguồn: GUIDE.md §1.1, §1.4, §2, §4 của repo lab
078 07 · HERO: DỰNG HỆ THỐNG LAI / Trước khi ship agent: tám câu phải trả lời được / Ai chọn bước tiếp theo ở từng node?
079 07 · HERO: DỰNG HỆ THỐNG LAI / Agent evaluation ở ba lớp, với một cổng chặn trong CI / Nguồn: Chi tiết ở Day 14 (Evaluation) · docs.langchain.com/langsmith/evaluation
080 07 · HERO: DỰNG HỆ THỐNG LAI / Mang về từ cả buổi / Ai chọn bước tiếp theo: chọn theo bài toán.
081 07 · HERO: DỰNG HỆ THỐNG LAI / Tài liệu tham khảo chính / Nguồn: Danh sách đầy đủ có link và ngày: _research/L1–L5, S1–S2 trong thư mục slide
082 Cảm ơn / Câu hỏi · slide, nghiên cứu và lab trên VLearn

## t3-d11-c155859b0e898e48 · Day24-Track03-RAGAS_LLM-as-Judge_and_Guardrails (74 pages)

001 RAGAS, LLM-as-Judge & Guardrails / AICB-P2T3 · Ngày 24 · Đo lường và Bảo vệAgent / Tên Giảng Viên
002 ? / HÃY SUY NGHĨ... / “Ba câu chuyện thật, đều xảy ra trong 24
003 Nội Dung Bài Học / 1. Foundations of Evaluation / 2. RAGAS Deep Dive (4 core metrics)
004 Mục Tiêu Ngày 24 (Bloom’s Taxonomy) / ■Remember — liệt kê 4 RAGAS metrics, 4 trục guardrail, 4 LLM-Judge biases / ■Understand — giải thích cơ chếFaithfulness, Answer Relevancy, Position bias, Session
005 Deliverable Cuối Ngày / Eval suite (RAGAS ≥0.75) + guardrail layer (overhead < 100ms P95) + blueprint / document.
006 01 / Foundations of Evaluation / Bắt đầu từvì sao — trước khi cầm RAGAS lên chạy, hiểu eval là
007 Vì Sao Evals Là “Underinvested” — 80/5 Rule / Khảo sát Anyscale 2024 (500 teams): / ■80% thời gian build features
008 Vibe-Check Không Scale / Bạn deploy agent. 10,000 user dùng nó. Bạn check chất lượng thếnào? / Vibe-check (manual):
009 Reference-Based vs Reference-Free Evals / Reference-based / Cần ground truth answer.
010 Online vs Offline Evaluation / Offline eval / When: trước deploy, mỗi PR.
011 Eval Levels — L1 đến L4 / L4: Human Eval / $1–5/q, 0.1% sample, gold standard
012 Component Eval vs End-to-End Eval / RAG pipeline có nhiều bước. Eval ởđâu? / Component eval (RAGAS):
013 Agent Eval — Beyond Final Answer / RAG eval đo final answer. Agent eval cần đo trajectory. / Ví dụ: Agent được hỏi “Doanh thu Q3 FPT?”
014 Bias-Variance Trong Eval Design / High bias eval: / ■Test set không cover edge cases
015 02 / RAGAS Deep Dive / Standard de-facto cho RAG evaluation. Hiểu cơ chếtừng metric,
016 RAGAS Framework — 4 Core Metrics / Faithfulness / Answer ↔Context
017 Faithfulness — Cơ ChếChi Tiết / Question: Answer claims có được context support không? / 1. Extract claims (LLM): liệt kê factual claims trong answer.
018 Answer Relevancy — Reverse Question Generation / Common misunderstanding: “đo cosine similarity giữa Q và A”. Sai! Vấn đề: câu trảlời tốt / thường khác từngữvới câu hỏi.
019 Context Precision — NDCG Cho Retrieval Ranking / Question: các chunks retrieved có được rank đúng thứtựrelevance không? / Không chỉlà precision đơn thuần.
020 Context Recall — Coverage Với Ground Truth / Question: retrieved context có đủthông tin đểtrảlời ground truth không? Algorithm: / 1. Break ground truth answer thành sentences.
021 RAGAS Code Setup — Quick Start / from ragas import evaluate / from ragas.metrics import (faithfulness, answer_relevancy,
022 Synthetic Test Generation — 3 Distributions / RAGAS tựgenerate test set từdocs — không cần viết tay. / Simple (50%)
023 RAGAS Pitfalls — Judge Brittleness / 4 pitfalls phổbiến cần biết: / 1. Judge model dependency: đổi judge (gpt-4o-mini →claude-haiku) →scores đổi
024 RAGAS Benchmark Targets / Metric / Target
025 RAGAS Alternatives — Tool Comparison / Tool / Strength
026 ■L1 Smoke: 10 golden queries, format/schema check. Cost $0.05. / ■L2 RAGAS: 100 query golden set, F≥0.85, AR≥0.80, CP≥0.70, CR≥0.75. Cost $1. / ■L3 Judge: pairwise vs production version, win rate ≥50%. Cost $3.
027 03 / LLM-as-Judge / Khi RAGAS không đủ— LLM evaluator scale từ100 query lên
028 Why LLM-as-Judge — Scale 100 →100k / Vấn đề: human eval không scale. RAGAS chỉcover 4 metrics cụthể. / Human eval:
029 Pairwise vs Absolute Scoring / Absolute scoring / Score 1 answer trên rubric (1–5 scale).
030 Bias 1 — Position Bias / Phenomenon: GPT-4 prefer câu đầu (A) hoặc cuối (B), tuỳtask. / ■Zheng et al. 2023 (MT-Bench): GPT-4 prefer A 55–60% khi A và B equal quality
031 Bias 2 — Length Bias / Phenomenon: LLM judges thiên vềcâu trảlời dài hơn, kểcảkhi quality equal. Chen et al. 2024 / (“Humans or LLMs as the Judge?”):
032 Bias 3 — Self-Enhancement Bias / Phenomenon: GPT-4 thiên vềoutput do GPT-4 sinh ra. / ■Zheng et al. 2023: GPT-4 prefer GPT-4 answer 10–15% hơn rate human prefer
033 Bias 4 — Style/Verbosity Bias / Phenomenon: Judges prefer formatted output (bullets, headers) hơn plain prose, kểcảkhi / content equal.
034 Calibration Với Human — Cohen’s Kappa / Cohen’s kappa đo agreement giữa judge và human, loại bỏchance agreement. / κ = Pobserved −Pchance
035 Cost Optimization — Tier Hóa Judge / Vấn đề: GPT-4 judge × 10k query/ngày = $300/ngày = $9k/tháng. Giải pháp: 3-tier judge / architecture
036 04 / Hallucination Detection / Faillure mode #1 của RAG. Faithfulness là một phần — nhưng
037 Hallucination Taxonomy / Intrinsic hallucination / Output mâu thuẫn với context.
038 SelfCheckGPT — Consistency-Based Detection / Manakul et al. 2023. Pattern thông minh không cần ground truth. Intuition: LLM hallucinate / inconsistently. Cùng question, sample n lần với temp > 0, output mâu thuẫn ởphần
039 NLI-Based Detection / NLI = Natural Language Inference. 3-class classifier: premise + hypothesis →entailment / / contradiction / neutral. Apply cho hallucination detection:
040 Semantic Entropy — Farquhar 2024 (Nature) / Tháng 6/2024, Farquhar et al. publish Nature paper. Major advance trong hallucination / detection. Idea:
041 HHEM Leaderboard — Production Benchmarks / Hughes Hallucination Evaluation Model (Vectara, 2024). / Leaderboard cho hallucination rate của các LLMs trên RAG task.
042 05 / Guardrails Foundations / Eval phát hiện vấn đề. Guardrails ngăn vấn đềtới user. Cần tax-
043 Guardrails 4 Trục / 1. Topical / “Tôi chỉtrảlời vềX.”
044 Defense-in-Depth — 4 Layer Architecture / L1 — Input Layer (< 30ms) / L2 — LLM Layer (system prompt rules, 0ms)
045 Latency Budget — Phân BổLayer / Layer / Component
046 Input Guardrails — Validators Chain / User input / PII redact
047 PII Detection — Presidio + Custom Regex / from presidio_analyzer import AnalyzerEngine / from presidio_anonymizer import AnonymizerEngine
048 Topic Scope Validator — Guardrails AI / Question: chatbot bank không trảlời vềy tế— ngăn thếnào? Pattern: LLM-based topic / classifier.
049 Prompt Injection — Direct vs Indirect / Direct injection / Trong user input.
050 OWASP LLM Top 10 (2025) / OWASP (Open Worldwide Application Security Project) công bố2025 list. Threat models cần / biết tên.
051 06 / Prompt Injection & Output / Guardrails
052 5 Common Attack Patterns / 1. DAN (Do Anything Now): “Pretend you are DAN, an AI without restrictions...”. Counter: input filter pattern + / system prompt explicit refusal rules.
053 Session Poisoning — Anatomy Of Attack / Discovered late 2024. Tinh tếnhất, exploit conversation history. / Turn 1 (safe)
054 Session Poisoning — Defense Pattern / Solution: Input-level replacement, không chỉoutput blocking. / ■Wrong: block output ởTurn 2 →history vẫn có malicious input →Turn 3 vulnerable
055 Output Guardrails — Llama Guard 3 / Meta Llama Guard 3 (2024) — 8B safety classifier, open source. / 14 harm categories (S1-S14):
056 NeMo Guardrails — Dialog/Retrieval/Execution Rails / NVIDIA NeMo Guardrails — programmable rails system. / Dialog Rails
057 GCP Model Armor — Enterprise Option / Google Cloud Model Armor (2024 GA) — managed guardrail service. / Features:
058 Hallucination As Guardrail / Concept: hallucination detector cũng là guardrail — block low-confidence outputs. Pattern: / 1. LLM generate answer.
059 Over-Filtering Trap / Failure mode tinh tế: false positive làm UX tệ, user bypass system. / Symptoms:
060 07 / Production Patterns / Eval và guardrail không phải one-time setup — là continuous dis-
061 Eval Pipeline Trong CI/CD / Pattern: mọi PR chạy eval trước khi merge. / Step
062 Regression Suite TừProduction Failures / Production teach you what test set can’t. Pattern: Failure →test case loop / 1. Production reports failure (user complaint, monitoring alert).
063 A/B Testing Với Eval Gate / Workflow: test 2 versions trong production, dùng eval làm gate. / 1. Deploy version B với 10% traffic.
064 Continuous Evaluation Pattern / Architecture: sample production traffic, eval async, alert on drift. / 1. Sample 1–5% production queries (random)
065 Compliance & Legal — 2026 Landscape / Regulation / Key requirement
066 Industry Case Studies — 4 Lessons / 1. Air Canada chatbot 2024 — Hallucination liability / Bot bịa chính sách bereavement fare →tòa phán pay theo bot. Lesson: không Faithfulness check = legal liability.
067 08 / Lab 24 & Closing / Hands-on: build full eval + guardrail blueprint cho RAG của Day
068 Lab 24 — 3 Phases (90 phút) / Build complete eval + guardrail stack cho RAG pipeline từDay 18, với latency budget / và CI/CD-ready blueprint.
069 Lab 24 Troubleshooting — Lỗi Thường Gặp / Triệu chứng / Cách xửlý
070 Blueprint Rubric — Chấm Điểm Deliverable / RAGAS Evaluation (30%) / ■Test set 50+ q (10)
071 Tổng kết — Key Takeaways / Những ý chính cần nhớtrước khi sang bài tiếp theo / 1
072 Tiếp theo & Bài tập / Reliability / &
073 Tài Liệu Tham Khảo / 1. RAGAS Documentation — docs.ragas.io. Synthetic test generation, 4 core metrics, framework / integration.
074 Hỏi & Đáp / Eval + Guardrails = 2 mặt cùng đồng xu. Eval cho / biết vấn đềgì; guardrails ngăn vấn đềtới user. Cả

## t3-d11-3b5684caa68e2e9a · day24_ragas_guardrails_student_summary (11 pages)

001 AICB Day 24 - RAGAS, LLM-as-Judge & Guardrails | Tài liệu tự học | Trang 1 / RAGAS, LLM-as-Judge / & Guardrails
002 AICB Day 24 - RAGAS, LLM-as-Judge & Guardrails | Tài liệu tự học | Trang 2 / 1. Bức tranh lớn: Eval phát hiện, Guardrails ngăn / chặn
003 AICB Day 24 - RAGAS, LLM-as-Judge & Guardrails | Tài liệu tự học | Trang 3 / Level / Loại eval
004 AICB Day 24 - RAGAS, LLM-as-Judge & Guardrails | Tài liệu tự học | Trang 4 / 3. RAGAS Deep Dive - 4 metric, 4 failure mode khác / nhau
005 AICB Day 24 - RAGAS, LLM-as-Judge & Guardrails | Tài liệu tự học | Trang 5 / 3.5 Test set và pitfalls / Synthetic test generation trong slide chia Simple / Reasoning / Multi-context. Tỷ lệ mặc định 50/25/25 chỉ
006 AICB Day 24 - RAGAS, LLM-as-Judge & Guardrails | Tài liệu tự học | Trang 6 / 4.4 Tier hóa judge để giảm cost / Architecture trong slide: T1 heuristic chạy 100%; T2 small LLM chạy khoảng 10%; T3 frontier judge chạy
007 AICB Day 24 - RAGAS, LLM-as-Judge & Guardrails | Tài liệu tự học | Trang 7 / 6. Guardrails Foundations - 4 trục và defense-in- / depth
008 AICB Day 24 - RAGAS, LLM-as-Judge & Guardrails | Tài liệu tự học | Trang 8 / 7. Prompt Injection, Session Poisoning & OWASP / threat model
009 AICB Day 24 - RAGAS, LLM-as-Judge & Guardrails | Tài liệu tự học | Trang 9 / 8. Production Patterns - eval và guardrail là / continuous discipline
010 AICB Day 24 - RAGAS, LLM-as-Judge & Guardrails | Tài liệu tự học | Trang 10 / 9. Blueprint để học viên tự triển khai / 9.1 Lab 24 - 3 phase / 90 phút
011 AICB Day 24 - RAGAS, LLM-as-Judge & Guardrails | Tài liệu tự học | Trang 11 / 10. Cheat Sheet - 1 trang để ôn nhanh / Nếu bạn thấy...

## t3-d12-material_mv4zuq2z_nbiyto · K4-Track03-day10-circuit-breakers-caching-reliability-agent-production (68 pages)

001 Circuit Breakers, / Caching & Reliability / AICB-P2T3 · Ngày 25 · Chương 5 — Agent Production-Ready
002 ? / HÃY SUY NGHĨ... / “Khi LLM provider timeout trong
003 Nội dung bài học / 1. Mởđầu: Reliability Stack / 2. Failure Modes
004 01 / Mởđầu: Reliability Stack / Mục tiêu, timeline và 3 lớp của một agent production-
005 Sau buổi học, học viên làm được gì? / Conceptual outcomes / ■Nhận diện 6 nhóm lỗi production của
006 Timeline buổi học: 2h lý thuyết + 2h lab / Mởđầu + Failure / Circuit breaker
007 Reliability Stack — 3 lớp / Resilience / Efficiency
008 02 / Failure Modes / Reliability bắt đầu từviệc gọi đúng tên lỗi: transient, de-
009 Production agent fail như thếnào? — 6 nhóm lỗi / # / Nhóm lỗi
010 Retry đúng cách: lỗi transient, backoff + jitter, 1 tầng / python / RETRYABLE = {408, 429, 500, 502, 503, 504, 529}
011 Case thật: retry làm sựcốtệhơn / Provider chậm / lỗi / Mọi client retry
012 Think-pair-share — Cascading failure / THẢO LUẬN · D1 / Thảo luận nhóm — 5 phút
013 Silent degradation: không lỗi nhưng chất lượng giảm / thời gian / chất lượng
014 Checkpoint 1 — Failure Modes / CÂU 1/3 / Log 1 tuần của agent: 5% LLM call bịlỗi. Theo dữliệu Datadog (02/2026), nguyên
015 Checkpoint 1 — Failure Modes / CÂU 2/3 / Provider trả529 overloaded cho mọi request. Một lượt user đi qua 3 tầng: app retry
016 Checkpoint 1 — Failure Modes / CÂU 3/3 / Dashboard: error rate 0%, P95 ổn định — nhưng khiếu nại “trảlời sai” tăng 3 lần trong
017 03 / Circuit Breaker / Ngắt gọi dependency đang hỏng đểfail fast; tựprobe để
018 Circuit Breaker: 3 trạng thái / CLOSED / (bình thường)
019 Trip logic: đếm lỗi gì, trong cửa sổnào? / Lỗi / Tính vào breaker?
020 Circuit breaker ởmức code / python / class CircuitBreaker:
021 Half-open probe: request thật hay health check? / THAM KHẢO / Real request (đơn giản)
022 Timeout · Bulkhead · Hedging — 3 người bạn của breaker / THAM KHẢO / Timeout
023 Checkpoint 2 — Circuit Breaker / CÂU 1/3 / Bug deploy làm app gửi request thiếu field bắt buộc →provider A trả400 liên tục.
024 Checkpoint 2 — Circuit Breaker / CÂU 2/3 / Gateway chạy 8 instance, mỗi instance giữbreaker in-memory (fail_threshold=5).
025 Checkpoint 2 — Circuit Breaker / CÂU 3/3 / Breaker vừa chuyển sang HALF-OPEN. Cùng lúc có 200 request đến. Thiết kếđúng
026 04 / Fallback & LLM Gateway / Fallback chain giữtrải nghiệm ởmức chấp nhận được;
027 LLM Gateway: 1 API, nhiều provider / Agent A / Agent B
028 Fallback ladder: graceful degradation / 0. Cùng model — region / tier / deployment khác / 1. Model tương đương — provider khác
029 LiteLLM Router: fallback + cooldown + retry / python / from litellm import Router
030 Gateway cũng là rủi ro: sựcốLiteLLM 03/2026 / THAM KHẢO / Chuyện gì đã xảy ra? (24/03/2026)
031 Action có side effect: idempotency & durable execution / Vấn đề: retry / fallback một tool call / “tạo ticket”, “chuyển tiền” →chạy 2
032 Interactive — Thiết kếfallback policy / THẢO LUẬN · D2 / Thảo luận nhóm — 8 phút
033 Checkpoint 3 — Fallback & Gateway / CÂU 1/3 / Agent đặt lịch dùng tool calling + structured output. Primary down; model fallback
034 Checkpoint 3 — Fallback & Gateway / CÂU 2/3 / Model chính ởregion us-east trả529 hàng loạt. Thứtựfallback nào hợp lý nhất cho
035 Checkpoint 3 — Fallback & Gateway / CÂU 3/3 / Dockerfile của team chạy pip install litellm (không pin version) và rebuild hằng
036 05 / Caching & Cost Budgeting / Cache đúng chỗgiảm latency & cost; cache sai chỗtạo
037 3 tầng cache cho LLM applications / 1. Prompt / prefix cache / (provider)
038 Prompt caching 2026: provider làm gì cho bạn? / THAM KHẢO / Anthropic Claude
039 Semantic cache flow / User query / Intent trong
040 Semantic cache: hit rate thực tế& false hit / 5–60% / hit rate tùy workload:
041 Interactive — Cache hay không cache? / THẢO LUẬN · D3 / Thảo luận nhóm — 5 phút
042 Cost budgeting: reliability của ví tiền / 3 lớp kiểm soát / 1. Per-request cap: max_tokens, sốtool call / agent
043 Checkpoint 4 — Caching & Cost / CÂU 1/3 / System prompt 6.000 tokens dùng chung cho mọi request, nhưng dòng đầu tiên là
044 Checkpoint 4 — Caching & Cost / CÂU 2/3 / Team chuyển semantic cache từLiteLLM (similarity_threshold=0.9) sang RedisVL
045 Checkpoint 4 — Caching & Cost / CÂU 3/3 / 10.000 request/ngày; mỗi request 20.000 input tokens (18.000 là prefix tĩnh) + 500
046 06 / Observability, SLO & Chaos / Không đo thì không biết hệthống đang tốt, chậm, đắt —
047 SLI, SLO, SLA cho LLM agent / Khái niệm / Ý nghĩa
048 Alert theo burn rate, không theo từng lỗi / Burn rate — tốc độtiêu error budget = / error rate / (1 −SLO). Burn 1 = vừa hết
049 Metrics instrumentation tối thiểu / python / from prometheus_client import Counter, Histogram, Gauge
050 Tracing với OpenTelemetry GenAI / THAM KHẢO / 0s
051 Chaos testing: cốtình làm hỏng / Băng sựcốtrong Lab 25B / G1 Traffic ×2,5; 429 kèm retry-after
052 Checkpoint 5 — Observability & SLO / CÂU 1/3 / Team đặt SLO nội bộavailability ≥99% và ký SLA 99,5% với khách hàng. Nhận xét?
053 Checkpoint 5 — Observability & SLO / CÂU 2/3 / SLO availability 99,5%, cửa sổ30 ngày, ∼2 triệu lượt request / tháng. Error budget
054 Checkpoint 5 — Observability & SLO / CÂU 3/3 / SLO availability 99,5%. Alert nào nên page on-call ngay?
055 07 / Live Demo & Lab 25 / Xem retry storm và breaker trên simulator — rồi vào vai
056 Live demo: Game Day trên simulator (10 phút) / LIVE DEMO / 1. Baseline: repo Lab 25B, bản lời giải — make compare: client naive 0/6
057 Lab #25 / LAB #25 / Mục tiêu: Game Day (Lab 25B): thay client v1 gây retry storm bằng client
058 Lab kickoff — Thiết kếbăng sựcố / THẢO LUẬN · D4 / Thảo luận nhóm — 7 phút
059 Lab 25 — Milestones (thiết kế4 giờ) / Thời gian / Việc cần làm
060 Metric, report & rubric chấm điểm / Metric (simulator in ra) / ■availability (theo lượt user), P95
061 Milestone 2 & demo cuối lab / Milestone 2 — nộp hôm nay / ■Fine-tuned model (SFT / DPO)
062 Tổng kết — Key Takeaways / Những ý chính cần nhớtrước khi sang bài tiếp theo / 1
063 Tiếp theo & Bài tập / Bài tiếp theo / Ngày 26: MCP — chuẩn hóa tool
064 Tài liệu tham khảo (cập nhật 10/2026) / Nền tảng / 1.
065 Hỏi & Đáp / Circuit breaker nên đặt ởđâu: trong / từng service hay tập trung tại gateway?
066 Hỏi & Đáp — Câu hỏi mở(1/2) / THẢO LUẬN / Q1. Circuit breaker nên đặt ởđâu: trong từng service hay tập trung tại gateway?
067 Hỏi & Đáp — Câu hỏi mở(2/2) / THẢO LUẬN / Q5. Làm sao test fallback mà không phải chờprovider sập thật?
068 Cảm ơn! / AICB-P2T3 · Ngày 25 · Circuit Breakers, Caching & Reliability / github.com/vinuni-aicb

## t3-d13-material_mv6ej0k2_72qtja · Bai giang MCP (47 pages)

001 Function Calling & MCP / Phân biệt Function Calling (khả năng của model) và Model Context Protocol / (giao thức kết nối) — qua code chạy được, từ demo tới production.
002 AGENDA / Phần 1 — Function Calling / Phần 2 — MCP Basics
003 L E ARNING O UT C O ME S / Sau buổi này bạn sẽ làm được / 1
004 Model rất giỏi ngôn ngữ, nhưng không biết gì về thế giới thật / Nó không biết thời tiết hôm nay, không đọc được database của bạn, không gọi được API nội bộ. / KHÔNG CÓ CÔNG CỤ
005 BIG PIC T URE / Hai khái niệm — hai tầng khác nhau / Đây là nguồn nhầm lẫn số 1. Chúng không cạnh tranh: MCP dùng Function Calling ở bên dưới.
006 P H ẦN 1 / Function Calling / Model quyết định gọi tool nào — nhưng app mới là nơi chạy.
007 Model KHÔNG chạy hàm. / Nó chỉ nói “hãy gọi hàm X với tham số Y”. / Mọi việc thực thi — gọi API, đọc DB, ghi file — do CODE CỦA BẠN làm.
008 C HI T IẾT / Vòng đời một lượt Function Calling — bước 1 & 2 / Câu hỏi ví dụ: “Thời tiết Hà Nội và Đà Nẵng hôm nay thế nào?” — chú ý model sẽ gọi tool 2 lần.
009 Bước 3 → 5: model ra chỉ thị, app thực thi, model tổng hợp / 3 / Model TRẢ VỀ yêu cầu gọi tool — không tự chạy
010 01- FUNC T IO N - C AL LING/ WE AT HER_FUNC TI O N_C AL LI NG.PY / Nhìn code thật — phần 1: schema viết tay / PYTHON
011 Nhìn code thật — phần 2 & 3: hàm thực thi và vòng lặp / Phần 2 — hàm Python thật (model không bao giờ chạy những dòng này) / def get_weather(city: str) -> str:
012 L IV E DE MO · 5 PHÚT / Demo 01 — chạy thật / TERMINAL
013 V Ì SAO C ẦN MC P / Ba nhược điểm khiến Function Calling thuần khó mở rộng / ✕
014 P H ẦN 2 / MCP Basics / Tool được tách ra một server độc lập, tự công bố chính mình.
015 MCP công bố ba loại tài nguyên / HÀNH ĐỘNG / Tools
016 API VÀ MC P / API và MCP — khác nhau ở chỗ ai là người gọi / Nhầm lẫn số 2: “MCP có phải API kiểu mới không?” — Không. REST API viết cho lập trình viên đọc; MCP viết cho model đọc.
017 API và MCP — so sánh theo từng tiêu chí / REST API / MCP
018 L IST _T O O L S() / Bước 1 — KHÁM PHÁ: “Anh có tool gì?” / Client không hard-code danh sách tool. Nó hỏi server lúc chạy, và server tự trả lời.
019 C AL L _T O O L() / Bước 2 — GỌI TOOL: “Cho tôi thời tiết Hà Nội” / Điểm khác biệt lớn nhất so với Function Calling: SERVER thực thi, client không cần biết code bên trong.
020 GIÁ T RỊ L ỚN NHẤT / Bước 3 — TÁI SỬ DỤNG: viết một lần, dùng mọi nơi / weather_server.py
021 So sánh code — khai báo tool / Cùng một tool get_weather. Bên trái 20 dòng, bên phải 4 dòng. / 01 — FUNCTION CALLING · viết tay
022 02- MC P - BASIC S/ / Code thật trong repo — server và client / weather_server.py — toàn bộ file
023 L IV E DE MO · 5 PHÚT / Demo 02 — chạy thật, không cần API key / TERMINAL
024 L UỒNG ĐẦY ĐỦ / Trong thực tế: MCP và Function Calling chạy cùng nhau / Đây là điều đang xảy ra mỗi lần bạn hỏi Claude Code một câu và nó dùng tool.
025 T HỰC H ÀNH / Đăng ký server với AI client — làm một lần, dùng mãi / Claude Code
026 T Ó M T ẮT PHẦN 1 + 2 / Bảng so sánh / Tiêu chí
027 LAB 1 · 15 PHÚT / Tự thêm một tool vào MCP server / Mục tiêu: chứng minh bằng tay rằng client KHÔNG cần sửa gì khi server có tool mới.
028 P H ẦN 3 / MCP trong Production / Ba khoảng trống giữa “chạy trên máy tôi” và “chạy cho cả công ty”.
029 Từ demo tới production: ba khoảng trống / Demo dùng stdio trên cùng một máy, ai chạy cũng được, chỉ một phiên bản tool. Production không như vậy. / SECURITY
030 SE C URIT Y / 3a · Authentication — stdio thì không cần, HTTP thì bắt buộc / Tầng
031 03- PRO DUC T I O N/ AUT H_SE RV E R. PY + AUT H_C L I E NT .PY / 3a · Code — TokenVerifier ở server, header ở client / Server
032 DISC O V E RY / 3b · Tool Registry — agent tự tìm tool thay vì hard-code / Với 30 server và 200 tool, agent không thể biết trước cái nào ở đâu. Nó phải tra danh mục.
033 03- PRO DUC T I O N/ RE GIST RY_C L IE NT . PY / 3b · Code — search, best_match, và tự chọn transport / TRA CỨU
034 3b · Hard-code so với Registry / Hard-code (demo) / Tool Registry (production)
035 BAC KWARD C O MPAT IBIL IT Y / 3c · Versioning — đổi tool mà không phá client đang chạy / Tình huống
036 03- PRO DUC T I O N/ V E RSIO NE D_SE RV E R. PY / 3c · Code — hai tool song song + resource metadata / HAI TOOL CÙNG TỒN TẠI
037 T ỔNG KẾT PHẦN 3 / Checklist mang về: Dev → Production / Khía cạnh
038 P H ẦN 4 / Thực chiến & Tổng kết / Một agent hoàn chỉnh: framework làm client, MCP server gọi API thật, deploy container.
039 04- L AB/ / Kiến trúc một agent thật / Khác hai demo trước: có framework làm client, có API thật, có container để deploy.
040 GO O GL E ADK / Framework làm gì? Nó chính là MCP Client của bạn / So với bài 02 nơi ta tự viết vòng lặp: framework làm hộ toàn bộ điều phối.
041 Năm việc framework làm hộ — chi tiết / 1 / KẾT NỐI tới MCP server
042 DE PL O Y / Đưa MCP server lên mạng — container hoá / DOCKERFILE
043 HƯ ỚNG DẪN Q UYẾT ĐỊNH / Khi nào dùng cái nào? / DÙNG FUNCTION CALLING THUẦN KHI…
044 KINH NGHIỆM / Bảy sai lầm thường gặp / 1
045 TỔNG KẾT / 1 / Function Calling là khả năng của model
046 Bài tập về nhà & tài nguyên / Ba bài tập, tăng dần / DỄ
047 /truongnh1992 / Cảm ơn cả lớp! / Nguyen Hai Truong

## t3-d14-material_mv8f2hgl_z9gpxa · Day 27 - Human in the loop (78 pages)

001 Human-in-the-Loop UX — / Khi Nào Agent Cần Xin Phép? / AICB-P2T3 · Ngày 27 · Chương 6 — Agent trong Production
002 ? / HÃY SUY NGHĨ... / “Agent tự quyết hay hỏi người
003 Nội dung vận hành / 1. / Tại sao Full Autonomy nguy hiểm?
004 HUMAN-IN-THE-LOOP (HITL) TRONG AI ENGINEERING / Ranh giới giữa Tự trị hoàn toàn và Kiểm soát an toàn / Định hướng & Mục tiêu
005 1 / The Illusion of Full Autonomy / & The Need for HITL
006 The Hook - Agent tự quyết, chuyện gì xảy ra? / Sức hấp dẫn và Cạm bẫy của Full Autonomy / ●
007 Tại sao "Thông minh" không đồng nghĩa với "An toàn"? / Độ tự tin của LLM (LLM Confidence) ≠ Độ chính xác thực tế / Vấn đề Calibration
008 Catastrophic Failures - Bài học từ thuật toán tự trị / Sự cố thực tế: Knight Capital Group / (2012)
009 Catastrophic Failures - Rủi ro pháp lý & Trải nghiệm khách hàng / Sự cố thực tế: Air Canada Chatbot / (2024)
010 Rủi ro "Black Box" trong Phân tích Dữ liệu Nội bộ / Tác động ngầm: Khi Agent ra quyết định sai / về Khách hàng
011 Khung đánh giá hành động (Action Assessment Framework) / Reversible vs. Irreversible Actions / Không phải mọi hành động đều bình đẳng
012 Ma trận Tác động Kinh doanh (Business Impact Matrix) / Định lượng mức độ nguy hiểm của Tool / Khả năng đảo ngược (Reversibility) — Từ Dễ đến Khó
013 Cost of Error (Chi phí của sự sai lầm) / Tại sao không để Agent tự dự đoán và ra quyết định? / Kịch bản & Phân tích
014 Cost of Error vs. Cost of Interruption / Bài toán Cân bằng: An toàn hay Năng suất? / Cost of Error
015 2 / HITL Taxonomy & / Interaction Patterns
016 The Autonomy Spectrum - Phổ Tự trị của AI / Từ "Chạy bằng cơm" đến "Tự động hóa hoàn toàn" / Không có một thiết kế "one-size-fits-all" (một cho tất cả). Mức độ tự trị của Agent nằm trên một dải phổ:
017 Phân biệt "Human-in-the-Loop" và "Human-on-the-Loop" / Gatekeeper (Người gác cổng) vs. Supervisor (Người giám sát) / Human-in-the-Loop (HITL)
018 5 Mẫu Tương tác Cốt lõi (Interaction Patterns) / Taxonomy: Cách Con người và AI "Nói chuyện" với nhau / Khi thiết kế hệ thống, chúng ta sử dụng 5 pattern chính để nhúng con người vào quy trình:
019 Pattern 1 - Approval / Pattern 1: Approval (Kẻ gác đền) / Ngăn chặn các hành động Destructive hoặc High-Value
020 Pattern 2 - Clarification / Pattern 2: Clarification (Hỏi lại cho chắc) / Xử lý Input mơ hồ từ người dùng
021 Pattern 3 - Escalation (Leo thang / Chuyển giao) / Pattern 3: Escalation (Chuyển cho chuyên gia) / Khi Agent biết giới hạn của mình (Out-of-Domain)
022 Pattern 4 - Review Checkpoint / Pattern 4: Review Checkpoint (Trạm kiểm duyệt kết quả) / Xác minh output phức tạp trước khi phát hành
023 Pattern 5 - Edit / Correction / Pattern 5: Edit / Correction (Chỉnh sửa nội dung) / Khi "Approve/Reject" là không đủ
024 Risk-Based Routing Policy (Hard Rules) / Khi thuật toán nhường bước cho pháp lý / Nguyên tắc & Kiến trúc
025 Hard Rules trong Hệ thống Tài chính & Ngân hàng / Vùng cấm địa của Full Autonomy (Red Zones) / Dưới đây là các tác vụ luôn yêu cầu HITL Strict hoặc Escalation:
026 3 / Confidence Routing & AI / Self-Evaluation
027 Cơ chế tự đánh giá độ tự tin (Mechanics of Confidence) / Agent làm sao biết mình cần trợ giúp? / Để xây dựng cơ chế định tuyến (Routing),
028 Log Probabilities (Logprobs) / Đo lường độ tự tin qua Toán học (Token Probability) / Bản chất & Cách hoạt động
029 Prompt-based Self-Reflection / Đo lường độ tự tin qua Prompting (Tự suy ngẫm) / Bản chất: Thêm một yêu cầu (instruction) vào
030 The Overconfidence Problem / Khi Agent "Ngốc nhưng Tự tin" / Sycophancy (Tính xu
031 Kỹ thuật Calibrate 1 — Consistency Checks / Kiểm tra tính nhất quán (Self-Consistency) / Vấn đề: Làm sao để ép LLM nói thật về độ tự
032 Kỹ thuật Calibrate 2 — Multi-Agent Debate / Tranh biện đa tác tử (Multi-Agent Debate) / Kiến trúc: Sử dụng một Agent thứ hai
033 Luồng định tuyến (Confidence Routing Flow) / Phân luồng dựa trên điểm tự tin (Sau hiệu chuẩn) / Chúng ta chia mức độ tự tin thành 3 phân khu (Tiers) để tối ưu hóa UX và rủi ro:
034 Flowchart Quyết định (Decision Routing) / LangGraph Routing Logic / Hệ thống phân luồng tự động dựa trên điểm tin cậy (Confidence Score) và các chính sách kiểm soát tối cao.
035 Empirical Tuning - Điểm Threshold không phải là phép màu / Không có "Magic Number" (Con số ma thuật) cho Confidence / Sai lầm phổ biến
036 Hiệu chỉnh với Dữ liệu lịch sử (Calibrating with Data) / Giảng viên (VinUni) / Tuần 6
037 4 / Implementation with / LangGraph
038 State Management trong LangGraph / Tại sao HITL cần State Persistence (Lưu / trữ trạng thái)?
039 Giới thiệu MemorySaver và Checkpointer / MemorySaver: Bộ nhớ ngắn hạn / ●
040 Thread ID - Quản lý nhiều phiên làm việc / Làm sao để Agent phục vụ 1000 khách / hàng cùng lúc?
041 Chiến lược Ngắt (Interrupt Strategies) / Hai vị trí "đặt trạm gác" trong LangGraph / 1. interrupt_before
042 Kịch bản 1 - interrupt_before / Ví dụ: Phê duyệt ưu đãi giữ chân khách hàng (Churn Retention) / Tình huống: Agent dự đoán khách hàng có nguy cơ rời bỏ cao và đề xuất cấp mã
043 Kịch bản 2 - interrupt_after / Ví dụ: Review Báo cáo Total Operating Income (TOI) / Tình huống: Agent tổng hợp dữ liệu giao dịch và viết báo cáo phân tích TOI chi tiết
044 State Machine / Vòng đời của một Graph bị Interrupt / 1
045 Code Walkthrough - Compile Graph / Bước 1: Khai báo trạm kiểm duyệt trong Code / Khai báo Checkpointer:
046 Code Walkthrough - Invoke & Inspect / Bước 2: Chạy đồ thị và Kiểm tra trạng thái dừng / Chạy đồ thị với Thread ID:
047 Code Walkthrough - Phân tích Pending Action / Bước 3: Đọc dữ liệu Agent đề xuất (Đẩy lên UI) / # Lấy dữ liệu (state) Agent đã sinh ra
048 Code Walkthrough - Resume Graph / Bước 4: Cập nhật quyết định và Đánh thức đồ thị / Cập nhật State:
049 Edge Cases - Khi con người "bỏ đi ăn trưa" / Bài toán: Stale State / Timeout / ⚠ VẤN ĐỀ & RỦI RO (STALE STATE)
050 Triển khai TTL (Time-To-Live) cho Approval / Thiết lập "Thời hạn sử dụng" cho một Pending Action / TTL là gì?
051 Timeout Architecture - Kiến trúc Kỹ thuật / Xử lý State quá hạn (Expired State) trong LangGraph / Cơ chế kiểm soát TTL
052 Handling Rejections - Xử lý khi bị từ chối / Chuyện gì xảy ra khi con người bấm "Reject"? / Định tuyến lại (Reroute) thay vì
053 5 / UI/UX Design for HITL - / Avoiding Alert Fatigue
054 UI/UX trong HITL - Tại sao Giao diện lại mang tính sống còn? / Giao diện tồi = Quyết định tồi / Thách thức & Giải pháp
055 Phân tích một "Action Card" trên Streamlit / Cấu trúc chuẩn của một yêu cầu phê duyệt / Một Action Card tốt phải trả lời được 3 câu
056 Sức mạnh của Diff View (Hiển thị thay đổi) / Đừng chỉ nói, hãy chỉ ra sự khác biệt (Delta) / Khái niệm Diff View
057 Explainable AI (XAI) trên Giao diện / Không nên bắt người dùng phải chơi trò đoán mò / Vấn đề của Black Box
058 Traceability - Cung cấp bằng chứng (Evidence) / Tiết kiệm số lần click chuột (Click-saving Rule) / Nguyên tắc cốt lõi
059 Kẻ thù số 1 - Alert Fatigue / Hội chứng Mệt mỏi vì Cảnh báo (Alert Fatigue) / Bài học từ Cybersecurity
060 Tác động của Alert Fatigue đến Vận hành / HITL trở thành Nút thắt cổ chai (Bottleneck) / Thách thức Vận hành
061 Giải pháp: Batch Approvals (Phê duyệt hàng loạt) / Xử lý số lượng lớn bằng Bulk Actions / Khái niệm cốt lõi
062 Thiết kế Batch UI An toàn / Nguyên tắc vàng khi thiết kế Batch UI / 1. Không trộn lẫn Rủi ro: Không bao giờ
063 Tóm tắt UI/UX Design cho HITL / Checklist thiết kế Giao diện Duyệt Agent / ●
064 6 / Audit Trails, Compliance, & / Continuous Learning
065 Bức tranh Pháp lý & Tuân thủ (Compliance) / Audit Trail: Không chỉ là Log, mà là Sinh mệnh Pháp lý / ●
066 Lược đồ Dữ liệu Kiểm toán (The Audit Trail Schema) / Ghi lại mọi khoảnh khắc quyết định / from pydantic import BaseModel
067 Append-only PostgreSQL & Session Replay / Tính Bất biến (Immutability) và Tái hiện (Replay) / ●
068 Decision Analytics - Đo lường Sức khỏe Hệ thống / Agent của bạn thực sự đang làm tốt đến đâu? / Thay vì chỉ đo lường số lượng task, chúng ta phải đo lường "Chất lượng của sự cộng tác" giữa Người và AI
069 Phân tích Metrics (Insights from Data) / Đọc vị các chỉ số HITL / 01. APPROVAL RATE > 95%
070 Progressive Autonomy (Tự trị Lũy tiến) / Xây dựng niềm tin theo thời gian (Trust Builds Incrementally) / Triết lý: Không ai tin tưởng một Agent vào ngày đầu tiên ra mắt. Hãy để AI chứng minh năng lực từng
071 Vòng lặp Dữ liệu (The Data Flywheel) / HITL không phải là Thuế, nó là Khoản đầu tư Dữ liệu / 01. HAI GÓC NHÌN VỀ CHI PHÍ HITL
072 Chuyển hóa Lỗi sai thành Preference Data / Từ nút "Edit" đến DPO (Direct Preference Optimization) / Khi người dùng bấm Edit trên Streamlit và sửa đổi thông tin do Agent tạo ra,
073 Kiến trúc Hệ thống Fine-Tuning tự động / Khép kín vòng lặp (Closing the Loop) / SƠ ĐỒ KIẾN TRÚC TỔNG THỂ (SYSTEM ARCHITECTURE DIAGRAM)
074 Tóm tắt Phần 6 / Tổng kết: Sẵn sàng cho Enterprise Production / BẮT BUỘC PHÁP LÝ
075 Tổng kết — Key Takeaways / Những ý chính cần nhớ sau buổi học hôm nay / 1
076 Bức tranh toàn cảnh - System Architecture Diagram / Kiến trúc Hệ thống HITL Production-Ready / THÀNH PHẦN KIẾN TRÚC CỐT LÕI
077 Q&A
078 Thank you! / AICB-P2T3 · Ngày 27 · Human-in-the-Loop UX / github.com/vinuni-aicb

## t3-d16-4e9a3912938d36c6 · Day 28: Workshop Tổng hợp (30 pages)

001 Workshop Tổng Hợp — Full / Production Agent System / AICB-P2T3 · Ngày 28 · Chương 6 — Agent trong Production
002 ? / HÃY SUY NGHĨ... / “Một AI agent production-
003 Nội dung vận hành / 1. Kiến trúc toàn cảnh — Review N16–N27 / 2. Production Readiness Checklist
004 01 / Kiến trúc toàn cảnh — Review / N16–N27
005 Full Production Agent — Tất cảcomponents / User / Client / HITL Approval (N27) + Guardrails (N24)
006 Component Interaction — Ai nói chuyện với ai? / User / HITL Gate
007 Agenda hôm nay — 4 giờ / 1 / Architecture
008 02 / Production Readiness Check- / list
009 Checklist — Functional Requirements / Functional / □
010 Checklist — Security & Operations / Security / □✓
011 03 / Benchmark Framework / Đánh giá toàn diện hệthống — không chỉaccuracy
012 Holistic System Evaluation — 4 dimensions / Accuracy / Latency
013 Benchmark Report Template / Metric / Target
014 04 / Documentation Standards / Hệthống không document thì không maintain được
015 3 loại documentation bắt buộc / ADRs / Why Reflexion not LATS?
016 05 / Peer Review Process / Swap codebase, review theo checklist, cho feedback ac-
017 Peer Review — Structured Feedback / 1 / Swap codebase + read
018 06 / Hands-on Integration Sprint / Thời gian chính: ghép components, test, benchmark, và
019 Lab #28 / Mục tiêu: Integrate tất cảcomponents thành Full Production Agent System / Deliverable: GitHub repo (documented, CI) + benchmark report + peer re-
020 Lab 28 — Phase 1: Integration (60 phút) / 1. Connect components: Agent Core →Memory →GraphRAG →MCP Tools / 2. Wire guardrails: Input validation →PII detection →Output guardrails
021 Lab 28 — Phase 2: Benchmark & Test (30 phút) / 1. E2E test: chạy 50-question test set, đo RAGAS scores / 2. Chaos test: tắt OpenAI mid-run, verify circuit breaker + fallback
022 Lab #28b / Mục tiêu: Peer Review: swap codebase, review theo checklist, viết feed- / back
023 Lab 28 — Phase 3: Peer Review (30 phút) / 1. Swap: đổi repo URL với pair partner / 2. Clone & Run: git clone →docker compose up →test demo
024 07 / Live Demo & Milestone 3 / Full system demo + submission requirements
025 Full Production Agent — End-to-End Demo / 1. Task: “Analyze AI safety papers, summarize, identify problems, tạo / action items”
026 Milestone 3 — Submission Guide / 1 / GitHub Repo
027 Tổng kết — Key Takeaways / Những ý chính cần nhớsau buổi học hôm nay / 1
028 Tiếp theo & Bài tập / Ngày 29: / Thi Midterm — Lý
029 Hỏi & Đáp / Hệthống production-ready thật sự / cần gì — ngoài “code chạy được”?
030 Cảm ơn! / AICB-P2T3 · Ngày 28 · Workshop Tổng / Hợp — Full Production Agent System

## t3-d16-material_mvabb0px_ucd74d · Slide-Bai-Giang-Day-28 (35 pages)

001 Workshop Tổng Hợp — Full / Production Agent System / AICB-P2T3 · Ngày 28 · Chương 6 — Agent trong Production
002 ? / HÃY SUY NGHĨ... / “Một AI agent production-
003 Nội dung buổi học / Phạm Mạnh / AICB · Ngày 28
004 01 / Kiến trúc toàn cảnh — Review / N16–N27
005 Full Production Agent — Tất cảcomponents / User / Client / HITL Approval (N27) + Guardrails (N24)
006 Context engineering / Phạm Mạnh / AICB · Ngày 28
007 Harness cho agent chạy dài / Phạm Mạnh / AICB · Ngày 28
008 Component Interaction — Ai nói chuyện với ai? / User / HITL Gate
009 Durable execution và idempotency / Phạm Mạnh / AICB · Ngày 28
010 Tool calling: schema, quyền và dữ liệu / Phạm Mạnh / AICB · Ngày 28
011 MCP và A2A / Phạm Mạnh / AICB · Ngày 28
012 HITL theo hành động và mức rủi ro / Phạm Mạnh / AICB · Ngày 28
013 02 / Production Readiness Check- / list
014 Checklist — Functional Requirements / Functional / □
015 Checklist — Security & Operations / Security / □✓
016 Từ phát triển đến go-live / Phạm Mạnh / AICB · Ngày 28
017 Phối hợp các team khi release / Phạm Mạnh / AICB · Ngày 28
018 Canary, go-live và rollback / Phạm Mạnh / AICB · Ngày 28
019 Holistic System Evaluation — 4 dimensions / Accuracy / Latency
020 Benchmark Report Template / Metric / Target
021 Đánh giá agent: outcome và độ ổn định / Phạm Mạnh / AICB · Ngày 28
022 04 / Documentation Standards / Hệthống không document thì không maintain được
023 3 loại documentation bắt buộc / ADRs / Why Reflexion not LATS?
024 Peer Review — Structured Feedback / 1 / Swap codebase + read
025 Ví dụ xử lý yêu cầu end-to-end / Phạm Mạnh / AICB · Ngày 28
026 Voice AI: turn-taking và ngắt lời / Phạm Mạnh / AICB · Ngày 28
027 Voice AI: tải hệ thống và chi phí / Phạm Mạnh / AICB · Ngày 28
028 06 / Chia sẻ dự án / Voice AI
029 Dự án 1: Voice Agent nhận cuộc gọi / Phạm Mạnh / AICB · Ngày 28
030 Dự án 2: Voice Agent gọi đi / Phạm Mạnh / AICB · Ngày 28
031 Dự án 3: Trợ lý cuộc họp / Phạm Mạnh / AICB · Ngày 28
032 Nguồn kiến thức bổ sung / Phạm Mạnh / AICB · Ngày 28
033 Tổng kết / Phạm Mạnh / AICB · Ngày 28
034 Hỏi & Đáp / Hệthống production-ready thật sự / cần gì — ngoài “code chạy được”?
035 Cảm ơn! / AICB-P2T3 · Ngày 28 · Workshop Tổng / Hợp — Full Production Agent System

## t3-d16-214d48da68c4c97a · Slide theo video bài giảng (51 pages)

001 REAL-WORLD AI SYSTEMS / Kiến trúc tổng quan / hệ thống AI thực tế
002 M ĐẦU / Ở / Từ model chạy được đến system vận hành ngoài đời
003 M ĐẦU / Ở / Một lens chung để đọc mọi AI system
004 M ĐẦU / Ở / Chọn model sau khi trả lời 3 câu
005 M ĐẦU / Ở / 5 hệ thống chung data fly wheel, khác nhau ở risk surface
006 01 / 01 - ADAS / AUTONOMOUS DRIVING / Hệ thống xe tự hành
007 01 - ADAS / AUTONOMOUS DRIVING / ADAS là một stack nhiều lớp - không phải một model lái xe / Lớp an toàn, remote ops và cybersecurity phải đi cùng runtime trên xe; offb oard fly wheel biến hard cases thành bản phát hành an toàn hơn.
008 01 - ADAS / AUTONOMOUS DRIVING / ADAS: hard case phải quay về vòng học / Deploy không phải điểm kết thúc: hard case phải quay về data và validation.
009 01 - ADAS / AUTONOMOUS DRIVING / Xu hướng: hợp nhất dần perception, prediction và planning / End-to-end chỉ có ý nghĩa khi chạy trong safety envelope có thể quan sát và kiểm chứng.
010 01 - ADAS / AUTONOMOUS DRIVING / Product reality: ODD, luật và niềm tin quyết định tốc độ scale / Giữ các mốc sản phẩm quan trọng; chi tiết vendor và citation nằm ở appendix.
011 01 - ADAS / AUTONOMOUS DRIVING / ADAS: 6 bài học kiến trúc nên nhớ / Các quyết định khó nhất thường nằm ở hệ thống, không nằm trong model.
012 02 / 02 - AUTONOMOUS DELIVERY ROBOT / Robot giao hàng
013 02 - AUTONOMOUS DELIVERY ROBOT / Robot nhỏ, nhưng system cloud - edge - human rất hoàn chỉnh / Fleet cloud không chỉ dispatch đơn hàng: nó là nơi remote assist, observability và map updates giúp robot scale.
014 02 - AUTONOMOUS DELIVERY ROBOT / Delivery: ca khó phải dạy cả fleet / Remote assist không chỉ cứu một ca; nó tạo dữ liệu để giảm ca tương tự.
015 02 - AUTONOMOUS DELIVERY ROBOT / Scale fleet an toàn và rẻ quan trọng hơn demo đi được một đoạn / KPI phải đo assist per mile/order, delivery success và cost - không chỉ tỷ lệ robot tự chạy.
016 02 - AUTONOMOUS DELIVERY ROBOT / Tín hiệu product: số chuyến, quy mô fleet và cost per delivery / Số liệu là vendor-reported và phù hợp để thảo luận scale vận hành, không phải benchmark độc lập.
017 02 - AUTONOMOUS DELIVERY ROBOT / Robot giao hàng thành công biết xin trợ giúp đúng lúc / Tính chấp nhận của con người và economics vận hành là một phần của kiến trúc.
018 03 / 03 - AI SYSTEM FOR CCTV / Video AI cho camera
019 03 - AI SYSTEM FOR CCTV / CCTV AI chuẩn: camera → edge → event → review → audit / Không phân tích mọi frame bằng model lớn: detector nhẹ tạo event, model lớn/VLM chỉ chạy trên clip đáng ngờ.
020 03 - AI SYSTEM FOR CCTV / CCTV: event cần triage trước khi quyết định / Mục tiêu là quyết định đáng tin, không phải thật nhiều alert.
021 03 - AI SYSTEM FOR CCTV / Video security đang chuyển từ class cố định sang hỏi video / Khả năng tìm kiếm bằng ngôn ngữ tự nhiên phải đi cùng index, false-alarm control và governance.
022 03 - AI SYSTEM FOR CCTV / Sản phẩm thắng nhờ UX điều tra, false alarms và quản trị dữ liệu / Ví dụ London Underground dùng để thảo luận rủi ro false positives, privacy và public acceptance trước khi scale.
023 03 - AI SYSTEM FOR CCTV / Mục tiêu CCTV: chỉ gửi clip đáng xem cho con người / Event-fir st, index và feedback loop tạo ra operational leverage.
024 04 / 04 - AI SYSTEM FOR HUMANOID ROBOT / End-to-end, VLA và
025 04 - AI SYSTEM FOR HUMANOID ROBOT / Tách reasoning chậm khỏi control nhanh / VLA = vision-language-action; reasoning không chạy ở tần số motor. System 2 và System 1 phải phối hợp qua whole-body control.
026 04 - AI SYSTEM FOR HUMANOID ROBOT / Humanoid: dữ liệu task nối plan với control / Chuỗi thao tác chỉ thành dữ liệu khi được quan sát, ghi lại và review.
027 04 - AI SYSTEM FOR HUMANOID ROBOT / VLA là LLM moment của robotics - nhưng contact vẫn cần RL + control / Foundation model tăng generalization; locomotion và manipulation vẫn cần data, simulation và motor-control ổn định.
028 04 - AI SYSTEM FOR HUMANOID ROBOT / Humanoid chuyển từ video demo sang pilot, runtime và factory tasks / Tách rõ demo capability, pilot runtime và benchmark độc lập khi đánh giá product claim.
029 04 - AI SYSTEM FOR HUMANOID ROBOT / End-to-end + RL: ghép theo tốc độ điều khiển / Không ép một model duy nhất làm mọi thứ ở mọi tần số điều khiển.
030 04 - AI SYSTEM FOR HUMANOID ROBOT / Humanoid: 6 bài học kiến trúc nên nhớ / Robot giống người không có nghĩa bài toán dễ hơn; chỉ khớp hơn với môi trường thiết kế cho người.
031 05 / 05 / 05 - SATELLITE IMAGE APPLICATION / GEOAI
032 05 - SATELLITE IMAGE APPLICATION / GEOAI / GeoAI là data engineering lớn trước khi là bài toán model / Chuẩn hóa, geo index và uncertainty là nền cho AI task, analyst workflow và dashboard có thể vận hành.
033 05 - SATELLITE IMAGE APPLICATION / GEOAI / GeoAI: uncertainty phải dẫn tới hành động / Ảnh nào đáng xem tiếp phải được chọn theo uncertainty và workflow.
034 05 - SATELLITE IMAGE APPLICATION / GEOAI / Foundation model + time series + multimodal fusion là hướng lớn / Không kết luận từ một ảnh đơn lẻ: baseline theo mùa/cảm biến và confidence change/no-change là phần lõi.
035 05 - SATELLITE IMAGE APPLICATION / GEOAI / Product mạnh nhất ghép revisit, high-res tasking, analytics và workflow / Các số liệu kho dữ liệu và product claim được giữ như tín hiệu scale; chi tiết nguồn ở appendix.
036 05 - SATELLITE IMAGE APPLICATION / GEOAI / Satellite AI có vẻ tĩnh, nhưng production GeoAI là operational intelligence / Temporal baseline, uncertainty và analyst loop giúp tránh false change và biến insight thành hành động.
037 T NG H P / Ổ / Ợ
038 T NG H P / Ổ / Ợ
039 T NG H P / Ổ / Ợ
040 T NG H P / Ổ / Ợ
041 T NG H P / Ổ / Ợ
042 T NG H P / Ổ / Ợ
043 T NG H P / Ổ / Ợ
044 T NG H P / Ổ / Ợ
045 APPENDIX - REFERENCES / References — ADAS / Autonomous Driving / Nhấp vào tên tài liệu để mở URL nguồn gốc.
046 APPENDIX - REFERENCES / References — Autonomous Delivery Robot / Nhấp vào tên tài liệu để mở URL nguồn gốc.
047 APPENDIX - REFERENCES / References — AI System for CCTV / Nhấp vào tên tài liệu để mở URL nguồn gốc.
048 APPENDIX - REFERENCES / References — AI System for Humanoid Robot / Nhấp vào tên tài liệu để mở URL nguồn gốc.
049 APPENDIX - REFERENCES / References — Satellite Image Application / GeoAI / Nhấp vào tên tài liệu để mở URL nguồn gốc.
050 APPENDIX - REFERENCE MAP / Chọn nguồn theo vai trò, rồi kiểm chứng evidence / Với mỗi nguồn, hỏi 4 câu: data gì, architecture gì, metric gì và evidence độc lập hay vendor demo?
051 Q&A / DISCUSSION / Chọn một hệ thống / và vẽ lại 4 flo w
