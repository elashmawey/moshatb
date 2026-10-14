import React, { useState } from 'react';
import { Payment, Craftsman } from '../types';
import { formatCurrency } from '../utils/storage';
import { Printer, X, CheckCircle2, ShieldCheck, Share2, Check, MessageSquare } from 'lucide-react';

interface ReceiptModalProps {
  payment: Payment | null;
  craftsman: Craftsman | undefined;
  apartmentName: string;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  craftsman,
  apartmentName,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!payment || !craftsman) return null;

  const handlePrint = () => {
    window.print();
  };

  const shareText = `إيصال سداد دفعة تشطيب:\nالرقم: ${payment.receiptNumber}\nالمستلم: الأسطى ${craftsman.name} (${craftsman.trade})\nالمبلغ: ${payment.amount.toLocaleString('ar-EG')} ج.م\nالبند: ${payment.milestone}\nالتاريخ: ${payment.date}\nطريقة الدفع: ${payment.method}\nالموقع: ${apartmentName}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('يرجى نسخ النص يدوياً');
    }
  };

  const handleSendWhatsApp = () => {
    let phone = craftsman.phone.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '2' + phone;
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Control Bar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">إيصال سداد مالي معتمد</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="px-2.5 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              title="إرسال مباشر للأسطى عبر واتساب"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              title="نسخ نص الإيصال"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              title="طباعة"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 md:p-8 bg-neutral-900 border-neutral-800" id="printable-receipt">
          {/* Header */}
          <div className="border-b border-dashed border-neutral-700 pb-5 mb-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-1">
              سند صرف دفعة مصنعية
            </h2>
            <p className="text-xs text-neutral-400">
              مشروع تشطيب: <span className="font-semibold text-neutral-200">{apartmentName}</span>
            </p>
            <div className="mt-2 text-xs font-mono text-neutral-400">
              رقم الإيصال: <span className="text-amber-400 font-bold">{payment.receiptNumber}</span>
            </div>
          </div>

          {/* Amount Badge */}
          <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-4 text-center mb-6">
            <span className="text-xs text-neutral-400 block mb-1">المبلغ المسدد</span>
            <div className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
              {formatCurrency(payment.amount)}
            </div>
            <span className="text-xs text-neutral-400 mt-1 block">
              طريقة السداد: <strong className="text-neutral-200">{payment.method}</strong>
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-sm border-b border-dashed border-neutral-700 pb-6 mb-6">
            <div className="flex justify-between items-center py-1">
              <span className="text-neutral-400">اسم الصنايعي:</span>
              <span className="font-semibold text-white">{craftsman.name}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-neutral-400">بند الصنعة:</span>
              <span className="font-medium text-amber-300">{craftsman.trade}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-neutral-400">رقم الهاتف:</span>
              <span className="font-mono text-neutral-200 dir-ltr">{craftsman.phone}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-neutral-400">تاريخ الصرف:</span>
              <span className="font-mono text-neutral-200">{payment.date}</span>
            </div>
            <div className="flex flex-col gap-1 py-1">
              <span className="text-neutral-400">بيان الدفعة ومرحلتها:</span>
              <p className="text-neutral-200 bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800 text-xs leading-relaxed">
                {payment.milestone}
              </p>
            </div>
            {payment.notes && (
              <div className="flex flex-col gap-1 py-1">
                <span className="text-neutral-400">ملاحظات إضافية:</span>
                <p className="text-neutral-300 text-xs">{payment.notes}</p>
              </div>
            )}
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-center text-xs text-neutral-400">
            <div>
              <p className="mb-6">توقيع المستلم (الصنايعي)</p>
              <div className="border-b border-neutral-700 w-3/4 mx-auto pb-1 text-neutral-300 font-semibold">
                {craftsman.name}
              </div>
            </div>
            <div>
              <p className="mb-6">توقيع المالك</p>
              <div className="border-b border-neutral-700 w-3/4 mx-auto pb-1 text-neutral-300 font-semibold">
                صاحب الشقة
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="no-print px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
