import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation'

import { roboto } from '@/styles/fonts'

export const initChartJS = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    annotationPlugin,
  )
  ChartJS.defaults.font.family = roboto.style.fontFamily
}
