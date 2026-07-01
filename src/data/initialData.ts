import { Byproduct, Flow, LogEntry, OutputProduct, SchoolLocation, CompareMethod, GreenScoreDetail, ScorePeriod } from '../types';

export const INITIAL_BYPRODUCTS: Byproduct[] = [];

export const INITIAL_LOCATIONS: SchoolLocation[] = [
  {
    id: 'loc1',
    name: 'Vườn trường',
    type: 'garden',
    gridPos: { r: 1, c: 1 },
    activeByproduct: '',
    mass: 0,
    status: 'Bình thường',
    handler: ''
  },
  {
    id: 'loc2',
    name: 'Khu căn tin',
    type: 'canteen',
    gridPos: { r: 1, c: 3 },
    activeByproduct: '',
    mass: 0,
    status: 'Bình thường',
    handler: ''
  },
  {
    id: 'loc3',
    name: 'Khối 6',
    type: 'class',
    gridPos: { r: 2, c: 1 },
    activeByproduct: '',
    mass: 0,
    status: 'Bình thường',
    handler: ''
  },
  {
    id: 'loc4',
    name: 'Khối 7',
    type: 'class',
    gridPos: { r: 2, c: 2 },
    activeByproduct: '',
    mass: 0,
    status: 'Bình thường',
    handler: ''
  },
  {
    id: 'loc5',
    name: 'Khối 8',
    type: 'class',
    gridPos: { r: 2, c: 3 },
    activeByproduct: '',
    mass: 0,
    status: 'Bình thường',
    handler: ''
  },
  {
    id: 'loc6',
    name: 'Khối 9',
    type: 'class',
    gridPos: { r: 2, c: 4 },
    activeByproduct: '',
    mass: 0,
    status: 'Bình thường',
    handler: ''
  },
  {
    id: 'loc7',
    name: 'Sân trường',
    type: 'yard',
    gridPos: { r: 1, c: 2 },
    activeByproduct: '',
    mass: 0,
    status: 'Bình thường',
    handler: ''
  },
  {
    id: 'loc8',
    name: 'Khu cây xanh',
    type: 'green',
    gridPos: { r: 1, c: 4 },
    activeByproduct: '',
    mass: 0,
    status: 'Bình thường',
    handler: ''
  }
];

export const INITIAL_FLOWS: Flow[] = [
  {
    id: 'f1',
    name: 'Quy trình ủ phân hữu cơ (Compost)',
    byproductType: 'Lá cây',
    steps: [
      { id: 's1_1', label: 'Thu gom', description: 'Gom lá rụng tại các bồn cây và sân trường' },
      { id: 's1_2', label: 'Phân loại', description: 'Loại bỏ túi nilon, sỏi đá bám lẫn trong lá' },
      { id: 's1_3', label: 'Ủ Compost', description: 'Ủ lá trong hố ủ với men vi sinh trong 45 ngày' },
      { id: 's1_4', label: 'Thành phẩm', description: 'Đóng bao phân mùn hữu cơ dinh dưỡng' },
      { id: 's1_5', label: 'Bón cây', description: 'Bón lại cho vườn cây cảnh, vườn rau của trường' }
    ],
    lossRates: [1.0, 0.85, 0.4, 0.4, 0.4], // 20kg -> 17kg phân loại -> 8kg Compost thành phẩm
    outputUnit: 'kg',
    outputName: 'Compost',
    isDefault: true
  },
  {
    id: 'f2',
    name: 'Quy trình tái chế giấy học sinh',
    byproductType: 'Giấy vụn',
    steps: [
      { id: 's2_1', label: 'Thu gom giấy', description: 'Gom giấy vụn từ thùng rác xanh của các lớp' },
      { id: 's2_2', label: 'Phân loại', description: 'Tách biệt bìa cứng, giấy trắng và giấy nilon' },
      { id: 's2_3', label: 'Ép kiện', description: 'Ép giấy vụn thành bánh khối chặt để lưu trữ' },
      { id: 's2_4', label: 'Bán', description: 'Bán cho cơ sở tái chế chuyên dụng' },
      { id: 's2_5', label: 'Quỹ xanh', description: 'Nhận tiền nộp vào Quỹ Kế hoạch nhỏ của trường' }
    ],
    lossRates: [1.0, 0.95, 0.95, 0.95, 10000], // Giấy vụn nhân hệ số giá bán 10.000 VNĐ/kg
    outputUnit: 'đ',
    outputName: 'Quỹ xanh',
    isDefault: true
  },
  {
    id: 'f3',
    name: 'Quy trình xử lý chai nhựa tái chế',
    byproductType: 'Chai nhựa',
    steps: [
      { id: 's3_1', label: 'Thu gom vỏ chai', description: 'Thu gom chai nhựa PET tại căng tin trường' },
      { id: 's3_2', label: 'Súc rửa & Phân loại', description: 'Loại bỏ nắp chai, nhãn mác và súc sạch nước' },
      { id: 's3_3', label: 'Ép bẹp', description: 'Ép dập giảm thể tích thu gom' },
      { id: 's3_4', label: 'Đổi quà xanh', description: 'Quy đổi chai nhựa thành sen đá hoặc dụng cụ học tập' }
    ],
    lossRates: [1.0, 0.9, 0.9, 1.2], // 10kg chai -> 12 cây sen đá/phần quà (hệ số quy đổi)
    outputUnit: 'phần',
    outputName: 'Quà xanh / Sen đá',
    isDefault: true
  }
];

export const INITIAL_COMPARE_METHODS: CompareMethod[] = [
  {
    id: 'cm1',
    byproductType: 'Lá cây',
    methodA: {
      name: 'Phương án A: Ủ phân Compost nội bộ',
      steps: ['Thu gom lá rụng', 'Phân loại bỏ tạp chất', 'Ủ sinh học tại hố ủ của trường', 'Dùng làm phân bón bồi dưỡng cây xanh'],
      cost: 120000, // VNĐ/tháng (tiền mua men vi sinh và dụng cụ)
      profit: 0, // Không bán thương mại
      efficiency: 95, // 95% chất dinh dưỡng được hoàn trả đất, không rác thải phát thải
      benefitText: 'Tạo 150kg phân hữu cơ, bón cho 250m² vườn trường, giảm 100% chi phí mua phân hóa học bên ngoài.'
    },
    methodB: {
      name: 'Phương án B: Chở đi xử lý tập trung',
      steps: ['Thu gom rác', 'Đóng bao tải', 'Xe rác công cộng chở đi chôn lấp/đốt'],
      cost: 300000, // VNĐ/tháng (phí vệ sinh môi trường tăng thêm)
      profit: 0,
      efficiency: 40, // Chỉ 40% thu gom thành công, chôn lấp gây mùi hôi khí methane
      benefitText: 'Không tạo ra thành phẩm hữu ích, phát sinh chi phí vận chuyển và tăng dấu chân carbon của trường.'
    }
  },
  {
    id: 'cm2',
    byproductType: 'Giấy vụn',
    methodA: {
      name: 'Phương án A: Gom kế hoạch nhỏ & Tái chế',
      steps: ['Học sinh tự phân loại tại lớp', 'Đóng kiện giấy cũ', 'Bán cho xưởng giấy tái chế'],
      cost: 15000, // Phí mua bao tải gom
      profit: 350000, // Doanh thu đóng góp quỹ trường
      efficiency: 98,
      benefitText: 'Giúp học sinh rèn thói quen phân loại rác, tích lũy quỹ hoạt động phong trào và cứu sống nhiều cây xanh.'
    },
    methodB: {
      name: 'Phương án B: Vứt chung vào thùng rác tổng hợp',
      steps: ['Vứt sọt rác chung', 'Nhân viên vệ sinh quét dọn', 'Thu gom đổ đống bãi rác'],
      cost: 80000,
      profit: 0,
      efficiency: 10, // Giấy bẩn không thể tái chế nữa, phân hủy tạo khí nhà kính
      benefitText: 'Lãng phí tài nguyên, tăng gánh nặng rác thải đô thị và trường học mất điểm thi đua xanh.'
    }
  }
];

export const INITIAL_LOG_ENTRIES: LogEntry[] = [];

export const INITIAL_OUTPUT_PRODUCTS: OutputProduct[] = [
  { id: 'op1', name: 'Compost dinh dưỡng', totalProduced: 0, used: 0, sold: 0, revenue: 0, unit: 'kg' },
  { id: 'op2', name: 'Giấy tái chế ép kiện', totalProduced: 0, used: 0, sold: 0, revenue: 0, unit: 'kg' },
  { id: 'op3', name: 'Chai nhựa dập bẹp', totalProduced: 0, used: 0, sold: 0, revenue: 0, unit: 'kg' },
  { id: 'op4', name: 'Lon nhôm phế liệu', totalProduced: 0, used: 0, sold: 0, revenue: 0, unit: 'kg' }
];

export const INITIAL_SCORES: Record<ScorePeriod, GreenScoreDetail> = {
  month: {
    reuseRate: 0,
    wasteReduced: 0,
    compostProduced: 0,
    recycledPlastic: 0,
    gardenedArea: 0,
    totalScore: 0
  },
  semester: {
    reuseRate: 0,
    wasteReduced: 0,
    compostProduced: 0,
    recycledPlastic: 0,
    gardenedArea: 0,
    totalScore: 0
  },
  year: {
    reuseRate: 0,
    wasteReduced: 0,
    compostProduced: 0,
    recycledPlastic: 0,
    gardenedArea: 0,
    totalScore: 0
  }
};
