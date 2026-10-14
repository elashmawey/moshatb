import { Craftsman, Payment, MaterialExpense, FinishingStage } from '../types';
import { initialCraftsmen, initialPayments, initialMaterials, initialStages } from '../data/initialData';

const STORAGE_KEYS = {
  CRAFTSMEN: 'moshateb_craftsmen_v2',
  PAYMENTS: 'moshateb_payments_v2',
  MATERIALS: 'moshateb_materials_v2',
  STAGES: 'moshateb_stages_v2',
  APARTMENT_NAME: 'moshateb_apt_name_v2',
};

// Clean legacy v1 mock keys if present
if (typeof window !== 'undefined') {
  try {
    ['moshateb_craftsmen_v1', 'moshateb_payments_v1', 'moshateb_materials_v1', 'moshateb_stages_v1', 'moshateb_apt_name_v1'].forEach((k) => {
      localStorage.removeItem(k);
    });
  } catch {
    // Ignore storage errors in restricted webviews
  }
}

export const loadInitialData = () => {
  const getStored = <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item);
    } catch {
      return fallback;
    }
  };

  return {
    craftsmen: getStored<Craftsman[]>(STORAGE_KEYS.CRAFTSMEN, initialCraftsmen),
    payments: getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, initialPayments),
    materials: getStored<MaterialExpense[]>(STORAGE_KEYS.MATERIALS, initialMaterials),
    stages: getStored<FinishingStage[]>(STORAGE_KEYS.STAGES, initialStages),
    apartmentName: localStorage.getItem(STORAGE_KEYS.APARTMENT_NAME) || 'مشروع تشطيب الشقة',
  };
};

export const saveData = {
  craftsmen: (data: Craftsman[]) => {
    try { localStorage.setItem(STORAGE_KEYS.CRAFTSMEN, JSON.stringify(data)); } catch {}
  },
  payments: (data: Payment[]) => {
    try { localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(data)); } catch {}
  },
  materials: (data: MaterialExpense[]) => {
    try { localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(data)); } catch {}
  },
  stages: (data: FinishingStage[]) => {
    try { localStorage.setItem(STORAGE_KEYS.STAGES, JSON.stringify(data)); } catch {}
  },
  apartmentName: (name: string) => {
    try { localStorage.setItem(STORAGE_KEYS.APARTMENT_NAME, name); } catch {}
  },
};

export const resetToDefaultData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CRAFTSMEN);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.MATERIALS);
    localStorage.removeItem(STORAGE_KEYS.STAGES);
    localStorage.removeItem(STORAGE_KEYS.APARTMENT_NAME);
  } catch {}
  return {
    craftsmen: initialCraftsmen,
    payments: initialPayments,
    materials: initialMaterials,
    stages: initialStages,
    apartmentName: 'مشروع تشطيب الشقة',
  };
};

export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('ar-EG')} ج.م`;
};
