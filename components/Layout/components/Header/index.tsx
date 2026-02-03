import MainMenu from '../MainMenu'

type HeaderProps = {
  onMenuClick: VoidFunction
}

const Component = ({ onMenuClick }: HeaderProps) => {
  return <MainMenu onMenuClick={onMenuClick} />
}

export default Component
