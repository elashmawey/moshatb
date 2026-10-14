import React, { useState } from 'react';
import { inspectionGuides } from '../data/initialData';
import {
  ShieldCheck,
  AlertOctagon,
  Wrench,
  CheckCircle,
  HelpCircle,
  Layers,
  Sparkles
} from 'lucide-react';

export const InspectionGuide: React.FC = () => {
  const [activeTrade, setActiveTrade] = useState<string>(inspectionGuides[0].trade);

  const currentGuide = inspectionGuides.find((g) => g.trade === activeTrade) || inspectionGuides[0];

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              دليل استلام الشغل من الصنايعي (كيف تستلم كمهندس محترف)
            </h3>
            <p className="text-xs text-neutral-400">
              خطوات فحص عملية، العدة المطلوبة للمعاينة، وأهم الأخطاء الكارثية لتفادي دفع المصنعية في شغل معيب
            </p>
          </div>
        </div>
      </div>

      {/* Specialty Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {inspectionGuides.map((guide) => (
          <button
            key={guide.trade}
            onClick={() => setActiveTrade(guide.trade)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              activeTrade === guide.trade
                ? 'bg-amber-400 text-neutral-950 shadow-xs'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            {guide.trade}
          </button>
        ))}
      </div>

      {/* Guide Content Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
        
        {/* Header of Active Guide */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-800">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">
              {currentGuide.title}
            </h4>
            <span className="text-xs text-amber-400 font-medium">
              أولوية الفحص: {currentGuide.badge}
            </span>
          </div>
        </div>

        {/* Tools Needed */}
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
            <Wrench className="w-4 h-4 text-sky-400" />
            <span>الأدوات والعدة اللازمة أثناء المعاينة:</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {currentGuide.toolsNeeded.map((tool, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-300 font-medium"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* How to Inspect Step-by-Step */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>خطوات الفحص والاستلام خطوة بخطوة:</span>
          </div>
          <div className="space-y-2">
            {currentGuide.howToInspect.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-neutral-950/60 rounded-xl border border-neutral-800/80 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Mistakes to Avoid */}
        <div className="p-4.5 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
            <AlertOctagon className="w-4 h-4" />
            <span>أخطاء كارثية وحيل مشهورة تجنب الوقوع فيها:</span>
          </div>
          <ul className="space-y-2 pr-4 list-disc text-xs text-rose-200/90 leading-relaxed">
            {currentGuide.criticalMistakesToAvoid.map((mistake, idx) => (
              <li key={idx}>{mistake}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
