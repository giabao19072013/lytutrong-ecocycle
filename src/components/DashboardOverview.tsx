import React, { useState } from 'react';
import { useAppState } from '../data/StateContext';
import { Leaf, Trash2, Trees, ShieldCheck, Plus, TrendingUp, Calendar, MapPin, Award } from 'lucide-react';
import { motion } from 'motion/react';

export const DashboardOverview: React.FC<{ onViewChange: (view: string) => void }> = ({ onViewChange }) => {
  const { byproducts, scores, activePeriod, addByproduct, resetData } = useAppState();
  const currentScore = scores[activePeriod];

  // Trạng thái cho form thêm nhanh phụ phẩm
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickName, setQuickName] = useState('Lá cây');
  const [quickMass, setQuickMass] = useState('');
  const [quickSource, setQuickSource] = useState('Khu cây xanh');
  const [quickHandler, setQuickHandler] = useState('Nguyễn Văn A');

  // Tính toán nhanh phụ phẩm phát sinh hôm nay
  const totalToday = byproducts.reduce((acc, curr) => acc + curr.mass, 0);

  // Group byproducts by name for statistics
  const byproductStats = byproducts.reduce((acc, curr) => {
    if (!acc[curr.name]) {
      acc[curr.name] = 0;
    }
    acc[curr.name] += curr.mass;
    return acc;
  }, {} as Record<string, number>);

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMass || isNaN(Number(quickMass))) return;

    addByproduct({
      name: quickName,
      category: ['Lá cây', 'Cỏ cắt', 'Thức ăn thừa'].includes(quickName) ? 'Hữu cơ' : 'Tái chế',
      source: quickSource,
      mass: Number(quickMass),
      date: new Date().toISOString().split('T')[0],
      status: 'Đã thu gom',
      handler: quickHandler,
      notes: 'Thêm nhanh từ Dashboard tổng quan.'
    });

    setQuickMass('');
    setShowQuickAdd(false);
  };

  const getIconForByproduct = (name: string) => {
    switch (name) {
      case 'Lá cây': return <Leaf className="w-5 h-5 text-emerald-600" />;
      case 'Cỏ cắt': return <Trees className="w-5 h-5 text-green-600" />;
      case 'Giấy vụn': return <Trash2 className="w-5 h-5 text-blue-600" />;
      case 'Chai nhựa': return <Trash2 className="w-5 h-5 text-indigo-600" />;
      case 'Lon nhôm': return <TrendingUp className="w-5 h-5 text-amber-600" />;
      default: return <Leaf className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6" id="dashboard-overview-container">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-2">
            Chào mừng bạn đến với <span className="text-emerald-600">EcoCycle School</span> 🌱
          </h2>
          <p className="text-gray-500 mt-1">
            Hệ thống quản lý, mô phỏng và đánh giá mô hình kinh tế tuần hoàn tại <strong className="text-emerald-700">THCS Lý Tự Trọng</strong>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (window.confirm('Bạn có muốn xóa toàn bộ dữ liệu mẫu hiện tại để nhập số liệu thực tế của trường?')) {
                resetData();
              }
            }}
            className="flex items-center gap-2 bg-gray-50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-gray-500 font-medium px-3.5 py-2 rounded-xl transition-all cursor-pointer text-sm border border-gray-200"
          >
            Reset xóa dữ liệu mẫu
          </button>
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" /> Thêm phụ phẩm
          </button>
          <button
            onClick={() => onViewChange('report')}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium px-4 py-2 rounded-xl transition-all cursor-pointer text-sm border border-emerald-200"
          >
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Quick Add Form Overlay/Drawer */}
      {showQuickAdd && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl shadow-inner space-y-4"
        >
          <h3 className="font-display font-bold text-emerald-800 text-lg flex items-center gap-2">
            ➕ Ghi nhận phụ phẩm mới phát sinh nhanh
          </h3>
          <form onSubmit={handleQuickAddSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">Loại phụ phẩm</label>
              <select
                value={quickName}
                onChange={e => setQuickName(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500"
              >
                <option value="Lá cây">Lá cây</option>
                <option value="Cỏ cắt">Cỏ cắt</option>
                <option value="Giấy vụn">Giấy vụn</option>
                <option value="Chai nhựa">Chai nhựa</option>
                <option value="Lon nhôm">Lon nhôm</option>
                <option value="Thức ăn thừa">Thức ăn thừa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">Khối lượng (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Ví dụ: 15"
                required
                value={quickMass}
                onChange={e => setQuickMass(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">Nguồn phát sinh</label>
              <select
                value={quickSource}
                onChange={e => setQuickSource(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500"
              >
                <option value="Khu cây xanh">Khu cây xanh</option>
                <option value="Sân trường">Sân trường</option>
                <option value="Khu căn tin">Khu căn tin</option>
                <option value="Khối 6">Khối 6</option>
                <option value="Khối 7">Khối 7</option>
                <option value="Khối 8">Khối 8</option>
                <option value="Khối 9">Khối 9</option>
                <option value="Vườn trường">Vườn trường</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-emerald-800 mb-1">Người thu gom</label>
                <input
                  type="text"
                  value={quickHandler}
                  onChange={e => setQuickHandler(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer h-[38px] flex items-center justify-center"
              >
                Ghi nhận
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Grid: 3 Columns - Key Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Thống kê phụ phẩm */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-800 text-lg flex items-center gap-2">
                📊 Thống kê phụ phẩm
              </h3>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-1 rounded-md">
                Tổng phát sinh: {totalToday} kg
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-4">Theo dõi toàn bộ khối lượng phụ phẩm được thu thập tại trường học.</p>
            
            <div className="space-y-3">
              {Object.entries(byproductStats).length > 0 ? (
                Object.entries(byproductStats).map(([name, mass]) => {
                  const percentage = totalToday > 0 ? (Number(mass) / totalToday) * 100 : 0;
                  return (
                    <div key={name} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/50 transition-all border border-transparent hover:border-emerald-100/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          {getIconForByproduct(name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{name}</p>
                          <div className="w-24 md:w-32 bg-gray-100 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-1.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{mass}kg</p>
                        <p className="text-[10px] text-gray-400 font-medium">{Math.round(percentage)}% tổng cộng</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-xs">
                  Chưa ghi nhận phụ phẩm nào. Bấm nút "Thêm phụ phẩm" phía trên để ghi nhận số liệu thực tế!
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onViewChange('byproducts')}
            className="w-full mt-6 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium text-xs py-2 rounded-xl border border-gray-100 transition-all cursor-pointer"
          >
            Quản lý chi tiết phụ phẩm &rarr;
          </button>
        </div>

        {/* 2. Tỷ lệ tái sử dụng */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-800 text-lg flex items-center gap-2">
                ♻️ Tỷ lệ tái sử dụng
              </h3>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-1 rounded-md">
                Hiện tại
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-4">Phần trăm rác được giải cứu và chuyển hóa tuần hoàn thành tài nguyên có ích.</p>
            
            {/* Visual Circular Progress Card */}
            <div className="flex flex-col items-center justify-center py-4 relative">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="42" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                  {/* Processing Circle */}
                  <circle 
                    cx="50" cy="50" r="42" 
                    stroke="#fbbf24" strokeWidth="8" fill="transparent"
                    strokeDasharray="263.8"
                    strokeDashoffset={263.8 - (263.8 * (currentScore.reuseRate + 11)) / 100}
                    className="transition-all duration-1000"
                  />
                  {/* Reused Circle */}
                  <circle 
                    cx="50" cy="50" r="42" 
                    stroke="#10b981" strokeWidth="8" fill="transparent"
                    strokeDasharray="263.8"
                    strokeDashoffset={263.8 - (263.8 * currentScore.reuseRate) / 100}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-display font-extrabold text-gray-800">{currentScore.reuseRate}%</span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Tuần hoàn</span>
                </div>
              </div>

              {/* Legend details */}
              <div className="grid grid-cols-3 gap-2 w-full mt-6 text-center text-xs">
                <div className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-100/30">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span>
                    <span className="font-bold text-emerald-700">{currentScore.reuseRate}%</span>
                  </div>
                  <span className="text-gray-500 text-[10px]">Tái chế</span>
                </div>
                <div className="p-2 bg-amber-50/50 rounded-xl border border-amber-100/30">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block"></span>
                    <span className="font-bold text-amber-700">11%</span>
                  </div>
                  <span className="text-gray-500 text-[10px]">Đang xử lý</span>
                </div>
                <div className="p-2 bg-rose-50/50 rounded-xl border border-rose-100/30">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 bg-rose-400 rounded-full inline-block"></span>
                    <span className="font-bold text-rose-700">7%</span>
                  </div>
                  <span className="text-gray-500 text-[10px]">Chưa xử lý</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onViewChange('flow')}
            className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium text-xs py-2 rounded-xl border border-gray-100 transition-all cursor-pointer"
          >
            Thiết kế sơ đồ quy trình xử lý &rarr;
          </button>
        </div>

        {/* 3. Lợi ích môi trường */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-800 text-lg flex items-center gap-2">
                🍃 Lợi ích môi trường
              </h3>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-1 rounded-md">
                {activePeriod === 'month' ? 'Tháng này' : activePeriod === 'semester' ? 'Học kỳ' : 'Cả năm'}
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-4">Các chỉ số tích cực tác động đến môi trường tự nhiên của trường THCS Lý Tự Trọng.</p>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Stat Card 1: Lượng rác giảm */}
              <div className="p-4 bg-gradient-to-br from-emerald-50/60 to-teal-50/20 rounded-xl border border-emerald-100/40">
                <div className="flex items-center gap-2 mb-1.5">
                  <Trash2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-gray-500">Rác giảm đi</span>
                </div>
                <p className="text-2xl font-black text-emerald-800">{currentScore.wasteReduced} <span className="text-xs font-bold text-gray-500">kg</span></p>
                <span className="text-[10px] text-emerald-600 font-medium">Tránh chôn lấp</span>
              </div>

              {/* Stat Card 2: CO2 giảm */}
              <div className="p-4 bg-gradient-to-br from-blue-50/60 to-cyan-50/20 rounded-xl border border-blue-100/40">
                <div className="flex items-center gap-2 mb-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-500">CO₂ giảm phát</span>
                </div>
                <p className="text-2xl font-black text-blue-800">{currentScore.wasteReduced * 2} <span className="text-xs font-bold text-gray-500">kg</span></p>
                <span className="text-[10px] text-blue-600 font-medium">Giảm dấu chân carbon</span>
              </div>

              {/* Stat Card 3: Số cây xanh */}
              <div className="p-4 bg-gradient-to-br from-green-50/60 to-emerald-50/20 rounded-xl border border-green-100/40">
                <div className="flex items-center gap-2 mb-1.5">
                  <Trees className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-gray-500">Cây chăm sóc</span>
                </div>
                <p className="text-2xl font-black text-green-800">{currentScore.gardenedArea} <span className="text-xs font-bold text-gray-500">m²</span></p>
                <span className="text-[10px] text-green-600 font-medium">Ủ dinh dưỡng</span>
              </div>

              {/* Stat Card 4: Compost làm ra */}
              <div className="p-4 bg-gradient-to-br from-amber-50/60 to-yellow-50/20 rounded-xl border border-amber-100/40">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-gray-500">Compost ra lò</span>
                </div>
                <p className="text-2xl font-black text-amber-800">{currentScore.compostProduced} <span className="text-xs font-bold text-gray-500">kg</span></p>
                <span className="text-[10px] text-amber-600 font-medium">Đã đóng bao mục</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onViewChange('score')}
            className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium text-xs py-2 rounded-xl border border-gray-100 transition-all cursor-pointer"
          >
            Xem bảng điểm trường học xanh &rarr;
          </button>
        </div>

      </div>

      {/* Featured visual banner or instruction */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center">
          <Leaf className="w-32 h-32 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider text-emerald-200">Bản đồ số &amp; Quản lý thông minh</span>
          <h3 className="text-xl font-display font-bold mt-2.5">Trải nghiệm tương tác bản đồ số khuôn viên trường học</h3>
          <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
            Nhấn vào phần **Bản đồ** để xem vị trí trực quan của từng khối học sinh, khu căn tin hay cây xanh, thống kê phụ phẩm từng điểm thu gom và theo dõi hành trình ủ hoai phân bón một cách chân thực nhất!
          </p>
          <button
            onClick={() => onViewChange('map')}
            className="mt-4 bg-white text-emerald-800 font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-50 transition-all cursor-pointer shadow-sm"
          >
            Khám phá Bản đồ trường ngay
          </button>
        </div>
      </div>
    </div>
  );
};
