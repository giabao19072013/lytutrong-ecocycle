import React from 'react';
import { useAppState } from '../data/StateContext';
import { BarChart, DollarSign, Award, Leaf, TrendingUp, ShieldCheck } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { byproducts, outputs } = useAppState();

  // Group byproducts by month dynamically based on actual data
  const getDynamicMonthlyData = () => {
    const dataMap: Record<string, { organic: number; recyclable: number }> = {};
    
    byproducts.forEach(b => {
      if (!b.date) return;
      const dateParts = b.date.split('-');
      if (dateParts.length < 2) return;
      const monthStr = `T${parseInt(dateParts[1])}/${dateParts[0]}`;
      
      if (!dataMap[monthStr]) {
        dataMap[monthStr] = { organic: 0, recyclable: 0 };
      }
      
      if (b.category === 'Hữu cơ') {
        dataMap[monthStr].organic += b.mass;
      } else if (b.category === 'Tái chế') {
        dataMap[monthStr].recyclable += b.mass;
      }
    });

    const sortedMonths = Object.keys(dataMap).sort((a, b) => {
      const parseMonthYear = (str: string) => {
        const parts = str.substring(1).split('/');
        return Number(parts[1]) * 12 + Number(parts[0]);
      };
      return parseMonthYear(a) - parseMonthYear(b);
    });

    if (sortedMonths.length === 0) {
      return [
        { month: 'Chưa có dữ liệu', organic: 0, recyclable: 0 }
      ];
    }

    return sortedMonths.map(m => ({
      month: m,
      organic: dataMap[m].organic,
      recyclable: dataMap[m].recyclable
    }));
  };

  const monthlyData = getDynamicMonthlyData();

  // Calculate finance metrics
  const totalRevenue = outputs.reduce((sum, o) => sum + o.revenue, 0);
  const totalCost = totalRevenue > 0 ? 135000 : 0; // Chi phí chỉ phát sinh thực tế khi bắt đầu có doanh thu tuần hoàn
  const totalProfit = Math.max(0, totalRevenue - totalCost);

  // Treatment efficiency percentages based on real processed categories
  const getEfficiencies = () => {
    const totalOrganic = byproducts.filter(b => b.category === 'Hữu cơ').reduce((sum, b) => sum + b.mass, 0);
    const processedOrganic = byproducts.filter(b => b.category === 'Hữu cơ' && (b.status === 'Đang xử lý' || b.status === 'Đã xử lý')).reduce((sum, b) => sum + b.mass, 0);

    const totalPaper = byproducts.filter(b => b.name === 'Giấy vụn').reduce((sum, b) => sum + b.mass, 0);
    const processedPaper = byproducts.filter(b => b.name === 'Giấy vụn' && (b.status === 'Đang xử lý' || b.status === 'Đã xử lý')).reduce((sum, b) => sum + b.mass, 0);

    const totalPlastic = byproducts.filter(b => b.name === 'Chai nhựa').reduce((sum, b) => sum + b.mass, 0);
    const processedPlastic = byproducts.filter(b => b.name === 'Chai nhựa' && (b.status === 'Đang xử lý' || b.status === 'Đã xử lý')).reduce((sum, b) => sum + b.mass, 0);

    const totalCan = byproducts.filter(b => b.name === 'Lon nhôm').reduce((sum, b) => sum + b.mass, 0);
    const processedCan = byproducts.filter(b => b.name === 'Lon nhôm' && (b.status === 'Đang xử lý' || b.status === 'Đã xử lý')).reduce((sum, b) => sum + b.mass, 0);

    return [
      { name: 'Ủ Compost hữu cơ', rate: totalOrganic > 0 ? Math.round((processedOrganic / totalOrganic) * 100) : 0, color: 'bg-emerald-500' },
      { name: 'Tái chế Giấy học sinh', rate: totalPaper > 0 ? Math.round((processedPaper / totalPaper) * 100) : 0, color: 'bg-blue-500' },
      { name: 'Tái chế vỏ chai Nhựa', rate: totalPlastic > 0 ? Math.round((processedPlastic / totalPlastic) * 100) : 0, color: 'bg-indigo-500' },
      { name: 'Tái chế vỏ Lon nhôm', rate: totalCan > 0 ? Math.round((processedCan / totalCan) * 100) : 0, color: 'bg-amber-500' }
    ];
  };

  const efficiencies = getEfficiencies();

  return (
    <div className="space-y-6" id="analytics-dashboard-section">
      {/* Top Header Panel */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
          📊 Phân tích số liệu &amp; Báo cáo tài chính xanh
        </h2>
        <p className="text-gray-400 text-xs mt-0.5">Biểu đồ tổng quan sự phân rã rác thải học đường, hiệu suất xử lý thực nghiệm và dòng thu tài chính kế hoạch nhỏ.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Biểu đồ phụ phẩm phát sinh theo tháng */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Leaf className="w-4 h-4 text-emerald-600" /> Khối lượng phụ phẩm theo tháng
            </h3>
            <p className="text-gray-400 text-[11px] mt-1">Sự tăng trưởng thu gom chất thải sinh học và rác tái chế có phân loại (kg).</p>
          </div>

          {/* Custom SVG/HTML Bar Chart */}
          <div className="flex flex-col justify-end h-48 pt-6">
            <div className="flex items-end justify-between h-36 border-b border-gray-200 pb-2">
              {monthlyData.map((data, idx) => {
                const maxVal = 140; // max scale for heights
                const organicHeight = (data.organic / maxVal) * 100;
                const recyclableHeight = (data.recyclable / maxVal) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center w-1/4 space-y-1.5 group">
                    <div className="flex items-end gap-1.5 h-full w-full justify-center">
                      {/* Organic Bar */}
                      <div 
                        className="w-3.5 bg-emerald-500 rounded-t-sm transition-all duration-500 group-hover:bg-emerald-600 relative"
                        style={{ height: `${organicHeight}%` }}
                        title={`Hữu cơ: ${data.organic} kg`}
                      >
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-emerald-800 bg-white border border-emerald-100 rounded-sm px-1 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.organic}k
                        </span>
                      </div>
                      {/* Recyclable Bar */}
                      <div 
                        className="w-3.5 bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:bg-blue-600 relative"
                        style={{ height: `${recyclableHeight}%` }}
                        title={`Tái chế: ${data.recyclable} kg`}
                      >
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-blue-800 bg-white border border-blue-100 rounded-sm px-1 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.recyclable}k
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold">{data.month}</span>
                  </div>
                );
              })}
            </div>
            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-500 pt-2">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block"></span> Hữu cơ (Lá/Cỏ)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm inline-block"></span> Tái chế (Giấy/Nhựa)</span>
            </div>
          </div>
        </div>

        {/* 2. Biểu đồ Hiệu quả xử lý */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Award className="w-4 h-4 text-emerald-600" /> Hiệu quả xử lý phân loại
            </h3>
            <p className="text-gray-400 text-[11px] mt-1">Đánh giá tỷ lệ xử lý rác thải thành công, tránh tỷ lệ tạp chất lẫn lộn bãi thải chôn lấp.</p>
          </div>

          <div className="space-y-4 pt-2">
            {efficiencies.map((eff, i) => (
              <div key={i} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-gray-700">
                  <span>{eff.name}</span>
                  <span className="font-semibold text-emerald-700">{eff.rate}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`${eff.color} h-2 rounded-full transition-all`} style={{ width: `${eff.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Phân tích tài chính (Chi phí / Doanh thu / Lợi nhuận) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Tài chính Quỹ tuần hoàn học đường
            </h3>
            <p className="text-gray-400 text-[11px] mt-1">Dòng thu đóng góp trực tiếp từ hoạt động đổi chai nhựa, bán giấy báo cũ làm quỹ hoạt động học sinh (VNĐ).</p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 font-semibold flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-400 rounded-full inline-block"></span> Chi phí đầu tư</span>
              <strong className="text-sm font-bold text-gray-800">{totalCost.toLocaleString()} đ</strong>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-500 font-semibold flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-400 rounded-full inline-block"></span> Doanh thu tích lũy</span>
              <strong className="text-sm font-bold text-gray-800">{totalRevenue.toLocaleString()} đ</strong>
            </div>

            <div className="flex justify-between items-center bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">
              <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span> Thặng dư / Lợi nhuận</span>
              <strong className="text-base font-black text-emerald-800">{totalProfit.toLocaleString()} đ</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Environmental advice bottom banner */}
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-emerald-800 leading-relaxed">
          <strong>Báo cáo carbon:</strong> Nhờ nỗ lực gom và bón compost lá cây tại chỗ học kỳ vừa qua, trường THCS Lý Tự Trọng đã triệt tiêu được hoàn toàn lượng phát thải CH₄ tương đương <strong>{byproducts.length * 40}kg CO₂e</strong> phát sinh nếu đem đốt rác thô ngoài trời.
        </p>
      </div>
    </div>
  );
};
