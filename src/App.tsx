import React, { useState } from 'react';
import { StateProvider, useAppState } from './data/StateContext';
import { DashboardOverview } from './components/DashboardOverview';
import { CampusMap } from './components/CampusMap';
import { ByproductManager } from './components/ByproductManager';
import { FlowBuilder } from './components/FlowBuilder';
import { SimulationModel } from './components/SimulationModel';
import { MethodComparison } from './components/MethodComparison';
import { TreatmentLog } from './components/TreatmentLog';
import { OutputManager } from './components/OutputManager';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GreenScore } from './components/GreenScore';
import { AutoReport } from './components/AutoReport';

import {
  LayoutDashboard,
  Map,
  ClipboardList,
  GitFork,
  Play,
  ArrowLeftRight,
  BookOpen,
  Package,
  LineChart,
  Award,
  FileText,
  Menu,
  X,
  Leaf
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard tổng quan', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'map', label: 'Bản đồ số', icon: <Map className="w-4 h-4" /> },
    { id: 'byproducts', label: 'Quản lý phụ phẩm', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'flow', label: 'Thiết kế quy trình', icon: <GitFork className="w-4 h-4" /> },
    { id: 'simulation', label: 'Mô phỏng quy trình', icon: <Play className="w-4 h-4" /> },
    { id: 'comparison', label: 'So sánh phương án', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'log', label: 'Nhật ký xử lý', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'output', label: 'Sản phẩm đầu ra', icon: <Package className="w-4 h-4" /> },
    { id: 'analytics', label: 'Dashboard phân tích', icon: <LineChart className="w-4 h-4" /> },
    { id: 'score', label: 'Điểm trường học xanh', icon: <Award className="w-4 h-4" /> },
    { id: 'report', label: 'Báo cáo tự động', icon: <FileText className="w-4 h-4" /> },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onViewChange={(view) => setActiveTab(view)} />;
      case 'map':
        return <CampusMap />;
      case 'byproducts':
        return <ByproductManager />;
      case 'flow':
        return <FlowBuilder />;
      case 'simulation':
        return <SimulationModel />;
      case 'comparison':
        return <MethodComparison />;
      case 'log':
        return <TreatmentLog />;
      case 'output':
        return <OutputManager />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'score':
        return <GreenScore />;
      case 'report':
        return <AutoReport />;
      default:
        return <DashboardOverview onViewChange={(view) => setActiveTab(view)} />;
    }
  };

  const activeLabel = navigationItems.find(item => item.id === activeTab)?.label || 'EcoCycle School';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans" id="app-root-container">
      
      {/* Top Navbar */}
      <header className="bg-emerald-900 text-white py-4 px-6 sticky top-0 z-40 flex items-center justify-between shadow-md no-print" id="app-header">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-emerald-400 animate-pulse-ring" />
          <h1 className="font-display font-black text-lg tracking-wide">
            🌱 EcoCycle School <span className="text-emerald-300 font-normal text-xs block md:inline md:ml-1.5 border-t md:border-t-0 md:border-l border-emerald-700 md:pl-2">THCS Lý Tự Trọng</span>
          </h1>
        </div>

        {/* Desktop Active Breadcrumb */}
        <div className="hidden md:block text-xs font-semibold text-emerald-100 bg-emerald-800/60 px-3 py-1.5 rounded-lg border border-emerald-700">
          Chương mục: <strong className="text-white">{activeLabel}</strong>
        </div>

        {/* Mobile menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row relative" id="app-main-layout">
        
        {/* Sidebar Navigation */}
        <aside 
          className={`bg-white border-r border-gray-100 w-full md:w-64 shrink-0 p-4 space-y-2 no-print md:block ${
            mobileMenuOpen ? 'block absolute inset-x-0 top-0 z-30 shadow-lg' : 'hidden'
          }`}
          id="app-sidebar"
        >
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-3 mb-2">
            Mục điều hướng chính
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="border-t border-gray-50 pt-4 mt-6 text-center text-[10px] text-gray-400 font-semibold space-y-1">
            <p>© 2026 EcoCycle School</p>
            <p>THCS Lý Tự Trọng</p>
            <p className="px-2 leading-relaxed text-[9px] text-gray-400 font-normal">578 LE DUC THO, AN HOI DONG WARD, HO CHI MINH CITY</p>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full" id="app-content-pane">
          {renderActiveComponent()}
        </main>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 text-center text-[10px] text-gray-400 font-medium no-print space-y-1" id="app-footer">
        <p className="font-bold text-emerald-800 text-xs tracking-wide">🔬 PHỤC VỤ NGHIÊN CỨU KHOA HỌC ĐỀ TÀI: TÁI SỬ DỤNG PHỤ PHẨM NÔNG NGHIỆP THEO HƯỚNG KINH TẾ TUẦN HOÀN</p>
        <p>Hệ thống quản lý, mô phỏng &amp; đánh giá mô hình kinh tế tuần hoàn tại THCS Lý Tự Trọng • Phiên bản 1.0.0</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  );
}
