# Tax Categorization System - Implementation Guide

> **Goal**: Transform fstats into a tax helper tool for German freelancers by adding transaction categorization, EÜR (Einnahmenüberschussrechnung) compliance, and profit/loss reporting.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design Decisions](#design-decisions)
3. [Implementation Phases](#implementation-phases)
4. [Data Structures](#data-structures)
5. [File Structure](#file-structure)
6. [Categorization Engine](#categorization-engine)
7. [UI Components](#ui-components)
8. [EÜR Report Generation](#eür-report-generation)
9. [Tax Optimization Insights](#tax-optimization-insights)
10. [Testing Strategy](#testing-strategy)
11. [Future Enhancements](#future-enhancements)

---

## Architecture Overview

```
┌─────────────────┐
│   CSV Upload    │
└────────┬────────┘
         │
    ┌────▼─────────────────┐
    │  Parser              │  ← Extracts structure + bank hints
    │  (Bank-specific)     │
    └────┬─────────────────┘
         │
         ▼
  ParsedContentRow {
    date, description, value
    bankCategory?: string       ← Capitec provides this
    bankSubcategory?: string
    transactionType?: string    ← Comdirect provides this
  }
         │
    ┌────▼──────────────────┐
    │ Categorization Engine │  ← Uses all hints + rules
    │ (Bank-agnostic)       │
    └────┬──────────────────┘
         │
         ▼
  CategorizedTransaction {
    // Original fields
    ...ParsedContentRow

    // Tax categorization
    category: EuerCategory
    categorySource: 'auto' | 'user' | 'bank-hint'
    categoryConfidence: number
    taxDeductible: boolean
    taxDeductiblePercentage: number
    euerLine?: number
  }
         │
         ▼
  ┌──────────────┐
  │  IndexedDB   │
  └──────────────┘
```

---

## Design Decisions

### ✅ Separate Categorization Engine (NOT in Parser)

**Why:**
1. **Single Responsibility** - Parsers handle CSV structure, engine handles categorization
2. **Re-categorization** - Users can re-run categorization without re-parsing files
3. **Bank Agnostic** - Works regardless of bank's CSV format
4. **Iterative Improvement** - Can improve rules/AI without touching parsers
5. **Future-Proof** - Works with manual entries, bank APIs, receipt scanning

**Evidence:**
- **Capitec CSV** provides `Parent Category` and `Category` fields
- **Comdirect CSV** provides `Vorgang` (transaction type) but no categories
- Bank categories ≠ Tax categories (Capitec "Groceries" needs mapping to EÜR categories)

### ✅ Privacy-First Approach

**Rule-Based → User Corrections → Optional AI**

1. **Start**: Rule-based categorization (keyword/regex matching)
   - 80% accuracy
   - FREE
   - 100% client-side (privacy-preserving)

2. **Improve**: User corrections stored in IndexedDB
   - 90%+ accuracy after training
   - Learns user-specific patterns

3. **Optional**: AI embeddings (requires user consent)
   - 95%+ accuracy
   - Costs money (Google Gemini API)
   - Sends data externally (privacy trade-off)

### ✅ Inspired by Midday.ai Architecture

**Key Patterns Adopted:**
- Hierarchical category structure (Parent → Child categories)
- `manual` flag to track user vs. auto categorization
- Tax rate configuration per country and category
- Vector embeddings for semantic similarity (optional Phase 3)
- Frequency detection (weekly, monthly, annually, irregular)

**Reference:** https://github.com/midday-ai/midday

---

## Implementation Phases

### **Phase 1: Data Structure & Parser Updates** (Week 1-2)
**Goal:** Extend types and parsers to capture bank-provided hints

**Tasks:**
- [ ] Update `ParsedContentRow` type with new fields
- [ ] Update Capitec parser to extract bank categories
- [ ] Update Comdirect parser to extract transaction type
- [ ] Create `CategorizedTransaction` type
- [ ] Create EÜR category enums

**Files to Modify:**
- `types/stats-file.ts`
- `types-enums/index.ts`
- `utils/Parsers/Capitec/savings.ts`
- `utils/Parsers/Comdirect/giro.ts`

---

### **Phase 2: Categorization Engine** (Week 3-4)
**Goal:** Build rule-based categorization engine

**Tasks:**
- [ ] Create categorization rules (keyword/regex matching)
- [ ] Create bank category → EÜR mappings
- [ ] Build categorization engine orchestration
- [ ] Implement user correction storage
- [ ] Create EÜR line mappings

**Files to Create:**
```
utils/Categorization/
├── index.ts
├── engine.ts              # Main orchestration
├── rules.ts               # Keyword/regex rules
├── bank-mappings.ts       # Bank category → EÜR mapping
├── euer-mappings.ts       # EÜR category → line number
└── user-corrections.ts    # User pattern storage
```

---

### **Phase 3: Month/Year Grouping Utilities** (Week 5)
**Goal:** Add time-based grouping for reports

**Tasks:**
- [ ] Create date grouping utilities
- [ ] Add month/year/quarter fields to transactions
- [ ] Create aggregation functions

**Files to Create:**
```
utils/Grouping/
├── index.ts
├── date-grouping.ts       # Group by month/year/quarter
└── aggregations.ts        # Sum, average, etc.
```

---

### **Phase 4: Transaction Table UI** (Week 6-7)
**Goal:** Display transactions with inline category editing

**Tasks:**
- [ ] Create transaction table component (MUI Table)
- [ ] Add category selection dropdown
- [ ] Implement search/filter by category, date, description
- [ ] Add month grouping with collapsible sections
- [ ] Add pagination and sorting
- [ ] Color-code income (green) vs. expenses (red)

**Files to Create:**
```
app/stats/components/TransactionsTable/
├── index.tsx
├── actions.ts
├── styled.ts
└── components/
    ├── CategorySelect/
    │   ├── index.tsx
    │   └── styled.ts
    ├── CategoryBadge/
    │   ├── index.tsx
    │   └── styled.ts
    ├── TransactionRow/
    │   ├── index.tsx
    │   └── styled.ts
    └── MonthGroupHeader/
        ├── index.tsx
        └── styled.ts
```

---

### **Phase 5: EÜR Report Generation** (Week 8-9)
**Goal:** Generate profit & loss statement (Anlage EÜR)

**Tasks:**
- [ ] Create EÜR report component
- [ ] Calculate totals per EÜR category
- [ ] Calculate net profit (income - expenses)
- [ ] Apply tax deduction rules (gifts max €35, entertainment 70%)
- [ ] Add export to CSV/PDF for ELSTER
- [ ] Create tax rate calculator (14-42% progressive)
- [ ] Add trade tax calculation (threshold: €24,500)

**Files to Create:**
```
app/tax-report/
├── page.tsx
└── components/
    ├── EuerReport/
    │   ├── index.tsx
    │   ├── actions.ts
    │   └── components/
    │       ├── IncomeSection/
    │       ├── ExpenseSection/
    │       └── ProfitCalculation/
    └── ExportButtons/
        └── index.tsx
```

---

### **Phase 6: Tax Optimization Insights** (Week 10)
**Goal:** Provide actionable tax-saving suggestions

**Tasks:**
- [ ] Analyze spending patterns
- [ ] Compare against deduction limits
- [ ] Suggest tax-saving opportunities
- [ ] Calculate potential savings

**Files to Create:**
```
app/tax-report/components/TaxInsights/
├── index.tsx
├── suggestions.ts
└── components/
    └── InsightCard/
```

---

### **Phase 7 (Optional): AI Enhancement** (Week 11+)
**Goal:** Add AI-powered categorization for better accuracy

**Tasks:**
- [ ] Integrate Google Gemini API
- [ ] Generate category embeddings
- [ ] Implement vector similarity search
- [ ] Add user consent flow
- [ ] Store embeddings in IndexedDB

**Dependencies:**
```bash
pnpm add @google/generative-ai
```

**Files to Create:**
```
utils/Categorization/ai/
├── index.ts
├── gemini-client.ts
├── embeddings.ts
└── vector-search.ts
```

---

## Data Structures

### **1. Extended ParsedContentRow**

```typescript
// types/stats-file.ts
export type ParsedContentRow = {
  // Existing fields
  date: string
  description: string
  value: NumberBig

  // NEW: Bank-provided hints
  bankCategory?: string        // Capitec: "Food & Dining"
  bankSubcategory?: string     // Capitec: "Groceries"
  transactionType?: string     // Comdirect: "Lastschrift", "Überweisung"

  // NEW: Categorization (added by engine)
  category: EuerCategory
  categorySource: 'auto' | 'user' | 'bank-hint'
  categoryConfidence: number   // 0-1
  manual: boolean              // User manually set?

  // NEW: Tax metadata
  taxDeductible: boolean
  taxDeductiblePercentage: number  // 100, 70, 0
  euerLine?: number            // EÜR line number (42, 43, etc.)

  // NEW: Time grouping
  month: string                // 'YYYY-MM'
  year: string                 // 'YYYY'
  quarter: number              // 1-4

  // NEW: Enhanced metadata
  merchantName?: string        // Cleaned merchant name
  originalDescription?: string // Before cleaning
  frequency?: 'weekly' | 'monthly' | 'annually' | 'irregular' | 'unknown'

  // NEW: User annotations
  notes?: string
  tags?: string[]
}
```

### **2. EÜR Categories Enum**

```typescript
// types-enums/euer-categories.ts
export const EuerCategory = {
  // Income (Betriebseinnahmen)
  INCOME_OPERATING: 'income_operating',         // Line 11-14
  INCOME_SERVICES: 'income_services',
  INCOME_SALES: 'income_sales',

  // Expenses - Direct mapping to EÜR lines
  EXPENSE_GOODS_SOLD: 'expense_cogs',           // Line 27: Wareneinkauf
  EXPENSE_PERSONNEL: 'expense_personnel',       // Line 28: Löhne, Gehälter
  EXPENSE_RENT: 'expense_rent',                 // Line 42: Raumkosten
  EXPENSE_TELECOM: 'expense_telecom',           // Line 43: Telefon, Internet
  EXPENSE_TRAVEL: 'expense_travel',             // Line 44-45: Reisekosten
  EXPENSE_VEHICLE: 'expense_vehicle',           // Line 46: Kfz-Kosten
  EXPENSE_MARKETING: 'expense_marketing',       // Line 48: Werbung
  EXPENSE_INSURANCE: 'expense_insurance',       // Line 49: Versicherungen
  EXPENSE_OFFICE_SUPPLIES: 'expense_office',    // Line 46: Bürobedarf
  EXPENSE_SOFTWARE: 'expense_software',         // Line 46: Software
  EXPENSE_LEGAL: 'expense_legal',               // Line 46: Rechts/Steuerberatung
  EXPENSE_ACCOUNTING: 'expense_accounting',     // Line 46: Buchhaltung
  EXPENSE_TRAINING: 'expense_training',         // Line 52: Fortbildung
  EXPENSE_HOME_OFFICE: 'expense_home_office',   // Line 55: Häusliches Arbeitszimmer
  EXPENSE_BANK_FEES: 'expense_bank_fees',       // Line 46: Kontoführung
  EXPENSE_GIFTS: 'expense_gifts',               // Line 62: Geschenke (max €35)
  EXPENSE_ENTERTAINMENT: 'expense_entertainment', // Line 66: Bewirtung (70% deductible)
  EXPENSE_OTHER: 'expense_other',               // Line 46: Sonstige

  // Special
  UNCATEGORIZED: 'uncategorized',
  PERSONAL: 'personal',                         // Not tax deductible
} as const

export type EuerCategory = (typeof EuerCategory)[keyof typeof EuerCategory]
```

### **3. EÜR Line Mappings**

```typescript
// types-enums/euer-mappings.ts
export type EuerLineMapping = {
  line: number
  germanName: string
  deductiblePercentage: number
  maxAmount?: number      // For gifts (€35)
  notes?: string
}

export const EUER_LINE_MAPPINGS: Record<EuerCategory, EuerLineMapping> = {
  [EuerCategory.INCOME_OPERATING]: {
    line: 11,
    germanName: 'Betriebseinnahmen',
    deductiblePercentage: 100,
  },

  [EuerCategory.EXPENSE_GOODS_SOLD]: {
    line: 27,
    germanName: 'Wareneinkauf',
    deductiblePercentage: 100,
  },

  [EuerCategory.EXPENSE_PERSONNEL]: {
    line: 28,
    germanName: 'Löhne und Gehälter',
    deductiblePercentage: 100,
  },

  [EuerCategory.EXPENSE_RENT]: {
    line: 42,
    germanName: 'Raumkosten',
    deductiblePercentage: 100,
  },

  [EuerCategory.EXPENSE_TELECOM]: {
    line: 43,
    germanName: 'Telekommunikation (Telefon, Internet)',
    deductiblePercentage: 100,
  },

  [EuerCategory.EXPENSE_TRAVEL]: {
    line: 44,
    germanName: 'Reisekosten (Fahrt, Übernachtung)',
    deductiblePercentage: 100,
  },

  [EuerCategory.EXPENSE_TRAINING]: {
    line: 52,
    germanName: 'Fortbildungskosten',
    deductiblePercentage: 100,
  },

  [EuerCategory.EXPENSE_HOME_OFFICE]: {
    line: 55,
    germanName: 'Häusliches Arbeitszimmer',
    deductiblePercentage: 100,
    notes: 'Fully deductible if exclusive workspace',
  },

  [EuerCategory.EXPENSE_GIFTS]: {
    line: 62,
    germanName: 'Geschenke',
    deductiblePercentage: 100,
    maxAmount: 35,
    notes: 'Max €35 per gift. Gifts over €35 are not deductible.',
  },

  [EuerCategory.EXPENSE_ENTERTAINMENT]: {
    line: 66,
    germanName: 'Bewirtungskosten',
    deductiblePercentage: 70,
    notes: '70% of entertainment expenses are deductible',
  },

  [EuerCategory.PERSONAL]: {
    line: 0,
    germanName: 'Privat (nicht abzugsfähig)',
    deductiblePercentage: 0,
  },

  // ... more mappings
}
```

### **4. User Correction Storage**

```typescript
// types/categorization.ts
export type UserCorrectionPattern = {
  id: string
  merchantPattern: string     // Regex or exact match
  category: EuerCategory
  confidence: number
  correctedAt: DateTimeString
  transactionCount: number    // How many times applied
}

export type CategoryEmbedding = {
  category: EuerCategory
  germanName: string
  englishName: string
  embedding?: number[]        // 768-dim vector (Phase 3)
  keywords: string[]          // For rule-based
  examples: string[]          // Example merchant names
  color: string               // For UI
}
```

---

## File Structure

### **New Files to Create**

```
/Users/cornelius/projects/cw-fstats/

├── types-enums/
│   └── euer-categories.ts       # ✨ NEW: EÜR category definitions
│
├── types/
│   ├── categorization.ts        # ✨ NEW: Categorization types
│   └── stats-file.ts            # 🔧 MODIFY: Add new fields to ParsedContentRow
│
├── utils/
│   ├── Categorization/          # ✨ NEW: Categorization engine
│   │   ├── index.ts
│   │   ├── engine.ts
│   │   ├── rules.ts
│   │   ├── bank-mappings.ts
│   │   ├── euer-mappings.ts
│   │   ├── user-corrections.ts
│   │   └── ai/                  # Phase 3 (optional)
│   │       ├── index.ts
│   │       ├── gemini-client.ts
│   │       ├── embeddings.ts
│   │       └── vector-search.ts
│   │
│   ├── Grouping/                # ✨ NEW: Time-based grouping
│   │   ├── index.ts
│   │   ├── date-grouping.ts
│   │   └── aggregations.ts
│   │
│   ├── TaxCalculations/         # ✨ NEW: Tax calculations
│   │   ├── index.ts
│   │   ├── euer-calculator.ts
│   │   ├── tax-rates.ts
│   │   └── deduction-limits.ts
│   │
│   └── Parsers/
│       ├── Capitec/
│       │   └── savings.ts       # 🔧 MODIFY: Extract bank categories
│       └── Comdirect/
│           └── giro.ts          # 🔧 MODIFY: Extract transaction type
│
├── app/
│   ├── stats/
│   │   └── components/
│   │       └── TransactionsTable/  # ✨ NEW: Transaction table
│   │           ├── index.tsx
│   │           ├── actions.ts
│   │           ├── styled.ts
│   │           └── components/
│   │               ├── CategorySelect/
│   │               ├── CategoryBadge/
│   │               ├── TransactionRow/
│   │               └── MonthGroupHeader/
│   │
│   └── tax-report/              # ✨ NEW: Tax reporting page
│       ├── page.tsx
│       └── components/
│           ├── EuerReport/
│           │   ├── index.tsx
│           │   ├── actions.ts
│           │   └── components/
│           │       ├── IncomeSection/
│           │       ├── ExpenseSection/
│           │       └── ProfitCalculation/
│           ├── TaxInsights/
│           │   ├── index.tsx
│           │   ├── suggestions.ts
│           │   └── components/
│           │       └── InsightCard/
│           └── ExportButtons/
│               └── index.tsx
│
└── TAX_CATEGORIZATION_IMPLEMENTATION.md  # This file
```

---

## Categorization Engine

### **Architecture**

```typescript
// utils/Categorization/engine.ts
export function categorizeTransaction(
  transaction: ParsedContentRow,
  userPatterns?: UserCorrectionPattern[]
): CategorizedTransaction {

  // Priority 1: User corrections (highest priority)
  const userMatch = checkUserPatterns(transaction.description, userPatterns)
  if (userMatch) {
    return {
      ...transaction,
      category: userMatch.category,
      categorySource: 'user',
      categoryConfidence: 1.0,
      manual: true,
    }
  }

  // Priority 2: Bank category hints (if available)
  if (transaction.bankCategory) {
    const mappedCategory = mapBankCategoryToEuer(
      transaction.bankCategory,
      transaction.bankSubcategory
    )
    if (mappedCategory) {
      return {
        ...transaction,
        category: mappedCategory,
        categorySource: 'bank-hint',
        categoryConfidence: 0.8,
      }
    }
  }

  // Priority 3: Transaction type hints (Comdirect)
  if (transaction.transactionType) {
    const typeHint = applyTransactionTypeHints(
      transaction.transactionType,
      transaction.description
    )
    if (typeHint) {
      return {
        ...transaction,
        category: typeHint.category,
        categorySource: 'auto',
        categoryConfidence: typeHint.confidence,
      }
    }
  }

  // Priority 4: Description-based rules (regex/keyword matching)
  const ruleMatch = applyCategorizationRules(transaction.description)
  if (ruleMatch) {
    return {
      ...transaction,
      category: ruleMatch.category,
      categorySource: 'auto',
      categoryConfidence: ruleMatch.confidence,
    }
  }

  // Fallback: Uncategorized
  return {
    ...transaction,
    category: EuerCategory.UNCATEGORIZED,
    categorySource: 'auto',
    categoryConfidence: 0,
    manual: false,
  }
}
```

### **Categorization Rules Example**

```typescript
// utils/Categorization/rules.ts
export const CATEGORIZATION_RULES: Record<EuerCategory, RegExp[]> = {
  [EuerCategory.EXPENSE_TELECOM]: [
    /vodafone/i,
    /telekom/i,
    /o2[\s-]|o2$/i,
    /1&1|1und1/i,
    /mobilcom/i,
    /congstar/i,
  ],

  [EuerCategory.EXPENSE_TRAVEL]: [
    /db\s*(bahn|regio)/i,
    /lufthansa/i,
    /ryanair/i,
    /booking\.com/i,
    /airbnb/i,
    /hotel/i,
    /flixbus/i,
  ],

  [EuerCategory.EXPENSE_OFFICE_SUPPLIES]: [
    /amazon.*büro/i,
    /staples/i,
    /office\s*depot/i,
    /viking/i,
    /printus/i,
  ],

  [EuerCategory.EXPENSE_SOFTWARE]: [
    /github/i,
    /vercel/i,
    /aws|amazon\s*web\s*services/i,
    /google\s*cloud/i,
    /microsoft\s*365/i,
    /adobe/i,
    /jetbrains/i,
  ],

  [EuerCategory.EXPENSE_INSURANCE]: [
    /dak[\s-]gesundheit/i,
    /tk\s*techniker/i,
    /aok/i,
    /barmer/i,
    /versicherung/i,
  ],

  [EuerCategory.EXPENSE_BANK_FEES]: [
    /kontoführung/i,
    /entgelt\s*girokonto/i,
    /visa.*gebühr/i,
    /mastercard.*gebühr/i,
  ],

  [EuerCategory.EXPENSE_RENT]: [
    /miete/i,
    /kaltmiete/i,
    /nebenkosten/i,
  ],

  [EuerCategory.INCOME_OPERATING]: [
    /rechnung|invoice/i,
    /honorar/i,
    /überweisung.*projekt/i,
  ],

  // ... more rules
}
```

### **Bank Category Mappings**

```typescript
// utils/Categorization/bank-mappings.ts

// Capitec → EÜR mapping
export const CAPITEC_TO_EUER: Record<string, EuerCategory | null> = {
  // Income
  'Income': EuerCategory.INCOME_OPERATING,
  'Deposits': EuerCategory.INCOME_OPERATING,

  // Expenses
  'Food & Dining': EuerCategory.PERSONAL,
  'Shopping': EuerCategory.PERSONAL,
  'Groceries': EuerCategory.PERSONAL,
  'Bills & Utilities': EuerCategory.EXPENSE_TELECOM,  // May need refinement
  'Auto & Transport': EuerCategory.EXPENSE_VEHICLE,
  'Travel': EuerCategory.EXPENSE_TRAVEL,
  'Health & Fitness': EuerCategory.EXPENSE_INSURANCE,
  'Entertainment': EuerCategory.PERSONAL,
  'Home': EuerCategory.EXPENSE_RENT,
  'Fees & Charges': EuerCategory.EXPENSE_BANK_FEES,

  // Ambiguous (need description analysis)
  'Business Services': null,  // Check description
  'Other': null,
}

// Comdirect transaction type hints
export const COMDIRECT_TYPE_HINTS: Record<
  string,
  (description: string) => { category: EuerCategory; confidence: number } | null
> = {
  'Lastschrift': (desc) => {
    // Insurance
    if (/DAK|TK|AOK|Barmer|versicherung/i.test(desc)) {
      return { category: EuerCategory.EXPENSE_INSURANCE, confidence: 0.9 }
    }
    // Telecom
    if (/Vodafone|Telekom|O2|1&1/i.test(desc)) {
      return { category: EuerCategory.EXPENSE_TELECOM, confidence: 0.9 }
    }
    return null
  },

  'Kontoführungsentgelt': () => {
    return { category: EuerCategory.EXPENSE_BANK_FEES, confidence: 1.0 }
  },

  'Übertrag / Überweisung': (desc) => {
    // Income from client
    if (/Rechnung|Re\.|Invoice|Honorar/i.test(desc)) {
      return { category: EuerCategory.INCOME_OPERATING, confidence: 0.8 }
    }
    // Rent payment
    if (/Miete|Kaltmiete/i.test(desc)) {
      return { category: EuerCategory.EXPENSE_RENT, confidence: 0.9 }
    }
    return null
  },
}
```

---

## UI Components

### **TransactionsTable Component**

```typescript
// app/stats/components/TransactionsTable/index.tsx
'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
} from '@mui/material'

import type { ParsedContentRow } from '@/types'
import { EuerCategory } from '@/types-enums'

import { CategorySelect } from './components/CategorySelect'
import { MonthGroupHeader } from './components/MonthGroupHeader'
import { groupByMonth } from './actions'

type TransactionsTableProps = {
  transactions: ParsedContentRow[]
  onCategoryChange: (transactionId: string, category: EuerCategory) => void
}

const Component = ({ transactions, onCategoryChange }: TransactionsTableProps) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  const groupedTransactions = groupByMonth(transactions)

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedTransactions).map(([month, txns]) => (
              <>
                <MonthGroupHeader key={`header-${month}`} month={month} />
                {txns.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.date}</TableCell>
                    <TableCell>{txn.description}</TableCell>
                    <TableCell>
                      <CategorySelect
                        value={txn.category}
                        onChange={(cat) => onCategoryChange(txn.id, cat)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={txn.value.toFixed(2)}
                        color={txn.value.gte(0) ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value))}
      />
    </Paper>
  )
}

export default Component
```

---

## EÜR Report Generation

### **Report Calculation Logic**

```typescript
// utils/TaxCalculations/euer-calculator.ts
import { Big } from '@/lib/w-big'
import type { ParsedContentRow } from '@/types'
import { EuerCategory, EUER_LINE_MAPPINGS } from '@/types-enums'

export type EuerReportData = {
  year: string

  // Income
  totalIncome: Big
  incomeByCategory: Record<string, Big>

  // Expenses
  totalExpenses: Big
  expensesByCategory: Record<string, Big>
  expensesByEuerLine: Record<number, {
    line: number
    name: string
    amount: Big
    deductibleAmount: Big
  }>

  // Profit
  grossProfit: Big
  netProfit: Big

  // Tax estimates
  incomeTaxEstimate: Big
  tradeTaxEstimate: Big
  totalTaxEstimate: Big
}

export function calculateEuerReport(
  transactions: ParsedContentRow[],
  year: string
): EuerReportData {
  const yearTransactions = transactions.filter(t => t.year === year)

  // Calculate income
  const incomeTransactions = yearTransactions.filter(t => t.value.gt(0))
  const totalIncome = incomeTransactions.reduce(
    (sum, t) => sum.plus(t.value),
    Big(0)
  )

  // Calculate expenses by EÜR line
  const expensesByEuerLine: Record<number, any> = {}

  yearTransactions
    .filter(t => t.value.lt(0) && t.category !== EuerCategory.PERSONAL)
    .forEach(t => {
      const mapping = EUER_LINE_MAPPINGS[t.category]
      if (!mapping) return

      const absAmount = t.value.abs()
      const deductibleAmount = absAmount.times(mapping.deductiblePercentage / 100)

      if (!expensesByEuerLine[mapping.line]) {
        expensesByEuerLine[mapping.line] = {
          line: mapping.line,
          name: mapping.germanName,
          amount: Big(0),
          deductibleAmount: Big(0),
        }
      }

      expensesByEuerLine[mapping.line].amount =
        expensesByEuerLine[mapping.line].amount.plus(absAmount)
      expensesByEuerLine[mapping.line].deductibleAmount =
        expensesByEuerLine[mapping.line].deductibleAmount.plus(deductibleAmount)
    })

  const totalExpenses = Object.values(expensesByEuerLine).reduce(
    (sum, line) => sum.plus(line.deductibleAmount),
    Big(0)
  )

  const netProfit = totalIncome.minus(totalExpenses)

  // Tax calculations
  const incomeTaxEstimate = calculateIncomeTax(netProfit)
  const tradeTaxEstimate = calculateTradeTax(netProfit)

  return {
    year,
    totalIncome,
    totalExpenses,
    expensesByEuerLine,
    grossProfit: netProfit,
    netProfit: netProfit.minus(incomeTaxEstimate).minus(tradeTaxEstimate),
    incomeTaxEstimate,
    tradeTaxEstimate,
    totalTaxEstimate: incomeTaxEstimate.plus(tradeTaxEstimate),
  }
}

// German tax brackets (2026)
function calculateIncomeTax(profit: Big): Big {
  const taxableIncome = profit.minus(12348) // Tax-free allowance

  if (taxableIncome.lte(0)) return Big(0)

  // Simplified progressive tax calculation
  // Real formula is more complex: https://www.bmf-steuerrechner.de/

  const amount = taxableIncome.toNumber()

  if (amount <= 11604) return Big(0)
  if (amount <= 17005) {
    // 14% - 23.97%
    const y = (amount - 11604) / 10000
    return Big((922.98 * y + 1400) * y)
  }
  if (amount <= 66760) {
    // 23.97% - 42%
    const z = (amount - 17005) / 10000
    return Big((181.19 * z + 2397) * z + 1025.38)
  }
  if (amount <= 277825) {
    // 42%
    return Big(amount * 0.42 - 10602.13)
  }
  // 45% (top rate)
  return Big(amount * 0.45 - 18936.88)
}

// Trade tax (Gewerbesteuer)
function calculateTradeTax(profit: Big): Big {
  const threshold = Big(24500) // 2026 allowance

  if (profit.lte(threshold)) return Big(0)

  const taxableAmount = profit.minus(threshold)
  // Average rate ~14-15% (depends on municipality)
  return taxableAmount.times(0.14)
}
```

---

## Tax Optimization Insights

### **Suggestion Engine**

```typescript
// app/tax-report/components/TaxInsights/suggestions.ts
import { Big } from '@/lib/w-big'
import type { ParsedContentRow } from '@/types'
import { EuerCategory } from '@/types-enums'

export type TaxInsight = {
  id: string
  type: 'warning' | 'info' | 'success'
  category: EuerCategory
  title: string
  description: string
  potentialSaving?: Big
  action?: string
}

export function generateTaxInsights(
  transactions: ParsedContentRow[],
  year: string
): TaxInsight[] {
  const insights: TaxInsight[] = []
  const yearTransactions = transactions.filter(t => t.year === year)

  // Training expenses suggestion
  const trainingExpenses = yearTransactions
    .filter(t => t.category === EuerCategory.EXPENSE_TRAINING)
    .reduce((sum, t) => sum.plus(t.value.abs()), Big(0))

  const maxTraining = Big(2000) // Example limit
  if (trainingExpenses.lt(maxTraining)) {
    const remaining = maxTraining.minus(trainingExpenses)
    insights.push({
      id: 'training-remaining',
      type: 'info',
      category: EuerCategory.EXPENSE_TRAINING,
      title: 'Professional Development Budget Available',
      description: `You've spent €${trainingExpenses.toFixed(2)} on training. You can still deduct €${remaining.toFixed(2)} more for courses, conferences, or certifications.`,
      potentialSaving: remaining.times(0.42), // Assume 42% tax rate
      action: 'Consider investing in professional development before year-end',
    })
  }

  // Home office suggestion
  const homeOfficeExpenses = yearTransactions
    .filter(t => t.category === EuerCategory.EXPENSE_HOME_OFFICE)
    .reduce((sum, t) => sum.plus(t.value.abs()), Big(0))

  if (homeOfficeExpenses.eq(0)) {
    insights.push({
      id: 'home-office-missing',
      type: 'warning',
      category: EuerCategory.EXPENSE_HOME_OFFICE,
      title: 'No Home Office Expenses Claimed',
      description: 'If you work from home in a dedicated workspace, you can deduct rent, utilities, and office costs proportionally.',
      potentialSaving: Big(1200 * 0.42), // Example: €1200/year at 42% tax
      action: 'Calculate your home office square meters and claim deduction',
    })
  }

  // Gift expenses over limit
  const giftExpenses = yearTransactions
    .filter(t => t.category === EuerCategory.EXPENSE_GIFTS)

  giftExpenses.forEach(gift => {
    if (gift.value.abs().gt(35)) {
      insights.push({
        id: `gift-over-limit-${gift.id}`,
        type: 'warning',
        category: EuerCategory.EXPENSE_GIFTS,
        title: 'Gift Exceeds Deduction Limit',
        description: `Gift of €${gift.value.abs().toFixed(2)} exceeds the €35 limit. Only €35 is deductible per gift per person per year.`,
        action: 'Review this transaction',
      })
    }
  })

  // Trade tax threshold
  const netProfit = calculateNetProfit(yearTransactions)
  const tradeTaxThreshold = Big(24500)

  if (netProfit.gt(tradeTaxThreshold) && netProfit.lt(tradeTaxThreshold.plus(5000))) {
    const excess = netProfit.minus(tradeTaxThreshold)
    insights.push({
      id: 'trade-tax-threshold',
      type: 'warning',
      category: EuerCategory.EXPENSE_OTHER,
      title: 'Close to Trade Tax Threshold',
      description: `Your profit (€${netProfit.toFixed(2)}) exceeds the trade tax threshold by €${excess.toFixed(2)}. Consider if you can move some income/expenses to avoid trade tax.`,
      potentialSaving: excess.times(0.14), // ~14% trade tax
      action: 'Review timing of invoices and expenses',
    })
  }

  return insights
}
```

---

## Testing Strategy

### **Unit Tests**

```typescript
// utils/Categorization/__tests__/engine.test.ts
import { describe, it, expect } from 'vitest'
import { categorizeTransaction } from '../engine'
import { EuerCategory } from '@/types-enums'

describe('Categorization Engine', () => {
  it('should categorize Vodafone as EXPENSE_TELECOM', () => {
    const transaction = {
      date: '01/01/2025',
      description: 'Vodafone GmbH Mobilfunk',
      value: Big(-29.99),
    }

    const result = categorizeTransaction(transaction)

    expect(result.category).toBe(EuerCategory.EXPENSE_TELECOM)
    expect(result.categorySource).toBe('auto')
    expect(result.categoryConfidence).toBeGreaterThan(0.8)
  })

  it('should respect user corrections', () => {
    const transaction = {
      date: '01/01/2025',
      description: 'Amazon Bestellung',
      value: Big(-50.00),
    }

    const userPatterns = [{
      merchantPattern: 'Amazon',
      category: EuerCategory.EXPENSE_OFFICE_SUPPLIES,
      confidence: 1.0,
    }]

    const result = categorizeTransaction(transaction, userPatterns)

    expect(result.category).toBe(EuerCategory.EXPENSE_OFFICE_SUPPLIES)
    expect(result.categorySource).toBe('user')
    expect(result.manual).toBe(true)
  })

  it('should use bank category hints', () => {
    const transaction = {
      date: '01/01/2025',
      description: 'DB Bahn Ticket',
      value: Big(-120.50),
      bankCategory: 'Travel',
    }

    const result = categorizeTransaction(transaction)

    expect(result.category).toBe(EuerCategory.EXPENSE_TRAVEL)
    expect(result.categorySource).toBe('bank-hint')
  })
})
```

### **Integration Tests**

```typescript
// utils/TaxCalculations/__tests__/euer-calculator.test.ts
import { describe, it, expect } from 'vitest'
import { calculateEuerReport } from '../euer-calculator'
import { EuerCategory } from '@/types-enums'

describe('EÜR Calculator', () => {
  it('should calculate correct net profit', () => {
    const transactions = [
      {
        date: '01/01/2025',
        description: 'Invoice #1',
        value: Big(5000),
        category: EuerCategory.INCOME_OPERATING,
        year: '2025',
      },
      {
        date: '15/01/2025',
        description: 'Office rent',
        value: Big(-1000),
        category: EuerCategory.EXPENSE_RENT,
        year: '2025',
      },
      {
        date: '20/01/2025',
        description: 'Software subscription',
        value: Big(-200),
        category: EuerCategory.EXPENSE_SOFTWARE,
        year: '2025',
      },
    ]

    const report = calculateEuerReport(transactions, '2025')

    expect(report.totalIncome.toNumber()).toBe(5000)
    expect(report.totalExpenses.toNumber()).toBe(1200)
    expect(report.grossProfit.toNumber()).toBe(3800)
  })

  it('should apply deduction limits for gifts', () => {
    const transactions = [
      {
        date: '01/01/2025',
        description: 'Client gift',
        value: Big(-50),
        category: EuerCategory.EXPENSE_GIFTS,
        year: '2025',
      },
    ]

    const report = calculateEuerReport(transactions, '2025')

    // Only €35 should be deductible
    expect(
      report.expensesByEuerLine[62].deductibleAmount.toNumber()
    ).toBe(35)
  })

  it('should apply 70% deduction for entertainment', () => {
    const transactions = [
      {
        date: '01/01/2025',
        description: 'Client dinner',
        value: Big(-100),
        category: EuerCategory.EXPENSE_ENTERTAINMENT,
        year: '2025',
      },
    ]

    const report = calculateEuerReport(transactions, '2025')

    // 70% deductible
    expect(
      report.expensesByEuerLine[66].deductibleAmount.toNumber()
    ).toBe(70)
  })
})
```

---

## Future Enhancements

### **Phase 8+: Advanced Features**

1. **Multi-Year Comparison**
   - Compare income/expenses across years
   - Trend analysis
   - Growth metrics

2. **Receipt Scanning (OCR)**
   - Upload receipt photos
   - Extract amount, merchant, date
   - Auto-match to transactions

3. **Bank API Integration**
   - Connect directly to banks (Plaid, GoCardLess)
   - Real-time transaction sync
   - No CSV uploads needed

4. **Accountant Export**
   - ELSTER-compatible XML export
   - DATEV format support
   - Direct integration with tax software

5. **Budget Planning**
   - Set category budgets
   - Alert when exceeding
   - Forecast next year's taxes

6. **VAT Handling (USt)**
   - Track VAT collected (19%, 7%)
   - Track VAT paid (Vorsteuer)
   - Quarterly VAT reports (Umsatzsteuervoranmeldung)

7. **Invoice Matching**
   - Match invoices to bank transactions
   - Track outstanding payments
   - Payment reminders

8. **Multi-Currency Support**
   - Handle foreign currency transactions
   - EUR conversion tracking
   - FX gain/loss calculations

---

## Dependencies to Add

```bash
# Phase 1-6 (Core functionality)
pnpm add jspdf jspdf-autotable    # PDF export for EÜR
pnpm add xlsx                     # Excel export

# Phase 7 (Optional AI)
pnpm add @google/generative-ai    # Google Gemini embeddings

# Phase 8+ (Future)
pnpm add tesseract.js             # OCR for receipt scanning
pnpm add plaid                    # Bank API integration (US/Canada)
pnpm add nordigen-node            # GoCardLess (EU) bank integration
```

---

## Key Resources

### **German Tax Information**
- [Anlage EÜR Official Form](https://www.elster.de/eportal/formulare-leistungen/alleformulare/euer)
- [EÜR Guide 2026](https://norman.finance/blog/einnahmenueberschussrechnung-vorlage)
- [Freelancer Tax Guide](https://www.jobbers.io/the-complete-german-freelancer-tax-calculator-guide-2025/)
- [Tax Calculator](https://www.bmf-steuerrechner.de/)

### **Transaction Categorization**
- [Midday.ai Repository](https://github.com/midday-ai/midday)
- [BankTextCategorizer (Open Source)](https://github.com/j-convey/BankTextCategorizer)
- [Transaction Categorization Guide](https://planky.com/blog/product/transaction-categorization-engine-how-is-it-made)

### **Technical Documentation**
- [Google Gemini Embeddings](https://ai.google.dev/gemini-api/docs/embeddings)
- [MUI Table Documentation](https://mui.com/material-ui/react-table/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

---

## Success Metrics

### **Phase 1-2 Success Criteria**
- ✅ 80%+ automatic categorization accuracy
- ✅ All parsers extract bank hints
- ✅ Users can manually correct categories
- ✅ Corrections stored and reused

### **Phase 4 Success Criteria**
- ✅ Transaction table shows all data
- ✅ Month grouping works
- ✅ Category editing is intuitive
- ✅ Search/filter performs well

### **Phase 5 Success Criteria**
- ✅ EÜR report matches manual calculations
- ✅ All deduction rules applied correctly
- ✅ Tax estimation within ±5% of actual
- ✅ Export works for ELSTER import

### **Phase 6 Success Criteria**
- ✅ Insights are actionable
- ✅ Savings estimates are accurate
- ✅ Users act on at least 30% of suggestions

---

## Notes

- **Privacy First**: All categorization happens client-side by default
- **German Focus**: Built specifically for EÜR (German freelancer tax)
- **Incremental**: Can be built phase by phase
- **Midday-Inspired**: Based on proven production architecture
- **Open Source**: All code remains MIT licensed

---

## Getting Started

To begin implementation:

1. **Read this document thoroughly**
2. **Start with Phase 1** (data structures)
3. **Follow the file structure** outlined above
4. **Test each phase** before moving to the next
5. **Iterate based on user feedback**

For questions or clarifications, refer to:
- `.claude/CLAUDE.md` - Project architecture guide
- This document - Tax categorization roadmap
- Midday repository - Production reference

---

**Last Updated:** 2026-02-07
**Status:** Planning Phase
**Next Step:** Begin Phase 1 - Data Structure & Parser Updates
