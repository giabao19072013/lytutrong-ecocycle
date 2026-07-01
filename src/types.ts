export interface Byproduct {
  id: string;
  name: string;
  category: 'Hữu cơ' | 'Tái chế' | 'Khác';
  source: string;
  mass: number; // kg
  date: string; // YYYY-MM-DD
  status: 'Chưa xử lý' | 'Đang xử lý' | 'Đã xử lý' | 'Đã thu gom';
  handler: string;
  notes: string;
  image?: string;
}

export interface FlowStep {
  id: string;
  label: string;
  description: string;
}

export interface Flow {
  id: string;
  name: string;
  byproductType: string;
  steps: FlowStep[];
  lossRates: number[]; // Tỷ lệ bảo toàn qua từng bước (ví dụ: [1.0, 0.85, 0.4, 0.4])
  outputUnit: string;
  outputName: string;
  isDefault?: boolean;
}

export interface LogEntry {
  id: string;
  date: string;
  byproductName: string;
  mass: number;
  status: string;
  handler: string;
}

export interface OutputProduct {
  id: string;
  name: string;
  totalProduced: number;
  used: number;
  sold: number;
  revenue: number; // VNĐ
  unit: string;
}

export interface SchoolLocation {
  id: string;
  name: string;
  type: 'green' | 'canteen' | 'class' | 'yard' | 'garden';
  gridPos: { r: number; c: number }; // Để vẽ lưới 2D/isometric đẹp mắt
  activeByproduct: string;
  mass: number;
  status: string;
  handler: string;
}

export interface CompareMethod {
  id: string;
  byproductType: string;
  methodA: {
    name: string;
    steps: string[];
    cost: number;
    profit: number;
    efficiency: number; // %
    benefitText: string;
  };
  methodB: {
    name: string;
    steps: string[];
    cost: number;
    profit: number;
    efficiency: number; // %
    benefitText: string;
  };
}

export type ScorePeriod = 'month' | 'semester' | 'year';

export interface GreenScoreDetail {
  reuseRate: number; // 0-100
  wasteReduced: number; // kg
  compostProduced: number; // kg
  recycledPlastic: number; // kg
  gardenedArea: number; // m2
  totalScore: number; // 0-100
}
