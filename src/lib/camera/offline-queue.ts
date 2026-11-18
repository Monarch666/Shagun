import Dexie, { Table } from 'dexie';

export interface QueuedPhoto {
  id?: number;
  weddingId: string;
  rollId: string;
  guestSessionId: string;
  blob: Blob;
  capturedAt: string;
  status: 'queued' | 'uploading' | 'failed';
  retryCount: number;
}

class PhotoDatabase extends Dexie {
  queuedPhotos!: Table<QueuedPhoto, number>;

  constructor() {
    super('ShagunCameraDB');
    this.version(1).stores({
      queuedPhotos: '++id, weddingId, rollId, guestSessionId, status, capturedAt',
    });
  }
}

export const photoDb = typeof window !== 'undefined' ? new PhotoDatabase() : null;

/**
 * Enqueue a captured photo into IndexedDB for resilient offline-first upload
 */
export async function queuePhotoForUpload(
  weddingId: string,
  rollId: string,
  guestSessionId: string,
  blob: Blob
): Promise<number | undefined> {
  if (!photoDb) return undefined;
  return await photoDb.queuedPhotos.add({
    weddingId,
    rollId,
    guestSessionId,
    blob,
    capturedAt: new Date().toISOString(),
    status: 'queued',
    retryCount: 0,
  });
}

/**
 * Gets count of pending photos in offline queue
 */
export async function getPendingPhotoCount(): Promise<number> {
  if (!photoDb) return 0;
  return await photoDb.queuedPhotos.where('status').equals('queued').count();
}

