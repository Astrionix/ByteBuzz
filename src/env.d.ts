/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENROUTE_API_KEY: string;
  readonly VITE_OPENROUTE_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
