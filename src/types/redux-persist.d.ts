// src/types/redux-persist.d.ts
declare module "redux-persist/lib/storage" {
  import { WebStorage } from "redux-persist/es/types"; // Path to WebStorage type

  const storage: WebStorage;
  export default storage;
}
