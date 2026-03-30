import { LockOutlined, PersonOffOutlined, Public } from '@mui/icons-material'

export const CARD_ITEMS = [
  {
    Icon: LockOutlined,
    title: '100% on-device',
    description: 'All parsing and storage happens in your browser. Your data never touches a server.',
  },
  {
    Icon: Public,
    title: 'Runs in your browser',
    description: 'Use it like a normal website while your data still stays on your device.',
  },
  {
    Icon: PersonOffOutlined,
    title: 'No account needed',
    description: 'No sign-up, no login, no cloud sync. Everything stays local.',
  },
]

export const STEPS = [
  {
    step: 1,
    title: 'Add your files',
    description: 'Drag & drop or browse for your bank statements',
  },
  {
    step: 2,
    title: 'Click "Continue"',
    description: 'Files are automatically parsed on your device',
  },
  {
    step: 3,
    title: 'View your stats',
    description: 'Gain insights into your spending habits',
  },
]
