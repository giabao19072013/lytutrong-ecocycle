import React, { useState } from 'react';
import { useAppState } from '../data/StateContext';
import { SchoolLocation } from '../types';
import { MapPin, Info, CheckCircle2, RefreshCw, AlertCircle, Plus, Users, Landmark, Trash2, X } from 'lucide-react';
import { motion } from 'motion/react';

export const CampusMap: React.FC = () => {
  const { locations, updateLocationStatus, addByproduct, addLocation, deleteLocation } = useAppState();
  const [selectedLoc, setSelectedLoc] = useState<SchoolLocation | null>(locations[0] || null);

  const [collectMass, setCollectMass] = useState('');
  const [isCollecting, setIsCollecting] = useState(false);

  // States for adding a new location
  const [showAddLoc, setShowAddLoc] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocType, setNewLocType] = useState<'green' | 'canteen' | 'class' | 'yard' | 'garden'>('class');
  const [newLocHandler, setNewLocHandler] = useState('Đội Thanh niên Cờ đỏ');

  const handleLocationClick = (loc: SchoolLocation) => {
    setSelectedLoc(loc);
    setIsCollecting(false);
  };

  const handleCollect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoc || !collectMass || isNaN(Number(collectMass))) return;

    const massValue = Number(collectMass);

    // Xác định tên phụ phẩm tương ứng vị trí
    let bpName = 'Rác hỗn hợp';
    if (selectedLoc.name === 'Khu cây xanh' || selectedLoc.name === 'Sân trường') bpName = 'Lá cây';
    else if (selectedLoc.name === 'Khu căn tin') bpName = 'Chai nhựa';
    else if (selectedLoc.name === 'Vườn trường') bpName = 'Cỏ cắt';
    else if (selectedLoc.name.startsWith('Khối')) bpName = 'Giấy vụn';

    // 1. Thêm byproduct mới vào State
    addByproduct({
      name: bpName,
      category: ['Lá cây', 'Cỏ cắt'].includes(bpName) ? 'Hữu cơ' : 'Tái chế',
      source: selectedLoc.name,
      mass: massValue,
      date: new Date().toISOString().split('T')[0],
      status: 'Đã thu gom',
      handler: selectedLoc.handler,
      notes: `Thu gom trực tiếp từ bản đồ số tại vị trí ${selectedLoc.name}.`
    });

    // 2. Cập nhật trạng thái địa điểm trên bản đồ
    updateLocationStatus(
      selectedLoc.id,
      'Đã thu gom ✔',
      bpName,
      massValue,
      selectedLoc.handler
    );

    // Cập nhật local state hiển thị
    setSelectedLoc(prev => prev ? {
      ...prev,
      status: 'Đã thu gom ✔',
      activeByproduct: bpName,
      mass: massValue
    } : null);

    setCollectMass('');
    setIsCollecting(false);
  };

  const handleComposting = () => {
    if (!selectedLoc) return;

    updateLocationStatus(
      selectedLoc.id,
      'Đang ủ Compost 🍂',
      selectedLoc.activeByproduct,
      selectedLoc.mass,
      selectedLoc.handler
    );

    setSelectedLoc(prev => prev ? {
      ...prev,
      status: 'Đang ủ Compost 🍂'
    } : null);
  };

  const getTileColor = (loc: SchoolLocation) => {
    const isSelected = selectedLoc?.id === loc.id;
    let baseColor = 'bg-white hover:bg-emerald-50 border-gray-200';

    if (loc.type === 'green') baseColor = 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800';
    if (loc.type === 'garden') baseColor = 'bg-green-50 hover:bg-green-100 border-green-200 text-green-800';
    if (loc.type === 'canteen') baseColor = 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800';
    if (loc.type === 'class') baseColor = 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800';
    if (loc.type === 'yard') baseColor = 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-800';

    return `${baseColor} ${isSelected ? 'ring-3 ring-emerald-500 scale-[1.02] shadow-md z-10' : 'shadow-xs'}`;
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'green': return <Landmark className="w-5 h-5 text-emerald-600 animate-pulse-ring" />;
      case 'garden': return <Landmark className="w-5 h-5 text-green-600" />;
      case 'canteen': return <Users className="w-5 h-5 text-amber-600" />;
      case 'class': return <Users className="w-5 h-5 text-blue-600" />;
      default: return <Landmark className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6" id="campus-map-section">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
            🗺️ Bản đồ số khuôn viên THCS Lý Tự Trọng
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Địa chỉ: <strong className="text-emerald-700">578 LE DUC THO, AN HOI DONG WARD, HO CHI MINH CITY</strong> • Sơ đồ tương tác quản lý nguồn thải phụ phẩm
          </p>
        </div>
        <button
          onClick={() => setShowAddLoc(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" /> Thêm khu vực mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bản đồ trường trực quan */}
        <div className="lg:col-span-2 bg-slate-50 p-6 rounded-2xl border border-gray-200 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
          
          {/* Header trường */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-emerald-800 text-white p-4 rounded-xl shadow-xs mb-6 gap-2">
            <div>
              <span className="text-[9px] bg-emerald-700/60 font-bold px-2 py-0.5 rounded-full uppercase">Cơ sở chính</span>
              <h3 className="font-display font-extrabold text-base tracking-wide">TRƯỜNG THCS LÝ TỰ TRỌNG</h3>
              <p className="text-[10px] text-emerald-200">578 Lê Đức Thọ, An Hội Đông, TP. Hồ Chí Minh</p>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-lg text-xs shrink-0 self-end sm:self-auto">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
              <span className="font-medium">Mô phỏng 2D Live</span>
            </div>
          </div>

          {/* Sơ đồ Grid trường */}
          <div className="grid grid-cols-4 gap-4 my-auto relative">
            {locations.map((loc) => (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={loc.id}
                onClick={() => handleLocationClick(loc)}
                className={`flex flex-col items-center justify-between p-4 rounded-xl border transition-all text-center h-32 cursor-pointer ${getTileColor(loc)}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-1.5 bg-white rounded-lg shadow-2xs">
                    {getLocationIcon(loc.type)}
                  </div>
                  <span className="font-display font-bold text-sm">{loc.name}</span>
                </div>
                <div className="w-full">
                  {loc.mass > 0 ? (
                    <span className="inline-block text-[10px] font-bold bg-white/70 px-2 py-0.5 rounded-full shadow-2xs text-gray-700">
                      {loc.activeByproduct.split(' ')[0]}: {loc.mass}kg
                    </span>
                  ) : (
                    <span className="inline-block text-[10px] text-gray-400">Sạch sẽ</span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Hướng dẫn bản đồ */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200/50">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> Nhấn vào một khu vực để xem và tương tác xử lý</span>
            <div className="flex gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Hữu cơ</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Giấy vụn</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Căng tin</span>
            </div>
          </div>
        </div>

        {/* Bảng điều khiển vị trí được chọn */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          {selectedLoc ? (
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-4 flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" /> Chi tiết vị trí
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-800">{selectedLoc.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Phân phụ trách quản lý bởi: <strong className="text-gray-600">{selectedLoc.handler}</strong></p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`Bạn có chắc chắn muốn xóa vị trí "${selectedLoc.name}" khỏi Bản đồ số? Hành động này sẽ loại bỏ vị trí khỏi sơ đồ hiển thị.`)) {
                      deleteLocation(selectedLoc.id);
                      setSelectedLoc(null);
                    }
                  }}
                  className="text-gray-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-gray-100 hover:border-rose-200"
                  title="Xóa khu vực này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Thông số hiện trạng */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200/50 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Phụ phẩm hiện hữu:</span>
                  <strong className="text-gray-800 text-sm">{selectedLoc.activeByproduct || 'Không có'}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Khối lượng phát sinh:</span>
                  <strong className="text-gray-800 text-sm">{selectedLoc.mass} kg</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Trạng thái xử lý:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedLoc.status.includes('✔') || selectedLoc.status.includes('ủ')
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {selectedLoc.status}
                  </span>
                </div>
              </div>

              {/* Hành động tương tác */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Hành động quy trình</h4>

                {!isCollecting ? (
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setIsCollecting(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Ghi nhận thu gom rác tại đây
                    </button>
                    
                    {selectedLoc.name === 'Khu cây xanh' && selectedLoc.status !== 'Đang ủ Compost 🍂' && (
                      <button
                        onClick={handleComposting}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                      >
                        <RefreshCw className="w-4 h-4" /> Đưa vào hố ủ Compost
                      </button>
                    )}

                    {selectedLoc.activeByproduct && selectedLoc.activeByproduct !== 'Chưa thu gom' && selectedLoc.activeByproduct !== 'Không có' && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc chắn muốn xóa phụ phẩm "${selectedLoc.activeByproduct}" hiện tại của vị trí này?`)) {
                            updateLocationStatus(selectedLoc.id, 'Sạch sẽ ✨', 'Chưa thu gom', 0, selectedLoc.handler);
                            setSelectedLoc(prev => prev ? {
                              ...prev,
                              status: 'Sạch sẽ ✨',
                              activeByproduct: 'Chưa thu gom',
                              mass: 0
                            } : null);
                          }
                        }}
                        className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold py-2 rounded-xl text-sm border border-rose-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" /> Xóa phụ phẩm hiện hữu
                      </button>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleCollect} className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-800">Thu gom bao nhiêu kg?</div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="Số kg (ví dụ: 12.5)"
                        value={collectMass}
                        onChange={e => setCollectMass(e.target.value)}
                        className="flex-1 bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-sm focus:outline-emerald-500"
                      />
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-all cursor-pointer shadow-xs"
                      >
                        Xác nhận
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCollecting(false)}
                      className="text-xs text-emerald-700 hover:underline cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 space-y-2">
              <Info className="w-10 h-10 text-gray-300" />
              <p className="text-sm">Vui lòng bấm chọn một vị trí trên bản đồ trường học để thực hiện hành động.</p>
            </div>
          )}

          {/* Footer Card */}
          {selectedLoc && (
            <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 flex items-start gap-2.5 mt-6">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Mọi hoạt động thu gom ghi nhận từ bản đồ số này sẽ được hệ thống cộng vào phần **Quản lý phụ phẩm** và cập nhật tự động vào **Green Score** của trường học.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Thêm khu vực mới Modal */}
      {showAddLoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative"
          >
            <button
              onClick={() => setShowAddLoc(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg cursor-pointer animate-pulse-ring"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-display font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
              ➕ Khai báo vị trí mới trên Bản đồ số
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newLocName) return;
                addLocation({
                  name: newLocName,
                  type: newLocType,
                  gridPos: { r: 1, c: 1 },
                  activeByproduct: 'Chưa thu gom',
                  mass: 0,
                  status: 'Sạch sẽ ✨',
                  handler: newLocHandler
                });
                setNewLocName('');
                setShowAddLoc(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Tên khu vực / vị trí mới</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Khối 6, Nhà thể thao, Sân sau..."
                  value={newLocName}
                  onChange={e => setNewLocName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Thể loại vị trí</label>
                  <select
                    value={newLocType}
                    onChange={e => setNewLocType(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500 font-semibold"
                  >
                    <option value="class">Lớp học / Khối lớp</option>
                    <option value="garden">Vườn trường</option>
                    <option value="canteen">Căn tin trường</option>
                    <option value="yard">Sân trường</option>
                    <option value="green">Khu cây xanh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Người phụ trách mặc định</label>
                  <input
                    type="text"
                    required
                    value={newLocHandler}
                    onChange={e => setNewLocHandler(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddLoc(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer shadow-sm"
                >
                  Thêm khu vực
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
