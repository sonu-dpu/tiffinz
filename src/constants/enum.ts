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
  ordered = "ORDERED",
  cancelled = "CANCELLED ",
  not_required = "NOT_REQUIRED",
}
enum TransactionType {
  credit = "CREDIT",
  debit="DEBIT"
}

enum LoginType{
  email="email",
  phone="phone",
  username="username"
}

export {MealType, UserRole, MealStatus, TransactionType, PaymentStatus, LoginType }


