import React, { useState } from 'react';
import { useAppState } from '../data/StateContext';
import { Download, Printer, ShieldCheck, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const AutoReport: React.FC = () => {
  const { byproducts, logs, outputs, scores, activePeriod } = useAppState();
  const currentScore = scores[activePeriod];

  const [isExporting, setIsExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleSimulatedExport = () => {
    setIsExporting(true);
    setSuccessMsg('');

    setTimeout(() => {
      setIsExporting(false);
      setSuccessMsg('🎉 Báo cáo tự động đã được tổng hợp định dạng PDF và tải xuống thành công thiết bị của bạn!');
      setTimeout(() => setSuccessMsg(''), 6000);
    }, 2500);
  };

  return (
    <div className="space-y-6" id="auto-report-section">
      {/* Top Banner Control */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
            📋 Xuất báo cáo tự động (Auto Report)
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">Biên soạn, trình bày và kết xuất báo cáo tổng kết mô hình kinh tế tuần hoàn Lý Tự Trọng dạng văn bản in ấn chuẩn.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 border border-gray-200"
          >
            <Printer className="w-4 h-4" /> In báo cáo mẫu
          </button>
          <button
            onClick={handleSimulatedExport}
            disabled={isExporting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {isExporting ? 'Đang xuất PDF...' : 'Xuất PDF chất lượng cao'}
          </button>
        </div>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold no-print"
        >
          {successMsg}
        </motion.div>
      )}

      {/* simulated progress bar */}
      {isExporting && (
        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 text-xs text-center space-y-2 no-print">
          <p className="font-bold text-gray-600">Đang tạo sơ đồ quy trình và kết xuất đồ họa vector...</p>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.2 }}
              className="bg-emerald-500 h-1.5 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Printable Report Canvas Area */}
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-md max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Formal Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between border-b-2 border-emerald-800 pb-6 gap-4">
          <div className="text-center md:text-left">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">SỞ GIÁO DỤC VÀ ĐÀO TẠO</p>
            <h4 className="font-display font-black text-gray-800 text-sm">TRƯỜNG TRUNG HỌC CƠ SỞ LÝ TỰ TRỌNG</h4>
            <p className="text-[10px] text-gray-400 mt-1">Đường 22/12, THCS Lý Tự Trọng, Bình Dương</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs font-bold text-gray-500">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="text-[10px] font-bold text-gray-700 underline mt-0.5">Độc lập - Tự do - Hạnh phúc</p>
            <p className="text-[10px] text-gray-400 mt-2">Bình Dương, ngày 01 tháng 07 năm 2026</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5 py-4">
          <h2 className="text-2xl font-display font-extrabold text-gray-900 uppercase tracking-wide">
            BÁO CÁO KẾT QUẢ MÔ HÌNH KINH TẾ TUẦN HOÀN ECOCYCLE SCHOOL
          </h2>
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">THỜI KỲ TỔNG HỢP: {activePeriod === 'month' ? 'THÁNG 07/2026' : activePeriod === 'semester' ? 'HỌC KỲ I' : 'NIÊN HÓA 2025 - 2026'}</p>
        </div>

        {/* Executive summary */}
        <div className="space-y-3 bg-gray-50 p-6 rounded-xl border border-gray-200/50">
          <h3 className="font-display font-extrabold text-gray-800 text-sm">I. TỔNG QUAN CHUNG (EXECUTIVE SUMMARY)</h3>
          <p className="text-xs text-gray-600 leading-relaxed text-justify">
            Báo cáo này tổng hợp kết quả vận hành thực nghiệm chương trình tuần hoàn phụ phẩm học đường EcoCycle tại THCS Lý Tự Trọng. Nhờ tích cực triển khai phong trào ủ phân hữu cơ vi sinh compost từ lá cây, rác cỏ cắt rụng và thu hồi vỏ chai nhựa, giấy vụn học sinh tại nguồn, nhà trường đã đạt tỷ suất tái chế đáng kinh ngạc lên đến <strong>{currentScore.reuseRate}%</strong>, giảm thiểu đáng kể chi phí rác chôn lấp đô thị, góp phần giáo dục ý thức bảo vệ môi trường bền vững thế hệ trẻ.
          </p>
        </div>

        {/* Statistics section */}
        <div className="space-y-4">
          <h3 className="font-display font-extrabold text-gray-800 text-sm">II. SỐ LIỆU PHỤ PHẨM THU GOM ĐẦU VÀO</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {byproducts.slice(0, 4).map((b) => (
              <div key={b.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                <span className="text-[9px] text-gray-400 font-bold uppercase block">{b.name}</span>
                <strong className="text-xl font-black text-gray-800 mt-1 block">{b.mass} kg</strong>
                <span className="text-[9px] text-emerald-600 font-bold">{b.source}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sơ đồ quy trình thu gom xử lý */}
        <div className="space-y-4">
          <h3 className="font-display font-extrabold text-gray-800 text-sm">III. SƠ ĐỒ QUY TRÌNH TUẦN HOÀN MẪU (FLOW DIAGRAM)</h3>
          <p className="text-xs text-gray-500">Hành trình dòng chảy rác sinh học biến đổi thành sinh khối dinh dưỡng cao bón lại vườn cây xanh trường học:</p>
          
          <div className="flex flex-col md:flex-row items-center justify-between bg-emerald-50/40 p-4 border border-emerald-100 rounded-xl text-xs gap-4 text-center">
            <div className="p-3 bg-white border border-emerald-200 rounded-lg w-full md:w-auto shadow-2xs">
              <strong className="text-emerald-800 font-bold block">1. Thu gom lá rụng</strong>
              <span className="text-[10px] text-gray-400">Sân trường &amp; Khu cây xanh</span>
            </div>
            <span className="hidden md:inline text-emerald-500 font-black">&rarr;</span>
            <div className="p-3 bg-white border border-emerald-200 rounded-lg w-full md:w-auto shadow-2xs">
              <strong className="text-emerald-800 font-bold block">2. Sàng phân loại</strong>
              <span className="text-[10px] text-gray-400">Tách rời sỏi, nilon thô</span>
            </div>
            <span className="hidden md:inline text-emerald-500 font-black">&rarr;</span>
            <div className="p-3 bg-white border border-emerald-200 rounded-lg w-full md:w-auto shadow-2xs">
              <strong className="text-emerald-800 font-bold block">3. Ủ hoai vi sinh</strong>
              <span className="text-[10px] text-gray-400">Thời gian 45 ngày</span>
            </div>
            <span className="hidden md:inline text-emerald-500 font-black">&rarr;</span>
            <div className="p-3 bg-white border border-emerald-200 rounded-lg w-full md:w-auto shadow-2xs">
              <strong className="text-emerald-800 font-bold block">4. Compost bón cây</strong>
              <span className="text-[10px] text-gray-400">Trả lại mùn tự nhiên cho đất</span>
            </div>
          </div>
        </div>

        {/* Environmental benefit metrics */}
        <div className="space-y-4">
          <h3 className="font-display font-extrabold text-gray-800 text-sm">IV. HIỆU QUẢ KINH TẾ VÀ TÁC ĐỘNG MÔI TRƯỜNG</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/40 rounded-lg border border-emerald-100">
              <strong className="text-emerald-800 block font-black text-sm mb-1">Môi trường tự nhiên</strong>
              <p className="text-gray-600">Giảm thiểu chôn lấp <strong>{currentScore.wasteReduced}kg</strong> rác thải thô. Tiêu biến dấu chân carbon tránh phát thải <strong>{currentScore.wasteReduced * 2}kg CO₂e</strong> khí thải hiệu ứng nhà kính.</p>
            </div>
            <div className="p-4 bg-blue-50/40 rounded-lg border border-blue-100">
              <strong className="text-blue-800 block font-black text-sm mb-1">Tài nguyên bổ sung</strong>
              <p className="text-gray-600">Sản xuất thành phẩm đạt <strong>{currentScore.compostProduced}kg</strong> phân mùn hữu cơ hoạt tính cao, bón lại bồi dưỡng cho <strong>{currentScore.gardenedArea}m²</strong> cây xanh cảnh quan trường học.</p>
            </div>
            <div className="p-4 bg-amber-50/40 rounded-lg border border-amber-100">
              <strong className="text-amber-800 block font-black text-sm mb-1">Tài chính thặng dư</strong>
              <p className="text-gray-600">Ghi nhận doanh số thu về từ giấy kế hoạch nhỏ và vỏ chai nhựa nén đạt quỹ phong trào hỗ trợ học sinh có hoàn cảnh khó khăn.</p>
            </div>
          </div>
        </div>

        {/* Green Score section */}
        <div className="space-y-3 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-bold text-gray-500 text-[10px] uppercase">Kết quả đánh giá tổng bộ</p>
            <h4 className="font-display font-extrabold text-base text-gray-800">ĐIỂM TRƯỜNG HỌC XANH TIÊU BIỂU: <span className="text-emerald-700 text-lg font-black">{currentScore.totalScore}/100</span></h4>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-bold text-[10px]">
            HẠNG A+ TRƯỜNG HỌC PHÁT TRIỂN TUẦN HOÀN TIÊN PHONG
          </div>
        </div>

        {/* Signature Area */}
        <div className="grid grid-cols-2 pt-12 text-xs text-center">
          <div>
            <p className="font-bold text-gray-500 uppercase">Đại diện Liên đội / Học sinh</p>
            <p className="text-gray-400 mt-16">(Ký và ghi rõ họ tên)</p>
          </div>
          <div>
            <p className="font-bold text-gray-700 uppercase">HIỆU TRƯỞNG NHÀ TRƯỜNG</p>
            <p className="text-gray-400 mt-16">(Ký tên và đóng dấu duyệt)</p>
          </div>
        </div>

      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-2 text-xs text-gray-500 no-print">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Bản báo cáo tự động được thiết kế tương thích tuyệt đối với cấu hình khổ giấy in ấn văn phòng tiêu chuẩn A4. Bạn có thể nhấn <strong>In báo cáo</strong> để xuất ra máy in thực tế bất cứ lúc nào.
        </p>
      </div>
    </div>
  );
};
