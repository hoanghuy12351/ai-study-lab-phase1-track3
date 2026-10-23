// Câu vận dụng v2: bối cảnh + quyết định có điều kiện; không sao chép quiz VLearn.
(() => {
  const lessons=window.STUDY_COURSE?.lessons||window.PHASE1_LESSONS;
  const byDay=new Map(lessons.map(l=>[l.day,l])),patches=new Map();
  const original=lessons.flatMap(l=>l.questions.map(q=>({...q,day:l.day,lessonTitle:l.title})));
  function M(day,topic,decision,claims,why,scene){
    const l=byDay.get(day);if(!l)return;
    const q=l.questions.find(q=>q.type==='multi'&&q.topic===topic&&!patches.has(q.id));
    if(!q)throw Error(`Không có câu nhiều đáp án chưa sửa: ${day}/${topic}`);
    const context=scene||l.questions.find(q=>q.scenario&&q.topic===topic)?.guide.situation;
    if(!context)throw Error(`Thiếu bối cảnh: ${day}/${topic}`);
    patches.set(q.id,{...q,day,lessonTitle:l.title,id:`${q.id}-r2`,previousId:q.id,revision:2,level:'apply',
      prompt:`${context}\n\n${decision} Chọn tất cả phương án phù hợp.`,
      options:claims.map(s=>s.slice(1)),answers:claims.flatMap((s,i)=>s[0]==='+'?[i]:[]),why,
      cardFront:`${context} Nêu cách phân tích, xử lý và bằng chứng cần kiểm.`,
    });
  }
  function C(id,prompt,options,answer,why){
    const q=original.find(q=>q.id===id);if(!q)return;
    patches.set(id,{...q,id:`${id}-r2`,previousId:id,revision:2,level:'apply',prompt,options,answer,why});
  }
  function V(day,topic,index,claim,note){
    if(!byDay.has(day))return;
    const q=[...patches.values()].find(q=>q.day===day&&q.topic===topic&&q.type==='multi');
    if(!q)throw Error(`Biến thể không có câu gốc: ${day}/${topic}`);
    q.options[index]=claim.slice(1);q.answers=q.answers.filter(i=>i!==index);
    if(claim[0]==='+')q.answers.push(index);
    q.answers.sort((a,b)=>a-b);q.why+=' '+note;
  }

  M(16,'Giới hạn ReAct','Cần khoanh vùng nguyên nhân trước khi đổi kiến trúc. Những bước nào có giá trị chẩn đoán?',[
    '+Đối chiếu file được chọn với file trong yêu cầu','-Tăng số attempt, dùng điểm cuối để suy ra bước chọn file đúng','+Kiểm observation tại lần lệch đầu tiên trong trace','-Đổi sang supervisor trước khi kiểm kết quả đọc file','+Replay cùng PR sau khi sửa routing'], 'Lỗi chọn file nằm trước phần nhận xét. Thêm attempt hay supervisor có thể lặp cùng lỗi; cần kiểm observation và so lại cùng PR.');
  M(16,'Vòng Reflexion','Những kiểm tra nào phân biệt được vì sao lần thử sau chưa cải thiện?',[
    '+Kiểm bài học có được nạp vào attempt sau','+Kiểm evaluator có chỉ ra được lỗi cụ thể','-Dùng lời actor tự báo thành công thay nhãn kiểm định','-Tăng số nhánh tìm kiếm để suy ra memory đã hoạt động','+So chiến lược trước và sau khi cấp reflection'], 'Phải kiểm cả feedback được tạo và được dùng. Số attempt/nhánh hay lời tự báo không chứng minh có thay đổi chiến lược.');
  M(16,'Evaluator có cấu trúc','Muốn giảm false pass mà không thưởng việc viết dài, nên chọn những biện pháp nào?',[
    '+Chấm claim với đoạn bằng chứng tương ứng','-Cho mọi câu có URL đạt tiêu chí grounding','+Thêm case citation đúng URL nhưng không hỗ trợ claim','-Dùng độ dài phần giải thích làm trọng số chất lượng chính','+Calibrate kết quả judge với người trên mẫu có nhãn'], 'Một citation có thể tồn tại nhưng không hỗ trợ claim. Rubric cần kiểm quan hệ claim–evidence; hình thức và độ dài không thay kiểm định.');
  M(16,'Reflection memory','Bài học nào đủ cụ thể để giúp lần thử tiếp theo?',[
    '-Lưu toàn trace vào mọi request để giữ đủ chi tiết','+Ghi dấu hiệu nhận biết lỗi và hành động thay thế','+Giữ nguồn để kiểm lại nguyên nhân đã suy ra','-Ưu tiên bài học mới nhất dù chưa xác minh kết quả','+Ghi điều kiện mà bài học được phép áp dụng'], 'Memory hữu ích cần thao tác được, có phạm vi và nguồn. Mới hơn hoặc dài hơn chưa đồng nghĩa bài học đúng.');
  M(16,'LATS và tìm kiếm','Cần quyết định giữ search hay quay về baseline. Những phép so nào hợp lý?',[
    '+So success trên cùng task và cùng tổng token budget','-So một attempt baseline với toàn bộ nhánh search rồi chỉ báo success','+Đo lợi ích của từng độ sâu so với latency tăng','+Kiểm evaluator có phân biệt được nhánh tốt và xấu','-Chọn độ sâu theo số tool hiện có trong hệ'], 'Search phải tạo lợi ích dưới một ngân sách so sánh rõ. Số tool không xác định độ sâu tối ưu; budget lệch làm kết luận sai.');
  M(16,'Process và outcome reward','Lần chạy trả đáp án đúng nhưng gọi tool ngoài scope. Cách đánh giá nào phù hợp?',[
    '+Giữ outcome correctness và policy compliance thành hai chiều','-Cho pass nếu kết quả cuối được người dùng chấp nhận','+Đánh fail bất biến quyền dù outcome đúng','-Dùng điểm outcome bù điểm vi phạm trong cùng tổng trọng số','+Bổ sung gate quyền trước tool execution'], 'Một bất biến quyền không nên được điểm kết quả bù trừ. Cần đánh giá trajectory và chặn ở runtime, không chỉ đổi điểm cuối.');
  M(16,'Voyager và thư viện kỹ năng','Trước khi tái dùng script do agent tạo, cần làm những gì?',[
    '+Test với input hợp lệ và input ngoài phạm vi','+Review các quyền file, network và side effect','-Cấp cùng quyền với lần sinh script để giữ điều kiện chạy','+Version script cùng điều kiện áp dụng','-Dùng success của lần đầu thay kiểm thử tái sử dụng'], 'Một skill chạy được một lần chưa đủ cho các task khác. Quyền phải theo nhu cầu tái dùng, không kế thừa tùy tiện từ lúc sinh.');
  M(16,'Self-evolution an toàn','Những control nào bảo vệ phép đo khi agent tự sửa?',[
    '+Tách grader khỏi vùng agent được ghi','-Cho agent sửa rubric nếu diff làm điểm train tăng','+Kiểm biến thể trên held-out tasks','+Review thay đổi quyền và validator trong diff','-Đánh giá bằng bộ case agent vừa tối ưu rồi phát hành'], 'Sửa grader hoặc tối ưu đúng bộ kiểm làm hỏng tính độc lập. Cần bảo vệ phép đo và xác nhận ngoài dữ liệu đã dùng để sửa.');
  M(16,'Plan–Act–Verify','Dấu hiệu nào chứng minh mục công việc có thể được đánh dấu hoàn tất?',[
    '-Plan đã được chuyển sang trạng thái done bởi actor','+Artifact được tạo đúng yêu cầu và có phép kiểm tương ứng','+External state khớp hành động được yêu cầu','-Tool trả HTTP 200 nhưng chưa kiểm business result','+Các ràng buộc quan trọng đã được đối chiếu'], 'Trạng thái plan và transport success là bằng chứng hẹp. Hoàn tất cần artifact, outcome và constraints cùng đạt.');
  M(16,'Sáu hook middleware','Cần sửa vị trí kiểm quyền tool. Những quyết định nào đúng boundary?',[
    '+Validate tham số trước khi tool tạo side effect','-Đặt authorization ở after_model vì model đã chọn tool','+Dùng wrapper bao quanh execution để chặn và ghi kết quả','-Giữ kiểm quyền trong output formatter để dùng chung các tool','+Test rằng call bị từ chối không chạm hệ đích'], 'Chọn tool và thực thi tool là hai sự kiện khác nhau. Output formatting diễn ra quá muộn để ngăn tác động đã xảy ra.');
  M(16,'Doom loop và ngân sách','Tool trả cùng lỗi không phục hồi qua nhiều lần. Policy nào nên áp dụng?',[
    '+Đếm fingerprint call và lỗi để nhận diện lặp','+Áp deadline tổng xuyên qua các lần thử','-Reset step counter khi model đổi cách diễn đạt lý do','-Xóa observation lỗi để mở thêm cơ hội tìm lời giải','+Dừng hoặc chuyển tuyến khi chạm budget'], 'Đổi lời suy luận không tạo tiến triển. Xóa bằng chứng hoặc reset counter có thể che vòng lặp và phá trần tài nguyên.');
  M(16,'Compaction và eviction','Muốn nén context mà giữ điều kiện cấm sửa file, cần chọn gì?',[
    '+Giữ constraint ở lớp ưu tiên và bền qua nén','-Giữ phần mới nhất theo thời gian để suy ra constraint còn đủ','+Test case phụ thuộc constraint sau compaction','+Giữ tham chiếu để truy lại bằng chứng bị nén','-Lấy độ ngắn summary làm tiêu chí chấp nhận chính'], 'Recency và độ ngắn không kiểm được việc giữ constraint. Cần phép kiểm ngữ nghĩa và đường truy về dữ kiện gốc.');
  M(16,'Orchestrator–worker fit','Những điều kiện nào hỗ trợ tách worker trong tác vụ này?',[
    '+Có phần công việc đầu vào/đầu ra tách được','-Mỗi worker cần toàn bộ quyết định mới nhất từ worker khác','+Chi phí tổng hợp nhỏ hơn lợi ích tách context','-Nhiệm vụ có nhiều bước nên số worker nên bằng số bước','+Có owner kiểm và merge kết quả cuối'], 'Số bước không đồng nghĩa số phần độc lập. Phụ thuộc chặt làm chi phí đồng bộ tăng và có thể hợp một owner hơn.');
  M(16,'Grounding và trích dẫn','Muốn sửa lỗi quy gán sai tác giả, cần những kiểm tra nào?',[
    '+Đối chiếu chủ thể của claim với đoạn nguồn','-Giữ claim nếu domain nguồn có uy tín cao','+Kiểm thời điểm và điều kiện phát biểu','+Sửa hoặc bỏ phần không tìm được hỗ trợ','-Chấm citation theo tỷ lệ URL truy cập được'], 'Uy tín domain và URL sống không giải quyết lỗi attribution. Cần đối chiếu nội dung hỗ trợ đúng chủ thể và điều kiện.');
  M(16,'Đánh giá harness và lab','Để kết luận Reflexion có đáng giữ, cần thiết kế phép so thế nào?',[
    '+Dùng cùng task set và báo tổng budget mỗi hệ','-Dùng best-of-n của bản mới so với first-pass của baseline mà không công bố n','+Báo per-case success, cost và latency','+Đọc failure cases để biết lớp sửa có tác dụng','-Chọn một trace thành công đại diện rồi suy ra hiệu quả toàn bộ'], 'Budget và cách chọn kết quả phải công khai. Trace minh họa không thay phép so trên tập task có cả ca thất bại.');
  M(16,'Capability control và defence in depth','Các lớp nào ngăn được đường đọc secret rồi gửi ra ngoài?',[
    '+Giới hạn quyền đọc secret tại tool boundary','+Kiểm đích network theo allowlist phù hợp task','-Chỉ cho model dùng tài liệu từ domain tin cậy thay vì kiểm action','+Không cho retrieved text nâng thành instruction','-Dựa vào output moderation để thu hồi dữ liệu đã gửi'], 'Nguồn tin cậy vẫn có thể chứa nội dung bị chèn. Dữ liệu đã rời hệ không được output filter hoàn tác; cần chặn quyền và đích trước tác động.');

  M(17,'Stateless và cross-session','Cần làm gì để phiên mới dùng đúng sở thích mà không rò chéo?',[
    '+Lưu preference theo user identity đã xác thực','-Dùng thread ID ngẫu nhiên làm định danh lâu dài của người dùng','+Load dữ liệu còn hiệu lực khi tạo context phiên mới','-Tăng context window của process mới để khôi phục phiên cũ','+Test hai user có preference mâu thuẫn'], 'Process mới không tự có lịch sử. Identity, scope và đường load mới quyết định bộ nhớ qua phiên; thread ID không tự đại diện user.');
  M(17,'Bảy lớp context','Muốn giữ mục tiêu khi tool output lớn, nên làm gì?',[
    '+Giữ policy và mục tiêu ở lớp ưu tiên rõ','-Gộp tool output vào system message để nó khó bị cắt','+Chọn hoặc nén evidence theo task trước model call','+Gắn nguồn và độ tin cậy của dữ liệu bổ sung','-Ưu tiên phần có nhiều token vì có nhiều thông tin hơn'], 'Độ dài không đo relevance. Đưa tool output vào system có thể nâng quyền dữ liệu không tin, thay vì giải bài toán chọn context.');
  M(17,'Token budget và trim','Những lựa chọn nào cần được đo trước khi đổi ngân sách context?',[
    '+Task success ở các mức context khác nhau','+Token và latency theo từng loại task','-Tăng lượng memory theo tỷ lệ tăng của model window mà không chạy eval','+Khả năng giữ constraints và bằng chứng quan trọng','-Dùng số turn giữ lại làm thước đo đầy đủ chất lượng context'], 'Window lớn không nói phần thêm vào hữu ích. Số turn chỉ là proxy; cần đánh giá nội dung và chất lượng task.');
  M(17,'Bốn loại memory','Cách phân loại nào giúp chọn đúng đường lưu/truy xuất?',[
    '+Sở thích qua phiên cần user-scoped long-term facts','+Trace lần debug có diễn biến phù hợp episodic memory','-Chuyển mọi transcript thành procedural memory vì đều là kinh nghiệm','+Tài liệu miền có thể phục vụ semantic retrieval','-Giữ preference chỉ trong buffer vì truy cập nhanh hơn store'], 'Transcript chưa tự thành quy trình tái dùng. Buffer nhanh nhưng không đáp ứng nhu cầu nhớ bền qua phiên.');
  M(17,'Checkpoint và Store','Cần phân biệt những phạm vi nào khi sửa mất dữ liệu giữa các phiên?',[
    '+Checkpoint phục vụ khôi phục tiến trình theo thread','-Dùng cùng thread ID cho mọi user để dùng lại checkpoint','+Store cần namespace và kiểm quyền cho dữ liệu qua thread','-Có checkpoint nên dữ liệu ngoài graph được rollback cùng state','+Test restart và đổi thread như hai trường hợp riêng'], 'Thread state, cross-thread data và side effect ngoài graph có vòng đời khác nhau. Dùng chung thread để nhớ có thể làm rò state.');
  M(17,'Episodic thành procedural','Khi nào một trải nghiệm đủ cơ sở thành skill tái dùng?',[
    '+Nguyên nhân thành công đã được đối chiếu bằng evidence','-Episode mới nhất được ưu tiên thành quy tắc chung','+Skill ghi rõ input, phạm vi và điều kiện thất bại','+Test trên tình huống tương tự chưa dùng để rút skill','-Loại mọi episode thất bại khỏi dữ liệu rút bài học'], 'Một lần thành công có thể do ngẫu nhiên hoặc điều kiện riêng. Episode thất bại có ích để xác định giới hạn skill.');
  M(17,'Semantic memory và retrieval','Nên kiểm gì khi memory đúng chủ đề nhưng trả fact của người khác?',[
    '+Filter identity/quyền trước khi đưa kết quả vào context','-Tăng similarity threshold để thay namespace filtering','+Kiểm metadata và provenance của bản ghi','-Dùng cùng collection rồi nhắc model chỉ đọc dữ liệu đúng user','+Thêm eval retrieval có hai user dùng từ giống nhau'], 'Similarity đo gần nghĩa, không cấp quyền xem dữ liệu. Threshold và prompt không thay scope dữ liệu được cưỡng chế.');
  M(17,'Redis TTL theo phần tử','Dữ liệu mới thêm vào một Set có TTL cũ. Các kết luận nào phù hợp?',[
    '+TTL ở key có thể làm cả Set hết hạn cùng lúc','-Mỗi phần tử mới tự nhận đủ thời hạn tính từ lúc SADD','+Cần data model khác nếu policy cần expiry riêng từng fact','-Đọc SMEMBERS trước mỗi request sẽ tự gia hạn TTL','+Chi phí đọc cả tập phụ thuộc số phần tử'], 'TTL của key không tự thành TTL từng phần tử và lệnh đọc không mặc định gia hạn. Cần chọn model lưu theo policy thực.');
  M(17,'Memory extraction và cập nhật','Muốn xử lý fact mới mâu thuẫn fact cũ, cần những gì?',[
    '+Giữ nguồn, thời gian và identity của fact mới','-Cho fact mới nhất ghi đè mọi dữ kiện cùng từ khóa','+Có policy giải conflict theo loại thông tin','+Đánh dấu hiệu lực để phân biệt hiện trạng và lịch sử','-Dùng số lần model nhắc lại fact làm mức tin cậy'], 'Recency chỉ hữu ích trong policy có nguồn đáng tin và scope đúng. Lặp lại một fact không tạo thêm bằng chứng độc lập.');
  M(17,'Compaction có nguồn','Làm sao nén hội thoại mà không biến suy đoán thành fact?',[
    '+Giữ dấu hiệu chắc/chưa xác minh trong summary','+Dẫn lại nguồn của quyết định quan trọng','-Bỏ mọi từ thể hiện bất định để summary ngắn và dễ đọc','-Dùng summary mới nhất thay toàn bộ bằng chứng gốc','+Test câu hỏi cần chi tiết bị nén và đường retrieve lại'], 'Nén cần giữ trạng thái nhận thức và provenance. Tóm tắt gọn nhưng làm chắc hóa suy đoán sẽ tạo memory sai bền vững.');
  M(17,'Managed memory và benchmark','Muốn chọn managed memory thay bản tự xây, cần phép đo nào?',[
    '+So cùng hội thoại có cập nhật, xóa và recall qua phiên','-Lấy benchmark của nhà cung cấp làm acceptance gate cho dữ liệu mình','+Đo cost, latency và chất lượng theo policy riêng','+Kiểm export/delete và phân quyền thực tế','-Chọn hit rate cao hơn mà không xem fact được retrieve có hữu ích'], 'Benchmark và hit rate không tự chuyển thành task quality. Cần đo trên dữ liệu, quyền và vòng đời memory của dự án.');
  M(17,'Consent và xóa memory','Khi user rút quyền lưu một fact, hệ cần xử lý những gì?',[
    '+Xác định store, index và cache chứa dữ kiện đó','-Chỉ ẩn fact trong UI vì model không thấy giao diện','+Ngăn đường retrieve hoặc tác vụ nền ghi lại fact đã xóa','+Thông báo phạm vi xử lý theo policy lưu trữ','-Giữ mọi bản sao vô thời hạn để dễ debug'], 'Xóa ở giao diện không cắt các đường đọc/ghi dữ liệu. Cần xử lý các bản sao và nguồn tái tạo theo policy được phép.');
  M(17,'Identity files và facts','Muốn tránh fact của task làm đổi persona/policy, cần gì?',[
    '+Tách identity/policy khỏi user facts và evidence','-Cho mọi thông tin đã lưu được ghi vào identity file để tăng độ bền','+Giới hạn ai được sửa instruction bền vững','-Ưu tiên identity theo đoạn text được retrieve gần nhất','+Review thay đổi policy như một thay đổi có quyền'], 'Độ bền không đồng nghĩa authority. Memory dữ liệu không được tự nâng thành instruction định hướng toàn hệ.');
  M(17,'Heartbeat và memory poisoning','Trước một tác vụ tự chạy đọc memory, nên cưỡng chế gì?',[
    '+Kiểm nguồn và quyền của instruction/task bền vững','+Giữ budget và phạm vi action của heartbeat','-Tin memory hơn tool output vì memory đã được lưu trước đó','+Test payload độc sống qua nhiều lượt và phiên','-Chỉ scan prompt ở phiên ghi memory đầu tiên'], 'Nội dung độc có thể tồn tại qua phiên và được kích hoạt sau. Lưu trước không biến dữ liệu thành nguồn có quyền.');
  M(17,'Compiled knowledge base','Muốn dùng KB được tổng hợp tự động, cần giữ điều kiện nào?',[
    '+Mỗi kết luận có provenance về nguồn gốc','-Coi bản compiled là sự thật mới để bỏ kiểm version nguồn','+Có đường cập nhật hoặc invalidate khi nguồn đổi','+Kiểm sample kết luận với dữ liệu gốc','-Dùng độ ngắn bản tổng hợp làm chỉ số quality chính'], 'Compilation giúp truy cập nhưng có thể làm mất ngữ cảnh hoặc lỗi thời. Provenance và lifecycle của nguồn vẫn cần được giữ.');
  M(17,'Memory hot path và background write','Preference vừa đổi nhưng job chưa commit. Những xử lý nào hợp lý?',[
    '+Giữ fact hiện hành trong state phiên khi chờ ghi bền','-Đọc lại store cũ rồi dùng nó ghi đè state phiên','+Gắn version để job nền không ghi ngược dữ liệu mới','+Cho retry ghi có tính idempotent','-Giữ UI báo đã lưu bền dù chỉ mới xếp hàng job'], 'Cần tách đã dùng trong phiên, đã xếp hàng và đã commit. Job retry không được ghi đè version mới hơn.');
  M(17,'Benchmark multi-session memory','Bộ kiểm nào phân biệt được nhớ đúng với dùng fact cũ?',[
    '+Case cùng user đổi fact qua các thời điểm','+Case hai user có facts mâu thuẫn','-Chỉ hỏi lại fact trong cùng process để đo cross-session','+Case yêu cầu xóa rồi mở thread mới','-Chỉ chấm có nhắc được một fact bất kỳ trong câu trả lời'], 'Cross-session phải thử qua ranh giới phiên/process. Nhắc một fact chưa chứng minh fact đúng identity, thời gian và quyền.');

  M(18,'Error tree offline/online','Trước khi đổi model, cần thu thập những bằng chứng nào?',[
    '+Thông tin cần trả lời có trong corpus gốc hay không','+Text parse và chunk có giữ điều kiện quan trọng','-Chỉ số latency của model để suy ra lỗi nằm ở generation','+Các chunk trước và sau rerank của query lỗi','-Số tài liệu tổng để suy ra retrieval đã đủ phủ'], 'Khoanh vùng theo đường evidence đi qua pipeline. Tổng tài liệu và latency không cho biết thông tin bị mất ở tầng nào.');
  M(18,'Hierarchical chunking','Các quyết định nào giữ được quan hệ giữa điều khoản và ngoại lệ?',[
    '+Dùng child chunk để tìm và parent để bổ sung ngữ cảnh','-Gộp mọi section thành một chunk để khỏi mất quan hệ','+Giữ ID liên kết cha–con và nguồn/version','-Tăng overlap như cách thay mọi metadata cấu trúc','+Đo recall ngoại lệ và nhiễu context trên query thực'], 'Parent bổ sung ngữ cảnh có chọn lọc; chunk quá lớn và overlap không kiểm soát có thể làm loãng tìm kiếm và tăng cost.');
  M(18,'Late chunking','Những điều kiện nào cần kiểm trước khi thay chunking hiện tại?',[
    '+Encoder có khả năng tạo biểu diễn có ngữ cảnh ở phạm vi cần dùng','-Chỉ đổi thời điểm chia text sau khi đã lưu embedding độc lập từng chunk','+So mức giữ ngữ cảnh giữa các đoạn trong eval','+Đo chi phí encode tài liệu dài','-Suy rằng context dài hơn sẽ thay được metadata quyền'], 'Late chunking phụ thuộc cách tạo biểu diễn trước pooling/chia đoạn, không chỉ đổi vị trí thao tác text. Quyền vẫn cần metadata/control riêng.');
  M(18,'RAPTOR và cây tóm tắt','Muốn dùng tầng summary mà không mất truy nguồn, cần gì?',[
    '+Giữ liên kết summary với các đoạn con làm bằng chứng','+Dùng nhiều mức chi tiết tùy câu hỏi','-Cho summary thay hoàn toàn raw chunks khi index để tiết kiệm lưu trữ','+Đánh giá lỗi do bước tóm tắt riêng','-Xem claim trong summary là xác minh độc lập với nguồn con'], 'Summary là dữ liệu dẫn xuất và có thể sai. Cần giữ nguồn con và đánh giá thêm sai số tổng hợp.');
  M(18,'Contextual enrichment','Context bổ sung cho chunk nên được kiểm theo tiêu chí nào?',[
    '+Nó giúp hiểu đúng vị trí/chủ thể của chunk','-Nó được tạo từ suy đoán của model nên có thể coi như nguồn mới','+Nguồn và phiên bản nội dung bổ sung được giữ lại','+So retrieval trước/sau enrichment trên cùng query','-Đưa mọi lịch sử user vào mọi chunk để tăng specificity'], 'Enrichment phục vụ ngữ cảnh và retrieval, không tạo sự thật mới. Thêm dữ liệu user tùy tiện còn gây rò quyền và nhiễu.');
  M(18,'Hypothetical Q&A','Khi thêm câu hỏi giả lập cho tài liệu, những control nào cần có?',[
    '+Câu hỏi sinh phải có đáp án được tài liệu hỗ trợ','-Dùng câu hỏi sinh làm nhãn eval độc lập cho cùng tài liệu','+Giữ liên kết về chunk gốc','+Kiểm bias do cách sinh query so với traffic thật','-Bỏ raw text nếu đã có nhiều Q&A phù hợp'], 'Q&A là tín hiệu hỗ trợ tìm, không thay nguồn hoặc chuẩn đánh giá độc lập. Query sinh có thể hẹp hơn nhu cầu thực.');
  M(18,'Matryoshka embeddings','Muốn giảm chiều vector để giảm memory, cần kiểm gì?',[
    '+Model embedding hỗ trợ cách cắt chiều dự kiến','-Cắt cùng số chiều của mọi model rồi coi như cùng phương pháp','+Query và index dùng cùng biểu diễn/normalization','+Đo recall, latency và footprint sau đổi','-So score tuyệt đối trước và sau đổi để kết luận chất lượng'], 'Khả năng giữ thông tin khi cắt chiều phụ thuộc model. Score ở hai không gian không tự là thước đo so chất lượng.');
  M(18,'Hybrid và RRF','Hai retriever dùng các thang score khác nhau. Những cách xử lý nào có cơ sở?',[
    '+RRF gộp theo thứ hạng thay vì cộng score thô','-Cộng cosine và BM25 trực tiếp vì đều là relevance score','+Eval theo nhóm query từ khóa và ngữ nghĩa','+Giữ filter quyền nhất quán giữa hai nhánh','-Chọn retriever theo nhánh có score cực đại lớn hơn'], 'Score khác thang không thể so trực tiếp. RRF tránh một vấn đề hiệu chuẩn nhưng vẫn cần đo relevance và giữ quyền ở các nhánh.');
  M(18,'ColBERT late interaction','Khi cân nhắc late interaction, cần những phép kiểm nào?',[
    '+Task có lợi từ tín hiệu tương tác ở mức token','+Đo index footprint và query latency','-Giữ budget storage của dense single-vector làm giả định mặc định','+So recall/ranking trên cùng dữ liệu và filter','-Đánh giá bằng số token của câu trả lời cuối'], 'Tương tác token có trade-off index và tính toán. Output token count không đo được chất lượng hoặc cost của retriever.');
  M(18,'SPLADE sparse learned','Những nhận định nào giúp chọn đúng phép so với BM25/dense?',[
    '+Đây là sparse representation được học, không chỉ đếm từ gốc','-Sparse nên có thể mặc định dùng đúng pipeline hiệu chuẩn score của BM25','+Cần kiểm tác động term expansion trên query thực','+So cả relevance và chi phí encode/index','-Tăng số term mở rộng được coi trực tiếp là tăng precision'], 'Expansion có thể tăng recall nhưng cũng thêm nhiễu. Sparse learned và BM25 không đồng nhất về biểu diễn hoặc score.');
  M(18,'Weighted fusion và rerouting','Để chọn trọng số hoặc nhánh retrieval, nên làm gì?',[
    '+Hiệu chuẩn score nếu dùng weighted score fusion','-Đặt cùng weight vì hai nhánh đều đóng góp một kết quả','+Chia eval theo loại query và failure mode','+Đo fallback khi router chọn sai','-Dùng tỷ lệ traffic hiện tại thay nhãn relevance để train router'], 'Trọng số cần xét thang score và mục tiêu chất lượng; traffic chỉ nói tần suất, không xác nhận nhánh phù hợp.');
  M(18,'ColPali và retrieval đa phương thức','Khi thông tin nằm trong sơ đồ/bảng ảnh, cần kiểm gì?',[
    '+Text extraction có làm mất tín hiệu thị giác cần thiết','+Retriever và model generation có nhận đúng loại evidence','-Chỉ tăng số chunk text để thay phần ảnh không được biểu diễn','+Giữ page/source và quyền của ảnh được retrieve','-Cho ảnh có resolution cao nhất đứng đầu thay relevance'], 'Nếu pipeline không biểu diễn nội dung ảnh thì tăng text top-k không lấy lại tín hiệu đã mất. Resolution không đo relevance.');
  M(18,'Chọn vector database','Muốn chọn database cho production workload, tiêu chí nào đáng đưa vào spike?',[
    '+Recall/latency dưới filter và tải đại diện','+Khả năng update/delete và vận hành theo SLO','-Chọn theo benchmark không filter rồi suy ra tenant isolation tương đương','+Backup, recovery và tổng chi phí theo quy mô','-Lấy số vector tối đa quảng cáo làm chỉ số quyết định duy nhất'], 'Cần đo đúng workload có filter và vòng đời dữ liệu. Capacity danh nghĩa không thay latency, isolation hoặc recovery thực tế.');
  M(18,'Retrieve rộng rồi rerank','Nếu evidence đúng có trong candidates nhưng bị loại ở top cuối, nên kiểm gì?',[
    '+Đọc ranking trước và sau reranker','-Đổi parser ngay vì answer thiếu thông tin','+Đánh giá reranker theo query có ngoại lệ này','+Kiểm truncation và budget context sau rerank','-Tăng corpus size để sửa thứ tự của candidates hiện có'], 'Dữ kiện đã vào candidates thì cần soi ranking/context assembly trước. Thay parser hoặc thêm corpus chưa nhắm đúng lỗi quan sát được.');
  M(18,'Query transform theo vấn đề','Khi sửa query, những tiêu chí nào ngăn đổi lệch yêu cầu?',[
    '+Giữ entity, ràng buộc thời gian và điều kiện gốc','+So query gốc với bản rewrite trên cùng nhãn','-Dùng câu trả lời dự đoán làm bằng chứng chuẩn cho rewrite','+Giữ fallback khi transform làm retrieval tệ hơn','-Chọn rewrite có nhiều thuật ngữ chuyên môn hơn'], 'Rewrite cần phục vụ intent, không chỉ làm câu có vẻ chuyên môn. Đáp án giả định không là ground truth.');
  M(18,'Corrective RAG và augmentation','Khi evidence yếu, nhánh sửa lỗi nên vận hành ra sao?',[
    '+Đánh giá đủ nguồn trước khi quyết định retrieve thêm','-Gọi web search cho mọi query để đồng nhất pipeline','+Giới hạn số vòng sửa và chi phí bổ sung','+Cho phép abstain khi vẫn thiếu bằng chứng','-Cho answer đã sinh quay lại làm nguồn độc lập trong vòng sau'], 'Nhánh sửa cần trigger, budget và đường dừng. Tái dùng answer làm nguồn có thể củng cố một suy đoán chưa xác minh.');
  M(18,'RAGAS và điểm mù embedding','Để phát hiện nhầm phủ định và số liệu, cần những kiểm tra nào?',[
    '+Thêm cặp gần nghĩa nhưng khác phủ định','+Đối chiếu số, đơn vị và chủ thể bằng kiểm tra phù hợp','-Lấy similarity cao làm bằng chứng entailment đủ mạnh','+Review per-case metric inputs và reference','-Dùng trung bình embedding score để bỏ các case khó'], 'Gần nghĩa không đồng nghĩa hỗ trợ đúng claim. Phủ định, số và attribution cần được kiểm riêng thay vì bị điểm trung bình che đi.');
  M(18,'CDC upsert và delete','Để policy cũ không xuất hiện sau sửa/xóa, cần làm gì?',[
    '+Truyền tombstone/delete tới index và bản sao liên quan','-Chỉ upsert tài liệu mới rồi giữ bản cũ cho retrieval tự chọn','+Dùng ID/version để xử lý sự kiện đến lặp hoặc lệch thứ tự','+Invalidate cache theo version/phạm vi cần thiết','-Dùng ngày ingest mới nhất để suy ra mọi record còn hiệu lực'], 'Đồng bộ cần xử lý xóa và thứ tự thay đổi; dữ liệu được ingest gần đây vẫn có thể chứa một record đã hết hiệu lực.');
  M(18,'Blue-green index và alias','Trước khi chuyển traffic sang index mới, cần xác nhận gì?',[
    '+Backfill và cập nhật phát sinh đã được đồng bộ','+Eval cả chất lượng lẫn quyền/filter','+Có alias cutover và đường rollback được kiểm','-Xóa index cũ ngay sau khi job build trả thành công','-Dùng số record bằng nhau làm bằng chứng nội dung tương đương'], 'Build thành công và record count không đủ kiểm tương đương. Giữ rollback tới khi các gate sau cutover đủ bằng chứng.');
  M(18,'Production SLO và drift','Khi điểm tổng ổn nhưng nhóm query mới lỗi nhiều, nên làm gì?',[
    '+Tách metric theo cohort/query type','-Giữ ngưỡng aggregate vì toàn hệ chưa vượt SLO','+Phân biệt data drift với evaluator/version drift','+Theo dõi latency, cost và chất lượng cùng nhau','-Retrain model trước khi kiểm thay đổi corpus và query'], 'Điểm tổng có thể che lỗi cục bộ. Cần phân tầng và xác định lớp thay đổi trước khi chọn retraining.');
  M(18,'Ablation và lab RAG có kiểm soát','Điểm tăng sau ba thay đổi cùng lúc. Kết luận và bước tiếp nào phù hợp?',[
    '+Chỉ kết luận về cấu hình kết hợp trong phép chạy hiện có','-Quy toàn bộ cải thiện cho thành phần có chi phí lớn nhất','+Chạy ablation để tách đóng góp từng thay đổi','+Giữ eval set và điều kiện đo nhất quán','-Dùng thứ tự commit để suy ra tác động nhân quả'], 'Ablation tách tác động; chi phí hay thứ tự commit không xác định nguyên nhân cải thiện.');

  M(19,'Flat RAG và quan hệ nhiều bước','Những dấu hiệu nào cho thấy graph có thể giải đúng bottleneck?',[
    '+Câu hỏi cần nối các entity qua quan hệ có hướng','-Answer dài nên cần graph để tăng context window','+Evidence nằm ở nhiều tài liệu với quan hệ định danh rõ','+Có thể gán nhãn đường quan hệ cần tìm để eval','-Flat RAG trả sai một lần là đủ kết luận phải đổi kiến trúc'], 'Graph cần một nhu cầu nối quan hệ và phép đo phù hợp. Độ dài answer hoặc một case lỗi chưa xác định kiến trúc cần dùng.');
  M(19,'Node edge triple và hướng','Khi answer đảo chủ thể và đối tượng, cần kiểm gì?',[
    '+Chiều cạnh và vai trò trong triple đã trích','+Textualization có giữ đúng chiều quan hệ','-Tăng số hop để bù việc node xuất hiện sai vai','+Đối chiếu triple với đoạn nguồn gốc','-Gộp hai cạnh ngược chiều vì cùng một cặp entity'], 'Thêm hop không sửa nghĩa của cạnh bị đảo. Hai chiều của quan hệ không tương đương nếu schema/ngữ nghĩa không cho phép.');
  M(19,'Property graph và RDF','Để chọn mô hình lưu graph, nên dựa trên những yếu tố nào?',[
    '+Cách biểu diễn thuộc tính, quan hệ và truy vấn cần dùng','+Yêu cầu interoperability hoặc ontology của dự án','-Chọn RDF chỉ vì task cần nhiều hop hơn một','+Khả năng vận hành/query tooling phù hợp đội','-Dùng cùng query text cho Cypher và SPARQL vì cùng là graph'], 'Số hop không quyết định mô hình graph. Query language và semantics của property graph/RDF cần được xét đúng contract.');
  M(19,'Ontology và governance','Khi nhóm trích xuất dùng hai định nghĩa khác nhau cho cùng relation, nên làm gì?',[
    '+Chốt schema cùng định nghĩa và ví dụ biên','-Giữ cả hai nghĩa trong cùng predicate để tăng recall','+Version ontology và migration của dữ liệu cũ','+Gán owner cho thay đổi schema','-Để LLM lúc query tự đoán lại nghĩa relation'], 'Một tên relation có hai nghĩa làm đường suy luận không rõ. Cần governance từ dữ liệu đến query thay vì đẩy mâu thuẫn cho model.');
  M(19,'Lexical và semantic graph','Những quyết định nào giữ được cả tín hiệu văn bản lẫn quan hệ miền?',[
    '+Giữ liên kết chunk/source tới entity và relation','-Dùng cạnh cùng xuất hiện thay mọi quan hệ nghiệp vụ','+Phân biệt graph từ cấu trúc văn bản với graph khái niệm','+Eval theo loại câu hỏi cần từng tầng','-Coi mọi cạnh tự trích đều có cùng độ tin cậy'], 'Cùng xuất hiện không xác nhận quan hệ nghiệp vụ. Các lớp graph cần provenance, semantics và mức tin cậy phù hợp.');
  M(19,'Extraction resolution linking','Nếu hai người trùng tên bị gộp thành một node, nên kiểm và sửa gì?',[
    '+Dùng thuộc tính định danh và ngữ cảnh ngoài tên','-Tăng embedding threshold rồi gộp theo tên như cũ','+Tách extraction khỏi entity resolution để chẩn đoán','+Giữ mapping/provenance khi split node đã gộp sai','-Đánh giá chỉ bằng số triple tạo được'], 'Triple count không đo độ đúng entity. Gộp/split cần bằng chứng định danh và xử lý lại các cạnh phụ thuộc.');
  M(19,'Provenance và cập nhật graph','Một relation hết hiệu lực theo thời gian. Những xử lý nào đúng?',[
    '+Lưu thời gian hiệu lực và nguồn hỗ trợ relation','-Xóa nguồn trích nhưng giữ cạnh để giảm footprint','+Invalidate hoặc version cạnh theo policy cập nhật','+Kiểm các kết luận dẫn xuất phụ thuộc cạnh cũ','-Chỉ sửa label node vì query thường đi qua tên node'], 'Quan hệ có vòng đời và ảnh hưởng downstream. Đổi tên node không xử lý validity hoặc bằng chứng của cạnh.');
  M(19,'Chọn seed và disambiguation','Khi tên công ty có nhiều nghĩa, những bước nào nên có trước traversal?',[
    '+Dùng ngữ cảnh query để chọn đúng entity','-Chọn node có degree lớn nhất để tăng cơ hội tìm được answer','+Clarify nếu chưa đủ evidence phân biệt','+Kiểm ID và nguồn của seed được chọn','-Tăng top-k traversal để thay bước disambiguation'], 'Duyệt rộng từ seed sai có thể tạo câu trả lời nhất quán cho thực thể khác. Degree lớn không chứng minh khớp intent.');
  M(19,'Traversal có giới hạn','Muốn tránh context phình mà vẫn trả lời được multi-hop, nên chọn gì?',[
    '+Giới hạn loại cạnh và số hop theo câu hỏi','+Theo dõi fan-out và budget truy vấn','-Duyệt tất cả cạnh trước rồi mới áp filter quyền','+Dừng nhánh không còn hỗ trợ intent','-Dùng nhiều node retrieve được làm proxy task success'], 'Budget và pruning cần bám intent; quyền không được chờ tới sau khi dữ liệu đã được đưa vào context. Số node không đo bằng chứng đúng.');
  M(19,'Textualization giữ bằng chứng','Khi chuyển subgraph thành context, điều gì cần được giữ?',[
    '+Hướng và loại quan hệ giữa các entity','+Nguồn và thời gian của đường hỗ trợ claim','+Dấu hiệu quan hệ đang suy luận hoặc chưa xác minh','-Chỉ danh sách tên node để model tự khôi phục cạnh','-Gộp hai đường mâu thuẫn thành một câu chắc chắn'], 'Tên node không đủ tái lập quan hệ. Textualization phải giữ semantics và uncertainty thay vì tạo chắc chắn giả.');
  M(19,'Hybrid graph và vector','Những cách phối hợp nào nên được thử và đo riêng?',[
    '+Vector tìm chunk/seed rồi graph mở rộng quan hệ','+Graph trả evidence quan hệ, vector bổ sung đoạn mô tả','-Lấy union mọi kết quả rồi mặc định relevance tăng','+So case cần quan hệ với case lookup đơn giản','-Cộng score graph và vector trực tiếp vì đều đánh giá relevance'], 'Phối hợp cần kiểm budget, nhiễu và thang score. Union rộng hơn không bảo đảm context tốt hơn.');
  M(19,'ROI và kiểm định GraphRAG','Để quyết định giữ graph, cần đưa những khoản nào vào phép so?',[
    '+Chi phí extraction, resolution và cập nhật graph','+Task success theo nhóm câu hỏi nhiều bước','+Query latency cùng chi phí vận hành','-Chỉ số query cost sau khi bỏ chi phí indexing khỏi báo cáo','-Lấy graph size tăng làm bằng chứng recall tăng'], 'Indexing và maintenance là một phần TCO. Graph lớn hơn có thể thêm nhiễu; cần nhãn và task outcomes.');

  M(20,'Khi nào cần nhiều agent','Những đặc điểm nào ủng hộ multi-agent thay cho thêm tool vào một agent?',[
    '+Các phần việc có thể nhận brief và context tách biệt','-Task có nhiều bước nhưng mỗi bước phụ thuộc toàn bộ kết quả ngay trước','+Có lợi ích đo được từ chuyên biệt hóa hoặc chạy độc lập','+Có contract để tổng hợp kết quả và xử lý thiếu','-Model trả lời sai nên cần thêm một bản sao cùng cấu hình bỏ phiếu'], 'Phân rã và lợi ích phải có cơ sở. Nhiều bước hoặc nhiều bản sao cùng lỗi không tự tạo giá trị phối hợp.');
  M(20,'Topology và workflow trước','Trước khi chọn framework/topology, cần xác định gì?',[
    '+Dependency và điểm join của các phần việc','+Owner của artifact cuối và state chung','-Số role trong prompt để suy ra số agent tối ưu','+Điều kiện routing, dừng và partial failure','-Topology phổ biến nhất trong benchmark không cùng task'], 'Dependency và failure policy đi trước hình dạng hệ. Role count và benchmark khác task không quyết định topology phù hợp.');
  M(20,'Routing theo độ khó','Router nên được kiểm theo tiêu chí nào?',[
    '+Phân loại task gắn với quality/cost của nhánh','-Dùng độ dài prompt làm nhãn khó duy nhất','+Đo lỗi route và đường fallback','+So cùng workload với một tuyến baseline','-Tối ưu số request vào model rẻ mà không đo success'], 'Độ dài có thể là feature nhưng không là độ khó đầy đủ. Tiết kiệm chỉ có ý nghĩa khi giữ mức chất lượng cần thiết.');
  M(20,'Supervisor và handoff','Worker báo thiếu dữ kiện. Supervisor nên làm gì?',[
    '+Đọc status và evidence trong output contract','-Cho Writer tổng hợp như thể worker đã hoàn tất để giữ deadline','+Route tìm dữ kiện hoặc báo partial result theo policy','+Giới hạn số vòng bàn giao lại','-Giao cùng task sang worker khác mà bỏ nguyên nhân thiếu dữ liệu'], 'Handoff cần giữ nguyên nhân và trạng thái. Đổi worker không tự tạo dữ liệu, còn che partial result làm sai outcome.');
  M(20,'Async pools và deadline','Khi nhiều worker cùng gọi provider, cần cưỡng chế gì?',[
    '+Concurrency cap theo quota và tài nguyên','+Deadline tổng cùng timeout phù hợp từng worker','+Policy thu hồi hoặc xử lý tác vụ còn chạy','-Tăng task pool khi 429 để rút ngắn hàng đợi','-Cho mỗi worker tự retry với budget độc lập không có trần tổng'], 'Tăng concurrency khi bị quota có thể làm quá tải nặng hơn. Budget retry cần xét toàn task, không chỉ từng worker.');
  M(20,'Shared state và một người ghi','Để tránh hai worker ghi đè báo cáo, nên chọn gì?',[
    '+Gán một owner merge artifact cuối','+Cho worker trả phần riêng theo schema','-Cho worker dùng cùng path nhưng nhắc nhau qua prompt trước khi ghi','+Dùng version/lock hoặc cơ chế merge rõ khi cần','-Coi thứ tự hoàn tất request là thứ tự ưu tiên nội dung'], 'Prompt phối hợp không thay ownership hay kiểm soát concurrency. Worker xong muộn không mặc định có bản cập nhật đúng hơn.');
  M(20,'MAST và error compounding','Muốn biết lỗi lan từ bước nào, cần phép phân tích nào?',[
    '+Đọc per-stage trace và contract handoff','-Chỉ đo đáp án cuối để gán lỗi cho Writer','+Tách lỗi specification, coordination và verification','+Giữ case mà worker đúng nhưng tổng hợp sai','-Giả định worker accuracy cao thì pipeline accuracy xấp xỉ tương tự'], 'Lỗi có thể phát sinh và khuếch đại ở chỗ nối. Chất lượng từng worker không xác nhận chất lượng toàn chuỗi.');
  M(20,'Model và harness','Muốn quy cải thiện cho harness thay vì model, cần giữ gì?',[
    '+Cùng model/version và tập task so sánh','+Báo budget, tools và stopping rules từng cấu hình','-Thay cả model và harness rồi gán lợi ích cho middleware','+Phân tích failures trước/sau sửa','-Lấy tên model giống nhau làm đủ điều kiện nếu quota/budget đã đổi'], 'Tên model không đủ nếu điều kiện khác. Cần tách biến và công bố cấu hình để suy luận có cơ sở.');
  M(20,'Agent–computer interface','Muốn giảm lỗi thao tác tool/UI, nên ưu tiên gì?',[
    '+Observation mô tả được state cần quyết định','+Action schema có lỗi và trạng thái rõ','-Tăng quyền tool để bù observation thiếu dữ liệu','+Kiểm feedback sau thao tác trước bước tiếp','-Cho actor dùng kế hoạch cũ khi state UI đã đổi'], 'Interface tốt cần feedback đúng state. Quyền rộng và kế hoạch cũ không sửa thông tin quan sát bị thiếu hoặc đã stale.');
  M(20,'Plugin harness và cấu hình','Để plugin không làm thay đổi hành vi ngoài ý muốn, cần gì?',[
    '+Khai báo capability và điểm gắn vào lifecycle','+Version cấu hình cùng plugin và run','-Cho plugin kế thừa quyền rộng nhất của host','+Test interaction giữa các middleware quan trọng','-Chỉ test plugin riêng rồi suy ra tổ hợp cũng đúng'], 'Quyền phải theo nhu cầu và tổ hợp middleware có thể đổi thứ tự/semantics. Test riêng không bao phủ tương tác.');
  M(20,'Event log và tool lifecycle','Log nào đủ giúp tái dựng một lần gọi tool bị lỗi?',[
    '+ID liên kết proposal, validation, execution và result','+Thời gian, status và version cấu hình','+Thông tin lỗi đã xử lý dữ liệu nhạy cảm','-Chỉ lời giải thích của actor sau khi task kết thúc','-HTTP status thay cho business result của tool'], 'Cần liên kết sự kiện thật của lifecycle. Lời actor hoặc mã transport đơn lẻ không tái dựng được hành động và kết quả.');
  M(20,'Permissions và sandbox','Những phân biệt nào cần giữ trong thiết kế quyền?',[
    '+Permissions quyết định hành động/dữ liệu được phép','+Sandbox hạn chế tác động của code khi chạy','-Sandbox mặc định cấp quyền dùng mọi file bên trong nó','+Kiểm cả quyền host, tool và môi trường thực thi','-Cho phép action trái policy nếu nó chạy trong container'], 'Môi trường giới hạn không hợp thức hóa hành động. Container/sandbox và authorization giải các lớp khác nhau.');
  M(20,'Brief như context firewall','Worker brief cần chứa hoặc giới hạn những gì?',[
    '+Mục tiêu, inputs cần thiết và output contract','+Phạm vi quyền và điều kiện dừng','-Toàn bộ transcript cùng secrets của supervisor để tránh thiếu context','+Những giả định/uncertainty ảnh hưởng kết luận','-Nội dung retrieved được chuyển thành instruction cho worker'], 'Brief chọn context theo nhiệm vụ và độ tin cậy. Chia context không được đồng nghĩa truyền mọi secret hay nâng authority dữ liệu.');
  M(20,'Progressive skills và cache budget','Muốn giảm context mà giữ khả năng làm việc, nên chọn gì?',[
    '+Nạp skill khi task thực sự cần','+Giữ index/mô tả đủ để tìm skill phù hợp','-Nạp tất cả skill vào system để cache được nhiều token nhất','+Đo cache hit cùng cost và quality','-Dùng tỷ lệ cache hit thay cho tổng chi phí request'], 'Cache hit cao có thể đi cùng prompt quá lớn. Cần đo chi phí tổng và khả năng tìm/nạp skill đúng lúc.');
  M(20,'Long-horizon drift','Khi task dài bắt đầu lệch mục tiêu, cần giữ cơ chế nào?',[
    '+Plan và constraints bền qua compaction','+Checkpoint tiến độ với artifact đã verify','-Coi summary mới nhất là đủ dù không giữ mục tiêu ban đầu','+Định kỳ đối chiếu hành động với yêu cầu gốc','-Tăng window rồi bỏ bước kiểm tiến độ'], 'Window lớn không ngăn drift. Cần bảo toàn mục tiêu và đo tiến triển bằng artifact thay lời kể của agent.');
  M(20,'Playbook evolution và reward hacking','Những control nào bảo vệ vòng tự cải tiến?',[
    '+Playbook mới được test trên task giữ riêng','+Grader và bất biến quyền nằm ngoài vùng tự sửa','-Cho agent đổi tiêu chí pass nếu giữ được điểm tổng','+Review cả diff và trajectory của biến thể','-Coi train reward tăng là bằng chứng đủ cho rollout'], 'Tự cải tiến phải giữ phép đo độc lập; nếu agent đổi gate thì điểm tăng có thể chỉ là reward hacking.');
  M(20,'Evaluation và lethal trifecta','Nếu agent vừa đọc dữ liệu riêng vừa gặp nguồn không tin và có đường gửi ra ngoài, cần gì?',[
    '+Chặn đọc/gửi ngoài scope ở runtime','+Theo dõi đường dữ liệu qua từng agent/tool','-Tách các capability sang ba agent rồi coi risk đã bị loại','+Giữ authority của nguồn không tin ở mức dữ liệu','-Chỉ kiểm output cuối của agent tổng hợp'], 'Capability có thể kết hợp xuyên agent. Phân tán không loại đường rò dữ liệu; kiểm output cuối có thể đã quá muộn.');
  M(20,'Debate và lỗi tương quan','Ba critic cùng đồng ý claim sai từ một nguồn. Cần xử lý thế nào?',[
    '+Kiểm nguồn độc lập thay vì đếm phiếu','-Tăng số critic cùng context để giảm sai số theo đa số','+Đo lỗi tương quan và chất lượng judge','+Cho phép giữ bất định nếu không có evidence mới','-Chỉ đổi tên role để coi các nhận xét là độc lập'], 'Các ý kiến cùng nguồn không là bằng chứng độc lập. Cần đa dạng evidence và kiểm judge, không chỉ thêm bản sao.');
  M(20,'Chọn framework theo yêu cầu phối hợp','Trước khi chọn framework từ bảng so sánh, nên kiểm gì?',[
    '+Yêu cầu state, resume và tool execution của dự án','+Khả năng triển khai/debug ở version định dùng','-Nhóm được ghi production trong slide được coi đã đáp ứng security','+Làm spike luồng recovery và quyền quan trọng','-Chọn theo số integration được quảng cáo thay nhu cầu thật'], 'Nhãn tổng quát không là acceptance test. Framework cần được kiểm ở version và môi trường thực tế.');
  M(20,'Đọc trace và peer review multi-agent','Những bằng chứng nào xác nhận đã sửa lỗi thứ tự Researcher–Writer?',[
    '+Trace cho thấy join đúng dependency bắt buộc','+Writer báo partial nếu dữ liệu cần thiết thiếu','+Claim cuối được nguồn hỗ trợ','-Ảnh trace có đủ tên cả ba worker','-Tổng token giảm dù Writer vẫn chạy với dữ liệu cũ'], 'Đủ tên worker và tiết kiệm token không kiểm đúng thứ tự hay evidence. Phải kiểm contract join và nội dung output.');

  M(21,'Baseline và ROI fine-tuning','Trước khi phê duyệt chi phí tune, cần bằng chứng nào?',[
    '+Lỗi còn lại sau baseline prompt/RAG phù hợp','+Tập task và gate chất lượng theo use case','-Provider bill cao đủ suy ra tune sẽ giảm TCO','+Dự toán data, train, serving và vận hành','-Dùng một demo sau tune thay phép so held-out'], 'Tune có chi phí toàn vòng đời. Hóa đơn API hay demo riêng lẻ không xác định cải thiện ròng so baseline.');
  M(21,'Vòng đời model và di sản base','Khi chọn base model cho một adapter mới, cần kiểm gì?',[
    '+Tokenizer/chat template và khả năng hỗ trợ task','+License và các ràng buộc dùng dữ liệu/model','-So active parameters của MoE như toàn bộ memory phải lưu','+Đặc tính và hạn chế kế thừa từ base','-Adapter có thể được coi độc lập với version weights gốc'], 'Adapter phụ thuộc base và tokenizer cụ thể. Active parameters không đồng nghĩa tổng weights cần lưu/tải.');
  M(21,'Mid-training và domain adaptation','Muốn model hiểu phân bố thuật ngữ miền, những quyết định nào cần tách?',[
    '+Nhu cầu học phân bố miền với nhu cầu học format trả lời','+Nguồn dữ liệu, license và chất lượng corpus','-Có corpus ngành nên bỏ baseline retrieval trên tri thức cập nhật','+Eval domain gain cùng khả năng tổng quát','-Dùng corpus lặp nhiều lần làm bằng chứng adaptation thành công'], 'Đọc corpus ngành và làm task tốt là hai bằng chứng khác nhau. Adaptation không thay đường cấp dữ liệu mới theo nhu cầu.');
  M(21,'CPT SFT và distillation','Cần chọn phương pháp theo loại tín hiệu nào?',[
    '+CPT dùng dữ liệu để tiếp tục học phân bố miền','+SFT cần các mẫu input–output phù hợp hành vi đích','+Distillation cần kiểm chất lượng và quyền dùng tín hiệu teacher','-Đổi tên bộ text thô thành instruction dataset là đủ cho SFT','-Teacher mạnh cho phép bỏ review dữ liệu sinh'], 'Tên dataset không thay cấu trúc/mục tiêu học. Tín hiệu từ teacher vẫn cần kiểm và có thể khuếch đại lỗi.');
  M(21,'On-policy và exposure mismatch','Muốn giảm lệch giữa dữ liệu train và tình huống model gặp lúc chạy, nên làm gì?',[
    '+So các trạng thái trong dữ liệu với trajectory model thực tạo','-Chỉ thêm câu trả lời teacher sạch vào đúng prefix teacher đã dùng','+Thu case model tự lệch rồi gán phản hồi phù hợp','+Đánh giá rollout trên task giữ riêng','-Lấy token loss trên prefix chuẩn làm bằng chứng rollout đã tốt'], 'Loss trên trạng thái chuẩn có thể che lỗi khi model đi vào trạng thái khác. Cần dữ liệu/eval bám phân bố lúc sử dụng.');
  M(21,'Optimizer và claim thực nghiệm','Một optimizer mới được báo tốt hơn. Để áp dụng, cần phép so nào?',[
    '+Cùng dataset, schedule và budget được công bố','+Kiểm độ ổn định qua các lần chạy phù hợp','-So điểm tốt nhất của bản mới với một run mặc định của baseline','+Đo memory, throughput và task quality','-Dùng tên optimizer mới hơn làm lý do bỏ baseline'], 'Cấu hình và cách chọn run ảnh hưởng kết luận. Một claim thực nghiệm không tự tổng quát sang workload khác.');
  M(21,'MoE attention và diffusion','Khi đọc các claim kiến trúc, cần phân biệt gì?',[
    '+Active parameters với tổng weights được lưu','+Kiến trúc attention với bài toán/objective huấn luyện','-Ít active parameters suy ra serving memory giảm cùng tỷ lệ','+Số liệu chất lượng cần gắn benchmark và điều kiện','-Một kiến trúc mới suy ra adapter hiện tại tương thích'], 'Compute, storage, objective và khả năng tương thích là các trục khác nhau. Không suy memory hay API từ một con số parameter.');
  M(21,'Bộ nhớ full fine-tuning','Muốn dự toán GPU memory, cần cộng và kiểm những gì?',[
    '+Weights theo precision thực tế','+Gradients và optimizer states theo cấu hình','+Activations theo batch và sequence length','+Workspace/overhead cùng chiến lược sharding','-Nhân số parameter với bytes weights là đủ cho training'], 'Dự toán training gồm nhiều thành phần hơn weights. Công thức theo bytes/parameter cần ghi rõ precision/optimizer và chưa thay peak memory đo thực.');
  M(21,'Activations và checkpointing','Khi OOM tăng theo sequence length, nên kiểm điều gì?',[
    '+Peak activations và batch/length thực của run','-Giảm kích thước checkpoint file để giảm activations','+Gradient checkpointing có thể đổi memory lấy recompute','+Đo throughput sau khi bật checkpointing','-Chỉ giảm rank LoRA để suy ra OOM sẽ hết'], 'Checkpoint file và activation checkpointing là hai việc khác nhau. Activation memory có thể chi phối dù adapter nhỏ.');
  M(21,'ZeRO FSDP và offload','Để chọn chiến lược phân tán/offload, cần kiểm gì?',[
    '+Thành phần memory nào được shard hoặc chuyển ra ngoài GPU','+Bandwidth, communication và chi phí đồng bộ','-Tăng số GPU suy ra mỗi GPU nhận ít mọi thành phần cùng tỷ lệ','+Throughput và khả năng recovery ở cấu hình thực','-Dùng tổng VRAM cộng lại làm bằng chứng model chắc load/train được'], 'Cách phân phối phụ thuộc stage và implementation. Tổng VRAM không mô tả peak allocation, communication hay phần chưa shard.');
  M(21,'Bản đồ PEFT','Để chọn phương pháp parameter-efficient, cần phân biệt gì?',[
    '+Thành phần nào trainable và nơi tham số được thêm','+Ảnh hưởng đến inference/merge và deployment','-Mọi PEFT đều thêm cùng kiểu low-rank matrices','+Khả năng biểu đạt cần cho task và dữ liệu','-Tỷ lệ trainable nhỏ hơn được coi trực tiếp là quality tốt hơn'], 'PEFT là một họ phương pháp, không đồng nghĩa LoRA. Ít trainable parameters là đánh đổi cần eval.');
  M(21,'Cơ chế và tham số LoRA','Với giả định đã cho, những kết luận nào đúng?',[
    '+Hai ma trận adapter có tổng 24.576 tham số','+Ma trận gốc có 2.097.152 tham số','+Base frozen vẫn tham gia tính toán để truyền gradient tới adapter','-Adapter có 16.384 tham số vì chỉ tính chiều output','+Nếu chỉ train adapter thì optimizer states của base có thể không cần như full tuning'], 'LoRA dùng r×d_in + d_out×r. Frozen nói weights không được cập nhật, không nói phần tính toán qua base bị loại.', 'Một linear layer có d_in=1.024, d_out=2.048; LoRA rank r=8, không tính bias. Base weights đóng băng, chỉ train hai ma trận adapter.');
  M(21,'Target modules và capacity','Khi chất lượng chưa cải thiện, nên kiểm gì trước tăng rank toàn bộ?',[
    '+Adapter thực sự được gắn vào modules dự kiến','+Các tham số cần train có nhận gradient','-Tăng rank ở mọi layer trước khi kiểm loss masking','+So capacity với dữ liệu và failure mode','-Số trainable parameter tăng đủ chứng minh task đã học tốt hơn'], 'Rank chỉ là một biến. Gắn sai module, gradient hoặc labels sai không được sửa bằng tăng capacity tùy tiện.');
  M(21,'Learning rate batch và rank','Khi loss dao động sau đổi batch, cần cách thử nào?',[
    '+Ghi effective batch, accumulation và learning rate','+Thay biến có kiểm soát và theo dõi held-out quality','-Giữ mọi hyperparameter vì batch chỉ đổi tốc độ train','+Xét chiều dài mẫu và số token thực mỗi update','-Dùng rank cao hơn làm cách sửa mặc định mọi instability'], 'Batch/token mỗi update ảnh hưởng động học tối ưu. Rank không phải thuốc chung cho learning rate hoặc dữ liệu có vấn đề.');
  M(21,'Các biến thể adapter','Muốn dùng một biến thể thay LoRA chuẩn, nên kiểm gì?',[
    '+Cơ chế initialization/update mà biến thể thay đổi','+Tương thích với quantization và runtime định dùng','-Tên có chứa LoRA đủ để dùng cùng merge pipeline','+Task eval và resource budget cùng baseline','-So benchmark ở model khác rồi coi hyperparameters giữ nguyên'], 'Các biến thể có giả định và đường export khác nhau. Cần kiểm công thức, runtime và hiệu quả trên task đích.');
  M(21,'QLoRA và lượng tử hóa','Những dự toán nào cần giữ tách biệt?',[
    '+Memory lưu base quantized khi train','+Memory activations và adapter/optimizer states','-Base 4-bit đồng nghĩa toàn training memory bằng 1/4 cấu hình 16-bit','+Chất lượng và latency sau export trên runtime đích','-Training load được chứng minh serving throughput đạt yêu cầu'], 'Chỉ một phần memory được giảm theo bits của base. Train feasibility và serving performance là hai phép kiểm khác nhau.');
  M(21,'Kernel logits và loss memory','Nếu peak memory ở logits/loss, nên đo những gì?',[
    '+Kích thước tensor theo batch, length và vocabulary','+Hiệu quả kernel/loss implementation trên cùng outputs','-Giảm số parameter adapter rồi suy ra logits sẽ nhỏ đi','+Sai số numerical và throughput sau thay kernel','-So mỗi GPU utilization để kết luận đã hết bottleneck'], 'Logits phụ thuộc đầu ra/vocabulary, không chỉ adapter. Kernel tối ưu cần giữ semantics/numerics và được đo bằng peak memory.');
  M(21,'Tooling và experiment tracking','Artifact nào giúp tái hiện một kết quả tune?',[
    '+Base/tokenizer version và training config','+Dataset version, split và preprocessing','+Checkpoint/adapter gắn đúng run','+Per-case eval và generation config','-Chỉ loss curve cùng tên framework'], 'Loss curve không xác định dữ liệu, weights hoặc inference config. Cần truy được cả input train và phép kiểm outputs.');
  M(21,'Loss masking và labels','Khi model học lặp prompt, nên kiểm các giả thuyết nào?',[
    '+Prompt tokens đang được tính loss ngoài chủ đích','+Role markers hoặc labels sai ranh giới','-Learning rate thấp là nguyên nhân đủ kết luận từ triệu chứng này','+Một batch thật sau tokenization và masking','-JSON hợp lệ đủ chứng minh labels đúng'], 'Cần soi batch/token labels trước kết luận optimizer. Định dạng JSON không kiểm vị trí token được thưởng.');
  M(21,'Sequence packing','Khi ghép nhiều mẫu trong một sequence, cần kiểm gì?',[
    '+Ranh giới mẫu và token kết thúc được biểu diễn đúng','+Attention/labels theo policy packing đã chọn','-Giữ đủ text là đủ, không cần kiểm phần model được phép nhìn','+So hiệu quả token với quality trên task','-Packing tăng utilization thì suy ra không có cross-example leakage'], 'Utilization chỉ đo hiệu quả tài nguyên. Ranh giới, attention và labels quyết định có tạo tín hiệu học sai giữa các mẫu không.');
  M(21,'Reasoning template và masked spans','Muốn kiểm model học đúng phần hội thoại, cần xem gì?',[
    '+Template và role tokens sau tokenization','+Vùng reasoning/answer nào được train theo thiết kế','-Chuỗi render đẹp trong editor đủ xác nhận masking','+EOS và generation parser khi inference','-Dùng raw text length để suy ra số token bị mask'], 'Render text không thể hiện đầy đủ token/labels. Template, masking và parsing phải tương thích từ train tới inference.');
  M(21,'Synthetic data và model collapse','Trước khi tăng tỷ lệ dữ liệu sinh, cần những biện pháp nào?',[
    '+Kiểm quyền và provenance của nguồn/teacher','+Review độ đúng và mức đa dạng của mẫu','+Giữ eval độc lập với quy trình sinh','-Nhân bản mẫu điểm cao để thay coverage các trường hợp hiếm','-Dùng agreement giữa cùng teacher và judge làm ground truth đủ'], 'Dữ liệu sinh có thể khuếch đại lỗi và làm nghèo phân bố. Agreement có lỗi tương quan không thay nhãn độc lập.');
  M(21,'Trajectory SFT và RL môi trường','Nếu task cần hành động qua nhiều bước, cần phân biệt gì?',[
    '+SFT trajectory học các bước được cung cấp','+RL cần tương tác/tín hiệu reward phù hợp môi trường','-SFT trace thành công đủ chứng minh policy phục hồi được mọi trạng thái lỗi','+Eval trên rollout thực và các điểm lệch','-Reward cuối dương chứng minh từng action hợp quyền'], 'Trace mẫu không bao phủ mọi trạng thái model tự gặp. Outcome reward cũng không thay kiểm quyền và process validity.');
  M(21,'Data engine và rubric hacking','Muốn tránh model học cách lách bộ chấm, cần gì?',[
    '+Rubric phản ánh outcome thay proxy dễ lách','+Giữ hidden/held-out cases ngoài vòng tối ưu','-Cho model dùng kết quả test giữ riêng để tự chọn đáp án train','+Review lỗi và mẫu được thưởng bất thường','-Tăng trọng số proxy hiện có khi train score chững lại'], 'Reward/data loop có thể tối ưu sai proxy. Cần kiểm tính hợp lệ của tín hiệu, không chỉ làm tín hiệu mạnh hơn.');
  M(21,'Eval và chat-template debugging','Muốn phân biệt model kém với inference config sai, nên làm gì?',[
    '+So tokenizer/template giữa train và runtime','+Kiểm EOS, stop rules và role parsing','+Chạy cùng prompt trên checkpoint/base tương thích','-Kết luận model overfit chỉ từ việc sinh không dừng','-Dùng train loss thay kiểm output đã export'], 'Sinh lỗi có thể do template/stop config chứ không chỉ weights. Phải kiểm artifact được load trong runtime thật.');
  M(21,'Merge multi-LoRA và serving','Sau merge hoặc đổi adapter routing, cần xác nhận gì?',[
    '+Đúng base/adapter version và tokenizer','+Output quality sau merge theo task','+Memory, latency và isolation giữa adapter routes','-Merge thành công về kỹ thuật đủ cho phép bỏ eval','-Tổng dung lượng file nhỏ đi chứng minh inference nhanh hơn'], 'Merge/export pass chỉ xác nhận một phần pipeline. Chất lượng và serving behavior cần đo lại sau biến đổi.');
  M(21,'License privacy và deliverables','Khi chuẩn bị nộp/phát hành model, cần những artifact nào?',[
    '+Căn cứ quyền dùng dữ liệu và base model','+Model/config cùng hướng dẫn chạy tương thích','+Eval report có dữ liệu/phạm vi rõ','-Upload raw dữ liệu user để người khác tái hiện dễ hơn','-Giữ API key trong notebook để demo không cần setup'], 'Tái hiện phải đi cùng quyền và bảo vệ bí mật. Dữ liệu riêng tư và key không là artifact chia sẻ mặc định.');

  M(22,'SFT và alignment','Khi đáp án theo mẫu tốt nhưng model ưu tiên hành vi sai, cần tách những vấn đề nào?',[
    '+Khả năng bắt chước demonstration và mục tiêu được ưu tiên','+Chất lượng nhãn/rubric xác định hành vi tốt','-Thêm cùng mẫu SFT đủ chứng minh alignment đã được sửa','+Đánh giá correctness riêng với style/safety','-Preference score tăng suy ra dữ liệu factual đã cập nhật'], 'Học format, học ưu tiên và có dữ kiện đúng là các chiều khác nhau. Preference score không tự xác nhận factual correctness.');
  M(22,'RLHF pipeline','Để chẩn đoán policy tối ưu reward nhưng task kém, cần xem gì?',[
    '+Reward model được học từ preference nào','+Policy có khai thác proxy ngoài mục tiêu mong muốn','-Kết luận lỗi chỉ nằm ở SFT vì PPO đã tối ưu đúng reward','+Đánh giá độc lập outcome và hành vi','-Tăng bước PPO để thu hẹp chênh lệch reward/task theo mặc định'], 'Policy tối ưu đúng một reward sai vẫn có thể làm task kém. Cần kiểm tín hiệu và reward hacking trước tăng tối ưu.');
  M(22,'DPO và reference log-ratio','Đội chỉ có prompt và một đáp án. Cần xử lý gì trước DPO chuẩn?',[
    '+Có chosen/rejected hợp lý cho cùng prompt','+Review nhãn ưu tiên theo rubric','+Giữ reference/tokenizer/template tương thích','-Dùng prompt khác nhau cho chosen và rejected miễn cùng topic','-Tự điền rejected rỗng cho mọi case để đủ schema'], 'Preference pair cần so có ý nghĩa trong cùng ngữ cảnh. Đủ trường JSON nhưng rejected vô nghĩa tạo mục tiêu học lệch.');
  M(22,'Beta và regularization','Khi thay beta, những quyết định nào cần được kiểm định?',[
    '+Đọc beta nằm ở đâu trong objective đang dùng','+So mức dịch chuyển policy và held-out behavior','-Dùng cùng giá trị beta giữa mọi thuật toán vì cùng tên tham số','+Theo dõi chất lượng từng chiều và instability','-Chọn beta cho reward margin lớn nhất mà không xem outputs'], 'Tên tham số không bảo đảm cùng semantics. Reward margin chỉ là một tín hiệu, không thay task eval.');
  M(22,'Likelihood displacement và length hacking','Chosen win rate tăng nhưng answer dài và sai hơn. Nên kiểm gì?',[
    '+Sự tương quan giữa nhãn ưu tiên và độ dài','+Likelihood/reward metrics cùng với output thực','-Giữ pipeline vì chosen margin đã đạt target train','+Tách verbosity khỏi correctness trong rubric','-Cắt output length ở serving rồi xem như nguyên nhân train đã được sửa'], 'Cắt output có thể giảm triệu chứng nhưng chưa sửa tín hiệu ưu tiên lệch. Cần kiểm dữ liệu và objective với eval độc lập.');
  M(22,'Preference pair chất lượng','Những cặp nào cần review lại trước training?',[
    '+Hai đáp án thuộc hai prompt khác nhau','+Chosen dài hơn nhưng có claim không được hỗ trợ','+Nhãn ưu tiên thay đổi theo reviewer mà không có rubric','-Chosen ngắn hơn nhưng giải đúng task và giữ ràng buộc','+Rejected là lỗi format vô nghĩa trong mọi mẫu'], 'Chất lượng pair nằm ở ý nghĩa so sánh và nhãn nhất quán. Cặp chỉ phân biệt lỗi format quá dễ có thể không dạy ưu tiên cần học.');
  M(22,'ORPO objective kết hợp','Khi chọn ORPO thay pipeline nhiều giai đoạn, cần hiểu gì?',[
    '+Objective kết hợp phần SFT và preference','+Vẫn cần dữ liệu cặp ưu tiên có chất lượng','-Reference-free đồng nghĩa không có thành phần học đáp án mẫu','+Cần so hành vi sau train với baseline','-Bỏ reference có thể thay thế kiểm định safety'], 'ORPO không chỉ là DPO đổi tên. Bỏ một thành phần hạ tầng không loại nhu cầu dữ liệu và đánh giá.');
  M(22,'SimPO và KTO','Muốn chọn phương pháp theo dạng feedback, cần kiểm gì?',[
    '+Dữ liệu đang là preference pairs hay tín hiệu nhị phân','+Objective và normalization theo phương pháp','-Mọi phương pháp preference đều bắt buộc có cùng schema pairs','+Điều kiện benchmark và baseline khi so','-Reference-free suy ra có thể bỏ mọi regularization/eval'], 'Các phương pháp xử lý tín hiệu khác nhau và có giả định riêng. Cần đọc objective/schema, không suy từ nhãn preference.');
  M(22,'GRPO bỏ critic chứ không bỏ mọi reward','Những thành phần nào vẫn cần được làm rõ khi triển khai GRPO?',[
    '+Cách chấm reward của các mẫu trong nhóm','+Cách dùng thông tin tương đối trong nhóm','-Bỏ critic đồng nghĩa không còn cần reward signal','+Giới hạn của verifier/reward model nếu được dùng','-Chỉ cần nhiều samples hơn để loại sai lệch reward'], 'Không dùng critic không đồng nghĩa không có reward. Sampling nhiều không sửa được bộ chấm thưởng sai hành vi.');
  M(22,'RLVR và verifier','Model tìm ra cách pass test nhưng sai mục tiêu thật. Cần làm gì?',[
    '+Kiểm verifier có đo đúng phần outcome cần thiết','+Thêm test biên và dữ liệu giữ riêng','+Đánh giá reward hacking theo trajectory','-Tăng trọng số reward pass để củng cố hành vi đang có','-Coi verifier tự động là ground truth không cần review'], 'RLVR có chất lượng phụ thuộc phép kiểm. Tối ưu mạnh hơn một verifier hở có thể làm lỗi nặng hơn.');
  M(22,'Iterative DPO và distribution shift','Khi sinh dữ liệu preference ở nhiều vòng, cần control nào?',[
    '+Theo dõi policy/version tạo dữ liệu mỗi vòng','+Giữ eval set độc lập và đo drift','-Lấy model vừa train làm judge duy nhất cho vòng tiếp','+Review thay đổi phân bố prompts và responses','-Gộp mọi vòng rồi bỏ provenance để giảm metadata'], 'Vòng lặp có thể tự củng cố bias. Provenance và evaluator độc lập giúp phân biệt cải thiện với drift do tự chấm.');
  M(22,'Constitutional AI','Khi dùng bộ nguyên tắc để sinh critique, cần kiểm gì?',[
    '+Nguyên tắc có rõ và xử lý được case xung đột','+Critique có bám nội dung và evidence','-Có nguyên tắc viết sẵn nghĩa hành vi đã được cưỡng chế ở runtime','+Eval bằng case độc lập với quá trình sinh','-Dùng compliance tự chấm thay mọi kiểm quyền tool'], 'Nguyên tắc là tín hiệu hướng hành vi, không tự là lớp enforcement. Cần kiểm critique, hành vi và quyền thật.');
  M(22,'RLAIF và recursion của judge','Khi feedback do AI sinh, cần xem những rủi ro nào?',[
    '+Judge và policy có thể chia sẻ blind spots','+Nhãn AI cần calibration bằng mẫu người review','-Thêm một judge cùng family được coi như bằng chứng độc lập đầy đủ','+Chi phí và độ nhạy theo rubric/task','-Sự đồng ý giữa nhiều AI cho phép bỏ review case rủi ro cao'], 'Đồng thuận có thể mang lỗi tương quan. Cần calibration và tuyến review dựa risk thay vì chỉ tăng số judge.');
  M(22,'Red team và đánh giá alignment','Sau training, cần những nhóm phép kiểm nào?',[
    '+Task utility và factual correctness','+Unsafe pass cùng over-refusal trên cặp case','+Nhóm dữ liệu/domain chưa tối ưu trực tiếp','-Chỉ bộ preference đã dùng chọn checkpoint','+Behavior dưới prompts đối kháng có scope rõ'], 'Alignment eval cần giữ cả usefulness và safety ngoài train. Checkpoint tốt trên preference train chưa bảo đảm tổng quát.');
  M(22,'Training strategy theo constraint','Chọn CPT/SFT/preference tune cần dựa vào gì?',[
    '+Lỗi cần sửa là tri thức/phân bố hay hành vi ưu tiên','+Dạng dữ liệu và khả năng chấm outcome','+Tài nguyên train/serving và license','-Thuật toán có điểm leaderboard cao nhất ở task khác','-Chọn một recipe cho mọi failure cluster để đơn giản vận hành'], 'Phương pháp phải hợp nguồn tín hiệu và lỗi. Một recipe chung có thể giữ đơn giản nhưng không giải đúng bottleneck.');
  M(22,'Model merging và export','Khi bản merged không giữ hành vi tốt của hai model thành phần, nên kiểm gì?',[
    '+Tương thích base, tokenizer và cấu hình merge','+Per-task regressions trước/sau export','-Cho rằng điểm trung bình hai model dự đoán được điểm merged','+Artifact load thực và generation template','-Dùng file xuất được làm bằng chứng quality tương đương'], 'Merge không mặc định bảo toàn mọi kỹ năng. Export success chỉ kiểm một lớp của quá trình phát hành.');

  M(23,'Phổ deterministic–agentic','Muốn giảm lỗi hành động mà vẫn giữ khả năng suy luận, nên tách gì?',[
    '+Phần chọn nội dung có thể giao model trong phạm vi','+Validation/quyền và bất biến thực thi do code cưỡng chế','-Đưa mọi nhánh vào prompt để giảm số node code','+Outcome được kiểm ngoài lời model tự báo','-Đổi toàn pipeline thành deterministic chỉ vì một tool từng lỗi'], 'Cần chọn ranh giới theo risk và tính bất định. Một lỗi không đủ quyết định cực đoan về toàn kiến trúc.');
  M(23,'StateGraph node và edge','Khi node sau thiếu dữ liệu, cần kiểm gì trước?',[
    '+Schema và cập nhật state của node trước','+Điều kiện edge/routing thực tế trong trace','-Tăng model context window để bổ sung key chưa được ghi','+Input contract mà node sau cần','-Đổi tên node cho rõ hơn rồi coi là đã sửa dependency'], 'Thông tin chưa ghi hoặc route sai là lỗi state/contract. Window hay tên node không tạo key bị thiếu.');
  M(23,'Super-step và reducer','Hai nhánh cùng cập nhật một key. Cần quyết định gì?',[
    '+Ý nghĩa hợp nhất: append, cộng hay thay thế','+Reducer có hợp với cập nhật đồng thời không','-Cho thứ tự request về quyết định nội dung đúng hơn','+Test duplicate/replay nếu dữ liệu có thể tới lặp','-Dùng list để tránh định nghĩa semantics của merge'], 'Kiểu dữ liệu không thay quy tắc hợp nhất. Thứ tự network không xác định update đúng nghiệp vụ.');
  M(23,'Send và Command','Khi fan-out hoặc route theo kết quả node, cần phân biệt gì?',[
    '+Dữ liệu gửi cho từng nhánh và key state được cập nhật','+Điểm tổng hợp và điều kiện kết thúc','-Fan-out có thể bỏ giới hạn concurrency vì graph quản lý các node','+Contract của primitive theo version đang dùng','-Gửi cùng task nhiều lần đồng nghĩa có retry idempotent'], 'Điều phối graph không tự cấp mọi giới hạn tài nguyên hay idempotency. Cần hiểu input/state và điểm join rõ.');
  M(23,'Recursion retry timeout và cache','Muốn giữ request trong budget, cần các giới hạn nào?',[
    '+Deadline tổng của task','+Số vòng graph và số tool/provider calls','+Retry policy theo loại lỗi','-Một recursion limit được coi bao trùm mọi model call','-Cache hit cho phép bỏ validation quyền hiện tại'], 'Graph steps, API calls và deadline là các trần khác nhau. Cache không thay authorization của request hiện tại.');
  M(23,'Durability và checkpointer','Sau crash, những điều kiện nào quyết định resume đúng?',[
    '+Backend/checkpoint thực sự bền theo cấu hình','+Thread identity được gắn đúng phiên việc','-Có object checkpointer trong code đủ chứng minh dữ liệu sống qua process','+Side effect được thiết kế chống chạy lặp','-Restore graph state đồng nghĩa undo DB ngoài graph'], 'Khả năng phục hồi cần state được commit ở backend đúng. External side effect có lifecycle riêng.');
  M(23,'Pending writes và partial recovery','Một nhánh hoàn tất, nhánh khác lỗi. Nên kiểm gì khi resume?',[
    '+Những cập nhật nào đã được ghi bền theo contract','+Nhánh nào cần replay và nhánh nào có thể dùng kết quả đã lưu','-Chạy lại cả hai nhánh rồi mặc định không tạo tác động lặp','+Tính tương thích của state và node versions','-Lời actor nói đã xong đủ thay checkpoint evidence'], 'Phục hồi một phần phụ thuộc commit semantics và side effects. Replay rộng hơn có thể gây tác động lặp.');
  M(23,'Interrupt và replay node','Khi gửi thông báo bị lặp sau resume, nên xử lý gì?',[
    '+Tìm đoạn code trước interrupt bị chạy lại','+Tách hoặc bảo vệ side effect bằng idempotency','-Chỉ tăng checkpoint frequency để coi là exactly-once','+Test cùng quyết định được gửi lại hoặc process restart','-Xóa lịch sử thread để tránh resume lặp'], 'Checkpoint không tự biến side effect thành exactly-once. Xóa lịch sử che triệu chứng và mất tiến trình.');
  M(23,'Time travel và fork','Khi tạo nhánh từ checkpoint cũ, điều gì vẫn cần xử lý riêng?',[
    '+Các email/giao dịch đã tạo ở hệ ngoài','+Quyền và cấu hình của nhánh mới','-External DB tự quay lại cùng phiên bản graph state','+Provenance để phân biệt các nhánh kết quả','-Fork được dùng như transaction rollback cho cả hệ'], 'Fork tạo một đường state mới, không tự đảo tác động đã commit ra ngoài. Cần bù/rollback nghiệp vụ riêng nếu có.');
  M(23,'Thread state và cross-thread Store','Để memory qua phiên không trộn tiến trình, cần gì?',[
    '+Phân biệt namespace user với thread task','+Quyền truy cập Store theo identity','-Tái dùng cùng thread ID cho các user có sở thích giống nhau','+Policy cập nhật và expiry của facts bền','-Cho every checkpoint write tự thành memory mọi thread'], 'Thread và user không là một trục. Persist state không tự xác định thông tin nào được chia sẻ qua phiên.');
  M(23,'Streaming và request chồng','User gửi yêu cầu mới khi luồng cũ chưa xong. Cần policy nào?',[
    '+Quy định queue, reject, interrupt hoặc tiếp nhận song song theo task','+Gắn events với request/run IDs','-Ghép token hai run theo thứ tự đến để giữ trải nghiệm liên tục','+Xử lý state update và cancellation rõ','-Token cuối đã stream nghĩa external action đã commit'], 'Streaming là luồng hiển thị/sự kiện, không tự quyết định concurrency hoặc commit của task.');
  M(23,'create_agent và middleware','Khi middleware kiểm action sai thời điểm, nên sửa thế nào?',[
    '+Đối chiếu lifecycle hook với sự kiện cần kiểm','+Chặn quyền trước execution','-Dùng after_model để suy ra tool result đã có','+Test wrapper order và lỗi qua các middleware','-Đặt cùng tên hook là đủ dù runtime version khác'], 'Hook phải theo lifecycle và version thực. Chọn được tool chưa có nghĩa tool đã chạy hoặc đã có kết quả.');
  M(23,'Bốn thao tác context của Deep Agents','Muốn xử lý context dài mà không mất bằng chứng, cần thao tác nào có điều kiện?',[
    '+Ghi dữ kiện bền có scope và nguồn','+Chọn phần liên quan thay nạp toàn bộ','+Nén nhưng giữ constraint/đường truy nguồn','+Tách context theo nhiệm vụ và quyền','-Gộp output worker vào system để giữ nguyên độ ưu tiên'], 'Write/select/compress/isolate cần cùng ranh giới tin cậy. Output worker không tự được nâng quyền thành system policy.');
  M(23,'Backend và persistence','Sau restart dữ liệu file biến mất. Nên kiểm gì?',[
    '+Backend file đang là ephemeral hay persistent','+Đường lưu và mount/config thực ở runtime','-Dùng tên file như cũ đủ để chứng minh file thuộc cùng store','+Quyền và isolation khi chia backend giữa workers','-Bật thêm checkpoint cho graph để thay mọi file persistence'], 'Graph state và filesystem có backend/vòng đời khác nhau. Cần kiểm nơi file thật được lưu, không chỉ tên logic.');
  M(23,'Chọn framework và protocol','Muốn tránh chọn nhầm công cụ orchestration, nên dựa vào gì?',[
    '+Yêu cầu state/recovery và execution contract','+Version/capability của framework và protocol','-Có MCP nghĩa đã có supervisor và workflow engine','+Spike đường lỗi quan trọng trong môi trường đích','-Số sao repository thay cho phép kiểm integration'], 'Protocol kết nối capability không thay orchestration. Lựa chọn cần kiểm đúng lớp và tình huống dự án.');
  M(23,'Multi-agent một writer','Khi nhiều worker cùng sửa cùng file, cần control nào?',[
    '+Một owner merge hoặc ranh giới file rõ','+Worker trả kết quả theo contract','-Giữ shared path và yêu cầu ai xong sau merge bằng prompt','+Kiểm conflicts/version trước ghi cuối','-Coi file timestamp mới nhất là nội dung đã verify tốt nhất'], 'Ownership và versioning bảo vệ artifact; recency không chứng minh nội dung đúng hoặc đã tích hợp đầy đủ.');
  M(23,'Học và compile orchestration','Muốn chuyển từ agent tự tìm đường sang workflow ổn định, cần gì?',[
    '+Trace thành công và failure đủ đại diện','+Contract/routing được kiểm ngoài dữ liệu đã quan sát','-Biến một trace đẹp thành luồng cố định cho mọi query','+Fallback khi task ngoài phạm vi đã compile','-Agent tự tối ưu grader để chứng minh workflow mới tốt hơn'], 'Compile chỉ có ý nghĩa trong miền đã kiểm. Một trace chưa đủ coverage, và grader cần được bảo vệ khỏi vòng tối ưu.');
  M(23,'Hybrid shell và validator lab','Tool trả HTTP 200 nhưng output thiếu evidence. Shell nên xử lý ra sao?',[
    '+Chạy schema và semantic validator phù hợp','+Giữ trạng thái task chưa đạt khi bằng chứng thiếu','-Dùng HTTP 200 làm success để tránh double handling','+Cho retry/fallback trong budget và đúng loại lỗi','-Chuyển lỗi thành câu văn thành công để không lộ implementation'], 'Transport success không bằng business validity. UX có thể đơn giản nhưng không được che outcome sai thành đã hoàn tất.');

  M(24,'Eval levels và reference','Muốn đánh giá task đúng mục tiêu, cần phân biệt gì?',[
    '+Reference chất lượng có thể khác một đáp án mẫu duy nhất','+Metric cần input phù hợp với câu hỏi nó đo','-Một rubric chung cho mọi component đủ xác nhận E2E','+Task outcome ở hệ đích cần evidence riêng','-Reference do cùng model sinh được coi độc lập với output cần chấm'], 'Reference, rubric và outcome phải bám task. Cùng model có thể chia sẻ lỗi; component score không tự xác nhận toàn luồng.');
  M(24,'Component và end-to-end eval','RAG score tốt nhưng đặt nhầm lịch. Cần thêm bằng chứng nào?',[
    '+Đối chiếu lịch đã tạo với yêu cầu gốc','+Kiểm tool arguments và response theo trace','-Tăng top-k cho đến khi điểm retrieval tốt hơn nữa','+Eval quyền và side effects của action','-Cho pass vì generation đã có evidence liên quan'], 'Lỗi action cần kiểm external state và trajectory. Cải thiện retrieval không trực tiếp sửa tham số đặt lịch sai.');
  M(24,'Faithfulness','Khi answer bám một policy cũ, những kết luận nào đúng?',[
    '+Answer có thể faithful đối với context đã nhận','+Freshness/validity của nguồn cần kiểm riêng','-Faithfulness cao xác nhận policy còn hiệu lực','+Correctness so với yêu cầu hiện tại có thể thấp','-Giảm điểm faithfulness là cách duy nhất mô tả lỗi nguồn cũ'], 'Faithfulness đo hỗ trợ từ context; correctness và hiệu lực nguồn là các chiều khác. Không gán mọi lỗi thành unfaithful.');
  M(24,'Answer relevancy','Bot trả dài nhưng không đúng điều user hỏi. Nên đo/sửa gì?',[
    '+Intent mà câu trả lời cần đáp ứng','+Relevance và correctness thành hai chiều','-Cắt output ngắn hơn đủ chứng minh đã đúng intent','+Review phần nội dung ngoài câu hỏi','-Answer liên quan chủ đề chung được coi đã hoàn thành task'], 'Đúng chủ đề rộng không đồng nghĩa đáp ứng câu hỏi cụ thể. Cắt ngắn chỉ sửa verbosity nếu vẫn sai intent.');
  M(24,'Context precision và ranking','Metric thay đổi sau nâng version evaluator. Kết luận nào có cơ sở?',[
    '+Cần kiểm metric contract và input schema của hai version','+Chạy lại baseline trên cùng evaluator để so','-Điểm giảm xác nhận retriever mới tệ hơn dù outputs không đổi','+Tách evaluator drift khỏi system drift','-Tên ContextPrecision giống nhau đủ bảo đảm score so trực tiếp'], 'Tên metric không bảo đảm cùng cách đo. Khi evaluator đổi, cần phép so cùng chuẩn trước quy lỗi cho hệ.');
  M(24,'Context recall','Reference có ngoại lệ nhưng context không có. Cần lần theo gì?',[
    '+Reference có đúng và phù hợp thời điểm không','+Ngoại lệ có trong corpus/parse/chunk không','+Các bước retrieval và rerank có làm mất nó không','-Tăng độ dài answer để bù thiếu information trong context','-Faithfulness cao đủ để bỏ qua recall thiếu'], 'Độ trung thực với context thiếu vẫn có thể bỏ sót thông tin. Cần tìm nơi evidence mất trước khi sửa cách sinh câu trả lời.');
  M(24,'Synthetic eval set và targets','Muốn tránh eval quá dễ, nên chọn những control nào?',[
    '+Có query đại diện traffic và case theo risk','+Review synthetic labels bằng evidence phù hợp','-Lấy cùng generator làm judge duy nhất rồi tăng số câu','+Tách simple, multi-context và adversarial cases khi báo cáo','-Áp target trên slide như gate chung cho mọi domain'], 'Nhiều mẫu cùng bias không tạo độ phủ thật. Targets cần theo task/risk và được hiệu chuẩn.');
  M(24,'Pairwise và position bias','Muốn kiểm judge thiên vị vị trí, cần phép thử nào?',[
    '+Đảo A/B trong khi giữ nguyên nội dung và rubric','+Đo sự đổi lựa chọn theo vị trí','-Đặt hệ mới ở A trong mọi lần để tăng tính nhất quán','+Ẩn nhãn nhận dạng hệ nếu không cần cho rubric','-Tăng số lượt cùng thứ tự đủ loại position bias'], 'Lặp một thứ tự giữ nguyên bias. Đảo vị trí có kiểm soát mới giúp tách yếu tố vị trí khỏi nội dung.');
  M(24,'Length style và self-preference bias','Judge ưu tiên lời văn dài có fact sai. Cần những biện pháp nào?',[
    '+Tách content correctness khỏi style/verbosity','+Dùng cặp kiểm soát độ dài khi audit judge','-Chuẩn hóa Markdown đủ để giả định đã loại mọi bias','+So nhãn judge với người trên case khó','-Dùng output của chính judge làm đáp án chuẩn cho cùng case'], 'Định dạng chỉ loại một phần tín hiệu hình thức. Cần kiểm dữ kiện và lỗi tương quan/self-preference.');
  M(24,'Calibration và tiered judge','Judge rẻ bỏ sót lỗi nghiêm trọng. Policy nào phù hợp?',[
    '+Xem false negative theo nhóm risk','+Route case khó/rủi ro cao tới kiểm sâu hơn','-Tối ưu accuracy tổng trên tập nhiều case dễ rồi giữ nguyên tuyến','+Đánh giá agreement sau đổi model hoặc rubric','-Dùng confidence tự báo của judge thay nhãn hiệu chuẩn'], 'Tập mất cân bằng có thể che lỗi nghiêm trọng. Calibration và routing cần theo failure mode, không chỉ trung bình.');
  M(24,'Hallucination taxonomy và consistency','Năm lần sinh lặp lại cùng một số liệu không nguồn. Có thể kết luận gì?',[
    '+Outputs nhất quán nhưng chưa được xác minh đúng','+Cần tìm evidence độc lập cho con số','-Consensus của năm lần cho phép dùng làm reference','+Nên sửa/bỏ claim nếu không chứng minh được','-Tăng samples cùng prompt đủ làm consistency thành factuality'], 'Model có thể ổn định trong cùng sai lầm. Sampling không tạo dữ kiện hoặc bằng chứng độc lập.');
  M(24,'NLI và semantic entropy','Detector báo supported dù answer đổi chủ thể. Cần làm gì?',[
    '+Thêm case attribution và negation có nhãn','+Đo false support theo domain','-Dùng entropy thấp để phủ quyết lỗi detector','+Kết hợp nguồn/kiểm dữ kiện thay vì chỉ một score','-Đổi threshold trên tập train rồi coi calibration đã đủ'], 'NLI và uncertainty detectors đều có lỗi. Entropy thấp không sửa claim sai; threshold cần được kiểm ngoài tập đã tune.');
  M(24,'Guardrail bốn trục nhiều lớp','Text cuối an toàn nhưng tool đã ghi trái quyền. Cần control nào?',[
    '+Authorization ở tool execution boundary','+Validation của payload nghiệp vụ','-Tăng mức moderation ở output cuối để ngăn ghi đã xảy ra','+Audit external effect cùng lời trả lời','-Gộp mọi vi phạm vào topical relevance để dùng một score'], 'Security/action safety có boundary khác output/topicality. Hành động đã xảy ra không bị output filter ngăn ngược.');
  M(24,'PII và input validation','Detector bỏ sót email viết cách điệu. Cần những phép thử nào?',[
    '+Biến thể tiếng Việt/ký tự theo dữ liệu sử dụng thật','+Đo leak và false positive riêng','-Mask mọi token có ký hiệu @ rồi coi privacy đã đủ','+Kết hợp recognizer, schema và policy phù hợp','-Tăng tỷ lệ chặn như chỉ số duy nhất để chọn detector'], 'Một regex hoặc tỷ lệ chặn không bao phủ mọi PII và usefulness. Cần bộ allowed/disallowed có đại diện.');
  M(24,'Indirect injection và session poisoning','Payload độc yêu cầu lưu rule bỏ kiểm quyền cho lượt sau. Cần gì?',[
    '+Không cho tài liệu nâng thành instruction bền','+Kiểm nguồn/quyền trên write-memory path','+Test qua nhiều lượt và restart','-Chỉ scan user message vì payload đến từ một tài liệu đã index','-Bỏ memory hiện tại rồi coi đường poisoning đã được sửa'], 'Cần sửa đường authority/write, không chỉ dọn một bản ghi. Tài liệu đã index vẫn là dữ liệu không được cấp quyền đổi policy.');
  M(24,'Output rails và over-filtering','Bot chặn cả request hợp lệ chứa từ nhạy cảm. Nên làm gì?',[
    '+Dùng cặp allowed/disallowed theo hành vi và ngữ cảnh','+Đo false block cùng unsafe pass','-Loại từ nhạy cảm khỏi mọi request trước model để giữ mức chặn','+Review boundary và escalation cho case không chắc','-Chọn bản có tỷ lệ chặn cao nhất trên toàn traffic'], 'Keyword không quyết định intent/hành vi. Chặn nhiều có thể phá task hợp lệ và không phản ánh mức an toàn thật.');
  M(24,'CI eval gates và lab evidence','Report có điểm nhưng thiếu per-case context. Cần bổ sung gì?',[
    '+Versioned inputs, outputs và context đã chấm','+Metric/judge config cùng run identifiers','+Failure clusters và case evidence','-Ảnh score tổng thay dữ liệu để giảm kích thước report','-Một live API call thành công thay cho kiểm semantic của cả bộ'], 'Không thể tái hiện kết luận chỉ từ điểm tổng. API live chỉ chứng minh một lớp tích hợp, không chứng minh labels/metric hợp lệ.');

  M(25,'Failure modes và silent degradation','Khi HTTP ổn nhưng chất lượng giảm, cần các tín hiệu nào?',[
    '+Task success theo nhóm query/use case','+Retrieval/tool/model outputs có version','-Tỷ lệ 5xx thấp đủ để loại khả năng incident AI','+Metric cost/latency để tìm thay đổi cùng thời điểm','-Chỉ alert khi service không trả response'], 'Lỗi AI có thể là nội dung sai với transport thành công. Cần đo outcome và phân cohort thay chỉ availability.');
  M(25,'Retry backoff và jitter','Policy nào hạn chế retry storm khi provider quá tải?',[
    '+Một tầng sở hữu budget retry của request','+Backoff/jitter và deadline tổng','+Tôn trọng Retry-After khi áp dụng','-Mỗi service giữ retry riêng để tăng độ bền toàn chuỗi','-Retry request thiếu field bằng khoảng chờ dài hơn'], 'Retry nhiều tầng nhân số call; request sai cần sửa input. Giãn thời gian không tạo khả năng phục hồi cho lỗi validation.');
  M(25,'Circuit breaker ba trạng thái','Khi breaker Open, những hành vi nào phù hợp?',[
    '+Fail fast hoặc fallback theo contract','+Sau thời hạn cho probe giới hạn theo policy','-Cho mọi request gọi provider để thu thêm bằng chứng phục hồi','+Phân biệt Open với lỗi authorization của caller','-Dùng số request bị chặn làm số lỗi mới của provider'], 'Open ngăn tải; probe có kiểm soát mới thử phục hồi. Request chưa gọi provider không là một failure mới của provider.');
  M(25,'Trip logic và scope lỗi','Ứng dụng gửi payload sai làm nhiều 400. Nên xử lý gì?',[
    '+Sửa/validate request trước khi gửi','+Phân loại lỗi caller khác lỗi dependency','-Gộp mọi 4xx vào cùng failure threshold của provider','+Theo dõi phiên bản deploy và request schema','-Chuyển provider mặc định để bỏ lỗi contract chung'], 'Sai payload có thể lặp ở mọi provider. Không quy mọi 4xx thành dependency failure hoặc dùng fallback để che bug app.');
  M(25,'Half-open probe và state phân tán','Tám instance cùng phục hồi breaker. Cần kiểm điều gì?',[
    '+State breaker đang local hay dùng coordination chung','+Số probe tối đa trên toàn phạm vi cần bảo vệ','-Mỗi instance có threshold 5 nên toàn hệ cũng trip sau đúng 5 lỗi','+Tránh thundering herd khi cùng hết cooldown','-Cho toàn bộ queue chạy lại ngay khi một probe thành công'], 'State local tạo nhiều ngưỡng và probe riêng. Một probe không xác nhận đủ capacity để xả toàn bộ tải chờ.');
  M(25,'Timeout bulkhead và hedging','Khi dependency chậm, cần cân nhắc những điều kiện nào?',[
    '+Timeout từng bước trong deadline E2E','+Bulkhead giới hạn tài nguyên lỗi có thể chiếm','+Hedging có tăng call/cost và cần hợp loại request','-Hedge thao tác ghi không có idempotency như cách giảm p99 mặc định','-Đặt timeout mọi tầng bằng SLO E2E mà không xét cộng dồn'], 'Hedging có thể tạo tác động lặp và tăng tải. Timeout phải phù hợp đường đi E2E, không chỉ từng tầng riêng lẻ.');
  M(25,'Gateway và fallback ladder','Trước khi đổi sang provider dự phòng, cần kiểm gì?',[
    '+Output/tool contract và chất lượng của tuyến dự phòng','+Privacy/data policy có cho chuyển dữ liệu không','+Ngân sách latency và cost còn lại','-Dùng cùng model name suy ra cùng behavior và parameter support','-Fallback thành công nghĩa không cần báo suy giảm chức năng'], 'Gateway không làm provider tương đương về semantics hoặc quyền dữ liệu. Fallback phải giữ contract hoặc báo rõ mức suy giảm.');
  M(25,'Idempotency khi retry action','Response bị mất sau request ghi. Những bước nào an toàn hơn?',[
    '+Dùng cùng idempotency key cho cùng hành động logic','+Đối chiếu trạng thái đã commit nếu hệ hỗ trợ','-Sinh key mới cho mỗi retry để tránh trùng request','+Phân biệt retry kỹ thuật với một hành động mới của user','-Coi timeout là bằng chứng server chưa thực thi'], 'Timeout không cho biết commit. Key mới có thể biến retry thành thao tác ghi mới và nhân tác động.');
  M(25,'Ba tầng cache','Khi chọn nơi cache, cần phân biệt gì?',[
    '+Exact response cache với semantic cache','+Provider prompt cache với cache answer của app','+Version, identity và điều kiện ảnh hưởng kết quả','-Prompt cache hit cho phép bỏ gọi model và dùng lại answer cũ','-Cache layer nào cũng giảm cùng một loại token/call cost'], 'Các tầng cache lưu và tiết kiệm phần khác nhau. Prompt prefix cache không đồng nghĩa answer cache.');
  M(25,'Semantic false hit','Hai câu gần nghĩa nhưng khác điều kiện hoàn tiền. Cần control nào?',[
    '+Key/filter giữ điều kiện nghiệp vụ và identity cần thiết','+Eval false hit bằng cặp gần nghĩa nhưng khác đáp án','-Dùng cosine threshold cố định như bằng chứng đủ cho mọi domain','+Cho miss/fallback khi không chắc tương đương intent','-Tăng hit rate là mục tiêu chính trước task correctness'], 'Similarity chỉ là tín hiệu. False hit về semantics có thể trả đáp án sai hoặc lộ dữ liệu dù tiết kiệm call.');
  M(25,'TTL invalidation và ACL cache','User bị thu hồi quyền trong khi answer còn trong cache. Cần gì?',[
    '+Kiểm quyền hiện tại trước phục vụ cached data','+Cache key/invalidation gắn scope và version phù hợp','-Chờ TTL của answer tự hết để đồng nhất vòng đời quyền','+Test revoke quyền và nguồn bị xóa','-Nguồn public trước đây đủ cho phép tái phục vụ sau thay policy'], 'TTL dữ liệu và vòng đời quyền khác nhau. Thu hồi quyền cần được phản ánh ngay theo policy, không mặc định chờ cache expiry.');
  M(25,'Cost budgeting','Khi một task gọi model/tool nhiều vòng, budget nên bao gồm gì?',[
    '+Tổng token/call qua cả retry và worker','+Deadline cùng cost cap theo task/user','+Policy degrade hoặc stop khi chạm ngưỡng','-Chỉ hóa đơn của lần gọi cuối vì các lần trước là overhead kỹ thuật','-Giảm max output tokens đủ bảo đảm tổng task cost'], 'Chi phí tích lũy xuyên vòng lặp. Giới hạn một call không thay budget E2E.');
  M(25,'SLI SLO SLA và burn rate','Để alert đúng mức tiêu hao error budget, cần gì?',[
    '+SLI gắn outcome người dùng trong cửa sổ rõ','+SLO và mức error budget được định nghĩa','+Burn rate theo nhiều khoảng quan sát phù hợp','-Dùng uptime provider làm SLI đầy đủ của app','-Đạt SLO trung bình nghĩa mọi tenant đều được phục vụ đạt mục tiêu'], 'SLO app cần task và phạm vi riêng. Trung bình có thể che cohort, và provider availability không bao phủ lỗi app/data.');
  M(25,'Tracing chaos và simulator evidence','Khi demo chaos chạy qua simulator, được kết luận và cần kiểm gì?',[
    '+Policy được thực thi đúng trong phạm vi simulator đã đo','+Cần test thêm integration/runtime thật theo rủi ro','+Ghi loại lỗi injected và expected recovery','-Simulator pass đủ chứng minh provider thật giữ đúng semantics lỗi','-Trace mẫu được coi như log production đã thu'], 'Simulator giúp kiểm policy có điều kiện, không tự chứng minh network/provider live. Evidence cần ghi rõ môi trường và dữ liệu thật hay giả lập.');

  M(26,'Model đề xuất app thực thi','Để ngăn tool call ngoài quyền, cần những lớp nào?',[
    '+Validate schema và giá trị nghiệp vụ tại app/server','+Authorize theo identity và action scope','-Dùng confidence của model để bỏ gate với call có JSON đúng','+Kiểm external result trước báo đã hoàn tất','-Prompt chỉ mô tả tool được phép thay enforcement ở executor'], 'Model proposal và schema hợp lệ không cấp quyền. App/server phải quyết định và xác nhận tác động thật.');
  M(26,'Schema tool và vòng observation','Khi model nhầm kết quả giữa hai tool call, cần kiểm gì?',[
    '+Call/result IDs và thứ tự ghép observation','+Status/schema của kết quả từng call','-Ghép response theo thứ tự network trả về mà bỏ ID','+Bổ sung lỗi rõ để model xử lý trong budget','-Tool trả text bất kỳ đủ chứng minh task đã thành công'], 'Kết quả phải về đúng call theo contract; network order không đồng nghĩa proposal order. Text hợp lệ chưa xác nhận business outcome.');
  M(26,'Host client server MCP','Khi tool không được gọi, cần khoanh vùng những vai trò nào?',[
    '+Host có cho phép tool trong phiên hiện tại không','+Client kết nối/discovery đúng server không','+Server có công bố và thực thi capability đó không','-Model có quyền trực tiếp chạy mọi code server đã đăng ký','-Đổi prompt là đủ trước khi kiểm transport và discovery'], 'Đường gọi đi qua nhiều lớp độc lập. Không quy mọi lỗi không gọi tool cho model khi capability chưa được host/client cung cấp.');
  M(26,'Tools resources prompts','Nhận định nào giúp thiết kế capability đúng mục đích?',[
    '+Resource có thể cung cấp dữ liệu để client đọc','+Prompt là mẫu tương tác được công bố','+Tool có thể là read-only nếu implementation/policy như vậy','-Tên resource làm dữ liệu mặc nhiên không nhạy cảm','-Mọi tool đều cần quyền ghi dữ liệu để phân biệt với resource'], 'Phân loại giao thức không tự xác định độ nhạy hoặc quyền. Tool chỉ đọc vẫn cần auth/authorization phù hợp.');
  M(26,'API và protocol integration','Trước khi thêm MCP vào app ít tool, nên cân nhắc gì?',[
    '+Nhu cầu tái sử dụng capability giữa nhiều client','+Chi phí vận hành thêm server/transport','+REST/API hiện có có thể được bọc thay vì viết lại','-MCP thay luôn logic authorization của API nghiệp vụ','-Có protocol chuẩn suy ra không cần output contract riêng'], 'Protocol chuẩn hóa kết nối/capability, không thay business logic hay mọi contract của dữ liệu cụ thể.');
  M(26,'Discovery registry và capability','Nếu registry trả một tool phù hợp tag, cần kiểm gì trước dùng?',[
    '+Version/deprecation và schema hiện tại','+Nguồn server và quyền caller được cấp','-Tag đúng nghĩa là server đã được security review cho tài khoản này','+Khả năng tool đáp ứng task thực','-Registry listing được coi là consent để thực thi side effect'], 'Discovery chỉ tìm ứng viên. Trust, compatibility, consent và quyền phải được xác nhận ở các boundary thích hợp.');
  M(26,'MCP authentication authorization','Token hợp lệ nhưng tool bị từ chối. Cần xét những giả thuyết nào?',[
    '+Scope không bao gồm action đang gọi','+Audience/identity không phù hợp resource server','-Token parse được nên server phải cho mọi tool chạy','+Policy nghiệp vụ hoặc quyền dữ liệu chưa đạt','-Chuyển sang stdio là cách sửa quyền remote đúng mặc định'], 'Xác thực danh tính không bảo đảm quyền action. Đổi transport để né auth không sửa căn nguyên cấp quyền.');
  M(26,'Versioning và deprecation','Tool giữ input nhưng đổi output làm client lỗi. Cần gì?',[
    '+Test contract cả output và parsing của client hỗ trợ','+Adapter hoặc version mới có lộ trình deprecation','-Giữ tên tool cũ đủ chứng minh backward compatibility','+Metadata/capability để client chọn đúng version','-Sửa prompt client thay cho schema compatibility'], 'Input không đổi chưa đảm bảo tương thích. Client còn phụ thuộc output shape và semantics.');
  M(26,'ADK adapter và async tool','Khi tool async chặn cả loop, nên kiểm gì?',[
    '+Đo blocking I/O trong implementation thực','+Adapter có truyền đúng schema và await result không','-Đổi tên hàm thành async đủ làm mọi I/O không blocking','+Timeout, cancellation và concurrency theo contract','-Chạy thêm task song song như cách thay giới hạn tài nguyên'], 'Async declaration không biến thư viện blocking thành non-blocking. Cần xem đường I/O và lifecycle qua adapter.');
  M(26,'Deploy transport và health','Server load được local nhưng remote không gọi được. Cần kiểm gì?',[
    '+Bind address, port và transport cấu hình thực','+Auth, discovery và một business call qua endpoint','-Homepage 200 đủ xác nhận MCP transport tương thích','+Timeout/network và log có request IDs','-Tăng model temperature để cải thiện kết nối server'], 'Kết nối và protocol là lỗi hạ tầng/contract, không phải lấy mẫu token. Health UI không thay MCP E2E probe.');
  M(26,'Đăng ký server và tool self-description','Tool mới không xuất hiện với client. Nên kiểm gì?',[
    '+Đúng process/server version được đăng ký','+Discovery được refresh theo khả năng client','+Schema/capability thực server công bố','-Bỏ authorization trước để chắc tool có thể được gọi','-Khai lại toàn bộ business API dù chỉ thiếu metadata tool'], 'Không thấy capability có thể do process/discovery. Nới quyền hoặc viết lại API chưa nhắm nguyên nhân đó.');
  M(26,'Contract tests qua transport và version','Bộ test nào đủ nhắm vào lỗi client cũ sau deploy?',[
    '+Client versions đang được hỗ trợ','+Discovery, auth, execution và response parsing E2E','+Token sai/thiếu scope phải fail đúng boundary','-Chỉ unit test server trên stdio rồi suy ra remote tương đương','-Healthcheck xanh thay test business result'], 'Transport/version changes có lỗi riêng. Unit test local không bao phủ auth và parsing của client cũ ở remote.');

  M(27,'Action assessment và cost of error','Muốn chọn điểm cần người duyệt, nên xét điều gì?',[
    '+Tác động và khả năng hoàn tác của action','+Quyền và dữ liệu có thể chạm tới','+Chi phí lỗi với user/hệ đích','-Chỉ độ dài lời giải thích của model','-Model mạnh hơn đủ để nâng autonomy cùng mức cho mọi action'], 'Risk thuộc capability và hậu quả thực, không chỉ năng lực model. Autonomy cần theo loại hành động và bằng chứng.');
  M(27,'HITL và human-on-the-loop','Thiết kế nào phù hợp khi cần chặn một action trước tác động?',[
    '+Blocking approval ở trước execution theo policy','+Hiển thị payload/evidence để reviewer quyết định','-Chỉ theo dõi dashboard sau khi action chạy như cơ chế chặn trước','+Có tuyến reject/timeout rõ','-Tăng tần suất audit hậu kiểm thay điểm pause bắt buộc'], 'Giám sát và hậu kiểm có ích nhưng không ngăn tác động đã xảy ra. Hành động cần approval phải đợi quyết định hợp lệ.');
  M(27,'Approval và clarification','Khi thiếu thông tin người thụ hưởng, cần phân biệt gì?',[
    '+Clarification lấy dữ kiện còn thiếu','+Approval chấp nhận một hành động/payload cụ thể','-Một câu “được” cho phép app tự điền mọi tham số còn thiếu','+Sau clarify cần kiểm lại risk và quyền','-Approval trước khi có payload đủ làm decision có hiệu lực'], 'Đồng ý mơ hồ không xác định action được duyệt. Dữ liệu đủ và quyền cần được kiểm trước execution.');
  M(27,'Escalation checkpoint và edit','Khi reviewer sửa nội dung action, cần giữ contract nào?',[
    '+Lưu payload mới và identity quyết định','+Kiểm lại validation/quyền trên bản sửa','-Kế thừa approval của payload cũ cho mọi bản edit','+Có checkpoint/resume đúng phiên việc','-Edit trong UI đủ chứng minh state backend đã cập nhật'], 'Edit tạo dữ liệu/phiên bản mới cần kiểm lại. UI và backend phải gắn cùng state; approval không tự chuyển giữa payload khác nhau.');
  M(27,'Hard rules và confidence routing','Model rất tự tin với action ngoài scope. Policy nào đúng?',[
    '+Giữ hard rule từ chối hoặc escalate','+Dùng confidence như tín hiệu đã hiệu chuẩn trong phần được phép','-Nâng autonomy vì model có lý do dài và nhất quán','+Audit case risk/confidence mâu thuẫn','-Giảm threshold approval để tăng throughput theo mặc định'], 'Confidence không cấp quyền và không ghi đè policy. Throughput chỉ được tối ưu trong ranh giới risk đã định.');
  M(27,'Logprob và overconfidence','Muốn dùng confidence để route, cần kiểm gì?',[
    '+Calibration với outcome có nhãn theo domain','+Phân biệt token likelihood và xác suất hành động đúng','-Dùng logprob cao như bằng chứng factuality trực tiếp','+False auto-approve và false escalation theo risk','-Model tự báo chắc chắn thay bộ calibration'], 'Token probability và correctness là hai đại lượng khác nhau. Routing cần kiểm sai số theo chi phí hậu quả.');
  M(27,'Checkpoint thread và durability HITL','Approval về sau khi process restart. Cần điều kiện nào để resume đúng?',[
    '+Checkpoint đã commit trong backend bền','+Decision gắn đúng thread/action/version','+Quyền reviewer còn phù hợp','-Dùng thread mới nếu thread cũ chưa được load rồi chép quyết định qua','-Browser còn màn hình approval nghĩa backend đã giữ state'], 'State UI không chứng minh độ bền. Resume nhầm thread có thể duyệt sai task hoặc bỏ ràng buộc.');
  M(27,'Interrupt trước và sau action','Đặt pause ở đâu phụ thuộc những gì?',[
    '+Mục đích chặn trước hay review sau tác động','+Khả năng hoàn tác và cost of error','-Pause sau gửi email tương đương approval trước gửi nếu có audit','+Replay/idempotency của code quanh interrupt','-Cứ có checkpoint là vị trí side effect không còn quan trọng'], 'Pre/post review không tương đương về ngăn hậu quả. Checkpoint không tự bảo vệ side effect khỏi replay.');
  M(27,'Approval gắn payload và concurrency','Payload thay đổi sau khi được duyệt. Cần xử lý gì?',[
    '+So version/hash payload trước execution','+Invalidate hoặc review lại bản thay đổi theo policy','+Gắn action ID và chống quyết định gửi lặp','-Giữ approval theo tên task vì mục tiêu tổng vẫn vậy','-Chấp nhận payload mới nhất dù reviewer xem bản trước'], 'Người duyệt chấp nhận nội dung cụ thể, không một tên task bao trùm. Version và idempotency tránh stale approval và tác động lặp.');
  M(27,'TTL timeout và reviewer vắng mặt','Reviewer không trả lời trước deadline. Những policy nào có thể hợp lệ?',[
    '+Hết hạn approval theo TTL đã định','+Escalate tới owner khác theo risk','+Dừng hoặc degrade nếu action không được phép tự chạy','-Timeout được coi như đồng ý để giữ SLO latency','-Tái dùng approval gần nhất của task cùng topic'], 'Không phản hồi không là consent. Approval cũ của task khác không cấp quyền cho payload mới.');
  M(27,'Reject và replan có lý do','Sau reject, agent nên giữ quy tắc nào?',[
    '+Ghi lý do và ràng buộc do reviewer nêu','+Replan trong phạm vi được phép','-Gửi lại cùng payload với mô tả khác để xin approval nhanh hơn','+Chỉ xin duyệt lại khi có thay đổi liên quan rõ','-Xóa reject khỏi memory task để tránh bias bước sau'], 'Reject là thông tin quyết định có ràng buộc. Đổi câu chữ hoặc bỏ lịch sử không làm action bị từ chối trở nên hợp lệ.');
  M(27,'Action card diff và evidence','Muốn reviewer quyết định đúng thay vì bấm cho qua, cần gì?',[
    '+Hiển thị sẽ đổi gì và ai bị ảnh hưởng','+Diff/payload cụ thể cùng nguồn hỗ trợ','+Tách lý do model đề xuất khỏi dữ kiện đã xác minh','-Chỉ mô tả “thao tác an toàn” để giảm tải thông tin','-Giấu phần rủi ro vì có thể làm reviewer duyệt chậm'], 'Giảm tải nhận thức bằng cấu trúc và evidence, không bằng giấu tác động. Reviewer cần phân biệt suy luận với dữ kiện.');
  M(27,'Alert fatigue và batch approvals','Khi reviewer quá tải, những cách giảm tải nào cần điều kiện?',[
    '+Batch các action có cùng risk và contract phù hợp','+Ưu tiên queue theo tác động/deadline','-Gộp mọi action cùng topic vào một approval chung','+Đo chất lượng quyết định sau đổi UX','-Giảm số alert được coi trực tiếp là tăng safety'], 'Batch và ít alert có thể giảm tải nhưng cũng che risk. Cần giới hạn phạm vi và đo decision quality.');
  M(27,'Audit trail và replay an toàn','Audit cần giữ gì để kiểm được một quyết định?',[
    '+Reviewer identity, thời điểm và action version','+Payload/evidence được trình và quyết định thực','+External result và liên kết request/run','-Append-only đủ chứng minh nội dung log không thể sai','-Replay audit mặc định được phép tạo lại side effect'], 'Tính bất biến lưu trữ không xác nhận dữ kiện log đúng. Replay cần tách tái dựng bằng chứng khỏi thực thi lại hành động.');
  M(27,'Decision metrics và progressive autonomy','Khi tăng mức tự động hóa, cần bằng chứng nào?',[
    '+Chất lượng quyết định theo từng nhóm action/risk','+Override và hậu quả lỗi được audit','+Canary/rollback hoặc thu hồi autonomy phù hợp','-Tỷ lệ approve cao đủ để bỏ review mọi action','-Thời gian chờ giảm đủ chứng minh decision đúng hơn'], 'Approval rate và latency là proxy khác correctness. Autonomy tăng theo evidence của nhóm task, không một chỉ số tổng.');
  M(27,'HITL feedback thành preference data','Trước khi dùng quyết định reviewer làm dữ liệu train, cần gì?',[
    '+Giữ prompt/context và payload đúng version được review','+Phân biệt reject do nội dung với reject do thiếu quyền/thời điểm','+Review consistency và quyền dùng dữ liệu','-Mọi approve được gán chosen tốt về mọi mặt','-Bỏ reviewer reason để nhãn gọn và ít nhiễu'], 'Approval mang ngữ cảnh và mục đích. Nhãn không phân biệt nguyên nhân có thể dạy model ưu tiên sai hoặc bỏ policy.');

  M(28,'Integration seams và contracts','Mỗi module pass unit test nhưng E2E fail. Cần soi gì?',[
    '+Input/output semantics tại các điểm nối','+Timeout, retry và trạng thái lỗi xuyên module','+Version config và quyền qua các boundary','-Đổi model trước khi xem dữ liệu bàn giao','-Unit coverage cao thay test external outcome'], 'Integration lỗi ở chỗ nối dù từng module đúng trong giả định riêng. Cần bằng chứng của luồng thật trước thay model.');
  M(28,'Production checklist có điều kiện','Muốn dùng checklist release, cần xác định những điều kiện nào?',[
    '+Task, user, dữ liệu và phạm vi risk','+SLO, quyền, recovery và owner thực tế','-Áp đủ mọi ngưỡng trên slide để suy ra readiness chung','+Bằng chứng tương ứng mỗi mục cần đạt','-Một demo thành công thay bằng chứng cho từng failure path'], 'Checklist không có ngưỡng phổ quát cho mọi hệ. Cần liên hệ yêu cầu với phép kiểm ở phạm vi cụ thể.');
  M(28,'Bốn chiều benchmark','Để tránh cải thiện một chiều nhưng phá sản phẩm, cần báo gì?',[
    '+Task quality/outcome theo bộ case','+Latency và cost trong cùng điều kiện','+Safety/reliability cùng ràng buộc liên quan','-Chỉ điểm quality tốt nhất sau nhiều lần chọn run','-Token thấp hơn được xem là thắng dù outcome giảm dưới gate'], 'Benchmark cần các chiều và gate cùng nhau. Chọn best run hoặc tối ưu một chỉ số có thể che đánh đổi không chấp nhận được.');
  M(28,'Outcome trajectory và pass metrics','Khi báo độ ổn định của agent, cần phân biệt gì?',[
    '+Ít nhất một lần thành công khác mọi lần đều thành công','+Outcome đúng khác trajectory hợp quyền','+Số attempts và cách lấy mẫu phải công khai','-Tính p^k như kết quả thực mà không xét giả định độc lập','-Dùng best-of-k thay first-pass mà giữ nguyên tên metric'], 'Các metric trả lời các câu hỏi khác nhau. Công thức xác suất có điều kiện giả định, không thay số đo độ ổn định thực.');
  M(28,'ADRs runbook và API specs','Tài liệu nào giúp người khác vận hành hệ thay owner?',[
    '+ADR ghi quyết định, giả định và trade-off','+Runbook có dấu hiệu lỗi, owner và bước recovery','+API spec gồm lỗi và state transitions quan trọng','-Ảnh demo thành công thay hướng dẫn failure handling','-Danh sách thư viện thay lý do chọn kiến trúc'], 'Tài liệu vận hành cần quyết định và hành động tái hiện được, không chỉ liệt kê thành phần hoặc ảnh minh họa.');
  M(28,'Peer review và artifact proof','Để xác nhận claim “đã tích hợp live”, reviewer cần gì?',[
    '+Cấu hình/môi trường và version artifact','+Trace/request liên kết provider/tool result thật','+External state theo business case','-Báo cáo mẫu có điểm đạt thay actual run','-Mock response có schema đúng thay bằng chứng provider live'], 'Mock và report mẫu kiểm các lớp hẹp hơn integration live. Evidence phải gắn đúng môi trường, request và tác động.');
  M(28,'Release bundle và ownership','Một release có thể bàn giao cần những gì?',[
    '+Artifact/config có version và cách chạy','+Eval evidence cùng giới hạn đã biết','+Owner, monitoring, runbook và rollback theo scope','+Quyền/license và data policy phù hợp','-Chỉ source commit vì từ code suy ra được runtime config'], 'Source không chứa đầy đủ runtime state/config và trách nhiệm vận hành. Bundle cần các bằng chứng và owner cụ thể.');
  M(28,'Canary shadow và rollback','Muốn giảm rủi ro khi đưa model/pipeline mới lên, cần gì?',[
    '+Shadow không tạo side effect thật ngoài phạm vi cho phép','+Canary có tỷ lệ traffic, gate và owner','+Rollback cả artifact/config cần thiết','-Shadow success đủ bỏ kiểm khác biệt giữa traffic sao và traffic thật','-Chỉ rollback model dù lỗi phát sinh từ index/config mới'], 'Canary/shadow là thí nghiệm có điều kiện. Rollback phải nhắm đúng các thành phần của release gây lỗi.');
  M(28,'E2E action verification','Bot báo thành công nhưng hệ đích chưa có dữ liệu. Cần sửa gì?',[
    '+Chỉ báo hoàn tất sau xác nhận business result hợp lệ','+Trace lời gọi tới trạng thái ở hệ đích','+Test mất response, retry và idempotency','-Dùng transcript khẳng định thành công làm source of truth','-HTTP success của gateway thay trạng thái commit hệ đích'], 'Lời nói và transport không đủ xác nhận business commit. Phải nối request với external evidence và các failure modes.');
  M(28,'Voice turn-taking và barge-in','Khi user ngắt lời, cần phối hợp những thành phần nào?',[
    '+Phát hiện speech/endpointing theo UX và noise thực','+Dừng audio phát và xử lý buffer phù hợp','+Cập nhật state task theo nội dung user mới','-Chỉ giảm tốc độ TTS để coi đã hỗ trợ interruption','-Hủy mọi backend action đang chạy mà không xét trạng thái commit'], 'Barge-in là phối hợp audio và state, không chỉ TTS speed. Action đã commit cần được xử lý theo semantics riêng.');
  M(28,'Voice capacity và call cost','Để dự toán hệ voice, cần phân biệt những biến nào?',[
    '+CPS đo tốc độ khởi tạo cuộc gọi','+Concurrency phụ thuộc arrival rate và thời gian giữ cuộc gọi','+Call legs/channels ảnh hưởng tài nguyên và cost','-CPS bằng số cuộc gọi đang có AI tại một thời điểm','-Giá mỗi phút AI là toàn bộ chi phí cuộc gọi'], 'Arrival rate, số cuộc đồng thời và call legs là các đại lượng khác. TCO còn có telephony, audio và vận hành.');
  M(28,'Voice inbound outbound và meeting','Khi tái dùng một pipeline voice cho nhiều tình huống, cần gì?',[
    '+Policy consent/quyền theo loại cuộc gọi','+State flow và failure handling riêng theo task','+Diarization/evidence khi cần gán lời trong meeting','-Dùng cùng transcript parser đủ bảo đảm cùng workflow','-Có recording được coi là mọi participant đã consent'], 'Audio input giống dạng không làm các quyền và semantics giống nhau. Gán lời và consent cần bằng chứng riêng.');
  M(28,'Real-world system bốn luồng','Muốn biết model demo có thành hệ vận hành được không, cần kiểm gì?',[
    '+Đường dữ liệu vào và độ trễ/chất lượng của sensor','+Đường quyết định và control/safety','+Feedback được chuyển thành case cải tiến có gate','-Chỉ model accuracy trên tập ảnh tĩnh','-Có dashboard/logging đủ xác nhận vòng học đã đóng'], 'Hệ thực có data, decision, safety/control và feedback. Logging chưa chứng minh lỗi đã được xử lý thành cải tiến có kiểm định.');
  M(28,'ADAS ODD và safety envelope','Khi điều kiện ngoài phạm vi đã kiểm, hệ cần dựa vào gì?',[
    '+ODD xác định điều kiện vận hành được hỗ trợ','+Safety envelope và fallback theo thiết kế đã kiểm','-Model confidence cao cho phép mở rộng ODD tại runtime','+Test sensor/điều kiện biên phù hợp risk','-Benchmark perception tốt đủ xác nhận closed-loop safety'], 'Confidence và perception score không mở rộng phạm vi vận hành an toàn. Closed-loop cần kiểm hệ và fallback theo ODD.');
  M(28,'Delivery robot và remote assistance','Muốn kiểm hiệu quả fleet ngoài một demo tuyến ngắn, cần gì?',[
    '+Tỷ lệ can thiệp và thời gian remote assistance','+Recovery, network và edge cases trên tuyến đại diện','+Cost mỗi nhiệm vụ cùng utilization và downtime','-Một chuyến thành công đủ ngoại suy số operator cho cả fleet','-Average speed thay metric hoàn thành đúng nhiệm vụ'], 'Fleet economics và reliability phụ thuộc phân bố nhiệm vụ/can thiệp. Tốc độ trung bình hoặc một tuyến không đủ đại diện.');
  M(28,'CCTV event-first và privacy','Muốn giảm cost video mà giữ mục tiêu giám sát, nên kiểm gì?',[
    '+Event detection có giữ recall của sự kiện quan trọng','+Edge processing và bandwidth theo workload','+Policy truy cập/retention của clip nhạy cảm','-Chỉ lưu metadata nên không cần đánh giá privacy nữa','-Giảm số clip phát sinh đủ chứng minh detector tốt hơn'], 'Event-first giảm tải nhưng có nguy cơ bỏ sót. Metadata vẫn có thể nhạy cảm; ít clip không đồng nghĩa đúng sự kiện.');
  M(28,'Video semantic search','Tìm đúng clip cần gắn những thành phần nào?',[
    '+Biểu diễn nội dung cùng timestamp/segment boundaries','+Evidence và quyền truy cập clip gốc','+Eval theo truy vấn sự kiện thực','-Semantic similarity cao đủ xác nhận đúng người/hành động','-Caption một frame thay evidence của toàn diễn biến'], 'Query video cần thời gian, phạm vi và bằng chứng diễn biến. Một frame hoặc similarity không xác nhận toàn sự kiện.');
  M(28,'Humanoid slow reasoning fast control','Vì sao và bằng cách nào cần tách hai vòng?',[
    '+Control nhanh có deadline và safety khác planning','+Planner bị giới hạn action/interface tới controller','+Có fallback khi reasoning chậm hoặc không chắc','-Đưa raw motor commands từ LLM qua trực tiếp để giảm latency','-Plan hợp ngôn ngữ đủ xác nhận khả thi vật lý'], 'Plan ngôn ngữ không bảo đảm feasibility hoặc đáp ứng deadline điều khiển. Cần interface và safety/control độc lập phù hợp hệ.');
  M(28,'Robotics data và sim-to-real','Khi policy tốt trong simulation nhưng kém ngoài đời, cần kiểm gì?',[
    '+Khác biệt sensor, dynamics và phân bố trạng thái','+Điều kiện an toàn trước field tests','+Data/feedback thực có provenance để tạo hard cases','-Tăng số episode cùng simulator đủ chứng minh gap đã biến mất','-Chỉ metric reward trong sim để chọn model deploy'], 'Sampling thêm cùng giả định sim không tự sửa domain gap. Field evidence cần được thu trong phạm vi an toàn và dùng kiểm định lại.');
  M(28,'GeoAI preprocessing và temporal baseline','Hai ảnh khác màu chưa đủ kết luận thay đổi. Cần kiểm gì?',[
    '+Alignment, sensor và resolution tương thích','+Mùa, mây, góc chụp và điều kiện đo','+Temporal baseline và nguồn đối chiếu','-Tăng contrast ảnh trước khi so là đủ loại mọi khác biệt đo','-Model giải thích tự tin được coi là evidence của sự kiện'], 'Khác biệt pixel có thể đến từ đo đạc. Cần loại các confounders và giữ uncertainty của kết luận.');
  M(28,'GeoAI tasking và uncertainty','Khi vùng quan trọng bị mây che, những tuyến xử lý nào có cơ sở?',[
    '+Đánh dấu thiếu quan sát và độ bất định','+Chọn lần chụp/sensor bổ sung phù hợp task','+Escalate analyst theo risk và evidence','-Nội suy vùng thiếu rồi báo như quan sát trực tiếp','-Giữ kết luận mạnh vì phần ảnh còn lại có resolution cao'], 'Độ phân giải phần quan sát được không bù dữ liệu thiếu ở vùng cần xét. Nội suy phải được phân biệt với đo trực tiếp.');
  M(28,'Risk-based validation và data flywheel','Muốn biến lỗi thực thành cải thiện bền, cần các bước nào?',[
    '+Chọn và review case theo tác động/risk','+Gắn nhãn, nguồn và điều kiện lỗi','+Đưa vào regression rồi kiểm bản sửa trước rollout','+Dùng simulation/HIL/field test theo vai trò phù hợp','-Chỉ tích lũy log rồi coi data flywheel đã vận hành'], 'Dữ liệu cần được chuyển thành nhãn, kiểm định và thay đổi được đo. Thu log là điều kiện đầu vào, không phải toàn vòng cải tiến.');

  M(1,'Agent','Để chuyển prototype sang xử lý yêu cầu thật, cần thêm những gì?',[
    '+Tool đọc trạng thái đơn theo identity được xác thực','+Rule quyền/approval trước hành động hoàn tiền','-Đưa lịch sử đơn vào prompt rồi cho model tự xác nhận đã hoàn tiền','+Observation kết quả nghiệp vụ trước báo hoàn tất','-Dùng JSON output làm bằng chứng tiền đã được chuyển'], 'Output có cấu trúc chỉ biểu diễn đề xuất. Đọc dữ liệu, quyền action và xác nhận hệ đích là các lớp cần được triển khai riêng.');
  M(1,'AI taxonomy','Trước khi chọn chatbot cho phân loại spam, nên kiểm điều gì?',[
    '+Baseline classifier/rule với nhãn và chi phí lỗi','+Cách đánh giá false positive/false negative theo task','-Có thể sinh lời giải thích nghĩa là giải pháp phải dùng generative model','+LLM có thể phân loại nhưng cần so với giải pháp đơn giản','-Task dùng ngôn ngữ tự nhiên nên không thuộc supervised classification'], 'Loại dữ liệu không tự quyết định loại model. LLM có thể làm classifier nhưng cần chứng minh lợi ích theo task.');
  M(1,'Transformer','Những giải thích nào sửa đúng hiểu nhầm về attention?',[
    '+Attention kết hợp thông tin từ các vị trí được phép nhìn','-Attention tự lấy dữ liệu mới ngoài context nếu query liên quan','+Muốn tin mới cần một đường cấp nguồn hoặc tool riêng','+Positional information giúp biểu diễn thứ tự','-Tăng số attention heads được coi như tăng số nguồn Internet tra được'], 'Attention vận hành trên biểu diễn/context được cấp, không là network retrieval. Thêm heads không tạo nguồn cập nhật.');
  M(1,'Token & context','Muốn giữ điều khoản đầu phiên trong chat dài, cần làm gì?',[
    '+Đo token sau tokenizer thực thay chỉ đếm từ','+Giữ constraints ở lớp ưu tiên qua trim/summary','-Giữ K turn mới nhất đủ bảo đảm điều khoản đầu phiên còn được dùng','+Retrieve lại nguồn khi task cần chi tiết bị nén','-Tăng max output tokens để mở lại input đã bị loại'], 'Output budget không khôi phục input mất. Chính sách context cần giữ constraints và đường lấy lại evidence.');
  M(1,'Training & giới hạn','Model nói chắc về policy mới đổi. Những bước nào có bằng chứng hơn?',[
    '+Tra nguồn hiện hành và kiểm ngày hiệu lực','-Giảm temperature đủ để model cập nhật policy','+Cấp evidence mới qua context/tool rồi kiểm claim','+Nêu thiếu dữ liệu nếu không xác minh được','-Dùng self-consistency của nhiều lần hỏi làm thay nguồn'], 'Sampling thay đổi cách sinh, không cập nhật dữ kiện. Cùng một model có thể lặp ổn định policy cũ.');
  M(1,'API & chi phí','Số user giữ nguyên nhưng bill tăng. Cần tách những biến nào?',[
    '+Số request và retry/worker calls mỗi task','+Input/output tokens và model/đơn giá tương ứng','+Phân bố context length và output length','-Số user bằng nhau đủ để loại thay đổi traffic/cost','-Chỉ theo dõi output vì history đã tồn tại từ lượt trước'], 'History được gửi lại có thể tính input; số user không quyết định số call hay token. Cần usage theo task/run.');
  M(1,'Vibe coding','Patch do AI tạo nói đã pass test. Những bước nào đủ hỗ trợ quyết định merge?',[
    '+Đọc diff đúng phạm vi yêu cầu','+Chạy phép kiểm phù hợp và xem actual outputs','+Kiểm cả lỗi/ràng buộc quan trọng không chỉ happy path','-Lời AI xác nhận test được xem tương đương log chạy test','-Patch lớn hơn được coi đã xử lý nhiều edge cases hơn'], 'Kích thước diff và lời tự báo không chứng minh coverage. Người phát triển cần evidence thực của code và kiểm tra.');

  M(2,'Metric & gate','Để quyết định đầu tư tiếp sau demo, nên đặt gì?',[
    '+Baseline và outcome theo task thật','+Gate về lỗi nghiêm trọng/cost bên cạnh giá trị','-Tỷ lệ người thích demo làm thay tỷ lệ giải quyết đúng','+Cách lấy mẫu và thời điểm đo được chốt trước','-Chọn metric sau khi xem loại điểm nào tăng nhiều nhất'], 'Demo sentiment là tín hiệu discovery, không là outcome. Chọn metric sau khi xem điểm làm tăng thiên lệch xác nhận.');
  M(2,'Problem statement','Những thành phần nào làm PRD đo được hơn?',[
    '+User, công việc và pain point cụ thể','+Outcome cùng baseline và phạm vi dữ liệu','+Ràng buộc, metric và điều kiện go/no-go','-Tên framework cùng số agent thay định nghĩa hành vi','-Mục tiêu tăng số lượt chat thay kết quả công việc'], 'Problem statement nối nhu cầu tới phép đo. Technology và engagement không tự xác định giá trị cần đạt.');
  M(2,'Discovery','Trước khi xây chatbot theo yêu cầu sếp, nên thu bằng chứng nào?',[
    '+Quan sát workflow và thời gian/lỗi hiện tại','+Phỏng vấn user về công việc và điểm vướng','-Hỏi user muốn dùng model nào thay khảo sát task','+Xác định nhóm task lặp lại có dữ liệu kiểm được','-Chọn chức năng giống sản phẩm nổi tiếng để chứng minh nhu cầu'], 'Discovery kiểm vấn đề và bối cảnh. Ưa một model hoặc sao chép tính năng chưa chứng minh task có giá trị.');
  M(2,'Discovery','Bằng chứng nào giúp phân biệt lời khen demo với nhu cầu sử dụng?',[
    '+User hoàn thành task đại diện và quay lại dùng','+So thời gian/effort thực với cách hiện tại','-Tổng lượt mở trang đầu được coi như retention','+Phỏng vấn lý do bỏ qua hoặc quay về cách cũ','-Điểm thích giao diện đủ xác nhận AI đã giải pain'], 'Thử một lần và thích UI không tương đương sử dụng bền. Cần hành vi hoàn thành việc và effort thực.', 'Nhân viên khen demo trợ lý nhưng sau một tuần vẫn nhập tay vào bảng cũ.');
  M(2,'Mức giải pháp','Trước khi cho agent gửi email, những phương án kiểm soát nào có cơ sở?',[
    '+Bắt đầu ở mức tạo bản nháp để kiểm chất lượng','+Gate đúng payload trước bước gửi theo risk','-Chọn model lớn hơn để thay quy trình approval','+So workflow xác định với agent ở phần cần tự quyết','-Quyền đọc CRM được coi đã bao gồm quyền gửi nội dung ra ngoài'], 'Capability và risk tăng khi có external action. Model mạnh và read access không thay consent/quyền gửi.');
  M(2,'Problem statement','Để biến mục tiêu mơ hồ thành phép thử nhỏ, cần xác định gì?',[
    '+Một nhóm user và task ưu tiên','+Dữ liệu/quyền cần thiết cho task đó','+Một outcome kiểm được so baseline','-Danh sách mọi use case rồi chờ build xong mới chọn metric','-Tổng số tích hợp làm metric năng suất chính'], 'Giới hạn task giúp đo giả thuyết. Nhiều integration chưa đồng nghĩa user làm việc hiệu quả hơn.', 'Một dự án “nâng năng suất” có mười use case nhưng chỉ đủ hai tuần để thử giá trị.');
  M(2,'Metric & gate','Nếu giải pháp nhanh hơn nhưng tăng lỗi xử lý nghiêm trọng, nên xét gì?',[
    '+Gate risk có bị vi phạm không','+Effort sửa lỗi/review trong metric thời gian thực','-Tính time saved trước review để giữ cùng định nghĩa ban đầu dù che lỗi','+Phân nhóm task để cân nhắc thu hẹp scope','-Điểm trung bình cao cho phép bù mọi lỗi nghiêm trọng'], 'Ràng buộc risk không tự được bù bằng tốc độ. Cần tính effort downstream và xem phạm vi nào thật sự đạt.', 'Pilot giảm thời gian sinh phản hồi nhưng tăng số đơn xử lý sai phải làm lại.');
  M(2,'AI fit','Những phân tích nào giúp chọn giải pháp cho form có quy tắc rõ?',[
    '+Rule/workflow là baseline hợp lý cho các bước xác định','+Tách phần ngôn ngữ mơ hồ nếu có ra khỏi validation','-Thay rule bằng agent để giảm công viết acceptance tests','+So failure cost, maintainability và effort thật','-Có mười field nghĩa là task đủ phức tạp để cần model'], 'Số trường không đo tính bất định. Quy tắc rõ thường kiểm được bằng code; AI cần có lợi ích cụ thể ở phần nó phù hợp.');

  M(3,'Agentic fit','Những lý do nào ủng hộ giữ xử lý xác định cho chuyển ngày sang ISO?',[
    '+Có grammar/rule có thể kiểm được','+Có thể test case mơ hồ và yêu cầu clarify','-Input là text nên bắt buộc cần reasoning loop','+Rule tránh thêm latency/cost nếu không có lợi ích AI','-Task có nhiều định dạng nghĩa cần nhiều agent song song'], 'Độ đa dạng format không tự tạo nhu cầu agent. Rule/parser và clarification có thể giải quyết trong contract rõ.');
  M(3,'ReAct','Khi agent tìm lại cùng query dù đã có kết quả, cần kiểm gì?',[
    '+Observation có được nạp đúng cho bước sau','+Điều kiện đủ evidence và stopping rule','-Tăng số lần tìm để tạo thêm dữ kiện độc lập từ cùng kết quả','+Fingerprint lặp và budget','-Xóa kết quả cũ để model bớt bị ảnh hưởng'], 'Lặp cùng observation không tạo tiến triển. Cần đường feedback và tiêu chí dừng thay che dữ liệu cũ.');
  M(3,'Agent loop','Để tool timeout không làm loop chạy quá lâu, cần gì?',[
    '+Deadline tổng và giới hạn số step/call','+Phân loại lỗi có thể retry và lỗi cần dừng','+Trả observation lỗi có cấu trúc','-Reset deadline mỗi khi agent tự lập kế hoạch mới','-Tăng timeout mỗi lần retry mà không trần tổng'], 'Budget phải xuyên qua replanning/retry. Mỗi bước có giới hạn riêng không tự giữ được latency toàn task.');
  M(3,'Debug & so sánh','Agent hay hơn nhưng tốn gấp mười. Phép so nào cần bổ sung?',[
    '+Cùng bộ task/nhãn và cách chọn output','+Quality theo cost/latency budget','+Failure cases và tỷ lệ hoàn thành task','-Giữ demo tốt nhất của mỗi hệ thay tập đánh giá','-Độ dài lời giải thích làm proxy chất lượng'], 'Cần đánh đổi và đại diện, không chỉ hai demo đẹp. Lời văn dài không đo task success.');
  M(3,'Kiến trúc agent','Để sửa việc agent quên tool result, cần kiểm gì?',[
    '+Result có gắn đúng tool call ID','+State/context có giữ observation cho lần quyết định tiếp','-Thêm một worker mới để model có thêm ý kiến','+Truncation/summary có làm mất kết quả cần thiết','-Cho tool result vào log là đủ dù model không được cấp lại'], 'Log quan sát cho developer và context cho agent là hai đường khác nhau. Thêm agent không sửa đường trả observation bị thiếu.');

  M(4,'Prompt structure','Để tránh model coi nội dung khách là chỉ dẫn, nên làm gì?',[
    '+Tách instruction khỏi dữ liệu có nhãn/ranh giới rõ','+Nêu output và constraints có thể kiểm','-Đưa nội dung khách lên đầu system message để ưu tiên đọc','+Kiểm nội dung độc trong test cases','-Tăng độ dài instruction như thay thế hoàn toàn authority boundary'], 'Cấu trúc giúp nhận diện vai trò nhưng cần boundary và tests. Đưa dữ liệu lên system có thể nâng quyền sai.');
  M(4,'Prompt techniques','Muốn JSON ổn định hơn mà không nhầm format với correctness, cần gì?',[
    '+Schema/output mode phù hợp API đang dùng','+Ví dụ đại diện cả biên/lỗi nếu dùng few-shot','+Validate cấu trúc và giá trị nghiệp vụ','-JSON parse được thì không cần kiểm dữ kiện bên trong','-Retry cùng prompt tới khi parse được rồi bỏ log các lần lỗi'], 'Formatting và nội dung đúng là hai tiêu chí. Retry cần budget và evidence, không chọn lọc chỉ lần thành công.');
  M(4,'System & context','Những ranh giới nào ngăn web retrieved ra lệnh tiết lộ instruction?',[
    '+Nguồn retrieved giữ vai trò dữ liệu không có quyền đổi policy','+Hạn chế dữ liệu/tool mà request được truy cập','-Domain có uy tín được phép ghi đè system policy','+Test indirect injection và output leakage theo scope','-Nén trang web thành summary rồi coi nội dung đã sạch instruction'], 'Nguồn hoặc summary có thể vẫn mang chỉ thị độc. Tóm tắt không tự thay trust boundary.');
  M(4,'Tool contract','Muốn giảm nhầm ngày/số khách khi đặt vé, cần kiểm gì?',[
    '+Schema rõ kiểu, miền giá trị và ý nghĩa field','+Clarify input mơ hồ trước action nhạy cảm','+Business validation ngày/số lượng trước execution','-Tên tham số rõ đủ thay validation vì model đã chọn đúng tool','-Đổi mọi field thành string để model linh hoạt hơn'], 'Schema tốt hỗ trợ đề xuất nhưng chưa xác nhận giá trị. String linh hoạt có thể làm mất những ràng buộc cần kiểm.');
  M(4,'Tool execution','Hai tool cập nhật cùng tồn kho. Những control nào phù hợp?',[
    '+Xác định dependency và serialization/transaction cần thiết','+Kiểm version hoặc cơ chế cạnh tranh theo DB contract','-Chạy song song vì hai tool có tên khác nhau','+Idempotency cho retry thao tác ghi','-Giao thứ tự cho model diễn giải sau khi cả hai đã commit'], 'Tên tool khác không bảo đảm độc lập state. Cần cưỡng chế concurrency/transaction trước khi tác động xảy ra.');
  M(4,'Reliability & security','Muốn retry email mà không gửi trùng, cần gì?',[
    '+Một action ID/idempotency key ổn định theo lần gửi logic','+Đối chiếu trạng thái đã gửi khi response bị mất','-Tạo ID mới mỗi retry để tránh xung đột request','+Budget retry và lỗi phục hồi được','-Coi timeout là bằng chứng chắc rằng email chưa rời hệ'], 'Timeout có thể xảy ra sau commit. Retry với ID mới có thể tạo một hành động gửi độc lập.');
  M(4,'LangGraph','Tool bị từ chối nhưng graph cứ gọi lại model. Cần kiểm gì?',[
    '+Edge xử lý denied/error và điều kiện kết thúc','+State chứa lý do từ chối và budget còn lại','-Cứ denial thì route về node model như retry transient','+Case test dừng/escalate khi không đủ quyền','-Tăng recursion limit để agent có cơ hội xin đúng tham số'], 'Denied do quyền khác lỗi tạm thời. Tăng vòng lặp chưa thay đổi quyền và có thể khiến lỗi kéo dài.');
  M(4,'Reliability & security','Nếu tool đọc và ghi dùng chung credential rộng, nên sửa thiết kế nào?',[
    '+Tách scope theo action cần thiết','+Kiểm identity và authorization tại executor','-Ẩn tên write tools trong prompt là đủ khi endpoint vẫn gọi được','+Audit denied calls và side effects','-Cho model lớn quyền rộng hơn vì ít hiểu nhầm hơn'], 'Ẩn khả năng trong prompt không thay quyền endpoint. Quyền phải theo task và được cưỡng chế, không theo độ mạnh model.', 'Một tool tìm đơn và tool hủy đơn dùng cùng quyền quản trị; chỉ danh sách tool trong prompt khác nhau.');

  M(5,'Responsible AI','Khi kết quả chênh giữa các nhóm, cần bằng chứng nào trước kết luận?',[
    '+Chất lượng và tính đại diện của dữ liệu theo nhóm','+Metric và cost of error theo bối cảnh sử dụng','-Điểm trung bình toàn hệ đủ xác nhận fairness','+Review nguyên nhân cùng tuyến sửa/kháng nghị','-Gán chênh lệch cho năng lực nhóm mà không kiểm dữ liệu/quy trình'], 'Chênh lệch cần phân tích có dữ liệu và bối cảnh. Điểm trung bình hoặc suy đoán về nhóm không giải thích nguyên nhân.');
  M(5,'Requirements','Muốn “chính xác và nhanh” thành acceptance criteria, cần gì?',[
    '+Task, phạm vi và dữ liệu cần xử lý','+Phép đo quality/latency với bộ case rõ','+Fallback/escalation khi thiếu bằng chứng hoặc lỗi','-Chọn một latency target chung cho mọi loại action mà không xét task','-Dùng ý kiến người viết PRD làm phép kiểm cuối'], 'Tiêu chí phải kiểm lại được bởi người khác và phù hợp task/risk. Cảm nhận hoặc ngưỡng không bối cảnh còn mơ hồ.');
  M(5,'Product value','User quay về Excel. Những giả thuyết nào đáng kiểm?',[
    '+AI tăng effort review hoặc không khớp workflow','+Giá trị task thực chưa vượt baseline hiện tại','-User chưa thích công nghệ mới nên chưa cần đo task success','+Thiếu tích hợp/độ tin cậy/khả năng sửa kết quả','-Tăng số lượt mở chatbot được coi trực tiếp là tăng giá trị'], 'Adoption là kết quả của nhiều điều kiện. Cần quan sát task/effort, không quy nguyên nhân cho thái độ user khi chưa có bằng chứng.');
  M(5,'User research','User thích AI nhưng muốn tự duyệt trước gửi. Requirement nào cần được làm rõ?',[
    '+Mức kiểm soát và hậu quả lỗi họ chấp nhận','+Những action cần draft/approval thay tự gửi','+Thông tin cần có để họ review hiệu quả','-Lời khen AI được coi là consent cho quyền gửi','-Autonomy cao hơn được xem là UX tốt hơn mặc định'], 'Thích hỗ trợ không đồng nghĩa muốn giao mọi action. Quyền và UX cần phản ánh mức kiểm soát mong muốn.');
  M(5,'Requirements','Nếu yêu cầu đổi theo domain/risk, nên quản lý thế nào?',[
    '+Tách requirement bắt buộc với giả định đang thử','+Version acceptance criteria và liên kết tới task','+Ghi owner quyết định và cách kiểm','-Giữ câu mô tả mơ hồ để tránh phải cập nhật tests','-Cho model tự suy ra policy lúc chạy thay đặc tả'], 'Linh hoạt không đồng nghĩa bỏ contract. Cần biết điều đã chốt và điều còn là giả thuyết để cập nhật có kiểm.', 'Hai nhóm dùng cùng trợ lý nhưng một nhóm chỉ tạo draft, nhóm kia có quyền ghi dữ liệu khách hàng.');
  M(5,'PRD & metrics','Benchmark tăng nhưng CSAT giảm. Nên điều tra gì?',[
    '+Task/domain của benchmark có khớp sản phẩm','+Latency, lỗi và effort review trong trải nghiệm thật','+Các nhóm user/task bị regression','-Dùng benchmark thay CSAT vì ít nhiễu hơn','-Tăng số tính năng AI trước khi xem pain của user'], 'Metric kỹ thuật và giá trị user có thể lệch. Cần xem outcome và workflow, không chọn chỉ số thuận lợi để bỏ tín hiệu xấu.');
  M(5,'Risk','Để risk review không dồn về trước launch, cần gì?',[
    '+Xác định risk cùng requirements và data scope','+Gán owner và control có phép kiểm','+Đưa case risk vào acceptance/eval sớm','-Giữ risk ở một checklist cuối sprint thay task có evidence','-Chỉ xét likelihood, không xét mức thiệt hại'], 'Risk có cả xác suất và tác động, cần ảnh hưởng thiết kế sớm. Checklist cuối không thay control đã được triển khai/kiểm.');

  M(6,'Agile & DoD','Ticket đóng hết nhưng task thật fail. DoD cần những thành phần nào?',[
    '+Outcome kiểm được trên case đại diện','+Evidence tests/eval thực chạy','+Failure/fallback và ownership theo scope','-Số story point hoàn thành được coi như task quality','-API trả 200 là điều kiện đủ cho feature AI'], 'Delivery activity không thay outcome. DoD cần phép kiểm chức năng và chất lượng phù hợp, không chỉ vận chuyển code.');
  M(6,'MVE, MVP, PoC','Trước khi xây nền tảng, những quyết định nào giảm đúng bất định?',[
    '+Xác định giả thuyết giá trị có thể làm dự án thất bại','+Dùng MVE để thử giả thuyết với baseline','-PoC kỹ thuật chạy được đủ chứng minh user cần sản phẩm','+Chọn MVP sau khi giá trị cốt lõi có bằng chứng','-Dùng số module xây xong làm metric học được nhu cầu'], 'Khả thi kỹ thuật và nhu cầu sử dụng khác nhau. Phép thử nên trả lời đúng điều chưa biết trước khi đầu tư lớn.');
  M(6,'Experiment','Sau khi đổi ba thành phần cùng lúc và điểm tăng, kết luận nào hợp lệ?',[
    '+Cấu hình kết hợp tốt hơn trong phép so đã chạy','-Thành phần đổi cuối chắc là nguyên nhân cải thiện','+Cần ablation/thiết kế so để tách đóng góp','+Giữ dữ liệu và điều kiện đo rõ','-Điểm tăng đủ để bỏ phân tích regressions'], 'Một phép so nhiều biến chưa cho attribution. Điểm tổng tăng vẫn có thể che nhóm task tệ đi.');
  M(6,'ROI','Muốn tính time saved thực, cần xét những khoản nào?',[
    '+Thời gian user review/sửa output','+Thời gian xử lý lại lỗi downstream','+Chi phí API, hạ tầng và vận hành','-Toàn thời gian model tạo text được tính như thời gian lao động tiết kiệm','-Số phút trả lời nhanh hơn thay được chất lượng công việc'], 'Tốc độ sinh không bằng effort ròng giảm. ROI phải so kết quả đúng sau cả review và chi phí lỗi.');
  M(6,'Stakeholder','Business muốn launch, security chưa chấp nhận. Cần làm gì?',[
    '+Chỉ rõ gate chưa đạt và evidence còn thiếu','+Thỏa thuận scope pilot/controls theo risk với owner','+Báo trade-off và quyết định cần được chịu trách nhiệm','-Dùng deadline business để suy ra security gate được miễn','-Ẩn failure cases để stakeholder không mất tự tin'], 'Trade-off cần được chấp nhận có trách nhiệm với evidence. Deadline hay lựa chọn giấu lỗi không tạo quyền bỏ gate.');

  M(7,'Data strategy','Retrieval đúng nội dung nhưng user không có quyền. Những control nào cần có?',[
    '+Metadata scope/tenant và auth đúng identity','+Lọc/cưỡng chế quyền trước phục vụ context','-Dùng similarity score cao để coi dữ liệu phù hợp user','+Test cross-tenant queries cùng từ khóa','-Nhắc model không tiết lộ thay vì hạn dữ liệu nó nhận'], 'Relevance không cấp quyền. Dữ liệu trái scope không nên vào context rồi mới trông chờ model giữ bí mật.');
  M(7,'Parsing','Bảng giá extract bị lẫn cột. Nên làm gì trước khi index lại?',[
    '+So text/table output với trang nguồn','+Giữ header, đơn vị và liên kết hàng–cột','+Quarantine phần không parse tin cậy','-Tăng overlap chunk để khôi phục relation cột đã mất','-Đổi embedding dimension trước khi kiểm cấu trúc bảng'], 'Chunk/embedding không tự khôi phục cấu trúc parse sai. Cần sửa hoặc review dữ liệu đầu vào trước phát hành.');
  M(7,'Embedding','Đổi model embedding có dimension khác. Cần những bước nào?',[
    '+Tạo/rebuild index với biểu diễn tương thích','+Dùng đúng model/normalization cho query và corpus','+Eval recall/latency trước cutover','-Padding vector cũ bằng số 0 đủ bảo đảm cùng không gian ngữ nghĩa','-So cosine score tuyệt đối giữa hai model để chọn chất lượng'], 'Tương thích dimension chưa đủ tương thích ngữ nghĩa. Đổi embedding model thường cần tái biểu diễn và đo lại.');
  M(7,'Search & ANN','Search nhanh nhưng bỏ sót tài liệu. Cần kiểm gì?',[
    '+Recall theo query có nhãn','+Tham số ANN và trade-off với latency/memory','-Tăng speed target để có thêm tài nguyên cho generation','+Phân biệt lỗi index/search với corpus thiếu','-Chỉ dùng similarity của top-1 làm metric coverage'], 'Tốc độ không đo recall. Top-1 score có thể cao dù nhiều evidence cần thiết bị bỏ sót.');
  M(7,'Hybrid & rerank','Vector bỏ sót mã sản phẩm chính xác. Những cách thử nào nhắm đúng vấn đề?',[
    '+Bổ sung lexical retrieval cho mã/tên riêng','+Fusion/rerank có eval trên nhóm exact-match','-Tăng temperature của generator để đoán mã còn thiếu','+Kiểm tokenization/metadata của mã trong corpus','-Dùng top-k lớn hơn như thay thế mọi tín hiệu từ khóa'], 'Mã định danh cần tín hiệu có thể khác similarity ngữ nghĩa. Generator không nên bù dữ liệu retrieval bằng suy đoán.');
  M(7,'Evaluation & security','Để đánh giá RAG an toàn hơn vector score, cần đo gì?',[
    '+Relevance/coverage của evidence theo task','+Quyền đọc và rò dữ liệu cross-tenant','+Correctness/grounding của answer','-Vector gần nhau nghĩa nội dung có quyền được trả','-Điểm trung bình trên corpus public đủ kiểm private data isolation'], 'An toàn dữ liệu và correctness không suy từ similarity. Bộ eval cần case có quyền và dữ liệu riêng tư phù hợp.');
  M(7,'Evaluation & security','Khi dữ liệu bị xóa hoặc quyền thay đổi, cần kiểm những đường nào?',[
    '+Bản nguồn, index và cache liên quan','+Quyền hiện tại tại lúc phục vụ request','-TTL dài là đủ để quyền cuối cùng tự nhất quán','+Case tái index/replay không hồi sinh bản ghi đã xóa','-Ẩn kết quả ở UI thay việc loại khỏi context model'], 'Xóa/thu hồi cần tác động lên các bản sao và đường đọc/ghi. Ẩn UI không chặn dữ liệu vào model.', 'Một tài liệu đã thu hồi quyền vẫn được trả từ cache và có thể xuất hiện lại sau backfill.');

  M(8,'RAG architecture','Endpoint không lỗi nhưng answer sai. Cần thu bằng chứng từ đâu?',[
    '+Nguồn/chunk và context thật đã cấp model','+Query transform, retrieval và rerank outputs','+Answer claims cùng reference phù hợp','-HTTP 200 đủ để khoanh lỗi chỉ ở kiến thức model','-Chỉ log prompt template mà bỏ nội dung retrieved'], 'Transport không mô tả chất lượng. Cần thấy dữ liệu thực đã đi qua từng tầng, không chỉ template.');
  M(8,'Ingestion & chunking','Policy mới đã upload nhưng answer dùng bản cũ. Cần kiểm gì?',[
    '+Upload, parse, embed và index là những trạng thái riêng','+Version hiệu lực của record/chunk được retrieve','+Cache invalidation và delete/upsert của bản cũ','-Ngày file upload đủ chứng minh mọi query dùng version mới','-Đổi prompt bảo model ưu tiên tài liệu mới thay đồng bộ index'], 'Upload chưa bằng index cập nhật; prompt không thay metadata/version và invalidation.');
  M(8,'Retrieval & rerank','Top-k dư đoạn gần giống nhưng thiếu evidence. Nên làm gì?',[
    '+Xem diversity/relevance trước và sau rerank','+Kiểm evidence có trong candidates hay đã mất sớm','-Tăng output limit để trả đủ mọi đoạn gần nhau','+Thử dedup/fusion/query strategy có eval','-Chọn chunk nhiều từ trùng query nhất làm chuẩn relevance duy nhất'], 'Cần biết lỗi recall hay ranking/context redundancy. Dài answer không lấy lại evidence chưa được cấp.');
  M(8,'Grounding & UX','Không tìm thấy nguồn. Những cách phản hồi nào giữ đúng bằng chứng?',[
    '+Nêu phạm vi biết được và dữ liệu còn thiếu','+Clarify/retrieve thêm trong budget nếu phù hợp','-Dùng kiến thức model để viết citation giống nguồn mong đợi','+Abstain hoặc handoff theo policy','-Giữ giọng chắc chắn để user không lo về search failure'], 'UX rõ ràng không đồng nghĩa giả chắc chắn. Cần tránh citation giả và phân biệt suy đoán với evidence.');
  M(8,'RAG evaluation','Faithfulness cao nhưng answer thiếu điều kiện. Cần phân tích gì?',[
    '+Reference có những thông tin bắt buộc nào','+Context có đủ evidence cho các điều kiện đó','+Answer relevancy/correctness và recall riêng','-Faithfulness cao đủ để coi toàn task đạt','-Chỉ giảm temperature để bù thông tin thiếu trong context'], 'Một answer bám context thiếu vẫn faithful. Cần đo độ phủ và nhu cầu task, không diễn giải metric vượt phạm vi.');
  M(8,'RAG architecture','Khi cải thiện một pipeline, các quyết định nào giúp biết thành phần nào tạo giá trị?',[
    '+So cùng query/nhãn và lưu per-case outputs','+Tách thay đổi ingestion, retriever và generator','-Tổng điểm tăng cho phép bỏ các case từng pass nhưng nay fail','+Báo latency/cost cùng quality','-Chỉ chọn best run của cấu hình mới để so baseline một lần'], 'Cần điều kiện so rõ và regression analysis. Chọn lọc run hay che losses có thể tạo cải thiện giả.', 'Đội thêm reranker và đổi prompt rồi báo điểm tổng tăng, nhưng không biết query nào đổi kết quả.');

  M(9,'LangGraph','Approval cần tiếp tục sau vài giờ. Cần những điều kiện nào?',[
    '+State/checkpoint bền và thread identity rõ','+Quyết định gắn đúng action/payload/version','+Policy TTL/reject/resume và idempotency','-Giữ process ngủ trong RAM được coi như persistence đã đủ','-Approve cùng tên task cho phép áp dụng sang payload đã đổi'], 'Chờ lâu cần state bền và approval đúng phiên bản. Process sống hay tên task không xác định quyết định hợp lệ.');
  M(9,'Agent fit & patterns','Ba agent phản biện cùng việc mãi. Nên điều chỉnh gì?',[
    '+Đặt vai trò/đầu ra và stopping criteria rõ','+So với single-agent cùng task/budget','-Tăng số critic cùng context để đạt đồng thuận nhanh hơn','+Giới hạn vòng và có owner tổng hợp evidence','-Đa số đồng ý được xem như ground truth'], 'Thêm critic có thể tăng overhead/lỗi tương quan. Cần phân rã, trần lặp và phép kiểm độc lập.');
  M(9,'Coordination','Worker xử lý lại task đã xong. Cần contract nào?',[
    '+Task ID, trạng thái và điều kiện hoàn tất','+Idempotency/dedup cho bàn giao hoặc retry','-Thời gian request tới sau đủ xác định đó là task mới','+Ownership và ack/result rõ','-Prompt nhắc “đừng làm trùng” thay state coordination'], 'Request gửi lại có thể là retry cùng task. Cần định danh và state; thời gian đến không đủ phân biệt hành động mới.');
  M(9,'MCP','Tool được discover nhưng user chưa chắc có quyền. Cần kiểm gì?',[
    '+Scope được cấp cho identity hiện tại','+Policy action và quyền dữ liệu tại executor/server','-Registry/tag phù hợp được coi là authorization','+Version/schema và trust của server','-Schema hợp lệ cho phép bỏ business validation'], 'Discovery và schema trả lời có thể gọi thế nào, không trả lời user được phép thực hiện gì.');
  M(9,'A2A','Giao task sang agent khác nhưng chưa nhận kết quả. Cần giữ gì?',[
    '+Task/result IDs và contract trạng thái','+Timeout, retry và cancellation phù hợp','-Gửi task xong được coi như outcome đã hoàn tất','+Quyền chia sẻ context và phạm vi bàn giao','-Gửi toàn memory user để agent nhận có đủ dữ liệu mặc định'], 'Bàn giao chưa bằng hoàn tất. Kết nối giữa agent không tự cấp quyền chia mọi context hoặc loại xử lý lỗi.');
  M(9,'Observability & safety','Chỉ thấy output cuối, nghi worker làm lộ dữ liệu. Cần evidence nào?',[
    '+Trace từng handoff/tool action với correlation IDs','+Dữ liệu nào được đọc và đích gửi trong scope audit','+Policy/identity và version runtime','-Câu trả lời cuối lịch sự đủ loại khả năng leak','-Log toàn secrets để lần sau điều tra dễ hơn'], 'Leak có thể xảy ra trước output cuối. Audit cần dữ liệu tối thiểu phù hợp, không tạo một kho lộ bí mật mới.');
  M(9,'Harness & long tasks','Sau crash cần tiếp tục tác vụ dài. Nên thiết kế gì?',[
    '+Checkpoint/plan bền có trạng thái đã verify','+Artifact ownership và đường replay có idempotency','+Giữ constraints/provenance qua compaction','-Lưu transcript đủ để coi mọi side effect phục hồi đúng','-Bắt đầu task mới rồi reuse approval cũ để tiết kiệm thời gian'], 'Transcript không mô tả đầy đủ commit và side effects. Resume cần state, identity và tính hợp lệ của quyết định.');

  M(10,'ETL/ELT & ingestion','CDC gửi lặp batch. Những control nào ngăn record trùng?',[
    '+Khóa định danh và upsert/idempotency phù hợp','+Watermark/checkpoint có semantics rõ','-Dùng giờ nhận event làm ID mới cho mỗi bản tin','+Test replay và sự kiện đến lệch thứ tự','-Tăng delay ingest để suy ra event lặp sẽ biến mất'], 'Replay và out-of-order cần contract dữ liệu. Delay không tạo dedup; timestamp nhận mới có thể nhân bản cùng event.');
  M(10,'Transform & storage','Chuẩn hóa làm mất đơn vị tiền tệ. Cần sửa và kiểm gì?',[
    '+Giữ giá trị, đơn vị và semantics trong schema','+Test invariants trước/sau transform','-Chỉ kiểm text không rỗng để xác nhận dữ liệu hợp lệ','+Lineage/version để tìm output bị ảnh hưởng','-Chọn đơn vị theo tần suất xuất hiện nhiều nhất thay dữ kiện gốc'], 'Text không rỗng có thể sai nghĩa. Đơn vị cần evidence/contract, không được suy từ đa số khi đã có nguồn.');
  M(10,'Quality & contracts','Nguồn đổi tên field nhưng job vẫn xanh. Cần gì?',[
    '+Schema/semantic contract checks tại boundary','+Alert và owner cho thay đổi không tương thích','+Quarantine/fail theo mức bắt buộc của field','-Fill mọi field thiếu bằng null rồi coi chất lượng không đổi','-Exit code job thay metric completeness'], 'Chạy xong không có nghĩa dữ liệu đúng. Null fallback chỉ hợp nếu contract cho phép và vẫn phải đo ảnh hưởng.');
  M(10,'Data observability','Index ít tài liệu bất thường dù không exception. Cần tín hiệu nào?',[
    '+Volume và freshness theo nguồn/window','+Schema/distribution và lỗi quality','+Lineage từ nguồn tới consumer','-Chỉ theo dõi CPU/memory vì job không ném lỗi','-Record count thấp hơn được coi là dedup hoạt động tốt'], 'Data incident có thể im lặng về hạ tầng. Cần baseline/lineage để phân biệt giảm đúng do dedup với mất dữ liệu.');
  M(10,'Lineage & incident','Một nguồn tạo nhiều answer sai. Cần khoanh vùng và sửa thế nào?',[
    '+Truy source/version tới chunks và downstream consumers','+Xác định thời điểm/phiên bản bắt đầu lỗi','+Backfill/invalidate có phạm vi và quality gate','-Chỉ sửa answer đã bị báo để không ảnh hưởng dữ liệu còn lại','-Rebuild toàn corpus trước khi biết semantics replay và quyền'], 'Lineage giúp xác định phạm vi. Sửa từng output có thể bỏ căn nguyên, rebuild mù có thể tăng cost và tái phát tán lỗi.');
  M(10,'Orchestration & cost','Backfill hết quota embedding. Cần những giới hạn nào?',[
    '+Budget/concurrency và ưu tiên traffic online','+Chunk/record IDs để retry không tạo trùng','+Checkpoint và resume theo phiên bản backfill','-Chạy hết lịch sử song song vì quota sẽ được reset sau','-Chỉ giảm log volume như cách xử lý provider throttling'], 'Backfill cần admission/budget, không trông chờ quota reset. Logging không giải số call vượt hạn mức.');

  M(11,'Risk & alignment','Agent tăng số ticket đóng nhưng việc chưa giải quyết. Những chẩn đoán/xử lý nào có cơ sở?',[
    '+Proxy đo hoạt động có thể lệch outcome người dùng','+Đo giải quyết đúng và reopen/review effort','-Đổi dashboard rồi giữ nguyên reward để sửa động cơ tối ưu','+Review rubric và các hành vi được thưởng','-Tăng autonomy vì measured target đang cải thiện'], 'Điểm proxy tăng có thể đi cùng outcome xấu. Sửa hiển thị hay nâng quyền không sửa mục tiêu tối ưu lệch.');
  M(11,'Attack vectors','Email yêu cầu gửi dữ liệu khách ra URL khác. Cần ranh giới nào?',[
    '+Email giữ vai trò dữ liệu không có quyền đổi policy','+Giới hạn quyền đọc và network destinations của tool','+Gate hành động gửi dữ liệu theo scope/risk','-Người gửi email hợp lệ được coi có quyền cấp mọi instruction','-Tóm tắt email trước execution đủ để loại đường injection'], 'Nguồn hợp lệ vẫn có thể chứa lệnh vượt scope. Summary không tự vô hiệu instruction hoặc cấp quyền truyền dữ liệu.');
  M(11,'Guardrail layers','Keyword filter bị vượt bằng paraphrase. Nên làm gì?',[
    '+Kiểm hành vi và tham số nghiệp vụ tại executor','+Test nhiều cách diễn đạt cho cùng action bị cấm','+Giữ output/input checks theo vai trò bổ sung','-Chỉ thêm từ khóa mới rồi coi boundary đã vững','-Tăng refusal score thay authorization của tool'], 'Từ ngữ có thể đổi nhưng action semantics không đổi. Runtime authorization bảo vệ hành động, không chỉ biểu hiện trong text.');
  M(11,'Tool safety','Để lệnh xóa không vượt workspace, cần gì?',[
    '+Xác minh đường dẫn tuyệt đối sau resolve','+Giới hạn scope và quyền tool theo task','+Approval đúng payload khi policy/risk yêu cầu','-Cho chạy vì tên tool chứa chữ safe','-Chỉ kiểm đường dẫn text bắt đầu bằng tên folder trước normalization'], 'Tên tool và prefix chuỗi không thay kiểm đường dẫn thực. Resolve/normalization và boundary quyền phải diễn ra trước tác động.');
  M(11,'Red teaming','Một jailbreak bị chặn. Nên kết luận và làm gì tiếp?',[
    '+Chỉ có bằng chứng cho case và cấu hình đã thử','+Thử biến thể/multi-turn theo threat model','+Giữ cặp request hợp lệ để đo over-blocking','-Cùng loại attack nên một case đại diện được mọi payload','-Tỷ lệ chặn cao cho phép bỏ xem side effects'], 'An toàn cần coverage theo đường tấn công và usefulness. Một refusal không chứng minh action phía sau chưa xảy ra.');
  M(11,'HITL & escalation','Giao dịch giá trị cao và thông tin chưa chắc. Cần gì trước execution?',[
    '+Xác minh dữ kiện và quyền cần thiết','+Duyệt đúng payload với evidence/risk hiển thị','+Policy timeout/reject và người chịu trách nhiệm','-Confidence tự báo cao đủ để bỏ approval bắt buộc','-Gửi giao dịch trước rồi cho người duyệt rollback sau'], 'Risk và hard rules quyết định điểm dừng. Hậu kiểm/rollback có thể không thay được ngăn tác động trước.');
  M(11,'Responsible AI','User không có đường yêu cầu sửa quyết định. Cần bổ sung gì?',[
    '+Giải thích phạm vi và cách quyết định ảnh hưởng họ','+Tuyến review/kháng nghị với owner','+Audit và sửa dữ liệu/quy trình có bằng chứng','-Công bố tên model đủ đáp ứng trách nhiệm giải trình','-Ẩn mọi uncertainty để user dễ tin quyết định'], 'Minh bạch tên model chưa tạo khả năng xem xét/sửa. Người bị ảnh hưởng cần cơ chế có trách nhiệm và thông tin hữu ích.');

  M(12,'Production gap','Provider mất kết nối khiến service treo. Cần kiểm những lớp nào?',[
    '+Timeout và deadline trên request path','+Retry/fallback có budget và contract','+Log/trace giúp phân biệt mạng, quota và app','-Notebook từng chạy đủ để loại lỗi môi trường/config','-Tăng worker như cách thay cancellation/timeouts'], 'Thêm worker có thể chỉ nhân request bị treo. Cần kiểm runtime boundaries mà notebook chưa bao phủ.');
  M(12,'Docker & config','Image chỉ chạy trên một máy. Những kiểm tra nào hợp lý?',[
    '+Dependency/runtime/architecture được pin và tương thích','+Config/secret được cấp đúng lúc chạy','+Build/run theo cùng quy trình sạch','-Image build thành công đủ xác nhận network và credentials','-Copy nguyên môi trường local gồm secrets để giữ tương đương'], 'Build xác nhận đóng gói một phần; runtime còn config/network. Tái lập không đồng nghĩa sao chép bí mật vào artifact.');
  M(12,'Stateful agent','Request sang instance khác mất lịch sử. Cần xem và sửa gì?',[
    '+State đang in-memory hay trong backend dùng chung','+Thread/user identity có được truyền nhất quán','+Restart/scale-out tests cho state cần bền','-Sticky session được coi thay hoàn toàn persistence khi crash','-Tăng context window ở instance mới để nhớ thread cũ'], 'Sticky routing không giữ RAM qua crash; model window không tạo state chưa load. Cần đúng backend và định danh.');
  M(12,'Hosting & MCP','Server stdio local không kết nối từ cloud. Nên kiểm gì?',[
    '+Transport và cách process client/server được bố trí','+Endpoint/network/auth ở môi trường đích','+Một discovery và business call E2E','-Dùng cùng command path Windows trên container Linux mà không chuyển runtime','-Homepage 200 đủ xác nhận MCP session hoạt động'], 'Stdio gắn với process/host và không tự thành remote endpoint. Health web không thay kiểm transport MCP.');
  M(12,'Security & scale','Traffic tăng vượt quota provider. Cần những biện pháp nào?',[
    '+Admission/concurrency limits và queue policy','+Deadline, backpressure và budget retry','+Theo dõi usage theo task/tenant','-Tăng replica app mặc định để vượt quota downstream','-Cho mọi user dùng chung quyền quản trị để giảm auth overhead'], 'Quota downstream không tăng theo replica app. Scale cần kiểm bottleneck và quyền, không bỏ kiểm soát để tạo tải lớn hơn.');
  M(12,'CI/CD & model serving','Prompt mới build được nhưng quality giảm. Gate cần gì?',[
    '+Eval trên task giữ riêng với baseline','+Version prompt/model/config/index có liên quan','+Rollout/rollback và monitoring theo risk','-Build success thay semantic evaluation','-Chỉ smoke homepage để kết luận feature AI tương đương'], 'Build/HTTP probe không kiểm hành vi. Release AI cần evidence chất lượng và khả năng quay về cấu hình đã biết.');

  M(13,'Pillars','Dashboard thấy lỗi tăng nhưng chưa biết request nào. Cần nối những bằng chứng nào?',[
    '+Metrics để định lượng theo cohort/thời gian','+Logs có request/trace IDs','+Traces nối các bước model/retrieval/tool','-Chỉ tăng số log không cấu trúc để suy ra observability đủ','-Metric tổng hợp thay mọi chi tiết sự kiện cần điều tra'], 'Ba loại telemetry bổ sung nhau. Nhiều log không có liên kết có thể làm tăng nhiễu mà chưa giúp tìm căn nguyên.');
  M(13,'AI metrics','Average latency ổn nhưng nhiều khách chờ lâu. Nên đo gì?',[
    '+Percentiles và phân bố thay chỉ trung bình','+End-to-end latency theo nhóm task/tenant','+Time-to-first-token khi dùng streaming','-Chỉ latency model để đại diện mọi thời gian chờ của user','-Giảm output token được coi đủ sửa queue/retry latency'], 'User chờ cả queue, retrieval, tool và generation. TTFT và tổng thời gian cũng là hai chiều khác nhau.');
  M(13,'Structured logs','Log rời rạc và chứa email. Nên thay theo hướng nào?',[
    '+Trường ID, component, version, status và duration','+Mask/minimize PII theo nhu cầu điều tra','+Policy retention và quyền đọc telemetry','-Log toàn payload để bù việc thiếu schema sự kiện','-Xóa toàn ID liên kết để đạt privacy dù không còn tái dựng request'], 'Privacy và observability cần cân bằng bằng minimization và IDs phù hợp. Log mọi thứ hoặc mất mọi liên kết đều không giải đúng yêu cầu.');
  M(13,'Tracing','Agent chậm sau thêm reranker. Cần spans/evidence nào?',[
    '+Thời gian retrieval, rerank, model, tool và queue','+Request/version để so trước/sau cùng nhóm task','+Error/retry events liên quan','-Chỉ tổng latency giảm đủ chứng minh reranker hiệu quả','-Token count thay thời gian thực của từng dependency'], 'Trace giúp attribution latency, còn quality cần phép đo riêng. Token count không mô tả đầy đủ network/compute của mọi bước.');
  M(13,'Dashboard & alerts','Đội bỏ qua alert vì quá nhiều INFO. Nên thay gì?',[
    '+Alert theo tác động, owner và runbook','+Tách severity cùng dedup/routing phù hợp','+Đo missed incidents và noise sau điều chỉnh','-Tắt mọi alert ít xảy ra vì không ảnh hưởng điểm trung bình','-Dùng số alert thấp nhất làm metric vận hành chính'], 'Ít alert chỉ tốt nếu vẫn phát hiện lỗi quan trọng. Ưu tiên phải theo impact, không chỉ tần suất.');
  M(13,'Feedback & privacy','Dislike chưa tái hiện được lỗi. Cần dữ liệu tối thiểu nào?',[
    '+Liên kết request/trace và version chạy','+Loại lỗi hoặc evidence user cung cấp trong phạm vi cho phép','+Context cần thiết có xử lý quyền/PII','-Toàn bộ lịch sử mọi user để hỗ trợ tìm mẫu','-Một dislike được coi là nhãn correctness chắc chắn'], 'Feedback là tín hiệu có ngữ cảnh, không tự ground truth. Cần đủ để tái hiện mà không thu dữ liệu vượt nhu cầu.');

  M(14,'Dataset design','Điểm gần tuyệt đối trên toàn câu dễ. Cần bổ sung những mẫu nào?',[
    '+Case đại diện traffic và failure cost thực','+Case biên, thiếu dữ liệu và cần abstain','+Hard cases chưa tối ưu trực tiếp','-Thêm paraphrase của cùng câu dễ để thay coverage','-Chọn nhiều câu model đã pass để ổn định score'], 'Số câu không thay tính đại diện. Sampling thuận lợi có thể tăng điểm mà giữ nguyên blind spots.');
  M(14,'LLM-as-judge','Judge chọn đáp án dài dù thêm fact sai. Cần những kiểm tra nào?',[
    '+Rubric correctness tách style và verbosity','+Cặp test kiểm soát độ dài và nội dung','+Calibration bằng nhãn người trên case khó','-Chuẩn hóa số từ đủ để loại mọi judge bias','-Cùng model tự chấm output được coi độc lập với policy'], 'Length control chỉ một phần. Cần kiểm semantic và lỗi tương quan/self-preference trong phép chấm.');
  M(14,'Statistical rigor','Bản mới hơn 2 điểm phần trăm trên 20 case. Nên làm gì?',[
    '+Xem số case thắng/thua và cách tính điểm cụ thể','+Đánh giá uncertainty và tính đại diện của mẫu','+Giữ điều kiện so và kiểm regression nghiêm trọng','-Điểm dương đủ chứng minh cải thiện tổng quát','-Chỉ chạy thêm cho đến lần điểm vượt target rồi dừng'], 'Mẫu nhỏ và optional stopping có thể tạo kết luận sai. Cần kiểm uncertainty, quy trình lấy mẫu và failures chứ không chỉ dấu của chênh lệch.');
  M(14,'Agent & safety eval','Agent đọc file đáp án để vượt benchmark. Cần control nào?',[
    '+Tách dữ liệu/graders giữ riêng khỏi quyền agent','+Kiểm trajectory và access logs','+Đánh fail vi phạm dù answer đúng','-Giữ điểm vì benchmark chỉ yêu cầu outcome','-Đổi tên file đáp án làm control duy nhất'], 'Outcome đúng bằng đường gian lận không chứng minh năng lực task. Cần boundary quyền và evaluator độc lập.');
  M(14,'Eval fundamentals','Hai model được demo trên hai câu khác nhau. Muốn so có ý nghĩa cần gì?',[
    '+Cùng bộ prompts/tasks và tiêu chí','+Điều kiện generation/budget được công bố','+Outputs/per-case scores lưu được','-Mỗi model dùng demo do người xây tự chọn để thể hiện tốt nhất','-Số câu trả lời trôi chảy thay nhãn task'], 'Phép so cần cùng điều kiện và tập đại diện. Demo được chọn riêng thiên về trình diễn, không xác định model tốt hơn cho sản phẩm.');
  M(14,'Metrics','Answer đúng nhưng không có booking. Những metric nào cần được tách?',[
    '+Correctness của nội dung trả lời','+Task success ở hệ lịch đích','+Tool/action compliance theo trajectory','-HTTP success thay cho trạng thái business','-BLEU/semantic similarity đủ để đánh giá hành động đã làm'], 'Text metrics không xác nhận external action. Cần outcome và process evidence ở tầng nghiệp vụ.');
  M(14,'Dataset design','Muốn giảm leakage khi cập nhật eval set, cần những nguyên tắc nào?',[
    '+Giữ test cases độc lập với vòng chọn/tune checkpoint','+Version nguồn, nhãn và lịch sử sử dụng','-Gộp case đã dùng sửa prompt vào holdout mà không đánh dấu','+Tách lỗi production dùng regression với đánh giá tổng quát phù hợp','-Bộ lớn hơn được coi tự giảm mọi rủi ro leakage'], 'Case dùng tối ưu không còn độc lập như trước. Cần biết dữ liệu từng được dùng vào quyết định nào.', 'Đội dùng toàn bộ eval để sửa prompt hằng ngày rồi báo đó là chất lượng trên dữ liệu chưa từng thấy.');
  M(14,'LLM-as-judge','Nếu judge đổi lựa chọn khi đảo A/B, cần xử lý gì?',[
    '+Đo agreement giữa hai thứ tự','+Kiểm rubric và position bias','+Ẩn tên hệ và chuẩn hóa điều kiện chấm hợp lý','-Lấy thứ tự có lợi cho model mới làm kết quả chính','-Tăng số lượt giữ nguyên thứ tự thay phép kiểm đối xứng'], 'Đảo vị trí kiểm ảnh hưởng của presentation. Chọn kết quả thuận lợi hoặc lặp thứ tự cũ không loại bias.', 'Một cặp answer giữ nguyên nội dung nhưng win rate đổi mạnh khi hoán vị vị trí A/B.');
  M(14,'RAG eval','Answer trung thành với một context sai. Cần kết luận gì?',[
    '+Faithfulness có thể cao trong điều kiện này','+Nguồn/reference correctness cần được kiểm riêng','+Retrieval relevance/validity và answer quality là các chiều khác','-Groundedness cao đủ xác nhận dữ liệu nguồn đúng','-Chỉ sửa output wording sẽ giải căn nguyên tài liệu sai'], 'Bám sai nguồn vẫn có thể grounded. Cần sửa dữ liệu hoặc lựa chọn nguồn theo bằng chứng.');
  M(14,'Statistical rigor','Muốn so lại bản mới sau nhiều lần thử cấu hình, cần những control nào?',[
    '+Công khai cách chọn run/checkpoint','+Đánh giá lại trên dữ liệu chưa dùng lựa chọn','+Báo variance hoặc uncertainty phù hợp','-Chọn best-of-many rồi coi cùng độ tin cậy với một run định trước','-Bỏ mọi case fail cả hai hệ để tăng độ nhạy điểm'], 'Lựa chọn nhiều lần và loại mẫu sau khi xem kết quả làm lệch phép đo. Cần tách selection khỏi xác nhận.', 'Trong 30 cấu hình thử trên cùng 20 câu, nhóm chọn bản tốt nhất và muốn tuyên bố nó tổng quát tốt hơn.');
  M(14,'Agent & safety eval','Muốn kiểm safety mà không làm bot từ chối quá mức, cần bộ case nào?',[
    '+Cặp yêu cầu hợp lệ và vi phạm gần nhau về ngôn từ','+Test quyền/side effects ngoài text cuối','+Case nhiều lượt hoặc qua tool theo threat model','-Tỷ lệ refusal cao nhất được xem như mục tiêu đầy đủ','-Chỉ test jailbreak trực tiếp ở user prompt'], 'Safety gồm cả unsafe pass và over-blocking; attack có thể đến qua tool/memory và thể hiện ở action trước output.', 'Guardrail mới chặn nhiều hơn, nhưng cũng từ chối các request hỗ trợ hợp lệ và chưa được kiểm tool execution.');
  M(14,'Failure analysis','Đổi model và top-k chưa sửa lỗi policy. Cần chẩn đoán gì?',[
    '+Policy có đúng phiên bản và còn hiệu lực','+Parse/chunk/retrieval có giữ điều kiện cần thiết','+Cluster case theo nguyên nhân có evidence','-Tiếp tục tăng top-k vì mọi lỗi RAG đều là thiếu recall','-Chọn một model có benchmark cao hơn làm cách thay điều tra'], 'Cần xác định nơi dữ kiện sai/mất. Tăng tài nguyên không giải nguồn cũ, parse sai hay generation hiểu sai một cách tự động.');

  M(15,'Enterprise readiness','Pilot mở rộng mà chưa ai nhận incident. Cần hoàn tất gì?',[
    '+Owner, escalation và runbook phù hợp mức dịch vụ','+Monitoring/eval và rollback theo phạm vi','+Quyền, dữ liệu và support process được kiểm','-Pilot từng thành công đủ thay readiness của traffic lớn','-Giao mặc định mọi sự cố cho model provider'], 'Sẵn sàng tổ chức gồm người/quy trình và hệ thống. Provider không sở hữu mọi lỗi app, dữ liệu hay workflow.');
  M(15,'Cost anatomy','Ngân sách mới tính output tokens. Cần cộng gì?',[
    '+Input/history/retrieval context theo đơn giá tương ứng','+Retry, worker calls và provider/tool usage','+Hạ tầng, dữ liệu và người review/vận hành','-Số user nhân giá output là dự toán đầy đủ','-Prompt cache hit nghĩa input không còn chi phí theo mọi provider'], 'Chi phí phụ thuộc request path và quy tắc tính giá cụ thể. Output bill chỉ một phần TCO.');
  M(15,'Optimization','Model nhỏ tiết kiệm nhưng task khó fail hơn. Nên làm gì?',[
    '+Eval theo độ khó/risk và cohort','+Thử routing có fallback với quality gate','+Tính cost cả review/retry vì lỗi tăng','-Dùng cost/token thấp hơn làm kết luận sản phẩm tốt hơn','-Chỉ giữ điểm trung bình vì task khó ít traffic'], 'Tối ưu cần giữ constraints chất lượng. Nhóm ít traffic nhưng lỗi đắt không nên bị trung bình che đi.');
  M(15,'Scaling & reliability','Thêm worker không tăng throughput vì provider quota. Cần kiểm gì?',[
    '+Bottleneck downstream và admission/concurrency','+Queue, timeout và retry amplification','+Traffic/cost budget theo task','-Tiếp tục tăng replicas để bù mỗi worker bị throttle','-Giảm audit logging như cách nâng provider quota'], 'Scale app không tăng quota dependency. Tăng worker có thể tăng hàng đợi và retries thay throughput hữu ích.');
  M(15,'Skills & roadmap','Muốn chuyển từ học framework sang năng lực xây hệ, nên ưu tiên gì?',[
    '+Một task có dữ liệu, baseline và outcome kiểm được','+Triển khai, eval, debug và vận hành một luồng hoàn chỉnh','+Ghi evidence/giới hạn và cải thiện theo failure cases','-Số framework biết tên làm tiêu chí hoàn tất chính','-Thêm multi-agent trước khi có baseline để hồ sơ trông phong phú'], 'Năng lực được thể hiện qua vòng làm–đo–sửa với evidence. Mở rộng công cụ chưa chứng minh giải được task.');
  M(15,'Enterprise readiness','Sau pilot hẹp, bằng chứng nào cần thêm trước mở toàn tổ chức?',[
    '+Tải, quyền và dữ liệu của các nhóm user mới','+Phép kiểm failure/recovery và owner phù hợp','+Chất lượng theo scope mới, không chỉ pilot cohort','-Dùng cùng tỷ lệ lỗi pilot suy ra đúng cho mọi tenant','-Healthcheck xanh thay phép thử scale và integration'], 'Scope thay đổi làm giả định pilot có thể không còn đúng. Cần kiểm domain/tải/quyền mới.', 'Pilot chỉ dùng dữ liệu public của một nhóm; rollout dự kiến có nhiều tenant và nguồn dữ liệu riêng tư.');
  M(15,'Skills & roadmap','Để chọn cải tiến tiếp theo từ một dự án đã chạy, nên dựa vào gì?',[
    '+Failure cluster hoặc bottleneck có evidence','+Giá trị/risk và effort của thay đổi','+Owner cùng tiêu chí kiểm hoàn tất','-Công nghệ đang phổ biến được ưu tiên dù không gắn lỗi hiện tại','-Benchmark ngoài domain đủ để chọn roadmap nội bộ'], 'Roadmap cần nối khoảng trống thực tới phép kiểm. Trend hay benchmark ngoài miền có thể gợi ý nhưng không thay evidence dự án.', 'Hệ đã chạy nhưng đội có ba đề xuất: thêm framework, đổi model và sửa lỗi tenant isolation đã ghi nhận.');

  C('t3-d16-q1','Sau mỗi lỗi, agent nhận một đoạn phản hồi trong context rồi chạy lại bằng cùng weights. Log không có optimizer step. Cơ chế nào mô tả sát nhất?',[
    'SFT online: dùng phản hồi như một batch cập nhật weights',
    'Reflexion: điều chỉnh lần thử bằng phản hồi ở inference',
    'DPO: so cặp responses với reference ở mỗi lượt chat',
    'CPT: tiếp tục học phân bố text từ trace mới'],1,'Không có cập nhật weights; tín hiệu được cấp vào context giữa attempts. Đây là phản hồi trong quá trình suy luận, không phải các objective training.');
  C('t3-d16-q2','Một tool call đã qua schema nhưng amount vượt hạn mức của user. Cần chặn trước khi ghi dữ liệu. Vị trí nào phù hợp nhất?',[
    'Output formatter, nơi chuẩn hóa câu thông báo kết quả',
    'After-model hook, coi việc model chọn tool là đã có kết quả',
    'Execution wrapper, authorize payload trước khi gọi tool',
    'Summary hook, nơi rút gọn lịch sử cho lần gọi sau'],2,'Schema không xác nhận hạn mức nghiệp vụ. Authorization phải xảy ra trước execution, không ở lớp trình bày hoặc tóm tắt sau đó.');
  C('t3-d16-q3','Cùng một payload sai field nhận 400 qua 4 lần; deadline task còn 5 giây. Bước nào phù hợp nhất?',[
    'Dừng retry payload đó, sửa/clarify input hoặc trả lỗi có kiểm soát',
    'Tăng backoff để request validation có thời gian phục hồi',
    'Chuyển provider giữ nguyên payload vì đây là lỗi downstream',
    'Xóa observation 400 rồi để model quyết định lại từ đầu'],0,'400 do field sai cần sửa request, không phải chờ hồi phục dependency. Budget còn lại cũng không làm payload cũ hợp lệ.');
  C('t3-d17-q1','Memory ghi: “Hôm qua query timeout; chuyển sang index B thì task đạt”. Chưa có kiểm định trên task khác. Cách dùng nào phù hợp nhất?',[
    'Đưa thành policy: mọi query sau đều dùng index B',
    'Thay user preference thành thích index B vì đây là sở thích đã thể hiện',
    'Ghi như factual knowledge rằng index A không còn hoạt động',
    'Giữ như episode có điều kiện, kiểm thêm trước khi rút skill'],3,'Episode mô tả một trải nghiệm có diễn biến, không tự tạo quy tắc hay kết luận chung về mọi query/index.');
  C('t3-d17-q2','Một vụ việc đang chờ duyệt cần resume đúng bước; sở thích user phải dùng ở các vụ việc khác. Cách tách nào đúng nhất?',[
    'Cả hai đặt trong thread RAM để bảo đảm cùng thời điểm đọc',
    'Trạng thái chờ theo checkpoint thread; preference theo store user-scoped',
    'Trạng thái chờ đặt vào semantic index; preference làm thread ID',
    'Dùng một thread ID cho mọi vụ việc của mọi user có cùng preference'],1,'Hai loại dữ liệu có phạm vi và lifecycle khác nhau. Checkpoint khôi phục tiến trình; store có scope/authorization phục vụ qua thread.');
  C('t3-d17-q3','User yêu cầu xóa fact. Profile UI đã sạch nhưng retrieval vẫn lấy được fact từ vector index. Ưu tiên tiếp theo là gì?',[
    'Xác định và xử lý bản dẫn xuất/đường tái ghi theo policy xóa',
    'Đợi TTL profile hết để vector tự mất cùng thời điểm',
    'Chỉ đổi prompt yêu cầu model tránh nhắc lại fact',
    'Đóng thread hiện tại vì xóa chỉ áp dụng trong phiên đó'],0,'Xóa ở UI/profile chưa cắt đường đọc index hoặc ghi lại từ job. Phải xét các bản sao và phạm vi cam kết xóa.');
  C('t3-d18-q1','Đội muốn cắt vector 1.024 chiều xuống 256. Kiểm tra nào cần trước khi coi đây là Matryoshka reduction hợp lệ?',[
    '256 là lũy thừa của 2 nên có thể dùng mọi embedding model',
    'Chỉ số cosine trung bình sau cắt gần trước cắt',
    'Model hỗ trợ biểu diễn ở chiều giảm và recall/task quality được đo lại',
    'Database chấp nhận vector 256 chiều nên semantics đã được giữ'],2,'Khả năng lưu vector chỉ xác nhận shape. Việc giữ thông tin khi giảm chiều phụ thuộc model và phép đo trên task.');
  C('t3-d18-q2','Reference evidence không xuất hiện trong 100 candidates đầu nhưng corpus có đoạn đúng. Thử nghiệm nào nhắm đúng bottleneck trước?',[
    'Thay reranker vì nó quyết định thứ tự cuối',
    'Kiểm parse/chunk/query và retriever để evidence vào candidate set',
    'Tăng output token để generator mô tả đầy đủ hơn',
    'Chỉ đổi rubric judge để giảm phạt thiếu evidence'],1,'Reranker không thể xếp một evidence chưa có trong candidates. Cần kiểm đường vào tập ứng viên trước khi sửa các tầng sau.');
  C('t3-d18-q3','Embedding model mới có cùng dimension model cũ. Cách cutover nào đáng tin nhất?',[
    'Giữ vectors cũ vì shape tương thích, chỉ đổi query encoder',
    'Đổi query encoder trước rồi backfill dần không phân version',
    'So score query cũ/mới rồi chọn score lớn hơn cho từng request',
    'Re-embed corpus, eval index mới, đồng bộ delta rồi chuyển alias có rollback'],3,'Cùng dimension chưa cùng không gian ngữ nghĩa. Query/corpus cần biểu diễn tương thích và cutover kiểm soát dữ liệu, quality, quyền.');
  C('t3-d19-q1','Nguồn chỉ nói An làm việc cho Công ty A vào năm 2024. Claim nào được hỗ trợ trực tiếp?',[
    'Công ty A là chủ sở hữu của mọi sản phẩm An từng làm',
    'An đang làm tại A ở thời điểm hiện tại',
    'Có quan hệ WORKS_FOR từ An tới A với phạm vi thời gian được ghi nhận',
    'A có quan hệ WORKS_FOR tới An vì hai node cùng một cạnh'],2,'Cần giữ chiều và thời gian. Một relation không suy ra quan hệ sở hữu hay trạng thái hiện hành sau phạm vi nguồn.');
  C('t3-d19-q2','Hai mentions “Minh Trần” cùng tên nhưng khác tổ chức/ngày sinh bị gộp. Lớp cần xem trước nhất là gì?',[
    'Entity resolution/disambiguation dùng bằng chứng định danh',
    'Text generation sau khi đã lấy đúng subgraph',
    'BFS depth từ node đã gộp',
    'Graph serialization sang JSON thay vì text'],0,'Lỗi identity xuất hiện trước traversal và generation. Đổi độ sâu hay định dạng không tách được hai thực thể đã gộp sai.');
  C('t3-d19-q3','Từ seed S, A ở 1 cạnh, B ở 2 cạnh, C ở 3 cạnh. Query giới hạn tối đa 2-hop và chỉ theo cạnh được phép. Kết luận nào đúng?',[
    'C có thể lấy nếu degree cao hơn B',
    'B chỉ có thể được xét nếu đường đi thỏa filter; C nằm ngoài giới hạn hop',
    'Mọi node trong 2-hop đều được đưa vào context dù thiếu quyền',
    '2-hop buộc chọn đúng hai node, bất kể khoảng cách'],1,'Hop giới hạn độ dài đường, không phải số node. Filter/quyền vẫn ràng buộc traversal trong giới hạn đó.');
  C('t3-d20-q1','Có 12 worker gọi cùng provider nhưng chỉ cho tối đa 3 call đồng thời. Cơ chế nào trực tiếp cưỡng chế giới hạn?',[
    'Semaphore/pool giới hạn concurrency tại chỗ dispatch call',
    'Giảm max tokens mỗi worker để suy ra còn 3 call',
    'Batch task thành nhóm 3 nhưng không chờ nhóm trước kết thúc',
    'Retry policy riêng của mỗi worker sau khi 429'],0,'Concurrency cap phải kiểm tài nguyên đang chạy. Token limit, chia nhóm không có join và retry không trực tiếp giữ tối đa 3 call.');
  C('t3-d20-q2','Code bị cấm xóa file nghiệp vụ, nhưng chạy trong container có quyền truy cập file đó. Kết luận nào đúng?',[
    'Container làm mọi action trong nó phù hợp policy',
    'Permission check chỉ cần ở prompt vì container đã cô lập',
    'Nếu container không có network thì xóa file không còn risk',
    'Sandbox giới hạn môi trường; quyền xóa vẫn phải được kiểm theo policy'],3,'Sandbox không hợp thức hóa action trái quyền và file loss vẫn là hậu quả dù không có network.');
  C('t3-d20-q3','Agent được xem điểm test rồi sửa playbook, chạy lại cùng test và báo tăng điểm. Điều gì bị suy yếu rõ nhất?',[
    'Khả năng load playbook ở runtime',
    'Tính độc lập của tập test với vòng tối ưu',
    'Tính hợp lệ cú pháp của tool calls',
    'Khả năng ghi checkpoint sau mỗi attempt'],1,'Tập đã dùng để chọn/sửa không còn như holdout độc lập. Freeze và kiểm trên task giữ riêng giúp xác nhận tổng quát.');
  C('t3-d21-q1','Linear layer có d_in=768, d_out=3.072, rank LoRA r=8; không tính bias. Hai ma trận adapter có tổng bao nhiêu tham số?',[
    '24.576', '6.144', '30.720', '2.359.296'],2,'A/B có r(d_in+d_out)=8×(768+3.072)=30.720. 24.576 chỉ đếm nhánh output; 6.144 chỉ nhánh input; số lớn là base matrix.');
  C('t3-d21-q2','Trong cấu hình QLoRA đóng băng base 4-bit và chỉ train adapter, tensor nào thường có optimizer states được cập nhật?',[
    'Mọi weights base sau khi cast sang 16-bit',
    'Các parameters trainable của adapter',
    'Mọi token IDs trong batch',
    'Toàn bộ outputs activation được coi như weights'],1,'Optimizer states gắn với parameters được tối ưu. Activations/tokens không là weights trainable; base frozen không được cập nhật như full tuning.');
  C('t3-d21-q3','Dataset JSON hợp lệ, loss giảm nhưng model học lặp prompt. Phép kiểm rẻ nào cho bằng chứng trực tiếp nhất?',[
    'Tăng số train epochs rồi xem xu hướng loss',
    'So dung lượng checkpoint với base',
    'Đổi framework nhưng giữ nguyên preprocessing',
    'Inspect/decode batch tokens và labels thực sự được tính loss'],3,'JSON shape không kiểm labels. Batch thật cho biết model được thưởng ở vùng prompt/answer nào trước khi tốn thêm training.');
  C('t3-d21-q4','Có 10 biến thể domain dùng chung đúng một base; runtime hỗ trợ adapter routing. Lợi ích lưu trữ tiềm năng của giữ adapter riêng là gì?',[
    'Không phải lưu 10 bản đầy đủ của cùng base',
    'Tổng memory serving chắc giảm 10 lần kể cả concurrent loading',
    'Có thể bỏ tokenizer và generation config riêng',
    'Mọi adapter của mọi base version đều hoán đổi được'],0,'Chia sẻ base có thể giảm duplication của artifact. Serving memory thực và compatibility vẫn cần kiểm theo runtime/version.');
  C('t3-d22-q1','Đội có preference pairs và muốn DPO chuẩn thay PPO-based RLHF. Thành phần nào thường không cần train/chạy riêng trong vòng tối ưu đó?',[
    'Mọi reference policy và forward pass',
    'Explicit reward model riêng cùng vòng PPO rollouts',
    'Tokenizer và mask cho chosen/rejected',
    'Held-out behavior evaluation sau train'],1,'DPO tối ưu trực tiếp từ pairs tương đối với reference, tránh pipeline reward model + PPO truyền thống. Dữ liệu, forward và eval vẫn cần.');
  C('t3-d22-q2','Một training objective cộng loss đáp án mẫu với phần odds-ratio preference, không dùng reference model riêng. Mô tả nào sát nhất?',[
    'CPT trên raw text để học phân bố miền',
    'DPO chuẩn chỉ dùng likelihood của chosen',
    'ORPO kết hợp SFT và preference trong cùng objective',
    'PPO dùng critic cập nhật value function'],2,'Đặc điểm kết hợp SFT và odds-ratio preference nhận diện ORPO. Không nên đồng nhất mọi thuật toán preference với DPO/PPO.');
  C('t3-d22-q3','GRPO tạo nhiều responses cho cùng prompt và dùng rewards trong nhóm để tính tín hiệu tương đối. Nhận định nào đúng nhất?',[
    'Không cần critic/value model như PPO thông thường, nhưng vẫn cần reward signal',
    'Không cần reward vì nhiều responses tự xác định ground truth',
    'Mọi response trong nhóm phải có cùng reward',
    'Bỏ critic đồng nghĩa verifier không thể bị reward hacking'],0,'Baseline tương đối từ nhóm không loại reward hoặc rủi ro của bộ chấm. Group consensus cũng không là ground truth.');
  C('t3-d22-q4','Policy pass toàn test của verifier nhưng sai trên case có nhãn người. Ưu tiên điều tra nào hợp lý nhất?',[
    'Tăng hệ số reward pass vì policy đang học chậm',
    'Đổi nhãn người theo verifier để đồng nhất dữ liệu',
    'Bỏ các case người chấm bất đồng khỏi report',
    'Audit verifier coverage và đường model có thể khai thác'],3,'Mâu thuẫn cần audit cả nhãn và verifier; không ép dữ liệu theo bộ chấm hoặc tăng tối ưu một tín hiệu có thể sai.');
  C('t3-d23-q1','Hai node song song trả cập nhật list findings. Cần giữ cả hai kết quả thay vì phụ thuộc request về trước. Thiết kế nào trực tiếp giải yêu cầu?',[
    'Tăng recursion limit của graph',
    'Reducer/merge contract hợp lệ cho key findings',
    'Dùng cùng node name cho hai nhánh',
    'Cho model tổng hợp trước khi cả hai nhánh kết thúc'],1,'Đây là semantics hợp nhất state. Recursion, tên node hay tổng hợp sớm không xác định merge cập nhật đồng thời.');
  C('t3-d23-q2','Node gọi API hoàn tiền rồi interrupt chờ duyệt; resume có thể replay node. Sửa nào an toàn hơn theo policy cần duyệt trước?',[
    'Giữ API trước interrupt nhưng log thêm approval sau đó',
    'Tăng checkpoint frequency để mặc định không replay call',
    'Duyệt đúng payload trước, execute với idempotency phù hợp sau duyệt',
    'Chuyển API vào prompt system để model nhớ đã gọi'],2,'Cần ngăn action trước approval và chống thực thi lặp. Log/checkpoint không tự đảm bảo exactly-once cho external API.');
  C('t3-d23-q3','Fork graph từ checkpoint trước bước đã gửi email ở nhánh cũ. Cần hiểu gì về email đã gửi?',[
    'Nó không tự biến mất; muốn sửa hậu quả cần cơ chế nghiệp vụ riêng',
    'Nó bị rollback khi checkpoint state quay về trước node gửi',
    'Nó được đánh dấu draft lại vì nhánh mới chưa gửi',
    'Nó được thu hồi nếu graph dùng persistent checkpointer'],0,'State branching không đảo side effect ngoài graph. Khả năng bù/thu hồi phải do hệ nghiệp vụ hỗ trợ.');
  C('t3-d24-q1','Answer được context hỗ trợ hoàn toàn nhưng context là policy hết hạn. Chiều đánh giá nào có thể cao dù task sai?',[
    'Độ đúng về hiệu lực policy hiện tại',
    'Mức bao phủ mọi thông tin cần trong reference',
    'Task success của hành động nghiệp vụ',
    'Faithfulness đối với context đã cấp'],3,'Faithfulness kiểm hỗ trợ từ context, không xác nhận context hiện hành hay outcome đúng.');
  C('t3-d24-q2','Reference hợp lệ chứa ba điều kiện bắt buộc; context chỉ có hai, answer dùng đúng hai điều đó. Metric nào nhắm trực tiếp phần evidence bị thiếu?',[
    'Answer relevancy theo câu hỏi sinh ngược',
    'Context recall so với reference phù hợp',
    'Faithfulness của answer với context',
    'Latency percentile của retriever'],1,'Recall xét thông tin cần nhưng không có trong context. Answer có thể relevant/faithful dù evidence chưa đủ.');
  C('t3-d24-q3','Judge chọn A 80% khi hệ mới ở A, nhưng chỉ 45% khi đổi hai vị trí và giữ nguyên nội dung. Bước nào hợp lý nhất?',[
    'Báo 80% vì đó là cấu hình đánh giá đầu tiên',
    'Tăng số lần chấm cùng thứ tự đầu để thu nhỏ variance',
    'Audit position bias và tổng hợp phép so đối xứng theo protocol rõ',
    'Chọn thứ tự có confidence tự báo cao hơn'],2,'Chênh theo vị trí cho thấy presentation ảnh hưởng verdict. Lặp hoặc chọn thứ tự thuận lợi không giải bias.');
  C('t3-d25-q1','Breaker Open sau chuỗi 5xx, cooldown chưa hết. Request mới tới nên đi tuyến nào theo policy ngắt dependency?',[
    'Gọi provider chính một lần để kiểm nó phục hồi chưa',
    'Xếp mọi request chờ rồi cùng xả khi cooldown hết',
    'Reset failure counter trước mỗi request mới',
    'Fail fast hoặc fallback được phép, giữ probe theo policy'],3,'Open nhằm ngăn tải; probe phải theo điều kiện/chỉ tiêu riêng. Một request mới không tự tạo ngoại lệ thử lại.');
  C('t3-d25-q2','Client timeout sau lệnh ghi; server có thể đã commit. Lựa chọn nào giảm nguy cơ tạo tác động trùng?',[
    'Retry cùng action ID/idempotency key hoặc tra trạng thái theo contract',
    'Retry với key mới vì response cũ không về',
    'Xóa cache client rồi coi request trước thất bại',
    'Tăng timeout cho lần sau rồi gửi thêm cùng lệnh không định danh'],0,'Timeout không xác định commit. Identity của hành động logic giúp server nhận retry thay vì thao tác mới.');
  C('t3-d25-q3','Cache trả policy sai điều kiện dù hit rate 92%. Metric bổ sung ưu tiên là gì?',[
    'Tăng tỷ lệ hit bằng cách giảm similarity threshold',
    'False hit rate trên cặp gần nghĩa nhưng khác đáp án/phạm vi',
    'Số entry cache tích lũy mỗi ngày',
    'Tỷ lệ request tránh được model không xét correctness'],1,'Hit rate và tránh call đo tiết kiệm, không đo cached answer có hợp request. False hit cần nhãn về tương đương semantics/quyền/thời điểm.');
  C('t3-d26-q1','Model trả tên hàm và JSON parameters hợp schema cho một thao tác ghi. Thành phần nào phải quyết định quyền và thực thi?',[
    'Tokenizer vì nó đã tạo đúng JSON tokens',
    'Bộ chấm output sau khi thao tác hoàn tất',
    'Runtime app/server thực thi theo policy và business validation',
    'Model tiếp tục sinh text để xác nhận ghi đã xảy ra'],2,'Function call là proposal. Quyền và side effect nằm ở ứng dụng/server; tokens đúng cấu trúc không cấp quyền.');
  C('t3-d26-q2','Tool v2 giữ input nhưng đổi output string thành object. Client cũ dùng regex parse string. Kết luận nào đúng nhất?',[
    'Có thể breaking change dù input schema và tên tool giữ nguyên',
    'Tương thích vì MCP chuẩn hóa mọi output thành cùng kiểu',
    'Chỉ cần sửa docstring, client sẽ tự đổi parser',
    'Output type là chi tiết nội bộ không thuộc contract'],0,'Client phụ thuộc shape/semantics response. Cần version/adapter/deprecation và kiểm client được hỗ trợ.');
  C('t3-d26-q3','Discovery trả một admin tool nhưng user token chỉ có read scope. Server nên làm gì với đề xuất ghi từ model?',[
    'Cho chạy vì discovery đã công bố capability',
    'Cho chạy nếu JSON parameters hợp schema',
    'Đổi sang stdio để bỏ phần kiểm remote auth',
    'Từ chối tại authorization boundary theo scope hiện tại'],3,'Capability tìm được không đồng nghĩa quyền sử dụng. Model/schema không nâng token từ read thành admin.');
  C('t3-d27-q1','Model có logprob cao cho câu “giao dịch đã xong”, nhưng không có tool result. Kết luận nào trực tiếp nhất?',[
    'Giao dịch có xác suất đúng cao tương ứng logprob',
    'Chuỗi token hợp phân bố model; chưa có bằng chứng external outcome',
    'Có thể bỏ approval vì model không thể hiện bất định',
    'Logprob cao xác nhận response nghiệp vụ đã commit'],1,'Likelihood của text không là xác suất task thành công. External outcome và quyền cần bằng chứng ngoài lời sinh.');
  C('t3-d27-q2','Action nhạy cảm bắt buộc duyệt, proposal hết hạn không ai trả lời. Tuyến nào giữ đúng policy?',[
    'Auto-approve để tránh vượt SLO thời gian chờ',
    'Dùng approval gần nhất cho cùng loại task',
    'Giữ chưa thực thi, áp timeout/escalation theo owner và risk',
    'Thực thi một phần payload để chứng minh khả năng phục hồi'],2,'Không phản hồi không là consent. SLO không tự ghi đè gate quyền; quyết định hết hạn cần policy rõ.');
  C('t3-d27-q3','Reviewer duyệt amount=200 nghìn; trước execute, payload đổi thành 2 triệu. Cách xử lý nào đúng?',[
    'So/invalidate approval cũ theo version, kiểm và duyệt lại payload mới khi policy yêu cầu',
    'Giữ approval vì tên action và user không đổi',
    'Thực thi payload mới nhất rồi audit chênh lệch',
    'Dùng confidence của model để chọn giữa hai amount'],0,'Approval gắn nội dung cụ thể đã được xem. Identity/tên task giữ nguyên không cho phép đổi phạm vi tác động.');
  C('t3-d28-q1','Giả sử mỗi lần độc lập có p=0,7 thành công. Metric yêu cầu cả hai lần đều thành công. Xác suất nào đúng?',[
    '0,91', '0,70', '0,51', '0,49'],3,'Cả hai: 0,7×0,7=0,49. 0,91 là ít nhất một lần; 0,51 là không phải cả hai; công thức dùng giả định độc lập đã nêu.');
  C('t3-d28-q2','Hệ nhận ổn định 4 cuộc/giây, mỗi cuộc giữ trung bình 90 giây, bỏ qua bỏ cuộc và biến thiên. Concurrency trung bình xấp xỉ bao nhiêu?',[
    '4 cuộc', '360 cuộc', '90 cuộc', '22,5 cuộc'],1,'Theo giả định ổn định, số đang đồng thời xấp xỉ arrival rate×holding time=4×90=360. CPS khác concurrency; số này chưa là capacity peak cần provision.');
  C('t3-d28-q3','Planner ngôn ngữ đôi lúc mất 3 giây; vòng control cần phản ứng nhanh hơn nhiều. Thiết kế nào phù hợp nhất ở mức kiến trúc?',[
    'Giữ planner ra lệnh motor trực tiếp vì plan đã được viết rõ',
    'Cho control chờ từng token của planner trước mọi bước',
    'Tách planning và control, giữ safety/constraints tại tầng điều khiển',
    'Giảm số sensor để planner xử lý ít context hơn'],2,'Hai tầng có deadline và risk khác nhau. Plan ngôn ngữ không thay controller/safety loop hoặc chứng minh khả thi vật lý.');
  C('t3-d28-q4','Hai ảnh cùng vị trí khác mùa và sensor, model báo khu vực đã thay đổi. Bước nào cần trước kết luận mạnh?',[
    'Kiểm alignment, điều kiện đo và temporal baseline với evidence đối chiếu',
    'Tăng contrast cho hai ảnh rồi dùng chênh màu làm nhãn chuẩn',
    'Dùng ảnh resolution cao hơn như ground truth về mọi thời điểm',
    'Lấy agreement giữa nhiều prompt cùng model thay kiểm dữ liệu'],0,'Confounders do sensor/mùa/mây có thể tạo khác biệt không phải sự kiện. Agreement không thay evidence và preprocessing.');

  C('d1-q4','Một LLM không được cấp tool/network. Stakeholder nói self-attention sẽ tìm tin vừa đăng. Giải thích nào đúng nhất?',[
    'Attention dùng nhiều heads nên có thể tự tìm các nguồn mới theo topic',
    'Attention kết hợp biểu diễn trong context được cấp; dữ kiện mới cần đường cấp nguồn riêng',
    'Positional encoding là nơi lưu ngày cập nhật của mọi tài liệu Internet',
    'Causal mask cho phép model đọc các token của trang web chưa truy xuất'],1,'Attention không phải network retrieval. Context hoặc tool có thể cấp nguồn mới; kiến trúc attention không tự tạo quyền/kết nối đó.');
  C('d1-q7','Hai request có cùng số từ nhưng khác tiếng Việt/code/ký hiệu. Cần ước tính bill token sát hơn bằng cách nào?',[
    'Áp một tỷ lệ từ/token cố định cho mọi request',
    'Đếm ký tự rồi chỉ tính phần output',
    'Dùng tokenizer/usage tương ứng model, tách input và output',
    'Dùng số lượt chat vì tokenization không phụ thuộc nội dung'],2,'Cùng số từ không đồng nghĩa cùng số token. Tokenizer/model và usage hai chiều mới phản ánh cách tính cụ thể.');
  C('d2-q7','Task có thứ tự bắt buộc dịch → tóm tắt → kiểm schema; output mỗi bước là input bước sau. Mẫu nào hợp nhất?',[
    'Parallel fan-out ba bước rồi chọn output về trước',
    'Debate ba agent độc lập để lấy đa số',
    'Router chọn chỉ một bước theo độ dài input',
    'Prompt chaining/workflow tuần tự có validation giữa bước'],3,'Dependency đã rõ và cần mọi bước theo thứ tự. Chaining giữ contract; parallel/debate/router giải cấu trúc task khác.');
  C('d3-q1','User cần tra số dư rồi chuyển một khoản tiền. Bản A chỉ viết hướng dẫn; bản B gọi API đọc/ghi theo policy và kiểm kết quả. Khác biệt có ý nghĩa nhất là gì?',[
    'B có khả năng hành động vào hệ ngoài nên cần quyền và kiểm side effect',
    'B dùng nhiều token hơn nên tự được xem là agent an toàn hơn',
    'A nói đúng hướng dẫn nghĩa giao dịch cũng có thể được coi đã hoàn tất',
    'A và B cùng dùng LLM nên cùng phạm vi risk vận hành'],0,'Capability thực thi thay đổi hậu quả và yêu cầu kiểm soát. Text đúng không xác nhận tác động đã diễn ra.');
  C('d4-q11','Read tool trả hồ sơ; write tool đổi địa chỉ nhận hàng. Dù cả hai cần auth, khác biệt nào quan trọng nhất khi thiết kế retry?',[
    'Read tool không cần kiểm tenant nên retry đơn giản hơn',
    'Write tool có side effect nên timeout/retry cần xử lý khả năng đã commit',
    'Read tool gọi thành công đủ để cấp quyền write cùng hồ sơ',
    'Write tool dùng JSON nên response timeout luôn nghĩa chưa ghi'],1,'Cả hai vẫn cần auth/quyền. Write timeout có bất định commit, cần idempotency/trạng thái nghiệp vụ phù hợp.');
  C('d5-q4','User hiểu AI nhưng không muốn tự động gửi email đối ngoại. Yếu tố persona nào cần phản ánh trực tiếp nhất?',[
    'Kích thước context window của model định dùng',
    'Số integration mà backend cung cấp',
    'Mức kiểm soát mong muốn và hậu quả lỗi họ chấp nhận',
    'Số mẫu few-shot trong system prompt'],2,'Persona cần mô tả nhu cầu tin cậy/kiểm soát để thiết kế draft/approval. Cấu hình kỹ thuật không thay hiểu user.');
  C('d7-q5','Corpus có “được hoàn tiền trong 30 ngày, trừ hàng đã sử dụng”. Chunk cắt mất ngoại lệ, retriever chỉ trả mệnh đề đầu. Ưu tiên thử nghiệm nào?',[
    'Tăng output limit để model tự bổ sung điều kiện',
    'Đổi judge để không phạt câu thiếu ngoại lệ',
    'Tăng temperature để answer đa dạng hơn',
    'Giữ quan hệ điều khoản–ngoại lệ bằng chunk/parent context và eval lại'],3,'Cần sửa evidence bị tách ở ingestion/context assembly. Generator hoặc evaluator không nên bù dữ liệu mất bằng suy đoán hay thay tiêu chí.');
  C('d7-q13','Hai tenant có tài liệu gần nghĩa nhưng user chỉ được đọc tenant A. Thiết kế nào trực tiếp bảo vệ phạm vi dữ liệu?',[
    'Cưỡng chế filter/quyền theo identity và metadata phù hợp trước trả context',
    'Tăng cosine threshold để chọn dữ liệu đúng tenant',
    'Prompt model bỏ qua tenant B sau khi nạp mọi kết quả',
    'Chọn chunk có ngày upload mới nhất giữa cả hai tenant'],0,'Tenant isolation không suy từ semantic similarity hay recency. Dữ liệu trái quyền không nên được cấp vào model để tự lọc.');
  C('d8-q6','Query hỏi điều kiện đổi trả và phí giao hàng, nhưng một search chỉ lấy được nguồn đổi trả. Kỹ thuật nào hợp lý để thử trước?',[
    'HyDE sinh một đáp án rồi dùng nó làm nguồn chuẩn cuối',
    'Decompose các ý cần bằng chứng, retrieve từng phần rồi hợp nhất có kiểm',
    'Dừng retrieve sau nhánh đầu vì query cùng một khách hàng',
    'Tăng độ dài answer trong khi giữ nguyên context thiếu'],1,'Decomposition nhắm vào nhiều nhu cầu evidence. Nó vẫn cần giữ intent và kiểm các phần, không biến answer giả định thành reference.');
  C('d9-q14','Agent task dài crash sau khi gửi thông báo. Có checkpoint thì có thể kết luận gì?',[
    'Mọi reasoning và tool effect trước checkpoint đều đúng',
    'Thông báo ngoài hệ tự được rollback khi resume',
    'Có thể khôi phục state theo contract; side effect cần kiểm replay/idempotency riêng',
    'Resume thread bất kỳ sẽ tự tìm đúng user và task'],2,'Checkpoint hỗ trợ state recovery, không tự xác nhận semantics hay hoàn tác external effect. Identity và execution policy vẫn cần kiểm.');
  C('d10-q9','Gate bắt buộc phát hiện thiếu trường đơn vị tiền tệ trước publish index. Fail-closed phù hợp nhất là gì?',[
    'Publish record thiếu field và nêu disclaimer trong answer',
    'Tự điền đơn vị phổ biến nhất rồi bỏ alert',
    'Chạy lại embedding với cùng dữ liệu để chờ gate pass',
    'Chặn/quarantine bản mới theo policy, giữ evidence và tuyến xử lý'],3,'Gate bắt buộc thất bại thì không tự phát tán dữ liệu lỗi. Retry embedding hay đoán đơn vị không sửa contract nguồn.');
  C('d10-q15','Backfill lặp dữ liệu hai năm khi online vẫn cần quota embedding. Thiết kế nào phù hợp nhất?',[
    'Budget/throttle có ưu tiên online, ID/version và resume chống trùng',
    'Dùng mọi worker rảnh vì backfill không phải traffic user',
    'Sinh ID mới cho mọi record mỗi lần chạy để dễ phân biệt runs',
    'Bỏ validation trong backfill vì dữ liệu cũ từng được dùng'],0,'Backfill ảnh hưởng tài nguyên và downstream như luồng khác. Cần replay semantics, quality và quota thay coi dữ liệu cũ là an toàn mặc định.');
  C('d11-q1','Output filter chặn câu trả lời nhạy cảm nhưng tool đã ghi trái quyền trước đó. Điều này chỉ ra thiếu control nào trực tiếp nhất?',[
    'Thêm từ khóa nhạy cảm vào phần trả lời cuối',
    'Authorization/business validation trước tool execution',
    'Tăng số ví dụ lịch sự trong prompt',
    'Chọn model có văn phong giải thích thận trọng hơn'],1,'Ngăn side effect cần control trước execution. Lớp output chỉ kiểm nội dung đã sinh sau tác động, không thay quyền backend.');
  C('d12-q3','Homepage 200 nhưng request AI treo vì dependency thiết yếu mất kết nối. Health probe nên được hiểu và bổ sung thế nào?',[
    'Homepage 200 đủ cho readiness nếu process còn sống',
    'Probe phải gọi mọi model/task trên mọi request health',
    'Tách liveness/readiness theo contract và thêm business probe phù hợp risk',
    'Chỉ tăng timeout health để tránh báo lỗi dependency'],2,'Liveness, readiness và E2E business evidence có phạm vi khác. Probe cần hợp risk/cost, không quá hẹp hoặc chạy mọi thứ vô điều kiện.');
  C('d14-q8','Cùng hai answers nhưng judge đổi lựa chọn mạnh khi đảo vị trí. Cách đánh giá nào giảm bias hợp lý nhất?',[
    'Giữ thứ tự ban đầu vì đã được định trước',
    'Tăng temperature judge để kết quả bớt thiên lệch',
    'Chọn thứ tự cho hệ mới điểm cao hơn vì nó là mục tiêu cải tiến',
    'Hoán vị có kiểm soát, đo agreement và dùng protocol tổng hợp rõ'],3,'Đảo vị trí kiểm tác động trình bày; lặp/đổi sampling hoặc chọn kết quả thuận lợi không sửa được bias bằng chứng.');
  C('d14-q16','Model đứng cao ở benchmark chung nhưng lỗi phân quyền trong sản phẩm. Vì sao vẫn cần eval nội bộ?',[
    'Task, data, permission và cost of error của sản phẩm cần được kiểm riêng',
    'Benchmark ngoài không thể chứa bất kỳ thông tin hữu ích nào',
    'Eval nội bộ chỉ đo latency nên không trùng benchmark',
    'Ranking cao có thể chuyển thành permission correctness bằng một hệ số cố định'],0,'Benchmark có giá trị trong phạm vi đo của nó, nhưng không chứng minh các ràng buộc riêng của sản phẩm.');

  // Thay đổi có nghĩa về điều kiện, không chỉ hoán vị để làm khác số đáp án.
  V(1,'Agent',3,'-Coi tool request đã gửi đi là đủ để báo hoàn tiền thành công','Gửi request chưa xác nhận business commit.');
  V(2,'Discovery',3,'-Ưu tiên task có demo hấp dẫn nhất mà chưa biết tần suất thực','Độ hấp dẫn demo không xác định pain hay giá trị thường gặp.');
  V(3,'ReAct',3,'-Dùng số vòng reasoning tăng làm dấu hiệu tiến triển','Thêm vòng không chứng minh xuất hiện evidence mới.');
  V(4,'Tool contract',2,'-Dùng schema đã pass thay bước kiểm ngày còn được đặt','Schema không xác nhận thời gian còn hợp lệ theo nghiệp vụ.');
  V(5,'PRD & metrics',2,'-Loại nhóm user đang giảm CSAT khỏi đánh giá vì ngoài demo chính','Loại nhóm sau khi nhìn kết quả có thể che regression của traffic thực.');
  V(6,'ROI',2,'-Bỏ effort review khỏi ROI vì reviewer vẫn đang làm công việc cũ','Effort review là chi phí thật của phương án AI.');
  V(7,'Embedding',2,'-Cắt/pad vectors cũ cho khớp dimension rồi dùng query model mới','Dimension khớp chưa làm hai không gian embedding tương thích.');
  V(8,'RAG architecture',2,'-Dùng answer model tự sinh làm reference cho chính case lỗi','Output cần chấm không tự trở thành chuẩn độc lập.');
  V(9,'MCP',3,'-Dùng cùng credential admin cho mọi server để đồng nhất discovery','Đồng nhất discovery không biện minh mở rộng quyền dữ liệu/action.');
  V(10,'Orchestration & cost',2,'-Bỏ version backfill vì mọi record đều là dữ liệu lịch sử','Dữ liệu lịch sử cũng có thể được sửa/xóa và cần provenance.');
  V(11,'Red teaming',2,'-Đếm mọi refusal là success dù request đó hợp lệ','Refusal sai là regression về usefulness.');
  V(12,'Docker & config',2,'-Sao chép thư mục venv Windows vào mọi container Linux','Runtime/dependencies còn phụ thuộc OS/architecture.');
  V(13,'AI metrics',2,'-Dùng TTFT thay toàn bộ E2E latency khi streaming','Token đầu đến sớm không xác nhận toàn task hoàn tất nhanh.');
  V(14,'Metrics',2,'-Cho semantic similarity cao bù việc không tạo booking','Text giống đáp án không thực hiện hành động ở hệ đích.');
  V(15,'Optimization',2,'-Bỏ review cost khỏi phép so để chỉ tối ưu model bill','Lỗi tăng có thể chuyển chi phí sang review/retry.');
  V(1,'Token & context',4,'+Đo quality sau mỗi policy nén/trim trước khi tăng traffic','Nén cần được kiểm bằng task, không chỉ số token giảm.');
  V(4,'Prompt techniques',4,'+Giữ budget và phân loại lỗi khi retry output không hợp lệ','Retry có ích khi có điều kiện và trần, không chọn lọc âm thầm.');
  V(7,'Hybrid & rerank',4,'+Đo cả nhóm query mã chính xác lẫn query ngữ nghĩa sau đổi','Cải thiện exact-match cần kiểm không phá nhóm semantic.');
  V(10,'Quality & contracts',4,'+Đo completeness/quality độc lập exit code job','Chạy xong và dữ liệu đầy đủ là hai điều khác nhau.');
  V(13,'Tracing',4,'+Liên kết spans bằng trace ID và version để so cùng loại request','Attribution cần cùng context so sánh, không chỉ tổng thời gian.');
  V(16,'Reflection memory',4,'-Dùng lại bài học cho domain mới trước khi kiểm điều kiện áp dụng','Bài học có thể chỉ đúng trong phạm vi nguồn đã kiểm.');
  V(17,'Token budget và trim',3,'-Chỉ đo latency để quyết định policy mới còn giữ đủ constraints','Thời gian xử lý không xác nhận nội dung quan trọng có được giữ.');
  V(18,'Retrieve rộng rồi rerank',3,'-Đổi generator trước vì evidence trong candidates chứng minh context cuối đã đúng','Candidates và context cuối là hai ranh giới khác nhau.');
  V(19,'Traversal có giới hạn',3,'-Mở rộng nhánh nhiều node nhất để tối đa bằng chứng trước khi xét intent','Fan-out lớn có thể thêm nhiễu và chi phí, không phải hỗ trợ claim.');
  V(20,'Async pools và deadline',2,'-Để task timeout tiếp tục chạy ngầm vì user đã rời trang','Tác vụ ngầm vẫn tiêu tài nguyên hoặc tạo side effect.');
  V(21,'Target modules và capacity',3,'-Tăng rank trước khi kiểm adapter đã nhận gradient hay chưa','Không có gradient đúng thì thêm capacity chưa giải căn nguyên.');
  V(22,'Preference pair chất lượng',4,'-Chấp nhận nhãn thiếu lý do ưu tiên nếu cả hai đáp án đều có phần đúng','Cặp hợp lệ cũng cần tiêu chí để nhãn không tùy hứng.');
  V(23,'Backend và persistence',3,'-Chia sẻ cùng filesystem backend cho mọi tenant để tránh mất state','Persistence không thay isolation và quyền dữ liệu.');
  V(24,'Pairwise và position bias',3,'-Giữ tên hệ nổi tiếng để judge dùng uy tín khi thiếu khác biệt nội dung','Brand là tín hiệu có thể gây bias ngoài rubric.');
  V(25,'Semantic false hit',3,'-Phục vụ answer gần nhất khi cache không chắc để tránh model call','Không chắc tương đương intent là lý do miss/fallback, không phải ép hit.');
  V(26,'Versioning và deprecation',3,'-Để client tự suy schema mới từ output trong lúc production','Client cũ cần contract/adapter hoặc lỗi rõ, không đoán tương thích.');
  V(27,'Logprob và overconfidence',3,'-Dùng approval rate cao làm nhãn confidence đã calibrated','Approval rate không trực tiếp đo correctness hoặc cost of error.');
  V(28,'Canary shadow và rollback',2,'-Chỉ giữ artifact model cũ vì các thành phần khác không cần rollback','Release có thể thay index/config/routing và cần đường quay lại phù hợp.');
  V(16,'Vòng Reflexion',3,'+Giữ grader độc lập khi đánh giá liệu feedback có giúp attempt mới','Feedback loop cần phép kiểm không bị actor tự sửa.');
  V(17,'Checkpoint và Store',3,'+Kiểm tác động ngoài graph riêng với state đã restore','State recovery không đảo side effect nghiệp vụ.');
  V(18,'CDC upsert và delete',4,'+Đánh giá replay/out-of-order trong pipeline đồng bộ','Đồng bộ cần đúng cả khi sự kiện lặp hoặc đến muộn.');
  V(19,'Textualization giữ bằng chứng',3,'+Giữ liên kết từ claim trở lại cạnh và đoạn nguồn hỗ trợ','Câu trả lời cần truy được evidence, không chỉ đường node.');
  V(20,'Supervisor và handoff',4,'+Truyền nguyên nhân thiếu dữ liệu khi giao lại task','Giữ error context giúp tuyến mới tránh lặp cùng thất bại.');
  V(21,'Loss masking và labels',2,'+Kiểm loss từng vùng token thay chỉ tổng loss','Phân rã giúp thấy phần prompt/answer đang được thưởng sai.');
  V(22,'ORPO objective kết hợp',2,'+So loss components và behavior khi chọn cấu hình ORPO','Một objective kết hợp vẫn cần kiểm từng tín hiệu và outcome.');
  V(23,'Durability và checkpointer',2,'+Test process restart thật với backend và thread dự kiến','Có object trong code chưa chứng minh đã commit state bền.');
  V(24,'NLI và semantic entropy',2,'+Giữ uncertainty score tách với evidence kiểm claim','Hai loại tín hiệu bổ sung nhau, không bảo đảm correctness trực tiếp.');
  V(25,'Gateway và fallback ladder',3,'+Kiểm schema/tool behavior thực của provider dự phòng','Cùng tên model không bảo đảm cùng interface/semantics.');
  V(26,'MCP authentication authorization',2,'+Phân biệt token hợp lệ với scope/audience đáp ứng resource','Xác thực và quyền không phải cùng một phép kiểm.');
  V(27,'Hard rules và confidence routing',2,'+Tách policy quyền khỏi confidence của model','Model tự tin hơn không mở rộng scope được cấp.');
  V(28,'GeoAI preprocessing và temporal baseline',3,'+Kiểm uncertainty sau preprocessing và evidence bổ sung','Ảnh được chuẩn hóa vẫn có thể không đủ quan sát để kết luận.');

  // Một số câu dùng 4 trong 5 mệnh đề đã biên soạn để phân bố số lựa chọn/đáp án.
  // Chỉ bỏ một phương án khi còn ít nhất hai đúng và một nhiễu; không đảo nhãn.
  for(const q of patches.values())if(q.type==='multi'){
    let h=2166136261;for(const c of q.id){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}
    if((h>>>0)%2===0){
      const remove=(h>>>4)%q.options.length,remaining=q.answers.length-(q.answers.includes(remove)?1:0);
      if(remaining>=2&&remaining<q.options.length-1){q.options=q.options.filter((_,i)=>i!==remove);q.answers=q.answers.filter(i=>i!==remove).map(i=>i>remove?i-1:i);}
    }
  }

  window.QUESTION_ARCHIVE=original;
  window.QUESTION_REPLACEMENTS=Object.fromEntries([...patches].map(([id,q])=>[id,q.id]));
  window.QUESTION_REVISION='reasoning-v2';
  for(const l of lessons)l.questions=l.questions.map(q=>patches.get(q.id)||{...q,level:q.scenario?'apply':'concept'});
  const previousCards=window.STUDY_COURSE?.flashcards||window.PHASE1_FLASHCARDS;
  const cards=lessons.flatMap(l=>l.questions.map(q=>{
    const old=previousCards.find(c=>c.questionId===(q.previousId||q.id));
    return {...old,id:`card-${q.id}`,questionId:q.id,day:l.day,topic:q.topic,
      front:q.cardFront||q.prompt,source:q.source,
      answer:q.type==='essay'?q.sample:(q.type==='multi'?q.answers:[q.answer]).map(i=>q.options[i]).join(' • '),
      explanation:q.type==='essay'?old.explanation:q.why,level:q.level};
  }));
  if(window.STUDY_COURSE)window.STUDY_COURSE.flashcards=cards;else window.PHASE1_FLASHCARDS=cards;
  for(const unit of window.TRACK3_COVERAGE||[])unit.questionIds=unit.questionIds.map(id=>patches.get(id)?.id||id);
})();
