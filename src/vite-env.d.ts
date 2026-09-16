/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  /** Play Store listing — fill when live. */
  readonly VITE_ANDROID_STORE_URL?: string;
  /** App Store listing — fill when live. */
  readonly VITE_IOS_STORE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
