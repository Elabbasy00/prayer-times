// src/navigation/RootNavigation.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function resetNavigation(routes: { name: string; params?: any }[]) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: routes.length - 1,
      routes,
    });
  }
}
