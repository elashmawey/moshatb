import React, { useState } from 'react';
import { MaterialExpense, TradeType } from '../types';
import { formatCurrency } from '../utils/storage';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Trash2,
  Store,
  Calendar,
  Layers
} from 'lucide-react';

interface MaterialsTrackerProps {
  materials: MaterialExpense[];
  onAddMaterial: () => void;
  onToggleDelivered: (id: string) => void;
  onDeleteMaterial: (id: string) => void;
}

const MATERIAL_TRADES: (TradeType | 'الكل')[] = [
  'الكل',
  'كهرباء',
  'سباكة',
  'محارة وبناء',
  'سيراميك وبورسلين',
  'جبس بورد',
  'نقاشة',
  'عزل مائي وحراري',
];

export const MaterialsTracker: React.FC<MaterialsTrackerProps> = ({
  materials,
  onAddMaterial,
  onToggleDelivered,
  onDeleteMaterial,
}) => {
  const [selectedTrade, setSelectedTrade] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'delivered' | 'pending'>('all');

  const filteredMaterials = materials.filter((m) => {
    const matchesTrade = selectedTrade === 'الكل' || m.trade === selectedTrade;
    const matchesDelivery =
      deliveryFilter === 'all'
        ? true
        : deliveryFilter === 'delivered'
        ? m.isDelivered
        : !m.isDelivered;
    const matchesSearch =
      m.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.trade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrade && matchesDelivery && matchesSearch;
  });

  const totalSpent = filteredMaterials.reduce((sum, m) => sum + m.totalAmount, 0);
  const pendingDeliveries = materials.filter((m) => !m.isDelivered).length;

  return (
    <div className="space-y-6">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block mb-1">إجمالي تكلفة المشتريات</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">
              {formatCurrency(totalSpent)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block mb-1">أصناف تم توريدها للشقة</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
              {materials.filter((m) => m.isDelivered).length} <span className="text-xs text-neutral-400 font-normal">صنف</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block mb-1">طلبيات بانتظار التوصيل</span>
            <span className="text-2xl font-extrabold text-rose-400 font-mono tabular-nums">
              {pendingDeliveries} <span className="text-xs text-neutral-400 font-normal">طلبية</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search & Status */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في اسم الخامة أو المحل أو البند..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs">
            <button
              onClick={() => setDeliveryFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                deliveryFilter === 'all'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setDeliveryFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                deliveryFilter === 'delivered'
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              تم التوريد
            </button>
            <button
              onClick={() => setDeliveryFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                deliveryFilter === 'pending'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              في انتظار التوصيل
            </button>
          </div>
        </div>

        {/* CTA Add Material */}
        <button
          onClick={onAddMaterial}
          className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مشتريات خامات</span>
        </button>
      </div>

      {/* Trade Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {MATERIAL_TRADES.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTrade(t)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedTrade === t
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Materials Cards List or Empty State */}
      {filteredMaterials.length === 0 ? (
        <div className="p-8 sm:p-14 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3.5">
          <Layers className="w-12 h-12 text-neutral-600 mx-auto" />
          <h4 className="text-base font-bold text-white">
            {materials.length === 0
              ? 'لم يتم تسجيل أي فواتير خامات أو مشتريات بعد'
              : 'لا توجد خامات مطابقة لمعايير البحث في هذا البند'}
          </h4>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            {materials.length === 0
              ? 'سجل فواتير الموانين ومحلات السباكة، الكهرباء، والمحارة لحساب تكلفة الشقة ومتابعة ما تم توريده وتشوينه.'
              : 'جرب اختيار تصنيف آخر من الشريط بالأعلى أو مسح نص البحث.'}
          </p>
          {materials.length === 0 && (
            <div className="pt-2">
              <button
                onClick={onAddMaterial}
                className="px-5 py-2.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة أول فاتورة خامات</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className={`bg-neutral-900 border rounded-2xl p-4.5 flex flex-col justify-between transition-all ${
                mat.isDelivered ? 'border-neutral-800' : 'border-rose-900/40 bg-neutral-900/90'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400 block mb-0.5">
                      {mat.trade}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {mat.itemName}
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`هل تريد حذف صنف "${mat.itemName}"؟`)) {
                        onDeleteMaterial(mat.id);
                      }
                    }}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quantity & Unit Pricing */}
                <div className="flex items-center justify-between p-2.5 bg-neutral-950/70 rounded-xl border border-neutral-800/80 mb-3 text-xs">
                  <div>
                    <span className="text-neutral-400">الكمية: </span>
                    <span className="font-bold text-white font-mono tabular-nums">
                      {mat.quantity} {mat.unit}
                    </span>
                    <span className="text-neutral-500 text-[11px] block">
                      سعر الوحدة: {mat.unitPrice.toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] text-neutral-400 block">الإجمالي</span>
                    <span className="font-extrabold font-mono tabular-nums text-amber-400 text-sm">
                      {formatCurrency(mat.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Supplier info */}
                <div className="space-y-1 text-xs text-neutral-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>المحل: <strong className="text-neutral-300 font-normal">{mat.supplierName}</strong></span>
                  </div>
                  {mat.supplierPhone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="font-mono dir-ltr">{mat.supplierPhone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="font-mono">{mat.date}</span>
                  </div>
                  {mat.notes && (
                    <p className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/60">
                      {mat.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Toggle Button */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">حالة التشوين:</span>
                <button
                  onClick={() => onToggleDelivered(mat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                    mat.isDelivered
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
                  }`}
                >
                  {mat.isDelivered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم الاستلام بالشقة</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      <span>في انتظار التوصيل (اضغط للاستلام)</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
