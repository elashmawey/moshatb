import { Craftsman, Payment, MaterialExpense, FinishingStage } from '../types';
import { initialCraftsmen, initialPayments, initialMaterials, initialStages } from '../data/initialData';

const STORAGE_KEYS = {
  CRAFTSMEN: 'moshateb_craftsmen_v1',
  PAYMENTS: 'moshateb_payments_v1',
  MATERIALS: 'moshateb_materials_v1',
  STAGES: 'moshateb_stages_v1',
  APARTMENT_NAME: 'moshateb_apt_name_v1',
};

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
    apartmentName: localStorage.getItem(STORAGE_KEYS.APARTMENT_NAME) || 'شقة العمر - الدور الخامس',
  };
};

export const saveData = {
  craftsmen: (data: Craftsman[]) => localStorage.setItem(STORAGE_KEYS.CRAFTSMEN, JSON.stringify(data)),
  payments: (data: Payment[]) => localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(data)),
  materials: (data: MaterialExpense[]) => localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(data)),
  stages: (data: FinishingStage[]) => localStorage.setItem(STORAGE_KEYS.STAGES, JSON.stringify(data)),
  apartmentName: (name: string) => localStorage.setItem(STORAGE_KEYS.APARTMENT_NAME, name),
};

export const resetToDefaultData = () => {
  localStorage.removeItem(STORAGE_KEYS.CRAFTSMEN);
  localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  localStorage.removeItem(STORAGE_KEYS.MATERIALS);
  localStorage.removeItem(STORAGE_KEYS.STAGES);
  localStorage.removeItem(STORAGE_KEYS.APARTMENT_NAME);
  return {
    craftsmen: initialCraftsmen,
    payments: initialPayments,
    materials: initialMaterials,
    stages: initialStages,
    apartmentName: 'شقة العمر - الدور الخامس',
  };
};

export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('ar-EG')} ج.م`;
};
