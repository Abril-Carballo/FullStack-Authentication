// LABORATORIO 2: enum de roles para forzar valores canónicos
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// Define los únicos valores válidos para el rol de un usuario. TypeScript atrapa errores en tiempo de compilación si intentás asignar un rol que no existe.
