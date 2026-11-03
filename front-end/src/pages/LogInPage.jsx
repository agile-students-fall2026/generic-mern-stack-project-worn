import { Button, PageHeader } from '../components'
import { useAuth } from '../context/authContext'

export default function LogInPage() {
  const { logIn } = useAuth()

  return (
    <main className="mx-auto min-h-dvh max-w-md bg-white">
      <PageHeader title="Log in" />
      <div className="space-y-4 px-4">
        <p className="text-sm text-stone-500">
          Demo access while account login is being built.
        </p>
        <Button fullWidth onClick={logIn}>Enter demo closet</Button>
      </div>
    </main>
  )
}
