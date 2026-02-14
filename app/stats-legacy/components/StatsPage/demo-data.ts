import { green, red } from '@mui/material/colors'
import type { ChartData, ChartDataset } from 'chart.js'

import { getGradient } from '@/utils/Misc'

import { calculateBarThickness } from './actions'

export type ProfitLossData = {
  totalIncome: number
  totalExpenses: number
  profit: number
  taxDeductibleExpenses: number
  estimatedTax: number
  taxRate: number
}

export type OptimizationInsight = {
  category: string
  currentSpend: number
  potentialIncrease: number
  taxSavings: number
  description: string
  priority: 'high' | 'medium' | 'low'
}

export type TransactionRow = {
  id: string
  date: string
  description: string
  amount: number
  category: string
  status: 'verified' | 'needs-review' | 'categorized'
  taxDeductible: boolean
}

// Demo Profit/Loss Data (calculated from DEMO_TRANSACTIONS - Carpenter Business Jan-Jun 2026)
export const DEMO_PROFIT_LOSS: ProfitLossData = {
  totalIncome: 72500.0, // Sum of all client payments (furniture, renovations, custom work)
  totalExpenses: 15250.5, // Sum of all expenses: workshop rent, materials, tools, vehicle costs
  profit: 57249.5, // 72500 - 15250.5
  taxDeductibleExpenses: 15250.5,
  estimatedTax: 12480.39, // 57249.5 * 0.218
  taxRate: 21.8,
}

// Demo Tax Optimization Insights - Carpenter Business
export const DEMO_TAX_INSIGHTS: OptimizationInsight[] = [
  {
    category: 'Vehicle & Transport',
    currentSpend: 425.5,
    potentialIncrease: 2400,
    taxSavings: 430.4,
    description: 'Track all business mileage and vehicle expenses. Full deduction available for business use.',
    priority: 'high',
  },
  {
    category: 'Professional Training',
    currentSpend: 0,
    potentialIncrease: 800,
    taxSavings: 174.4,
    description: 'Safety certifications and carpentry courses are fully deductible professional development.',
    priority: 'high',
  },
  {
    category: 'Tool & Equipment',
    currentSpend: 500,
    potentialIncrease: 2000,
    taxSavings: 327.0,
    description: 'Additional power tools and equipment purchases can significantly reduce your tax burden.',
    priority: 'medium',
  },
  {
    category: 'Workshop Improvements',
    currentSpend: 0,
    potentialIncrease: 1500,
    taxSavings: 327.0,
    description: 'Upgrades to workshop lighting, ventilation and/or storage solutions are deductible.',
    priority: 'medium',
  },
]

// Demo Transactions - 6 Months (January-June 2026) - Carpenter Business
export const DEMO_TRANSACTIONS: TransactionRow[] = [
  // January 2026
  {
    id: '1',
    date: '2026-01-05',
    description: 'Workshop Rent - January',
    amount: -650.0,
    category: 'Office & Rent',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '2',
    date: '2026-01-08',
    description: 'Client Payment - Custom Kitchen Cabinets',
    amount: 4200.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '3',
    date: '2026-01-10',
    description: 'Wood & Materials - Supplier',
    amount: -850.0,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '4',
    date: '2026-01-12',
    description: 'Professional Insurance - Quarterly',
    amount: -280.0,
    category: 'Professional Fees',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '5',
    date: '2026-01-15',
    description: 'Power Tools - Makita Drill Set',
    amount: -320.0,
    category: 'Equipment',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '6',
    date: '2026-01-18',
    description: 'Client Payment - Wooden Dining Table',
    amount: 2800.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '7',
    date: '2026-01-22',
    description: 'Vehicle Fuel - Business Trips',
    amount: -95.5,
    category: 'Travel Expenses',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '8',
    date: '2026-01-25',
    description: 'Hardware & Fixings',
    amount: -145.8,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '9',
    date: '2026-01-28',
    description: 'Client Payment - Bookshelves Installation',
    amount: 1500.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },

  // February 2026
  {
    id: '10',
    date: '2026-02-01',
    description: 'Workshop Rent - February',
    amount: -650.0,
    category: 'Office & Rent',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '11',
    date: '2026-02-05',
    description: 'Client Payment - Office Renovation',
    amount: 6500.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '12',
    date: '2026-02-08',
    description: 'Timber & Plywood - Large Order',
    amount: -1250.0,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '13',
    date: '2026-02-12',
    description: 'Workshop Safety Equipment',
    amount: -180.0,
    category: 'Equipment',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '14',
    date: '2026-02-15',
    description: 'Vehicle Service & Maintenance',
    amount: -220.0,
    category: 'Vehicle Costs',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '15',
    date: '2026-02-18',
    description: 'Client Payment - Custom Wardrobe',
    amount: 3800.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '16',
    date: '2026-02-20',
    description: 'Paint & Finishing Materials',
    amount: -165.5,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '17',
    date: '2026-02-22',
    description: 'Business Cards & Advertising',
    amount: -85.0,
    category: 'Marketing',
    status: 'categorized',
    taxDeductible: true,
  },
  {
    id: '18',
    date: '2026-02-25',
    description: 'Vehicle Fuel - Business Trips',
    amount: -110.0,
    category: 'Travel Expenses',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '19',
    date: '2026-02-28',
    description: 'Client Payment - Garden Deck Construction',
    amount: 5200.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },

  // March 2026
  {
    id: '20',
    date: '2026-03-02',
    description: 'Workshop Rent - March',
    amount: -650.0,
    category: 'Office & Rent',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '21',
    date: '2026-03-05',
    description: 'Client Payment - Home Office Built-ins',
    amount: 4800.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '22',
    date: '2026-03-10',
    description: 'Hardwood & Oak Materials',
    amount: -1100.0,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '23',
    date: '2026-03-15',
    description: 'Client Payment - Kitchen Island',
    amount: 3200.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '24',
    date: '2026-03-20',
    description: 'Vehicle Fuel & Maintenance',
    amount: -180.0,
    category: 'Travel Expenses',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '25',
    date: '2026-03-25',
    description: 'Client Payment - Entertainment Unit',
    amount: 2900.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },

  // April 2026
  {
    id: '26',
    date: '2026-04-01',
    description: 'Workshop Rent - April',
    amount: -650.0,
    category: 'Office & Rent',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '27',
    date: '2026-04-05',
    description: 'Client Payment - Large Commercial Project',
    amount: 9500.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '28',
    date: '2026-04-08',
    description: 'Premium Wood Materials - Bulk Order',
    amount: -1800.0,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '29',
    date: '2026-04-12',
    description: 'Professional Insurance - Quarterly',
    amount: -280.0,
    category: 'Professional Fees',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '30',
    date: '2026-04-18',
    description: 'New Router & Sanding Equipment',
    amount: -520.0,
    category: 'Equipment',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '31',
    date: '2026-04-25',
    description: 'Client Payment - Bedroom Furniture Set',
    amount: 5600.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },

  // May 2026
  {
    id: '32',
    date: '2026-05-01',
    description: 'Workshop Rent - May',
    amount: -650.0,
    category: 'Office & Rent',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '33',
    date: '2026-05-06',
    description: 'Client Payment - Staircase Renovation',
    amount: 7200.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '34',
    date: '2026-05-10',
    description: 'Specialized Wood & Veneers',
    amount: -980.5,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '35',
    date: '2026-05-15',
    description: 'Client Payment - Outdoor Furniture',
    amount: 3800.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '36',
    date: '2026-05-20',
    description: 'Marketing Materials & Website',
    amount: -150.0,
    category: 'Marketing',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '37',
    date: '2026-05-28',
    description: 'Vehicle Service',
    amount: -200.0,
    category: 'Vehicle Costs',
    status: 'verified',
    taxDeductible: true,
  },

  // June 2026
  {
    id: '38',
    date: '2026-06-02',
    description: 'Workshop Rent - June',
    amount: -650.0,
    category: 'Office & Rent',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '39',
    date: '2026-06-05',
    description: 'Client Payment - Restaurant Interior',
    amount: 11500.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '40',
    date: '2026-06-10',
    description: 'Commercial Grade Materials',
    amount: -2100.0,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '41',
    date: '2026-06-15',
    description: 'Workshop Ventilation Upgrade',
    amount: -450.0,
    category: 'Equipment',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '42',
    date: '2026-06-18',
    description: 'Client Payment - Library Shelving',
    amount: 4100.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '43',
    date: '2026-06-25',
    description: 'Finishing Supplies & Hardware',
    amount: -285.0,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '44',
    date: '2026-06-28',
    description: 'Vehicle Fuel - Business Trips',
    amount: -125.0,
    category: 'Travel Expenses',
    status: 'verified',
    taxDeductible: true,
  },
]

type GetDemoChartDataParams = {
  isDemoMode: boolean
  transactions: any[]
  isMobile: boolean
  isDarkMode: boolean
}

export const getDemoChartData = ({ isDemoMode, isMobile, transactions }: GetDemoChartDataParams): ChartData => {
  const barThickness = calculateBarThickness(isDemoMode, transactions, isMobile)

  const dataset: ChartDataset<'bar'> = {
    type: 'bar',
    label: 'Transactions',
    data: DEMO_TRANSACTIONS.map((row) => row.amount),
    backgroundColor: (context) => {
      const value = context.parsed?.y ?? 0
      const isPositive = value >= 0

      return getGradient({
        context: context as any,
        colors: {
          start: isPositive ? green[100] : red[200],
          end: isPositive ? green[600] : red[900],
        },
        direction: 'vertical',
      })
    },
    borderRadius: (context) => {
      const value = context.parsed?.y ?? 0
      const isPositive = value >= 0

      return isPositive
        ? { topLeft: 100, topRight: 100, bottomLeft: 0, bottomRight: 0 }
        : { topLeft: 0, topRight: 0, bottomLeft: 100, bottomRight: 100 }
    },
    barThickness,
    order: 2,
  }

  return {
    labels: DEMO_TRANSACTIONS.map((row) => row.date),
    datasets: [dataset],
  }
}
