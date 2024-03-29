export class AuthError extends Error {
    status: number | undefined
    protected __isAuthError = true

    constructor(message: string, status?: number) {
        super(message)
        this.name = 'AuthError'
        this.status = status
    }
}

export function isAuthError(error: unknown): error is AuthError {
    return typeof error === 'object' && error !== null && '__isAuthError' in error
}

export class AuthApiError extends AuthError {
    status: number

    constructor(message: string, status: number) {
        super(message, status)
        this.name = 'AuthApiError'
        this.status = status
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
        }
    }
}

export function isAuthApiError(error: unknown): error is AuthApiError {
    return isAuthError(error) && error.name === 'AuthApiError'
}

export class AuthUnknownError extends AuthError {
    originalError: unknown

    constructor(message: string, originalError: unknown) {
        super(message)
        this.name = 'AuthUnknownError'
        this.originalError = originalError
    }
}

export class CustomAuthError extends AuthError {
    name: string
    status: number
    constructor(message: string, name: string, status: number) {
        super(message)
        this.name = name
        this.status = status
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
        }
    }
}