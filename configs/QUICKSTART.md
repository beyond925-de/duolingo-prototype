# Quick Start for Marco

Hey! 👋 This is the simplest guide to adding a new company config.

## 📝 What You'll Do

1. Copy a template file
2. Fill in your company's information
3. Validate it (make sure it's correct)
4. Submit it on GitHub

**Time needed:** ~15-30 minutes

---

## 🚀 Step-by-Step

### Step 1: Go to GitHub

1. Open your web browser
2. Go to: `https://github.com/YOUR-REPO/duolingo-mockup/tree/main/configs`
3. Log in to GitHub

### Step 2: Create Your Config File

<img width="948" height="290" alt="SCR-20251208-qebf" src="https://github.com/user-attachments/assets/15a43694-2d8e-41ce-a6fc-31a5bb989347" />

<img width="1200" height="919" alt="SCR-20251208-qdtr" src="https://github.com/user-attachments/assets/0b78781c-5923-4d22-add3-398d3b39ac5d" />

1. Click the **"Add file"** button (top right)
2. Select **"Create new file"**
3. In the filename box, type: `your-company-name/config.json`
   - Example: `bosch/config.json`
   - Use lowercase, no spaces (use dashes if needed)
4. Press Enter - this creates the folder and file

### Step 3: Copy the Template (Optional)

1. Open a new tab and go to: `https://github.com/YOUR-REPO/duolingo-mockup/blob/main/configs/TEMPLATE.json`
2. Click the **"Raw"** button (top right of the file)
3. **Select all** (Ctrl+A or Cmd+A)
4. **Copy** (Ctrl+C or Cmd+C)
5. Go back to your new file tab
6. **Paste** into the editor (Ctrl+V or Cmd+V)

### Step 4: Fill In Your Info

Now replace the placeholder text with your company's real information:

#### Company Section

```json
"company": {
  "name": "Your Company Name",        ← Put your company name here
  "logoUrl": "🏢",                    ← Put an emoji or logo URL
  "primaryColor": "#3b82f6",          ← Your brand color (hex code)
  "secondaryColor": "#10b981",        ← Secondary color
  "city": "Your City",                ← Where are you located?
  "website": "https://yoursite.com",  ← Company website
  "industryVibe": "What makes you special?", ← 1-2 sentences
```

**Need help with colors?**

- Go to your company website
- Right-click on your logo
- Select "Inspect" or "Inspect Element"
- Look for color values that start with `#`
- Copy that! (Example: `#FF5733`)

#### Landing Page

```json
"landing": {
  "headline": "Your catchy headline!",      ← First thing users see
  "subline": "Brief explanation",           ← What's this about?
  "startButtonText": "Start Now!"          ← Button text
}
```

#### Jobs Section

This is the big one! Each job needs:

- A unique ID (like `"mechanical-engineer"`)
- Title and description
- Icon (emoji)
- Color (hex code)
- Levels with scenarios (questions)

**Tip:** Look at `configs/sollich/config.json` for a real example!

### Step 5: Validate Your Config

Dance!

### Step 6: Submit Your Config

<img width="1200" height="763" alt="SCR-20251208-qeji" src="https://github.com/user-attachments/assets/9d057d9c-b15a-4027-874a-9f147894924a" />

1. Click "Commit"
2. In the "Commit changes" box:
   - Title: `Add config for [Your Company]`
   - Description: Optional, add any notes
3. Select **"Create a new branch"**
4. Click **"Propose changes"**
5. Click **"Create pull request"**

<img width="664" height="724" alt="SCR-20251208-qenu" src="https://github.com/user-attachments/assets/373b4240-55ae-4e36-b0a3-d401cb020222" />

<img width="1190" height="808" alt="SCR-20251208-qewb" src="https://github.com/user-attachments/assets/ac2b404f-bf54-4d0b-ac2d-f16b6dd3a2fd" />


Done! 🎉

### Step 7: Review and merge



<img width="1188" height="925" alt="SCR-20251208-qfbo" src="https://github.com/user-attachments/assets/a6b38d70-2fd4-4517-a638-6b725e0b32a2" />


---

## ❓ Common Questions


## 🆘 Need Help?

1. **Check the error message** - it usually tells you what's wrong
2. **Look at the example** - `configs/sollich/config.json`
3. **Validate your JSON** - https://jsonlint.com/
4. **Ask a developer** - @aaron 👀

---

## 📋 Checklist

Before submitting, make sure:

- [ ] Company name is correct
- [ ] Colors are in hex format (like `#FF5733`)
- [ ] Website URL starts with `https://`
- [ ] At least one job is configured
- [ ] JSON validates on jsonlint.com
- [ ] Commit message describes what you did

---

**That's it! You're ready to go! 🚀**

If you get stuck, don't worry - just ask for help!
