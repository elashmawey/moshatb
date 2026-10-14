import React, { useState } from 'react';
import { Craftsman, Payment } from '../types';
import { messageTemplates } from '../data/initialData';
import { MessageSquare, Copy, X, Check, Send, AlertCircle } from 'lucide-react';

interface WhatsAppTemplatesModalProps {
  craftsmen: Craftsman[];
  selectedCraftsmanId?: string;
  payments: Payment[];
  onClose: () => void;
}

export const WhatsAppTemplatesModal: React.FC<WhatsAppTemplatesModalProps> = ({
  craftsmen,
  selectedCraftsmanId,
  payments,
  onClose,
}) => {
  const [craftsmanId, setCraftsmanId] = useState<string>(
    selectedCraftsmanId || (craftsmen.length > 0 ? craftsmen[0].id : '')
  );
  const [templateId, setTemplateId] = useState<string>('t-reminder');
  const [customParam, setCustomParam] = useState<string>('9 صباحاً');
  const [customNote, setCustomNote] = useState<string>('ميول ماسورة الصرف تحتاج ضبط بميزان مياه');
  const [copied, setCopied] = useState<boolean>(false);

  const activeCraftsman = craftsmen.find((c) => c.id === craftsmanId);

  // Calculate payments for this craftsman
  const craftsmanPayments = payments.filter((p) => p.craftsmanId === craftsmanId);
  const totalPaid = craftsmanPayments.reduce((sum, p) => sum + p.amount, 0);
  const agreed = activeCraftsman?.agreedAmount || 0;
  const remaining = Math.max(0, agreed - totalPaid);
  const lastPayment = craftsmanPayments[craftsmanPayments.length - 1];

  const getGeneratedMessage = (): string => {
    if (!activeCraftsman) return '';
    const name = activeCraftsman.name;
    const trade = activeCraftsman.trade;

    switch (templateId) {
      case 't-reminder': {
        const time = customParam || '9 صباحاً';
        return `السلام عليكم يا أسطى ${name}، بتواصل معاك للتأكيد على ميعادنا بكرة إن شاء الله في الشقة الساعة ${time} عشان نكمل الشغل المطلوب. يا ريت تكون جاهز بالعدة والرجالة في الميعاد عشان البرنامج الزمني ماشي بالترتيب.. ربنا يباركلك ويوفقك.`;
      }
      case 't-receipt': {
        const paidAmount = lastPayment ? lastPayment.amount : 5000;
        const milestone = lastPayment ? lastPayment.milestone : 'عربون بدء العمل';
        return `تم بحمد الله سداد دفعة مالية بقيمة ${paidAmount.toLocaleString('ar-EG')} ج.م للأسطى ${name} عن بند: (${milestone}).\nالمتبقي من إجمالي المصنعية المتفق عليها: ${remaining.toLocaleString('ar-EG')} ج.م يسدد عند الاستلام والمعاينة النهائية.\nتحياتي.`;
      }
      case 't-supplies': {
        return `مساء الخير يا أسطى ${name}، محتاج من حضرتك تبعتلي لستة الخامات المطلوبة لبند ${trade} كاملة ومكتوبة بالتفصيل (الماركات المعتمدة، الكميات، والأطوال) عشان نطلبها من الموزع دفعة واحدة وما نوقفش الشغل.. شكراً لك.`;
      }
      case 't-warning': {
        return `السلام عليكم يا أسطى ${name}، أثناء مراجعة شغل الشقة اليوم لاحظت: (${customNote}). برجاء عدم استكمال البند التالي حتى يتم تعديل هذه النقطة واستلامها على ميزان الشرب.. حريصين إن شغلك يطلع بأعلى جودة تفتخر بيها. شكراً لتفهمك.`;
      }
      default:
        return '';
    }
  };

  const messageText = getGeneratedMessage();

  const handleCopy = async () => {
    if (!messageText) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(messageText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = messageText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('يرجى نسخ النص يدوياً');
    }
  };

  const handleOpenWhatsApp = () => {
    if (!activeCraftsman) return;
    let phone = activeCraftsman.phone.replace(/[^0-9]/g, '');
    if (!phone) {
      alert('رقم هاتف الصنايعي غير مسجل');
      return;
    }
    if (phone.startsWith('0')) {
      phone = '2' + phone; // Default Egypt prefix if local 01xxxxxxxxx
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">رسائل واتساب السريعة للصنايعية</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {craftsmen.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-sm font-semibold text-neutral-200">لم يتم تسجيل أي صنايعية بعد</p>
            <p className="text-xs text-neutral-400">
              يرجى إضافة صنايعي أولاً وتدوين رقم هاتفه لاستخدام قوالب رسائل الواتساب الجاهزة.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Select Craftsman */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                اختر الصنايعي المستهدف:
              </label>
              <select
                value={craftsmanId}
                onChange={(e) => setCraftsmanId(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-500"
              >
                {craftsmen.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.trade} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Template Type */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">
                نوع الرسالة:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {messageTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateId(tpl.id)}
                    className={`p-3 text-right rounded-xl border transition-all cursor-pointer ${
                      templateId === tpl.id
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200 font-semibold'
                        : 'border-neutral-800 bg-neutral-800/50 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <p className="font-medium text-white mb-0.5">{tpl.title}</p>
                    <p className="text-[11px] text-neutral-400 line-clamp-1">{tpl.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Param Inputs depending on template */}
            {templateId === 't-reminder' && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  ساعة التواجد غداً:
                </label>
                <input
                  type="text"
                  value={customParam}
                  onChange={(e) => setCustomParam(e.target.value)}
                  placeholder="مثال: 9 صباحاً"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            )}

            {templateId === 't-warning' && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  الملاحظة المطلوب تعديلها:
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="مثال: منسوب علبة المفتاح مائل سنتيمتر عن الباقي"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            )}

            {/* Preview Text Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  معاينة الرسالة الجاهزة:
                </label>
                <span className="text-[11px] text-neutral-500">جاهزة للإرسال المباشر</span>
              </div>
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {messageText}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            disabled={!messageText}
            className="px-4 py-2.5 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 border border-neutral-700 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ الرسالة'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleOpenWhatsApp}
              disabled={!activeCraftsman}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال واتساب الآن</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
