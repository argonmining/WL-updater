declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FEE_WALLET: string;
      FEE_AMOUNT: string;
      PORT?: string;
      WHITELIST_API_URL: string;
    }
  }
}

export {}; 