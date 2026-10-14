import React, { useState } from 'react';
import { Calculator, PaintBucket, Grid, Zap, Info } from 'lucide-react';

export const QuickCalculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'paint' | 'tiles' | 'electric'>('paint');

  // Paint state
  const [aptArea, setAptArea] = useState<number>(120); // Apartment floor area in m2
  const wallFactor = 2.8; // Average multiplier for walls area = floor * 2.8
  const estimatedWallArea = aptArea * wallFactor;
  const sealerBuckets = Math.ceil(estimatedWallArea / 120); // 1 bucket covers ~120m2
  const puttyBuckets = Math.ceil(estimatedWallArea / 25); // 1 putty bucket covers ~25m2 for 3 coats
  const paintBuckets = Math.ceil(estimatedWallArea / 65); // 1 finish paint bucket covers ~65m2 for 2 coats

  // Tiles state
  const [tileFloorArea, setTileFloorArea] = useState<number>(100);
  const [wastePercent, setWastePercent] = useState<number>(8);
  const totalTileMeters = Math.ceil(tileFloorArea * (1 + wastePercent / 100));
  const boxArea = 1.44; // standard box
  const totalTileBoxes = Math.ceil(totalTileMeters / boxArea);
  const adhesiveBags = Math.ceil(totalTileMeters / 5); // 1 bag of ceramic adhesive for ~5m2
  const cementBags = Math.ceil(totalTileMeters / 4); // 1 bag for ~4m2 if traditional mortar

  // Electric state
  const [roomCount, setRoomCount] = useState<number>(4);
  const [acCount, setAcCount] = useState<number>(3);
  const wire15Rolls = Math.max(2, Math.ceil(roomCount * 0.75)); // Lighting 1.5mm
  const wire25Rolls = Math.max(3, Math.ceil(roomCount * 1.2)); // Sockets 2.5mm
  const wire4Rolls = Math.max(2, Math.ceil(acCount * 0.8)); // AC 4mm

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              حاسبة تقدير الخامات والمشتريات
            </h3>
            <p className="text-xs text-neutral-400">
              احسب كمياتك التقريبية قبل النزول للموان وتجار الأدوات لتتفادى الشراء الزائد أو استغلال التجار
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        <button
          onClick={() => setActiveTab('paint')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'paint'
              ? 'bg-amber-400 text-neutral-950 shadow-xs'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
          }`}
        >
          <PaintBucket className="w-4 h-4" />
          <span>حاسبة النقاشة والدهانات</span>
        </button>

        <button
          onClick={() => setActiveTab('tiles')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'tiles'
              ? 'bg-amber-400 text-neutral-950 shadow-xs'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>حاسبة السيراميك والمونة</span>
        </button>

        <button
          onClick={() => setActiveTab('electric')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'electric'
              ? 'bg-amber-400 text-neutral-950 shadow-xs'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>حاسبة أسلاك الكهرباء</span>
        </button>
      </div>

      {/* Paint Calculator Tab */}
      {activeTab === 'paint' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <div className="max-w-md space-y-3">
            <label className="block text-xs font-medium text-neutral-300">
              مساحة أرضية الشقة بالمتر المربع (م2):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="30"
                max="500"
                value={aptArea}
                onChange={(e) => setAptArea(Number(e.target.value) || 0)}
                className="w-36 bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white font-mono tabular-nums text-left focus:outline-hidden focus:border-amber-500"
              />
              <span className="text-xs text-neutral-400">
                مساحة الحوائط التقريبية: <strong className="text-amber-400 font-mono">{estimatedWallArea.toFixed(0)} م2</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-950 p-4.5 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">سيلر مائي عازل للمحارة</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums block mb-1">
                {sealerBuckets} <span className="text-xs font-normal text-neutral-400">بستلة</span>
              </span>
              <span className="text-[11px] text-neutral-500">طبقة أساس حماية للمحارة</span>
            </div>

            <div className="bg-neutral-950 p-4.5 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">معجون حوائط (3 سكاكين)</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums block mb-1">
                {puttyBuckets} <span className="text-xs font-normal text-neutral-400">بستلة معجون</span>
              </span>
              <span className="text-[11px] text-neutral-500">جوتن فينوستيك أو سايبس</span>
            </div>

            <div className="bg-neutral-950 p-4.5 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">بستلات دهان تشطيب نهائي</span>
              <span className="text-2xl font-extrabold text-sky-400 font-mono tabular-nums block mb-1">
                {paintBuckets} <span className="text-xs font-normal text-neutral-400">بستلة وشين</span>
              </span>
              <span className="text-[11px] text-neutral-500">بستلة جوتن فينوماستيك</span>
            </div>
          </div>

          <div className="p-3.5 bg-neutral-950/80 rounded-xl border border-neutral-800 text-xs text-neutral-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              الحسابات مبنية على متوسط ارتفاع الأسقف 2.8 متر، وثلاث سكاكين معجون ناعمة، ووجهين دهان تشطيب قابل للغسيل.
            </p>
          </div>
        </div>
      )}

      {/* Tiles Calculator Tab */}
      {activeTab === 'tiles' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                مساحة الأرضية الصافية (م2):
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={tileFloorArea}
                onChange={(e) => setTileFloorArea(Number(e.target.value) || 0)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white font-mono tabular-nums text-left focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                نسبة الهالك والقص (%):
              </label>
              <select
                value={wastePercent}
                onChange={(e) => setWastePercent(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-hidden focus:border-amber-500"
              >
                <option value={5}>5% (تركيب عدل ومساحة منتظمة)</option>
                <option value={8}>8% (متوسط وموصى به)</option>
                <option value={12}>12% (تركيب سمبوسة مائل أو زوايا كثيرة)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-950 p-4.5 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">إجمالي المطلوب شراؤه</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums block mb-1">
                {totalTileMeters} <span className="text-xs font-normal text-neutral-400">متر مربع</span>
              </span>
              <span className="text-[11px] text-neutral-500">متضمن نسبة الهالك والقص</span>
            </div>

            <div className="bg-neutral-950 p-4.5 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">عدد كراتين السيراميك</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums block mb-1">
                ~{totalTileBoxes} <span className="text-xs font-normal text-neutral-400">كرتونة</span>
              </span>
              <span className="text-[11px] text-neutral-500">على فرض الكرتونة 1.44 م2</span>
            </div>

            <div className="bg-neutral-950 p-4.5 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">شكاير مادة لصق البورسلين</span>
              <span className="text-2xl font-extrabold text-sky-400 font-mono tabular-nums block mb-1">
                {adhesiveBags} <span className="text-xs font-normal text-neutral-400">شيكارة</span>
              </span>
              <span className="text-[11px] text-neutral-500">سيكا سيرام أو كيمابوكس</span>
            </div>
          </div>

          <div className="p-3.5 bg-neutral-950/80 rounded-xl border border-neutral-800 text-xs text-neutral-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              إذا كنت تركب سيراميك بالمونة التقليدية فستحتاج حوالي {cementBags} شيكارة أسمنت ورمل دفان ناعم.
            </p>
          </div>
        </div>
      )}

      {/* Electric Calculator Tab */}
      {activeTab === 'electric' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                إجمالي عدد الغرف والريسبشن والممرات:
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={roomCount}
                onChange={(e) => setRoomCount(Number(e.target.value) || 1)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white font-mono tabular-nums text-left focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                عدد التكييفات والسخانات الفورية:
              </label>
              <input
                type="number"
                min="0"
                max="8"
                value={acCount}
                onChange={(e) => setAcCount(Number(e.target.value) || 0)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white font-mono tabular-nums text-left focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-950 p-4.5 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">سلك 1.5 مم (إنارة وإسبوتات)</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums block mb-1">
                {wire15Rolls} <span className="text-xs font-normal text-neutral-400">لفات (100م)</span>
              </span>
              <span className="text-[11px] text-neutral-500">سويدي أصلي معتمد</span>
            </div>

            <div className="bg-neutral-950 p-4.5 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">سلك 2.5 مم أو 3 مم (أفياش)</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums block mb-1">
                {wire25Rolls} <span className="text-xs font-normal text-neutral-400">لفات (100م)</span>
              </span>
              <span className="text-[11px] text-neutral-500">لبرايز الغرف والمطبخ</span>
            </div>

            <div className="bg-neutral-950 p-4.5 rounded-xl border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 block mb-1">سلك 4 مم أو 6 مم (مكيفات)</span>
              <span className="text-2xl font-extrabold text-sky-400 font-mono tabular-nums block mb-1">
                {wire4Rolls} <span className="text-xs font-normal text-neutral-400">لفات (100م)</span>
              </span>
              <span className="text-[11px] text-neutral-500">خطوط معزولة مباشرة للوحة</span>
            </div>
          </div>

          <div className="p-3.5 bg-neutral-950/80 rounded-xl border border-neutral-800 text-xs text-neutral-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              احرص دائماً على فحص الباركود وختم السويدي على اللفات لتجنب الأسلاك المغشوشة المنتشرة في السوق.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
