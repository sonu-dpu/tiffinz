enum UserRole {
  admin = "ADMIN",
  user = "USER",
}

enum MealType {
  regular = "REGULAR",
  full = "FULL",
  special = "SPL",
}

enum PaymentStatus {
  pending = "PENDING",
  approved = "APPROVED",
  rejected = "REJECTED",
}

enum MealStatus {
  ORDERED = "ordered",
  CANCELLED = "cancelled",
  NOT_REQUIRED = "not_required",
}
enum TransactionType {
  credit = "CREDIT",
  debit="DEBIT"
}

export {MealType, UserRole, MealStatus, TransactionType, PaymentStatus }


