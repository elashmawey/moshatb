import React, { useState } from 'react';
import { Payment, Craftsman } from '../types';
import { formatCurrency } from '../utils/storage';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  FileText,
  Trash2,
  Download,
  Calendar,
  CreditCard,
  User,
  ArrowDownLeft
} from 'lucide-react';

interface PaymentsLedgerProps {
  payments: Payment[];
  craftsmen: Craftsman[];
  onAddPayment: () => void;
  onDeletePayment: (id: string) => void;
  onViewReceipt: (payment: Payment) => void;
}

export const PaymentsLedger: React.FC<PaymentsLedgerProps> = ({
  payments,
  craftsmen,
  onAddPayment,
  onDeletePayment,
  onViewReceipt,
}) => {
  const [selectedCraftsmanId, setSelectedCraftsmanId] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getCraftsman = (id: string) => craftsmen.find((c) => c.id === id);

  const filteredPayments = payments.filter((p) => {
    const matchesCraftsman = selectedCraftsmanId === 'all' || p.craftsmanId === selectedCraftsmanId;
    const matchesMethod = selectedMethod === 'all' || p.method === selectedMethod;
    const c = getCraftsman(p.craftsmanId);
    const matchesSearch =
      p.milestone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c && c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCraftsman && matchesMethod && matchesSearch;
  });

  const totalFilteredAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const handleExportCSV = () => {
    const headers = 'رقم الإيصال,اسم الصنايعي,المهنة,المبلغ,التاريخ,بند الدفعة,طريقة السداد\n';
    const rows = filteredPayments
      .map((p) => {
        const c = getCraftsman(p.craftsmanId);
        return `"${p.receiptNumber}","${c ? c.name : ''}","${c ? c.trade : ''}","${p.amount}","${p.date}","${p.milestone}","${p.method}"`;
      })
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `دفعات_تشطيب_الشقة_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block mb-1">إجمالي الدفعات المسجلة</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
              {formatCurrency(totalFilteredAmount)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block mb-1">عدد الإيصالات والمعاملات</span>
            <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {filteredPayments.length} <span className="text-xs text-neutral-400 font-normal">إيصال</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center border border-neutral-700">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block mb-1">الصنايعية المستفيدون</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">
              {new Set(filteredPayments.map((p) => p.craftsmanId)).size} <span className="text-xs text-neutral-400 font-normal">صنايعي</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-neutral-900/80 border border-neutral-800 p-3.5 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في البند أو الإيصال أو الاسم..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Craftsman Filter */}
          <select
            value={selectedCraftsmanId}
            onChange={(e) => setSelectedCraftsmanId(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
          >
            <option value="all">كل الصنايعية</option>
            {craftsmen.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.trade})
              </option>
            ))}
          </select>

          {/* Method Filter */}
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
          >
            <option value="all">كل طرق الدفع</option>
            <option value="كاش">كاش</option>
            <option value="إنستاباي">إنستاباي</option>
            <option value="فودافون كاش">فودافون كاش</option>
            <option value="تحويل بنكي">تحويل بنكي</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="تصدير كشف إكسيل"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير CSV</span>
          </button>
          <button
            onClick={onAddPayment}
            className="px-4 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل دفعة</span>
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-neutral-950/70 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4 font-semibold">رقم الإيصال</th>
                <th className="py-3 px-4 font-semibold">الصنايعي / المهنة</th>
                <th className="py-3 px-4 font-semibold text-left">المبلغ</th>
                <th className="py-3 px-4 font-semibold">بند الدفعة</th>
                <th className="py-3 px-4 font-semibold">تاريخ الصرف</th>
                <th className="py-3 px-4 font-semibold">طريقة السداد</th>
                <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-500">
                    لا توجد دفعات مطابقة للمعايير المحددة.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const craftsman = getCraftsman(payment.craftsmanId);
                  return (
                    <tr
                      key={payment.id}
                      className="hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-amber-400">
                        {payment.receiptNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">
                          {craftsman ? craftsman.name : 'غير محدد'}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {craftsman ? craftsman.trade : ''}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums font-bold text-emerald-400 text-left text-sm">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-3 px-4 text-neutral-200 max-w-xs truncate">
                        {payment.milestone}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-400 whitespace-nowrap">
                        {payment.date}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-neutral-300 font-medium bg-neutral-800/80 px-2 py-0.5 rounded-md text-[11px]">
                          {payment.method}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onViewReceipt(payment)}
                            className="p-1.5 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                            title="عرض سند الصرف"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف إيصال الدفعة ${payment.receiptNumber}؟`)) {
                                onDeletePayment(payment.id);
                              }
                            }}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                            title="حذف الدفعة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
