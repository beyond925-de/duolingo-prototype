# Company Configs - Setup Guide

This directory contains configuration files for each company using the Beyond925 platform. Each company gets their own folder with a `config.json` file.

## 📁 Directory Structure

```
configs/
├── README.md          ← You are here!
├── TEMPLATE.json      ← Copy this to create new companies
├── schema.json        ← JSON schema for validation
├── .validate-config.js ← Validator script
├── sollich/
│   └── config.json    ← Sollich company config
└── [your-company]/
    └── config.json    ← Your new company config
```

---

## 🚀 Quick Start: Adding a New Company

### Step 1: Copy the Template

1. **Download the template:**
   - Go to [`configs/TEMPLATE.json`](./TEMPLATE.json)
   - Click the "Raw" button (top right)
   - Right-click → "Save Page As..." → Save to your computer

2. **OR use GitHub's web interface:**
   - Click "Add file" → "Create new file" in this directory
   - Name it: `your-company-name/config.json`
   - Copy-paste the content from [`TEMPLATE.json`](./TEMPLATE.json)

### Step 2: Fill Out Your Company Info

Open the JSON file and replace the placeholder values:

#### Company Section

```json
"company": {
  "name": "Your Company Name",           // ← Replace with actual company name
  "logoUrl": "🏢",                       // ← Emoji or URL to logo image
  "primaryColor": "#3b82f6",             // ← Hex color code for brand color
  "secondaryColor": "#10b981",           // ← Secondary/accent color
  "city": "Your City",                   // ← City where company is located
  "website": "https://your-company.com", // ← Company website
  "industryVibe": "A catchy description",// ← What makes you unique? (1-2 sentences)
  "organizationFacts": [...]             // ← 3 benefits/perks (see below)
}
```

**Organization Facts** (3 company benefits/perks):

```json
{
  "title": "Short Benefit Title", // ← e.g., "Flexible Hours"
  "value": "Detailed description", // ← e.g., "Work when you work best"
  "icon": "⏰" // ← Single emoji that represents this
}
```

#### Landing Page

```json
"landing": {
  "headline": "Your catchy headline! 🚀",      // ← First thing users see
  "subline": "Brief explanation of experience", // ← What is this about?
  "startButtonText": "Let's Start! 🎯"         // ← Button text
}
```

#### Campus (Job Selection)

```json
"campus": {
  "headline": "Choose Your Path",              // ← Section title
  "subline": "What type of role interests you?", // ← Subtitle
  "categories": [                              // ← Job categories (optional)
    {
      "id": "category-1",                      // ← Unique ID
      "title": "Category Title",               // ← Display name
      "jobId": "job-id-matches-below"         // ← Links to a job below
    }
  ]
}
```

#### Jobs Array

This is the most complex part. Each job has:

- Basic info (title, description, icon, color, tags)
- Levels (learning path)
- Scenarios (questions/interactions)

**Scenario Types:**

- `single-select-correct` - Multiple choice with one right answer
- `single-select-no-correct` - Opinion/preference question (no wrong answer)
- `multiple-select` - Can select multiple correct answers
- `text-field` - Free text input
- `single-select-or-text` - Choose option OR write custom answer
- `llm-interactive` - AI conversation (advanced)
- `bento-grid` - Display information cards

See [`CONFIGURATION_SPEC.md`](../CONFIGURATION_SPEC.md) for detailed documentation on job structure.

#### Copy (Text)

```json
"copy": {
  "checkChances": "Button text to check compatibility",
  "expressApply": "Quick apply button text",
  "jobMerken": "Save job button text",
  "submit": "Form submit button",
  "submitSuccess": "Success message after submission",
  "victoryHeadline": "Congrats message after completing level",
  "victorySubtext": "Follow-up message",
  "nudgeText": "Encouragement to apply",
  "firstName": "Form label for name field",
  "schoolType": "Form label for school field",
  // ... more form labels
}
```

### Step 3: Validate Your JSON

Before committing, validate your JSON to catch errors:

#### Option 1: Online Validator

1. Copy your file content
2. Paste into: https://jsonlint.com/
3. Click "Validate JSON"
4. Fix any errors shown

#### Option 2: Command Line Validator

```bash
cd configs
node .validate-config.js your-company/config.json
```

This will check:

- ✅ Valid JSON syntax
- ✅ Required fields are present
- ✅ Colors are in hex format
- ✅ Jobs array is not empty

#### Common Errors to Avoid:

- ❌ Missing comma between items
- ❌ Extra comma after last item
- ❌ Forgot to close a bracket `}` or `]`
- ❌ Unescaped quotes inside strings (use `\"`)
- ❌ Single quotes (JSON requires double quotes `"`)
- ❌ Colors not in hex format (must be `#FF5733`, not `red`)

### Step 4: Commit Your Changes

#### Option A: GitHub Web Interface (Easiest)

1. After creating/editing the file on GitHub
2. Scroll to bottom → "Commit changes" section
3. Add a commit message: "Add config for [Company Name]"
4. Choose "Create a new branch" (this creates a Pull Request)
5. Click "Propose changes"
6. Click "Create pull request"
7. Wait for review! ✅

#### Option B: Git Command Line

```bash
git add configs/your-company/config.json
git commit -m "Add config for Your Company"
git push origin main
```

---

## 📋 Checklist Before Submitting

- [ ] Company name is correct
- [ ] Colors match brand (use hex codes like `#FF5733`)
- [ ] All text is in correct language (German for DE companies, etc.)
- [ ] Logo/emoji is set
- [ ] At least 1 job is configured
- [ ] JSON is valid (no syntax errors)
- [ ] Ran through validator (`node .validate-config.js`)
- [ ] Commit message is descriptive

---

## 🎨 Tips for Great Content

### Writing Scenarios

- ✅ **Be conversational:** Use informal language ("Du" in German)
- ✅ **Keep it short:** 1-3 sentences per scenario
- ✅ **Make it relevant:** Use real situations from your company
- ✅ **Be engaging:** Use emojis sparingly (1-2 per scenario)

### Choosing Colors

- Use your brand's primary color for `primaryColor`
- Choose a contrasting color for buttons as `secondaryColor`
- Test colors together to ensure readability
- Tip: Use a color picker from your website's logo

### Organization Facts (Benefits)

- Focus on what makes YOU unique
- Be specific: "35-hour work week" not "good work-life balance"
- Keep it real: Don't oversell
- Use action-oriented language

### Image URLs

- Use HTTPS URLs only
- Test all image links before submitting
- Recommended size: 1200x800px
- Keep file sizes under 500KB for fast loading

---

## 🐛 Troubleshooting

### "Invalid JSON" Error

- Check for missing/extra commas
- Ensure all strings use double quotes `"`
- Verify all brackets are closed: `{ }` and `[ ]`
- Use jsonlint.com to find the exact error

### "Config Not Loading"

- File must be named exactly: `config.json`
- Folder name should be lowercase, no spaces
- Check file is in correct location: `configs/[company]/config.json`

### Colors Not Showing

- Colors must be hex codes starting with `#`
- Example: `#FF5733` not `red` or `rgb(255,87,51)`
- Use 6-digit hex codes (not 3-digit)

### Images Not Displaying

- URL must start with `https://` (not `http://`)
- Test URL in browser first
- Check image is publicly accessible (not behind login)

---

## 🔍 Validation

### Automatic Validation

Run the validator script to check your config:

```bash
node .validate-config.js your-company/config.json
```

### Schema Validation

For more detailed validation, use the JSON schema:

```bash
# Install ajv-cli if not already installed
npm install -g ajv-cli

# Validate against schema
ajv validate -s schema.json -d your-company/config.json
```

---

## 📞 Need Help?

1. **Check existing configs:** Look at `configs/sollich/config.json` for a working example
2. **Read the spec:** See [`CONFIGURATION_SPEC.md`](../CONFIGURATION_SPEC.md) for detailed documentation
3. **Run the validator:** `node .validate-config.js your-file.json`
4. **Ask for help:** Create an issue or reach out to the dev team

---

## 📝 Example: Minimal Working Config

Here's the absolute minimum you need:

```json
{
  "company": {
    "name": "Test Company",
    "logoUrl": "🏢",
    "primaryColor": "#3b82f6",
    "secondaryColor": "#10b981",
    "city": "Berlin",
    "website": "https://test.com",
    "industryVibe": "We build cool stuff.",
    "organizationFacts": []
  },
  "landing": {
    "headline": "Join Us!",
    "subline": "Find your dream job.",
    "startButtonText": "Start"
  },
  "campus": {
    "headline": "Choose a Role",
    "subline": "What interests you?",
    "categories": []
  },
  "jobs": [
    {
      "id": "test-job",
      "title": "Test Position",
      "description": "A great role",
      "icon": "💼",
      "color": "#3b82f6",
      "tags": ["Tag1"],
      "pathModeId": "branching",
      "levels": [
        {
          "id": 1,
          "title": "Level 1",
          "status": "unlocked",
          "icon": "🏁",
          "row": 0,
          "nextLevelIds": [],
          "scenarios": [
            {
              "id": 1,
              "scenario": "Test question?",
              "imageUrl": "https://via.placeholder.com/800x600",
              "type": "single-select-correct",
              "options": [
                {
                  "id": 1,
                  "text": "Answer 1",
                  "correct": true,
                  "feedback": "Correct!"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "copy": {
    "checkChances": "Check Fit",
    "expressApply": "Apply Now",
    "jobMerken": "Save Job",
    "submit": "Submit",
    "submitSuccess": "Thanks!",
    "victoryHeadline": "Great!",
    "victorySubtext": "Well done!",
    "nudgeHeadline": "Honestly...",
    "nudgeText": "You're great!",
    "firstName": "Name?",
    "phoneType": "Phone type?",
    "schoolType": "School?",
    "android": "Android",
    "iphone": "iPhone",
    "realschule": "School A",
    "gymnasium": "School B",
    "andere": "Other",
    "expressApplyIntro": "Quick info!",
    "exploreOtherJobs": "Explore More"
  }
}
```

---

**Happy Config Creating! 🎉**
