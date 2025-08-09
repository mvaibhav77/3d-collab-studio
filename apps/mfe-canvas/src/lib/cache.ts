import { openDB, type DBSchema } from "idb";

const DB_NAME = "3d-model-cache";
const STORE_NAME = "models";

interface ModelDB extends DBSchema {
  [STORE_NAME]: {
    key: string; // appwriteId
    value: ArrayBuffer;
  };
}

const dbPromise = openDB<ModelDB>(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

export const modelCache = {
  async get(key: string): Promise<ArrayBuffer | undefined> {
    return (await dbPromise).get(STORE_NAME, key);
  },
  async set(key: string, value: ArrayBuffer): Promise<IDBValidKey> {
    return (await dbPromise).put(STORE_NAME, value, key);
  },
};
