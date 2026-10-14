import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/storage';
import {
  Plus,
  RotateCcw,
  Home,
  MessageSquare,
  Download,
  Wifi,
  WifiOff,
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
  onAddCraftsman,
  onOpenQuickWhatsApp,
  onResetData,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(apartmentName);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const grandPaidTotal = totalPaidLabor + totalMaterialsCost;

  const handleSaveName = () => {
    if (tempName.trim()) {
      setApartmentName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/95 sticky top-0 z-40 backdrop-blur-md">
      
      {/* Top Bar: Wordmark, Nav & Main CTA */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-6 h-14 sm:h-16">
          
          {/* Zone 1: Wordmark & Offline indicator */}
          <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black text-base shadow-xs select-none">
              م
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                مشطّب
              </span>
              <span className="hidden sm:inline-block text-[11px] text-amber-400 font-semibold">
                إدارة التشطيب
              </span>
            </div>

            {/* Offline pill */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
              }`}
              title={isOnline ? 'متصل بالإنترنت والتطبيق يعمل أوفلاين' : 'يعمل حالياً بدون إنترنت وحفظ محلي'}
            >
              {isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="hidden xs:inline">أوفلاين جاهز</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-2.5 h-2.5" />
                  <span>بدون إنترنت</span>
                </>
              )}
            </span>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-400">
            <button
              onClick={() => setActiveTab('craftsmen')}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'craftsmen' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              الصنايعية
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'payments' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              الدفعات والعربونات
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'materials' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              الخامات والمشتريات
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'timeline' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              مراحل التشطيب
            </button>
            <button
              onClick={() => setActiveTab('inspection')}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'inspection' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              دليل الاستلام
            </button>
            <button
              onClick={() => setActiveTab('calculators')}
              className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'calculators' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
              }`}
            >
              حاسبة الخامات
            </button>
          </nav>

          {/* Zone 3: Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={onOpenQuickWhatsApp}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              title="رسائل واتساب جاهزة للصنايعية"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">رسائل سريعة</span>
              <span className="sm:hidden text-[11px]">واتساب</span>
            </button>
            
            <button
              onClick={onAddCraftsman}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>صنايعي جديد</span>
            </button>
          </div>

        </div>

        {/* Mobile Nav Tabs Bar (Touch-optimized scroll) */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-neutral-800/80 scrollbar-none text-xs touch-pan-x">
          <button
            onClick={() => setActiveTab('craftsmen')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors shrink-0 ${
              activeTab === 'craftsmen' ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs' : 'text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/60'
            }`}
          >
            الصنايعية
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors shrink-0 ${
              activeTab === 'payments' ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs' : 'text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/60'
            }`}
          >
            الدفعات
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors shrink-0 ${
              activeTab === 'materials' ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs' : 'text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/60'
            }`}
          >
            الخامات
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors shrink-0 ${
              activeTab === 'timeline' ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs' : 'text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/60'
            }`}
          >
            المراحل
          </button>
          <button
            onClick={() => setActiveTab('inspection')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors shrink-0 ${
              activeTab === 'inspection' ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs' : 'text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/60'
            }`}
          >
            دليل الاستلام
          </button>
          <button
            onClick={() => setActiveTab('calculators')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors shrink-0 ${
              activeTab === 'calculators' ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs' : 'text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/60'
            }`}
          >
            حاسبة الكميات
          </button>
        </div>

      </div>

      {/* Sub-header: Apartment Identity & Responsive Financial Scoreboard */}
      <div className="bg-neutral-900/90 border-t border-neutral-800/80 py-2.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Apartment Title with inline rename */}
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Home className="w-4 h-4 text-amber-400 shrink-0" />
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-hidden focus:border-amber-400 max-w-[180px]"
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
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {apartmentName}
                  </span>
                  <button
                    onClick={() => {
                      setTempName(apartmentName);
                      setIsEditingName(true);
                    }}
                    className="text-[11px] text-neutral-400 hover:text-amber-400 underline cursor-pointer shrink-0"
                  >
                    تعديل
                  </button>
                </div>
              )}
            </div>

            {/* Reset / New Project button */}
            <button
              onClick={() => {
                if (confirm('هل أنت متأكد من مسح جميع البيانات والبدء بمشروع تشطيب فارغ وجديد؟')) {
                  onResetData();
                }
              }}
              className="p-1 text-neutral-500 hover:text-rose-400 rounded-md transition-colors cursor-pointer shrink-0 sm:hidden"
              title="تصفير البيانات"
              aria-label="تصفير البيانات"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Metrics Bar: 2-column or 4-column responsive grid on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-2 sm:gap-4 lg:gap-6 text-xs text-neutral-300">
            
            <div className="p-2 sm:p-0 bg-neutral-950/40 sm:bg-transparent rounded-lg border border-neutral-800/60 sm:border-0">
              <span className="text-neutral-400 block text-[10px] sm:text-[11px]">المتفق عليه</span>
              <span className="font-mono tabular-nums font-bold text-white text-xs sm:text-sm">
                {formatCurrency(totalAgreedLabor)}
              </span>
            </div>

            <div className="p-2 sm:p-0 bg-neutral-950/40 sm:bg-transparent rounded-lg border border-neutral-800/60 sm:border-0">
              <span className="text-neutral-400 block text-[10px] sm:text-[11px]">المدفوع للصنايعية</span>
              <span className="font-mono tabular-nums font-bold text-emerald-400 text-xs sm:text-sm">
                {formatCurrency(totalPaidLabor)}
              </span>
            </div>

            <div className="p-2 sm:p-0 bg-neutral-950/40 sm:bg-transparent rounded-lg border border-neutral-800/60 sm:border-0">
              <span className="text-neutral-400 block text-[10px] sm:text-[11px]">المتبقي للصنايعية</span>
              <span className="font-mono tabular-nums font-bold text-amber-400 text-xs sm:text-sm">
                {formatCurrency(totalRemainingLabor)}
              </span>
            </div>

            <div className="p-2 sm:p-0 bg-neutral-950/40 sm:bg-transparent rounded-lg border border-neutral-800/60 sm:border-0">
              <span className="text-neutral-400 block text-[10px] sm:text-[11px]">فواتير الخامات</span>
              <span className="font-mono tabular-nums font-bold text-sky-400 text-xs sm:text-sm">
                {formatCurrency(totalMaterialsCost)}
              </span>
            </div>

            <div className="hidden lg:block border-r border-neutral-700 pr-4">
              <span className="text-neutral-400 block text-[11px]">إجمالي المصروف الفعلي</span>
              <span className="font-mono tabular-nums font-bold text-white text-sm">
                {formatCurrency(grandPaidTotal)}
              </span>
            </div>

            {/* Desktop Reset button */}
            <button
              onClick={() => {
                if (confirm('هل أنت متأكد من مسح جميع البيانات والبدء بمشروع تشطيب فارغ وجديد؟')) {
                  onResetData();
                }
              }}
              className="hidden sm:block p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              title="تصفير وبدء مشروع جديد"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

    </header>
  );
};
