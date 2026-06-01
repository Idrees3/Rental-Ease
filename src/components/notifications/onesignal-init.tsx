"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: OneSignalClient) => void | Promise<void>>;
  }
}

type OneSignalClient = {
  init: (opts: { appId: string }) => Promise<void>;
  login: (externalId: string) => Promise<void>;
  Notifications: {
    requestPermission: () => Promise<void>;
    permission: boolean;
  };
};

type OneSignalInitProps = {
  userId: string;
  appId: string;
};

export function OneSignalInit({ userId, appId }: OneSignalInitProps) {
  useEffect(() => {
    if (!appId || !userId) return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      await OneSignal.init({ appId });
      await OneSignal.login(userId);
    });
  }, [appId, userId]);

  if (!appId) return null;

  return (
    <Script
      src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
      strategy="lazyOnload"
    />
  );
}
