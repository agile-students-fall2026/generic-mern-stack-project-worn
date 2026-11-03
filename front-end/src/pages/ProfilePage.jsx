import { Button, PageHeader } from '../components'
import { useAuth } from '../context/authContext'

export default function ProfilePage() {
  const { logOut } = useAuth()

  return (
    <main className="pb-8">
      <PageHeader title="Profile" />
      <div className="px-4">
        <Button variant="secondary" fullWidth onClick={logOut}>Log out</Button>
      </div>
    </main>
  )
}
