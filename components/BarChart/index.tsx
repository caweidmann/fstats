import type { ChartProps } from 'react-chartjs-2'
import { Bar } from 'react-chartjs-2'

const Component = ({ ...rest }: ChartProps<'bar'>) => {
  return <Bar {...rest} />
}

export default Component
