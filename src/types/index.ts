// src/types/index.ts

// Export all types from a central location
export * from './auth';
export * from './ui';
export * from './product';

// Common utility types
export type ID = string | number;

export interface PaginatedResponse<T> {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
}

export interface ApiError {
    message: string;
    code?: string;
    field?: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    errors?: ApiError[];
}
