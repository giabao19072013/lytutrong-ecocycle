import React, { useState, useEffect } from 'react';
import { useAppState } from '../data/StateContext';
import { Play, TrendingUp, HelpCircle, Trees, Info, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const SimulationModel: React.FC = () => {
  const { flows, outputs, updateOutputProduct, addLogEntry } = useAppState();

  const [selectedFlowId, setSelectedFlowId] = useState(flows[0]?.id || '');
  const [inputMass, setInputMass] = useState<number>(20); // Mặc định 20kg như ví dụ

  const activeFlow = flows.find(f => f.id === selectedFlowId) || flows[0];

  // Các bước tính toán mô phỏng dựa vào khối lượng đầu vào
  const [simulatedSteps, setSimulatedSteps] = useState<{ label: string; mass: number }[]>([]);
  const [finalOutput, setFinalOutput] = useState<number>(0);
  const [impactArea, setImpactArea] = useState<number>(0);

  // Hiệu ứng lưu thành phẩm mô phỏng
  const [showSimSuccess, setShowSimSuccess] = useState(false);

  useEffect(() => {
    if (!activeFlow) return;

    // Tính toán chuỗi suy giảm khối lượng qua các bước
    const stepsData = activeFlow.steps.map((step, idx) => {
      const rate = activeFlow.lossRates[idx] || 1.0;
      let calculatedMass = 0;

      if (rate >= 1000) {
        // Hệ số nhân tiền tệ (ví dụ 10000đ/kg)
        calculatedMass = inputMass * (rate / 10000) * 10000;
      } else {
        // Tỷ lệ khối lượng thường
        calculatedMass = inputMass * rate;
      }

      return {
        label: step.label,
        mass: Math.round(calculatedMass * 10) / 10
      };
    });

    setSimulatedSteps(stepsData);

    // Thành phẩm cuối cùng ở bước áp chót/cuối
    const finalStepVal = stepsData[stepsData.length - 2]?.mass || stepsData[stepsData.length - 1]?.mass || 0;
    setFinalOutput(finalStepVal);

    // Tính diện tích bón cây xanh hoặc lợi ích tương ứng
    // Ví dụ: 1kg Compost bón được 31.25m² cây xanh (8kg Compost -> bón 250m² cây xanh)
    if (activeFlow.outputName === 'Compost') {
      setImpactArea(Math.round(finalStepVal * 31.25));
    } else {
      setImpactArea(Math.round(finalStepVal * 1.5));
    }

  }, [activeFlow, inputMass]);

  const handleApplySimulation = () => {
    if (!activeFlow) return;

    // Cộng sản phẩm mô phỏng vào kho của Trường học
    let outputId = 'op1'; // Compost dinh dưỡng
    if (activeFlow.outputName === 'Quỹ xanh') outputId = 'op2'; // Giấy vụn ép kiện (bán)
    else if (activeFlow.outputName.includes('Quà xanh')) outputId = 'op3'; // Chai nhựa

    const currentOutput = outputs.find(o => o.id === outputId);
    if (currentOutput) {
      if (outputId === 'op2') {
        // Bán luôn thu tiền mặt quỹ
        const revenueAdd = finalOutput; // Quỹ tiền VNĐ
        updateOutputProduct(outputId, {
          totalProduced: currentOutput.totalProduced + inputMass,
          sold: currentOutput.sold + inputMass,
          revenue: currentOutput.revenue + revenueAdd
        });
      } else {
        // Cộng dồn vào sản xuất
        updateOutputProduct(outputId, {
          totalProduced: currentOutput.totalProduced + finalOutput
        });
      }

      // Thêm nhật ký xử lý rác thải
      addLogEntry({
        date: new Date().toISOString().split('T')[0],
        byproductName: activeFlow.byproductType,
        mass: inputMass,
        status: `Đã xử lý ra ${finalOutput} ${activeFlow.outputUnit} ${activeFlow.outputName}`,
        handler: 'Hệ thống mô phỏng'
      });

      setShowSimSuccess(true);
      setTimeout(() => setShowSimSuccess(false), 5000);
    }
  };

  return (
    <div className="space-y-6" id="simulation-model-section">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
            🔮 Mô phỏng tính toán quy trình động
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Nhập lượng rác đầu vào để tính toán chính xác sản lượng, chi phí và lợi ích môi trường sau xử lý tức thì.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-600 shrink-0">Chọn quy trình:</label>
          <select
            value={selectedFlowId}
            onChange={e => setSelectedFlowId(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-emerald-500 text-gray-700 cursor-pointer"
          >
            {flows.map((flow) => (
              <option key={flow.id} value={flow.id}>{flow.name}</option>
            ))}
          </select>
        </div>
      </div>

      {showSimSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold"
        >
          🚀 Đã xuất thành quả mô phỏng vào cơ sở dữ liệu thực tế của trường! Nhật ký xử lý và kho sản phẩm đầu ra đã được đồng bộ tăng trưởng.
        </motion.div>
      )}

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cấu hình đầu vào (4 phần) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="font-display font-extrabold text-gray-800 text-base">⚙️ Tham số Đầu Vào</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Bạn có thể điều chỉnh thanh trượt hoặc số lượng để thấy phản ứng dây chuyền ở sơ đồ mô phỏng bên phải.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Input Byproduct badge display */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100/50">
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Phụ phẩm áp dụng</span>
              <span className="font-display font-extrabold text-xl text-emerald-900 mt-1 block">
                {activeFlow?.byproductType || 'Chưa rõ'}
              </span>
            </div>

            {/* Numeric input and slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span className="font-bold">Khối lượng nạp vào</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded-md font-bold text-gray-800">{inputMass} kg</span>
              </div>
              <input
                type="range"
                min="1"
                max="250"
                step="1"
                value={inputMass}
                onChange={e => setInputMass(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                <span>1 kg</span>
                <span>100 kg</span>
                <span>250 kg</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">Hoặc nhập số liệu chính xác:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={inputMass}
                  onChange={e => setInputMass(Math.max(0.1, Number(e.target.value)))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-emerald-500 text-gray-700"
                />
                <span className="bg-gray-100 text-gray-500 px-3 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center border border-gray-200">
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* Environmental impacts summary in left box */}
          <div className="bg-emerald-950 text-emerald-200 p-5 rounded-2xl space-y-4">
            <h4 className="font-display font-bold text-xs flex items-center gap-1">
              <Trees className="w-4 h-4 text-emerald-400" /> Tác động môi trường ước tính
            </h4>
            
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-emerald-400/80 text-[10px] block uppercase">Ủ hoai Compost bón cho:</span>
                <strong className="text-white text-base font-extrabold">{impactArea} m²</strong> <span className="text-[10px] text-emerald-300">cây xanh vườn trường</span>
              </div>
              <div>
                <span className="text-emerald-400/80 text-[10px] block uppercase">Khí CO₂ tránh phát tán:</span>
                <strong className="text-white text-base font-extrabold">{Math.round(inputMass * 2)} kg</strong> <span className="text-[10px] text-emerald-300">khí nhà kính</span>
              </div>
            </div>

            <button
              onClick={handleApplySimulation}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
            >
              <Play className="w-3.5 h-3.5" /> Ghi nhận áp dụng thực tế
            </button>
          </div>
        </div>

        {/* Cột phải: Sơ đồ dòng chảy dữ liệu (8 phần) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-display font-bold text-gray-800 text-base flex items-center gap-1.5">
                🌊 Pipeline Dòng Chảy Tuần Hoàn
              </h3>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-md">
                Tỷ lệ bảo toàn động
              </span>
            </div>
            <p className="text-gray-400 text-xs">
              Mô tả quy trình thu gom, hao hụt cơ học và chuyển hóa chất lượng rác thải hữu cơ/tái chế qua từng chặng:
            </p>

            {/* Visual nodes connectors representing the flow values */}
            <div className="space-y-6 pt-4 relative">
              
              {/* Connecting line on background */}
              <div className="absolute left-6 top-8 bottom-8 w-1 bg-emerald-100 -z-0"></div>

              {simulatedSteps.map((step, idx) => {
                const isLast = idx === simulatedSteps.length - 1;
                const isFirst = idx === 0;
                
                // Trọng lượng hiển thị đẹp
                const formattedMass = activeFlow.outputUnit === 'đ' && idx === simulatedSteps.length - 1
                  ? `${step.mass.toLocaleString()}đ`
                  : `${step.mass} ${isLast ? activeFlow.outputUnit : 'kg'}`;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 relative z-10"
                  >
                    {/* Ring dot indicator */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 shrink-0 ${
                      isFirst ? 'bg-emerald-600 border-emerald-500 text-white' : 
                      isLast ? 'bg-amber-500 border-amber-400 text-white animate-pulse' : 'bg-white border-emerald-300 text-emerald-800 shadow-3xs'
                    }`}>
                      {idx + 1}
                    </div>

                    {/* Content Box */}
                    <div className="flex-1 bg-gray-50 hover:bg-emerald-50/20 border border-gray-200/80 p-4 rounded-xl flex items-center justify-between transition-all">
                      <div>
                        <span className="text-xs font-black text-gray-800 block">{step.label}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {isFirst ? 'Bắt đầu nạp rác' : isLast ? `Thành phẩm hữu ích` : `Hiệu suất tích lũy: ${Math.round((step.mass / inputMass) * 100)}%`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono text-sm font-extrabold ${isLast ? 'text-amber-600 text-base' : 'text-emerald-700'}`}>
                          {formattedMass}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-2.5 mt-8">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 leading-relaxed">
              <strong>Hao hụt sinh khối:</strong> Ủ phân Compost sinh học bị hao hụt lên tới 60% do sự bay hơi của nước và giải phóng khí cacbonic trong quá trình hiếu khí. Đây là điều kiện tự nhiên để tạo mùn bền vững có hàm lượng nitơ, kali, photpho cao nhất.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
