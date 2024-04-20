/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 用于在开发和生产环境设置不同基地址
  readonly VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
