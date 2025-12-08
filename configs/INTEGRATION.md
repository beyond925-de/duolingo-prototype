# Integration Guide: How JSON Configs Work

This document explains how the JSON config system integrates with the Beyond925 application.

## 🎯 Overview

The multi-company config system allows non-technical team members to create company configurations using simple JSON files. These configs are then integrated into the Next.js application.

## 📁 File Structure

```
duolingo-mockup/
├── configs/                    # ← JSON configs directory
│   ├── README.md              # ← Instructions for non-technical users
│   ├── TEMPLATE.json          # ← Template for new companies
│   ├── schema.json            # ← JSON schema for validation
│   ├── .validate-config.js    # ← Validation script
│   └── sollich/
│       └── config.json        # ← Sollich company config (JSON)
│
├── app/
│   ├── config.ts              # ← Current config (TypeScript)
│   ├── configs/               # ← Auto-generated TS configs (future)
│   │   └── sollich.ts         # ← Generated from JSON
│   └── types.ts               # ← TypeScript types
│
├── lib/
│   └── config-loader.ts       # ← Dynamic config loader
│
└── scripts/
    └── sync-config.ts         # ← JSON → TypeScript converter
```

## 🔄 Workflow

### For Non-Technical Team Members (Your Co-founder)

1. **Create new company config**

   ```bash
   # Copy template
   cp configs/TEMPLATE.json configs/new-company/config.json

   # Edit the file
   # Fill in company details, jobs, copy, etc.
   ```

2. **Validate the config**

   ```bash
   node configs/.validate-config.js configs/new-company/config.json
   ```

3. **Commit via GitHub**
   - Create new file on GitHub web interface
   - Copy-paste from template
   - Fill in values
   - Commit → Create Pull Request
   - GitHub Action automatically validates

### For Developers (You)

1. **Review the PR**
   - Check the config looks good
   - GitHub Action will show if validation passed

2. **Sync to TypeScript** (Optional)

   ```bash
   pnpm sync-config new-company
   ```

   This creates `app/configs/new-company.ts`

3. **Use in the app**

   ```typescript
   import { loadCompanyConfig } from "@/lib/config-loader";

   const config = loadCompanyConfig("new-company");
   ```

## 🛠️ Available Commands

### Validate a Config

```bash
# Validate specific file
pnpm validate-config configs/sollich/config.json

# Or use Node directly
node configs/.validate-config.js configs/sollich/config.json
```

### Sync JSON to TypeScript

```bash
# Sync one company
pnpm sync-config sollich

# Sync all companies
pnpm sync-config all
```

## 🔍 Validation

### What Gets Validated?

1. **JSON Syntax**
   - Valid JSON structure
   - Proper quotes, commas, brackets

2. **Required Fields**
   - All required fields are present
   - Company name, colors, jobs array, etc.

3. **Format Checks**
   - Colors are hex format (`#FF5733`)
   - URLs are valid
   - Arrays are not empty where required

### GitHub Action

A GitHub Action automatically validates configs on every PR:

- Runs on any change to `configs/**/*.json`
- Comments on PR if validation fails
- Blocks merge until validation passes

## 🚀 Integration Options

### Option 1: Direct JSON Loading (Server-Side)

Use the config loader to load JSON files at runtime:

```typescript
// In a Server Component or API route
import { loadCompanyConfig } from '@/lib/config-loader';

export default function Page({ params }: { params: { company: string } }) {
  const config = loadCompanyConfig(params.company);

  return <div>{config.company.name}</div>;
}
```

**Pros:**

- Configs can be updated without rebuilding
- Non-developers can update configs
- Simple to implement

**Cons:**

- Requires file system access (Server Components only)
- Slight runtime overhead

### Option 2: Sync to TypeScript (Build-Time)

Convert JSON to TypeScript files:

```bash
pnpm sync-config all
```

Then import normally:

```typescript
import { sollichConfig } from '@/app/configs/sollich';

export default function Page() {
  return <div>{sollichConfig.company.name}</div>;
}
```

**Pros:**

- Type-safe at compile time
- No runtime overhead
- Works in Client Components

**Cons:**

- Requires rebuild after config changes
- Extra build step needed

### Option 3: Hybrid Approach (Recommended for Now)

Keep the existing `app/config.ts` for development, and use JSON configs for new companies:

```typescript
import { config } from '@/app/config'; // Default config
import { loadCompanyConfig } from '@/lib/config-loader';

export default function Page({ params }: { params: { company?: string } }) {
  const companyConfig = params.company
    ? loadCompanyConfig(params.company)
    : config;

  return <div>{companyConfig.company.name}</div>;
}
```

## 🔜 Future: Path-Based Routing

Eventually, you may want to implement path-based routing:

```
/                          → Default (Sollich)
/sollich                   → Sollich config
/bosch                     → Bosch config
/siemens                   → Siemens config
```

Implementation:

```typescript
// app/[company]/page.tsx
import { loadCompanyConfig, getAvailableCompanies } from '@/lib/config-loader';

export async function generateStaticParams() {
  return getAvailableCompanies().map(company => ({ company }));
}

export default function CompanyPage({ params }: { params: { company: string } }) {
  const config = loadCompanyConfig(params.company);

  return (
    // Your existing UI components
    <div>...</div>
  );
}
```

## 📝 Example: Adding a New Company

### 1. Co-founder Creates Config

```bash
# On GitHub web interface
1. Navigate to configs/
2. Click "Add file" → "Create new file"
3. Name: "bosch/config.json"
4. Copy content from TEMPLATE.json
5. Fill in Bosch details
6. Click "Propose changes"
```

### 2. Automatic Validation

GitHub Action runs and validates:

- ✅ JSON syntax is valid
- ✅ All required fields present
- ✅ Colors in hex format
- ✅ Jobs array not empty

### 3. You Review & Merge

```bash
# Merge PR on GitHub
# Then sync locally:
git pull
pnpm sync-config bosch

# Now you have:
# - configs/bosch/config.json (JSON)
# - app/configs/bosch.ts (TypeScript)
```

### 4. Use in App

```typescript
import { loadCompanyConfig } from "@/lib/config-loader";

const boschConfig = loadCompanyConfig("bosch");
```

## 🐛 Troubleshooting

### Config Not Loading

**Problem:** `Config not found for company: xyz`

**Solution:**

- Check file exists: `configs/xyz/config.json`
- Check filename is exactly `config.json`
- Check company ID matches folder name

### Validation Fails

**Problem:** JSON validation errors

**Solution:**

```bash
# Run validator locally to see detailed error
node configs/.validate-config.js configs/xyz/config.json

# Common fixes:
# - Missing comma between items
# - Extra comma after last item
# - Unclosed brackets
# - Color not in hex format
```

### TypeScript Sync Issues

**Problem:** `tsx ./scripts/sync-config.ts` fails

**Solution:**

```bash
# Make sure JSON is valid first
node configs/.validate-config.js configs/xyz/config.json

# Check permissions
ls -la scripts/sync-config.ts

# Try running with Node directly
tsx scripts/sync-config.ts xyz
```

## 🎓 Best Practices

1. **Always Validate First**

   ```bash
   pnpm validate-config configs/new-company/config.json
   ```

2. **Use Descriptive Commit Messages**

   ```
   ✅ Add config for Bosch
   ✅ Update Sollich landing page copy
   ❌ Update config
   ❌ Changes
   ```

3. **Test Locally Before PR**

   ```bash
   # Validate
   pnpm validate-config configs/new-company/config.json

   # Sync
   pnpm sync-config new-company

   # Test app
   pnpm dev
   ```

4. **Keep Configs Small**
   - If jobs array is huge, consider splitting into separate files
   - Use comments in JSON (if using JSONC)
   - Link to external image assets

5. **Version Control**
   - Commit JSON configs
   - Don't commit auto-generated TypeScript (or do, your choice)
   - Add `.gitignore` entry if needed:
     ```
     app/configs/*.ts
     !app/configs/index.ts
     ```

## 📚 Related Documentation

- [`README.md`](./README.md) - User guide for creating configs
- [`CONFIGURATION_SPEC.md`](../CONFIGURATION_SPEC.md) - Detailed config specification
- [`schema.json`](./schema.json) - JSON schema for validation

## 🤝 Support

Need help? Check:

1. Validation error messages
2. Example config: `configs/sollich/config.json`
3. Template: `configs/TEMPLATE.json`
4. Create an issue on GitHub

---

**Happy Integrating! 🚀**
