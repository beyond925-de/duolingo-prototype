# Company Configs Directory

Welcome to the multi-company configuration system! This directory contains all company-specific configurations for the Beyond925 platform.

## 📚 Documentation

Choose the guide that fits your needs:

### 👔 For Non-Technical Team Members

- **[QUICKSTART.md](./QUICKSTART.md)** ⭐ START HERE
  - Super simple step-by-step guide
  - No technical knowledge required
  - Takes 15-30 minutes

- **[README.md](./README.md)** 📖 Detailed Guide
  - Comprehensive instructions
  - Troubleshooting tips
  - Best practices for content

### 👨‍💻 For Developers

- **[INTEGRATION.md](./INTEGRATION.md)** 🔧 Technical Guide
  - How the system works
  - Integration options
  - Workflow and commands

- **[CONFIGURATION_SPEC.md](../CONFIGURATION_SPEC.md)** 📝 Specification
  - Complete config structure
  - All scenario types
  - Advanced features

## 📁 What's in This Directory?

```
configs/
├── INDEX.md              ← You are here!
├── QUICKSTART.md         ← Simple guide for non-developers
├── README.md             ← Detailed user guide
├── INTEGRATION.md        ← Developer integration guide
├── TEMPLATE.json         ← Copy this for new companies
├── schema.json           ← JSON validation schema
├── .validate-config.js   ← Validation script
│
└── sollich/              ← Example company
    └── config.json       ← Sollich configuration
```

## 🚀 Quick Actions

### I want to add a new company

→ Go to [QUICKSTART.md](./QUICKSTART.md)

### I want to edit an existing company

→ Edit the file: `configs/[company-name]/config.json`
→ Validate: `pnpm validate-config configs/[company-name]/config.json`
→ Submit via GitHub Pull Request

### I want to see an example

→ Look at: `configs/sollich/config.json`

### I want to understand how it works

→ Read: [INTEGRATION.md](./INTEGRATION.md)

## 🛠️ Developer Commands

```bash
# Validate a config file
pnpm validate-config configs/company-name/config.json

# Sync JSON config to TypeScript
pnpm sync-config company-name

# Sync all configs
pnpm sync-config all
```

## ✅ Validation

Every config is automatically validated for:

- ✅ Valid JSON syntax
- ✅ Required fields present
- ✅ Correct data types
- ✅ Hex color format
- ✅ Non-empty arrays

Validation happens:

1. **Locally** - Run `pnpm validate-config`
2. **GitHub Action** - Runs on every Pull Request
3. **Pre-commit** - Optional (can be set up)

## 📊 Current Companies

- **Sollich** - `configs/sollich/config.json` ✅

## 🎯 Goals of This System

1. **Enable non-developers** to create company configs
2. **Maintain quality** through automated validation
3. **Keep it simple** with JSON files
4. **Stay flexible** for future scaling

## 🔄 Workflow

```
Non-Developer               Developer              System
     │                          │                     │
     │ 1. Create JSON           │                     │
     │ ────────────────>        │                     │
     │                          │                     │
     │ 2. Submit PR             │                     │
     │ ─────────────────────────│─────────────────>   │
     │                          │                     │
     │                          │   3. Auto-Validate  │
     │                          │      <──────────────│
     │                          │                     │
     │                  4. Review & Merge             │
     │                          │                     │
     │                    5. Sync to App              │
     │                          │                     │
     └──────────────────────────┴─────────────────────┘
```

## 🆘 Support

### Something's not working?

1. Check the [Troubleshooting](./README.md#-troubleshooting) section
2. Validate your config: `pnpm validate-config your-file.json`
3. Look at the example: `configs/sollich/config.json`
4. Create an issue on GitHub

### Questions?

- Technical questions → [INTEGRATION.md](./INTEGRATION.md)
- Usage questions → [README.md](./README.md)
- Getting started → [QUICKSTART.md](./QUICKSTART.md)

---

**Choose your guide above and get started! 🎉**
