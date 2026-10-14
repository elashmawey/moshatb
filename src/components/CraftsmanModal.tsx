import React, { useState } from 'react';
import { Craftsman, TradeType, CraftsmanStatus } from '../types';
import { X, Check, UserPlus, HardHat } from 'lucide-react';

interface CraftsmanModalProps {
  craftsman?: Craftsman | null;
  onSave: (craftsman: Craftsman) => void;
  onClose: () => void;
}

const TRADES: TradeType[] = [
  'نقاشة',
  'سباكة',
  'كهرباء',
  'سيراميك وبورسلين',
  'جبس بورد',
  'محارة وبناء',
  'نجارة أبواب',
  'ألوميتال وشبابيك',
  'تكييف وتهوية',
  'عزل مائي وحراري',
  'أخرى',
];

const STATUSES: CraftsmanStatus[] = ['لم يبدأ', 'قيد العمل', 'معلق', 'مكتمل ومستلم'];

// Convert any Arabic-Indic numerals or formatted numbers to clean standard digits
const normalizeArabicNumbers = (val: string | number): string => {
  return String(val ?? '')
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/[٫,]/g, '.')
    .replace(/[^0-9.]/g, '');
};

export const CraftsmanModal: React.FC<CraftsmanModalProps> = ({
  craftsman,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(craftsman?.name || '');
  const [trade, setTrade] = useState<TradeType>(craftsman?.trade || 'سباكة');
  const [phone, setPhone] = useState(craftsman?.phone || '');
  const [agreedAmount, setAgreedAmount] = useState<number | string>(
    craftsman ? craftsman.agreedAmount : ''
  );
  const [status, setStatus] = useState<CraftsmanStatus>(craftsman?.status || 'لم يبدأ');
  const [rating, setRating] = useState<number>(craftsman?.rating || 5);
  const [notes, setNotes] = useState(craftsman?.notes || '');
  const [assistantCount, setAssistantCount] = useState<number>(craftsman?.assistantCount || 1);
  const [termsText, setTermsText] = useState<string>(
    craftsman?.agreedTerms ? craftsman.agreedTerms.join('\n') : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('يرجى إدخال اسم الصنايعي');
      return;
    }

    const terms = termsText
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const parsedAgreed = parseFloat(normalizeArabicNumbers(agreedAmount));

    const savedCraftsman: Craftsman = {
      id: craftsman ? craftsman.id : `c-${Date.now()}`,
      name: name.trim(),
      trade,
      phone: phone.trim() || '01000000000',
      agreedAmount: isNaN(parsedAgreed) ? 0 : parsedAgreed,
      status,
      rating,
      notes: notes.trim(),
      assistantCount: Number(assistantCount) || 1,
      agreedTerms: terms.length > 0 ? terms : undefined,
    };

    onSave(savedCraftsman);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden text-neutral-100 max-h-[92dvh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-semibold text-white">
              {craftsman ? 'تعديل بيانات الصنايعي' : 'إضافة صنايعي جديد'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                اسم الصنايعي / المقاول:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً: الأسطى محروس"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                المهنة / التخصص:
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                رقم الهاتف (واتساب):
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01012345678"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500 font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                المصنعية الإجمالية المتفق عليها (ج.م):
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={agreedAmount}
                onChange={(e) => setAgreedAmount(e.target.value)}
                placeholder="20000"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500 font-mono tabular-nums text-left"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                حالة العمل الحالية:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CraftsmanStatus)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                عدد المساعدين / الصبيان:
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={assistantCount}
                onChange={(e) => setAssistantCount(Number(e.target.value))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500 font-mono tabular-nums text-left"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              التقييم المبدئي / التزام الصنايعي (من 5):
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-colors cursor-pointer ${
                    rating >= star
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700 hover:text-neutral-300'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          {/* Agreed Terms */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              شروط وبنود الاتفاق (اكتب كل شرط في سطر مستقل):
            </label>
            <textarea
              rows={3}
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
              placeholder="مثلاً:&#10;الاستلام بميزان ليزر وقدة ألمونيوم&#10;الكبس بالبار على حساب الصنايعي&#10;نظافة الشقة بعد الانتهاء"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-base sm:text-xs text-white focus:outline-hidden focus:border-amber-500 leading-relaxed font-sans"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              ملاحظات شخصية عن الصنايعي:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلاً: بيحب يشرب شاي بسكر خفيف، بيشتغل من 8 لـ 4، جاب معاه عدة نظيفة..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-base sm:text-xs text-white focus:outline-hidden focus:border-amber-500 leading-relaxed font-sans"
            />
          </div>

          {/* Form Submit Footer */}
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
              <span>{craftsman ? 'حفظ التعديلات' : 'إضافة الصنايعي'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
