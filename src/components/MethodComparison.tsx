import React, { useState } from 'react';
import { useAppState } from '../data/StateContext';
import { Sparkles, BarChart2, Scale, Info, DollarSign, Leaf, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const MethodComparison: React.FC = () => {
  const { compareMethods } = useAppState();
  const [selectedTypeId, setSelectedTypeId] = useState(compareMethods[0]?.id || 'cm1');

  const activeCompare = compareMethods.find(m => m.id === selectedTypeId) || compareMethods[0];

  const formatCurrency = (val: number) => {
    return val === 0 ? '0 đ' : `${val.toLocaleString()} đ`;
  };

  return (
    <div className="space-y-6" id="method-comparison-section">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
            ⚖️ So sánh hiệu quả các phương án xử lý
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Bảng phân tích kinh tế, tài chính và lợi ích môi trường trực quan giúp Ban giám hiệu và học sinh lựa chọn quy trình tối ưu nhất.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 shrink-0">Loại phụ phẩm:</label>
          <select
            value={selectedTypeId}
            onChange={e => setSelectedTypeId(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-emerald-500 text-gray-700 cursor-pointer"
          >
            {compareMethods.map((cm) => (
              <option key={cm.id} value={cm.id}>{cm.byproductType}</option>
            ))}
          </select>
        </div>
      </div>

      {activeCompare && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Cột trái: So sánh chi tiết thẻ (8 phần) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Phương án A: Tuần hoàn hữu ích */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              {/* Highlight badge */}
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Khuyên dùng 🌱
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center justify-center border border-emerald-100">A</span>
                  <h3 className="font-display font-bold text-base text-emerald-800">{activeCompare.methodA.name}</h3>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <span className="text-gray-400 font-semibold text-[10px] block uppercase">Các bước thực hiện</span>
                    <ul className="list-inside list-disc text-gray-700 mt-1 space-y-1">
                      {activeCompare.methodA.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/30">
                      <span className="text-emerald-700/70 font-semibold text-[9px] block uppercase">Chi phí ước tính</span>
                      <strong className="text-emerald-900 text-sm font-bold block mt-0.5">
                        {formatCurrency(activeCompare.methodA.cost)}
                      </strong>
                    </div>
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/30">
                      <span className="text-emerald-700/70 font-semibold text-[9px] block uppercase">Lợi nhuận đóng góp</span>
                      <strong className="text-emerald-900 text-sm font-bold block mt-0.5">
                        {formatCurrency(activeCompare.methodA.profit)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Hiệu quả thu hồi / xử lý:</span>
                  <strong className="text-emerald-600 font-extrabold">{activeCompare.methodA.efficiency}%</strong>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${activeCompare.methodA.efficiency}%` }} />
                </div>
                <p className="text-[11px] text-gray-500 italic mt-2 leading-relaxed bg-emerald-50/20 p-2.5 rounded-lg border border-emerald-100/10">
                  {activeCompare.methodA.benefitText}
                </p>
              </div>
            </motion.div>

            {/* Phương án B: Xử lý truyền thống */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg flex items-center justify-center border border-gray-200">B</span>
                  <h3 className="font-display font-bold text-base text-gray-700">{activeCompare.methodB.name}</h3>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <span className="text-gray-400 font-semibold text-[10px] block uppercase">Các bước thực hiện</span>
                    <ul className="list-inside list-disc text-gray-600 mt-1 space-y-1">
                      {activeCompare.methodB.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/50">
                      <span className="text-gray-500 font-semibold text-[9px] block uppercase">Chi phí ước tính</span>
                      <strong className="text-gray-800 text-sm font-bold block mt-0.5">
                        {formatCurrency(activeCompare.methodB.cost)}
                      </strong>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/50">
                      <span className="text-gray-500 font-semibold text-[9px] block uppercase">Lợi nhuận đóng góp</span>
                      <strong className="text-gray-800 text-sm font-bold block mt-0.5">
                        {formatCurrency(activeCompare.methodB.profit)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Hiệu quả thu hồi / xử lý:</span>
                  <strong className="text-rose-500 font-extrabold">{activeCompare.methodB.efficiency}%</strong>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-400 h-2 rounded-full" style={{ width: `${activeCompare.methodB.efficiency}%` }} />
                </div>
                <p className="text-[11px] text-gray-500 italic mt-2 leading-relaxed bg-rose-50/10 p-2.5 rounded-lg border border-rose-100/10">
                  {activeCompare.methodB.benefitText}
                </p>
              </div>
            </motion.div>

          </div>

          {/* Cột phải: Thống kê so sánh vĩ mô bằng thanh đo trực quan (4 phần) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-display font-extrabold text-gray-800 text-sm flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <BarChart2 className="w-4 h-4 text-emerald-600" /> Biểu Đồ Đối Sánh Trực Quan
              </h3>
              <p className="text-gray-400 text-xs">Phân tích chênh lệch trực diện của 2 phương pháp trên toàn bộ chỉ số vận hành:</p>

              {/* Bar 1: Hiệu Quả Môi Trường */}
              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex justify-between font-bold text-gray-700">
                  <span>Hiệu suất thu hồi dinh dưỡng/vật liệu</span>
                  <span className="text-emerald-600">+{activeCompare.methodA.efficiency - activeCompare.methodB.efficiency}%</span>
                </div>
                <div className="h-6 bg-gray-100 rounded-lg flex overflow-hidden border border-gray-200">
                  <div 
                    className="bg-emerald-500 h-full text-[9px] text-white font-bold flex items-center justify-center transition-all" 
                    style={{ width: `${(activeCompare.methodA.efficiency / (activeCompare.methodA.efficiency + activeCompare.methodB.efficiency)) * 100}%` }}
                  >
                    Mẫu A ({activeCompare.methodA.efficiency}%)
                  </div>
                  <div 
                    className="bg-rose-400 h-full text-[9px] text-white font-bold flex items-center justify-center transition-all" 
                    style={{ width: `${(activeCompare.methodB.efficiency / (activeCompare.methodA.efficiency + activeCompare.methodB.efficiency)) * 100}%` }}
                  >
                    Mẫu B ({activeCompare.methodB.efficiency}%)
                  </div>
                </div>
              </div>

              {/* Bar 2: Chi Phí Tiêu Tốn */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-gray-700">
                  <span>Chi phí tiền mặt hàng tháng (Thấp hơn là tốt)</span>
                  <span className="text-emerald-600">Tiết kiệm {formatCurrency(Math.abs(activeCompare.methodA.cost - activeCompare.methodB.cost))}</span>
                </div>
                <div className="h-6 bg-gray-100 rounded-lg flex overflow-hidden border border-gray-200">
                  <div 
                    className="bg-emerald-500 h-full text-[9px] text-white font-bold flex items-center justify-center transition-all" 
                    style={{ width: `${(activeCompare.methodB.cost / (activeCompare.methodA.cost + activeCompare.methodB.cost)) * 100}%` }} // Nghịch đảo vì càng bé càng tốt
                  >
                    Mẫu A ({formatCurrency(activeCompare.methodA.cost)})
                  </div>
                  <div 
                    className="bg-rose-400 h-full text-[9px] text-white font-bold flex items-center justify-center transition-all" 
                    style={{ width: `${(activeCompare.methodA.cost / (activeCompare.methodA.cost + activeCompare.methodB.cost)) * 100}%` }}
                  >
                    Mẫu B ({formatCurrency(activeCompare.methodB.cost)})
                  </div>
                </div>
              </div>

              {/* Bar 3: Lợi nhuận sinh hoạt */}
              {activeCompare.byproductType === 'Giấy vụn' && (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-gray-700">
                    <span>Doanh thu / Quỹ xanh mang lại</span>
                    <span className="text-emerald-600">+{formatCurrency(activeCompare.methodA.profit - activeCompare.methodB.profit)}</span>
                  </div>
                  <div className="h-6 bg-gray-100 rounded-lg flex overflow-hidden border border-gray-200">
                    <div 
                      className="bg-emerald-500 h-full text-[9px] text-white font-bold flex items-center justify-center transition-all" 
                      style={{ width: '85%' }}
                    >
                      Mẫu A ({formatCurrency(activeCompare.methodA.profit)})
                    </div>
                    <div 
                      className="bg-rose-400 h-full text-[9px] text-white font-bold flex items-center justify-center transition-all" 
                      style={{ width: '15%' }}
                    >
                      Mẫu B ({formatCurrency(activeCompare.methodB.profit)})
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                <strong>Kết luận hội đồng:</strong> Phương án <strong>Tuần hoàn nội bộ (Mẫu A)</strong> mang lại tỷ số lợi ích chi phí cao hơn hẳn nhờ tiết giảm tiền mặt thuê ngoài thu gom rác thô, đồng thời tạo cơ hội trải nghiệm thực tế sinh động cho học sinh Lý Tự Trọng.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
