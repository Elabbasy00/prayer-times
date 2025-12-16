// src/types/auth.ts

/**
 * User model
 */
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    phoneNumber?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Login DTO
 */
export interface LoginDTO {
    email: string;
    password: string;
}

/**
 * Register DTO
 */
export interface RegisterDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
}

/**
 * Auth response from API
 */
export interface AuthResponse {
    user: User;
    access: string;
    refresh?: string;
}

/**
 * Token refresh DTO
 */
export interface RefreshTokenDTO {
    refresh: string;
}

/**
 * Password reset DTO
 */
export interface ForgotPasswordDTO {
    email: string;
}

/**
 * Password reset confirm DTO
 */
export interface ResetPasswordDTO {
    token: string;
    password: string;
    confirmPassword: string;
}
