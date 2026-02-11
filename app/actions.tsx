import { CloudOff, LockOutlined, PersonOffOutlined } from '@mui/icons-material'

export const CARD_ITEMS = [
  {
    Icon: LockOutlined,
    title: '100% on-device',
    description: 'All parsing and storage happens in your browser. Your data never touches a server.',
  },
  {
    Icon: CloudOff,
    title: 'Works offline',
    description: 'Once loaded, the app works with no internet connection at all.',
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
