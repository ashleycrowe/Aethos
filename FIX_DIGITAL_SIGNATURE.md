# 🔓 Fix "Not Digitally Signed" Error

**Error:** `The file is not digitally signed. You cannot run this script on the current system.`

---

## ✅ **Easiest Fix (30 Seconds)**

### **Option 1: Unblock the Script Files**

Run these commands in PowerShell (in your project folder):

```powershell
# Unblock all scripts
Unblock-File -Path .\scripts\setup-all.ps1
Unblock-File -Path .\scripts\setup-supabase.ps1
Unblock-File -Path .\scripts\create-env-file.ps1
Unblock-File -Path .\scripts\verify-setup.ps1

# Now run the script
.\scripts\setup-all.ps1
```

**This should work immediately!** ✅

---

## 🆘 **If That Doesn't Work**

### **Option 2: Change Execution Policy to Unrestricted**

Open PowerShell **as Administrator** and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
```

Type **Y** when prompted.

Then close and run your script normally:

```powershell
.\scripts\setup-all.ps1
```

---

## 🚀 **Option 3: Run with Bypass (No Admin Needed)**

Don't change any settings - just run the script with bypass:

```powershell
PowerShell -ExecutionPolicy Bypass -File .\scripts\setup-all.ps1
```

**This works immediately and doesn't require admin rights!**

---

## 📋 **Quick Decision Guide**

**I have admin rights:**
→ Use **Option 2** (Unrestricted) - One-time setup

**I don't have admin rights:**
→ Use **Option 3** (Bypass) - Works every time, no setup needed

**I want the quickest fix:**
→ Use **Option 1** (Unblock) or **Option 3** (Bypass)

---

## ✅ **My Recommendation**

Try **Option 1** first (Unblock). If that doesn't work, use **Option 3** (Bypass).

```powershell
# Option 1 - Try this first
Unblock-File -Path .\scripts\*.ps1

# Then run
.\scripts\setup-all.ps1
```

---

**Let me know which one works for you!** 🚀
