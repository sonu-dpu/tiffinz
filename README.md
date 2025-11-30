
# **Tiffinz – Tiffin Service Management App**

Tiffinz is a full-stack tiffin management platform designed to help users track meals, monitor wallet balance, submit top-up requests, and simplify operations for tiffin service providers. The main idea behind building Tiffinz was to accurately track user balances, reduce manual errors, and bring complete transparency to end users — solving the issues present in the traditional offline tiffin management system. The project is still under active development and continuously improving.

---

## **Features**

### **For Users**

* Track **daily tiffin status**
* Check **wallet balance**
* View **transaction history**
* Submit **top-up requests**
* Cancel tiffin with **auto-applied charges**
* View meal menu (optional)

### **For Admin**

* Manage users
* Update daily tiffin statuses
* Approve top-up requests
* View cancellations
* Manually verify payments
* View basic analytics

---

## **Test Credentials**

### **🔸 User Login**

```
Email: user@test.com
Password: user123
```

### **🔸 Admin Login**

```
Email: admin@test.com
Password: admin123
```

> *These credentials are for testing/demo purposes only*

---

## **Tech Stack**

### **Frontend**

* Next.js
* React
* TailwindCSS

### **Backend**

* Next.js API Routes
* MongoDB Atlas
* Mongoose


---


## **Core Modules**

### **1. Tiffin Tracking**

Daily delivered / not delivered status per user.

### **2. Wallet & Transactions**

* Real-time balance
* Logs of:

  * Top-ups
  * Daily meal deductions
  * Cancellation charges

### **3. Cancellation System**

Auto-deduct extra charge on cancellation.

### **4. Top-Up Requests**

User submits → Admin verifies → Balance updates.

