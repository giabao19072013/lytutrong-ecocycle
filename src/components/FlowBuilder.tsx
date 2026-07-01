import React, { useState } from 'react';
import { useAppState } from '../data/StateContext';
import { Flow, FlowStep } from '../types';
import { ArrowDown, Plus, Trash2, Check, BookOpen, Save, Layers, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const FlowBuilder: React.FC = () => {
  const { flows, addFlow, deleteFlow } = useAppState();

  const [byproductType, setByproductType] = useState('Lá cây');
  const [flowName, setFlowName] = useState('Quy trình xử lý tự chế');
  const [selectedSteps, setSelectedSteps] = useState<FlowStep[]>([
    { id: '1', label: 'Thu gom', description: 'Gom phụ phẩm tại bãi tập kết' },
    { id: '2', label: 'Phân loại', description: 'Tách biệt tạp chất hữu cơ và vô cơ' }
  ]);

  const [outputUnit, setOutputUnit] = useState('kg');
  const [outputName, setOutputName] = useState('Phân hữu cơ');
  const [successMessage, setSuccessMessage] = useState('');

  // Sẵn sàng các thư viện Block/Node để chọn
  const BLOCK_LIBRARY: FlowStep[] = [
    { id: 'lib_tg', label: 'Thu gom', description: 'Thu thập rác từ các khu vực trong trường' },
    { id: 'lib_pl', label: 'Phân loại', description: 'Tách rời rác hữu cơ, giấy, nhựa và tạp chất' },
    { id: 'lib_uc', label: 'Ủ Compost', description: 'Ủ lá/cỏ hoai mục với men vi sinh khử mùi' },
    { id: 'lib_ek', label: 'Ép kiện', description: 'Đóng gói nén giấy/nhựa thành bánh lưu kho' },
    { id: 'lib_b', label: 'Bán phế liệu', description: 'Chuyển giao cho cơ sở thu mua tái chế lấy kinh phí' },
    { id: 'lib_qx', label: 'Quỹ xanh', description: 'Ghi nhận doanh thu đóng góp phong trào xanh của trường' },
    { id: 'lib_bc', label: 'Bón cây', description: 'Bồi bổ dinh dưỡng trực tiếp cho đất và thảm xanh trường học' },
    { id: 'lib_er', label: 'Súc rửa', description: 'Làm sạch chất lỏng cặn còn dính trong chai lọ nhựa' },
    { id: 'lib_ct', label: 'Chế tác STEM', description: 'Học sinh sáng tạo làm chậu cây, đồ dùng dạy học từ nhựa' },
    { id: 'lib_bg', label: 'Ủ Biogas', description: 'Ủ thức ăn thừa lên men tạo khí đốt nấu ăn tại căn tin' }
  ];

  // Thêm một bước vào chuỗi quy trình hiện tại
  const addStepToFlow = (step: FlowStep) => {
    const newStepInstance = {
      ...step,
      id: 'step_' + Math.random().toString(36).substr(2, 9)
    };
    setSelectedSteps([...selectedSteps, newStepInstance]);
  };

  // Loại bỏ một bước khỏi chuỗi quy trình
  const removeStepFromFlow = (index: number) => {
    setSelectedSteps(selectedSteps.filter((_, i) => i !== index));
  };

  const handleSaveFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSteps.length < 2) {
      alert('Sơ đồ quy trình cần có ít nhất 2 bước trở lên!');
      return;
    }

    // Thiết lập tỷ lệ suy giảm giả định qua các bước (lossRates)
    // Ví dụ: Bước đầu tiên luôn 1.0, mỗi bước tiếp theo giảm đều 10% trừ khi là "Ủ Compost" thì giảm 60%
    const lossRates = selectedSteps.map((step, idx) => {
      if (idx === 0) return 1.0;
      if (step.label.includes('Ủ Compost')) return 0.4;
      if (step.label.includes('Quỹ xanh') || step.label.includes('Bán')) return 10000; // Hệ số tiền
      return 0.9 - (idx * 0.05); // Giảm dần bảo toàn
    });

    addFlow({
      name: flowName,
      byproductType,
      steps: selectedSteps,
      lossRates,
      outputUnit,
      outputName
    });

    setSuccessMessage('🎉 Quy trình đã được thiết kế và lưu trữ thành công! Hãy chuyển sang Tab "Mô phỏng" để xem kết quả tính toán.');
    setTimeout(() => setSuccessMessage(''), 6000);

    // Reset form
    setFlowName('Quy trình xử lý tự chế');
    setSelectedSteps([
      { id: '1', label: 'Thu gom', description: 'Gom phụ phẩm tại bãi tập kết' },
      { id: '2', label: 'Phân loại', description: 'Tách biệt tạp chất hữu cơ và vô cơ' }
    ]);
  };

  return (
    <div className="space-y-6" id="flow-builder-section">
      {/* Overview Block */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
          ⚙️ Thiết kế quy trình tuần hoàn (Flow Builder)
        </h2>
        <p className="text-gray-400 text-xs mt-1">
          Học sinh tự thiết kế chuỗi liên hoàn từ nguồn rác thải đầu vào đến đầu ra bằng cách click chọn các khối chức năng trực quan dưới đây.
        </p>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cột trái: Thư viện Block (4 phần) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Thư viện Khối Chức Năng
            </h3>
            <p className="text-gray-400 text-[11px]">Bấm vào một khối chức năng dưới đây để ghép vào chuỗi xử lý tuần hoàn của trường:</p>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {BLOCK_LIBRARY.map((block) => (
                <button
                  key={block.id}
                  onClick={() => addStepToFlow(block)}
                  className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all flex justify-between items-center cursor-pointer group"
                >
                  <div>
                    <span className="font-semibold text-xs text-gray-700 block group-hover:text-emerald-800">{block.label}</span>
                    <span className="text-[10px] text-gray-400 line-clamp-1">{block.description}</span>
                  </div>
                  <span className="text-[10px] bg-gray-50 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-700 font-bold px-2 py-1 rounded-md shrink-0">
                    + Ghép
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick presets helper */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-5 rounded-2xl text-white space-y-3 shadow-xs">
            <h4 className="font-display font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Gợi ý STEM &amp; Thực tế
            </h4>
            <p className="text-[11px] text-emerald-100 leading-relaxed">
              Mô hình tuần hoàn không có rác thải bỏ đi. Một chu trình khép kín tối ưu nên bắt đầu bằng <strong>Thu gom</strong>, phân loại cơ học, xử lý hóa sinh và kết thúc bằng việc <strong>tái bón</strong> hoặc <strong>gây quỹ học đường</strong>.
            </p>
          </div>
        </div>

        {/* Cột phải: Canvas lắp ghép & cấu hình đầu ra (8 phần) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <form onSubmit={handleSaveFlow} className="space-y-6 flex-1">
            
            {/* Cấu hình chung quy trình */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Tên quy trình tuần hoàn</label>
                <input
                  type="text"
                  required
                  value={flowName}
                  onChange={e => setFlowName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-emerald-500 font-semibold"
                  placeholder="Ví dụ: Quy trình ủ phân Compost vi sinh Lý Tự Trọng"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Loại phụ phẩm áp dụng</label>
                <select
                  value={byproductType}
                  onChange={e => setByproductType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-emerald-500 font-semibold"
                >
                  <option value="Lá cây">Lá cây</option>
                  <option value="Cỏ cắt">Cỏ cắt</option>
                  <option value="Giấy vụn">Giấy vụn</option>
                  <option value="Chai nhựa">Chai nhựa</option>
                  <option value="Lon nhôm">Lon nhôm</option>
                  <option value="Thức ăn thừa">Thức ăn thừa</option>
                </select>
              </div>
            </div>

            {/* Canvas lắp ráp quy trình (Sơ đồ dọc) */}
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>SƠ ĐỒ CHUỖI QUY TRÌNH HIỆN TẠI</span>
                <span className="text-[10px] text-gray-400 capitalize normal-case font-normal">Sắp xếp theo thứ tự chảy từ trên xuống</span>
              </h4>

              <div className="bg-slate-50 border border-gray-200 p-6 rounded-xl flex flex-col items-center justify-center space-y-4 min-h-[220px]">
                {selectedSteps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <div className="w-full max-w-sm bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between relative group hover:border-emerald-500 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{step.label}</p>
                          <p className="text-[10px] text-gray-400 line-clamp-1">{step.description}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStepFromFlow(idx)}
                        className="text-gray-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer opacity-40 group-hover:opacity-100"
                        title="Xóa bước này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {idx < selectedSteps.length - 1 && (
                      <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <ArrowDown className="w-4 h-4 text-emerald-500" />
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}

                {selectedSteps.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center text-gray-400 py-8 space-y-1.5">
                    <HelpCircle className="w-8 h-8 text-gray-300" />
                    <p className="text-xs font-medium">Bấm chọn các khối bên trái để bắt đầu lập quy trình!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cấu hình sản phẩm thu được cuối quy trình */}
            <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-800 mb-1">Tên sản phẩm đầu ra</label>
                <input
                  type="text"
                  required
                  value={outputName}
                  onChange={e => setOutputName(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-xs focus:outline-emerald-500 text-gray-800"
                  placeholder="Ví dụ: Compost hoai mịn, Sen đá mầm..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-800 mb-1">Đơn vị đo lường</label>
                <select
                  value={outputUnit}
                  onChange={e => setOutputUnit(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-xs focus:outline-emerald-500 text-gray-800"
                >
                  <option value="kg">kg (Kilôgam)</option>
                  <option value="đ">đ (Đồng - Quỹ xanh)</option>
                  <option value="phần">phần (Quà quy đổi)</option>
                  <option value="lít">lít (Biogas lỏng)</option>
                </select>
              </div>
            </div>

            {/* Lưu nút */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-sm flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" /> Lưu quy trình mới thiết kế
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Hiển thị các quy trình đang lưu */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b border-gray-50 pb-2">
          <BookOpen className="w-4 h-4 text-emerald-600" /> Thư mục quy trình tuần hoàn đã lưu ({flows.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flows.map((flow) => (
            <div key={flow.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-xs text-gray-800 leading-normal">{flow.name}</h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {flow.byproductType}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc chắn muốn xóa quy trình "${flow.name}"?`)) {
                          deleteFlow(flow.id);
                        }
                      }}
                      className="text-gray-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-md transition-all cursor-pointer"
                      title="Xóa quy trình"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Sản phẩm đầu ra: <strong>{flow.outputName} ({flow.outputUnit})</strong></p>
              </div>

              {/* Sơ đồ ngang nhỏ */}
              <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar text-[10px] text-gray-500 font-medium">
                {flow.steps.map((st, i) => (
                  <span key={st.id || i} className="flex items-center gap-1">
                    <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded-md shadow-3xs shrink-0">{st.label}</span>
                    {i < flow.steps.length - 1 && <span className="text-emerald-400 font-bold shrink-0">&rarr;</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
