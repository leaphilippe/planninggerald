export async function syncWebNotificationBadge(count: number = 0): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const nav = navigator as Navigator & {
      setAppBadge?: (value?: number) => Promise<void>;
      clearAppBadge?: () => Promise<void>;
    };

    if (count > 0 && typeof nav.setAppBadge === 'function') {
      await nav.setAppBadge(count);
      return;
    }

    if (count <= 0 && typeof nav.clearAppBadge === 'function') {
      await nav.clearAppBadge();
    }
  } catch {
    // ignore si non supporté
  }
}
