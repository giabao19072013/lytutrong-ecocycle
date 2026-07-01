import React from 'react';
import { useAppState } from '../data/StateContext';
import { ScorePeriod } from '../types';
import { Award, CheckCircle, Info, Leaf, HelpCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const GreenScore: React.FC = () => {
  const { scores, activePeriod, setActivePeriod } = useAppState();
  const currentScore = scores[activePeriod];

  const handlePeriodChange = (p: ScorePeriod) => {
    setActivePeriod(p);
  };

  const getRank = (score: number) => {
    if (score >= 90) return { label: 'XẠNG A+ TRƯỜNG HỌC XANH TIÊU BIỂU 🌟', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 80) return { label: 'HẠNG A TRƯỜNG HỌC THÂN THIỆN MÔI TRƯỜNG 🌿', color: 'text-green-700 bg-green-50 border-green-200' };
    return { label: 'HẠNG B ĐANG HOÀN THIỆN TUẦN HOÀN 🍃', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  };

  const rank = getRank(currentScore.totalScore);

  return (
    <div className="space-y-6" id="green-score-section">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
            🌱 Tính điểm thi đua "Trường học xanh" (Green Score)
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">Công thức tự động cộng điểm liên hoàn dựa trên tỷ số rác giải cứu, phân bón bón cây học đường.</p>
        </div>

        {/* Period Selector */}
        <div className="bg-gray-100 p-1 rounded-xl flex border border-gray-200 self-start md:self-auto">
          {(['month', 'semester', 'year'] as ScorePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                activePeriod === p 
                  ? 'bg-white text-emerald-800 shadow-xs' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {p === 'month' ? 'Tháng 7' : p === 'semester' ? 'Học kỳ I' : 'Cả năm'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Số điểm to bự bên trái (4 phần) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">CHỈ SỐ TOÀN DIỆN</span>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Background score ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
              <circle 
                cx="50" cy="50" r="42" 
                stroke="#10b981" strokeWidth="8" fill="transparent"
                strokeDasharray="263.8"
                strokeDashoffset={263.8 - (263.8 * currentScore.totalScore) / 100}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-display font-black text-gray-800">{currentScore.totalScore}</span>
              <span className="text-[10px] text-gray-400 font-bold">/ 100 Điểm</span>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border text-[10px] font-bold text-center ${rank.color}`}>
            {rank.label}
          </div>

          <p className="text-[11px] text-gray-400 italic">Tính toán lại lần cuối: Cách đây vài giây</p>
        </div>

        {/* Chi tiết tính điểm bên phải (8 phần) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="font-display font-bold text-gray-800 text-sm border-b border-gray-50 pb-2">
            📊 Phân rã cấu trúc các tiêu chí thành phần
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tiêu chí 1 */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/50 flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-bold">Tỷ lệ rác tái sử dụng (40% trọng số)</span>
                <p className="text-lg font-black text-gray-800">{currentScore.reuseRate}%</p>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Đã vượt hạn mức tối thiểu (75%)
                </span>
              </div>
            </div>

            {/* Tiêu chí 2 */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/50 flex items-start gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-bold">Giảm thiểu rác thải chôn lấp</span>
                <p className="text-lg font-black text-gray-800">{currentScore.wasteReduced} kg</p>
                <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Tránh được xe chở rác công cộng
                </span>
              </div>
            </div>

            {/* Tiêu chí 3 */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/50 flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-bold">Phân compost tạo thành phẩm</span>
                <p className="text-lg font-black text-gray-800">{currentScore.compostProduced} kg</p>
                <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Đóng bao mùn hoai cơ học thành công
                </span>
              </div>
            </div>

            {/* Tiêu chí 4 */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/50 flex items-start gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-bold">Diện tích thảm xanh thụ hưởng</span>
                <p className="text-lg font-black text-gray-800">{currentScore.gardenedArea} m²</p>
                <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Thảm cỏ bồi bổ chất mùn tự nhiên
                </span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-2 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Công thức quy đổi điểm xanh Lý Tự Trọng:</strong> Toàn bộ điểm số được theo dõi tự động dựa theo chỉ số phân loại rác hữu cơ tại nguồn, thể tích chai nhựa nén ép, và tổng diện tích thảm xanh vườn trường được bón bồi bổ phân compost định kỳ.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
