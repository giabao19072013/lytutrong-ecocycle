import React, { useState } from 'react';
import { BookOpen, Search, Sprout, Thermometer, ShieldCheck, HelpCircle, ArrowRight, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

interface AcademicItem {
  id: string;
  name: string;
  englishName: string;
  desc: string;
  humidity: string;
  carbonRatio: string;
  rawPrice: number; // đ/kg
  uses: string[];
}

export const AcademicLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<string>('ai1');
  const [calcMass, setCalcMass] = useState<number>(1000); // Mặc định 1000 kg như ví dụ

  const libraryData: AcademicItem[] = [
    {
      id: 'ai1',
      name: 'Rơm rạ',
      englishName: 'Rice Straw',
      desc: 'Phụ phẩm dồi dào nhất sau mỗi vụ gặt lúa. Chứa hàm lượng xenluloza cao, thích hợp làm giá thể trồng nấm, ủ compost cải tạo đất hoặc chế biến thức ăn thô xanh cho gia súc.',
      humidity: '60%',
      carbonRatio: '42%',
      rawPrice: 400,
      uses: ['Ủ phân Compost', 'Trồng nấm rơm', 'Chế biến thức ăn chăn nuôi', 'Nhiệt phân làm Biochar']
    },
    {
      id: 'ai2',
      name: 'Trấu',
      englishName: 'Rice Husk',
      desc: 'Vỏ ngoài của hạt thóc thu hồi tại các nhà máy xay xát. Khô ráo, hàm lượng silic cao, tỷ lệ cháy tốt, cực kỳ thích hợp làm chất đốt, ép viên nén sinh khối hoặc nhiệt phân thành than sinh học.',
      humidity: '10%',
      carbonRatio: '38%',
      rawPrice: 600,
      uses: ['Ép viên nén sinh khối', 'Nhiệt phân Biochar', 'Lót chuồng trại chăn nuôi', 'Trồng nấm (giá thể)']
    },
    {
      id: 'ai3',
      name: 'Vỏ quả cà phê',
      englishName: 'Coffee Husk',
      desc: 'Phần vỏ ngoài quả cà phê loại bỏ trong quá trình chế biến khô hoặc ướt tại Tây Nguyên. Giàu chất hữu cơ, kali và nitơ thích hợp cho các mô hình ủ compost cao cấp hoặc ép viên nhiên liệu.',
      humidity: '15%',
      carbonRatio: '45%',
      rawPrice: 500,
      uses: ['Ủ phân Compost vi sinh', 'Nhiệt phân Biochar', 'Sản xuất viên nén năng lượng']
    },
    {
      id: 'ai4',
      name: 'Bã mía',
      englishName: 'Sugarcane Bagasse',
      desc: 'Phần xơ còn lại sau khi ép lấy nước mía từ nhà máy đường. Sợi thô dai, nhiệt trị trung bình cao khi sấy khô, lý tưởng cho sản xuất viên nén sinh khối và thức ăn gia súc ủ chua.',
      humidity: '50%',
      carbonRatio: '44%',
      rawPrice: 450,
      uses: ['Sản xuất viên nén sinh khối', 'Ủ phân bón hữu cơ', 'Thức ăn gia súc nhai lại']
    },
    {
      id: 'ai5',
      name: 'Lõi ngô (Cùi bắp)',
      englishName: 'Corn Cob',
      desc: 'Phần lõi còn lại sau khi tách hạt ngô. Kết cấu xốp, giữ ẩm tốt, độ ngọt tự nhiên cao. Rất được ưa chuộng để làm giá thể trồng nấm ăn, nấm dược liệu hoặc làm thức ăn thô bổ sung.',
      humidity: '20%',
      carbonRatio: '46%',
      rawPrice: 700,
      uses: ['Giá thể trồng nấm sò/đùi gà', 'Nghiền thức ăn gia súc', 'Sản xuất than sinh học']
    },
    {
      id: 'ai6',
      name: 'Mụn xơ dừa',
      englishName: 'Coconut Coir',
      desc: 'Hợp chất xơ dừa thu hoạch sau khi xử lý vỏ quả dừa. Cực kỳ thoáng khí và giữ ẩm tốt, là chất nền không thể thiếu trong canh tác nông nghiệp công nghệ cao, rau mầm và ủ compost hữu cơ.',
      humidity: '50%',
      carbonRatio: '48%',
      rawPrice: 800,
      uses: ['Chế tạo đất sạch dinh dưỡng', 'Ủ phân Compost bón cây', 'Giá thể ươm cây giống']
    }
  ];

  const filteredData = libraryData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeItem = libraryData.find(item => item.id === selectedItem) || libraryData[0];

  return (
    <div className="space-y-6" id="academic-library-section">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" /> Học tập & Cẩm nang Phụ phẩm Nông nghiệp
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Tra cứu thông số khoa học, độ ẩm, tỷ lệ các bon (C) và giá trị tuần hoàn của các nguồn phụ phẩm dồi dào tại Việt Nam.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm phụ phẩm học tập..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-emerald-500 text-gray-700 font-semibold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Select item (4 spans) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Danh mục phụ phẩm</div>
          <div className="space-y-2">
            {filteredData.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedItem === item.id
                    ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                    : 'bg-white text-gray-700 border-gray-100 hover:bg-emerald-50/40 hover:border-emerald-100/30'
                }`}
              >
                <div>
                  <strong className="text-sm font-extrabold block">{item.name}</strong>
                  <span className={`text-[10px] ${selectedItem === item.id ? 'text-emerald-200' : 'text-gray-400'}`}>
                    {item.englishName}
                  </span>
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${selectedItem === item.id ? 'translate-x-1 text-white' : 'text-gray-300'}`} />
              </button>
            ))}

            {filteredData.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-gray-100 text-gray-400 text-xs">
                Không tìm thấy dữ liệu phù hợp.
              </div>
            )}
          </div>

          {/* Futuristic expansion tease */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-emerald-50/10 rounded-2xl border border-gray-100 text-xs text-center space-y-2">
            <p className="font-bold text-gray-600">📚 Và nhiều loại phụ phẩm khác...</p>
            <p className="text-gray-400 text-[10px] leading-relaxed">
              Các nguồn sinh khối hữu cơ như bã bia, thân cây chuối, lá dứa, vỏ sầu riêng... đang được tiếp tục phân lập thông số để cập nhật hệ sinh thái học đường.
            </p>
          </div>
        </div>

        {/* Right column - Main Details (8 spans) */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          {activeItem && (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Card Title Header */}
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md">
                  Nghiên cứu nông nghiệp
                </span>
                <h3 className="text-2xl font-display font-black text-gray-800 mt-2 flex items-baseline gap-2">
                  {activeItem.name}
                  <span className="text-sm text-gray-400 font-medium italic">({activeItem.englishName})</span>
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 leading-relaxed text-justify bg-gray-50 p-4 rounded-xl border border-gray-100">
                {activeItem.desc}
              </p>

              {/* Indicators grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/30 text-center">
                  <span className="text-[10px] text-emerald-800/80 font-bold uppercase block">Độ ẩm</span>
                  <strong className="text-xl font-black text-emerald-700 mt-1 block">{activeItem.humidity}</strong>
                </div>
                <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-100/30 text-center">
                  <span className="text-[10px] text-blue-800/80 font-bold uppercase block">Tỷ lệ Các-bon (C)</span>
                  <strong className="text-xl font-black text-blue-700 mt-1 block">{activeItem.carbonRatio}</strong>
                </div>
                <div className="p-4 bg-amber-50/30 rounded-xl border border-amber-100/30 text-center">
                  <span className="text-[10px] text-amber-800/80 font-bold uppercase block">Giá thô ước tính</span>
                  <strong className="text-xl font-black text-amber-700 mt-1 block">{activeItem.rawPrice}đ/kg</strong>
                </div>
              </div>

              {/* Uses list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sử dụng tuần hoàn phổ biến</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activeItem.uses.map((use, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold text-gray-700">
                      <Sprout className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{use}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multiplier dynamic calculator */}
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-emerald-100 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-emerald-800/60 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> Ước tính giá trị kinh tế thương mại
                  </h4>
                  <span className="text-[9px] bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-md font-bold uppercase">Công cụ học sinh</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Slider or input mass */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Khối lượng phụ phẩm nạp tính:</span>
                      <strong className="font-mono text-emerald-300">{(calcMass).toLocaleString()} kg</strong>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={calcMass}
                      onChange={e => setCalcMass(Number(e.target.value))}
                      className="w-full accent-emerald-400 h-1.5 bg-emerald-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-emerald-400/80 font-semibold">
                      <span>100 kg</span>
                      <span>5,000 kg</span>
                      <span>10,000 kg</span>
                    </div>
                  </div>

                  {/* Calculated outputs */}
                  <div className="bg-emerald-800/40 p-4 rounded-xl border border-emerald-700/30 text-center md:text-right">
                    <span className="text-[10px] text-emerald-300 uppercase block">Giá trị thương mại thô thặng dư:</span>
                    <strong className="text-2xl font-display font-black text-white mt-1.5 block">
                      {(calcMass * activeItem.rawPrice).toLocaleString()} VND
                    </strong>
                    <span className="text-[9px] text-emerald-400 block mt-1">Tính dựa trên đơn giá {activeItem.rawPrice}đ/kg</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-2.5 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Khuyến nghị khoa học:</strong> Nhờ các bon hóa tự nhiên thông qua kỹ thuật nhiệt phân (đốt thiếu oxy), các phụ phẩm nông nghiệp này có thể biến đổi bền vững thành <strong>Biochar (than sinh học)</strong>, giúp khóa khí các bon tồn tại hàng trăm năm trong đất trồng trọt học đường Lý Tự Trọng.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
