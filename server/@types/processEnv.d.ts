// https://dev.to/isthatcentered/typing-process-env-and-dealing-with-nodeenv-3ilm

// Target the module containing the `ProcessEnv` interface
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare namespace NodeJS {
  // Merge the existing `ProcessEnv` definition with ours
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DB_CONNECTION: string;
    COOKIE_NAME: string;
    COOKIE_SECRET: string;
    PORT: string;
    BCRYPT_SALT_ROUNDS: string;
    CONNECT_MONGO_SECRET: string;
    BACKEND_NAME: 'mongoose';
  }
}
