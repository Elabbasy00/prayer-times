// src/types/product.ts

/**
 * Product model
 */
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    category: string;
    stock: number;
    sku: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Product filters for search/list
 */
export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: 'price' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}

/**
 * Product creation DTO
 */
export interface ProductCreateDTO {
    name: string;
    description: string;
    price: number;
    currency?: string;
    images?: string[];
    category: string;
    stock: number;
    sku: string;
    isActive?: boolean;
}

/**
 * Product update DTO
 */
export interface ProductUpdateDTO extends Partial<ProductCreateDTO> {
    id: string;
}
