import React, { useState } from 'react';
import { Craftsman, Payment } from '../types';
import { formatCurrency } from '../utils/storage';
import { X, Check, DollarSign } from 'lucide-react';

interface PaymentModalProps {
  craftsmen: Craftsman[];
  selectedCraftsmanId?: string;
  payments: Payment[];
  onSave: (payment: Payment) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  craftsmen,
  selectedCraftsmanId,
  payments,
  onSave,
  onClose,
}) => {
  const [craftsmanId, setCraftsmanId] = useState<string>(
    selectedCraftsmanId || (craftsmen.length > 0 ? craftsmen[0].id : '')
  );
  const [amount, setAmount] = useState<number>(3000);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [milestone, setMilestone] = useState<string>('دفعة إنجاز مرحلة التأسيس');
  const [method, setMethod] = useState<'كاش' | 'فودافون كاش' | 'إنستاباي' | 'تحويل بنكي'>('كاش');
  const [notes, setNotes] = useState<string>('');

  const currentCraftsman = craftsmen.find((c) => c.id === craftsmanId);
  const craftsmanPaidAlready = payments
    .filter((p) => p.craftsmanId === craftsmanId)
    .reduce((sum, p) => sum + p.amount, 0);

  const agreed = currentCraftsman?.agreedAmount || 0;
  const currentRemaining = Math.max(0, agreed - craftsmanPaidAlready);
  const newRemaining = Math.max(0, currentRemaining - amount);

  const quickMilestones = [
    'عربون بدء العمل وتثبيت الموعد',
    'دفعة بعد انتهاء التكسير والتمديد',
    'دفعة بعد سحب الأسلاك وتجميع اللوحة',
    'دفعة بعد كبس المواسير والعزل',
    'دفعة بعد انتهاء السيراميك والعراميس',
    'دفعة سكاكين معجون وسيلر',
    'مخالصة نهائية وتسليم مفتاح الشقة',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!craftsmanId) {
      alert('يرجى اختيار الصنايعي');
      return;
    }
    if (!amount || amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }

    const existingNumbers = payments
      .map((p) => {
        const match = p.receiptNumber.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextReceiptNum = `REC-${String(maxNum + 1).padStart(3, '0')}`;

    const newPayment: Payment = {
      id: `p-${Date.now()}`,
      craftsmanId,
      amount: Number(amount),
      date,
      milestone: milestone.trim(),
      method,
      notes: notes.trim() || undefined,
      receiptNumber: nextReceiptNum,
    };

    onSave(newPayment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">تسجيل دفعة / عربون مالي</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Select Craftsman */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              الصنايعي المستلم:
            </label>
            <select
              value={craftsmanId}
              onChange={(e) => setCraftsmanId(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-500"
            >
              {craftsmen.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.trade})
                </option>
              ))}
            </select>
          </div>

          {/* Balance Preview Card */}
          {currentCraftsman && (
            <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-neutral-500 block text-[11px]">المتفق عليه</span>
                <span className="font-mono tabular-nums text-neutral-200 font-bold">
                  {formatCurrency(agreed)}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">المسدد سابقاً</span>
                <span className="font-mono tabular-nums text-emerald-400 font-bold">
                  {formatCurrency(craftsmanPaidAlready)}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">المتبقي بعد الدفعة</span>
                <span className="font-mono tabular-nums text-amber-400 font-bold">
                  {formatCurrency(newRemaining)}
                </span>
              </div>
            </div>
          )}

          {/* Amount and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                مبلغ الدفعة (ج.م):
              </label>
              <input
                type="number"
                min="1"
                step="50"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="5000"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500 font-mono tabular-nums text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                تاريخ السداد:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-500 font-mono text-left"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              طريقة التحويل / السداد:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['كاش', 'إنستاباي', 'فودافون كاش', 'تحويل بنكي'] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`py-2 px-2.5 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                    method === m
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold'
                      : 'border-neutral-800 bg-neutral-800/60 text-neutral-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Milestone / Purpose */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-neutral-300">
                بند الدفعة أو المرحلة:
              </label>
              <span className="text-[11px] text-neutral-500">اختر من المقترحات أو اكتب</span>
            </div>
            <input
              type="text"
              required
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              placeholder="مثلاً: دفعة بعد الانتهاء من كبس السباكة"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-amber-500 mb-2"
            />
            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-1.5">
              {quickMilestones.slice(0, 4).map((qm) => (
                <button
                  type="button"
                  key={qm}
                  onClick={() => setMilestone(qm)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
                >
                  {qm}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              ملاحظات أو رقم المعاملة (اختياري):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلاً: تم التحويل على رقم إنستاباي، أو تسليم كاش في الشقة..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-amber-500 leading-relaxed font-sans"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>تأكيد وتسجيل الدفعة</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
