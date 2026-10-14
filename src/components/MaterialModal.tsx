import React, { useState } from 'react';
import { MaterialExpense, TradeType } from '../types';
import { X, Check, PackagePlus, Sparkles } from 'lucide-react';

interface MaterialModalProps {
  onSave: (material: MaterialExpense) => void;
  onClose: () => void;
}

const TRADES: TradeType[] = [
  'كهرباء',
  'سباكة',
  'سيراميك وبورسلين',
  'جبس بورد',
  'نقاشة',
  'محارة وبناء',
  'عزل مائي وحراري',
  'نجارة أبواب',
  'ألوميتال وشبابيك',
  'أخرى',
];

const UNITS = ['شيكارة', 'لفة', 'متر', 'بستلة', 'لوح', 'قطعة', 'طن', 'مقطورة', 'طلبية كاملة'];

const COMMON_MATERIALS_BY_TRADE: Record<string, string[]> = {
  'كهرباء': ['سلك سويدي معتمد 2.5 مم', 'سلك سويدي 4 مم للتكييف', 'علب ماجيك وشاسيهات', 'مفاتيح وبرايز فينوس أو بتشينو', 'خراطيم فلتر سويدي'],
  'سباكة': ['مواسير مياه بوليب بروبلين معتمدة', 'محابس دفن إيطالي', 'مواسير صرف 3 بوصة', 'شيكارة عزل سيكا 107', 'سيفون دفن جيربرت'],
  'سيراميك وبورسلين': ['سيراميك أرضيات فرز أول', 'سيراميك حوائط حمام ومطبخ', 'شكاير مادة لصق سيراميك', 'صلبان فواصل وعراميس', 'شكاير أسمنت أبيض للترويبة'],
  'جبس بورد': ['ألواح جبس بورد أخضر مقاوم للرطوبة', 'صاج وزوايا وأوميجا مجلفنة', 'شاش وفيبر وعجينة فواصل', 'مسامير جبس بورد سريعة'],
  'نقاشة': ['بستلات سيلر مائي مقاوم للرطوبة', 'شكاير معجون حوائط سايبس أو جوتن', 'بستلات دهان بلاستيك نصف لامع', 'رولات وفراشي وصنفرة دائرية'],
  'محارة وبناء': ['ألف طوبة أسمنتي مصمت', 'نقلة رمل حرش ناعم', 'طن أسمنت بورتلاندي عادي', 'سلك شبك فواصل وفليكس'],
};

// Convert any Arabic-Indic numerals or formatted numbers to clean standard digits
const normalizeArabicNumbers = (val: string | number): string => {
  return String(val ?? '')
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/[٫,]/g, '.')
    .replace(/[^0-9.]/g, '');
};

export const MaterialModal: React.FC<MaterialModalProps> = ({ onSave, onClose }) => {
  const [trade, setTrade] = useState<TradeType>('كهرباء');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState<string>('1');
  const [unit, setUnit] = useState<string>('لفة');
  const [unitPrice, setUnitPrice] = useState<string>('500');
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDelivered, setIsDelivered] = useState(true);
  const [notes, setNotes] = useState('');

  const numQty = parseFloat(normalizeArabicNumbers(quantity)) || 0;
  const numPrice = parseFloat(normalizeArabicNumbers(unitPrice)) || 0;
  const totalAmount = numQty * numPrice;

  const quickMaterials = COMMON_MATERIALS_BY_TRADE[trade] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      alert('يرجى كتابة اسم الخامة أو المشتريات');
      return;
    }

    const cleanQty = parseFloat(normalizeArabicNumbers(quantity));
    if (isNaN(cleanQty) || cleanQty <= 0) {
      alert('يرجى إدخال كمية صحيحة أكبر من صفر');
      return;
    }

    const cleanPrice = parseFloat(normalizeArabicNumbers(unitPrice));
    if (isNaN(cleanPrice) || cleanPrice < 0) {
      alert('يرجى إدخال سعر صحيح');
      return;
    }

    const newMaterial: MaterialExpense = {
      id: `m-${Date.now()}`,
      trade,
      itemName: itemName.trim(),
      quantity: cleanQty,
      unit,
      unitPrice: cleanPrice,
      totalAmount: cleanQty * cleanPrice,
      supplierName: supplierName.trim() || 'محل تجاري',
      supplierPhone: supplierPhone.trim() || undefined,
      date,
      isDelivered,
      notes: notes.trim() || undefined,
    };

    onSave(newMaterial);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden text-neutral-100 max-h-[92dvh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-semibold text-white">تسجيل خامات ومشتريات تشطيب</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                بند الصنعة:
              </label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value as TradeType)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500"
              >
                {TRADES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                تاريخ الشراء / التوريد:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500 font-mono text-left"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-neutral-300">
                اسم الخامة / الصنف والمواصفات:
              </label>
              {quickMaterials.length > 0 && (
                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3" /> اقتراحات شائعة
                </span>
              )}
            </div>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="مثلاً: سلك سويدي معتمد 2.5 مم أصلي"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500 mb-2"
            />
            {/* Quick Material Suggestions Chips */}
            {quickMaterials.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {quickMaterials.map((mat) => (
                  <button
                    type="button"
                    key={mat}
                    onClick={() => setItemName(mat)}
                    className="text-[10px] sm:text-[11px] px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
                  >
                    {mat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                الكمية:
              </label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={quantity}
                onChange={(e) => setQuantity(normalizeArabicNumbers(e.target.value))}
                placeholder="1"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500 font-mono tabular-nums text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                الوحدة:
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-2 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                سعر الوحدة (ج.م):
              </label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(normalizeArabicNumbers(e.target.value))}
                placeholder="500"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500 font-mono tabular-nums text-left"
              />
            </div>
          </div>

          {/* Auto calculated total preview */}
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
            <span className="text-neutral-400">إجمالي المبلغ المحسوب:</span>
            <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-amber-400">
              {totalAmount.toLocaleString('ar-EG')} ج.م
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                اسم المحل / الموان / التاجر:
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="مثلاً: أولاد رجب لمواد البناء"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                هاتف التاجر (اختياري):
              </label>
              <input
                type="tel"
                inputMode="tel"
                value={supplierPhone}
                onChange={(e) => setSupplierPhone(normalizeArabicNumbers(e.target.value))}
                placeholder="010xxxxxxxx"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500 font-mono text-left"
              />
            </div>
          </div>

          {/* Delivered Checkbox */}
          <div
            className="flex items-center gap-3 p-3 bg-neutral-800/40 rounded-xl border border-neutral-800 cursor-pointer"
            onClick={() => setIsDelivered(!isDelivered)}
          >
            <input
              type="checkbox"
              checked={isDelivered}
              onChange={(e) => setIsDelivered(e.target.checked)}
              className="w-4 h-4 text-emerald-500 rounded-sm border-neutral-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-xs text-neutral-200 select-none">
              تم استلام الخامة وتشوينها داخل الشقة بالفعل
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              ملاحظات أو رقم الفاتورة:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلاً: شاملة التوصيل والونش، كارت الضمان مع الفاتورة..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-base sm:text-xs text-white focus:outline-hidden focus:border-amber-500 leading-relaxed font-sans"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>حفظ الخامة</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
