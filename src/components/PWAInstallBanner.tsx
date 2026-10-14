import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, Smartphone, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone (installed)
    const inStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(inStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Check dismissed in session
    const dismissed = sessionStorage.getItem('pwa_banner_dismissed');

    // Handle Android/Chrome beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!inStandalone && !dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Online/Offline tracking
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // On iOS Safari outside standalone, show banner after small delay if not dismissed
    if (isAppleDevice && !inStandalone && !dismissed) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  return (
    <>
      {/* Offline Status Toast */}
      {!isOnline && (
        <div className="bg-amber-500/90 text-neutral-950 text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-xs">
          <WifiOff className="w-3.5 h-3.5" />
          <span>أنت تعمل حالياً بدون إنترنت (أوفلاين) - جميع تعديلاتك محفوظة على الهاتف تلقائياً</span>
        </div>
      )}

      {/* Floating Install Prompt Banner for Mobile */}
      {showBanner && !isStandalone && (
        <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-4 sm:max-w-md z-40 bg-neutral-900/95 border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0 font-black text-lg shadow-sm">
              م
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                تثبيت تطبيق "مشطّب" على هاتفك
              </h4>
              <p className="text-[11px] text-neutral-400 leading-tight mb-2.5">
                استخدم التطبيق كأنه تطبيق جوال رسمي بدون إنترنت داخل الشقة وبدون متصفح.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تثبيت الآن</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 text-neutral-400 hover:text-white text-xs transition-colors cursor-pointer"
                >
                  لاحقاً
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-neutral-500 hover:text-neutral-300 p-1 cursor-pointer"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Home Screen Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl p-5 shadow-2xl text-neutral-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">تثبيت التطبيق على آيفون</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                <p>اضغط على أيقونة <strong>المشاركة (Share)</strong> في شريط متصفح Safari بالأسفل <Share className="w-3.5 h-3.5 inline mx-1 text-sky-400" /></p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                <p>مرر للأسفل واختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center text-[11px] font-bold shrink-0">3</span>
                <p>اضغط <strong>إضافة (Add)</strong> بالأعلى ليظهر التطبيق في شاشتك الرئيسية ويعمل أوفلاين.</p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              فهمت، شكراً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
