declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_HOST: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    MAIL_HOST: string;
    MAIL_USER: string;
    MAIL_PASSWORD: string;
    MAIL_FROM: string;
    JWT_SECRET: string;
    ENCRYPTION_KEY: string;
    ENCRYPTION_IV: string;
    HOST_DOMAIN: string;
  }
}
