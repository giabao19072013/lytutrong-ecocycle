import React, { createContext, useContext, useState, useEffect } from 'react';
import { Byproduct, Flow, LogEntry, OutputProduct, SchoolLocation, CompareMethod, GreenScoreDetail, ScorePeriod } from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  INITIAL_BYPRODUCTS,
  INITIAL_LOCATIONS,
  INITIAL_FLOWS,
  INITIAL_COMPARE_METHODS,
  INITIAL_LOG_ENTRIES,
  INITIAL_OUTPUT_PRODUCTS,
  INITIAL_SCORES
} from './initialData';

interface StateContextType {
  byproducts: Byproduct[];
  locations: SchoolLocation[];
  flows: Flow[];
  compareMethods: CompareMethod[];
  logs: LogEntry[];
  outputs: OutputProduct[];
  scores: Record<ScorePeriod, GreenScoreDetail>;
  addByproduct: (b: Omit<Byproduct, 'id'>) => void;
  updateByproduct: (id: string, b: Partial<Byproduct>) => void;
  deleteByproduct: (id: string) => void;
  addFlow: (f: Omit<Flow, 'id'>) => void;
  deleteFlow: (id: string) => void;
  updateLocationStatus: (id: string, status: string, byproduct: string, mass: number, handler: string) => void;
  addLogEntry: (log: Omit<LogEntry, 'id'>) => void;
  deleteLogEntry: (id: string) => void;
  addOutputProduct: (p: Omit<OutputProduct, 'id'>) => void;
  updateOutputProduct: (id: string, updates: Partial<OutputProduct>) => void;
  deleteOutputProduct: (id: string) => void;
  useOutputProduct: (id: string, amount: number) => boolean;
  sellOutputProduct: (id: string, amount: number, pricePerUnit: number) => boolean;
  addCompareMethod: (cm: CompareMethod) => void;
  activePeriod: ScorePeriod;
  setActivePeriod: (period: ScorePeriod) => void;
  recalculateGreenScore: () => void;
  resetData: () => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [byproducts, setByproducts] = useState<Byproduct[]>(() => {
    const saved = localStorage.getItem('ecocycle_byproducts');
    return saved ? JSON.parse(saved) : INITIAL_BYPRODUCTS;
  });

  const [locations, setLocations] = useState<SchoolLocation[]>(() => {
    const saved = localStorage.getItem('ecocycle_locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [flows, setFlows] = useState<Flow[]>(() => {
    const saved = localStorage.getItem('ecocycle_flows');
    return saved ? JSON.parse(saved) : INITIAL_FLOWS;
  });

  const [compareMethods, setCompareMethods] = useState<CompareMethod[]>(() => {
    const saved = localStorage.getItem('ecocycle_compare_methods');
    return saved ? JSON.parse(saved) : INITIAL_COMPARE_METHODS;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('ecocycle_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOG_ENTRIES;
  });

  const [outputs, setOutputs] = useState<OutputProduct[]>(() => {
    const saved = localStorage.getItem('ecocycle_outputs');
    return saved ? JSON.parse(saved) : INITIAL_OUTPUT_PRODUCTS;
  });

  const [scores, setScores] = useState<Record<ScorePeriod, GreenScoreDetail>>(() => {
    const saved = localStorage.getItem('ecocycle_scores');
    return saved ? JSON.parse(saved) : INITIAL_SCORES;
  });

  const [activePeriod, setActivePeriod] = useState<ScorePeriod>('month');
  const [isLoadedFromFirestore, setIsLoadedFromFirestore] = useState(false);

  // 1. Tải dữ liệu từ Firestore khi khởi chạy ứng dụng
  useEffect(() => {
    const loadFromFirestore = async () => {
      try {
        const docRef = doc(db, 'ecocycle_data', 'global_state');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.byproducts) setByproducts(data.byproducts);
          if (data.locations) setLocations(data.locations);
          if (data.flows) setFlows(data.flows);
          if (data.compare_methods) setCompareMethods(data.compare_methods);
          if (data.logs) setLogs(data.logs);
          if (data.outputs) setOutputs(data.outputs);
          if (data.scores) setScores(data.scores);
        } else {
          // Nếu Firestore chưa có dữ liệu, ghi dữ liệu ban đầu không ảo lên Firestore
          await setDoc(docRef, {
            byproducts: INITIAL_BYPRODUCTS,
            locations: INITIAL_LOCATIONS,
            flows: INITIAL_FLOWS,
            compare_methods: INITIAL_COMPARE_METHODS,
            logs: INITIAL_LOG_ENTRIES,
            outputs: INITIAL_OUTPUT_PRODUCTS,
            scores: INITIAL_SCORES
          });
        }
      } catch (err) {
        console.error("Lỗi khi kết nối / đồng bộ với Firebase Firestore:", err);
      } finally {
        setIsLoadedFromFirestore(true);
      }
    };
    loadFromFirestore();
  }, []);

  // 2. Tự động lưu dữ liệu lên Firestore khi có bất kỳ thay đổi trạng thái nào (Debounce 500ms)
  useEffect(() => {
    if (!isLoadedFromFirestore) return;

    const saveToFirestore = async () => {
      try {
        const docRef = doc(db, 'ecocycle_data', 'global_state');
        await setDoc(docRef, {
          byproducts,
          locations,
          flows,
          compare_methods: compareMethods,
          logs,
          outputs,
          scores
        });
      } catch (err) {
        console.error("Lỗi khi đồng bộ dữ liệu lên Firebase Firestore:", err);
      }
    };

    const timer = setTimeout(() => {
      saveToFirestore();
    }, 500);

    return () => clearTimeout(timer);
  }, [byproducts, locations, flows, compareMethods, logs, outputs, scores, isLoadedFromFirestore]);

  // Đồng bộ nhanh với localStorage để tạo lớp đệm tức thì
  useEffect(() => {
    localStorage.setItem('ecocycle_byproducts', JSON.stringify(byproducts));
  }, [byproducts]);

  useEffect(() => {
    localStorage.setItem('ecocycle_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('ecocycle_flows', JSON.stringify(flows));
  }, [flows]);

  useEffect(() => {
    localStorage.setItem('ecocycle_compare_methods', JSON.stringify(compareMethods));
  }, [compareMethods]);

  useEffect(() => {
    localStorage.setItem('ecocycle_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('ecocycle_outputs', JSON.stringify(outputs));
  }, [outputs]);

  useEffect(() => {
    localStorage.setItem('ecocycle_scores', JSON.stringify(scores));
  }, [scores]);

  const addByproduct = (b: Omit<Byproduct, 'id'>) => {
    const newB: Byproduct = {
      ...b,
      id: 'b_' + Math.random().toString(36).substr(2, 9)
    };
    setByproducts(prev => [newB, ...prev]);

    // Đồng thời thêm một dòng log tự động
    addLogEntry({
      date: b.date,
      byproductName: b.name,
      mass: b.mass,
      status: `Ghi nhận nguồn: ${b.status}`,
      handler: b.handler
    });
  };

  const updateByproduct = (id: string, updates: Partial<Byproduct>) => {
    setByproducts(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteByproduct = (id: string) => {
    setByproducts(prev => prev.filter(item => item.id !== id));
  };

  const addFlow = (f: Omit<Flow, 'id'>) => {
    const newFlow: Flow = {
      ...f,
      id: 'f_' + Math.random().toString(36).substr(2, 9)
    };
    setFlows(prev => [...prev, newFlow]);
  };

  const deleteFlow = (id: string) => {
    setFlows(prev => prev.filter(flow => flow.id !== id));
  };

  const updateLocationStatus = (id: string, status: string, byproduct: string, mass: number, handler: string) => {
    setLocations(prev => prev.map(loc => loc.id === id ? {
      ...loc,
      status,
      activeByproduct: byproduct,
      mass,
      handler
    } : loc));
  };

  const addLogEntry = (log: Omit<LogEntry, 'id'>) => {
    const newLog: LogEntry = {
      ...log,
      id: 'log_' + Math.random().toString(36).substr(2, 9)
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const deleteLogEntry = (id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const addOutputProduct = (p: Omit<OutputProduct, 'id'>) => {
    const newProd: OutputProduct = {
      ...p,
      id: 'op_' + Math.random().toString(36).substr(2, 9)
    };
    setOutputs(prev => [...prev, newProd]);
  };

  const updateOutputProduct = (id: string, updates: Partial<OutputProduct>) => {
    setOutputs(prev => prev.map(prod => prod.id === id ? { ...prod, ...updates } : prod));
  };

  const deleteOutputProduct = (id: string) => {
    setOutputs(prev => prev.filter(prod => prod.id !== id));
  };

  const useOutputProduct = (id: string, amount: number): boolean => {
    let success = false;
    setOutputs(prev => prev.map(prod => {
      if (prod.id === id) {
        const remaining = prod.totalProduced - prod.used - prod.sold;
        if (remaining >= amount) {
          success = true;
          return { ...prod, used: prod.used + amount };
        }
      }
      return prod;
    }));
    return success;
  };

  const sellOutputProduct = (id: string, amount: number, pricePerUnit: number): boolean => {
    let success = false;
    setOutputs(prev => prev.map(prod => {
      if (prod.id === id) {
        const remaining = prod.totalProduced - prod.used - prod.sold;
        if (remaining >= amount) {
          success = true;
          const revenueAdd = amount * pricePerUnit;
          return {
            ...prod,
            sold: prod.sold + amount,
            revenue: prod.revenue + revenueAdd
          };
        }
      }
      return prod;
    }));
    return success;
  };

  const addCompareMethod = (cm: CompareMethod) => {
    setCompareMethods(prev => [...prev, cm]);
  };

  const resetData = async () => {
    localStorage.removeItem('ecocycle_byproducts');
    localStorage.removeItem('ecocycle_locations');
    localStorage.removeItem('ecocycle_logs');
    localStorage.removeItem('ecocycle_outputs');
    localStorage.removeItem('ecocycle_scores');

    const cleanByproducts: Byproduct[] = [];
    const cleanLocations = INITIAL_LOCATIONS;
    const cleanLogs: LogEntry[] = [];
    const cleanOutputs = INITIAL_OUTPUT_PRODUCTS;
    const cleanScores = {
      month: { reuseRate: 0, wasteReduced: 0, compostProduced: 0, recycledPlastic: 0, gardenedArea: 0, totalScore: 0 },
      semester: { reuseRate: 0, wasteReduced: 0, compostProduced: 0, recycledPlastic: 0, gardenedArea: 0, totalScore: 0 },
      year: { reuseRate: 0, wasteReduced: 0, compostProduced: 0, recycledPlastic: 0, gardenedArea: 0, totalScore: 0 }
    };

    setByproducts(cleanByproducts);
    setLocations(cleanLocations);
    setLogs(cleanLogs);
    setOutputs(cleanOutputs);
    setScores(cleanScores);

    // Xóa/Ghi đè dữ liệu rỗng trực tiếp lên Firestore luôn
    try {
      const docRef = doc(db, 'ecocycle_data', 'global_state');
      await setDoc(docRef, {
        byproducts: cleanByproducts,
        locations: cleanLocations,
        flows: flows,
        compare_methods: compareMethods,
        logs: cleanLogs,
        outputs: cleanOutputs,
        scores: cleanScores
      });
    } catch (err) {
      console.error("Lỗi khi reset dữ liệu trên Firebase:", err);
    }
  };

  // Tự động tính lại Green Score khi có thay đổi trong byproduct hoặc sản phẩm đầu ra
  const recalculateGreenScore = () => {
    const totalByproductMass = byproducts.reduce((sum, b) => sum + b.mass, 0);
    const recycledByproductMass = byproducts
      .filter(b => b.status === 'Đã xử lý' || b.status === 'Đang xử lý')
      .reduce((sum, b) => sum + b.mass, 0);

    const reuseRate = totalByproductMass > 0 ? Math.round((recycledByproductMass / totalByproductMass) * 100) : 0;

    // Lượng compost đã sản xuất
    const compostProd = outputs.find(o => o.id === 'op1')?.totalProduced || 0;
    // Lượng nhựa tái chế
    const plasticRecycled = outputs.find(o => o.id === 'op3')?.totalProduced || 0;
    // Số mét vuông vườn trường
    const defaultGardened = Math.round(compostProd * 6);

    const wasteReduced = Math.round(recycledByproductMass + compostProd * 0.8 + plasticRecycled * 0.9);

    // Tính điểm tổng hợp (Green Score)
    const scoreBase = Math.round(
      (reuseRate * 0.4) +
      (Math.min(wasteReduced / 2, 40)) +
      (Math.min(compostProd * 0.8, 20))
    );
    const finalScore = Math.max(0, Math.min(100, scoreBase));

    setScores(prev => ({
      ...prev,
      month: {
        reuseRate: reuseRate,
        wasteReduced: wasteReduced,
        compostProduced: compostProd,
        recycledPlastic: plasticRecycled,
        gardenedArea: defaultGardened,
        totalScore: finalScore
      }
    }));
  };

  useEffect(() => {
    recalculateGreenScore();
  }, [byproducts, outputs]);

  useEffect(() => {
    // Tự động dọn dẹp localStorage cũ có chứa dữ liệu mẫu để tránh hiển thị số liệu ảo
    const hasReset = localStorage.getItem('ecocycle_clean_v4_reset');
    if (!hasReset) {
      localStorage.removeItem('ecocycle_byproducts');
      localStorage.removeItem('ecocycle_locations');
      localStorage.removeItem('ecocycle_logs');
      localStorage.removeItem('ecocycle_outputs');
      localStorage.removeItem('ecocycle_scores');
      localStorage.setItem('ecocycle_clean_v4_reset', 'true');
      resetData();
    }
  }, []);

  return (
    <StateContext.Provider value={{
      byproducts,
      locations,
      flows,
      compareMethods,
      logs,
      outputs,
      scores,
      addByproduct,
      updateByproduct,
      deleteByproduct,
      addFlow,
      deleteFlow,
      updateLocationStatus,
      addLogEntry,
      deleteLogEntry,
      addOutputProduct,
      updateOutputProduct,
      deleteOutputProduct,
      useOutputProduct,
      sellOutputProduct,
      addCompareMethod,
      activePeriod,
      setActivePeriod,
      recalculateGreenScore,
      resetData
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
