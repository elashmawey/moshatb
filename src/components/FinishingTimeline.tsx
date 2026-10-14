import React, { useState } from 'react';
import { FinishingStage } from '../types';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ListChecks,
  Check
} from 'lucide-react';

interface FinishingTimelineProps {
  stages: FinishingStage[];
  onToggleChecklistItem: (stageId: string, itemId: string) => void;
  onUpdateStageStatus: (stageId: string, status: 'لم تبدأ' | 'قيد التنفيذ' | 'تم الاستلام') => void;
}

export const FinishingTimeline: React.FC<FinishingTimelineProps> = ({
  stages,
  onToggleChecklistItem,
  onUpdateStageStatus,
}) => {
  const [expandedStageId, setExpandedStageId] = useState<string>(stages[1]?.id || stages[0]?.id);

  // Calculate overall progress across all tasks
  const allTasks = stages.flatMap((s) => s.checklist);
  const completedTasks = allTasks.filter((t) => t.done).length;
  const progressPercent = allTasks.length > 0
    ? Math.round((completedTasks / allTasks.length) * 100)
    : 0;

  const getStageStatusBadge = (status: 'لم تبدأ' | 'قيد التنفيذ' | 'تم الاستلام') => {
    switch (status) {
      case 'تم الاستلام':
        return (
          <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تم الاستلام بنجاح
          </span>
        );
      case 'قيد التنفيذ':
        return (
          <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            جارية حالياً
          </span>
        );
      default:
        return (
          <span className="text-neutral-400 bg-neutral-800 px-2.5 py-1 rounded-lg text-xs font-medium">
            لم تبدأ بعد
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overall Progress Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              التسلسل الزمني الهندسي لمراحل التشطيب
            </h3>
            <p className="text-xs text-neutral-400">
              ترتيب هندسي دقيق لمنع تداخل الصنايعية والحفاظ على جودة الشغل دون إهدار أموالك
            </p>
          </div>
          <div className="text-left shrink-0">
            <span className="text-xs text-neutral-400 block">إنجاز الفحوصات والمهام</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">
              {progressPercent}% <span className="text-xs text-neutral-400 font-normal">({completedTasks} من {allTasks.length})</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-950 h-3 rounded-full overflow-hidden p-0.5 border border-neutral-800">
          <div
            className="bg-amber-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stages List */}
      <div className="space-y-4">
        {stages.map((stage) => {
          const isExpanded = expandedStageId === stage.id;
          const stageTasks = stage.checklist;
          const stageDone = stageTasks.filter((t) => t.done).length;

          return (
            <div
              key={stage.id}
              className={`bg-neutral-900 border rounded-2xl transition-all overflow-hidden ${
                stage.status === 'تم الاستلام'
                  ? 'border-emerald-500/30'
                  : stage.status === 'قيد التنفيذ'
                  ? 'border-amber-500/50 shadow-md'
                  : 'border-neutral-800'
              }`}
            >
              {/* Stage Header / Accordion Trigger */}
              <div
                onClick={() => setExpandedStageId(isExpanded ? '' : stage.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-800/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 font-mono tabular-nums ${
                      stage.status === 'تم الاستلام'
                        ? 'bg-emerald-500 text-neutral-950'
                        : stage.status === 'قيد التنفيذ'
                        ? 'bg-amber-400 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {stage.order}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {stage.title}
                      </h4>
                      <span className="text-xs text-amber-400 font-medium">
                        ({stage.trade})
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-1">
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Status & Count */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-xs text-neutral-400 font-mono">
                    {stageDone}/{stageTasks.length} منجز
                  </span>
                  {getStageStatusBadge(stage.status)}
                  <div className="p-1 text-neutral-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Stage Body */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-neutral-800/80 space-y-5 bg-neutral-950/40">
                  
                  {/* Status Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                    <span className="text-xs text-neutral-300 font-medium">
                      تحديث حالة هذه المرحلة:
                    </span>
                    <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 w-full sm:w-auto">
                      {(['لم تبدأ', 'قيد التنفيذ', 'تم الاستلام'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => onUpdateStageStatus(stage.id, st)}
                          className={`px-2.5 sm:px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer text-center justify-center flex items-center ${
                            stage.status === st
                              ? st === 'تم الاستلام'
                                ? 'bg-emerald-500 text-neutral-950 font-bold'
                                : st === 'قيد التنفيذ'
                                ? 'bg-amber-400 text-neutral-950 font-bold'
                                : 'bg-neutral-700 text-white font-bold'
                              : 'bg-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300 mb-1">
                      <ListChecks className="w-4 h-4 text-amber-400" />
                      <span>قائمة مهام الفحص والاستلام الإلزامية:</span>
                    </div>

                    <div className="space-y-1.5">
                      {stage.checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onToggleChecklistItem(stage.id, item.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            item.done
                              ? 'bg-emerald-950/20 border-emerald-800/40 text-neutral-200'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              item.done
                                ? 'bg-emerald-500 text-neutral-950'
                                : 'border border-neutral-600 bg-neutral-800'
                            }`}
                          >
                            {item.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className={`text-xs leading-relaxed ${item.done ? 'line-through text-neutral-400' : 'text-neutral-200'}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tips */}
                  {stage.proTips && stage.proTips.length > 0 && (
                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                        <Lightbulb className="w-4 h-4" />
                        <span>نصائح ذهبية هندسية لهذه المرحلة:</span>
                      </div>
                      <ul className="space-y-1 text-xs text-neutral-300 pr-4 list-disc">
                        {stage.proTips.map((tip, idx) => (
                          <li key={idx} className="leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warning Note */}
                  {stage.warningNote && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-rose-200 leading-relaxed font-medium">
                        {stage.warningNote}
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
