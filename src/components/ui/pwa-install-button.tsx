"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "./button";

export default function InstallPrompt() {
  const { isInstallable, promptInstall } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg p-3 rounded-xl border z-50">
      <p className="mb-2">Install this app on your device for a better experience!</p>
      <Button
        onClick={promptInstall}
        className=""
      >
        Install
      </Button>
    </div>
  );
}
