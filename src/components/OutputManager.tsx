import React, { useState } from 'react';
import { useAppState } from '../data/StateContext';
import { OutputProduct } from '../types';
import { DollarSign, ShieldCheck, ShoppingCart, RefreshCw, Layers, Plus, TrendingUp, Info, Trash2, X } from 'lucide-react';
import { motion } from 'motion/react';

export const OutputManager: React.FC = () => {
  const { outputs, useOutputProduct, sellOutputProduct, updateOutputProduct, addOutputProduct, deleteOutputProduct } = useAppState();

  const [selectedProduct, setSelectedProduct] = useState<OutputProduct | null>(outputs[0] || null);
  const [useAmount, setUseAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  // Form states for adding new output product
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdTotal, setNewProdTotal] = useState('');

  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const handleSelectProduct = (p: OutputProduct) => {
    setSelectedProduct(p);
    setUseAmount('');
    setSellAmount('');
    setSellPrice(p.id === 'op2' ? '35000' : p.id === 'op3' ? '5000' : '20000');
    setFeedback({ text: '', type: '' });
  };

  const handleUse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !useAmount || isNaN(Number(useAmount))) return;

    const amt = Number(useAmount);
    const success = useOutputProduct(selectedProduct.id, amt);

    if (success) {
      setFeedback({ text: `🎉 Đã sử dụng thành công ${amt} ${selectedProduct.unit} ${selectedProduct.name} bón cây/tái chế tại chỗ!`, type: 'success' });
      // Cập nhật local view
      setSelectedProduct(prev => prev ? { ...prev, used: prev.used + amt } : null);
    } else {
      setFeedback({ text: `❌ Thao tác thất bại! Kho không đủ số dư tồn kho khả dụng để bón bồi dưỡng.`, type: 'error' });
    }
    setUseAmount('');
  };

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !sellAmount || !sellPrice || isNaN(Number(sellAmount)) || isNaN(Number(sellPrice))) return;

    const amt = Number(sellAmount);
    const price = Number(sellPrice);
    const success = sellOutputProduct(selectedProduct.id, amt, price);

    if (success) {
      const rev = amt * price;
      setFeedback({ text: `🎉 Đã bán thành công ${amt} ${selectedProduct.unit} ${selectedProduct.name}. Doanh thu ghi nhận cộng thêm: +${rev.toLocaleString()} VNĐ!`, type: 'success' });
      // Cập nhật local view
      setSelectedProduct(prev => prev ? {
        ...prev,
        sold: prev.sold + amt,
        revenue: prev.revenue + rev
      } : null);
    } else {
      setFeedback({ text: `❌ Thao tác thất bại! Kho không đủ tồn trữ sản lượng thương mại khả dụng.`, type: 'error' });
    }
    setSellAmount('');
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;
    addOutputProduct({
      name: newProdName,
      unit: newProdUnit,
      totalProduced: Number(newProdTotal) || 0,
      used: 0,
      sold: 0,
      revenue: 0
    });
    setNewProdName('');
    setNewProdTotal('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6" id="output-manager-section">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
            📦 Quản lý kho sản phẩm đầu ra của trường
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">Theo dõi số lượng phân bón hữu cơ hoai mục, tiền giấy kế hoạch nhỏ, sen đá quy đổi và dòng tài chính tuần hoàn.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" /> Thêm sản phẩm mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Danh sách sản phẩm (8 phần) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {outputs.map((prod) => {
            const remaining = prod.totalProduced - prod.used - prod.sold;
            return (
              <motion.div
                whileHover={{ y: -2 }}
                onClick={() => handleSelectProduct(prod)}
                key={prod.id}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-48 relative overflow-hidden ${
                  selectedProduct?.id === prod.id 
                    ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md uppercase">
                      MÃ KHO: {prod.id.toUpperCase()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm đầu ra "${prod.name}" khỏi danh mục kho của trường?`)) {
                          deleteOutputProduct(prod.id);
                          if (selectedProduct?.id === prod.id) {
                            setSelectedProduct(null);
                          }
                        }
                      }}
                      className="text-gray-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-md transition-all shrink-0 cursor-pointer"
                      title="Xóa sản phẩm này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-gray-800 mt-2">{prod.name}</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 mt-3 text-xs text-center">
                  <div className="bg-gray-50 p-1.5 rounded-lg">
                    <span className="text-gray-400 text-[9px] block">Sản xuất</span>
                    <strong className="text-gray-800">{prod.totalProduced} {prod.unit}</strong>
                  </div>
                  <div className="bg-gray-50 p-1.5 rounded-lg">
                    <span className="text-gray-400 text-[9px] block">Đã dùng</span>
                    <strong className="text-gray-800">{prod.used} {prod.unit}</strong>
                  </div>
                  <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                    <span className="text-emerald-700 text-[9px] block font-bold">Còn lại</span>
                    <strong className="text-emerald-800 font-black">{remaining} {prod.unit}</strong>
                  </div>
                </div>

                {prod.revenue > 0 && (
                  <div className="absolute top-2 right-10 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    <TrendingUp className="w-3 h-3" /> +{prod.revenue.toLocaleString()}đ
                  </div>
                )}
              </motion.div>
            );
          })}

          {outputs.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-400 text-xs">
              Kho của trường chưa ghi nhận thành phẩm nào. Hãy thiết kế quy trình và chạy thử mô phỏng hoặc nhấn nút "Thêm sản phẩm mới" phía trên để khai báo sản phẩm thực tế!
            </div>
          )}
        </div>

        {/* Thao tác Xuất kho / Bán kho (4 phần) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          {selectedProduct ? (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Giao dịch kho</span>
                <h3 className="font-display font-bold text-xl text-gray-800 mt-0.5">{selectedProduct.name}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Số dư hiện tại khả dụng: <strong className="text-gray-700">{selectedProduct.totalProduced - selectedProduct.used - selectedProduct.sold} {selectedProduct.unit}</strong>
                </p>
              </div>

              {feedback.text && (
                <div className={`p-3 rounded-xl text-xs font-semibold border ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {feedback.text}
                </div>
              )}

              {/* Form 1: Sử dụng nội bộ */}
              <form onSubmit={handleUse} className="space-y-3">
                <h4 className="font-bold text-xs text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600" /> Bón tại chỗ / Tái sử dụng nội bộ
                </h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder={`Số ${selectedProduct.unit} dùng`}
                    value={useAmount}
                    onChange={e => setUseAmount(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-gray-700 font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Bón cây / Xuất dùng
                  </button>
                </div>
              </form>

              {/* Form 2: Thương mại hóa lấy kinh phí */}
              {['op1', 'op2', 'op3', 'op4'].includes(selectedProduct.id) || selectedProduct.id.startsWith('op_') ? (
                <form onSubmit={handleSell} className="space-y-3 border-t border-gray-100 pt-5">
                  <h4 className="font-bold text-xs text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-amber-600" /> Bán thương mại thu quỹ kế hoạch nhỏ
                  </h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder={`Số ${selectedProduct.unit} bán`}
                        value={sellAmount}
                        onChange={e => setSellAmount(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-gray-700 font-medium"
                      />
                      <input
                        type="number"
                        required
                        placeholder="Giá bán / Đơn vị"
                        value={sellPrice}
                        onChange={e => setSellPrice(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-gray-700 font-mono font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Bán thanh lý thu tiền
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 space-y-2">
              <Info className="w-8 h-8 text-gray-300" />
              <p className="text-xs">Vui lòng bấm chọn một sản phẩm bên trái để ghi nhận giao dịch xuất kho.</p>
            </div>
          )}

          {/* Bottom helper card */}
          {selectedProduct && (
            <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-100/50 flex items-start gap-2 text-[11px] text-emerald-800 mt-6">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Khi thực hiện giao dịch <strong>Bán</strong> hoặc <strong>Sử dụng</strong>, số liệu kho lưu trữ của trường Lý Tự Trọng sẽ cập nhật lũy tiến và tính điểm xanh tự động.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Add New Output Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative"
          >
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-display font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
              ➕ Thêm sản phẩm đầu ra mới vào kho
            </h3>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Tên thành phẩm đầu ra</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đồ dùng STEM từ nhựa, Men vi sinh vi sinh..."
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Đơn vị đo lường</label>
                  <select
                    value={newProdUnit}
                    onChange={e => setNewProdUnit(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500 font-semibold"
                  >
                    <option value="kg">kg (Kilôgam)</option>
                    <option value="lít">lít</option>
                    <option value="cái">cái (Sản phẩm)</option>
                    <option value="phần">phần (Quà đổi)</option>
                    <option value="chậu">chậu (Cây giống)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Số lượng tồn kho ban đầu</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Mặc định: 0"
                    value={newProdTotal}
                    onChange={e => setNewProdTotal(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer shadow-sm"
                >
                  Khai báo thêm
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
