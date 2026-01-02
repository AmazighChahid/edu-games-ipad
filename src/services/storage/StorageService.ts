/**
 * StorageService - Service de persistance abstrait
 *
 * Fournit une interface unifiée pour la persistance des données
 * avec support pour :
 * - SQLite (mobile natif) - persistance robuste
 * - AsyncStorage (fallback) - compatible web
 * - Sync serveur (future) - prêt pour migration cloud
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Import dynamique de SQLite pour éviter les erreurs sur le web
type SQLiteModule = typeof import('expo-sqlite');
let SQLite: SQLiteModule | null = null;

if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  SQLite = require('expo-sqlite');
}

// ============================================================================
// TYPES
// ============================================================================

export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  getAllKeys: () => Promise<string[]>;
  clear: () => Promise<void>;
}

export interface SyncConfig {
  enabled: boolean;
  serverUrl?: string;
  syncInterval?: number; // en millisecondes
  onSyncStart?: () => void;
  onSyncComplete?: (success: boolean) => void;
  onSyncError?: (error: Error) => void;
}

// ============================================================================
// SQLITE ADAPTER
// ============================================================================

class SQLiteAdapter implements StorageAdapter {
  private db: import('expo-sqlite').SQLiteDatabase | null = null;
  private dbName = 'edu_games.db';
  private tableName = 'app_storage';
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      if (!SQLite) {
        throw new Error('SQLite not available on this platform');
      }
      this.db = await SQLite.openDatabaseAsync(this.dbName);

      // Créer la table si elle n'existe pas
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL,
          updated_at INTEGER DEFAULT (strftime('%s', 'now'))
        );
      `);

      // Créer un index pour les performances
      await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_updated_at ON ${this.tableName}(updated_at);
      `);

      this.initialized = true;
      console.log('[StorageService] SQLite initialized successfully');
    } catch (error) {
      console.error('[StorageService] SQLite init error:', error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (!this.db) await this.init();

    try {
      const result = await this.db!.getFirstAsync<{ value: string }>(
        `SELECT value FROM ${this.tableName} WHERE key = ?`,
        [key]
      );
      return result?.value ?? null;
    } catch (error) {
      console.error('[StorageService] SQLite getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.db) await this.init();

    try {
      await this.db!.runAsync(
        `INSERT OR REPLACE INTO ${this.tableName} (key, value, updated_at)
         VALUES (?, ?, strftime('%s', 'now'))`,
        [key, value]
      );
    } catch (error) {
      console.error('[StorageService] SQLite setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!this.db) await this.init();

    try {
      await this.db!.runAsync(
        `DELETE FROM ${this.tableName} WHERE key = ?`,
        [key]
      );
    } catch (error) {
      console.error('[StorageService] SQLite removeItem error:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    if (!this.db) await this.init();

    try {
      const results = await this.db!.getAllAsync<{ key: string }>(
        `SELECT key FROM ${this.tableName}`
      );
      return results.map((r) => r.key);
    } catch (error) {
      console.error('[StorageService] SQLite getAllKeys error:', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();

    try {
      await this.db!.runAsync(`DELETE FROM ${this.tableName}`);
    } catch (error) {
      console.error('[StorageService] SQLite clear error:', error);
      throw error;
    }
  }

  // Méthodes spécifiques SQLite pour la sync future
  async getModifiedSince(timestamp: number): Promise<Array<{ key: string; value: string }>> {
    if (!this.db) await this.init();

    try {
      const results = await this.db!.getAllAsync<{ key: string; value: string }>(
        `SELECT key, value FROM ${this.tableName} WHERE updated_at > ?`,
        [timestamp]
      );
      return results;
    } catch (error) {
      console.error('[StorageService] SQLite getModifiedSince error:', error);
      return [];
    }
  }

  async getLastUpdateTime(): Promise<number> {
    if (!this.db) await this.init();

    try {
      const result = await this.db!.getFirstAsync<{ max_time: number }>(
        `SELECT MAX(updated_at) as max_time FROM ${this.tableName}`
      );
      return result?.max_time ?? 0;
    } catch (error) {
      console.error('[StorageService] SQLite getLastUpdateTime error:', error);
      return 0;
    }
  }
}

// ============================================================================
// ASYNC STORAGE ADAPTER (FALLBACK)
// ============================================================================

class AsyncStorageAdapter implements StorageAdapter {
  private prefix = '@edu_games:';

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.prefix + key);
    } catch (error) {
      console.error('[StorageService] AsyncStorage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.prefix + key, value);
    } catch (error) {
      console.error('[StorageService] AsyncStorage setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('[StorageService] AsyncStorage removeItem error:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys
        .filter((k) => k.startsWith(this.prefix))
        .map((k) => k.replace(this.prefix, ''));
    } catch (error) {
      console.error('[StorageService] AsyncStorage getAllKeys error:', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      await AsyncStorage.multiRemove(keys.map((k) => this.prefix + k));
    } catch (error) {
      console.error('[StorageService] AsyncStorage clear error:', error);
      throw error;
    }
  }
}

// ============================================================================
// STORAGE SERVICE (SINGLETON)
// ============================================================================

class StorageService {
  private static instance: StorageService;
  private adapter: StorageAdapter;
  private syncConfig: SyncConfig = { enabled: false };
  private syncTimer: ReturnType<typeof setInterval> | null = null;
  private lastSyncTime = 0;

  private constructor() {
    // Utiliser SQLite sur mobile natif, AsyncStorage sur web
    if (Platform.OS === 'web') {
      console.log('[StorageService] Using AsyncStorage adapter (web)');
      this.adapter = new AsyncStorageAdapter();
    } else {
      console.log('[StorageService] Using SQLite adapter (native)');
      this.adapter = new SQLiteAdapter();
    }
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // ============================================================================
  // API PRINCIPALE
  // ============================================================================

  async getItem(key: string): Promise<string | null> {
    return this.adapter.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.adapter.setItem(key, value);

    // Déclencher sync si activée
    if (this.syncConfig.enabled) {
      this.scheduleSync();
    }
  }

  async removeItem(key: string): Promise<void> {
    return this.adapter.removeItem(key);
  }

  async getAllKeys(): Promise<string[]> {
    return this.adapter.getAllKeys();
  }

  async clear(): Promise<void> {
    return this.adapter.clear();
  }

  // ============================================================================
  // HELPERS JSON
  // ============================================================================

  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.getItem(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      console.error('[StorageService] JSON parse error for key:', key);
      return null;
    }
  }

  async setJSON<T>(key: string, value: T): Promise<void> {
    const json = JSON.stringify(value);
    await this.setItem(key, json);
  }

  // ============================================================================
  // SYNC SERVEUR (PRÉPARATION FUTURE)
  // ============================================================================

  configureSyncServer(config: SyncConfig): void {
    this.syncConfig = config;

    if (config.enabled && config.syncInterval) {
      this.startAutoSync(config.syncInterval);
    } else {
      this.stopAutoSync();
    }
  }

  private startAutoSync(interval: number): void {
    this.stopAutoSync();
    this.syncTimer = setInterval(() => {
      this.syncToServer();
    }, interval);
  }

  private stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  private scheduleSync(): void {
    // Debounce: sync 5 secondes après la dernière écriture
    // Implémentation simplifiée - à améliorer pour production
  }

  async syncToServer(): Promise<boolean> {
    if (!this.syncConfig.enabled || !this.syncConfig.serverUrl) {
      return false;
    }

    this.syncConfig.onSyncStart?.();

    try {
      // Récupérer les données modifiées depuis la dernière sync
      let dataToSync: Record<string, string> = {};

      if (this.adapter instanceof SQLiteAdapter) {
        const modified = await (this.adapter as SQLiteAdapter).getModifiedSince(this.lastSyncTime);
        dataToSync = Object.fromEntries(modified.map((m) => [m.key, m.value]));
      } else {
        // Pour AsyncStorage, envoyer tout
        const keys = await this.getAllKeys();
        for (const key of keys) {
          const value = await this.getItem(key);
          if (value) dataToSync[key] = value;
        }
      }

      // Envoyer au serveur
      const response = await fetch(this.syncConfig.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: dataToSync,
          lastSyncTime: this.lastSyncTime,
          deviceId: await this.getDeviceId(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }

      const serverData = await response.json();

      // Appliquer les données du serveur (merge)
      if (serverData.updates) {
        for (const [key, value] of Object.entries(serverData.updates)) {
          await this.setItem(key, value as string);
        }
      }

      this.lastSyncTime = Date.now();
      this.syncConfig.onSyncComplete?.(true);
      return true;
    } catch (error) {
      console.error('[StorageService] Sync error:', error);
      this.syncConfig.onSyncError?.(error as Error);
      this.syncConfig.onSyncComplete?.(false);
      return false;
    }
  }

  async syncFromServer(): Promise<boolean> {
    if (!this.syncConfig.enabled || !this.syncConfig.serverUrl) {
      return false;
    }

    try {
      const response = await fetch(`${this.syncConfig.serverUrl}/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: await this.getDeviceId(),
          lastSyncTime: this.lastSyncTime,
        }),
      });

      if (!response.ok) {
        throw new Error(`Pull failed: ${response.status}`);
      }

      const serverData = await response.json();

      // Appliquer toutes les données du serveur
      if (serverData.data) {
        for (const [key, value] of Object.entries(serverData.data)) {
          await this.setItem(key, value as string);
        }
      }

      this.lastSyncTime = Date.now();
      return true;
    } catch (error) {
      console.error('[StorageService] Pull error:', error);
      return false;
    }
  }

  private async getDeviceId(): Promise<string> {
    let deviceId = await this.getItem('__device_id__');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await this.setItem('__device_id__', deviceId);
    }
    return deviceId;
  }

  // ============================================================================
  // EXPORT / IMPORT (Pour backup manuel)
  // ============================================================================

  async exportAll(): Promise<Record<string, unknown>> {
    const keys = await this.getAllKeys();
    const data: Record<string, unknown> = {};

    for (const key of keys) {
      if (key.startsWith('__')) continue; // Skip internal keys
      const value = await this.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    }

    return data;
  }

  async importAll(data: Record<string, unknown>): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await this.setItem(key, stringValue);
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const storageService = StorageService.getInstance();

// Créer un storage compatible Zustand persist
export const createZustandStorage = () => ({
  getItem: async (name: string): Promise<string | null> => {
    return storageService.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await storageService.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await storageService.removeItem(name);
  },
});

export default storageService;
