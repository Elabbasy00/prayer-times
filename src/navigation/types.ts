// src/navigation/types.ts
export type RootStackParamList = {
  // Auth
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  // Main
  MainDrawer: undefined;

  // Modals
  CreatePost: undefined;
  ImagePreview: { imageUrl: string } | undefined;
  Filters: undefined;
  VideoPlayer: { videoUrl: string } | undefined;
  MapView: { location?: { latitude: number; longitude: number } } | undefined;
  ActionSheet: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Create: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  Settings: undefined;
  Help: undefined;
};
