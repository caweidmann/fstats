import {
  RadioButtonChecked as IconRadioButtonChecked,
  RadioButtonUnchecked as IconRadioButtonUnchecked,
} from '@mui/icons-material'

type RadioButtonProps = {
  checked: boolean
}

const Component = ({ checked }: RadioButtonProps) => {
  if (checked) {
    return <IconRadioButtonChecked />
  }
  return <IconRadioButtonUnchecked />
}

export default Component
