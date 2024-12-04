import { ref, query, orderByChild, limitToFirst, get, set, update, remove } from 'firebase/database';
import { db } from '../lib/firebase';
import { validateData } from '../config/database/validation';
import { AuditService } from './AuditService';
import * as paths from '../config/database/paths';

export class DatabaseService {
  static async create<T extends { id?: string }>(
    path: string,
    data: Omit<T, 'id'>,
    entityType: string
  ): Promise<T> {
    const errors = validateData(entityType as any, data);
    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }

    const newRef = ref(db, path);
    const id = newRef.key!;
    const timestamp = new Date().toISOString();
    
    const entity = {
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await set(newRef, entity);
    await AuditService.logCreate(entityType, id, entity);
    
    return entity as T;
  }

  static async update<T extends { id: string }>(
    path: string,
    id: string,
    data: Partial<T>,
    entityType: string
  ): Promise<void> {
    const errors = validateData(entityType as any, data);
    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }

    const updates = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await update(ref(db, `${path}/${id}`), updates);
    await AuditService.logUpdate(entityType, id, updates);
  }

  static async delete(
    path: string,
    id: string,
    entityType: string
  ): Promise<void> {
    await remove(ref(db, `${path}/${id}`));
    await AuditService.logDelete(entityType, id);
  }

  static async get<T>(
    path: string,
    id: string
  ): Promise<T | null> {
    const snapshot = await get(ref(db, `${path}/${id}`));
    return snapshot.exists() ? snapshot.val() as T : null;
  }

  static async list<T>(
    path: string,
    options: {
      orderBy?: string;
      limit?: number;
      startAt?: any;
    } = {}
  ): Promise<T[]> {
    let baseQuery = ref(db, path);
    
    if (options.orderBy) {
      baseQuery = query(
        baseQuery,
        orderByChild(options.orderBy)
      );
    }
    
    if (options.limit) {
      baseQuery = query(
        baseQuery,
        limitToFirst(options.limit)
      );
    }
    
    const snapshot = await get(baseQuery);
    return snapshot.exists() ? Object.values(snapshot.val()) as T[] : [];
  }
}