import { Platform } from 'react-native';

export async function configureNotificationsAsync(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    const Notifications = await import('expo-notifications');

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch {
    // ignore
  }
}

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
    // ignore
  }
}
