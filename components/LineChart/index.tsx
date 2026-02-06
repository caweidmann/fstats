import type { ChartProps } from 'react-chartjs-2'
import { Line } from 'react-chartjs-2'

const Component = ({ ...rest }: ChartProps<'line'>) => {
  return <Line {...rest} />
}

export default Component
