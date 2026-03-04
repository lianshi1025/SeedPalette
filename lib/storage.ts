export type Artwork = {
  id: string;
  title: string;
  createdAt: string;
  lineArtSrc: string;
  coloredDataUrl: string;
};

type TempAsset = { id: string; dataUrl: string; createdAt: string };

const DB_NAME = 'seedpalette';
const DB_VERSION = 1;
const ARTWORKS = 'artworks';
const TEMP = 'temp_assets';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(ARTWORKS)) db.createObjectStore(ARTWORKS, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(TEMP)) db.createObjectStore(TEMP, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function runTx<T>(storeName: string, mode: IDBTransactionMode, action: (store: IDBObjectStore, done: (value: T) => void) => void): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    action(store, resolve);
    tx.onerror = () => reject(tx.error);
  });
}

export const saveArtwork = async (artwork: Artwork) => runTx<void>(ARTWORKS, 'readwrite', (store, done) => {
  store.put(artwork);
  done();
});

export const listArtworks = async () => runTx<Artwork[]>(ARTWORKS, 'readonly', (store, done) => {
  const req = store.getAll();
  req.onsuccess = () => done((req.result as Artwork[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

export const deleteArtwork = async (id: string) => runTx<void>(ARTWORKS, 'readwrite', (store, done) => {
  store.delete(id);
  done();
});

export const saveTempAsset = async (dataUrl: string) => {
  const temp: TempAsset = { id: crypto.randomUUID(), dataUrl, createdAt: new Date().toISOString() };
  await runTx<void>(TEMP, 'readwrite', (store, done) => {
    store.put(temp);
    done();
  });
  return temp.id;
};

export const getTempAsset = async (id: string) => runTx<string | null>(TEMP, 'readonly', (store, done) => {
  const req = store.get(id);
  req.onsuccess = () => done(req.result?.dataUrl ?? null);
});
