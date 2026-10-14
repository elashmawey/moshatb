import React, { useState } from 'react';
import { MaterialExpense, TradeType } from '../types';
import { X, Check, PackagePlus } from 'lucide-react';

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
  const [quantity, setQuantity] = useState<string | number>(1);
  const [unit, setUnit] = useState<string>('لفة');
  const [unitPrice, setUnitPrice] = useState<string | number>(500);
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDelivered, setIsDelivered] = useState(true);
  const [notes, setNotes] = useState('');

  const numQty = parseFloat(normalizeArabicNumbers(quantity)) || 0;
  const numPrice = parseFloat(normalizeArabicNumbers(unitPrice)) || 0;
  const totalAmount = numQty * numPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      alert('يرجى كتابة اسم الخامة أو المشتريات');
      return;
    }

    if (numQty <= 0) {
      alert('يرجى إدخال كمية صحيحة أكبر من صفر');
      return;
    }

    const newMaterial: MaterialExpense = {
      id: `m-${Date.now()}`,
      trade,
      itemName: itemName.trim(),
      quantity: numQty,
      unit,
      unitPrice: numPrice,
      totalAmount,
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
                تاريخ الشراء:
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
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              اسم الخامة / الصنف والمواصفات:
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="مثلاً: سلك سويدي معتمد 2.5 مم أصلي"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                الكمية:
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0.001"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
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
                اسم المحل / التاجر:
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="مثلاً: أولاد رجب للمواد البنائية"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                هاتف التاجر (اختياري):
              </label>
              <input
                type="tel"
                value={supplierPhone}
                onChange={(e) => setSupplierPhone(e.target.value)}
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
