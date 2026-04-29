# 🔓 Fix PowerShell Execution Policy Error

**Error:** `running scripts is disabled on this system`  
**Solution:** Enable script execution (one-time setup)

---

## ✅ Quick Fix (2 Minutes)

### **Step 1: Open PowerShell as Administrator**

**Option A: From Start Menu**
1. Press `Windows` key
2. Type "PowerShell"
3. Right-click "Windows PowerShell"
4. Select **"Run as administrator"**

**Option B: From VS Code**
1. Close VS Code
2. Right-click VS Code icon
3. Select **"Run as administrator"**
4. Open terminal in VS Code

---

### **Step 2: Run This Command**

Copy and paste this **exact command**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Press Enter**

---

### **Step 3: Confirm**

When prompted, type: **Y** (for Yes)

```
Execution Policy Change
The execution policy helps protect you from scripts that you do not trust...
Do you want to change the execution policy?
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "N"): Y
```

---

### **Step 4: Verify It Worked**

```powershell
Get-ExecutionPolicy
```

**Should show:** `RemoteSigned`

---

### **Step 5: Run Your Script**

Now you can run the setup script:

```powershell
cd C:\Users\Ashley\Projects\Aethos
.\scripts\setup-all.ps1
```

**It should work now!** ✅

---

## 🛡️ What This Does

`Set-ExecutionPolicy RemoteSigned` means:
- ✅ You can run scripts **you created** (local scripts)
- ✅ You can run scripts **from trusted publishers** (signed scripts)
- ⚠️ Scripts downloaded from the internet need to be **unblocked** first

**Security:** This is the **recommended** setting for developers. It's secure but allows local development.

---

## 🆘 If You Can't Run as Administrator

### **Alternative: Bypass for This Session Only**

```powershell
PowerShell -ExecutionPolicy Bypass -File .\scripts\setup-all.ps1
```

**Note:** This only works for **this one command** - you'll need to do it every time.

---

## 🔒 If Your Company Blocks This

Some corporate environments don't allow changing execution policy. In that case:

### **Option 1: Run Individual Commands**

Instead of running the script, copy-paste the commands manually. I can break down what each script does into individual commands you can run directly.

### **Option 2: Use Manual Setup**

1. **Supabase:** Go to dashboard → SQL Editor → Copy/paste migration files
2. **Environment:** Manually create `.env` file → Copy from `.env.example`
3. **GitHub:** Use GitHub Desktop (visual, no scripts needed)

**Want me to provide the manual steps?** Let me know!

---

## ✅ After Fixing

Once you've run the `Set-ExecutionPolicy` command:

```powershell
# This should now work:
.\scripts\setup-all.ps1
```

---

**Try the fix now and let me know if it works!** 🚀
