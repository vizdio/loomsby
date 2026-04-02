import { useAuth } from '../hooks/useAuth'
import { UserSearch } from '../components/pals/UserSearch'
import { PalsList } from '../components/pals/PalsList'
import { APP_STRINGS } from '../lib/constants'

export function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <main className="page">{APP_STRINGS.loading}</main>
  }

  if (!user) {
    return <main className="page">Please login or sign up to continue.</main>
  }

  return (
    <main className="page stack">
      <section className="card stack">
        <h1>{APP_STRINGS.appName}</h1>
        <p>{APP_STRINGS.tagline}</p>
      </section>
      <section className="split">
        <UserSearch currentUserId={user.id} />
        <PalsList userId={user.id} />
      </section>
    </main>
  )
}
