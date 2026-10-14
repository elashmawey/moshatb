export type TradeType = 
  | 'نقاشة'
  | 'سباكة'
  | 'كهرباء'
  | 'سيراميك وبورسلين'
  | 'جبس بورد'
  | 'محارة وبناء'
  | 'نجارة أبواب'
  | 'ألوميتال وشبابيك'
  | 'تكييف وتهوية'
  | 'عزل مائي وحراري'
  | 'أخرى';

export type CraftsmanStatus = 'لم يبدأ' | 'قيد العمل' | 'معلق' | 'مكتمل ومستلم';

export interface Craftsman {
  id: string;
  name: string;
  trade: TradeType;
  phone: string;
  agreedAmount: number; // المبلغ المتفق عليه للمصنعية
  status: CraftsmanStatus;
  rating: number; // 1-5
  notes: string;
  startDate?: string;
  deadline?: string;
  assistantCount?: number; // عدد العمالة/المساعدين
  agreedTerms?: string[]; // شروط الاتفاق (مثلاً: الاستلام بميزان، نظافة المكان)
}

export interface Payment {
  id: string;
  craftsmanId: string;
  amount: number;
  date: string;
  milestone: string; // بند الدفعة مثلاً "عربون تأسيس" أو "دفعة بعد رمي الخراطيم"
  method: 'كاش' | 'فودافون كاش' | 'إنستاباي' | 'تحويل بنكي';
  notes?: string;
  receiptNumber: string;
}

export interface MaterialExpense {
  id: string;
  trade: TradeType;
  itemName: string;
  quantity: number;
  unit: string; // متر، لفة، شيكارة، بستلة، لوح، قطعة
  unitPrice: number;
  totalAmount: number;
  supplierName: string;
  supplierPhone?: string;
  date: string;
  isDelivered: boolean;
  notes?: string;
}

export interface StageChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface FinishingStage {
  id: string;
  order: number;
  title: string;
  trade: TradeType;
  description: string;
  status: 'لم تبدأ' | 'قيد التنفيذ' | 'تم الاستلام';
  checklist: StageChecklistItem[];
  proTips: string[];
  warningNote: string;
}

export interface InspectionChecklist {
  trade: TradeType;
  title: string;
  badge: string;
  howToInspect: string[];
  toolsNeeded: string[];
  criticalMistakesToAvoid: string[];
}
