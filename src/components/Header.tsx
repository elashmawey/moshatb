import React, { useState } from 'react';
import { formatCurrency } from '../utils/storage';
import {
  Wrench,
  DollarSign,
  Package,
  Layers,
  ShieldCheck,
  Calculator,
  MessageSquare,
  Plus,
  RotateCcw,
  Home,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export type ActiveTabType =
  | 'craftsmen'
  | 'payments'
  | 'materials'
  | 'timeline'
  | 'inspection'
  | 'calculators';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  apartmentName: string;
  setApartmentName: (name: string) => void;
  totalAgreedLabor: number;
  totalPaidLabor: number;
  totalRemainingLabor: number;
  totalMaterialsCost: number;
  progressPercent: number;
  onAddCraftsman: () => void;
  onOpenQuickWhatsApp: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  apartmentName,
  setApartmentName,
  totalAgreedLabor,
  totalPaidLabor,
  totalRemainingLabor,
  totalMaterialsCost,
  progressPercent,
  onAddCraftsman,
  onOpenQuickWhatsApp,
  onResetData,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(apartmentName);

  const grandPaidTotal = totalPaidLabor + totalMaterialsCost;
  const grandEstimatedTotal = totalAgreedLabor + totalMaterialsCost;

  const handleSaveName = () => {
    if (tempName.trim()) {
      setApartmentName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/95 sticky top-0 z-40 backdrop-blur-md">
      
      {/* Top Bar Contract: 3 zones, 1 line, gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-black text-base shadow-xs">
              م
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              مشطّب
            </span>
          </div>

          {/* Zone 2: Navigation Links (Single-line, 1-2 words) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-400">
            <button
              onClick={() => setActiveTab('craftsmen')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'craftsmen' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              الصنايعية
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'payments' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              الدفعات والعربونات
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'materials' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              الخامات والمشتريات
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'timeline' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              مراحل التشطيب
            </button>
            <button
              onClick={() => setActiveTab('inspection')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'inspection' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              دليل الاستلام
            </button>
            <button
              onClick={() => setActiveTab('calculators')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'calculators' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              حاسبة الخامات
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick WhatsApp */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenQuickWhatsApp}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="رسائل واتساب جاهزة للصنايعية"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>رسائل سريعة</span>
            </button>
            <button
              onClick={onAddCraftsman}
              className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة صنايعي</span>
            </button>
          </div>

        </div>

        {/* Mobile Nav Tabs Bar (Scrollable on small screens) */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2.5 border-t border-neutral-800/80 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('craftsmen')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'craftsmen' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            الصنايعية
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'payments' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            الدفعات
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'materials' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            الخامات
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'timeline' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            المراحل
          </button>
          <button
            onClick={() => setActiveTab('inspection')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'inspection' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            دليل الاستلام
          </button>
          <button
            onClick={() => setActiveTab('calculators')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'calculators' ? 'bg-amber-400 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            حاسبة الكميات
          </button>
        </div>

      </div>

      {/* Sub-header: Apartment Identity & Live Financial Scoreboard */}
      <div className="bg-neutral-900 border-t border-neutral-800/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Apartment Title with inline rename */}
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-amber-400 shrink-0" />
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-hidden focus:border-amber-400"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-2 py-1 text-xs bg-amber-400 text-neutral-950 font-bold rounded-lg cursor-pointer"
                >
                  حفظ
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="px-2 py-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {apartmentName}
                </span>
                <button
                  onClick={() => {
                    setTempName(apartmentName);
                    setIsEditingName(true);
                  }}
                  className="text-[11px] text-neutral-500 hover:text-amber-400 underline cursor-pointer"
                >
                  تعديل الاسم
                </button>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar with Tabular Numerals */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-neutral-300">
            <div>
              <span className="text-neutral-500 block text-[11px]">مصنعيات متفق عليها</span>
              <span className="font-mono tabular-nums font-bold text-white">
                {formatCurrency(totalAgreedLabor)}
              </span>
            </div>

            <div>
              <span className="text-neutral-500 block text-[11px]">المدفوع للصنايعية</span>
              <span className="font-mono tabular-nums font-bold text-emerald-400">
                {formatCurrency(totalPaidLabor)}
              </span>
            </div>

            <div>
              <span className="text-neutral-500 block text-[11px]">المتبقي للصنايعية</span>
              <span className="font-mono tabular-nums font-bold text-amber-400">
                {formatCurrency(totalRemainingLabor)}
              </span>
            </div>

            <div>
              <span className="text-neutral-500 block text-[11px]">مشتريات الخامات</span>
              <span className="font-mono tabular-nums font-bold text-sky-400">
                {formatCurrency(totalMaterialsCost)}
              </span>
            </div>

            <div className="hidden sm:block border-r border-neutral-700 pr-4">
              <span className="text-neutral-500 block text-[11px]">إجمالي المصروف الفعلي</span>
              <span className="font-mono tabular-nums font-bold text-white text-sm">
                {formatCurrency(grandPaidTotal)}
              </span>
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                if (confirm('هل تريد استعادة البيانات النموذجية الافتراضية للتشطيب؟')) {
                  onResetData();
                }
              }}
              className="p-1.5 text-neutral-500 hover:text-neutral-300 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer mr-auto md:mr-0"
              title="استعادة البيانات الافتراضية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

    </header>
  );
};
