import React, { useState } from 'react';
import { useAppState } from '../data/StateContext';
import { Byproduct } from '../types';
import { Trash2, Plus, Filter, Search, Calendar, MapPin, User, CheckCircle2, X, Edit, Sliders } from 'lucide-react';
import { motion } from 'motion/react';

export const ByproductManager: React.FC = () => {
  const { byproducts, locations, addByproduct, deleteByproduct, updateByproduct } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Tất cả');
  const [filterStatus, setFilterStatus] = useState<string>('Tất cả');

  // Form states for Add/Edit
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('Lá cây');
  const [category, setCategory] = useState<'Hữu cơ' | 'Tái chế' | 'Khác'>('Hữu cơ');
  const [source, setSource] = useState('Khu cây xanh');
  const [mass, setMass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'Chưa xử lý' | 'Đang xử lý' | 'Đã xử lý' | 'Đã thu gom'>('Đã thu gom');
  const [handler, setHandler] = useState('Nguyễn Văn A');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState('');

  // Sample stock images for select
  const sampleImages = [
    { label: 'Lá rụng/Cỏ', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=300&auto=format&fit=crop&q=60' },
    { label: 'Giấy vụn/Thùng', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=300&auto=format&fit=crop&q=60' },
    { label: 'Chai nhựa', url: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=300&auto=format&fit=crop&q=60' },
    { label: 'Lon nhôm', url: 'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=300&auto=format&fit=crop&q=60' },
    { label: 'Thức ăn thừa', url: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=300&auto=format&fit=crop&q=60' },
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('Lá cây');
    setCategory('Hữu cơ');
    setSource('Khu cây xanh');
    setMass('');
    setDate(new Date().toISOString().split('T')[0]);
    setStatus('Đã thu gom');
    setHandler('Nguyễn Văn A');
    setNotes('');
    setImage(sampleImages[0].url);
    setShowForm(true);
  };

  const handleOpenEdit = (b: Byproduct) => {
    setEditingId(b.id);
    setName(b.name);
    setCategory(b.category);
    setSource(b.source);
    setMass(b.mass.toString());
    setDate(b.date);
    setStatus(b.status);
    setHandler(b.handler);
    setNotes(b.notes);
    setImage(b.image || '');
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mass || isNaN(Number(mass))) return;

    const dataPayload = {
      name,
      category,
      source,
      mass: Number(mass),
      date,
      status,
      handler,
      notes,
      image: image || sampleImages[0].url
    };

    if (editingId) {
      updateByproduct(editingId, dataPayload);
    } else {
      addByproduct(dataPayload);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const handleByproductSelect = (val: string) => {
    setName(val);
    if (['Lá cây', 'Cỏ cắt', 'Thức ăn thừa'].includes(val)) {
      setCategory('Hữu cơ');
      setSource(val === 'Thức ăn thừa' ? 'Khu căn tin' : val === 'Cỏ cắt' ? 'Vườn trường' : 'Khu cây xanh');
      setImage(val === 'Thức ăn thừa' ? sampleImages[4].url : sampleImages[0].url);
    } else {
      setCategory('Tái chế');
      setSource(val === 'Giấy vụn' ? 'Khối 6' : 'Khu căn tin');
      setImage(val === 'Giấy vụn' ? sampleImages[1].url : val === 'Chai nhựa' ? sampleImages[2].url : sampleImages[3].url);
    }
  };

  const filteredByproducts = byproducts.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.handler.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Tất cả' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'Tất cả' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6" id="byproduct-manager-section">
      {/* Top bar controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
            🌿 Quản lý danh mục nguồn phụ phẩm
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">Khảo sát, ghi chép và phân bổ nguồn phụ phẩm phát sinh trong các khối lớp và cơ sở.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Khai báo phụ phẩm mới
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, nguồn, người phụ trách..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-emerald-500 text-gray-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-emerald-500 text-gray-700"
          >
            <option value="Tất cả">Tất cả Phân loại</option>
            <option value="Hữu cơ">Hữu cơ</option>
            <option value="Tái chế">Tái chế</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-emerald-500 text-gray-700"
          >
            <option value="Tất cả">Tất cả Trạng thái</option>
            <option value="Chưa xử lý">Chưa xử lý</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đã xử lý">Đã xử lý</option>
            <option value="Đã thu gom">Đã thu gom</option>
          </select>
        </div>

        <div className="flex items-center justify-end text-xs text-gray-500 font-semibold px-2">
          Đang hiển thị: {filteredByproducts.length} dòng
        </div>
      </div>

      {/* Grid of Byproduct Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredByproducts.map(item => (
          <motion.div
            layout
            key={item.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Card Banner Image */}
            <div className="h-40 w-full overflow-hidden relative bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 flex gap-1">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold shadow-sm ${
                  item.category === 'Hữu cơ' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {item.category}
                </span>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold shadow-sm ${
                  item.status === 'Đã xử lý' ? 'bg-green-600 text-white' : 
                  item.status === 'Đang xử lý' ? 'bg-amber-500 text-white' : 'bg-gray-700 text-white'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-extrabold text-lg text-gray-800">{item.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{item.notes || 'Không có ghi chú thêm.'}</p>
              </div>

              <div className="space-y-2 border-t border-gray-50 pt-3 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> Nguồn phát sinh</span>
                  <span className="font-bold text-gray-800">{item.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-gray-400" /> Khối lượng rác</span>
                  <span className="font-black text-emerald-600 text-sm">{item.mass} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Ngày khai báo</span>
                  <span className="font-medium text-gray-700">{item.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400" /> Người phụ trách</span>
                  <span className="font-semibold text-gray-700">{item.handler}</span>
                </div>
              </div>

              {/* Edit/Delete row */}
              <div className="flex justify-end gap-2 border-t border-gray-50 pt-3 mt-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-lg transition-colors cursor-pointer"
                  title="Sửa thông tin"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteByproduct(item.id)}
                  className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                  title="Xóa phụ phẩm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredByproducts.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">
            Không có kết quả phụ phẩm nào trùng khớp với tiêu chí tìm kiếm.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-display font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
              {editingId ? '📝 Cập nhật thông tin phụ phẩm' : '➕ Khai báo nguồn phụ phẩm mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Loại phụ phẩm</label>
                <select
                  value={name}
                  onChange={e => handleByproductSelect(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500"
                >
                  <option value="Lá cây">Lá cây</option>
                  <option value="Cỏ cắt">Cỏ cắt</option>
                  <option value="Giấy vụn">Giấy vụn</option>
                  <option value="Chai nhựa">Chai nhựa</option>
                  <option value="Lon nhôm">Lon nhôm</option>
                  <option value="Thức ăn thừa">Thức ăn thừa</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Phân loại vĩ mô</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500"
                  >
                    <option value="Hữu cơ">Hữu cơ</option>
                    <option value="Tái chế">Tái chế</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Khối lượng phát sinh (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={mass}
                    onChange={e => setMass(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Nguồn phát sinh (Bản đồ số)</label>
                  <select
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500 font-semibold"
                  >
                    {locations.map(loc => {
                      let typeLabel = '';
                      if (loc.type === 'garden') typeLabel = 'Vườn trường';
                      else if (loc.type === 'canteen') typeLabel = 'Căn tin';
                      else if (loc.type === 'class') typeLabel = 'Lớp học';
                      else if (loc.type === 'yard') typeLabel = 'Sân trường';
                      else if (loc.type === 'green') typeLabel = 'Khu cây xanh';
                      return (
                        <option key={loc.id} value={loc.name}>
                          {loc.name} ({typeLabel})
                        </option>
                      );
                    })}
                    <option value="Khu vực ngoại cảnh khác">Khu vực ngoại cảnh khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Ngày thu hoạch</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Trạng thái xử lý ban đầu</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500"
                  >
                    <option value="Chưa xử lý">Chưa xử lý</option>
                    <option value="Đã thu gom">Đã thu gom</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Đã xử lý">Đã xử lý</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Người phụ trách chính</label>
                  <input
                    type="text"
                    required
                    value={handler}
                    onChange={e => setHandler(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Hình ảnh biểu diễn</label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {sampleImages.map((img) => (
                    <button
                      type="button"
                      key={img.url}
                      onClick={() => setImage(img.url)}
                      className={`h-12 border rounded-lg overflow-hidden relative cursor-pointer ${
                        image === img.url ? 'ring-2 ring-emerald-500 border-transparent' : 'border-gray-200'
                      }`}
                    >
                      <img src={img.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 truncate">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Hoặc nhập liên kết hình ảnh tùy chọn..."
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs text-gray-700 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Ghi chú bổ sung</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ví dụ: Rác khô ráo, không lẫn rác sinh hoạt..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs text-gray-700 focus:outline-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer shadow-sm"
                >
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
