export enum MaterialType {
  PLA = 'PLA',
  PETG = 'PETG',
  ABS = 'ABS',
  TPU = 'TPU',
  RESIN = 'RESIN',
  OTHER = 'OTHER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED',
}

export enum PrinterStatus {
  AVAILABLE = 'AVAILABLE',
  PRINTING = 'PRINTING',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

export enum PrintJobStatus {
  PENDING = 'PENDING',
  PRINTING = 'PRINTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  USER = 'USER',
}