# Quick Start for Your Co-Founder

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

1. Click the **"Add file"** button (top right)
2. Select **"Create new file"**
3. In the filename box, type: `your-company-name/config.json`
   - Example: `bosch/config.json`
   - Use lowercase, no spaces (use dashes if needed)
4. Press Enter - this creates the folder and file

### Step 3: Copy the Template

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

Before submitting, let's make sure it's correct:

1. Go to: https://jsonlint.com/
2. Copy your entire config file
3. Paste it into JSONLint
4. Click **"Validate JSON"**
5. If it says ✅ "Valid JSON" - great!
6. If it shows ❌ errors - fix them and try again

**Common Errors:**

- Missing comma (,) between items
- Extra comma after the last item
- Missing closing bracket } or ]
- Forgot quotes around text

### Step 6: Submit Your Config

1. Scroll to the bottom of GitHub
2. In the "Commit changes" box:
   - Title: `Add config for [Your Company]`
   - Description: Optional, add any notes
3. Select **"Create a new branch"**
4. Click **"Propose changes"**
5. Click **"Create pull request"**

Done! 🎉

### Step 7: Wait for Review

A developer will:

- Check your config
- Run automatic validation
- Merge it if everything looks good
- Comment if anything needs fixing

You'll get an email when it's reviewed!

---

## ❓ Common Questions

### Q: What if I make a mistake?

**A:** No problem! You can edit the file after creating the Pull Request:

1. Go to your Pull Request
2. Click on the "Files changed" tab
3. Click the three dots (...) next to your file
4. Select "Edit file"
5. Make your changes
6. Click "Commit changes"

### Q: What's a hex color code?

**A:** It's a way to specify colors using numbers and letters after a `#`.

Examples:

- `#FF0000` = Red
- `#00FF00` = Green
- `#0000FF` = Blue
- `#c8102e` = Sollich Red (from example)

**How to find yours:**

- Use a color picker tool: https://www.google.com/search?q=color+picker
- Or copy from your website's logo

### Q: I don't have an logo URL, just an emoji?

**A:** That's fine! Just use an emoji:

```json
"logoUrl": "🏭"
```

Pick one that represents your company!

### Q: How do I know if my config was added successfully?

**A:** You'll see it in the Pull Request:

1. Go to your PR
2. Look for a green checkmark ✅ next to "Validate Company Configs"
3. If it's green = success!
4. If it's red = something needs fixing (check the error message)

### Q: Can I see what others have done?

**A:** Yes! Look at the example:

- Go to `configs/sollich/config.json`
- This is a complete, working example
- You can copy the structure and change the content

---

## 🆘 Need Help?

1. **Check the error message** - it usually tells you what's wrong
2. **Look at the example** - `configs/sollich/config.json`
3. **Validate your JSON** - https://jsonlint.com/
4. **Ask a developer** - Create an issue or send a message

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
