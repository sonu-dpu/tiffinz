"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function InstallPrompt() {
  const { isInstallable, promptInstall } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg p-3 rounded-xl border">
      <p className="mb-2">Install this app on your device for a better experience!</p>
      <button
        onClick={promptInstall}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Install
      </button>
    </div>
  );
}
