enum UserRole {
  admin = "ADMIN",
  user = "USER",
}

enum MealType {
  regular = "REGULAR",
  full = "FULL",
  special = "SPL",
  nonVeg = "NON_VEG",
  extras = "EXTRA",
}

enum PaymentStatus {
  pending = "PENDING",
  approved = "APPROVED",
  rejected = "REJECTED",
}
enum PaymentMode {
  cash = "CASH",
  online = "ONLINE",
}

enum MealStatus {
  ordered = "ORDERED",
  cancelled = "CANCELLED ",
  not_required = "NOT_REQUIRED",
  taken = "TAKEN",
  not_taken = "NOT_TAKEN",
}
enum DailyMealFor {
  breakfast = "BREAKFAST",
  morning = "LUNCH",
  dinner = "DINNER",
}
enum TransactionType {
  credit = "CREDIT",
  debit = "DEBIT",
}

enum LoginType {
  email = "email",
  phone = "phone",
  username = "username",
}


enum ImageKitFolder {
  users = "/tifinz/users",
  payments = "/tifinz/payments",    
}

export {
  MealType,
  UserRole,
  MealStatus,
  DailyMealFor,
  TransactionType,
  PaymentStatus,
  LoginType,
  PaymentMode,
  ImageKitFolder,
};
