/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/usePWAInstall.ts
import { useEffect, useState } from "react";

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // prevent automatic prompt
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    (deferredPrompt).prompt();
    const { outcome } = await (deferredPrompt).userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the PWA install");
    } else {
      console.log("User dismissed the PWA install");
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, promptInstall };
}
