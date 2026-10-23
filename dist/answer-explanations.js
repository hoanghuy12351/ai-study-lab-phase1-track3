// Trình bày nội dung biên soạn trong ngân hàng; không sinh đáp án hoặc đổi answer key.
(() => {
  'use strict';
  const lessons=window.STUDY_COURSE?.lessons||window.PHASE1_LESSONS;
  const current=lessons.flatMap(l=>l.questions.map(q=>({...q,day:l.day})));
  const archive=window.QUESTION_ARCHIVE||[];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const glossary={
    'large language model':'mô hình ngôn ngữ lớn','LLM':'mô hình ngôn ngữ lớn','AI':'trí tuệ nhân tạo',
    'machine learning':'học máy','ML':'học máy','deep learning':'học sâu','embedding':'biểu diễn dữ liệu bằng vector','embeddings':'các biểu diễn dữ liệu bằng vector',
    'inference':'quá trình mô hình tạo kết quả','fine-tuning':'tinh chỉnh mô hình','fine-tune':'tinh chỉnh mô hình','tune':'tinh chỉnh mô hình',
    'retrieval':'truy xuất thông tin','retriever':'bộ truy xuất','reranker':'bộ xếp hạng lại','rerank':'xếp hạng lại',
    'RAG':'sinh câu trả lời có bổ sung thông tin truy xuất','context window':'giới hạn lượng ngữ cảnh','context':'ngữ cảnh cấp cho mô hình',
    'token':'đơn vị văn bản mô hình xử lý','tokens':'các đơn vị văn bản mô hình xử lý','prompt':'chỉ dẫn và dữ liệu đầu vào cho mô hình',
    'hallucination':'mô hình tạo thông tin không có cơ sở','grounding':'gắn kết luận với bằng chứng','ground truth':'dữ liệu chuẩn để đối chiếu',
    'faithfulness':'mức câu trả lời được ngữ cảnh hỗ trợ','recall':'mức bao phủ thông tin cần tìm','precision':'độ chính xác trong các kết quả tìm được',
    'agent':'hệ thống ra quyết định và dùng công cụ theo mục tiêu','agentic':'có khả năng chủ động quyết định và hành động',
    'tool':'công cụ mà ứng dụng cho phép gọi','tool call':'yêu cầu gọi công cụ','function call':'đề xuất gọi hàm',
    'Reflexion':'cải thiện lần thử nhờ phản hồi và bài học','reflection':'bài học rút ra từ lần thử','memory':'bộ nhớ',
    'weights':'trọng số mô hình','parameters':'các tham số mô hình','trainable':'được phép cập nhật khi huấn luyện',
    'LoRA':'tinh chỉnh bằng các ma trận cập nhật hạng thấp','QLoRA':'huấn luyện adapter với mô hình nền lượng tử hóa',
    'adapter':'phần tham số bổ sung được huấn luyện','adapters':'các phần tham số bổ sung được huấn luyện','base model':'mô hình nền',
    'optimizer states':'trạng thái bộ tối ưu','activations':'giá trị trung gian khi tính toán','loss':'hàm đo sai lệch để huấn luyện',
    'gradient':'tín hiệu đạo hàm để cập nhật tham số','rank':'hạng của ma trận cập nhật','low-rank':'có hạng thấp','quantized':'đã lượng tử hóa',
    'frozen':'đóng băng trọng số','linear layer':'lớp biến đổi tuyến tính','forward':'tính toán lan truyền xuôi','backprop':'lan truyền ngược để tính đạo hàm',
    'optimizer':'bộ tối ưu cập nhật tham số','target modules':'các lớp được gắn adapter','requires_grad':'cờ cho phép tính gradient',
    'SFT':'tinh chỉnh có giám sát','DPO':'tối ưu theo cặp câu trả lời được ưa thích','CPT':'tiếp tục tiền huấn luyện',
    'RLVR':'học tăng cường với phần thưởng có thể kiểm chứng','reward':'tín hiệu thưởng để tối ưu','verifier':'bộ kiểm chứng',
    'reward hacking':'khai thác kẽ hở của tín hiệu thưởng','evaluator':'bộ đánh giá','judge':'bộ chấm','rubric':'tiêu chí chấm',
    'held-out':'được giữ riêng khỏi quá trình tối ưu','holdout':'tập được giữ riêng để đánh giá','baseline':'mốc so sánh ban đầu',
    'benchmark':'phép đánh giá theo bộ tác vụ chuẩn','eval':'đánh giá hệ thống','metric':'chỉ số đo lường','metrics':'các chỉ số đo lường',
    'position bias':'thiên lệch do vị trí trình bày','pairwise':'so sánh theo cặp','confidence':'mức tự tin được báo',
    'logprob':'log xác suất của token','likelihood':'mức phù hợp của dữ liệu với phân bố mô hình','MoE':'mô hình kết hợp nhiều nhánh chuyên gia',
    'checkpoint':'bản lưu trạng thái để tiếp tục tiến trình','state':'trạng thái','reducer':'quy tắc hợp nhất cập nhật trạng thái',
    'interrupt':'điểm tạm dừng tiến trình','replay':'chạy lại từ trạng thái đã lưu','side effect':'tác động ra hệ thống bên ngoài',
    'idempotency':'cơ chế chống tạo tác động lặp cho cùng hành động','idempotency key':'khóa nhận diện cùng một hành động logic',
    'authorization':'kiểm tra quyền thực hiện','authentication':'xác thực danh tính','scope':'phạm vi được phép',
    'sandbox':'môi trường thực thi có giới hạn','policy':'quy tắc hệ thống hoặc nghiệp vụ','approval':'phê duyệt hành động',
    'latency':'thời gian phản hồi','concurrency':'số tác vụ đang chạy đồng thời','throughput':'số tác vụ xử lý mỗi đơn vị thời gian',
    'backoff':'tăng khoảng chờ giữa các lần thử lại','jitter':'độ lệch ngẫu nhiên của thời gian chờ','retry':'thử lại yêu cầu',
    'circuit breaker':'cơ chế tạm ngắt lời gọi tới thành phần đang lỗi','fallback':'phương án dự phòng','deadline':'hạn hoàn tất',
    'TTL':'thời gian dữ liệu được coi là còn hiệu lực','semantic':'liên quan đến ý nghĩa','false hit':'cache trúng nhưng trả kết quả không phù hợp',
    'trace':'dấu vết các bước thực thi','observation':'kết quả quan sát sau hành động','outcome':'kết quả thực tế của tác vụ',
    'schema':'cấu trúc dữ liệu quy định','contract':'cam kết về dữ liệu và hành vi','validation':'kiểm tra tính hợp lệ',
    'MCP':'giao thức kết nối ứng dụng AI với công cụ và dữ liệu','TCO':'tổng chi phí sở hữu và vận hành','ROI':'lợi ích so với chi phí đầu tư',
    'discriminative AI':'AI phân biệt hoặc phân loại đầu vào','generative AI':'AI tạo nội dung mới','agentic AI':'AI ra quyết định và thực hiện hành động',
    'few-shot':'cung cấp một vài ví dụ trong chỉ dẫn','zero-shot':'yêu cầu thực hiện mà không cho ví dụ mẫu',
    'Jobs-to-be-Done':'cách nhìn sản phẩm từ việc người dùng cần hoàn thành','CSAT':'mức hài lòng của khách hàng',
    'ReAct':'vòng suy luận, hành động và quan sát','LATS':'tìm kiếm các nhánh hành động cho agent','harness':'lớp điều khiển bao quanh mô hình',
    'middleware':'lớp xử lý xen giữa các bước','hook':'điểm gắn xử lý vào một sự kiện','hooks':'các điểm gắn xử lý vào sự kiện',
    'compaction':'nén ngữ cảnh giữ thông tin cần thiết','eviction':'loại bỏ dữ liệu khỏi vùng ngữ cảnh','skill':'quy trình hoặc công cụ có thể tái dùng',
    'skills':'các quy trình hoặc công cụ có thể tái dùng','attempt':'một lần thử','attempts':'các lần thử','budget':'ngân sách tài nguyên hoặc số bước',
    'episodic':'bộ nhớ trải nghiệm có diễn biến','procedural memory':'bộ nhớ cách thực hiện quy trình','namespace':'không gian phân tách dữ liệu',
    'thread':'luồng hội thoại hoặc thực thi','store':'kho dữ liệu dùng theo phạm vi và quyền','consent':'sự đồng ý cho mục đích được nêu',
    'hot path':'đường xử lý trực tiếp trong yêu cầu','background write':'ghi dữ liệu bằng tác vụ nền',
    'GraphRAG':'truy xuất kết hợp cấu trúc đồ thị để hỗ trợ sinh câu trả lời','graph':'đồ thị biểu diễn thực thể và quan hệ',
    'node':'nút trong đồ thị hoặc luồng xử lý','edge':'cạnh biểu diễn quan hệ hoặc hướng chuyển bước','subgraph':'đồ thị con',
    'entity resolution':'xác định các bản ghi cùng một thực thể','disambiguation':'phân biệt các đối tượng dễ nhầm',
    'entity linking':'gắn đề cập với thực thể đã biết','traversal':'duyệt theo các cạnh của đồ thị','hop':'một bước đi qua cạnh đồ thị',
    'BFS':'duyệt đồ thị theo chiều rộng','triple':'bộ ba chủ thể, quan hệ và đối tượng','provenance':'thông tin truy nguồn bằng chứng',
    'BM25':'phương pháp xếp hạng tài liệu dựa trên từ khóa','dense retrieval':'truy xuất bằng biểu diễn vector đặc',
    'lexical matching':'đối sánh từ hoặc ký hiệu trong văn bản','hybrid retrieval':'kết hợp truy xuất từ khóa và vector',
    'chunk':'đoạn dữ liệu dùng để lập chỉ mục hoặc truy xuất','chunks':'các đoạn dữ liệu dùng để truy xuất','chunking':'chia dữ liệu thành các đoạn',
    'corpus':'tập tài liệu','query':'truy vấn đầu vào','query transform':'biến đổi truy vấn trước khi truy xuất',
    'Matryoshka':'cách học biểu diễn hỗ trợ nhiều mức chiều lồng nhau','cosine':'độ tương đồng theo góc giữa hai vector',
    'tokenizer':'bộ chuyển văn bản thành token','chat template':'khuôn mã hóa các vai trò và lượt hội thoại',
    'full tuning':'tinh chỉnh toàn bộ trọng số được chọn của mô hình','PEFT':'tinh chỉnh hiệu quả bằng một phần nhỏ tham số',
    'quantization':'lượng tử hóa biểu diễn số','NF4':'định dạng lượng tử hóa 4 bit dùng trong QLoRA',
    'loss masking':'chọn các vị trí được tính vào hàm mất mát','labels':'nhãn mục tiêu cho quá trình học','epoch':'một lượt đi qua tập huấn luyện',
    'learning rate':'mức bước cập nhật tham số','dropout':'bỏ ngẫu nhiên một phần tín hiệu trong huấn luyện','batch':'nhóm mẫu xử lý cùng lượt',
    'KL':'độ lệch giữa hai phân bố xác suất','PPO':'thuật toán tối ưu chính sách có ràng buộc bước cập nhật',
    'GRPO':'tối ưu chính sách bằng so sánh tương đối trong nhóm','RLHF':'học tăng cường từ phản hồi của con người',
    'RLAIF':'học tăng cường từ phản hồi của AI','reference model':'mô hình tham chiếu để so sánh hoặc giữ hành vi',
    'reward model':'mô hình ước lượng mức thưởng','policy model':'mô hình sinh hành động hoặc câu trả lời được tối ưu',
    'DAG':'đồ thị có hướng không có chu trình','LangGraph':'thư viện tổ chức tác vụ thành đồ thị có trạng thái',
    'StateGraph':'đồ thị thực thi trao đổi trạng thái giữa các nút','super-step':'vòng thực thi các nút đủ điều kiện trong đồ thị',
    'fan-out':'chia công việc ra nhiều nhánh','join':'đợi và hợp nhất các nhánh','deterministic':'tuân theo logic xác định trước',
    'exactly-once':'bảo đảm tác động xảy ra đúng một lần trong phạm vi cam kết',
    'semaphore':'cơ chế giới hạn số tác vụ được vào vùng dùng tài nguyên','pool':'nhóm tài nguyên dùng chung có giới hạn',
    'retry storm':'làn sóng thử lại làm tải tăng mạnh','timeout':'hết thời gian chờ','cooldown':'khoảng chờ trước khi thử phục hồi',
    'probe':'lời gọi thăm dò trạng thái phục hồi','fail fast':'trả lỗi sớm khi chưa thể xử lý','cache':'bộ nhớ đệm để tái sử dụng dữ liệu',
    'hit rate':'tỷ lệ yêu cầu tìm được kết quả trong cache','false hit rate':'tỷ lệ cache trả trúng nhưng không phù hợp theo cách đo đã chọn',
    'invalidation':'làm dữ liệu đệm mất hiệu lực','stale-if-error':'dùng dữ liệu cũ được phép khi nguồn lỗi',
    'p95':'phân vị 95 của tập đo','p99':'phân vị 99 của tập đo','SLO':'mục tiêu mức chất lượng dịch vụ','SLI':'chỉ số đo chất lượng dịch vụ',
    'SLA':'cam kết mức dịch vụ','PII':'thông tin có thể nhận diện cá nhân','prompt injection':'chỉ dẫn không tin cậy cố đổi hành vi hệ thống',
    'guardrail':'rào kiểm tra giới hạn hành vi và dữ liệu','guardrails':'các rào kiểm tra giới hạn hành vi và dữ liệu',
    'HITL':'quy trình có con người tham gia kiểm tra hoặc quyết định','kill switch':'cơ chế dừng hoạt động khẩn cấp',
    'Definition of Done':'điều kiện để công việc được coi là hoàn tất','MVE':'thử nghiệm nhỏ để kiểm giả thuyết giá trị',
    'MVP':'phiên bản sản phẩm tối thiểu để học từ người dùng','PoC':'bản thử để kiểm tính khả thi','cohort':'nhóm đối tượng được phân tích cùng nhau',
    'confounders':'yếu tố gây nhiễu cho kết luận','temporal baseline':'mốc so sánh theo thời gian',
  };
  const terms=Object.keys(glossary).sort((a,b)=>b.length-a.length);
  const termPattern=new RegExp(`(?<![\\p{L}\\p{N}_])(${terms.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})(?![\\p{L}\\p{N}_])`,'giu');
  const meanings=new Map(Object.entries(glossary).map(([k,v])=>[k.toLowerCase(),v]));
  function formatter(){
    const seen=new Set();
    return value=>{
      const s=String(value??'');let html='',cursor=0;
      for(const match of s.matchAll(termPattern)){
        html+=esc(s.slice(cursor,match.index));const key=match[0].toLowerCase();
        html+=esc(match[0]);
        // Giữ định nghĩa đã có trong văn bản; chỉ chú giải lần đầu trong một lời giải.
        if(!seen.has(key)&&!/^\s*\(/.test(s.slice(match.index+match[0].length)))html+=` (${esc(meanings.get(key))})`;
        seen.add(key);cursor=match.index+match[0].length;
      }
      return html+esc(s.slice(cursor));
    };
  }
  const detail={};
  const D=(id,core,example,remember,reasons)=>detail[id]={core,example,remember,reasons};
  D('d1-q1','AI bao gồm nhiều cách xây dựng hệ thống thông minh. ML học từ dữ liệu; deep learning là một nhóm phương pháp trong ML, còn LLM là mô hình ngôn ngữ dùng deep learning.',
    'Backend lọc spam bằng mô hình phân loại là một ứng dụng ML. Dịch vụ tạo bản nháp trả lời bằng LLM là ứng dụng deep learning. Cả hai cùng thuộc AI; hệ luật kiểm hạn mức cũng có thể là một thành phần của hệ AI mà không dùng LLM.',
    'AI ⊃ ML ⊃ deep learning; LLM nằm trong deep learning.',
    {1:'Đảo chiều quan hệ: AI có phạm vi rộng hơn LLM.',2:'ML là một nhánh của AI, không tách rời AI.',3:'Hệ luật và mô hình phân loại là các ví dụ AI không nhất thiết dùng LLM.'});
  D('d1-q2','Discriminative AI học cách phân biệt đầu vào hoặc dự đoán nhãn. Ở đây đầu ra chỉ là một trong hai nhãn spam/không spam, nên bản chất là phân loại.',
    'API nhận nội dung email → mô hình dự đoán nhãn spam → backend đưa thư vào hộp thư hoặc thư rác. Không cần sinh một email mới, tìm tài liệu ngoài hay cho hệ thống tự lập kế hoạch hành động.',
    'Nhìn nhiệm vụ và đầu ra: gán nhãn là phân loại; viết nội dung mới là sinh nội dung.',
    {1:'Generative AI nhấn mạnh sinh nội dung; câu hỏi đang mô tả dự đoán nhãn.',2:'Đề không mô tả vòng quyết định và hành động của agent.',3:'RAG là cách kết hợp truy xuất với sinh câu trả lời, không phải tên của tác vụ gán nhãn này.'});
  D('d1-q3','Agent tổ chức vòng mục tiêu → quyết định → gọi tool → nhận observation → điều chỉnh. Điểm cốt lõi là hành động dựa trên phản hồi môi trường, đi kèm giới hạn quyền và điều kiện dừng.',
    'Một trợ lý hỗ trợ khách hàng đọc yêu cầu → gọi API tra đơn hàng → quan sát trạng thái giao hàng → quyết định hỏi thêm hoặc trả lời. Backend chỉ cho phép công cụ được cấp quyền và giới hạn số bước để tránh lặp vô hạn.',
    'Tính agent đến từ vòng hành động và phản hồi có kiểm soát.',
    {1:'Prompt dài hơn không tự tạo vòng hành động.',2:'Số tham số không xác định ứng dụng có gọi công cụ và dùng phản hồi hay không.',3:'Markdown chỉ là định dạng trình bày.'});
  D('d4-q1','Prompt rõ cần xác định vai trò, tác vụ, ngữ cảnh và định dạng đầu ra. Bốn phần giảm việc mô hình phải tự đoán người dùng muốn gì; chúng không thay thế kiểm tra dữ liệu ở runtime.',
    'API hỗ trợ khách hàng gửi: vai trò nhân viên hỗ trợ; tác vụ phân loại ticket; ngữ cảnh nội dung ticket và danh mục; định dạng JSON có category và reason. Backend vẫn parse JSON và kiểm schema trước khi ghi Database.',
    'Nêu rõ ai làm, làm gì, dùng dữ liệu nào và trả dạng gì.',
    {1:'Các tài nguyên hạ tầng không mô tả cấu trúc chỉ dẫn.',2:'Đây là các khái niệm ở những tầng khác nhau, không phải bốn phần của prompt.',3:'Các công nghệ triển khai không thay tác vụ, ngữ cảnh và định dạng đầu ra.'});
  D('d4-q2','Few-shot cung cấp ví dụ đầu vào/đầu ra trong prompt để mô hình nhận ra mẫu cần làm. Nó tác động qua context ở inference; bản thân việc thêm ví dụ không cập nhật weights.',
    'API phân loại ticket đưa hai ví dụ: “không đăng nhập được” → account và “bị trừ tiền hai lần” → billing, rồi đưa ticket mới. Zero-shot có thể chỉ nêu quy tắc phân loại và nhãn hợp lệ mà không kèm các ví dụ này.',
    'Few-shot thêm ví dụ vào context, không đồng nghĩa huấn luyện lại mô hình.',
    {1:'Fine-tuning cập nhật tham số; few-shot không bắt buộc làm việc đó.',2:'Zero-shot vẫn có thể có chỉ dẫn chi tiết; nó không có ví dụ mẫu cho tác vụ.',3:'Gọi tool là một khả năng khác, không phải điều kiện của few-shot.'});
  D('d4-q3','Prompt mô tả đầu ra mong muốn; validation ở runtime mới xác nhận dữ liệu thực sự tuân theo contract. Cần kiểm cả cú pháp JSON, kiểu dữ liệu, trường bắt buộc và xử lý lỗi có chủ đích.',
    'Backend nhận {"amount":"hai trăm"} cho schema yêu cầu amount là số. Dữ liệu có thể parse thành JSON nhưng vẫn sai kiểu, nên phải từ chối hoặc yêu cầu sửa trước khi gọi API thanh toán.',
    'JSON hợp cú pháp chưa đồng nghĩa hợp schema hay hợp nghiệp vụ.',
    {1:'Ký tự mở ngoặc không chứng minh chuỗi là JSON hợp lệ hoặc đúng kiểu.',2:'Temperature điều chỉnh lấy mẫu, không xác nhận contract.',3:'Bỏ qua trường bắt buộc che mất lỗi và có thể khiến bước sau dùng dữ liệu thiếu.'});
  D('d13-q3','p95 latency là ngưỡng thời gian mà khoảng 95% request trong tập đo không vượt quá. Nó mô tả phân bố thời gian, không phải độ đúng của câu trả lời; cách ước lượng percentile phụ thuộc công cụ đo.',
    'Ví dụ minh họa: dashboard một API báo p95 = 2 giây. Phần lớn request hoàn tất trong ngưỡng này nhưng vẫn có đuôi chậm hơn. Khi tối ưu hệ RAG, cần đo cả p95 và chất lượng câu trả lời, thay vì chỉ nhìn latency trung bình.',
    'p95 nói về đuôi thời gian phản hồi, không phải 95% câu trả lời đúng.',
    {1:'Đây là phát biểu về correctness, không phải thời gian phản hồi.',2:'Trung bình và percentile là hai cách tóm tắt phân bố khác nhau.',3:'95% là tỷ lệ trong phân bố đã đo, không phải thứ tự request tới hệ thống.'});
  D('t3-d21-u12-s','Với một linear layer, LoRA dùng hai ma trận có tổng r(d_in + d_out) tham số. Khi cấu trúc layer và tập target modules giữ nguyên, tăng rank phải tăng số tham số adapter. Nếu log không đổi, cần xác minh cấu hình thực sự được áp dụng trước khi kết luận về hiệu quả huấn luyện.',
    'Ở tình huống của đề, kiểm tra theo thứ tự: (1) Đọc cấu hình thực tế lúc khởi tạo adapter, tránh chỉ nhìn file cấu hình đã sửa nhưng chưa được nạp. (2) Liệt kê target modules cùng kích thước hai ma trận A/B để biết adapter đã gắn vào đâu. (3) Kiểm requires_grad và danh sách tham số được truyền vào optimizer, phân biệt tổng tham số với phần trainable. Cuối cùng, tính r(d_in + d_out) cho từng layer đã gắn, cộng lại rồi đối chiếu log và đường gradient. Cách này tìm được chỗ sai cấu hình hoặc cách đếm trước khi tốn thêm một lần train; không dùng loss giảm làm bằng chứng rằng rank mới đã có hiệu lực.',
    'Kiểm cấu hình đã nạp, adapter đã gắn và tham số thực sự được học trước khi tin log tổng.');

  // Các bài tính giữ nguyên số liệu, đơn vị, giả định và answer key trong đề.
  const calculations={
    'd1-q14':{
      core:'Tính riêng lượng input token và output token vì hai loại có đơn giá khác nhau. I và O được cho theo USD trên một triệu token; số lượt là theo ngày.',
      lines:['C_ngày = (N × T_in / 1.000.000) × I + (N × T_out / 1.000.000) × O','Thay số: (1.000 × 500 / 1.000.000)I + (1.000 × 200 / 1.000.000)O','Kết quả: C_ngày = 0,5I + 0,2O USD/ngày.'],
      meaning:'Đây là chi phí token theo giả định của đề, chưa bao gồm các khoản hạ tầng khác. Chưa có giá trị I và O thì chưa thể kết luận số USD cụ thể.',
      example:'Với API chatbot, ghi nhận token thực tế theo ngày, loại bỏ context dư và cache kết quả có thể tái dùng. So lại chất lượng sau tối ưu để tránh giảm chi phí bằng cách làm mất thông tin cần thiết.',
      remember:'Đếm token theo từng chiều, đổi về đúng đơn vị tính giá rồi cộng chi phí.',
    },
    't3-d21-q1-r2':{
      core:'LoRA huấn luyện hai ma trận nhỏ A và B để biểu diễn cập nhật cho ma trận gốc. Không tính bias, số tham số adapter phụ thuộc cả chiều input lẫn chiều output.',
      lines:['N_adapter = r × d_in + d_out × r = r(d_in + d_out)','Thay số: 8 × (768 + 3.072) = 8 × 3.840','Kết quả: 30.720 tham số adapter.','Đối chiếu: N_base = 768 × 3.072 = 2.359.296 tham số.'],
      meaning:'Chỉ đếm adapter của layer trong đề. Số này không phải tổng memory huấn luyện: còn base, activations và optimizer states tương ứng.',
      example:'Khi dự toán fine-tuning một layer của trợ lý hỗ trợ khách hàng, dùng 30.720 để ước lượng phần tham số adapter. Không dùng số adapter để kết luận toàn model đã vừa GPU.',
      remember:'LoRA có hai ma trận: r(d_in + d_out); ma trận gốc có d_in × d_out.',
      reasons:{0:'24.576 = 3.072 × 8, mới đếm nhánh output.',1:'6.144 = 768 × 8, mới đếm nhánh input.',3:'2.359.296 là số tham số ma trận gốc, không phải hai adapter.'},
    },
    't3-d21-u12-m-r2':{
      core:'LoRA thêm hai ma trận cập nhật hạng thấp vào phép tính của layer. Đóng băng base nghĩa là không cập nhật weights của base; không được suy ra rằng có thể loại bỏ phép tính qua base khỏi mạng.',
      lines:['N_base = d_in × d_out = 1.024 × 2.048 = 2.097.152','N_adapter = r(d_in + d_out) = 8 × (1.024 + 2.048) = 24.576','Nhánh input: 8 × 1.024 = 8.192; nhánh output: 2.048 × 8 = 16.384.'],
      meaning:'16.384 chỉ là một trong hai ma trận adapter. Base frozen không cần optimizer states để cập nhật base như full tuning, nhưng vẫn cần lưu weights và tính forward theo kiến trúc.',
      example:'Khi cấu hình optimizer cho một API model được tinh chỉnh bằng LoRA, chỉ truyền các parameters trainable. Đo memory thực tế thay vì lấy riêng số tham số adapter làm tổng chi phí huấn luyện.',
      remember:'Frozen là không cập nhật weights, không phải bỏ phép tính của base.',
      reasons:{'Adapter có 16.384 tham số vì chỉ tính chiều output':'Chỉ đếm 2.048 × 8, bỏ mất ma trận phía input có 8.192 tham số.'},
    },
    't3-d28-q1-r2':{
      core:'Đề yêu cầu cả hai lần đều thành công. Với giả định hai lần độc lập và cùng xác suất p, xác suất giao của hai sự kiện bằng tích xác suất.',
      lines:['P(cả hai thành công) = p × p = p²','Thay số: 0,7 × 0,7 = 0,49 = 49%.','Đối chiếu: P(ít nhất một lần thành công) = 1 − (1 − p)² = 0,91.'],
      meaning:'Yêu cầu thành công liên tiếp khắt khe hơn chỉ cần một lần đạt. Không dùng công thức tích này nếu các lần thử có phụ thuộc mà chưa mô hình hóa được.',
      example:'Trong phép đánh giá agent minh họa, nếu mỗi lần độc lập đạt tác vụ với xác suất 70%, yêu cầu đạt cả hai lần chỉ có xác suất 49%. Đây là tính theo giả định đề, không phải số đo của web hay của model thực.',
      remember:'“Cả hai” dùng tích khi độc lập; “ít nhất một” dùng một trừ xác suất thất bại hết.',
      reasons:{0:'0,91 là xác suất ít nhất một lần thành công, khác yêu cầu cả hai.',1:'0,70 là xác suất thành công của một lần.',2:'0,51 = 1 − 0,49 là xác suất không đạt cả hai lần.'},
    },
    't3-d28-q2-r2':{
      core:'Ở trạng thái ổn định theo giả định của đề, số cuộc đang xử lý trung bình bằng tốc độ nhận cuộc nhân thời gian giữ trung bình. Tốc độ nhận và số đang đồng thời có đơn vị khác nhau.',
      lines:['L = λ × W','Thay số: (4 cuộc/giây) × (90 giây) = 360 cuộc','Kết quả: concurrency trung bình xấp xỉ 360 cuộc.'],
      meaning:'Giây được triệt tiêu khi nhân đơn vị. Đây là trung bình trong mô hình ổn định, chưa phải công suất đỉnh cần cấp phát khi tải biến thiên.',
      example:'Một backend voice nhận và giữ cuộc như đề sẽ cần xử lý khoảng 360 phiên đồng thời ở mức trung bình. Khi chọn số worker, còn phải xem tải đỉnh, thời lượng phân bố và giới hạn provider.',
      remember:'Số đồng thời trung bình = tốc độ tới × thời gian ở trong hệ thống.',
      reasons:{0:'4 cuộc/giây là tốc độ tới, không phải số cuộc đang đồng thời.',2:'90 giây là thời gian giữ, không phải số cuộc.',3:'22,5 dùng phép chia không đúng công thức và đơn vị của số đồng thời.'},
    },
  };
  const order=(q,runId)=>window.P1Learning.shuffle(q.options.map((_,i)=>i),`${runId}:${q.id}`);
  const letter=(q,runId,index)=>String.fromCharCode(65+order(q,runId).indexOf(index));
  function describe(q){
    const bank=archive.some(old=>old.id===q.id)?archive:current;
    const related=bank.filter(s=>s.day===q.day&&s.topic===q.topic);
    const scenario=related.find(s=>s.scenario&&s.guide);
    const authored=detail[q.id]||{},calc=calculations[q.id];
    const why=q.why||related.find(s=>s.type==='multi')?.why||related.find(s=>s.why)?.why||q.sample;
    // Chỉ tách câu ở dấu kết thúc có khoảng trắng; không tách số thập phân hoặc số thứ tự.
    const sentences=why?.split(/(?<=[.!?])\s+(?=[^\d\s])/u).map(s=>s.trim()).filter(Boolean)||[];
    const topicDefinition=window.LESSON_OVERVIEWS?.[q.day]?.must.find(item=>item.topic===q.topic)?.body;
    const primary=calc?.core||authored.core||(q.type==='essay'&&!q.scenario?q.sample:sentences[0]||why);
    const core=topicDefinition&&!calc&&!authored.core?`${topicDefinition} ${primary}`:primary;
    const pitfalls=authored.core||calc?.core?null:sentences.length>1?sentences.slice(1).join(' '):null;
    return {
      core,calc,example:calc?.example||authored.example||null,
      scenario:scenario?.guide.situation||null,
      steps:scenario?.guide.steps||[],verify:scenario?.guide.verify||null,
      sample:q.type==='essay'&&q.scenario?q.sample:null,
      pitfalls,reasons:calc?.reasons||authored.reasons||{},
      remember:calc?.remember||authored.remember||(q.type==='essay'?q.guide?.verify:sentences[0])||q.rubric?.at(-1)||why,
      source:q.source,referenceIssue:q.referenceIssue||null,
    };
  }
  function render(q,{runId,answer={},revealed=false}={}){
    if(!revealed)return null;
    const model=describe(q),text=formatter();
    const right=q.type==='multi'?q.answers:q.type==='mc'?[q.answer]:[];
    const valid=q.type==='essay'||right.length>0&&right.every(i=>Number.isInteger(i)&&i>=0&&i<q.options.length);
    if(!valid)return {heading:'<strong>Chưa thể xác nhận đáp án: dữ liệu tham chiếu không hợp lệ.</strong>',body:'<p>Cần đối chiếu lại ngân hàng và tài liệu; không tự suy ra hoặc thay đáp án.</p>',remember:''};
    const sorted=right.slice().sort((a,b)=>order(q,runId).indexOf(a)-order(q,runId).indexOf(b));
    const heading=q.type==='essay'?`<strong>Hướng trả lời tham khảo — ${text(q.topic)}</strong>`:`<strong>Đáp án đúng: ${sorted.map(i=>letter(q,runId,i)).join(', ')} — ${sorted.map(i=>`${right.length>1?letter(q,runId,i)+': ':''}${text(q.options[i])}`).join('; ')}</strong>`;
    let body=model.referenceIssue?`<p class="reference-warning" role="note"><strong>Cần đối chiếu tài liệu:</strong> ${text(model.referenceIssue)} Đáp án tham chiếu được giữ nguyên.</p>`:'';
    body+=`<section class="explanation-section"><h4>1. Bản chất kiến thức</h4><p>${text(model.core)}</p></section>`;
    if(model.calc){
      body+=`<section class="explanation-section"><h4>2. Công thức và ví dụ thực tế</h4><div class="worked-calculation">${model.calc.lines.map(line=>`<p>${text(line)}</p>`).join('')}</div><p>${text(model.calc.meaning)}</p><p>${text(model.example)}</p></section>`;
    }else if(model.example){
      body+=`<section class="explanation-section"><h4>2. Ví dụ thực tế</h4><p>${text(model.example)}</p></section>`;
    }else if(model.scenario){
      body+=`<section class="explanation-section"><h4>2. Ví dụ thực tế</h4><p class="example-context">${text(model.scenario)}</p><ol>${model.steps.map(step=>`<li>${text(step)}</li>`).join('')}</ol>${model.verify?`<p><strong>Cách kiểm chứng:</strong> ${text(model.verify)}</p>`:''}</section>`;
    }
    if(q.type!=='essay'){
      const rejected=order(q,runId).filter(i=>!right.includes(i));
      const rationales=rejected.map(i=>({i,reason:model.reasons[i]||model.reasons[q.options[i]]})).filter(r=>r.reason);
      if(rationales.length||model.pitfalls){
        body+=`<section class="explanation-section"><h4>3. Vì sao đáp án khác sai?</h4>${rationales.length?`<ul>${rationales.map(r=>`<li><strong>${letter(q,runId,r.i)}:</strong> ${text(r.reason)}</li>`).join('')}</ul>`:''}${model.pitfalls?`<p>${text(model.pitfalls)}</p>`:''}</section>`;
      }
      const chosen=q.type==='multi'?(answer.choices||[]):Number.isInteger(answer.choice)?[answer.choice]:[];
      const wrong=chosen.filter(i=>!right.includes(i)),missing=sorted.filter(i=>!chosen.includes(i));
      if(wrong.length||missing.length)body+=`<p class="answer-difference">${wrong.length?`Bạn chọn sai: <strong>${wrong.map(i=>letter(q,runId,i)).join(', ')}</strong>. `:''}${missing.length?`Bạn chưa chọn: <strong>${missing.map(i=>letter(q,runId,i)).join(', ')}</strong>.`:''}</p>`;
    }
    return {heading,body,remember:`<p class="explanation-memory"><strong>Ghi nhớ:</strong> ${text(model.remember)}</p>`};
  }
  window.P1Explanations={describe,render,order,letter};
})();
