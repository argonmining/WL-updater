declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FEE_WALLET: string;
      FEE_AMOUNT: string;
      PORT?: string;
      WHITELIST_API_URL: string;
      WHITELIST_API_USERNAME: string;
      WHITELIST_API_PASSWORD: string;
    }
  }
}

export {}; 