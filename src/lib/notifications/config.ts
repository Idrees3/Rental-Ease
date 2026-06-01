export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function isOneSignalConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID &&
      process.env.ONESIGNAL_REST_API_KEY
  );
}

export function isNotificationsConfigured(): boolean {
  return isResendConfigured() || isOneSignalConfigured();
}
