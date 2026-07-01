import React, { useState } from 'react';
import { useAppState } from '../data/StateContext';
import { LogEntry } from '../types';
import { FileSpreadsheet, Calendar, Search, Filter, Plus, Trash2, Sliders, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const TreatmentLog: React.FC = () => {
  const { logs, addLogEntry, deleteLogEntry } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'day' | 'week' | 'month' | 'all'>('all');
  const [filterType, setFilterType] = useState<string>('Tất cả');

  // Form states for manual entry
  const [showAddForm, setShowAddForm] = useState(false);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [byproductName, setByproductName] = useState('Lá cây');
  const [mass, setMass] = useState('');
  const [status, setStatus] = useState('Đã ủ Compost');
  const [handler, setHandler] = useState('Nguyễn Văn A');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mass || isNaN(Number(mass))) return;

    addLogEntry({
      date: logDate,
      byproductName,
      mass: Number(mass),
      status,
      handler
    });

    setMass('');
    setShowAddForm(false);
  };

  const handleByproductSelect = (val: string) => {
    setByproductName(val);
    if (val === 'Lá cây') setStatus('Đã ủ Compost');
    else if (val === 'Giấy vụn') setStatus('Đã ép kiện');
    else if (val === 'Chai nhựa') setStatus('Đã nén bẹp');
    else if (val === 'Lon nhôm') setStatus('Đã gom tái chế');
    else if (val === 'Thức ăn thừa') setStatus('Chuyển ủ hoai');
    else setStatus('Đã xử lý');
  };

  // Filter logs logically
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.byproductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.handler.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'Tất cả' || log.byproductName === filterType;

    // Filter period (assume everything with date in 2026-07 is current month/week)
    if (filterPeriod === 'day') {
      return matchesSearch && matchesType && log.date === '2026-07-01';
    }
    if (filterPeriod === 'week') {
      // Giả lập tuần đầu tháng 7
      return matchesSearch && matchesType && (log.date.startsWith('2026-07') || log.date.endsWith('30') || log.date.endsWith('29'));
    }
    if (filterPeriod === 'month') {
      return matchesSearch && matchesType && log.date.startsWith('2026-07');
    }

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6" id="treatment-log-section">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
            🗒️ Nhật ký xử lý &amp; Vận hành tuần hoàn
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">Sổ nhật ký lưu giữ toàn bộ biên bản gom rác, ủ rác hữu cơ, bán vỏ lon nhôm định kỳ hàng ngày.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Ghi chép thủ công nhật ký
        </button>
      </div>

      {/* Filter and search bars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo loại rác, kết quả, người làm..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-emerald-500 text-gray-700 font-semibold"
          />
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={filterPeriod}
            onChange={e => setFilterPeriod(e.target.value as any)}
            className="w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-emerald-500 text-gray-700"
          >
            <option value="all">Tất cả mốc thời gian</option>
            <option value="day">Hôm nay (1/7)</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này (Tháng 7)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-emerald-500 text-gray-700"
          >
            <option value="Tất cả">Tất cả Phụ phẩm</option>
            <option value="Lá cây">Lá cây</option>
            <option value="Giấy vụn">Giấy vụn</option>
            <option value="Chai nhựa">Chai nhựa</option>
            <option value="Lon nhôm">Lon nhôm</option>
            <option value="Cỏ cắt">Cỏ cắt</option>
            <option value="Thức ăn thừa">Thức ăn thừa</option>
          </select>
        </div>

        <div className="flex items-center justify-end text-xs text-emerald-700 font-bold px-2">
          Số bản ghi lọc: {filteredLogs.length} dòng
        </div>
      </div>

      {/* Manual Entry Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50/50 border border-emerald-200 p-6 rounded-2xl space-y-4"
        >
          <h3 className="font-display font-bold text-emerald-800 text-sm flex items-center gap-2">
            📝 Ghi nhật ký xử lý rác thủ công
          </h3>
          <form onSubmit={handleAddLog} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-emerald-700 mb-1">Ngày ghi nhận</label>
              <input
                type="date"
                required
                value={logDate}
                onChange={e => setLogDate(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs focus:outline-emerald-500 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-700 mb-1">Tên phụ phẩm</label>
              <select
                value={byproductName}
                onChange={e => handleByproductSelect(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs focus:outline-emerald-500 text-gray-700"
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
              <label className="block text-[10px] font-bold text-emerald-700 mb-1">Khối lượng xử lý (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="Ví dụ: 15"
                value={mass}
                onChange={e => setMass(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs focus:outline-emerald-500 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-700 mb-1">Tiến độ/Kết quả</label>
              <input
                type="text"
                required
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs focus:outline-emerald-500 text-gray-700"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-emerald-700 mb-1">Học sinh thực hiện</label>
                <input
                  type="text"
                  required
                  value={handler}
                  onChange={e => setHandler(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs focus:outline-emerald-500 text-gray-700"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer h-[34px] flex items-center justify-center"
              >
                Lưu
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Logs Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-4">Ngày ghi chép</th>
                <th className="p-4">Loại phụ phẩm</th>
                <th className="p-4">Khối lượng</th>
                <th className="p-4">Trạng thái / Nhật ký</th>
                <th className="p-4">Học sinh / Người thực hiện</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="p-4 font-semibold text-gray-800">{log.date}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md">
                      {log.byproductName}
                    </span>
                  </td>
                  <td className="p-4 font-black text-gray-800">{log.mass} kg</td>
                  <td className="p-4 text-gray-600">{log.status}</td>
                  <td className="p-4 font-medium text-gray-800">{log.handler}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteLogEntry(log.id)}
                      className="p-1 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-md transition-colors cursor-pointer"
                      title="Xóa biên bản này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 font-medium">
                    Chưa có biên bản nhật ký xử lý nào trùng khớp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
