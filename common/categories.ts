import type { ParentCategory, ParentCategoryCode } from '@/types'

export const INCOME_CATEGORIES: Record<ParentCategoryCode, ParentCategory> = {
  INC: {
    code: 'INC',
    label: 'Earned Income',
    subcategories: {
      INC_01: { code: 'INC_01', label: 'Salary & Wages' },
      INC_02: { code: 'INC_02', label: 'Freelance & Contract Work' }, // Freelance & Self-Employment
      INC_03: { code: 'INC_03', label: 'Business Income' },
      INC_04: { code: 'INC_04', label: 'Side Hustle & Gig Work' },
      INC_05: { code: 'INC_05', label: 'Bonuses & Commission' },
      INC_06: { code: 'INC_06', label: 'Miscellaneous' },
    },
  },

  PAS: {
    code: 'PAS',
    label: 'Passive Income',
    subcategories: {
      PAS_01: { code: 'PAS_01', label: 'Rental Income' },
      PAS_02: { code: 'PAS_02', label: 'Investment Income' },
      PAS_03: { code: 'PAS_03', label: 'Interest' },
      PAS_04: { code: 'PAS_04', label: 'Miscellaneous' },
    },
  },

  OTH: {
    code: 'OTH',
    label: 'Other Income',
    subcategories: {
      OTH_01: { code: 'OTH_01', label: 'Government Benefits' },
      OTH_02: { code: 'OTH_02', label: 'Pension & Retirement' },
      OTH_03: { code: 'OTH_03', label: 'Capital Gains' },
      OTH_04: { code: 'OTH_04', label: 'Tax Refund' },
      OTH_05: { code: 'OTH_05', label: 'Gifts' },
      OTH_06: { code: 'OTH_06', label: 'Miscellaneous' },
    },
  },

  TFI: {
    code: 'TFI',
    label: 'Transfers & Uncategorised',
    subcategories: {
      TFI_01: { code: 'TFI_01', label: 'Internal Transfer' },
      TFI_02: { code: 'TFI_02', label: 'Uncategorised' },
    },
  },
}

export const EXPENSE_CATEGORIES: Record<ParentCategoryCode, ParentCategory> = {
  HOU: {
    code: 'HOU',
    label: 'Housing & Utilities',
    subcategories: {
      HOU_01: { code: 'HOU_01', label: 'Rent & Mortgage' },
      HOU_02: { code: 'HOU_02', label: 'Utilities' }, // Electricity, Heating, Water, Gas, Recycling
      HOU_03: { code: 'HOU_03', label: 'Internet & Phone' },
      HOU_04: { code: 'HOU_04', label: 'Home Insurance' },
      HOU_05: { code: 'HOU_05', label: 'Maintenance & Repairs' },
      HOU_06: { code: 'HOU_06', label: 'Levies' },
      HOU_07: { code: 'HOU_07', label: 'Furniture & Appliances' },
      HOU_08: { code: 'HOU_08', label: 'Miscellaneous' },
    },
  },

  TRN: {
    code: 'TRN',
    label: 'Transport & Mobility',
    subcategories: {
      TRN_01: { code: 'TRN_01', label: 'Fuel & Petrol' },
      TRN_02: { code: 'TRN_02', label: 'Vehicle Insurance' },
      TRN_03: { code: 'TRN_03', label: 'Vehicle Maintenance' }, // Servicing, Repairs, MOT, etc.
      TRN_04: { code: 'TRN_04', label: 'Parking & Tolls' },
      TRN_05: { code: 'TRN_05', label: 'Public Transport' },
      TRN_06: { code: 'TRN_06', label: 'Ride-Sharing' }, // Uber, Lyft, etc.
      TRN_07: { code: 'TRN_07', label: 'Miscellaneous' },
    },
  },

  GRO: {
    code: 'GRO',
    label: 'Food & Groceries',
    subcategories: {
      GRO_01: { code: 'GRO_01', label: 'Groceries' },
      GRO_02: { code: 'GRO_02', label: 'Restaurants, Takeaways & Food Delivery' },
      GRO_03: { code: 'GRO_03', label: 'Coffee & Drinks' },
      GRO_04: { code: 'GRO_04', label: 'Work Lunches' },
      GRO_05: { code: 'GRO_05', label: 'Miscellaneous' },
    },
  },

  HLT: {
    code: 'HLT',
    label: 'Health & Medical',
    subcategories: {
      HLT_01: { code: 'HLT_01', label: 'Medical & Doctor Visits' },
      HLT_02: { code: 'HLT_02', label: 'Pharmacy & Medication' },
      HLT_03: { code: 'HLT_03', label: 'Gym & Fitness' },
      HLT_04: { code: 'HLT_04', label: 'Health Insurance' },
      HLT_05: { code: 'HLT_05', label: 'Mental Health & Therapy' },
      HLT_06: { code: 'HLT_06', label: 'Wellness & Spa' },
      HLT_07: { code: 'HLT_07', label: 'Miscellaneous' },
    },
  },

  FAM: {
    code: 'FAM',
    label: 'Family & Lifestyle',
    subcategories: {
      FAM_01: { code: 'FAM_01', label: 'Childcare & Education' },
      FAM_02: { code: 'FAM_02', label: 'Pet Care' },
      FAM_03: { code: 'FAM_03', label: 'Clothing & Apparel' },
      FAM_04: { code: 'FAM_04', label: 'Personal Care & Grooming' },
      FAM_05: { code: 'FAM_05', label: 'Subscriptions (Netflix, Spotify, etc.)' },
      FAM_06: { code: 'FAM_06', label: 'Entertainment & Leisure' },
      FAM_07: { code: 'FAM_07', label: 'Travel & Holidays' },
      FAM_08: { code: 'FAM_08', label: 'Gifts, Donations & Charities' },
      FAM_09: { code: 'FAM_09', label: 'Miscellaneous' },
    },
  },

  FIN: {
    code: 'FIN',
    label: 'Finance & Insurance',
    subcategories: {
      FIN_01: { code: 'FIN_01', label: 'Loan Repayments' },
      FIN_02: { code: 'FIN_02', label: 'Credit Card Payments' },
      FIN_03: { code: 'FIN_03', label: 'Insurance (Life, pension, disability, etc.)' },
      FIN_04: { code: 'FIN_04', label: 'Savings & Investments' },
      FIN_05: { code: 'FIN_05', label: 'Bank Fees & Interest' },
      FIN_06: { code: 'FIN_06', label: 'Tax Payments' },
      FIN_07: { code: 'FIN_07', label: 'Miscellaneous' },
    },
  },

  BUS: {
    code: 'BUS',
    label: 'Business & Work',
    subcategories: {
      BUS_01: { code: 'BUS_01', label: 'Office Equipment & Supplies' },
      BUS_02: { code: 'BUS_02', label: 'Workspace & Rent' },
      BUS_03: { code: 'BUS_03', label: 'Software & Tools' },
      BUS_04: { code: 'BUS_04', label: 'Marketing & Advertising' },
      BUS_05: { code: 'BUS_05', label: 'Professional Services (Accountant, legal, etc.)' },
      BUS_06: { code: 'BUS_06', label: 'Professional Development' },
      BUS_07: { code: 'BUS_07', label: 'Miscellaneous' },
    },
  },

  TFO: {
    code: 'TFO',
    label: 'Transfers & Uncategorised',
    subcategories: {
      TFO_01: { code: 'TFO_01', label: 'Internal Transfer' },
      TFO_02: { code: 'TFO_02', label: 'Uncategorised' },
    },
  },
}

export const ALL_CATEGORIES: Record<ParentCategoryCode, ParentCategory> = {
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
}

if (process.env.NODE_ENV === 'development') {
  const duplicateKeys = Object.keys(INCOME_CATEGORIES).filter((key) => Object.keys(EXPENSE_CATEGORIES).includes(key))

  if (duplicateKeys.length) {
    throw new Error(`Duplicate category keys detected, please fix! Duplicate keys: "${duplicateKeys.join(', ')}"`)
  }
}
