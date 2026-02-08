import { green, red } from '@mui/material/colors'
import type { ChartData, ChartDataset } from 'chart.js'

import { getGradient } from '@/utils/Misc'

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

// Demo Profit/Loss Data (calculated from DEMO_TRANSACTIONS - Carpenter Business Jan-Feb 2026)
export const DEMO_PROFIT_LOSS: ProfitLossData = {
  totalIncome: 24000.0, // Sum of all client payments (furniture, renovations, custom work)
  totalExpenses: 5001.8, // Sum of all expenses: workshop rent, materials, tools, vehicle costs
  profit: 18998.2, // 24000 - 5001.8
  taxDeductibleExpenses: 5001.8,
  estimatedTax: 4141.61, // 18998.2 * 0.218
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

// Demo Transactions - 2 Months (January-February 2026) - Carpenter Business
export const DEMO_TRANSACTIONS: TransactionRow[] = [
  // January 2026
  {
    id: '1',
    date: '05/01/2026',
    description: 'Workshop Rent - January',
    amount: -650.0,
    category: 'Office & Rent',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '2',
    date: '08/01/2026',
    description: 'Client Payment - Custom Kitchen Cabinets',
    amount: 4200.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '3',
    date: '10/01/2026',
    description: 'Wood & Materials - Supplier',
    amount: -850.0,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '4',
    date: '12/01/2026',
    description: 'Professional Insurance - Quarterly',
    amount: -280.0,
    category: 'Professional Fees',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '5',
    date: '15/01/2026',
    description: 'Power Tools - Makita Drill Set',
    amount: -320.0,
    category: 'Equipment',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '6',
    date: '18/01/2026',
    description: 'Client Payment - Wooden Dining Table',
    amount: 2800.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '7',
    date: '22/01/2026',
    description: 'Vehicle Fuel - Business Trips',
    amount: -95.5,
    category: 'Travel Expenses',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '8',
    date: '25/01/2026',
    description: 'Hardware & Fixings',
    amount: -145.8,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '9',
    date: '28/01/2026',
    description: 'Client Payment - Bookshelves Installation',
    amount: 1500.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },

  // February 2026
  {
    id: '10',
    date: '01/02/2026',
    description: 'Workshop Rent - February',
    amount: -650.0,
    category: 'Office & Rent',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '11',
    date: '05/02/2026',
    description: 'Client Payment - Office Renovation',
    amount: 6500.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '12',
    date: '08/02/2026',
    description: 'Timber & Plywood - Large Order',
    amount: -1250.0,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '13',
    date: '12/02/2026',
    description: 'Workshop Safety Equipment',
    amount: -180.0,
    category: 'Equipment',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '14',
    date: '15/02/2026',
    description: 'Vehicle Service & Maintenance',
    amount: -220.0,
    category: 'Vehicle Costs',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '15',
    date: '18/02/2026',
    description: 'Client Payment - Custom Wardrobe',
    amount: 3800.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '16',
    date: '20/02/2026',
    description: 'Paint & Finishing Materials',
    amount: -165.5,
    category: 'Materials',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '17',
    date: '22/02/2026',
    description: 'Business Cards & Advertising',
    amount: -85.0,
    category: 'Marketing',
    status: 'categorized',
    taxDeductible: true,
  },
  {
    id: '18',
    date: '25/02/2026',
    description: 'Vehicle Fuel - Business Trips',
    amount: -110.0,
    category: 'Travel Expenses',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '19',
    date: '28/02/2026',
    description: 'Client Payment - Garden Deck Construction',
    amount: 5200.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
]

type GetDemoChartDataParams = {
  isMobile: boolean
  isDarkMode: boolean
}

export const getDemoChartData = ({ isMobile }: GetDemoChartDataParams): ChartData => {
  const calculateBarThickness = () => {
    const transactionCount = DEMO_TRANSACTIONS.length
    const baseWidth = isMobile ? 300 : 800
    const calculatedThickness = Math.floor(baseWidth / transactionCount)

    const minThickness = isMobile ? 2 : 3
    const maxThickness = isMobile ? 4 : 18

    return Math.max(minThickness, Math.min(maxThickness, calculatedThickness))
  }

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
    barThickness: calculateBarThickness(),
    order: 2,
  }

  return {
    labels: DEMO_TRANSACTIONS.map((row) => row.date),
    datasets: [dataset],
  }
}
