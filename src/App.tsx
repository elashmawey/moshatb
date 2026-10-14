import React, { useState, useEffect } from 'react';
import {
  Craftsman,
  Payment,
  MaterialExpense,
  FinishingStage,
} from './types';
import {
  loadInitialData,
  saveData,
  resetToDefaultData,
  formatCurrency,
} from './utils/storage';
import { Header, ActiveTabType } from './components/Header';
import { CraftsmenList } from './components/CraftsmenList';
import { PaymentsLedger } from './components/PaymentsLedger';
import { MaterialsTracker } from './components/MaterialsTracker';
import { FinishingTimeline } from './components/FinishingTimeline';
import { InspectionGuide } from './components/InspectionGuide';
import { QuickCalculators } from './components/QuickCalculators';
import { CraftsmanModal } from './components/CraftsmanModal';
import { PaymentModal } from './components/PaymentModal';
import { MaterialModal } from './components/MaterialModal';
import { ReceiptModal } from './components/ReceiptModal';
import { WhatsAppTemplatesModal } from './components/WhatsAppTemplatesModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';

import heroRenovationImage from './assets/images/renovation_apartment_hero_1791983131680.jpg';
import {
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState(() => loadInitialData());
  const [activeTab, setActiveTab] = useState<ActiveTabType>('craftsmen');

  // Modals state
  const [craftsmanModalOpen, setCraftsmanModalOpen] = useState(false);
  const [editingCraftsman, setEditingCraftsman] = useState<Craftsman | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentCraftsmanId, setPaymentCraftsmanId] = useState<string | undefined>(undefined);

  const [materialModalOpen, setMaterialModalOpen] = useState(false);

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [whatsAppCraftsmanId, setWhatsAppCraftsmanId] = useState<string | undefined>(undefined);

  // Sync to local storage on changes
  useEffect(() => {
    saveData.craftsmen(data.craftsmen);
  }, [data.craftsmen]);

  useEffect(() => {
    saveData.payments(data.payments);
  }, [data.payments]);

  useEffect(() => {
    saveData.materials(data.materials);
  }, [data.materials]);

  useEffect(() => {
    saveData.stages(data.stages);
  }, [data.stages]);

  useEffect(() => {
    saveData.apartmentName(data.apartmentName);
  }, [data.apartmentName]);

  // Overall financial metrics
  const totalAgreedLabor = data.craftsmen.reduce((sum, c) => sum + (c.agreedAmount || 0), 0);
  const totalPaidLabor = data.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalRemainingLabor = Math.max(0, totalAgreedLabor - totalPaidLabor);
  const totalMaterialsCost = data.materials.reduce((sum, m) => sum + (m.totalAmount || 0), 0);

  // Stage progress
  const allTasks = data.stages.flatMap((s) => s.checklist);
  const completedTasks = allTasks.filter((t) => t.done).length;
  const progressPercent = allTasks.length > 0
    ? Math.round((completedTasks / allTasks.length) * 100)
    : 0;

  // Handlers
  const handleSaveCraftsman = (craftsman: Craftsman) => {
    setData((prev) => {
      const exists = prev.craftsmen.some((c) => c.id === craftsman.id);
      const newCraftsmen = exists
        ? prev.craftsmen.map((c) => (c.id === craftsman.id ? craftsman : c))
        : [craftsman, ...prev.craftsmen];
      return { ...prev, craftsmen: newCraftsmen };
    });
    setCraftsmanModalOpen(false);
    setEditingCraftsman(null);
  };

  const handleDeleteCraftsman = (id: string) => {
    setData((prev) => ({
      ...prev,
      craftsmen: prev.craftsmen.filter((c) => c.id !== id),
      payments: prev.payments.filter((p) => p.craftsmanId !== id),
    }));
  };

  const handleSavePayment = (payment: Payment) => {
    setData((prev) => ({
      ...prev,
      payments: [payment, ...prev.payments],
    }));
    setPaymentModalOpen(false);
    setPaymentCraftsmanId(undefined);
    // Show newly generated receipt
    setReceiptPayment(payment);
    setReceiptModalOpen(true);
  };

  const handleDeletePayment = (id: string) => {
    setData((prev) => ({
      ...prev,
      payments: prev.payments.filter((p) => p.id !== id),
    }));
  };

  const handleSaveMaterial = (material: MaterialExpense) => {
    setData((prev) => ({
      ...prev,
      materials: [material, ...prev.materials],
    }));
    setMaterialModalOpen(false);
  };

  const handleToggleDelivered = (id: string) => {
    setData((prev) => ({
      ...prev,
      materials: prev.materials.map((m) =>
        m.id === id ? { ...m, isDelivered: !m.isDelivered } : m
      ),
    }));
  };

  const handleDeleteMaterial = (id: string) => {
    setData((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== id),
    }));
  };

  const handleToggleChecklistItem = (stageId: string, itemId: string) => {
    setData((prev) => ({
      ...prev,
      stages: prev.stages.map((s) => {
        if (s.id !== stageId) return s;
        return {
          ...s,
          checklist: s.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
          ),
        };
      }),
    }));
  };

  const handleUpdateStageStatus = (
    stageId: string,
    status: 'لم تبدأ' | 'قيد التنفيذ' | 'تم الاستلام'
  ) => {
    setData((prev) => ({
      ...prev,
      stages: prev.stages.map((s) => (s.id === stageId ? { ...s, status } : s)),
    }));
  };

  const handleResetData = () => {
    const refreshed = resetToDefaultData();
    setData(refreshed);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased selection:bg-amber-400/20 selection:text-amber-200">
      
      {/* PWA Offline / Install Banner */}
      <PWAInstallBanner />

      {/* Top Navbar & Scoreboard */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apartmentName={data.apartmentName}
        setApartmentName={(name) => setData((prev) => ({ ...prev, apartmentName: name }))}
        totalAgreedLabor={totalAgreedLabor}
        totalPaidLabor={totalPaidLabor}
        totalRemainingLabor={totalRemainingLabor}
        totalMaterialsCost={totalMaterialsCost}
        progressPercent={progressPercent}
        onAddCraftsman={() => {
          setEditingCraftsman(null);
          setCraftsmanModalOpen(true);
        }}
        onOpenQuickWhatsApp={() => {
          setWhatsAppCraftsmanId(data.craftsmen[0]?.id);
          setWhatsAppModalOpen(true);
        }}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Editorial Hero Strip (Visible in overview/craftsmen tab) */}
        {activeTab === 'craftsmen' && (
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              
              {/* Text side */}
              <div className="lg:col-span-7 p-4 sm:p-8 flex flex-col justify-center space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>دليلك اليومي لتشطيب شقتك بأعلى جودة وبأقل تكلفة</span>
                </div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug sm:leading-tight text-balance">
                  إدارة شاملة لجميع الصنايعية والدفعات والاستلام الهندسي
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl">
                  تابع الأسطى السباك، الكهربائي، النقاش، وبتاع السيراميك والجبس بورد. وثّق كل دفعة وعربون، واطلع على شروط المعاينة والاستلام الهندسي لتضمن أن كل مليم تدفعه في مكانه الصحيح.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 pt-2">
                  <button
                    onClick={() => {
                      setEditingCraftsman(null);
                      setCraftsmanModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer shadow-xs text-center justify-center flex items-center"
                  >
                    + تسجيل صنايعي جديد
                  </button>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer text-center justify-center flex items-center"
                  >
                    مراجعة مراحل التشطيب الـ 10
                  </button>
                </div>
              </div>

              {/* Photo side */}
              <div className="lg:col-span-5 relative min-h-[160px] sm:min-h-[220px] lg:min-h-full">
                <img
                  src={heroRenovationImage}
                  alt="تشطيب شقة حديثة بأعلى معايير الجودة"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />
              </div>

            </div>
          </div>
        )}

        {/* Dynamic Tab Content */}
        {activeTab === 'craftsmen' && (
          <CraftsmenList
            craftsmen={data.craftsmen}
            payments={data.payments}
            onAddCraftsman={() => {
              setEditingCraftsman(null);
              setCraftsmanModalOpen(true);
            }}
            onEditCraftsman={(c) => {
              setEditingCraftsman(c);
              setCraftsmanModalOpen(true);
            }}
            onDeleteCraftsman={handleDeleteCraftsman}
            onAddPayment={(cId) => {
              setPaymentCraftsmanId(cId);
              setPaymentModalOpen(true);
            }}
            onOpenWhatsApp={(cId) => {
              setWhatsAppCraftsmanId(cId);
              setWhatsAppModalOpen(true);
            }}
            onViewReceipt={(p) => {
              setReceiptPayment(p);
              setReceiptModalOpen(true);
            }}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsLedger
            payments={data.payments}
            craftsmen={data.craftsmen}
            onAddPayment={() => {
              setPaymentCraftsmanId(undefined);
              setPaymentModalOpen(true);
            }}
            onDeletePayment={handleDeletePayment}
            onViewReceipt={(p) => {
              setReceiptPayment(p);
              setReceiptModalOpen(true);
            }}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsTracker
            materials={data.materials}
            onAddMaterial={() => setMaterialModalOpen(true)}
            onToggleDelivered={handleToggleDelivered}
            onDeleteMaterial={handleDeleteMaterial}
          />
        )}

        {activeTab === 'timeline' && (
          <FinishingTimeline
            stages={data.stages}
            onToggleChecklistItem={handleToggleChecklistItem}
            onUpdateStageStatus={handleUpdateStageStatus}
          />
        )}

        {activeTab === 'inspection' && <InspectionGuide />}

        {activeTab === 'calculators' && <QuickCalculators />}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            مشطّب © {new Date().getFullYear()} — نظام إدارة وتشطيب الشقة ومتابعة الصنايعية
          </p>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>تخزين تلقائي محلي</span>
            <span aria-hidden="true">·</span>
            <span>جاهز للطباعة وتصدير الإيصالات</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {craftsmanModalOpen && (
        <CraftsmanModal
          craftsman={editingCraftsman}
          onSave={handleSaveCraftsman}
          onClose={() => {
            setCraftsmanModalOpen(false);
            setEditingCraftsman(null);
          }}
        />
      )}

      {paymentModalOpen && (
        <PaymentModal
          craftsmen={data.craftsmen}
          selectedCraftsmanId={paymentCraftsmanId}
          payments={data.payments}
          onSave={handleSavePayment}
          onClose={() => {
            setPaymentModalOpen(false);
            setPaymentCraftsmanId(undefined);
          }}
        />
      )}

      {materialModalOpen && (
        <MaterialModal
          onSave={handleSaveMaterial}
          onClose={() => setMaterialModalOpen(false)}
        />
      )}

      {receiptModalOpen && receiptPayment && (
        <ReceiptModal
          payment={receiptPayment}
          craftsman={data.craftsmen.find((c) => c.id === receiptPayment.craftsmanId)}
          apartmentName={data.apartmentName}
          onClose={() => {
            setReceiptModalOpen(false);
            setReceiptPayment(null);
          }}
        />
      )}

      {whatsAppModalOpen && (
        <WhatsAppTemplatesModal
          craftsmen={data.craftsmen}
          selectedCraftsmanId={whatsAppCraftsmanId}
          payments={data.payments}
          onClose={() => {
            setWhatsAppModalOpen(false);
            setWhatsAppCraftsmanId(undefined);
          }}
        />
      )}

    </div>
  );
}
