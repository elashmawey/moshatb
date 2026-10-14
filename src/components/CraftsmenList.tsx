import React, { useState } from 'react';
import { Craftsman, Payment, TradeType, CraftsmanStatus } from '../types';
import { formatCurrency } from '../utils/storage';
import {
  Phone,
  MessageSquare,
  Plus,
  Search,
  DollarSign,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  UserCheck
} from 'lucide-react';

interface CraftsmenListProps {
  craftsmen: Craftsman[];
  payments: Payment[];
  onAddCraftsman: () => void;
  onEditCraftsman: (craftsman: Craftsman) => void;
  onDeleteCraftsman: (id: string) => void;
  onAddPayment: (craftsmanId: string) => void;
  onOpenWhatsApp: (craftsmanId: string) => void;
  onViewReceipt: (payment: Payment) => void;
}

const ALL_TRADES: (TradeType | 'الكل')[] = [
  'الكل',
  'سباكة',
  'كهرباء',
  'سيراميك وبورسلين',
  'جبس بورد',
  'نقاشة',
  'محارة وبناء',
  'نجارة أبواب',
  'ألوميتال وشبابيك',
];

export const CraftsmenList: React.FC<CraftsmenListProps> = ({
  craftsmen,
  payments,
  onAddCraftsman,
  onEditCraftsman,
  onDeleteCraftsman,
  onAddPayment,
  onOpenWhatsApp,
  onViewReceipt,
}) => {
  const [selectedTrade, setSelectedTrade] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCraftsmanId, setExpandedCraftsmanId] = useState<string | null>(null);

  // Filter craftsmen
  const filtered = craftsmen.filter((c) => {
    const matchesTrade = selectedTrade === 'الكل' || c.trade === selectedTrade;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.trade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrade && matchesSearch;
  });

  const getCraftsmanPayments = (id: string) => payments.filter((p) => p.craftsmanId === id);

  const getStatusBadge = (status: CraftsmanStatus) => {
    switch (status) {
      case 'مكتمل ومستلم':
        return (
          <span className="text-emerald-400 font-medium text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            مكتمل ومستلم
          </span>
        );
      case 'قيد العمل':
        return (
          <span className="text-amber-400 font-medium text-xs flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            قيد العمل حالياً
          </span>
        );
      case 'معلق':
        return (
          <span className="text-rose-400 font-medium text-xs flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            معلق مؤقتاً
          </span>
        );
      default:
        return (
          <span className="text-neutral-400 font-medium text-xs flex items-center gap-1">
            لم يبدأ بعد
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar: Filters and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، المهنة، أو رقم التليفون..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        {/* Primary CTA button */}
        <button
          onClick={onAddCraftsman}
          className="px-4 py-2.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة صنايعي جديد</span>
        </button>
      </div>

      {/* Trade Selector Segmented Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {ALL_TRADES.map((trade) => (
          <button
            key={trade}
            onClick={() => setSelectedTrade(trade)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedTrade === trade
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            {trade}
          </button>
        ))}
      </div>

      {/* Craftsmen Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="p-8 sm:p-14 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3.5">
          <UserCheck className="w-12 h-12 text-neutral-600 mx-auto" />
          <h4 className="text-base font-bold text-white">
            {craftsmen.length === 0
              ? 'ابدأ بتسجيل أول صنايعي في الشقة!'
              : 'لا يوجد صنايعية مطابقين لمعايير البحث في هذا التصنيف'}
          </h4>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            {craftsmen.length === 0
              ? 'سجل الأسطى السباك، الكهربائي، أو النقاش لتسجيل المصنعية المتفق عليها وبنود الاستلام، وبدء توثيق الدفعات وسندات الصرف.'
              : 'جرب اختيار تصنيف آخر من الشريط بالأعلى أو مسح نص البحث.'}
          </p>
          <div className="pt-2">
            <button
              onClick={onAddCraftsman}
              className="px-5 py-2.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{craftsmen.length === 0 ? 'تسجيل أول صنايعي الآن' : 'إضافة صنايعي جديد'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((craftsman) => {
            const cPayments = getCraftsmanPayments(craftsman.id);
            const totalPaid = cPayments.reduce((acc, p) => acc + p.amount, 0);
            const remaining = Math.max(0, craftsman.agreedAmount - totalPaid);
            const percentPaid = craftsman.agreedAmount > 0
              ? Math.min(100, Math.round((totalPaid / craftsman.agreedAmount) * 100))
              : 0;
            const isExpanded = expandedCraftsmanId === craftsman.id;

            return (
              <div
                key={craftsman.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-xs"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-white hover:text-amber-300 transition-colors">
                          {craftsman.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <span className="font-semibold text-amber-400">{craftsman.trade}</span>
                        <span aria-hidden="true">·</span>
                        {getStatusBadge(craftsman.status)}
                      </div>
                    </div>

                    {/* Quick Edit/Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onEditCraftsman(craftsman)}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                        title="تعديل البيانات"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف ${craftsman.name}؟`)) {
                            onDeleteCraftsman(craftsman.id);
                          }
                        }}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Phone and Quick Communication Buttons */}
                  <div className="flex items-center justify-between p-2.5 bg-neutral-950/70 rounded-xl border border-neutral-800/80 mb-4">
                    <span className="text-xs font-mono text-neutral-300 dir-ltr">
                      {craftsman.phone}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${craftsman.phone}`}
                        className="px-2.5 py-1 text-[11px] font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-1 transition-colors"
                        title="اتصال هاتفي"
                      >
                        <Phone className="w-3 h-3 text-sky-400" />
                        <span>اتصال</span>
                      </a>
                      <button
                        onClick={() => onOpenWhatsApp(craftsman.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="محادثة واتساب مجهزة"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-400" />
                        <span>واتساب</span>
                      </button>
                    </div>
                  </div>

                  {/* Financial Bar */}
                  <div className="space-y-2 mb-4 p-3 bg-neutral-950/40 rounded-xl border border-neutral-800/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400">المصنعية المتفق عليها:</span>
                      <span className="font-mono tabular-nums font-bold text-white">
                        {formatCurrency(craftsman.agreedAmount)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentPaid}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-neutral-400">
                        المدفوع: <strong className="text-emerald-400 font-mono tabular-nums">{formatCurrency(totalPaid)}</strong>
                      </span>
                      <span className="text-neutral-400">
                        المتبقي: <strong className="text-amber-400 font-mono tabular-nums">{formatCurrency(remaining)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Notes Preview */}
                  {craftsman.notes && (
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3 line-clamp-2">
                      {craftsman.notes}
                    </p>
                  )}

                  {/* Expandable Terms & Payment History */}
                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t border-neutral-800 text-xs">
                      {/* Agreed terms list */}
                      {craftsman.agreedTerms && craftsman.agreedTerms.length > 0 && (
                        <div>
                          <span className="font-semibold text-neutral-300 block mb-1">
                            بنود وشروط الاتفاق:
                          </span>
                          <ul className="space-y-1 text-neutral-400 pr-3 list-disc">
                            {craftsman.agreedTerms.map((term, idx) => (
                              <li key={idx} className="leading-normal">{term}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Payment History */}
                      <div>
                        <span className="font-semibold text-neutral-300 block mb-1">
                          سجل الدفعات المستلمة ({cPayments.length}):
                        </span>
                        {cPayments.length === 0 ? (
                          <span className="text-neutral-500">لم تسجل أي دفعات حتى الآن.</span>
                        ) : (
                          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            {cPayments.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between p-2 bg-neutral-950 rounded-lg border border-neutral-800/80 text-[11px]"
                              >
                                <div>
                                  <span className="font-mono tabular-nums font-bold text-emerald-400 ml-2">
                                    {formatCurrency(p.amount)}
                                  </span>
                                  <span className="text-neutral-400">{p.milestone}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-neutral-500 font-mono">{p.date}</span>
                                  <button
                                    onClick={() => onViewReceipt(p)}
                                    className="p-1 text-neutral-400 hover:text-amber-300 rounded-sm cursor-pointer"
                                    title="عرض وطباعة الإيصال"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => setExpandedCraftsmanId(isExpanded ? null : craftsman.id)}
                    className="text-[11px] font-medium text-neutral-400 hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <span>إخفاء التفاصيل</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>الشروط والدفعات ({cPayments.length})</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onAddPayment(craftsman.id)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>+ دفعة</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
